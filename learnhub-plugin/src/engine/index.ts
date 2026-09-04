/**
 * TS 学习引擎门面（learnhub-plugin/src/engine）。
 *
 * 职责边界（D14 修订版）：一切数据访问收口本门面背后的 engine/ 模块；工具、
 * HTTP 路由、UI 不得绕过 engine 直写数据文件。
 *
 * 数据主权（v3）：课程笔记 frontmatter = 调度状态唯一事实源；data/*.yaml =
 * 图结构唯一事实源；state/ 只承载追加型流水（journal/practice JSONL）与
 * 人审产物（proposals.json / snapshots/）。无 SQLite，无投影回写。
 */
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rename } from 'node:fs/promises'
import { Paths } from './paths.ts'
import { Registry } from './registry.ts'
import { Store } from './store.ts'
import { GraphStore, Graph, writeReadyList } from './graph.ts'
import { stateMap, loadNote, saveNote, defaultFrontmatter, asFm } from './notes.ts'
import { getScheduler, applyRatingBlock } from './srs.ts'
import { runAudit, effectiveStage } from './audit.ts'
import { analyzeGraph } from './analysis.ts'
import { Content } from './content.ts'
import { GraphProposals } from './gengraph.ts'
import { QuestionBank } from './question-bank.ts'
import { YAML } from './yaml.ts'
import { Sessions } from './sessions.ts'
import { todayStr, nowIso } from './dates.ts'
import { REFLECTION_GRADING_SYSTEM, parseReflectionGrading, evaluateAllo, PASS_SCORE, applyPracticeEvidence } from './grading.ts'
import type { CourseEntry, Fm, FsrsBlock } from './types.ts'

export interface EngineConfig {
  /** vault 根目录绝对路径（必填）。 */
  vault: string
  /** 学习中心相对 vault 的路径（缺省「学习中心」）。 */
  centerRel?: string
}

export class LearnhubEngine {
  readonly paths: Paths
  readonly registry: Registry
  readonly store: Store
  readonly content: Content
  readonly proposals: GraphProposals
  readonly bank: QuestionBank
  readonly sessions: Sessions

  constructor(config: EngineConfig) {
    const centerRel = (config.centerRel ?? '学习中心').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
    const centerRoot = `${config.vault}/${centerRel}`
    this.paths = new Paths(centerRoot)
    this.registry = new Registry(this.paths)
    this.store = new Store(this.paths)
    this.content = new Content(this.paths)
    this.bank = new QuestionBank(this.paths)
    this.proposals = new GraphProposals(this.paths, this.store, this.registry, centerRoot)
    this.sessions = new Sessions(this.paths, async course => this.loadView(course))
  }

  // ---- 加载与解析 ----

  /** 单课完整视图：图 + frontmatter 状态（每次现读，文件量小，天然最新）。 */
  async loadView(course: { name: string; root: string }): Promise<{ graph: Graph; state: Record<string, Fm>; broken: string[] }> {
    const store = new GraphStore(this.paths, this.paths.courseRoot(course.root))
    const regions = await store.load()
    const graph = new Graph(regions)
    const { state, broken } = await stateMap(this.paths.courseDir(course.root))
    return { graph, state, broken }
  }

  async enabledCourses(): Promise<CourseEntry[]> {
    return this.registry.enabled()
  }

  async resolveCourse(key?: string): Promise<CourseEntry> {
    return this.registry.resolve(key)
  }

  /** 跨课定位节点：「课程/节点」直接命中；否则在启用课程中搜唯一命中。 */
  async locateNode(nodeSpec: string): Promise<{ course: CourseEntry; node: string }> {
    if (nodeSpec.includes('/')) {
      const [cname, node] = nodeSpec.split('/', 2)
      const c = await this.registry.get(cname.trim())
      if (!c) throw new Error(`[learnhub] 注册表中没有课程「${cname.trim()}」。`)
      return { course: c, node: node.trim() }
    }
    const hits: CourseEntry[] = []
    for (const c of await this.enabledCourses()) {
      const { graph } = await this.loadView(c)
      if (graph.nset.has(nodeSpec)) hits.push(c)
    }
    if (!hits.length) throw new Error(`[learnhub] 启用课程中找不到节点「${nodeSpec}」。`)
    if (hits.length > 1) throw new Error(`[learnhub] 节点「${nodeSpec}」在多门课程中存在，请用「课程/节点」指定：${hits.map(h => h.name).join('、')}`)
    return { course: hits[0], node: nodeSpec }
  }

