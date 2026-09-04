/** 面板 → 引擎 API 客户端。全部走 /learnhub/api/*（host 伺服同源）。 */

const BASE = '/learnhub/api'

export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

async function http<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  let doc: unknown = null
  try {
    doc = await res.json()
  } catch {
    // 非 JSON 响应按错误处理
  }
  if (!res.ok) {
    const msg = doc && typeof doc === 'object' && 'error' in doc
      ? String((doc as { error: unknown }).error)
      : `HTTP ${res.status}`
    throw new ApiError(res.status, msg)
  }
  return doc as T
}

const q = (params: Record<string, string | number | undefined>) => {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') usp.set(k, String(v))
  }
  const s = usp.toString()
  return s ? `?${s}` : ''
}

export const api = {
  status: () => http<import('./types').StatusDoc>('GET', '/status'),
  coursesTree: () => http<import('./types').TreeDoc>('GET', '/courses/tree'),
  graph: (course?: string) => http<import('./types').GraphDoc>('GET', `/graph${q({ course })}`),
  recommend: (limit = 8) => http<import('./types').RecommendDoc>('GET', `/recommend?limit=${limit}`),
  queue: () => http<import('./types').QueueItem[]>('GET', '/queue'),
  lesson: (node: string, course?: string) =>
    http<{ course: string; node: string; region: string; stage: string; mastery: number; sections: Array<{ title: string; md: string }>; prereqs: string[]; suggest_next: string[] }>('GET', `/lesson${q({ node, course })}`),
  questions: (course: string, node: string) =>
    http<{ course: string; node: string; mastery: number; questions: import('./types').QuestionItem[] }>('GET', `/questions${q({ course, node })}`),
  questionAnswer: (course: string, node: string, qid: string, answer: string, elapsedS?: number) =>
    http<import('./types').AnswerResult>('POST', '/question-answer', { course, node, qid, answer, elapsed_s: elapsedS }),
  nodeSkip: (course: string, node: string, skipped = true) =>
    http<{ course: string; node: string; stage: string }>('POST', '/node/skip', { course, node, skipped }),
  nodeComplete: (course: string, node: string, force = false) =>
    http<{ accepted: boolean; accuracy: number | null; course: string; node: string; stage?: string; initialized?: number; due?: string | null; reason?: string }>('POST', '/node/complete', { course, node, force }),
  generate: (course: string, node: string, style?: string) =>
    http<{ message: string }>('POST', '/generate', { course, node, ...(style ? { style } : {}) }),
  prompts: () => http<string[]>('GET', '/prompts'),
  tutor: (course: string, node: string, messages: Array<{ role: 'user' | 'assistant'; content: string }>) =>
    http<{ answer: string }>('POST', '/tutor', { course, node, messages }),
  questionGenerate: (course: string, node: string, count = 6) =>
    http<{ course: string; node: string; added: number; skipped: number; total: number }>('POST', '/question-generate', { course, node, count }),
  generateStatus: () => http<import('./types').GenJobItem[]>('GET', '/generate/status'),
  generateCancel: (course: string, node: string) =>
    http<{ cancelled: boolean; status?: string }>('POST', '/generate/cancel', { course, node }),
  xp: () => http<import('./types').XpStatus>('GET', '/xp'),
  setDailyGoal: (goal: number) => http<{ goal: number }>('PUT', '/daily-goal', { goal }),
  review: (course: string, node: string) => http<{ message: string }>('POST', '/review', { course, node }),
  feedback: (path: string) => http<{ message: string }>('POST', '/feedback', { path }),
  proposals: () => http<import('./types').PropItem[]>('GET', '/proposals'),
  proposalApply: (kind: 'gen' | 'edit', id?: number) =>
    http<Record<string, unknown>>('POST', '/proposals/apply', { kind, id }),
  proposalReject: (id: number, note = '') => http<{ message: string }>('POST', '/proposals/reject', { id, note }),
  doctor: () => http<import('./types').DoctorDoc>('GET', '/doctor'),
  questionsAll: (course?: string) =>
    http<{ total: number; questions: import('./types').BankEntry[] }>('GET', `/questions-all${q({ course })}`),
  questionAdd: (course: string, node: string, question: Record<string, unknown>) =>
    http<{ course: string; node: string; id: string; count: number }>('POST', '/question-add', { course, node, question }),
  questionUpdate: (course: string, node: string, qid: string, patch: Record<string, unknown>) =>
    http<{ course: string; node: string; qid: string }>('PUT', '/question-update', { course, node, qid, patch }),
  questionArchive: (course: string, node: string, qid: string, archived: boolean) =>
    http<{ course: string; node: string; qid: string; archived: boolean }>('POST', '/question-archive', { course, node, qid, archived }),
  courseDelete: (course: string) => http<{ removed: string; trash: string }>('POST', '/course/delete', { course }),
}

/** 请求宿主新开 dsh 会话讨论本课（client 侧 learnhub:discuss 桥消费；非 dsh 宿主环境无响应）。 */
export function discussInHost(course: string, node: string, intent: string): void {
  window.parent.postMessage({ type: 'learnhub:discuss', course, node, intent }, '*')
}
