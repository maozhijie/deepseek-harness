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
  /** 掌握度 0-1（完成快照与最近作答 EMA 取大者）；底色深浅按它插值。 */
  mastery?: number
  /** practice = 交互实践节点（「练」角标）。 */
  type?: string
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

export type QuestionKind =
  | 'single_choice' | 'fill_in_blank' | 'true_false' | 'reflection'
  | 'multi_choice' | 'numeric' | 'ordering' | 'matching' | 'open_question'

/** 作答列表条目（不含答案；带刷卡调度状态）。 */
export interface QuestionItem {
  id: string
  kind: QuestionKind
  q: string
  no: number
  difficulty: number
  /** 来源正文节标题（mastery 会话按节轮转；null/缺省 = 旧题或旧引擎响应 → 通用收尾轮）。 */
  section?: string | null
  options?: string[]
  /** matching 专属：右列候选（服务端打乱顺序，防按序泄题）。 */
  pairOptions?: string[]
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
  /** 该任务节点的内容版本（增量刷新依据；旧引擎响应无此字段）。 */
  contentVersion?: number
}

export interface QueueItem { course: string; node: string; kind: string; reason: string; priority: string }
export interface DoctorDoc { problems: Array<{ level: string; message: string }> }

/** 作答判卷结果（question-answer；含该题新到期日与节点聚合掌握度）。
 * scheduled=false 表示该题今日已推进过调度，本次仅记录练习统计。
 * xp/xp_reason = XP 时间账本结算（对=+权重×难度、乱猜=-1、同日重复=0）。 */
export interface AnswerResult {
  correct?: boolean | null
  judge: string
  feedback?: string
  message?: string
  due?: string
  mastery?: number
  scheduled?: boolean
  xp?: number
  xp_reason?: 'correct' | 'wrong' | 'guess' | 'repeat'
}

/** 每课程 ETA（剩余节点 × 每节点 XP ÷ 每日目标）。 */
export interface EtaItem { course: string; remaining: number; done: number; per_node: number; days: number }

/** XP 时间账本视图（GET /xp）。 */
export interface XpStatus {
  date: string
  today_xp: number
  goal: number
  streak: number
  eta: EtaItem[]
}
