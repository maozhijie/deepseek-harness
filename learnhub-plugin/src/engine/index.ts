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
import { getScheduler, applyRating, stageAfter, masteryValue } from './srs.ts'
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
    this.sessions = new Sessions(this.paths, this.store, this.registry,
      async course => this.loadView(course), undefined as never, this.content)
    // settleRating 需要 engine 自身方法，二次注入（避免构造顺序问题）
    ;(this.sessions as unknown as { settleRating: unknown }).settleRating =
      (courseName: string, graph: Graph, node: string, rating: number, today: string, sessionId: string) =>
        this.settleRating(courseName, graph, node, rating, today, sessionId)
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

  // ---- 评分落盘（D15 唯一入口） ----

  /** 单节点评分落盘：frontmatter + journal。settle/grade 的共享底层。 */
  async settleRating(
    courseName: string, graph: Graph, node: string, rating: number, today: string, sessionId: string,
  ): Promise<{ rec: Record<string, unknown>; newFs: FsrsBlock; kind: string; stage: string }> {
    const course = await this.registry.get(courseName)
    if (!course) throw new Error(`[settle] 注册表中没有课程「${courseName}」。`)
    const { state } = await this.loadView(course)
    const fm = state[node] ?? (await this.ensureNote(course.root, graph, node))
    const sched = await getScheduler(this.paths, this.paths.courseRoot(course.root))
    const firstLearn = !fm.fsrs?.reps
    const { fs: newFs, meta } = applyRating(fm, rating, today, sched)
    const nextStage = stageAfter(newFs, rating, firstLearn)
    const practice = await this.store.attemptStats(courseName, node)
    const next: Fm = {
      ...fm,
      stage: nextStage,
      fsrs: newFs,
      mastery: masteryValue(newFs, fm.practice, fm.practice_ema),
    }
    void practice
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(course.root, regionName, node)
    await saveNote(path, next as unknown as Record<string, unknown>, (await loadNote(path)).body)
    const rec = await this.store.appendJournal({
      course: courseName, node, rating, kind: meta.kind,
      elapsed_days: meta.elapsed_days, session: sessionId,
    })
    // T1/T2 触发：阶段变化 → 预生成入队
    const { state: stateNow } = await this.loadView(course)
    await this.content.onStageChange(course.root, graph, stateNow, node, nextStage)
    return { rec: rec as unknown as Record<string, unknown>, newFs, kind: meta.kind, stage: nextStage }
  }

  /** 无笔记节点补占位文件（保证 frontmatter 始终可查）。 */
  private async ensureNote(root: string, graph: Graph, node: string): Promise<Fm> {
    const [, regionName] = graph.blockOf[node]
    const path = this.paths.courseNotePath(root, regionName, node)
    const fm = defaultFrontmatter(node)
    await saveNote(path, fm as unknown as Record<string, unknown>, '> 内容待生成。\n')
    return fm
  }

  // ---- status / recommend / today / settle / grade ----

  async statusJson(): Promise<Record<string, unknown>> {
    return this.sessions.statusJson(await this.enabledCourses())
  }

  async recommend(limit = 5): Promise<Record<string, unknown>> {
    const events = await this.sessions.recommendEvents(await this.enabledCourses(), todayStr(), limit)
    return { date: todayStr(), events }
  }

  async today(minutes: number): Promise<{ message: string }> {
    return this.sessions.today(await this.enabledCourses(), Math.round(minutes))
  }

  async settle(dateStr?: string): Promise<{ message: string; code: number }> {
    return this.sessions.settle(dateStr)
  }

  async grade(nodeSpec: string, rating: number): Promise<string> {
    return this.sessions.grade(nodeSpec, rating, await this.enabledCourses())
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
      const done = new Set(Object.entries(state).filter(([, f]) => ['review', 'mastered'].includes(f.stage)).map(([n]) => n))
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

  async genExercises(courseKey: string | undefined, node: string, yamlText: string): Promise<Record<string, unknown>> {
    const c = await this.registry.resolve(courseKey)
    const { graph } = await this.loadView(c)
    return this.content.genExercises(
      c.root, graph, node, yamlText,
      async n => (await this.loadView(c)).state[n],
      rec => this.store.appendJournal({ ...rec, course: c.name }),
      node,
    )
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

  // ---- 练习与判卷 ----

  async exercises(courseKey: string | undefined, node: string): Promise<Record<string, unknown>[]> {
    const c = await this.registry.resolve(courseKey)
    const { graph } = await this.loadView(c)
    return this.sessions.exercises(c.root, graph, node)
  }

  async lesson(courseKey: string | undefined, node: string): Promise<Record<string, unknown>> {
    const c = await this.registry.resolve(courseKey)
    const { graph, state } = await this.loadView(c)
    return this.sessions.lesson(c.name, c.root, graph, state, node)
  }

  async check(courseKey: string | undefined, node: string, exNo: number, answer: string): Promise<Record<string, unknown>> {
    const c = await this.registry.resolve(courseKey)
    const { graph } = await this.loadView(c)
    return this.sessions.check(c.name, c.root, graph, node, exNo, answer)
  }

  async recordAttempt(courseKey: string | undefined, node: string, exNo: number, answer: string, judge: string, correct: boolean | null, feedback?: string): Promise<Record<string, unknown>> {
    const c = await this.registry.resolve(courseKey)
    const { graph } = await this.loadView(c)
    return this.sessions.recordAttempt(c.name, c.root, graph, node, exNo, answer, judge, correct, feedback)
  }

  /** AI 反思判卷（reflection / ai 题）：题目+评分要点+作答 → 模型 → {score, feedback}。
   * 完成后自动 record-attempt 入流水（correct = score ≥ 0.6）。 */
  async aiGrade(
    llmComplete: (prompt: string, system?: string) => Promise<string>,
    courseKey: string | undefined, node: string, exNo: number, answer: string,
  ): Promise<Record<string, unknown>> {
    const info = await this.check(courseKey, node, exNo, '')
    if (info.judge !== 'ai') throw new Error(`ex${exNo} 不是 AI 判卷题（judge=${String(info.judge)}）。`)
    const rubric = String(info.answer ?? '')
    const raw = await llmComplete(
      `## 题目\n\n${String(info.q ?? '')}\n\n## 评分要点\n\n${rubric}\n\n## 学生作答\n\n${answer}`,
      REFLECTION_GRADING_SYSTEM,
    )
    let score = 0
    let feedback = ''
    try {
      const v = parseReflectionGrading(raw)
      score = v.score
      feedback = v.feedback
    } catch {
      // 解析失败降级：非空作答按半对处理（不静默丢给规则判卷，保底可用）
      score = answer.trim() ? 0.5 : 0
      feedback = raw.slice(0, 500)
    }
    const correct = score >= 0.6
    await this.recordAttempt(courseKey, node, exNo, answer, 'ai', correct, feedback)
    return { score: Math.round(score * 100), correct, feedback, raw }
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

  /** 某节点题库题目列表（不含答案/评分要点）。 */
  async questions(courseKey: string | undefined, node: string): Promise<Record<string, unknown>> {
    const c = await this.registry.resolve(courseKey)
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node)
    return {
      course: c.name, node,
      questions: bank.questions.filter(q => q.archived !== true).map((q, i) => ({
        id: q.id, kind: q.kind, q: q.q, no: i + 1,
        difficulty: q.difficulty ?? 1,
        ...(q.options?.length ? { options: q.options } : {}),
        hasExplanation: Boolean(q.explanation),
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
      await saveNote(path, next as unknown as Record<string, unknown>, body)
    }
    return {
      correct, score: Math.round(score * 100), feedback,
      explanation: q.explanation ?? '',
      // 错题公布答案（allo answer_review 语义；reflection 的 rubric 也回显供对照）
      answer: q.kind === 'true_false' ? q.answer : q.kind === 'single_choice' ? q.answer
        : q.kind === 'fill_in_blank' ? (Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer)
        : String(q.answer),
      kind: q.kind,
    }
  }

  // ---- 学习面板扩展（打卡/日历/标签/题目管理/课程删除）----

  /** 今日打卡状态（本地日；journal/practice 有行为即打卡，行为流水即事实）。 */
  async checkinToday(): Promise<{ checked: boolean; journal: number; practice: number; total: number }> {
    const byDay = await this.store.activityCounts()
    const today = byDay[todayStr()] ?? { journal: 0, practice: 0, total: 0 }
    return { checked: today.total > 0, journal: today.journal, practice: today.practice, total: today.total }
  }

  /** 日历热力图数据（指定年；month 缺省=全年）。 */
  async calendarStats(year: number, month?: number): Promise<{
    year: number; month: number | null
    days: Array<{ date: string; journal: number; practice: number; total: number }>
  }> {
    const byDay = await this.store.activityCounts()
    const days = Object.entries(byDay)
      .filter(([date]) => {
        const m = date.match(/^(\d{4})-(\d{2})/)
        if (!m || +m[1] !== year) return false
        return month === undefined || +m[2] === month
      })
      .map(([date, c]) => ({ date, journal: c.journal, practice: c.practice, total: c.total }))
      .sort((a, b) => a.date.localeCompare(b.date))
    return { year, month: month ?? null, days }
  }

  /** 全中心标签聚合（课程 tags + 启用课程全部题库的题目 tags，去重排序）。 */
  async listTags(): Promise<string[]> {
    const tags = new Set<string>()
    const courses = await this.registry.enabled()
    for (const c of courses) (c.tags ?? []).forEach(t => tags.add(t))
    for (const c of courses) {
      let files: string[] = []
      try {
        files = await readdir(this.paths.bankDir(c.root))
      } catch {
        continue
      }
      for (const f of files.filter(f => f.endsWith('.yaml'))) {
        const bank = await this.bank.load(this.paths.courseRoot(c.root), f.replace(/\.yaml$/, ''))
        bank.questions.forEach(q => (q.tags ?? []).forEach(t => tags.add(t)))
      }
    }
    return [...tags].sort()
  }

  async setCourseTags(courseKey: string, tags: string[]): Promise<{ course: string; tags: string[] }> {
    const c = await this.registry.resolve(courseKey)
    return { course: c.name, tags: await this.registry.setTags(c.name, tags) }
  }

  async setQuestionTags(courseKey: string, node: string, qid: string, tags: string[]): Promise<{ course: string; node: string; qid: string; tags: string[] }> {
    const c = await this.registry.resolve(courseKey)
    await this.bank.updateQuestion(this.paths.courseRoot(c.root), node, qid, { tags })
    return { course: c.name, node, qid, tags }
  }

  /** 全部题库条目（题目管理列表；不含答案）。 */
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
  ): Promise<{ course: string; node: string; added: number; total: number }> {
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
    const parsedNode = typeof doc.node === 'string' ? doc.node.trim() : ''
    if (parsedNode && parsedNode !== node) {
      throw new Error(`[quiz] 题库 node 不匹配：期望「${node}」，模型给了「${parsedNode}」。`)
    }
    let added = 0
    for (const raw of doc.questions.slice(0, Math.max(1, count))) {
      const q = { ...(raw as Record<string, unknown>) }
      delete q.id // id 由 addQuestion 按现有题数自动编号，避免与既有 q1 冲突
      await this.bank.addQuestion(this.paths.courseRoot(c.root), node, q)
      added++
    }
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node)
    return { course: c.name, node, added, total: bank.questions.length }
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
