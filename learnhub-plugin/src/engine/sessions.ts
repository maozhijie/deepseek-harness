/**
 * 学习状态与调度（吸收自 Python sessions.py）。
 *
 * 命令面：status / today / settle / grade / recommend / lesson / exercises /
 * check / record-attempt / queue。v3 数据主权：课程笔记 frontmatter 就是调度
 * 状态事实源（不再有 SQLite 权威层与投影回写，同一份 frontmatter 既人读也机读）。
 * 评分经 facade 注入的 settleRating 落 frontmatter + journal（D15 唯一入口）。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { todayStr, parseDay, daysBetween } from './dates.ts'
import { effectiveStage } from './audit.ts'
import { retrievability, getScheduler } from './srs.ts'
import { Content } from './content.ts'
import type { ExerciseMeta } from './content.ts'
import { answersEqual, choiceAnswerOk, applyPracticeEvidence } from './grading.ts'
import type { Graph } from './graph.ts'
import type { Fm, FsrsBlock, Stage } from './types.ts'
import type { Paths } from './paths.ts'
import type { Store } from './store.ts'
import type { Registry } from './registry.ts'
import { loadNote, saveNote, asFm } from './notes.ts'

/** 单课调度素材的统一视图参数。 */
export interface ViewSource {
  (course: { name: string; root: string }): Promise<{ graph: Graph; state: Record<string, Fm>; broken: string[] }>
}

export interface SettleRatingFn {
  (courseName: string, graph: Graph, node: string, rating: number, today: string, sessionId: string):
    Promise<{ rec: Record<string, unknown>; newFs: FsrsBlock; kind: string; stage: string }>
}

export function doneSet(graph: Graph, state: Record<string, Fm>): Set<string> {
  return new Set(graph.names.filter(n => ['review', 'mastered'].includes(effectiveStage(state, n))))
}

export function learningSet(graph: Graph, state: Record<string, Fm>): Set<string> {
  return new Set(graph.names.filter(n => effectiveStage(state, n) === 'learning'))
}

/** 新课候选：未开始且全部非 opt 前置达标；rGate 给定时追加前置 R ≥ 门槛。 */
export function readySet(graph: Graph, state: Record<string, Fm>, rValue: (n: string) => number, rGate?: number): string[] {
  const done = doneSet(graph, state)
  const started = new Set([...done, ...learningSet(graph, state)])
  const out: string[] = []
  for (const n of graph.names) {
    if (started.has(n)) continue
    let ok = true
    for (const p of graph.preOf[n]) {
      if (graph.opt.has(p)) continue
      if (!done.has(p)) { ok = false; break }
      if (rGate !== undefined && rValue(p) < rGate) { ok = false; break }
    }
    if (ok) out.push(n)
  }
  return out.sort()
}

/** 被 R_gate 拦下的新课候选 → {候选: [(前置, R)]}。 */
export function gateBlockers(graph: Graph, state: Record<string, Fm>, rValue: (n: string) => number, rGate: number): Record<string, Array<[string, number]>> {
  const done = doneSet(graph, state)
  const started = new Set([...done, ...learningSet(graph, state)])
  const blockers: Record<string, Array<[string, number]>> = {}
  for (const n of graph.names) {
    if (started.has(n)) continue
    const weak: Array<[string, number]> = []
    let blocked = false
    for (const p of graph.preOf[n]) {
      if (graph.opt.has(p)) continue
      if (!done.has(p)) { blocked = true; break }
      const r = rValue(p)
      if (r < rGate) weak.push([p, r])
    }
    if (blocked || !weak.length) continue
    blockers[n] = weak.sort((a, b) => a[1] - b[1])
  }
  return blockers
}

/** 各区「最久未学习」排序（轮转）：从未学过的区最优先。 */
export function regionLru(graph: Graph, state: Record<string, Fm>): string[] {
  const last: Record<string, string> = {}
  for (const n of graph.names) {
    const fs = state[n]?.fsrs
    if (fs?.last_review) {
      const region = graph.blockOf[n][1]
      if (!last[region] || fs.last_review > last[region]) last[region] = fs.last_review
    }
  }
  const regions = graph.regions.map(r => r.name)
  return regions.slice().sort((a, b) => {
    const la = last[a] ?? ''
    const lb = last[b] ?? ''
    if (la !== lb) return la < lb ? -1 : 1
    return regions.indexOf(b) - regions.indexOf(a)
  })
}

