/**
 * 内容管线引擎（吸收自 Python content.py；生成动作本身由 AI agent 执行）。
 *
 * - 生成队列 课程根/state/生成队列.md 的读写与 T1/T2 触发
 * - 上下文包组装：agent 生成课程前拿到的全部资产
 * - 质检门：超纲引用检测 / 别名一致性（SymPy 自检脚本门随 Python 引擎退役）
 * - 反馈重生成协议：内容反馈区 → flagged → 重生成条目
 * - gen-exercises：题组过 schema/结构门禁后写入练习区（计数同步 + journal）
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { YAML } from './yaml.ts'
import { todayStr } from './dates.ts'
import { loadNote, saveNote } from './notes.ts'
import { normChoice } from './grading.ts'
import type { GRegion, GNode } from './types.ts'
import type { Graph } from './graph.ts'
import type { Paths } from './paths.ts'
import type { Fm, CourseEntry, JournalRec } from './types.ts'

export const QUEUE_GENERATE = '生成'
export const QUEUE_REGEN = '重生成'

export interface ExerciseMeta {
  ex: number
  q?: string
  answer?: string
  check?: string
  difficulty?: number
  uses?: string[]
  options?: string[]
  tol?: number
}

export class Content {
  constructor(private paths: Paths) {}

  // ---- 生成队列 ----

  private async queueLines(root: string): Promise<string[] | null> {
    const p = this.paths.queuePath(root)
    if (!existsSync(p)) return null
    return (await readFile(p, 'utf8')).split('\n')
  }

  async queueInit(root: string): Promise<void> {
    const p = this.paths.queuePath(root)
    if (existsSync(p)) return
    await mkdir(this.paths.courseStateDir(root), { recursive: true })
    await writeFile(p, '# 生成队列\n\n> 待生成/待重生成清单。引擎自动维护，人可编辑；完成条目打勾即止。\n', 'utf8')
  }

  /** 入队一条任务；同节点同 kind 未完成条目不重复。 */
  async queueAdd(root: string, kind: string, node: string, reason: string, priority = '中'): Promise<boolean> {
    await this.queueInit(root)
    const lines = (await this.queueLines(root))!
    for (const ln of lines) {
      if (ln.startsWith('- [ ]') && ln.includes(`${kind}：${node}`)) return false
    }
    lines.push(`- [ ] ${kind}：${node} ｜ ${reason} ｜ 优先：${priority}`)
    await writeFile(this.paths.queuePath(root), lines.join('\n').replace(/\n+$/, '') + '\n', 'utf8')
    return true
  }

  /** 解析生成队列未完成项 → [{kind, node, reason, priority}]。 */
  async queueItems(root: string): Promise<Array<{ kind: string; node: string; reason: string; priority: string }>> {
    const items = []
    for (const ln of (await this.queueLines(root)) ?? []) {
      const m = ln.match(/^- \[ \] (生成|重生成)：(.+?) ｜ (.*?) ｜ 优先：(.+)$/)
      if (m) items.push({ kind: m[1], node: m[2], reason: m[3], priority: m[4] })
    }
    return items
  }

  /** apply 落盘后勾掉该节点的未完成条目。 */
  async queueDone(root: string, node: string): Promise<boolean> {
    const lines = await this.queueLines(root)
    if (!lines) return false
    let changed = false
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^- \[ \] (生成|重生成)：(.+?) ｜/)
      if (m && m[2] === node) {
        lines[i] = '- [x] ' + lines[i].slice('- [ ] '.length)
        changed = true
      }
    }
    if (changed) await writeFile(this.paths.queuePath(root), lines.join('\n'), 'utf8')
    return changed
  }

  /** T1/T2 触发：返回 (触发类型, 节点) 列表。 */
  async onStageChange(
    root: string, graph: Graph, state: Record<string, Fm>, node: string, newStage: Fm['stage'],
  ): Promise<Array<['T1' | 'T2', string]>> {
    if (!['learning', 'review', 'mastered'].includes(newStage)) return []
    const added: Array<['T1' | 'T2', string]> = []
    const done = new Set(Object.entries(state).filter(([, f]) => f.stage === 'review' || f.stage === 'mastered').map(([n]) => n))
    done.add(node)
    for (const x of graph.succ[node] ?? []) {
      const xs = state[x]?.stage
      if (xs === 'learning' || xs === 'review' || xs === 'mastered') continue
      const pres = graph.preOf[x].filter(p => !graph.opt.has(p))
      const missing = pres.filter(p => !done.has(p))
      if (!missing.length) {
        if (await this.queueAdd(root, QUEUE_GENERATE, x, `触发：${node} 完成后解锁`, '高')) added.push(['T2', x])
      } else if (missing.length === 1 && missing[0] === node) {
        if (await this.queueAdd(root, QUEUE_GENERATE, x, `触发：${node} 的最后前置进入学习`, '中')) added.push(['T1', x])
      }
    }
    return added
  }

  // ---- 上下文包 ----

  /** 组装生成上下文包 → Markdown 文本。 */
  contextPack(graph: Graph, state: Record<string, Fm>, node: string, course?: string): string {
    const [, region, block] = graph.blockOf[node]
    const pres = graph.preOf[node]
    const succs = graph.succ[node] ?? []
    const enc = graph.encOf[node] ?? []
    const dSelf = graph.depth[node] ?? 0
    const out: string[] = []
    out.push(`# 生成上下文包：${node}`, '')
    out.push('## 1. 目标节点')
    out.push(`- 名称：${node} ｜ 区/块：${region} · ${block} ｜ 深度：${dSelf}`)
    out.push(`- pre：${pres.length ? pres.join('、') : '（无，根节点）'}`)
    if (graph.noteOf[node]) out.push(`- note：${graph.noteOf[node]}`)
    out.push('')
    out.push('## 2. 前置摘要（不要重复讲已教内容；下列结论可直接引用）')
    for (const p of pres) {
      const fm = state[p]
      if (fm && fm.content.version > 0) {
        out.push(`- **${p}**（已生成）：讲过（详见其课程文件）`)
      } else {
        const note = graph.noteOf[p]
        out.push(`- **${p}**（未生成${note ? `，note：${note}` : ''}）`)
      }
    }
    out.push('')
    out.push('## 3. 后继预告（本课结尾埋衔接钩子）')
    out.push(succs.length ? succs.join('、') : '（无后继，终点节点）')
    out.push('')
    out.push('## 4. 领域边界')
    const scope = `本课属于${course ? `课程「${course}」的` : ''}`
    out.push(`${scope}「${region} · ${block}」区块。只讲本节点范围内的内容；后继节点只作「承上启下」的一句话钩子，不展开、不提前教。`)
    const forbidden = Object.keys(graph.nset)
      .filter(n => n !== node && n.length >= 2 && (graph.depth[n] ?? 0) > dSelf)
      .sort((a, b) => (graph.depth[b] ?? 0) - (graph.depth[a] ?? 0))
      .slice(0, 200)
    out.push('')
    out.push('## 5. 禁止使用的概念（未学，不得出现、不得引用其结论）')
    out.push(forbidden.length ? forbidden.join('、') : '（无：本节点已是图内最深）')
    out.push('')
    out.push('## 6. 规范约束')
    out.push('- 别名统一表：鸽巢原理（非抽屉原理）、勾股定理（非毕达哥拉斯定理）、余弦定理（非阿尔·卡西定理）——完整表见 理念与规范.md §8')
    out.push('- 风格：成人自学者；直觉先于严格、具体先于抽象、技能先于形式化')
    out.push('- 篇幅：正文 ≤ 2500 字；练习 基础 2–4 / 变式 2–3 / 挑战 0–2')
    out.push('- 模板：为什么需要它/定义与性质/例题/练习/常见误区/承上启下/内容反馈')
    out.push('')
    out.push('## 7. 既有 enc 边（练习必须真实调用它们）')
    out.push(enc.length ? enc.map(([t, w]) => `${t}(w=${w.toFixed(1)})`).join('、') : '（暂无）')
    out.push('')
    out.push('## 8. 交付要求')
    out.push('- 练习题以题组 YAML 经 learnhub_exercises_gen 写入（不再直接写进正文练习区）；数值题给 tol 容差')
    out.push('- 题型优先 single_choice / true_false / fill_in_blank（可机器判卷）；开放性问答题用 reflection 并在 answer 写评分要点')
    out.push('- 末尾机器块：`<!-- enc_candidates: [本课练习真实调用的前置技能] -->`')
    return out.join('\n') + '\n'
  }

  // ---- 提示词模板 ----

  static readonly PROMPT_KINDS: Record<string, string> = {
    课程生成: `\
# 课程生成提示词（用户可编辑；生成时上下文包自动附在本模板之后）

你是 learnhub 学习系统的课程写手。根据附后的上下文包，为「目标节点」写一节课程笔记。

## 硬约束（违反即返工）

1. 只用前置已教概念与常识；「禁止使用的概念」一节列出的名称不得出现，也不得引用其结论。
2. 不超出「领域边界」声明的区块范围；后继只在「承上启下」里一句话带过。
3. 篇幅 ≤ 2500 字；小节顺序：为什么需要它 / 定义与性质 / 例题 / 常见误区 / 承上启下 / 内容反馈。
4. 别名按「规范约束」统一；图片用 \`![[<课程根>/课程图/xx.png]]\`，示意图可用 \`\`\`mermaid 代码块。

## 输出

只输出课程笔记正文（不含 frontmatter），不要附加解释。
`,
    题目生成: `\
# 题目生成提示词（用户可编辑；节点正文由系统附在本模板之后）

你是 learnhub 学习系统的出题老师。根据附后的节点正文出一组练习题，覆盖正文的核心概念、易错点与典型应用。

## 硬约束

1. 题型必须多样且只用这三种：单选（single_choice）、判断（true_false）、填空（fill_in_blank），每种至少一道，不要全出同一题型。
2. 难度递进：开头 1-2 道概念辨析（difficulty: 1），中间应用与计算（difficulty: 2），收尾 1-2 道综合或易错陷阱（difficulty: 3）。
3. 每题必须给全：题干、答案、解析（说明为什么对、错误选项错在哪）。
4. 只考正文里讲过的内容，不得引入正文没有的概念、记号或结论。
5. 选择题 options 不带 A./B. 编号前缀（系统自动编号）；填空题 answer 用数组列出所有可接受写法；node 字段原样照抄系统给出的节点名。

## 输出

只输出一个 YAML 文档（不要代码围栏、不要任何解释），结构如下：

node: <节点名>
questions:
  - id: q1
    kind: single_choice
    q: 题干
    options: ["选项一", "选项二", "选项三", "选项四"]
    answer: A
    explanation: 解析
    difficulty: 1
    uses: [用到的前置概念]
`,
  }

  /** 读提示词模板；不存在时写入内置默认。 */
  async loadPrompt(kind: string): Promise<string> {
    const builtin = Content.PROMPT_KINDS[kind]
    if (!builtin) throw new Error(`[prompt] 未知提示词类型: ${kind}（可选：${Object.keys(Content.PROMPT_KINDS).join('、')}）`)
    await mkdir(this.paths.promptDir, { recursive: true })
    const p = `${this.paths.promptDir}/${kind}.md`
    if (!existsSync(p)) await writeFile(p, builtin, 'utf8')
    return readFile(p, 'utf8')
  }

  // ---- 质检门 ----

  /** 解析课程理念与规范.md §8 别名表 → {不采用名: 采用名}。 */
  private async aliasTable(root: string): Promise<Record<string, string>> {
    const p = `${this.paths.courseRoot(root)}/理念与规范.md`
    const table: Record<string, string> = {}
    if (!existsSync(p)) return table
    let inSection = false
    for (const line of (await readFile(p, 'utf8')).split('\n')) {
      if (line.startsWith('## 8.')) {
        inSection = true
        continue
      }
      if (inSection && line.startsWith('## ')) break
      if (inSection && line.startsWith('|') && !line.includes('采用名') && !line.includes('---')) {
        const cells = line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())
        if (cells.length >= 2 && cells[0] && cells[1]) table[cells[1]] = cells[0]
      }
    }
    return table
  }

  private stripRoadmapSections(body: string): string {
    const out: string[] = []
    let skip = false
    for (const ln of body.split('\n')) {
      if (ln.startsWith('## ')) skip = ln.trim().startsWith('## 承上启下') || ln.trim().startsWith('## 内容反馈')
      if (!skip) out.push(ln)
    }
    return out.join('\n')
  }

  /** 超纲引用检测：正文提到的图内概念深度大于本节点 → 警告。 */
  checkOutOfScope(graph: Graph, node: string, body: string): string[] {
    const checked = this.stripRoadmapSections(body)
    const dSelf = graph.depth[node] ?? 0
    const hits = new Set<string>()
    for (const name of graph.nset) {
      if (name === node || name.length < 2) continue
      if ((graph.depth[name] ?? 0) > dSelf && checked.includes(name)) hits.add(name)
    }
    return [...hits].sort()
  }

  /** 别名一致性：正文出现不采用名 → findings。 */
  async checkAliases(root: string, body: string): Promise<string[]> {
    const table = await this.aliasTable(root)
    return Object.entries(table)
      .filter(([bad]) => body.includes(bad))
      .map(([bad, good]) => `别名不一致: 正文用了「${bad}」，应采用「${good}」`)
  }

  /** 跑全部可自动化的质检门 → (passed, findings, warns)。 */
  async gateReport(graph: Graph, root: string, node: string, body: string): Promise<{ passed: boolean; findings: string[]; warns: string[] }> {
    const findings: string[] = []
    const warns: string[] = []
    const oos = this.checkOutOfScope(graph, node, body)
    if (oos.length) warns.push(`超纲引用（引用了更深的未学概念）: ${oos.join('、')}`)
    findings.push(...(await this.checkAliases(root, body)))
    const usesMarked = /<!--\s*ex:\d+/.test(body) && /uses:\s*\[[^\]]/.test(body)
    if (!usesMarked) warns.push('练习元数据缺少 uses 标注（一期尽力标注，建议补上）')
    return { passed: !findings.length, findings, warns }
  }

  // ---- 练习区 ----

  /** 解析练习元数据行 → [{ex, answer, check, difficulty, uses, options?, tol?}]。 */
  static practiceMeta(body: string): ExerciseMeta[] {
    const out: ExerciseMeta[] = []
    for (const m of body.matchAll(/<!--\s*ex:(\d+)\s*\|([^>]*)-->/g)) {
      const fields: ExerciseMeta = { ex: Number(m[1]) }
      for (const part of m[2].split('|')) {
        const p = part.trim()
        const ci = p.indexOf(':')
        if (ci < 0) continue
        const k = p.slice(0, ci).trim()
        const v = p.slice(ci + 1).trim()
        if (k === 'uses') {
          fields.uses = v.replace(/^\[|\]$/g, '').split(',').map(x => x.trim().replace(/^["']|["']$/g, '').trim()).filter(Boolean)
        } else if (k === 'difficulty') {
          fields.difficulty = /^\d+$/.test(v) ? Number(v) : 1
        } else if (k === 'options') {
          fields.options = v.split('；').map(x => x.trim()).filter(Boolean)
        } else if (k === 'tol') {
          const n = Number(v)
          if (Number.isFinite(n)) fields.tol = n
        } else {
          ;(fields as Record<string, unknown>)[k] = v
        }
      }
      out.push(fields)
    }
    return out
  }

  /** 解析 enc 候选机器块 → [节点名]。 */
  static encCandidates(body: string): string[] {
    const m = body.match(/<!--\s*enc_candidates:\s*\[([^\]]*)\]\s*-->/)
    return m ? m[1].split(',').map(x => x.trim()).filter(Boolean) : []
  }

  /** 题干下方选项行（A. … / A) …）→ ["A. …"]；不足 2 项视为无选项。 */
  private extractOptions(text: string): string[] {
    const opts: string[] = []
    for (const ln of text.split('\n')) {
      const s = ln.trim()
      if (/^[A-Z][.、．)）]/.test(s)) {
        opts.push(s)
        continue
      }
      if (opts.length) break
    }
    return opts.length >= 2 ? opts : []
  }

  /** 练习区容错归一化 → (new_body, changed)。 */
  normalizePractice(body: string): { body: string; changed: boolean } {
    const m = body.match(/## 练习\s*\n([\s\S]*?)(?=\n## |$)/)
    if (!m) return { body, changed: false }
    const head = m[0].slice(0, m[0].length - m[1].length)
    const sec = m[1]
    const metas = [...sec.matchAll(/<!--\s*ex:\d+\s*\|([^>]*)-->/g)]
    if (!metas.length) return { body, changed: false }
    const out: string[] = []
    let changed = false
    let prevEnd = 0
    metas.forEach((mm, i) => {
      out.push(sec.slice(prevEnd, mm.index))
      prevEnd = mm.index! + mm[0].length
      const fields: Record<string, string> = {}
      const order: string[] = []
      for (const part of mm[1].split('|')) {
        const p = part.trim()
        const ci = p.indexOf(':')
        if (ci < 0) continue
        const k = p.slice(0, ci).trim()
        if (!(k in fields)) order.push(k)
        fields[k] = p.slice(ci + 1).trim()
      }
      if (fields.check === 'choice' && !fields.options) {
        const qEnd = i < metas.length - 1 ? metas[i + 1].index! : sec.length
        const opts = this.extractOptions(sec.slice(prevEnd, qEnd))
        if (opts.length) {
          fields.options = opts.join('；')
          if (!order.includes('options')) order.unshift('options')
          changed = true
        }
      }
      const newLine = `<!-- ex:${i + 1} | ${order.filter(k => k in fields).map(k => `${k}: ${fields[k]}`).join(' | ')} -->`
      if (newLine !== mm[0]) changed = true
      out.push(newLine)
    })
    if (!changed) return { body, changed: false }
    out.push(sec.slice(prevEnd))
    return { body: body.slice(0, m.index) + head + out.join('') + body.slice(m.index! + m[0].length), changed }
  }

  // ---- 反馈与生成落盘 ----

  /** 读课程文件「## 内容反馈」区的用户文字。 */
  async collectFeedback(root: string, graph: Graph, node: string): Promise<string> {
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(root, regionName, node)
    const { body } = await loadNote(path)
    const m = body.match(/## 内容反馈\s*\n([\s\S]*?)(?=\n## |$)/)
    if (!m) return ''
    return m[1].replace(/<!--[\s\S]*?-->/g, '').replace(/^（[\s\S]*?）$/m, '').trim()
  }

  /** 标记反馈 → flagged + 重生成入队。返回消息或抛错。 */
  async feedback(root: string, graph: Graph, node: string, noteOf: (n: string) => Fm | undefined, project: (node: string, fm: Fm) => Promise<void>): Promise<string> {
    if (!graph.nset.has(node)) throw new Error(`[feedback] 未知节点: ${node}`)
    const fm = noteOf(node)
    if (!fm) throw new Error(`[feedback] 课程文件不存在: ${node}`)
    const text = await this.collectFeedback(root, graph, node)
    if (!text) throw new Error('[feedback] 「内容反馈」区为空——先写下问题与建议再运行本命令。')
    const next = { ...fm, content: { ...fm.content, status: 'flagged' as const } }
    await project(node, next)
    const brief = text.split(/\s+/).join(' ').slice(0, 40)
    await this.queueAdd(root, QUEUE_REGEN, node, `反馈：${brief}`, `版本：${fm.content.version}→${fm.content.version + 1}`)
    return `[feedback] 已标记 flagged 并入重生成队列：${node}（反馈：${brief}…）`
  }

  /** 写入生成内容：version+1，status=draft 待人审（frontmatter + journal）。 */
  async applyGeneration(
    root: string, graph: Graph, node: string, body: string,
    fmOf: (node: string) => Fm | undefined,
    journal: (rec: Omit<JournalRec, 'ts'>) => Promise<unknown>,
  ): Promise<number> {
    const fm = fmOf(node)
    if (!fm) throw new Error(`[apply] 课程文件不存在（先为节点生成内容骨架）: ${node}`)
    const version = fm.content.version + 1
    const next: Fm = {
      ...fm,
      content: { version, generated_at: todayStr(), status: 'draft' },
    }
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(root, regionName, node)
    await saveNote(path, next as unknown as Record<string, unknown>, body)
    await journal({ course: '', node, rating: null, kind: 'content_apply', elapsed_days: 0, detail: `正文 v${version} 落盘（status=draft）` })
    return version
  }

  /** 人审通过 → content.status=reviewed。 */
  async review(root: string, graph: Graph, node: string, fmOf: (n: string) => Fm | undefined, project: (node: string, fm: Fm) => Promise<void>): Promise<string> {
    const fm = fmOf(node)
    if (!fm) throw new Error(`[review] 课程文件不存在: ${node}`)
    const next = { ...fm, content: { ...fm.content, status: 'reviewed' as const } }
    await project(node, next)
    return `[review] ${node} → reviewed（v${fm.content.version}）。`
  }

  // ---- gen-exercises（题组写入练习区；schema 门禁内联） ----

  /** 题组 schema 校验（ExerciseSet 同构，手写以输出与旧引擎一致的中文错误行）。 */
  static validateExerciseSet(doc: unknown): { ok: true; spec: { node: string; mode: 'replace' | 'append'; exercises: ExerciseMeta[] } } | { ok: false; errors: string[] } {
    const errors: string[] = []
    if (typeof doc !== 'object' || doc === null) return { ok: false, errors: ['(顶层): 必须是映射'] }
    const d = doc as Record<string, unknown>
    if (typeof d.node !== 'string' || !d.node.trim()) errors.push('node: 不能为空')
    if (d.mode !== undefined && d.mode !== 'replace' && d.mode !== 'append') errors.push('mode: 只允许 replace/append')
    if (!Array.isArray(d.exercises) || !d.exercises.length) errors.push('exercises: 题组为空')
    const exercises: ExerciseMeta[] = []
    if (Array.isArray(d.exercises)) {
      d.exercises.forEach((raw, i) => {
        const n = i + 1
        if (typeof raw !== 'object' || raw === null) {
          errors.push(`exercises.${n}: 必须是映射`)
          return
        }
        const e = raw as Record<string, unknown>
        if (typeof e.q !== 'string' || !e.q.trim()) errors.push(`exercises.${n}.q: 不能为空`)
        if (typeof e.answer !== 'string' || !e.answer.trim()) errors.push(`exercises.${n}.answer: 不能为空`)
        const check = e.check ?? 'human'
        if (!['sympy', 'choice', 'ai', 'human', 'single_choice', 'true_false', 'fill_in_blank', 'reflection'].includes(String(check))) {
          errors.push(`exercises.${n}.check: 非法类型 ${String(check)}`)
        }
        let difficulty = 1
        if (e.difficulty !== undefined) {
          const dv = Number(e.difficulty)
          if (!Number.isInteger(dv) || dv < 1 || dv > 3) errors.push(`exercises.${n}.difficulty: 必须是 1-3`)
          else difficulty = dv
        }
        const uses = Array.isArray(e.uses) ? e.uses.map(String) : []
        const options = Array.isArray(e.options) ? e.options.map(String) : []
        let tol: number | undefined
        if (e.tol !== undefined) {
          const tv = Number(e.tol)
          if (!(tv > 0)) errors.push(`exercises.${n}.tol: 必须是正数`)
          else tol = tv
        }
        exercises.push({ ex: n, q: String(e.q ?? ''), answer: String(e.answer ?? ''), check: String(check), difficulty, uses, options, tol })
      })
    }
    if (errors.length) return { ok: false, errors }
    return {
      ok: true,
      spec: {
        node: (d.node as string).trim(),
        mode: (d.mode as 'replace' | 'append') ?? 'replace',
        exercises,
      },
    }
  }

  /** 手动插队（T3）。 */
  async queueManual(root: string, node: string): Promise<string> {
    const ok = await this.queueAdd(root, QUEUE_GENERATE, node, '触发：手动插队（T3）', '高')
    return `[queue] ${node}${ok ? ' 已入队' : ' 已在队列中'}`
  }
}

/** 类型再导出（引擎内其它模块消费）。 */
export type { GRegion, GNode }
