/**
 * learnhub 学习引擎插件（Host 侧，bundle 形态）—— v3 纯 TS 引擎。
 *
 * Python 引擎已退役：原 `spawn python -m learnhub` 的全部命令面由
 * src/engine/（TS）同进程承载，本文件只做三件事：
 * - agent 工具面：21 个 defineTool 直调 engine（工具名与语义与 v2 一致，题库四面为 v3 新增）
 * - HTTP 路由 /learnhub/api/*：面板后端，直调 engine
 * - /learnhub 独立面板页（伺服 web/dist Vite SPA）+ /file 媒体路由
 *
 * 跨机器部署：vault/中心路径不硬编码，由 cordis 行 config 提供
 * （config.vault 必填；centerRel 缺省「学习中心」），机器差异写在
 * profile 的 cordis.patch.yml，仓库内不含任何机器路径。
 *
 * 纪律：
 * - D14（v3）：一切数据访问收口 engine/ 模块；工具/路由/UI 不得绕过 engine 直写数据文件。
 * - D15：评分只经工作单 → settle 入库；UI 自动写回也只写工作单评分行。
 * - 每次工具/路由调用追加 state/运行日志.md（LOG_LIMIT 截断）。
 */
import type { Context } from '@deepseek-ai/cordis'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { existsSync } from 'node:fs'
import { readFile, unlink, writeFile, appendFile, mkdir } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join, resolve as resolvePath, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LearnhubEngine } from './engine/index.ts'

export const name = 'dsh-learnhub'
export const inject = ['tools', 'webServer', 'llm']

/** apply 时的行 config：部署路径与 AI 路由，均可在 profile patch 覆盖。 */
export interface LearnhubConfig {
  /** vault 根目录绝对路径（必填，各机器不同）。 */
  vault?: string
  /** 学习中心相对 vault 的路径（缺省「学习中心」）。 */
  centerRel?: string
  /** AI 生成/判卷的 llm seam provider。 */
  provider?: string
  /** AI 生成/判卷的模型名。 */
  model?: string
}

/** AI 调用的 provider/model（cordis 行 config 可覆盖，apply 时写入）。 */
const llmCfg = { provider: 'deepseek-official', model: 'deepseek-v4-flash' }

/** 课程生成任务注册表（course/node 键）：面板「生成」页签的状态源，
 * 页面刷新后从这里恢复（allo 同语义：服务端注册表是事实来源）；
 * 状态每次变更全量落盘 state/生成任务.json，host 重启后读入并把遗留 running 标为失败。 */
interface GenJob {
  course: string
  node: string
  startedAt: string
  status: 'running' | 'cancelling' | 'done' | 'failed' | 'cancelled'
  /** 组合管线的当前阶段：正文（content）→ 自动出题（quiz）。 */
  phase?: 'content' | 'quiz'
  message?: string
  /** 课程生成提示词风格（缺省「课程生成」）。 */
  style?: string
}
const genJobs = new Map<string, GenJob>()

/** 注册表落盘（fire-and-forget；D14：文件 IO 收口 engine）。 */
function persistGenJobs(): void {
  void engine.saveGenJobs([...genJobs.values()].map(j => ({ ...j })))
    .catch(() => { /* 落盘失败不影响内存态（下次变更重试） */ })
}

let VAULT = ''
let CENTER_REL = '学习中心'
let engine: LearnhubEngine

/** 单条运行日志输出截断上限（与 OB 插件同源）。 */
const LOG_LIMIT = 1500
/** 客户端面板的 HTTP 路由前缀。 */
const API = '/learnhub/api'
/** 独立面板页面路由（伺服 web/dist）。 */
const PAGE = '/learnhub'
/** 面板 SPA 构建产物目录（ui/ 经 vite build 产出；每次请求现读，改 UI 无需重启）。 */
const PAGE_DIST = fileURLToPath(new URL('../web/dist/', import.meta.url))
/** /file 路由允许伺服的二进制媒体扩展名 → MIME（课程插图等）。 */
const FILE_MIME: Record<string, string> = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
}

/** 面板 SPA 资产扩展名 → MIME。 */
const ASSET_MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.json': 'application/json; charset=utf-8', '.map': 'application/json; charset=utf-8',
}

/** 运行日志：每次引擎调用的记录（工具名 + 输出摘要）。 */
async function runLog(tool: string, output: string): Promise<void> {
  const path = `${engine.paths.centerStateDir}/运行日志.md`
  try {
    if (!existsSync(path)) {
      await mkdir(engine.paths.centerStateDir, { recursive: true })
      await appendFile(path, '# 运行日志\n\n> 插件调用 learnhub 引擎的记录。引擎自动产出，勿手工改。\n', 'utf8')
    }
    const ts = new Date().toLocaleString('sv-SE')
    const clip = output.length > LOG_LIMIT ? output.slice(0, LOG_LIMIT) + '\n…（已截断）' : output
    await appendFile(path, `\n## ${ts} · ${tool}\n\n\`\`\`\n${clip.trim() || '（无输出）'}\n\`\`\`\n`, 'utf8')
  } catch {
    // 日志失败不影响主流程
  }
}