export interface CourseStats {
  counts: Record<Stage, number>
  ready: string[]
  gated: string[]
  due: Array<{ d: string; n: string; r: number }>
  overdue: Array<{ d: string; n: string; r: number }>
  blocked: Record<string, Array<[string, number]>>
}

export function courseStats(graph: Graph, state: Record<string, Fm>, rValue: (n: string) => number, today: string, rGate = 0.85): CourseStats {
  const counts = { unseen: 0, ready: 0, learning: 0, review: 0, mastered: 0 } as Record<Stage, number>
  const due: CourseStats['due'] = []
  const overdue: CourseStats['overdue'] = []
  const t = parseDay(today)!
  for (const n of graph.names) {
    const st = effectiveStage(state, n)
    counts[st]++
    const fs = state[n]?.fsrs
    if (fs?.due && ['review', 'mastered', 'learning'].includes(st)) {
      const d = parseDay(fs.due)
      if (d && d <= t) {
        const r = rValue(n)
        ;(d.getTime() < t.getTime() ? overdue : due).push({ d: fs.due, n, r })
      }
    }
  }
  return {
    counts,
    ready: readySet(graph, state, rValue),
    gated: readySet(graph, state, rValue, rGate),
    due, overdue,
    blocked: gateBlockers(graph, state, rValue, rGate),
  }
}

export class Sessions {
  /** 当前操作的课程根目录（notePath 解析用；跨课循环内由调用方重设）。 */
  rootOf = ''

  constructor(
    private paths: Paths,
    private store: Store,
    private registry: Registry,
    private viewOf: ViewSource,
    private settleRating: SettleRatingFn,
    private content: Content,
  ) {}

  // ---- 笔记路径 ----

  /** 节点课程笔记的 vault 相对路径（不含 .md）；无笔记返回 null。 */
  notePath(root: string, graph: Graph, n: string): string | null {
    if (!graph.blockOf[n]) return null
    const region = graph.blockOf[n][1]
    const path = this.paths.courseNotePath(root, region, n)
    if (!existsSync(path)) return null
    const marker = '/学习中心/'
    const idx = path.replace(/\\/g, '/').indexOf(marker)
    return idx >= 0 ? path.replace(/\\/g, '/').slice(idx + 1).replace(/\.md$/, '') : null
  }

  private nodeLink(root: string, graph: Graph, n: string): string {
    const vp = this.notePath(root, graph, n)
    return vp ? `[[${vp}|${n}]]` : n
  }

  // ---- status ----