  /** 无笔记节点补占位文件（保证 frontmatter 始终可查）。 */
  private async ensureNote(root: string, graph: Graph, node: string): Promise<Fm> {
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(root, regionName, node)
    const fm = defaultFrontmatter(node)
    await saveNote(path, fm as unknown as Record<string, unknown>, '> 内容待生成。\n')
    return fm
  }

  // ---- status / recommend ----

  async statusJson(): Promise<Record<string, unknown>> {
    const bankDue = await this.bankDueAll()
    return this.sessions.statusJson(await this.enabledCourses(), bankDue)
  }

  async recommend(limit = 5): Promise<Record<string, unknown>> {
    const bankDue = await this.bankDueAll()
    const events = await this.sessions.recommendEvents(await this.enabledCourses(), bankDue, todayStr(), limit)
    return { date: todayStr(), events }
  }

  /** 全部启用课程的题库到期聚合：node 级最小题目 due（复习队列的数据源）。 */
  private async bankDueAll(): Promise<Map<string, Array<{ node: string; due: string; count: number }>>> {
    const out = new Map<string, Array<{ node: string; due: string; count: number }>>()
    const today = todayStr()
    for (const c of await this.enabledCourses()) {
      const items: Array<{ node: string; due: string; count: number }> = []
      let files: string[] = []
      try {
        files = await readdir(this.paths.bankDir(c.root))
      } catch {
        out.set(c.name, items)
        continue
      }
      for (const f of files.filter(f => f.endsWith('.yaml'))) {
        const node = f.replace(/\.yaml$/, '')
        const bank = await this.bank.load(this.paths.courseRoot(c.root), node)
        const dues = bank.questions
          .filter(q => !q.archived && q.fsrs?.reps && q.fsrs.due <= today)
          .map(q => q.fsrs!.due)
        if (dues.length) items.push({ node, due: dues.sort()[0], count: dues.length })
      }
      out.set(c.name, items)
    }
    return out
  }

  // ---- doctor（fm schema 对账） ----

  async doctor(): Promise<Record<string, unknown>> {
    const courses = []
    for (const c of await this.enabledCourses()) {
      const { graph, state, broken } = await this.loadView(c)
      const missing = graph.names.filter(n => !state[n])
      const unknown = Object.keys(state).filter(n => !graph.nset.has(n))
      courses.push({ course: c.name, total: graph.names.length, notes: Object.keys(state).length, broken, missing, unknown })
    }
    return { generated_at: nowIso(), courses }
  }

  // ---- rebuild（audit + 就绪清单） ----

  async rebuild(courseKey?: string): Promise<{ message: string }> {
    const targets = courseKey ? [await this.registry.resolve(courseKey)] : await this.enabledCourses()
    const lines: string[] = []
    let failed = false
    for (const c of targets) {
      const { graph, state } = await this.loadView(c)
      const regions = graph.regions
      const audit = await runAudit(this.paths, c.root, c.name, graph, regions)
      if (audit.failed) failed = true
      lines.push(`[${c.name}] 审计：ERROR ${audit.errors.length} | WARN ${audit.warns.length} | INFO ${audit.infos.length}${audit.failed ? '（阻断）' : ''}`)
      const done = new Set(Object.entries(state).filter(([, f]) => ['review', 'mastered', 'skipped'].includes(f.stage)).map(([n]) => n))
      await writeReadyList(this.paths, c.root, graph, done)
    }
    if (failed) throw new Error(`[rebuild] 审计存在 ERROR：\n${lines.join('\n')}`)
    return { message: `[rebuild] 完成：\n${lines.join('\n')}` }
  }