/** D14 v3 唯一出口：engine 调用 + 运行日志。 */
async function run(tool: string, fn: () => Promise<string>): Promise<string> {
  const out = await fn()
  await runLog(tool, out)
  return out
}

/** 面板路由出口：引擎返回对象原样透传（sendJson 统一序列化一次），
 * 日志记录序列化摘要。绝不在路由里手动 stringify 对象——会双编码。 */
async function apiRun<T>(tool: string, fn: () => Promise<T>): Promise<T> {
  const out = await fn()
  await runLog(tool, typeof out === 'string' ? out : JSON.stringify(out))
  return out
}

/** dsh llm 一次性调用：收集 text-delta；终止块非 success 即抛错。 */
async function llmComplete(ctx: Context, prompt: string, system?: string): Promise<string> {
  const msg = createUserMessage({
    source: { kind: 'user' },
    content: [{ type: 'text', text: prompt }],
  })
  let text = ''
  let truncated = false
  const stream = ctx.llm.stream({
    provider: llmCfg.provider, model: llmCfg.model, messages: [msg],
    ...system === undefined ? {} : { system },
  })
  for await (const chunk of stream) {
    if (chunk.type === 'text-delta') text += chunk.text
    if (chunk.type === 'finish' && (chunk.reason.kind === 'aborted' || chunk.reason.kind === 'error')) {
      if (chunk.reason.kind === 'aborted') throw new Error('模型调用被取消')
      // failure.code 是稳定错误码（NO_ADAPTER/MISSING_CREDENTIAL/AUTH/RATE_LIMIT/...），一眼定位配置问题
      const f = chunk.reason.failure
      const status = f.status ? `/${f.status}` : ''
      throw new Error(`模型调用失败[${f.code}${status}]：${String(f.message)}`)
    }
    if (chunk.type === 'finish' && chunk.reason.kind === 'max-tokens') truncated = true
  }
  if (!text.trim()) throw new Error('模型没有返回内容')
  if (truncated) console.warn('[learnhub] 警告：模型输出被 max-tokens 截断，正文可能不完整')
  return text.trim()
}

/** 剥掉模型可能包住的整段 markdown 代码围栏。 */
function stripFences(body: string): string {
  const m = body.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/)
  return m ? m[1] : body
}

/** AI 出题管线：节点正文 → 出题提示词 → llm → validateBank 门禁逐题落盘。 */
async function generateQuiz(ctx: Context, course: string, node: string, count: number) {
  return engine.questionGenerate(course, node, count, async prompt => stripFences(await llmComplete(ctx, prompt)))
}

/** 课程生成管线：上下文包 + 提示词（可指定风格变体）→ ctx.llm → 质检门 apply（draft 落盘）→ 自动出题。
 * 出题失败不回滚正文：任务标记 done 并在 message 里说明，练习页可单独重试出题。 */
async function generateContent(ctx: Context, course: string, node: string, style?: string): Promise<string> {
  const key = `${course}/${node}`
  const existing = genJobs.get(key)
  if (existing && (existing.status === 'running' || existing.status === 'cancelling')) {
    throw new Error(`「${node}」正在生成中，请稍候。`)
  }
  const promptKind = style ? `课程生成-${style}` : '课程生成'
  const job: GenJob = { course, node, startedAt: new Date().toISOString(), status: 'running', phase: 'content', ...(style ? { style } : {}) }
  genJobs.set(key, job)
  persistGenJobs()
  try {
    const pack = await engine.contentPack(course, node)
    const tpl = await engine.loadPrompt(promptKind)
    const body = stripFences(await llmComplete(ctx, `${tpl}\n\n---\n\n${pack}`))
    // 取消语义：置旗标后 LLM 结果直接丢弃（不落盘），模型调用自然跑完
    if (job.status === 'cancelling') throw new Error('生成已取消，结果已丢弃。')
    const res = await engine.contentApply(course, node, body)

    job.phase = 'quiz'
    job.message = `${res.message}；自动出题中…`
    persistGenJobs()
    try {
      const quiz = await generateQuiz(ctx, course, node, 6)
      job.status = 'done'
      job.message = `${res.message}；自动出题 ${quiz.added} 道（题库共 ${quiz.total}）`
    } catch (quizErr) {
      job.status = 'done'
      job.message = `${res.message}；自动出题失败（${quizErr instanceof Error ? quizErr.message : String(quizErr)}）——可在练习页单独重试`
    }
    persistGenJobs()
    return job.message
  } catch (err) {
    job.status = job.status === 'cancelling' ? 'cancelled' : 'failed'
    job.message = err instanceof Error ? err.message : String(err)
    persistGenJobs()
    throw err
  } finally {
    // 终态保留：失败/取消留 24h 供排查与重试，成功留 30 分钟；之后清出注册表
    const keep = job.status === 'failed' || job.status === 'cancelled' ? 24 * 60 * 60_000 : 30 * 60_000
    setTimeout(() => {
      const cur = genJobs.get(key)
      if (cur && cur.status !== 'running' && cur.status !== 'cancelling') genJobs.delete(key)
      persistGenJobs()
    }, keep).unref()
  }
}

