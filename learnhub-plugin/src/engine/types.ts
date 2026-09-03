/**
 * 引擎共享类型（TS 引擎的数据词汇，吸收自 Python learnhub 的 courses/graphstore/db）。
 *
 * 数据主权：课程笔记 frontmatter 是调度状态唯一事实源；data/*.yaml 是图结构唯一
 * 事实源；state/ 下 JSONL/JSON 只承载追加型流水（日志/作答）与人审产物（提案/快照）。
 */

/** 阶段机（courses.STAGES）。 */
export type Stage = 'unseen' | 'ready' | 'learning' | 'review' | 'mastered'
export const STAGES: Stage[] = ['unseen', 'ready', 'learning', 'review', 'mastered']

/** 内容状态（courses.CONTENT_STATUS）。 */
export type ContentStatus = 'draft' | 'reviewed' | 'flagged'

/** FSRS 状态块（frontmatter fsrs 字段；日期均为 YYYY-MM-DD 本地日）。 */
export interface FsrsBlock {
  stability: number
  difficulty: number
  due: string
  last_review: string
  reps: number
  lapses: number
}

/** 课程笔记 frontmatter（courses.default_frontmatter 同构）。 */
export interface Fm {
  node: string
  stage: Stage
  fsrs: FsrsBlock | null
  mastery: number
  /** 练习证据的 EMA（allo 判卷流：首证取分，之后 mastery*0.7+score*0.3）；无证据为 0。 */
  practice_ema?: number
  content: { version: number; generated_at: string | null; status: ContentStatus }
  practice: { attempts: number; correct: number }
}

/** 成分技能边（graphstore enc）。 */
export interface EncEdge { node: string; w: number; note?: string }

/** 图节点（graphstore.Node）。 */
export interface GNode { name: string; pre: string[]; opt: boolean; note: string; enc: EncEdge[] }

/** 图块（graphstore.Block）。 */
export interface GBlock { name: string; nodes: GNode[] }

/** 图区（graphstore.Region，即 data/*.yaml 单文件）。 */
export interface GRegion { name: string; color: string; blocks: GBlock[] }

/** 课程注册表条目（registry.load 同构）。 */
export interface CourseEntry { id?: string; name: string; root: string; enabled?: boolean }

/** journal 流水条目（journal.append 同构）。 */
export interface JournalRec {
  ts: string
  course: string
  node: string
  rating: number | null
  kind: string
  elapsed_days: number
  session?: string | null
  duration_s?: number | null
  detail?: string
}

/** practice 作答流水条目（grading.record_attempt 同构；qid = 题库题目 id，可选）。 */
export interface PracticeRec {
  ts: string
  course: string
  node: string
  ex: number
  answer: string
  correct: boolean | null
  judge: string
  qid?: string
  feedback?: string
}

/** 提案记录（db.proposals 行同构；产物 YAML 另存 state/proposals/）。 */
export interface ProposalRec {
  id: number
  kind: 'gen' | 'edit'
  course: string
  status: 'pending' | 'applied' | 'rejected'
  summary: string
  artifact: string
  created: string
  decided?: string | null
  decision_note?: string
}

/** 一门课程在引擎内的完整视图（一次加载，多处消费）。 */
export interface CourseView {
  course: CourseEntry
  graph: import('./graph').Graph
  state: Record<string, Fm>
  broken: string[]
}