  // ---- graph analyze ----

  async graphAnalyze(courseKey?: string, elementsOnly = false): Promise<Record<string, unknown>> {
    const c = await this.registry.resolve(courseKey)
    const { graph, state } = await this.loadView(c)
    const doc = await analyzeGraph(c.name, graph, state, this.store)
    if (elementsOnly) return { nodes: doc.nodes, edges: doc.edges }
    return doc
  }

  // ---- 提案门禁包装（apply 前 audit 拦截） ----

  async graphPropose(kind: 'gen' | 'edit', yamlText: string): Promise<Record<string, unknown>> {
    return kind === 'edit' ? this.proposals.proposeEdit(yamlText) : this.proposals.proposeGen(yamlText)
  }

  async graphApply(kind: 'gen' | 'edit', pid?: number): Promise<Record<string, unknown>> {
    // audit 门禁：目标课程存在 ERROR 时拒绝 apply
    const pending = await this.store.takePending(kind, pid)
    const course = await this.registry.get(pending.course)
    let auditOk = true
    if (course) {
      const { graph } = await this.loadView(course)
      const audit = await runAudit(this.paths, course.root, course.name, graph, graph.regions)
      auditOk = !audit.failed
    }
    return kind === 'edit' ? this.proposals.applyEdit(pid, auditOk) : this.proposals.applyGen(pid, auditOk)
  }

  async graphReject(pid: number, note = ''): Promise<Record<string, unknown>> {
    return this.proposals.reject(pid, note)
  }

  async graphProposals(status?: string, kind?: string): Promise<Record<string, unknown>[]> {
    return this.proposals.list(status, kind)
  }

  // ---- 内容管线 ----

  async contentPack(courseKey: string | undefined, node: string): Promise<string> {
    const c = await this.registry.resolve(courseKey)
    const { graph, state } = await this.loadView(c)
    return this.content.contextPack(graph, state, node, c.name)
  }

  async loadPrompt(kind: string): Promise<string> {
    return this.content.loadPrompt(kind)
  }

  /** 生成落盘门：gate_report → applyGeneration（version+1, draft）。
   * 节点笔记不存在时先建骨架（allo on-demand 语义：大纲即时、正文按需落盘）。 */
  async contentApply(courseKey: string | undefined, node: string, body: string): Promise<{ version: number; message: string }> {
    const c = await this.registry.resolve(courseKey)
    const { graph, state } = await this.loadView(c)
    if (!graph.nset.has(node)) throw new Error(`[apply] 节点「${node}」不在图内。`)
    if (!state[node]) await this.ensureNote(c.root, graph, node)
    const gate = await this.content.gateReport(graph, c.root, node, body)
    if (!gate.passed) {
      throw new Error(`[apply] 质检门未过：\n${gate.findings.map(e => `  ✗ ${e}`).join('\n')}\n${gate.warns.map(w => `  ⚠ ${w}`).join('\n')}`)
    }
    const normalized = this.content.normalizePractice(body)
    const version = await this.content.applyGeneration(
      c.root, graph, node, normalized.body,
      n => state[n],
      rec => this.store.appendJournal({ ...rec, course: c.name }),
    )
    await this.content.queueDone(c.root, node)
    return { version, message: `[apply] ${node} 正文 v${version} 落盘（status=draft，待人审）` }
  }

  async contentFeedback(courseKey: string | undefined, node: string): Promise<string> {
    const c = await this.registry.resolve(courseKey)
    const { graph, state } = await this.loadView(c)
    return this.content.feedback(c.root, graph, node, n => state[n], async (n, fm) => {
      const path = this.paths.courseNotePath(c.root, graph.blockOf[n][1], n)
      await this.updateNoteFm(path, fm)
    })
  }