/** 任务注册表视图（附各任务节点的内容版本：面板据此做增量刷新）。 */
async function generationStatus(): Promise<Array<GenJob & { key: string; contentVersion?: number }>> {
  const out: Array<GenJob & { key: string; contentVersion?: number }> = []
  for (const [key, j] of genJobs.entries()) {
    let contentVersion: number | undefined
    try {
      contentVersion = await engine.contentVersion(j.course, j.node)
    } catch {
      // 节点/课程缺失等：版本缺省，面板走全量刷新
    }
    out.push({ key, ...j, contentVersion })
  }
  return out
}

function cancelGeneration(course: string, node: string): { cancelled: boolean; status?: string } {
  const job = genJobs.get(`${course}/${node}`)
  if (!job) return { cancelled: false }
  if (job.status === 'running') job.status = 'cancelling'
  return { cancelled: true, status: job.status }
}

/** 面板内轻量答疑：节点上下文 system + 前端携带的对话历史（拼成单条 user 消息）→ llm。
 * 与 dsh 会话分层：这里只答不写，深度讨论/修订走「与 AI 讨论本课」开的会话。 */
async function tutorChat(ctx: Context, course: string, node: string, history: unknown[]): Promise<string> {
  const pack = await engine.discussionPack(course, node)
  const turns = history
    .map(h => h as { role?: unknown; content?: unknown })
    .filter(h => (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string' && h.content.trim())
    .slice(-12)
  if (!turns.length || turns[turns.length - 1].role !== 'user') {
    throw new Error('tutor 对话历史必须以学习者的提问结尾。')
  }
  const transcript = turns
    .map(h => `${h.role === 'assistant' ? '[AI 老师]' : '[学习者]'} ${h.content}`)
    .join('\n\n')
  const system = `你是 learnhub 的 AI 老师，正在辅导学习者攻克一个课程节点。只依据下面的课程上下文与本课范围回答；超出范围的追问给一句概括并建议回到课程主线。回答用 Markdown，简洁直接，公式用 KaTeX（$...$）。\n\n${pack}`
  return llmComplete(ctx, `${transcript}\n\n（请回答上面最后一条学习者的提问。）`, system)
}

/** 发送 JSON 响应（no-store：状态类接口禁止浏览器缓存，保证评分后即时刷新）。 */
function sendJson(res: ServerResponse, code: number, body: unknown): void {
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

/** 读取并解析 POST JSON 请求体。 */
async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const text = Buffer.concat(chunks).toString('utf8')
  return text ? (JSON.parse(text) as Record<string, unknown>) : {}
}

/** 字符串参数取值；缺失即抛 400 语义错误。 */
function need(body: Record<string, unknown>, key: string): string {
  const v = body[key]
  if (typeof v !== 'string' || !v.trim()) throw new Error(`missing required field: ${key}`)
  return v.trim()
}

/** /learnhub/api/* 路由分发：客户端面板的全部后端入口（响应形状与 v2 一致）。 */
async function handleApi(ctx: Context, req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const route = url.pathname.slice(API.length)
  try {
    if (req.method === 'GET' && route === '/status') {
      sendJson(res, 200, await apiRun('api/status', () => engine.statusJson()))
      return
    }
    if (req.method === 'GET' && route === '/courses') {
      const list = (await engine.enabledCourses()).map(c => ({
        name: c.name, root: c.root, enabled: String(c.enabled !== false),
      }))
      sendJson(res, 200, list)
      return
    }
    if (req.method === 'GET' && route === '/lesson') {
      const node = url.searchParams.get('node')
      if (!node) throw new Error('missing required field: node')
      const course = url.searchParams.get('course') ?? undefined
      sendJson(res, 200, await apiRun('api/lesson', () => engine.lesson(course, node)))
      return
    }
    if (req.method === 'GET' && route === '/recommend') {
      const limit = Number(url.searchParams.get('limit') ?? '5')
      sendJson(res, 200, await apiRun('api/recommend', () => engine.recommend(Number.isFinite(limit) ? limit : 5)))
      return
    }
    if (req.method === 'GET' && route === '/queue') {
      sendJson(res, 200, await apiRun('api/queue', () => engine.queueItemsAll()))
      return
    }
    if (req.method === 'GET' && route === '/courses/tree') {
      const course = url.searchParams.get('course') ?? undefined
      sendJson(res, 200, await apiRun('api/courses/tree', () => engine.coursesTree(course)))
      return
    }
    if (req.method === 'GET' && route === '/questions') {
      const node = url.searchParams.get('node')
      if (!node) throw new Error('missing required field: node')
      const course = url.searchParams.get('course') ?? undefined
      sendJson(res, 200, await apiRun('api/questions', () => engine.questions(course, node)))
      return
    }
    if (req.method === 'GET' && route === '/file') {
      // 伺服 vault 内媒体文件（课程插图）；路径必须是 vault 相对且白名单扩展名
      const p = url.searchParams.get('path')
      if (!p) throw new Error('missing required field: path')
      const rel = p.replace(/\\/g, '/').replace(/^\/+/, '')
      if (rel.includes('..')) throw new Error('path traversal rejected')
      const ext = rel.slice(rel.lastIndexOf('.')).toLowerCase()
      const mime = FILE_MIME[ext]
      if (!mime) throw new Error(`unsupported file type: ${ext || '(none)'}`)
      let buf: Buffer
      try {
        buf = await readFile(`${VAULT}/${rel}`)
      } catch {
        sendJson(res, 404, { error: `file not found: ${rel}` })
        return
      }
      res.writeHead(200, { 'content-type': mime, 'cache-control': 'public, max-age=3600' })
      res.end(buf)
      return
    }
    if (req.method === 'GET' && route === '/interactive') {
      // 交互件伺服：限启用课程根内 .html；CSP 禁外联（sandbox iframe 内自包含运行，禁 vault 图片）
      const p = url.searchParams.get('path')
      if (!p) throw new Error('missing required field: path')
      const rel = p.replace(/\\/g, '/').replace(/^\/+/, '')
      if (rel.includes('..')) throw new Error('path traversal rejected')
      if (!rel.startsWith(`${CENTER_REL}/`)) throw new Error('interactive 必须位于学习中心内')
      const courseRoot = rel.slice(CENTER_REL.length + 1).split('/')[0]
      if (!(await engine.enabledCourses()).some(c => c.root === courseRoot)) {
        throw new Error(`interactive 不在任何启用课程的根内: ${courseRoot}`)
      }
      if (!rel.toLowerCase().endsWith('.html')) throw new Error('interactive 只允许 .html')
      let buf: Buffer
      try {
        buf = await readFile(`${VAULT}/${rel}`)
      } catch {
        sendJson(res, 404, { error: `file not found: ${rel}` })
        return
      }
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'content-security-policy':
          "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:",
        'cache-control': 'no-store',
      })
      res.end(buf)
      return
    }
    if (req.method === 'GET' && route === '/note') {
      const path = url.searchParams.get('path')
      if (!path) throw new Error('missing required field: path')
      sendJson(res, 200, await engine.resolveNote(VAULT, path, CENTER_REL))
      return
    }
    if (req.method === 'GET' && route === '/graph') {
      const course = url.searchParams.get('course') ?? undefined
      const elementsOnly = url.searchParams.get('elements') === '1'
      sendJson(res, 200, await apiRun('api/graph', () => engine.graphAnalyze(course, elementsOnly)))
      return
    }
    if (req.method === 'GET' && route === '/proposals') {
      sendJson(res, 200, await apiRun('api/proposals', () => engine.graphProposals()))
      return
    }
    if (req.method === 'GET' && route === '/doctor') {
      sendJson(res, 200, await apiRun('api/doctor', () => engine.doctor()))
      return
    }
    if (req.method === 'GET' && route === '/questions-all') {
      const course = url.searchParams.get('course') ?? undefined
      sendJson(res, 200, await apiRun('api/questions-all', () => engine.questionsAll(course)))
      return
    }
    if (req.method === 'GET' && route === '/xp') {
      sendJson(res, 200, await apiRun('api/xp', () => engine.xpStatus()))
      return
    }
    if (req.method === 'GET' && route === '/generate/status') {
      sendJson(res, 200, await apiRun('api/generate/status', () => generationStatus()))
      return
    }
    if (req.method === 'GET' && route === '/prompts') {
      sendJson(res, 200, await apiRun('api/prompts', () => engine.promptKinds()))
      return
    }
    if (req.method === 'GET' && route === '/discuss-pack') {
      const node = url.searchParams.get('node')
      if (!node) throw new Error('missing required field: node')
      const course = url.searchParams.get('course') ?? undefined
      sendJson(res, 200, await apiRun('api/discuss-pack', () => engine.discussionPack(course, node)))
      return
    }
    if (req.method === 'POST') {
      const body = await readJson(req)
      if (route === '/rebuild') {
        sendJson(res, 200, { message: (await engine.rebuild()).message })
        return
      }
      if (route === '/node/skip') {
        sendJson(res, 200, await apiRun('api/node/skip', () =>
          engine.nodeSkip(need(body, 'course'), need(body, 'node'), body.skipped !== false)))
        return
      }
      if (route === '/node/complete') {
        sendJson(res, 200, await apiRun('api/node/complete', () =>
          engine.nodeComplete(need(body, 'course'), need(body, 'node'), body.force === true)))
        return
      }
      if (route === '/feedback') {
        sendJson(res, 200, { message: await engine.submitFeedback(VAULT, CENTER_REL, need(body, 'path')) })
        return
      }
      if (route === '/proposals/apply') {
        const kind = need(body, 'kind') === 'edit' ? 'edit' : 'gen'
        sendJson(res, 200, await engine.graphApply(kind, body.id !== undefined ? Number(body.id) : undefined))
        return
      }
      if (route === '/proposals/reject') {
        const id = Number(body.id)
        if (!Number.isInteger(id)) throw new Error('missing required field: id')
        await engine.graphReject(id, typeof body.note === 'string' ? body.note.trim() : '')
        sendJson(res, 200, { message: `[reject] 提案 #${id} 已拒绝留痕。` })
        return
      }
      if (route === '/generate') {
        // 单次非流式：模型写完整课正文（30–90s）+ 自动出题，请求挂起直到完成；style = 提示词风格变体（如 苏格拉底）
        const style = typeof body.style === 'string' && body.style.trim() ? body.style.trim() : undefined
        sendJson(res, 200, await apiRun('api/generate', async () => ({
          message: await generateContent(ctx, need(body, 'course'), need(body, 'node'), style),
        })))
        return
      }
      if (route === '/tutor') {
        // 面板内轻量答疑：前端持有对话历史全量携带（最后一条必须是学习者提问）
        const history = Array.isArray(body.messages) ? body.messages : []
        sendJson(res, 200, await apiRun('api/tutor', async () => ({
          answer: await tutorChat(ctx, need(body, 'course'), need(body, 'node'), history),
        })))
        return
      }
      if (route === '/question-generate') {
        const count = Number(body.count)
        sendJson(res, 200, await apiRun('api/question-generate', () =>
          generateQuiz(ctx, need(body, 'course'), need(body, 'node'), Number.isInteger(count) && count > 0 ? count : 6)))
        return
      }
      if (route === '/review') {
        sendJson(res, 200, { message: await engine.contentReview(need(body, 'course'), need(body, 'node')) })
        return
      }
      if (route === '/question-save') {
        sendJson(res, 200, await engine.questionSave(need(body, 'course'), need(body, 'node'), need(body, 'yaml')))
        return
      }
      if (route === '/question-answer') {
        sendJson(res, 200, await apiRun('api/question-answer', () => engine.questionAnswer(
          prompt => llmComplete(ctx, prompt),
          need(body, 'course'), need(body, 'node'), need(body, 'qid'),
          typeof body.answer === 'string' ? body.answer : '',
          typeof body.elapsed_s === 'number' && Number.isFinite(body.elapsed_s) ? body.elapsed_s : null)))
        return
      }
      if (route === '/question-add') {
        const q = body.question
        if (typeof q !== 'object' || q === null) throw new Error('missing required field: question')
        sendJson(res, 200, await engine.questionAdd(
          need(body, 'course'), need(body, 'node'), q as Record<string, unknown>))
        return
      }
      if (route === '/question-archive') {
        sendJson(res, 200, await engine.questionArchive(
          need(body, 'course'), need(body, 'node'), need(body, 'qid'),
          body.archived === true))
        return
      }
      if (route === '/course/delete') {
        sendJson(res, 200, await engine.courseDelete(need(body, 'course')))
        return
      }
      if (route === '/generate/cancel') {
        sendJson(res, 200, cancelGeneration(need(body, 'course'), need(body, 'node')))
        return
      }
    }
    if (req.method === 'PUT') {
      const body = await readJson(req)
      if (route === '/daily-goal') {
        const goal = Number(body.goal)
        if (!Number.isFinite(goal)) throw new Error('missing required field: goal')
        sendJson(res, 200, await apiRun('api/daily-goal', () => engine.setDailyGoal(goal)))
        return
      }
      if (route === '/question-update') {
        const patch = typeof body.patch === 'object' && body.patch !== null
          ? body.patch as Record<string, unknown> : {}
        sendJson(res, 200, await engine.questionUpdate(need(body, 'course'), need(body, 'node'), need(body, 'qid'), patch))
        return
      }
    }
    sendJson(res, 404, { error: `unknown route: ${req.method} ${route}` })
  } catch (err) {
    sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) })
  }
}

