/** 引擎 API 返回形状（与 learnhub-plugin 引擎输出一一对应）。 */

export type Stage = 'unseen' | 'ready' | 'learning' | 'review' | 'mastered'
export type ContentStatus = 'draft' | 'reviewed' | 'flagged'

export interface StatusCourse {
  id: string
  name: string
  total: number
  counts: { unseen: number; ready: number; learning: number; review: number; mastered: number }
  due_today: number
  overdue: string[]
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

export type RecEventType = 'new' | 'ready' | 'review' | 'overdue' | 'review_due' | string
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

export type QuestionKind = 'single_choice' | 'multi_choice' | 'fill_in_blank' | 'true_false'

/** 作答列表条目（不含答案）。 */
export interface QuestionItem {
  id: string
  kind: QuestionKind
  q: string
  no: number
  difficulty: number
  options?: string[]
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
  message?: string
}

export interface CheckinDoc { checked: boolean; journal: number; practice: number; total: number }
export interface CalendarDoc {
  year: number
  month: number | null
  days: Array<{ date: string; journal: number; practice: number; total: number }>
}

export interface QueueItem { course: string; node: string; reason?: string }
export interface DoctorDoc { problems: Array<{ level: string; message: string }> }

/** 作答判卷结果（question-answer / exercises 判卷共用）。 */
export interface AnswerResult {
  correct?: boolean | null
  judge: string
  feedback?: string
  message?: string
}