  async contentReview(courseKey: string | undefined, node: string): Promise<string> {
    const c = await this.registry.resolve(courseKey)
    const { graph, state } = await this.loadView(c)
    return this.content.review(c.root, graph, node, n => state[n], async (n, fm) => {
      const path = this.paths.courseNotePath(c.root, graph.blockOf[n][1], n)
      await this.updateNoteFm(path, fm)
    })
  }

  async contentQueue(courseKey: string | undefined, node: string): Promise<string> {
    const c = await this.registry.resolve(courseKey)
    return this.content.queueManual(c.root, node)
  }

  async queueItemsAll(): Promise<Array<Record<string, unknown>>> {
    const out: Array<Record<string, unknown>> = []
    for (const c of await this.enabledCourses()) {
      for (const it of await this.content.queueItems(c.root)) {
        out.push({ ...it, course: c.name })
      }
    }
    return out
  }

  async lesson(courseKey: string | undefined, node: string): Promise<Record<string, unknown>> {
    const c = await this.registry.resolve(courseKey)
    const { graph, state } = await this.loadView(c)
    const lesson = await this.sessions.lesson(c.name, c.root, graph, state, node)
    // 刷卡模型：mastery 由题库作答数据派生（节点 frontmatter 的旧字段不再使用）
    ;(lesson as Record<string, unknown>).mastery = await this.nodeMastery(this.paths.courseRoot(c.root), node)
    return lesson
  }

  // ---- note resolve / 反馈区读取 ----

  /** 解析笔记 → { path, node, course }，任一环节缺失即抛错。 */
  async resolveNote(vaultRoot: string, input: string, centerRel: string): Promise<{ path: string; node: string; course: string }> {
    const p = input.replace(/\\/g, '/')
    const rel = p.startsWith(`${vaultRoot}/`) ? p.slice(vaultRoot.length + 1) : p.replace(/^\/+/, '')
    const abs = `${vaultRoot}/${rel}`
    const raw = await readFile(abs, 'utf8')
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    const node = m ? (m[1].match(/^node:\s*(.+)$/m)?.[1] ?? '').trim() : ''
    if (!node) throw new Error(`${rel} 的 frontmatter 缺少 node 字段，不是课程文件。`)
    if (!rel.startsWith(`${centerRel}/`)) throw new Error(`${rel} 不在学习中心内。`)
    const seg = rel.slice(centerRel.length + 1).split('/')[0]
    const reg = await this.registry.load()
    const hit = reg.find(c => c.root === seg && c.enabled !== false)
    if (!hit) throw new Error('无法从注册表定位当前笔记对应的课程。')
    return { path: rel, node, course: hit.name }
  }