  async statusJson(enabled: Array<{ name: string; root: string; id?: string }>, today = todayStr()): Promise<Record<string, unknown>> {
    const courses: Array<Record<string, unknown>> = []
    for (const c of enabled) {
      const { graph, state } = await this.viewOf(c)
      const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root))
      const rValue = (n: string) => retrievability(sched, state[n], today)
      const st = courseStats(graph, state, rValue, today)
      courses.push({
        id: c.id, name: c.name,
        total: graph.names.length, counts: st.counts,
        due_today: st.due.length,
        overdue: st.overdue.map(o => ({ node: o.n, since: o.d, r: Math.round(o.r * 1000) / 1000, path: this.notePath(c.root, graph, o.n) })),
        ready: st.ready.map(n => ({ node: n, path: this.notePath(c.root, graph, n) })),
        gated: st.gated.map(n => ({ node: n, path: this.notePath(c.root, graph, n) })),
        blocked: Object.fromEntries(Object.entries(st.blocked).map(([n, weak]) =>
          [n, weak.map(([p, r]) => ({ pre: p, r: Math.round(r * 1000) / 1000 }))])),
      })
    }
    return { date: today, courses }
  }

  // ---- 动态推荐 ----

  async recommendEvents(enabled: Array<{ name: string; root: string }>, today: string, limit: number): Promise<Array<Record<string, unknown>>> {
    const events: Array<Record<string, unknown>> = []
    const seen = new Set<string>()
    for (const c of enabled) {
      const { graph, state } = await this.viewOf(c)
      const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root))
      const rValue = (n: string) => retrievability(sched, state[n], today)
      const st = courseStats(graph, state, rValue, today)
      const add = (etype: string, node: string, score: number, why: string) => {
        if (seen.has(node)) return
        seen.add(node)
        events.push({
          type: etype, course: c.name, node, region: graph.blockOf[node]?.[1] ?? '',
          score: Math.round(score * 10) / 10, why, path: this.notePath(c.root, graph, node),
        })
      }
      for (const o of [...st.overdue].sort((a, b) => a.d.localeCompare(b.d))) {
        const days = daysBetween(parseDay(today)!, parseDay(o.d)!)
        add('review', o.n, 60 + Math.min(days, 10) * 3 + (1 - o.r) * 10,
          `逾期 ${days} 天（${o.d} 起到期），记忆保持率约 ${Math.round(o.r * 100)}%`)
      }
      for (const d0 of [...st.due].sort((a, b) => a.d.localeCompare(b.d))) {
        add('review', d0.n, 55, `今日到期，记忆保持率约 ${Math.round(d0.r * 100)}%`)
      }
      for (const n of graph.names.filter(x => effectiveStage(state, x) === 'learning').sort()) {
        const r = state[n] ? rValue(n) : 0.9
        add('learning', n, 52 + (1 - r) * 10, `学到一半，继续完成它（保持率约 ${Math.round(r * 100)}%）`)
      }
      // 新课：解锁后继数 + 分区轮转
      const lru = regionLru(graph, state)
      const lruBonus = new Map(lru.map((r0, i) => [r0, Math.max(0, 8 - i * 2)]))
      const ready = readySet(graph, state, rValue)
      const unlockedCount: Record<string, number> = {}
      for (const n of ready) {
        for (const p of graph.preOf[n]) unlockedCount[p] = (unlockedCount[p] ?? 0) + 1
      }
      for (const n of ready) {
        const region = graph.blockOf[n][1]
        const unlocks = unlockedCount[n] ?? 0
        const parts: string[] = []
        if (unlocks) parts.push(`学好可解锁 ${unlocks} 个后继`)
        parts.push(`「${region}」区${lru.length && lru[0] === region ? '最久未学，轮转优先' : '按轮转排序'}`)
        add('new', n, 30 + Math.min(unlocks * 4, 16) + (lruBonus.get(region) ?? 0), parts.join('；'))
      }
    }
    events.sort((a, b) => (b.score as number) - (a.score as number))
    return events.slice(0, limit)
  }

  // ---- today（跨课程统一工作单） ----

  async buildCenterSession(
    enabled: Array<{ name: string; root: string; id?: string }>, minutes: number, today = todayStr(),
  ): Promise<{
    date: string; minutes: number; budget: number; course_order: string[]
    debt_total: number; overload: boolean
    reviews: Array<{ course: string; node: string; r: number; stability: number; due: string }>
    new: Array<[string, string]>
    roots: Record<string, string>
    pending: Record<string, string[]>
  }> {
    const budget = minutes
    const entries: Array<{
      course: { name: string; root: string; id?: string }
      graph: Graph; state: Record<string, Fm>
      debt: Array<{ r: number; n: string; fs: FsrsBlock }>
      withContent: string[]; pending: string[]; lastStudy: string
    }> = []
    for (const c of enabled) {
      const { graph, state } = await this.viewOf(c)
      const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root))
      const rValue = (n: string) => retrievability(sched, state[n], today)
      const debt: Array<{ r: number; n: string; fs: FsrsBlock }> = []
      for (const n of graph.names) {
        const stg = effectiveStage(state, n)
        if (!['review', 'mastered', 'learning'].includes(stg)) continue
        const fs = state[n]?.fsrs
        if (!fs?.due) continue
        const d = parseDay(fs.due)
        const t = parseDay(today)!
        if (d && d <= t) debt.push({ r: rValue(n), n, fs })
      }
      debt.sort((a, b) => a.r - b.r || a.n.localeCompare(b.n))
      const candidates = readySet(graph, state, rValue)
      const withContent: string[] = []
      const pending: string[] = []
      for (const n of candidates) {
        const fm = state[n]
        const ok = fm && ['draft', 'reviewed'].includes(fm.content.status) && fm.content.version > 0
        ;(ok ? withContent : pending).push(n)
      }
      let lastStudy = ''
      for (const fm of Object.values(state)) {
        if (fm.fsrs?.last_review && fm.fsrs.last_review > lastStudy) lastStudy = fm.fsrs.last_review
      }
      entries.push({ course: c, graph, state, debt, withContent, pending, lastStudy })
    }

    const debtTotal = entries.reduce((s, e) => s + e.debt.length, 0)
    const overload = debtTotal > 2 * 20 // OVERLOAD_FACTOR × DAILY_CAPACITY
    const allReviews = entries.flatMap(e => e.debt.map(d => ({ ...d, course: e.course.name })))
    allReviews.sort((a, b) => a.r - b.r || a.course.localeCompare(b.course) || a.n.localeCompare(b.n))
    const kReview = Math.floor(budget * 0.6 / 3) // REVIEW_RATIO / MIN_PER_REVIEW
    const reviews = allReviews.slice(0, allReviews.length ? Math.max(kReview, 1) : 0)

    const newItems: Array<[string, string]> = []
    const remain = budget - reviews.length * 3
    let slots = Math.max(0, Math.floor(remain / 12)) // MIN_PER_NEW
    const order = [...entries].sort((a, b) => a.lastStudy.localeCompare(b.lastStudy))
    for (const e of order) {
      if (slots <= 0) break
      if (!e.withContent.length) continue
      const picked = this.pickNew(e.graph, e.state, e.withContent, 1)
      if (!picked.length) continue
      newItems.push([e.course.name, picked[0]])
      slots -= 1
    }

    return {
      date: today, minutes, budget,
      course_order: enabled.map(c => c.name),
      debt_total: debtTotal, overload,
      reviews: reviews.map(r => ({ course: r.course, node: r.n, r: r.r, stability: r.fs.stability, due: r.fs.due })),
      new: newItems,
      roots: Object.fromEntries(enabled.map(c => [c.name, c.root])),
      pending: Object.fromEntries(entries.map(e => [e.course.name, e.pending])),
    }
  }

  /** 按区 LRU 轮转选新课：优先最久未学的区，区内取最浅候选。 */
  private pickNew(graph: Graph, state: Record<string, Fm>, candidates: string[], count: number): string[] {
    if (count <= 0 || !candidates.length) return []
    const byRegion: Record<string, string[]> = {}
    for (const n of candidates) {
      ;(byRegion[graph.blockOf[n][1]] ??= []).push(n)
    }
    for (const items of Object.values(byRegion)) {
      items.sort((a, b) => (graph.depth[a] ?? 0) - (graph.depth[b] ?? 0) || a.localeCompare(b))
    }
    const picked: string[] = []
    let orderRegion = regionLru(graph, state).filter(r => r in byRegion)
    while (picked.length < count && orderRegion.length) {
      const exhausted: string[] = []
      for (const r of orderRegion) {
        if (picked.length >= count) break
        picked.push(byRegion[r].shift()!)
        if (!byRegion[r].length) exhausted.push(r)
      }
      orderRegion = orderRegion.filter(r => !exhausted.includes(r))
    }
    return picked
  }

  /** 跨课程统一工作单 Markdown（## [课程名] 段型，全角 ｜ 契约）。 */
  renderSession(pack: Awaited<ReturnType<Sessions['buildCenterSession']>>): string {
    const today = pack.date
    const lines: string[] = ['---', `date: ${today}`, `minutes: ${pack.minutes}`, 'mode: normal', 'settled: false', '---', '']
    lines.push(`# 学习会话 ${today}（预算 ${pack.budget} 分钟 · 约 ${pack.reviews.length} 复习 + ${pack.new.length} 新课）`)
    lines.push('')
    for (const cname of pack.course_order) {
      const reviews = pack.reviews.filter(x => x.course === cname)
      const news = pack.new.filter(([c]) => c === cname).map(([, n]) => n)
      const pending = pack.pending[cname] ?? []
      if (!reviews.length && !news.length && !pending.length) continue
      lines.push(`## [${cname}] 到期复习`, '')
      if (reviews.length) {
        for (const r of reviews) {
          const tier = r.r >= 0.8 ? '快过' : r.r < 0.5 ? '重学' : '正常'
          lines.push(`- [ ] ${this.nodeLink(pack.roots[cname] ?? '', this.graphOf(pack, cname), r.node)} ｜ S=${r.stability.toFixed(1)}d ｜ R=${Math.round(r.r * 100)}% ｜ ${tier} ｜ 评分：`)
        }
      } else {
        lines.push('（无到期复习）')
      }
      lines.push('')
      if (news.length) {
        lines.push(`## [${cname}] 新课`, '')
        for (const n of news) lines.push(`- [ ] ${this.nodeLink(pack.roots[cname] ?? '', this.graphOf(pack, cname), n)} ｜ 首学评分：`)
        lines.push('')
      }
      if (pending.length) {
        lines.push(`内容待生成（ready 但课程未产出）：${pending.slice(0, 10).join('、')}`, '')
      }
    }
    lines.push('## 备注', '')
    lines.push('- 评分说明：1=Again 忘了 / 2=Hard 费劲 / 3=Good 正常 / 4=Easy 轻松。复习 = 不翻开课程先回忆该节点的定义与性质，再对照自评。')
    return lines.join('\n') + '\n'
  }

  private graphCache = new Map<string, Graph>()

  private graphOf(pack: { roots: Record<string, string>; course_order: string[] }, cname: string): Graph {
    return this.graphCache.get(cname) ?? ({ blockOf: {}, names: [] } as unknown as Graph)
  }

  /** 组装今日统一工作单 → 会话/YYYY-MM-DD.md；已存在且未结算时直接继续作答。 */
  async today(enabled: Array<{ name: string; root: string; id?: string }>, minutes: number, today = todayStr()): Promise<{ message: string }> {
    const path = this.paths.sessionPath(today)
    if (existsSync(path)) {
      const raw = await readFile(path, 'utf8')
      const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      if (m && /settled:\s*false/.test(m[1])) {
        return { message: `[today] 今日工作单已存在且未结算，直接继续作答: ${path}` }
      }
    }
    const pack = await this.buildCenterSession(enabled, minutes, today)
    // 预取各课图，渲染 wikilink 用
    this.graphCache.clear()
    for (const c of enabled) {
      const { graph } = await this.viewOf(c)
      this.graphCache.set(c.name, graph)
    }
    await mkdir(this.paths.sessionDir, { recursive: true })
    await writeFile(path, this.renderSession(pack), 'utf8')
    return {
      message: `[today] 工作单已生成: ${path}\n  复习 ${pack.reviews.length}（债共 ${pack.debt_total}）｜ 新课 ${pack.new.length} ｜ 模式 normal`,
    }
  }

  // ---- settle / grade ----

  private unwrapLink(s: string): string {
    const m = s.trim().match(/^\[\[(.+?)(?:\|(.+?))?\]\]$/)
    if (!m) return s.trim()
    if (m[2]) return m[2].trim()
    return m[1].split('/').pop()!.trim()
  }

  /** 解析统一工作单作答 → {reviews, new}，条目均带课程归属。 */
  parseSession(text: string): { reviews: Array<[string | null, string, number]>; new: Array<[string | null, string, number]> } {
    const out: { reviews: Array<[string | null, string, number]>; new: Array<[string | null, string, number]> } = { reviews: [], new: [] }
    let course: string | null = null
    let section = ''
    for (const raw of text.split('\n')) {
      const line = raw.trim()
      if (line.startsWith('## ')) {
        const m = line.match(/^##\s*\[(.+?)\]\s*(\S+)/)
        course = m ? m[1].trim() : null
        section = m ? m[2] : line
        continue
      }
      if (!section) continue
      const m = line.match(/^- \[[ xX]?\] (.+?) ｜ .*?评分：\s*(\d)\s*$/)
      if (!m) continue
      const node = this.unwrapLink(m[1])
      const rating = Number(m[2])
      if (!(rating >= 1 && rating <= 4)) continue
      if (line.includes('首学评分')) out.new.push([course, node, rating])
      else if (section.includes('复习') || line.includes('S=')) out.reviews.push([course, node, rating])
    }
    return out
  }

  /** 结算会话：逐课 audit 门禁由 facade 预检 → 按段归属写 frontmatter/日志。 */
  async settle(dateStr?: string, today = todayStr()): Promise<{ message: string; code: number }> {
    const ds = dateStr || today
    const path = this.paths.sessionPath(ds)
    if (!existsSync(path)) return { message: `[settle] 未找到会话工作单: ${path}`, code: 1 }
    const raw = await readFile(path, 'utf8')
    if (/^---[\s\S]*?settled:\s*true[\s\S]*?---/.test(raw)) {
      return { message: '[settle] 该会话已结算过（幂等保护），跳过。', code: 0 }
    }
    const parsed = this.parseSession(raw)
    if (!parsed.reviews.length && !parsed.new.length) {
      return { message: '[settle] 工作单中没有已评分条目（在条目末尾填 评分：1-4）。', code: 1 }
    }

    // 课程归属（段头缺课程名回落唯一启用课程）
    const names = new Set([...parsed.reviews, ...parsed.new].map(([c]) => c))
    if (names.has(null)) {
      const en = await this.registry.enabled()
      if (en.length !== 1) throw new Error('[settle] 工作单存在无课程归属的条目，而启用课程不止一门；段头必须为 `## [课程名] 段型`。')
      names.delete(null)
      names.add(en[0].name)
    }
    const views = new Map<string, { graph: Graph; root: string }>()
    for (const cname of [...names].sort() as string[]) {
      const c = await this.registry.get(cname)
      if (!c) return { message: `[settle] 工作单课程「${cname}」不在注册表中。`, code: 1 }
      const v = await this.viewOf(c)
      views.set(cname, { graph: v.graph, root: c.root })
    }

    let nDone = 0
    const details: string[] = []
    for (const [cname, node, rating] of [...parsed.reviews, ...parsed.new]) {
      const v = views.get(cname!)
      if (!v) continue
      if (!v.graph.nset.has(node)) {
        details.push(`[settle] 跳过未知节点: [${cname}] ${node}`)
        continue
      }
      const { newFs, kind } = await this.settleRating(cname!, v.graph, node, rating, today, ds)
      nDone += 1
      details.push(`  ✓ [${cname}] ${node} ← ${rating}（${kind}，S=${newFs.stability.toFixed(1)} → due ${newFs.due}）`)
    }
    // 幂等标记：frontmatter settled=true
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
    const body = fmMatch ? raw.slice(fmMatch[0].length) : raw
    let fmRaw = fmMatch ? fmMatch[1] : ''
    fmRaw = fmRaw ? fmRaw.replace(/settled:\s*false/, 'settled: true') : 'settled: true'
    await writeFile(path, `---\n${fmRaw}\n---\n\n${body}`, 'utf8')
    return {
      message: `[settle] 结算完成：${nDone} 条评分入库（${ds}）。\n${details.join('\n')}`,
      code: 0,
    }
  }

  /** 单条补录：节点跨课唯一直接命中（「课程/节点」消歧）。 */
  async grade(nodeSpec: string, rating: number, enabled: Array<{ name: string; root: string }>, today = todayStr()): Promise<string> {
    if (nodeSpec.includes('/')) {
      const [cname, node] = nodeSpec.split('/', 2)
      const c = await this.registry.get(cname.trim())
      if (!c) throw new Error(`[learnhub] 注册表中没有课程「${cname.trim()}」。`)
      return this.gradeIn(c, node.trim(), rating, today)
    }
    const hits: Array<{ name: string; root: string }> = []
    for (const c of enabled) {
      const { graph } = await this.viewOf(c)
      if (graph.nset.has(nodeSpec)) hits.push(c)
    }
    if (!hits.length) throw new Error(`[learnhub] 启用课程中找不到节点「${nodeSpec}」。`)
    if (hits.length > 1) throw new Error(`[learnhub] 节点「${nodeSpec}」在多门课程中存在，请用「课程/节点」指定：${hits.map(h => h.name).join('、')}`)
    return this.gradeIn(hits[0], nodeSpec, rating, today)
  }

  private async gradeIn(c: { name: string; root: string }, node: string, rating: number, today: string): Promise<string> {
    const { graph } = await this.viewOf(c)
    if (!graph.nset.has(node)) throw new Error(`[learnhub] 课程「${c.name}」中没有节点「${node}」。`)
    const { newFs, kind } = await this.settleRating(c.name, graph, node, rating, today, today)
    return `[grade] [${c.name}] ${node} ← ${rating}（${kind}），已写 frontmatter 与日志。（S=${newFs.stability.toFixed(1)} → due ${newFs.due}）`
  }

  // ---- 练习判卷 ----

  /** 课程文件练习区 → [{q, meta}]；无文件返回 null。 */
  async exerciseItems(root: string, graph: Graph, node: string): Promise<Array<{ q: string; meta: ExerciseMeta }> | null> {
    if (!graph.blockOf[node]) return null
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(root, regionName, node)
    const { fm, body } = await loadNote(path)
    if (!fm) return null
    const m = body.match(/## 练习\s*\n([\s\S]*?)(?=\n## |$)/)
    if (!m) return []
    const metas = Content.practiceMeta(m[1])
    const items: Array<{ q: string; meta: ExerciseMeta }> = []
    const qs = [...m[1].matchAll(/^\s*\d+\.\s*(.+)$/gm)]
    metas.forEach((meta, i) => {
      if (qs[i]) items.push({ q: qs[i][1].trim(), meta })
    })
    return items
  }

  /** 练习题目列表（不含答案）。 */
  async exercises(root: string, graph: Graph, node: string): Promise<Record<string, unknown>[]> {
    const items = await this.exerciseItems(root, graph, node)
    if (items === null) throw new Error(`[exercises] 课程文件不存在: ${node}`)
    if (!items.length) throw new Error(`[exercises] ${node} 没有练习区（内容未生成？）。`)
    return items.map(({ q, meta }) => ({
      ex: meta.ex, q,
      difficulty: meta.difficulty ?? 1,
      check: meta.check ?? 'human',
      uses: meta.uses ?? [],
      ...(meta.check === 'choice' && meta.options?.length ? { options: meta.options } : {}),
    }))
  }

  /** 判卷入口（练习区四 check 类型；不碰调度状态）。
   * ai 题返回评分要点不记录（由 host 调模型后走 record-attempt）。 */
  async check(courseName: string, root: string, graph: Graph, node: string, exNo: number, answer: string): Promise<Record<string, unknown>> {
    const items = await this.exerciseItems(root, graph, node)
    if (items === null) throw new Error(`[check] 课程文件不存在: ${node}`)
    const found = items.find(x => x.meta.ex === exNo)
    if (!found) throw new Error(`[check] ${node} 没有 ex${exNo}。`)
    const expected = found.meta.answer ?? ''
    const kind = found.meta.check ?? 'human'
    if (kind === 'ai') return { judge: 'ai', q: found.q, answer: expected }
    if (kind === 'choice') {
      const correct = choiceAnswerOk(answer, expected)
      await this.recordAttempt(courseName, root, graph, node, exNo, answer, 'choice', correct)
      return { judge: 'choice', correct, answer: expected }
    }
    if (kind !== 'sympy') {
      await this.recordAttempt(courseName, root, graph, node, exNo, answer, 'human', null)
      return { judge: 'human', correct: null, answer: expected }
    }
    const correct = answersEqual(answer, expected, found.meta.tol)
    await this.recordAttempt(courseName, root, graph, node, exNo, answer, 'sympy', correct)
    return { judge: 'sympy', correct, answer: expected }
  }

  /** 补录一次作答：验题存在 → practice 流水 + frontmatter 计数/EMA。 */
  async recordAttempt(
    courseName: string, root: string, graph: Graph, node: string, exNo: number,
    answer: string, judge: string, correct: boolean | null, feedback?: string,
  ): Promise<Record<string, unknown>> {
    const items = await this.exerciseItems(root, graph, node)
    if (items === null) throw new Error(`[record] 课程文件不存在: ${node}`)
    if (!items.some(x => x.meta.ex === exNo)) throw new Error(`[record] ${node} 没有 ex${exNo}。`)
    await this.store.appendPractice({ course: courseName, node, ex: exNo, answer, correct, judge, feedback })
    if (correct !== null) {
      const [, regionName] = graph.blockOf[node]
      const path = this.paths.courseNotePath(root, regionName, node)
      const { fm: rawFm, body } = await loadNote(path)
      const fm = asFm(rawFm)
      if (fm) {
        const next = applyPracticeEvidence(fm, correct ? 1.0 : 0.0)
        await saveNote(path, next as unknown as Record<string, unknown>, body)
      }
    }
    return { recorded: true, judge, correct }
  }

  // ---- 课程学习（面板全链路） ----

  /** 正文 → 学习分节 [{title, md}]（_lesson_sections 同语义）。 */
  static lessonSections(body: string): Array<{ title: string; md: string }> {
    const SKIP = ['练习', '内容反馈']
    const parts = body.split(/^## /m)
    const sections: Array<{ title: string; md: string }> = []
    const intro = parts[0].trim()
    if (intro) {
      const nl = intro.indexOf('\n')
      const title = nl >= 0 ? intro.slice(0, nl) : intro
      const md = nl >= 0 ? intro.slice(nl + 1).trim() : ''
      if (md) sections.push({ title: title.replace(/^#+\s*/, '').trim() || '导语', md })
    }
    let answersMd = ''
    for (const part of parts.slice(1)) {
      const nl = part.indexOf('\n')
      const title = (nl >= 0 ? part.slice(0, nl) : part).trim()
      const md = (nl >= 0 ? part.slice(nl + 1) : '').trim()
      if (SKIP.includes(title) || title.startsWith('<!--')) continue
      if (!md) continue
      if (title === '答案') {
        answersMd = md
        continue
      }
      sections.push({ title, md })
    }
    if (answersMd) {
      const hit = sections.find(s => s.title === '例题')
      if (hit) hit.md += '\n\n### 参考答案\n' + answersMd
      else sections.push({ title: '答案', md: answersMd })
    }
    return sections
  }

  /** 单节点课程学习包：分节正文 + 练习 + 前置 + 推荐下一步。 */
  async lesson(courseName: string, root: string, graph: Graph, state: Record<string, Fm>, node: string): Promise<Record<string, unknown>> {
    if (!graph.nset.has(node)) throw new Error(`[lesson] 课程「${courseName}」中没有节点「${node}」。`)
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(root, regionName, node)
    const { fm: rawFm, body } = await loadNote(path)
    const fm = asFm(rawFm)
    if (!fm) throw new Error(`[lesson] 课程文件不存在（内容未生成？）：${node}`)
    const sections = Sessions.lessonSections(body)
    const exercises = await this.exercises(root, graph, node).catch(() => [])
    const sched = await getScheduler(this.paths, this.paths.courseRoot(root))
    const rValue = (n: string) => retrievability(sched, state[n], todayStr())
    const candidates = readySet(graph, state, rValue).filter(n => n !== node)
    const unlocks = candidates.filter(n => graph.preOf[n].includes(node))
    return {
      course: courseName, node,
      region: regionName,
      stage: effectiveStage(state, node),
      mastery: fm.mastery,
      sections,
      exercises,
      prereqs: [...graph.preOf[node]],
      suggest_next: [...unlocks, ...candidates.filter(n => !unlocks.includes(n))].slice(0, 8),
    }
  }
}