export function apply(ctx: Context, config?: LearnhubConfig) {
  // —— 部署路径（机器级 config，缺失/不存在直接失败，不做静默兜底）——
  const vault = typeof config?.vault === 'string' ? config.vault.replace(/\\/g, '/').replace(/\/+$/, '') : ''
  if (!vault) {
    throw new Error(
      '[learnhub] config.vault 缺失：在该机器的 profile patch（~/.dsh/profiles/web/cordis.patch.yml）'
      + '为 id: learnhub 行配置 vault（vault 根目录绝对路径）。')
  }
  if (!existsSync(vault)) throw new Error(`[learnhub] config.vault 目录不存在：${vault}`)
  CENTER_REL = (config?.centerRel ?? '学习中心').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
  const center = `${vault}/${CENTER_REL}`
  if (!existsSync(center)) throw new Error(`[learnhub] 学习中心目录不存在：${center}`)
  VAULT = vault
  engine = new LearnhubEngine({ vault, centerRel: CENTER_REL })

  // 生成任务注册表恢复：上次进程遗留的 running/cancelling 标为失败（LLM 调用随进程消失）
  void engine.loadGenJobs().then(stale => {
    for (const raw of stale) {
      const j = raw as Partial<GenJob>
      if (typeof j.course !== 'string' || typeof j.node !== 'string') continue
      const key = `${j.course}/${j.node}`
      const interrupted = j.status === 'running' || j.status === 'cancelling'
      genJobs.set(key, {
        course: j.course, node: j.node,
        startedAt: typeof j.startedAt === 'string' ? j.startedAt : new Date().toISOString(),
        status: interrupted ? 'failed' : (j.status ?? 'failed'),
        ...(j.phase ? { phase: j.phase } : {}),
        message: interrupted ? '进程重启，任务中断——可重试' : (typeof j.message === 'string' ? j.message : undefined),
      })
    }
    persistGenJobs()
    if (stale.length) console.log(`[learnhub] gen-jobs restored: ${stale.length} (interrupted marked failed)`)
  })

  // provider/model 来自行 config（缺省用当前默认模型）
  if (config?.provider) llmCfg.provider = config.provider
  if (config?.model) llmCfg.model = config.model

  // —— agent 工具面 ——
  const textOutput = {
    schema: { type: 'string' } as const,
    render: (_args: unknown, value: unknown) => [{ type: 'text' as const, text: String(value) }],
  }
  const tool = (name: string, description: string, parameters: Record<string, unknown>, fn: (args: never) => Promise<string>) =>
    ctx.tools.register(defineTool({
      name, description, parameters,
      output: textOutput,
      execute: fn as never,
    }) as never)

  tool('learnhub_status',
    'Return the learning center status (center summary + per-course detail) as JSON.',
    {}, () => run('learnhub_status', async () => JSON.stringify(await engine.statusJson())))
  tool('learnhub_skip',
    'Mark a node as skipped (learner already knows it) or un-skip. Skipped nodes count as passed: they leave the recommendation queue and no longer block successors.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
      skipped: { type: 'boolean', description: 'true to skip (default), false to un-skip' },
    },
    (args: { course: string; node: string; skipped?: boolean }) => run('learnhub_skip', async () =>
      JSON.stringify(await engine.nodeSkip(args.course, args.node, args.skipped !== false))))
  tool('learnhub_complete',
    'Confirm a node has been learned this round. Accuracy below the passing line (0.6, with enough attempts) is rejected with accepted=false — review prerequisites or retry with force. On acceptance: unanswered bank questions get their FSRS card initialized (due tomorrow), the node stage moves to review, and a perfect-score completion earns bonus XP.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
      force: { type: 'boolean', description: 'true to bypass the accuracy gate' },
    },
    (args: { course: string; node: string; force?: boolean }) => run('learnhub_complete', async () =>
      JSON.stringify(await engine.nodeComplete(args.course, args.node, args.force === true))))
  tool('learnhub_lesson',
    "Fetch one node's lesson pack as JSON: course body split into teaching sections (练习/反馈 excluded, 答案 merged into 例题), prereqs, and suggested next nodes. Use this to teach a node step by step.",
    {
      node: { type: 'string', required: true, description: 'Node name' },
      course: { type: 'string', required: true, description: 'Course name' },
    },
    (args: { node: string; course: string }) => run('learnhub_lesson', async () => JSON.stringify(await engine.lesson(args.course, args.node))))
  tool('learnhub_recommend',
    'Get the dynamic cross-course recommendation queue as JSON: next events (review/learning/new lesson) ranked by the priority rule (overdue reviews first by days overdue and retention decay, then half-finished lessons, then new lessons by unlock count and region rotation). Each event has type/course/node/score/why. Fetch the next batch after finishing one.',
    { limit: { type: 'number', description: 'Max events to return (default 5)' } },
    (args: { limit?: number }) => run('learnhub_recommend', async () =>
      JSON.stringify(await engine.recommend(args.limit === undefined ? 5 : args.limit))))
  tool('learnhub_rebuild',
    'Run audit gate + ready-list regeneration for all enabled courses, or one course.',
    { course: { type: 'string', description: 'Course name; omit to rebuild all enabled courses' } },
    (args: { course?: string }) => run('learnhub_rebuild', async () =>
      (await engine.rebuild(args.course)).message))
  tool('learnhub_feedback',
    'Submit content feedback of a course note: reads the note「内容反馈」section and marks the node flagged + regeneration queue.',
    { path: { type: 'string', required: true, description: 'Note path, vault-relative or absolute' } },
    (args: { path: string }) => run('learnhub_feedback', () => engine.submitFeedback(VAULT, CENTER_REL, args.path)))
  tool('learnhub_note_resolve',
    'Resolve a course note: read its frontmatter node and map the path to its enabled course via 课程注册表.yaml.',
    { path: { type: 'string', required: true, description: 'Note path, vault-relative or absolute' } },
    (args: { path: string }) => run('learnhub_note_resolve', async () =>
      JSON.stringify(await engine.resolveNote(VAULT, args.path, CENTER_REL))))
  tool('learnhub_graph_analyze',
    'Analyze a course knowledge graph: structural stats, unreachable nodes, bottlenecks, lapse hotspots, plus cytoscape render elements. Returns JSON. Run this before proposing graph edits.',
    {
      course: { type: 'string', description: 'Course name; omit when only one course is enabled' },
      elementsOnly: { type: 'boolean', description: 'Only output cytoscape render elements (nodes/edges)' },
    },
    (args: { course?: string; elementsOnly?: boolean }) => run('learnhub_graph_analyze', async () =>
      JSON.stringify(await engine.graphAnalyze(args.course, args.elementsOnly))))
  tool('learnhub_graph_propose',
    'Submit a graph proposal for human review. kind=gen: full course graph YAML (course/mode/regions/blocks/nodes/pre); kind=edit: change ops (add_node/del_node/set_pre/rename/move/set_note). Schema + structure gates reject bad YAML; accepted proposals become pending until applied.',
    {
      kind: { type: 'string', required: true, description: '"gen" (new/append course graph) or "edit" (change ops)' },
      yaml: { type: 'string', required: true, description: 'Full proposal YAML text (GenProposal or EditProposal schema)' },
    },
    (args: { kind: string; yaml: string }) => run('learnhub_graph_propose', async () =>
      JSON.stringify(await engine.graphPropose(args.kind === 'edit' ? 'edit' : 'gen', args.yaml))))
  tool('learnhub_graph_apply',
    'Decide a pending graph proposal after human review: apply (audit-gated, writes data/*.yaml with rename linkage + journal + snapshot) or reject (kept on record).',
    {
      kind: { type: 'string', required: true, description: '"gen" or "edit"' },
      id: { type: 'number', description: 'Proposal id; omit for the latest pending of this kind' },
      reject: { type: 'boolean', description: 'true to reject instead of apply' },
      note: { type: 'string', description: 'Rejection reason (recorded)' },
    },
    async (args: { kind: string; id?: number; reject?: boolean; note?: string }) =>
      run('learnhub_graph_apply', async () => {
        if (args.reject) {
          if (!args.id) throw new Error('reject requires the proposal id')
          await engine.graphReject(args.id, args.note ?? '')
          return `[reject] 提案 #${args.id} 已拒绝留痕。`
        }
        return JSON.stringify(await engine.graphApply(args.kind === 'edit' ? 'edit' : 'gen', args.id))
      }))
  tool('learnhub_generate',
    'Generate one course note via the model: assembles the context pack (prereqs, domain boundary, forbidden concepts) + the user-editable prompt template (state/提示词/课程生成.md), calls the model, and applies the result through the quality gates as a draft (status=draft, awaiting human review). Missing notes are scaffolded first (on-demand lesson semantics). style selects a prompt variant (e.g. 苏格拉底/费曼; built-ins listed by GET /prompts, custom ones live at state/提示词/课程生成-<style>.md).',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name to generate' },
      style: { type: 'string', description: 'Prompt style variant; omit for the default template' },
    },
    (args: { course: string; node: string; style?: string }) => run('learnhub_generate', () =>
      generateContent(ctx, args.course, args.node, args.style)))
  tool('learnhub_content_check',
    'Run the automated content quality gates (out-of-scope references, alias consistency, unregistered code-block languages, interactive file existence) on an existing course note without applying anything. Run this after manually editing a course note in the vault; fix every reported finding.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
    },
    (args: { course: string; node: string }) => run('learnhub_content_check', async () =>
      JSON.stringify(await engine.contentCheck(args.course, args.node))))
  tool('learnhub_question_list',
    'List the question-bank questions of a node as JSON (no answers). Bank files live at <课程根>/题库/<节点>.yaml; kinds: single_choice / true_false / fill_in_blank / multi_choice / numeric / ordering / matching / reflection / open_question.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
    },
    (args: { course: string; node: string }) => run('learnhub_question_list', async () =>
      JSON.stringify(await engine.questions(args.course, args.node))))
  tool('learnhub_question_save',
    'Save a question bank for a node: validates the Bank YAML (node/kind/q/answer per kind: single_choice needs options + letter answer; multi_choice options + letter array; true_false boolean; fill_in_blank accepted answers; numeric numeric answer + optional tol; ordering options + ordered answer items; matching left-column options + paired right-column answers; reflection grading rubric; open_question reference points) then writes <课程根>/题库/<节点>.yaml.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name (must match the node field inside the YAML)' },
      yaml: { type: 'string', required: true, description: 'Bank YAML text (node/questions[id,kind,q,answer,options?,explanation?,difficulty?,uses?])' },
    },
    (args: { course: string; node: string; yaml: string }) => run('learnhub_question_save', async () =>
      JSON.stringify(await engine.questionSave(args.course, args.node, args.yaml))))
  tool('learnhub_question_answer',
    'Answer one bank question (flashcard model): auto-judged 1.0/0.0 (reflection graded by AI against its rubric); the result drives THAT question\'s FSRS schedule (correct=Good, wrong=Again) and the node mastery aggregates per-question stats.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
      qid: { type: 'string', required: true, description: 'Question id inside the bank, e.g. "q1"' },
      answer: { type: 'string', required: true, description: 'User answer (choice: letter, multi_choice: comma-joined letters; true_false: 对/错; fill_in_blank: text; numeric: number; ordering/matching: newline-joined item texts in submitted order; reflection/open_question: free text)' },
    },
    (args: { course: string; node: string; qid: string; answer: string }) => run('learnhub_question_answer', async () =>
      JSON.stringify(await engine.questionAnswer(prompt => llmComplete(ctx, prompt), args.course, args.node, args.qid, args.answer))))

  // —— 客户端面板 HTTP 路由 ——
  ctx.effect(
    () => ctx.webServer.register({ kind: 'prefix', path: API, handler: (req, res) => handleApi(ctx, req, res) }),
    'learnhub: client panel API routes',
  )

  // —— 独立面板页面（Vite SPA：web/dist/index.html + assets/*，子路径全部伺服）——
  ctx.effect(
    () => ctx.webServer.register({
      kind: 'prefix',
      path: PAGE,
      handler: async (req, res) => {
        try {
          const url = new URL(req.url ?? '/', 'http://localhost')
          // 无尾斜杠的 /learnhub 会把 base './' 的资产解析到根路径（/assets/* 404）→ 统一重定向
          if (url.pathname === PAGE) {
            res.writeHead(301, { location: `${PAGE}/` })
            res.end()
            return
          }
          const rel = decodeURIComponent(url.pathname.slice(PAGE.length).replace(/^\/+/, '')) || 'index.html'
          // 子路径限制在 dist 目录内（防 ../ 逃逸）；命中失败回落 index.html（SPA 语义）
          let file = resolvePath(PAGE_DIST, rel)
          if (!(file + sep).startsWith(PAGE_DIST)) file = join(PAGE_DIST, 'index.html')
          let data: Buffer
          try {
            data = await readFile(file)
          } catch {
            file = join(PAGE_DIST, 'index.html')
            data = await readFile(file)
          }
          const ext = file.slice(file.lastIndexOf('.')).toLowerCase()
          const mime = ASSET_MIME[ext] ?? 'application/octet-stream'
          // assets 带 hash 可永久缓存；index.html no-store 保证发布后刷新即生效
          const immutable = rel.startsWith('assets/')
          res.writeHead(200, {
            'content-type': mime,
            'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-store',
          })
          res.end(data)
        } catch (err) {
          res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
          res.end(`learnhub panel missing (build ui/ first: npm run build): ${err instanceof Error ? err.message : String(err)}`)
        }
      },
    }),
    'learnhub: panel SPA (web/dist)',
  )

  console.log(`[learnhub] plugin loaded: vault=${VAULT}, center=${VAULT}/${CENTER_REL}, 15 tools registered (pure TS engine), page at ${PAGE}, API at ${API}/*`)

  // 加载自检：不依赖模型直接跑一次 status，验证引擎通路。
  void engine.statusJson()
    .then(doc => console.log(`[learnhub] self-check status OK (${JSON.stringify(doc).length} bytes)`))
    .catch(err => console.error(`[learnhub] self-check FAILED: ${err instanceof Error ? err.message : String(err)}`))
}