  /** 提取笔记「内容反馈」区正文；仅占位符或为空返回 null。 */
  async feedbackBody(absPath: string): Promise<string | null> {
    const raw = await readFile(absPath, 'utf8')
    const sec = raw.match(/## 内容反馈\n([\s\S]*?)(?=\n## |<!-- enc_candidates|$)/)
    const body = (sec?.[1] ?? '').replace(/在此写下你对本课内容的问题与建议.*$/m, '').trim()
    return body || null
  }

  /** 提交内容反馈（feedback 工具/路由共用）。 */
  async submitFeedback(vaultRoot: string, centerRel: string, input: string): Promise<string> {
    const { path, node, course } = await this.resolveNote(vaultRoot, input, centerRel)
    const body = await this.feedbackBody(`${vaultRoot}/${path}`)
    if (!body) throw new Error('请先在笔记「内容反馈」区写下你的问题与建议，再提交。')
    return this.contentFeedback(course, node)
  }

  // ---- P4：课程工作区（树形）与题库 ----

  /** 课程工作区树：course → region → block → node（stage/mastery/笔记/题库状态）。 */
  async coursesTree(courseKey?: string): Promise<Record<string, unknown>> {
    const targets = courseKey ? [await this.registry.resolve(courseKey)] : await this.enabledCourses()
    const courses = []
    for (const c of targets) {
      const { graph, state } = await this.loadView(c)
      const regions = graph.regions.map(r => ({
        name: r.name, color: r.color,
        blocks: r.blocks.map(b => ({
          name: b.name,
          nodes: b.nodes.map(n => ({
            node: n.name, opt: n.opt,
            stage: effectiveStage(state, n.name),
            mastery: state[n.name]?.mastery ?? 0,
            contentVersion: state[n.name]?.content.version ?? 0,
            contentStatus: state[n.name]?.content.status ?? 'draft',
            path: this.sessions.notePath(c.root, graph, n.name),
            hasBank: existsSync(this.bank.bankPath(this.paths.courseRoot(c.root), n.name)),
          })),
        })),
      }))
      courses.push({ name: c.name, id: c.id, regions })
    }
    return { courses }
  }

  /** 某节点题库题目列表（不含答案/评分要点；带到期日与作答统计——刷卡视图）。 */
  async questions(courseKey: string | undefined, node: string): Promise<Record<string, unknown>> {
    const c = await this.registry.resolve(courseKey)
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node)
    return {
      course: c.name, node,
      mastery: await this.nodeMastery(this.paths.courseRoot(c.root), node),
      questions: bank.questions.filter(q => q.archived !== true).map((q, i) => ({
        id: q.id, kind: q.kind, q: q.q, no: i + 1,
        difficulty: q.difficulty ?? 1,
        ...(q.options?.length ? { options: q.options } : {}),
        hasExplanation: Boolean(q.explanation),
        due: q.fsrs?.reps ? q.fsrs.due : null,
        attempts: q.stats?.attempts ?? 0,
        lastCorrect: q.stats?.attempts ? (q.stats.correct / q.stats.attempts) >= 0.6 : null,
      })),
    }
  }

  /** 题库写入（LLM 产出过 schema 门禁后落盘）。 */
  async questionSave(courseKey: string | undefined, node: string, yamlText: string): Promise<{ node: string; count: number; path: string }> {
    const c = await this.registry.resolve(courseKey)
    return this.bank.save(this.paths.courseRoot(c.root), yamlText, node)
  }

  /** allo 作答流：答题 → 自动判卷（reflection 走 AI）→ practice 流水 + 计数/EMA。
   * 调度不在此触碰（D15：评分仍经工作单 settle / grade 通道）。 */
  async questionAnswer(
    llmComplete: (prompt: string, system?: string) => Promise<string>,
    courseKey: string | undefined, node: string, qid: string, answer: string,
  ): Promise<Record<string, unknown>> {
    const c = await this.registry.resolve(courseKey)
    const { graph } = await this.loadView(c)
    if (!graph.nset.has(node)) throw new Error(`[question] 节点「${node}」不在图内。`)
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node)
    const idx = bank.questions.findIndex(q => q.id === qid)
    if (idx < 0) throw new Error(`[question] ${node} 的题库没有 ${qid}。`)
    const q = bank.questions[idx]

