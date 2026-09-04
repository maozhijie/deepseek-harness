/** 引擎 API 返回形状（与 learnhub-plugin 引擎输出一一对应）。 */

export type Stage = 'unseen' | 'ready' | 'learning' | 'review' | 'mastered' | 'skipped'
export type ContentStatus = 'draft' | 'reviewed' | 'flagged'

export interface StatusCourse {
  id: string
  name: string
  total: number
  counts: { unseen: number; ready: number; learning: number; review: number; mastered: number; skipped: number }
  due_today: number
  overdue: Array<{ node: string; since: string; count: number; path: string | null }>
  ready: Array<{ node: string; path: string | null }>
  gated: Array<{ node: string; path: string | null }>
  blocked: Record<string, string[]>
}

export interface StatusDoc { date: string; courses: StatusCourse[] }

export interface TreeNode {
  node: string
  opt: boolean
  stage: Stage
  mastery: number
  contentVersion: number
  contentStatus: ContentStatus
  path: string | null
  hasBank: boolean
}
export interface TreeBlock { name: string; nodes: TreeNode[] }
export interface TreeRegion { name: string; color: string; blocks: TreeBlock[] }
export interface TreeCourse { name: string; id: string; regions: TreeRegion[] }
export interface TreeDoc { courses: TreeCourse[] }

/** graphAnalyze 输出：React Flow elements 格式（host 直接可喂 <ReactFlow>）。 */
export interface GraphNodeData {
  id: string
  region: string
  block: string
  depth: number
  stage: Stage
  opt: boolean
}
export interface GraphEdgeData { id: string; source: string; target: string; kind: string }
export interface GraphDoc {
  stats?: Record<string, unknown>
  unreachable?: string[]
  bottlenecks?: string[]
  lapse_hotspots?: string[]
  nodes: Array<{ data: GraphNodeData }>
  edges: Array<{ data: GraphEdgeData }>
}

export type RecEventType = 'new' | 'ready' | 'review' | 'overdue' | 'learning' | string
export interface RecEvent {
  type: RecEventType
  course: string
  node: string
  region?: string
  score: number
  why: string
  path?: string | null
}
export interface RecommendDoc { date: string; events: RecEvent[] }

export type QuestionKind = 'single_choice' | 'fill_in_blank' | 'true_false' | 'reflection'

/** 作答列表条目（不含答案；带刷卡调度状态）。 */
export interface QuestionItem {
  id: string
  kind: QuestionKind
  q: string
  no: number
  difficulty: number
  options?: string[]
  /** 题目级 FSRS 下次到期日（未进入调度的题 = null）。 */
  due: string | null
  attempts: number
  lastCorrect: boolean | null
}

export interface BankEntry {
  course: string
  node: string
  qid: string
  no: number
  kind: QuestionKind
  q: string
  difficulty: number
  tags: string[]
  archived: boolean
  hasExplanation: boolean
  options?: string[]
}

export interface PropItem {
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

export interface GenJobItem {
  key: string
  course: string
  node: string
  startedAt: string
  status: 'running' | 'cancelling' | 'done' | 'failed' | 'cancelled'
  /** 组合管线阶段：content（正文）→ quiz（自动出题）。 */
  phase?: 'content' | 'quiz'
  message?: string
}

export interface QueueItem { course: string; node: string; kind: string; reason: string; priority: string }
export interface DoctorDoc { problems: Array<{ level: string; message: string }> }

/** 作答判卷结果（question-answer；含该题新到期日与节点聚合掌握度）。 */
export interface AnswerResult {
  correct?: boolean | null
  judge: string
  feedback?: string
  message?: string
  due?: string
  mastery?: number
}