    let score = 0
    let feedback = ''
    if (q.kind === 'reflection') {
      const raw = await llmComplete(
        `Exercise prompt:\n${q.q}\n\nLearner's answer:\n${answer}\n\nGrading rubric (评分要点):\n${String(q.answer)}`,
        REFLECTION_GRADING_SYSTEM,
      )
      try {
        const v = parseReflectionGrading(raw)
        score = v.score
        feedback = v.feedback
      } catch {
        score = answer.trim() ? 0.5 : 0
        feedback = raw.slice(0, 500)
      }
    } else {
      const r = evaluateAllo(q, answer)
      score = r.score
      feedback = r.feedback
    }
    const correct = score >= PASS_SCORE
    await this.store.appendPractice({
      course: c.name, node, ex: idx + 1, answer,
      correct, judge: q.kind, qid,
      feedback: feedback || undefined,
    })
    // frontmatter 计数 + EMA（allo mastery 语义）
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(c.root, regionName, node)
    const { fm: rawFm, body } = await loadNote(path)
    const fm = asFm(rawFm)
    if (fm) {
      const next = applyPracticeEvidence(fm, correct ? 1.0 : 0.0)
      // 刷卡模型：首答把节点从 ready/unseen 推进 learning（后续调度由题目聚合驱动）
      if (next.stage === 'ready' || next.stage === 'unseen') next.stage = 'learning'
      await saveNote(path, next as unknown as Record<string, unknown>, body)
      if (next.stage !== fm.stage) {
        const { state: stateNow } = await this.loadView(c)
        await this.content.onStageChange(c.root, graph, stateNow, node, next.stage)
      }
    }
    // 题目级 FSRS：作答对错映射 rating（对=3、错=1）推进该题调度并写回题库
    const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root))
    const today = todayStr()
    const { fs } = applyRatingBlock(q.fsrs ?? null, correct ? 3 : 1, today, sched)
    const stats = {
      attempts: (q.stats?.attempts ?? 0) + 1,
      correct: (q.stats?.correct ?? 0) + (correct ? 1 : 0),
      last: today,
    }
    await this.bank.updateQuestion(this.paths.courseRoot(c.root), node, qid, { fsrs: fs, stats })
    const mastery = await this.nodeMastery(this.paths.courseRoot(c.root), node)
    return {
      correct, score: Math.round(score * 100), feedback,
      explanation: q.explanation ?? '',
      // 错题公布答案（allo answer_review 语义；reflection 的 rubric 也回显供对照）
      answer: q.kind === 'true_false' ? q.answer : q.kind === 'single_choice' ? q.answer
        : q.kind === 'fill_in_blank' ? (Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer)
        : String(q.answer),
      kind: q.kind,
      due: fs.due,
      mastery,
    }
  }

  /** 节点掌握度 = 该节点全部题目的作答正确率汇总（Σcorrect/Σattempts；无作答 → 0）。 */
  private async nodeMastery(courseRoot: string, node: string): Promise<number> {
    const bank = await this.bank.load(courseRoot, node)
    let attempts = 0
    let correct = 0
    for (const q of bank.questions) {
      if (q.archived) continue
      attempts += q.stats?.attempts ?? 0
      correct += q.stats?.correct ?? 0
    }
    if (!attempts) return 0
    return Math.round((correct / attempts) * 100) / 100
  }

  // ---- 节点跳过 / 完成确认 ----

  /** 跳过（已有基础）：stage 置 skipped，调度视同已通过；取消跳过回 ready。 */
  async nodeSkip(courseKey: string | undefined, node: string, skipped: boolean): Promise<{ course: string; node: string; stage: Stage }> {
    const c = await this.registry.resolve(courseKey)
    const { graph, state } = await this.loadView(c)
    if (!graph.nset.has(node)) throw new Error(`[skip] 节点「${node}」不在图内。`)
    if (!state[node]) await this.ensureNote(c.root, graph, node)
    const stage: Stage = skipped ? 'skipped' : 'ready'
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(c.root, regionName, node)
    const { fm: rawFm, body } = await loadNote(path)
    const fm = asFm(rawFm)
    if (fm) await saveNote(path, { ...fm, stage } as unknown as Record<string, unknown>, body)
    return { course: c.name, node, stage }
  }

  /** 完成确认：本轮内容已学——全部未归档题目纳入复习循环（已作答的按各自 FSRS
   * 调度到期复习，没作答的初始化为明天起刷），节点 stage→review。节点 frontmatter
   * 同步写一份「聚合代表」fsrs（全部题里到期最早的那张卡）：审计 E5 要求 review
   * 有 fsrs，且 R_gate 的可提取性仍从节点状态读。 */
  async nodeComplete(courseKey: string | undefined, node: string): Promise<{ course: string; node: string; stage: Stage; initialized: number; due: string | null }> {
    const c = await this.registry.resolve(courseKey)
    const { graph, state } = await this.loadView(c)
    if (!graph.nset.has(node)) throw new Error(`[complete] 节点「${node}」不在图内。`)
    if (!state[node]) await this.ensureNote(c.root, graph, node)
    const courseRoot = this.paths.courseRoot(c.root)
    const sched = await getScheduler(this.paths, courseRoot)
    const today = todayStr()
    const bank = await this.bank.load(courseRoot, node)
    let initialized = 0
    let due: string | null = null
    let repCard: FsrsBlock | null = null
    for (const q of bank.questions) {
      if (q.archived) continue
      if (q.fsrs?.reps) {
        const d = q.fsrs.due
        if (d && (!due || d < due)) { due = d; repCard = q.fsrs }
        continue
      }
      const { fs } = applyRatingBlock(null, 3, today, sched)
      await this.bank.updateQuestion(courseRoot, node, q.id, { fsrs: fs })
      initialized++
      if (!due || fs.due < due) { due = fs.due; repCard = fs }
    }
    if (state[node]?.stage === 'mastered' || state[node]?.stage === 'skipped') {
      return { course: c.name, node, stage: state[node].stage, initialized, due }
    }
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(c.root, regionName, node)
    const { fm: rawFm, body } = await loadNote(path)
    const fm = asFm(rawFm)
    if (fm && fm.stage !== 'review') {
      const next: Fm = { ...fm, stage: 'review' }
      if (repCard) next.fsrs = repCard
      next.mastery = await this.nodeMastery(courseRoot, node)
      await saveNote(path, next as unknown as Record<string, unknown>, body)
      const { state: stateNow } = await this.loadView(c)
      await this.content.onStageChange(c.root, graph, stateNow, node, 'review')
    }
    return { course: c.name, node, stage: 'review', initialized, due }
  }

  // ---- 学习面板扩展（题目管理/课程删除）----

  /** 全部题库条目（题目管理列表；不含答案，带到期与统计）。 */
  async questionsAll(courseKey?: string): Promise<{ total: number; questions: Array<Record<string, unknown>> }> {
    const courses = courseKey ? [await this.registry.resolve(courseKey)] : await this.registry.enabled()
    const out: Array<Record<string, unknown>> = []
    for (const c of courses) {
      let files: string[] = []
      try {
        files = await readdir(this.paths.bankDir(c.root))
      } catch {
        continue
      }
      for (const f of files.filter(f => f.endsWith('.yaml')).sort()) {
        const node = f.replace(/\.yaml$/, '')
        const bank = await this.bank.load(this.paths.courseRoot(c.root), node)
        bank.questions.forEach((q, i) => {
          out.push({
            course: c.name, node, qid: q.id, no: i + 1, kind: q.kind, q: q.q,
            difficulty: q.difficulty ?? 1, tags: q.tags ?? [],
            archived: q.archived === true, hasExplanation: Boolean(q.explanation),
            ...(q.options?.length ? { options: q.options } : {}),
          })
        })
      }
    }
    return { total: out.length, questions: out }
  }

  async questionAdd(courseKey: string, node: string, question: Record<string, unknown>): Promise<{ course: string; node: string; id: string; count: number }> {
    const c = await this.registry.resolve(courseKey)
    const r = await this.bank.addQuestion(this.paths.courseRoot(c.root), node, question)
    return { course: c.name, node, ...r }
  }

  async questionUpdate(courseKey: string, node: string, qid: string, patch: Record<string, unknown>): Promise<{ course: string; node: string; qid: string }> {
    const c = await this.registry.resolve(courseKey)
    await this.bank.updateQuestion(this.paths.courseRoot(c.root), node, qid, patch)
    return { course: c.name, node, qid }
  }

  async questionArchive(courseKey: string, node: string, qid: string, archived: boolean): Promise<{ course: string; node: string; qid: string; archived: boolean }> {
    const c = await this.registry.resolve(courseKey)
    await this.bank.archiveQuestion(this.paths.courseRoot(c.root), node, qid, archived)
    return { course: c.name, node, qid, archived }
  }

  /** AI 出题：节点正文 → 出题提示词 + llm → 产出的题库 YAML 逐题过 validateBank 门禁追加落盘。
   * llm 由 host 注入（返回已剥围栏的纯文本）。骨架节点（无正文）直接报错。 */
  async questionGenerate(
    courseKey: string | undefined, node: string, count: number,
    llm: (prompt: string) => Promise<string>,
  ): Promise<{ course: string; node: string; added: number; skipped: number; total: number }> {
    const c = await this.registry.resolve(courseKey)
    const { graph } = await this.loadView(c)
    if (!graph.nset.has(node)) throw new Error(`[quiz] 节点「${node}」不在图内。`)
    const [, regionName] = graph.blockOf[node]
    const note = await loadNote(this.paths.courseNotePath(c.root, regionName, node))
    const body = note.body.replace(/^>\s*内容待生成。\s*$/m, '').trim()
    if (!body) throw new Error(`[quiz] 「${node}」还没有正文——先「生成正文」再出题。`)
    const tpl = await this.loadPrompt('题目生成')
    const raw = await llm(`${tpl}\n\n## 题目数量\n\n${count} 道\n\n---\n\n${body}`)
    const doc = YAML.parse(raw) as { node?: unknown; questions?: unknown } | null
    if (typeof doc !== 'object' || doc === null || !Array.isArray(doc.questions) || !doc.questions.length) {
      throw new Error('[quiz] 模型没有产出可用题目（questions 为空）。')
    }
    // doc.node 只是模型对节点的复述（常自创短名），落盘位置由入参决定，不作硬校验
    let added = 0
    let skipped = 0
    for (const raw of doc.questions.slice(0, Math.max(1, count))) {
      const q = { ...(raw as Record<string, unknown>) }
      delete q.id // id 由 addQuestion 按现有题数自动编号，避免与既有 q1 冲突
      try {
        await this.bank.addQuestion(this.paths.courseRoot(c.root), node, q)
        added++
      } catch {
        skipped++ // 单题非法（如模型超纲出题型）不毁整批，好题照常入库
      }
    }
    if (!added) throw new Error('[quiz] 模型产出的题目全部未过校验门（题型/答案格式不符），一道都没入库。')
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node)
    return { course: c.name, node, added, skipped, total: bank.questions.length }
  }

  /** 删除课程：注册表移除 + 课程目录移入 学习中心/.trash/（不真删，可手工找回）。 */
  async courseDelete(courseKey: string): Promise<{ removed: string; trash: string }> {
    const c = await this.registry.get(courseKey)
    if (!c) throw new Error(`[learnhub] 注册表中没有课程「${courseKey}」。`)
    const rest = (await this.registry.load()).filter(x => x.name !== c.name && x.id !== c.id)
    await this.registry.save(rest)
    const src = this.paths.courseRoot(c.root)
    const trash = `${this.paths.trashDir}/${c.root}-${Date.now()}`
    if (existsSync(src)) {
      await mkdir(this.paths.trashDir, { recursive: true })
      await rename(src, trash)
    }
    return { removed: c.name, trash }
  }

  /** 为课程缺笔记的节点补骨架文件（幂等；存量课程修复/维护用）。 */
  async ensureAllNotes(courseKey?: string): Promise<{ courses: Array<{ course: string; created: number }> }> {
    const courses = courseKey ? [await this.registry.resolve(courseKey)] : await this.registry.enabled()
    const out: Array<{ course: string; created: number }> = []
    for (const c of courses) {
      const { graph } = await this.loadView(c)
      const created = await this.proposals.ensureNotesFor(c.root, graph.regions)
      out.push({ course: c.name, created })
    }
    return { courses: out }
  }

  // ---- utils ----

  private async updateNoteFm(path: string, fm: Fm): Promise<void> {
    const { body } = await loadNote(path)
    await saveNote(path, fm as unknown as Record<string, unknown>, body)
  }

  /** 写一条 journal（运行日志等由插件层做）。 */
  journal() { return this.store }
}
