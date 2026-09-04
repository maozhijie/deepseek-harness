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
 * 页面刷新后从这里恢复（allo 同语义：服务端注册表是事实来源）。 */
interface GenJob {
  course: string
  node: string
  startedAt: string
  status: 'running' | 'cancelling' | 'done' | 'failed' | 'cancelled'
  /** 组合管线的当前阶段：正文（content）→ 自动出题（quiz）。 */
  phase?: 'content' | 'quiz'
  message?: string
}
const genJobs = new Map<string, GenJob>()

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

/** 展开 [[target|别名]]：取别名，否则取 target 最后一段。 */
function unwrapLink(s: string): string {
  const m = s.trim().match(/^\[\[(.+?)(?:\|(.+?))?\]\]$/)
  if (!m) return s.trim()
  if (m[2]) return m[2].trim()
  return m[1].split('/').pop()!.trim()
}

/** D15：把评分写进今日工作单（## [课程] 段内命中节点评分行）——引擎外唯一允许的调度写。 */
async function writeBack(course: string, node: string, rating: number): Promise<{ ok: boolean; message: string }> {
  const today = new Date().toISOString().slice(0, 10)
  const path = engine.paths.sessionPath(today)
  let raw: string
  try {
    raw = await readFile(path, 'utf8')
  } catch {
    return { ok: false, message: '今日工作单不存在，先「生成今日工作单」。' }
  }
  const lines = raw.split('\n')
  let section = ''
  const lineRe = /^(\s*- \[[ xX]?\] (.+?) ｜.*?(?:首学评分|复习评分|评分)：)\s*\d?\s*$/
  let hit = false
  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].match(/^##\s*\[(.+?)\]/)
    if (hm) section = hm[1].trim()
    if (section !== course) continue
    const m = lines[i].match(lineRe)
    if (m && unwrapLink(m[2]) === node) {
      lines[i] = `${m[1]}${rating}`
      hit = true
      break
    }
  }
  if (!hit) {
    return { ok: false, message: `工作单的 [${course}] 段没有「${node}」的评分行（今日未排入？）` }
  }
  await writeFile(path, lines.join('\n'), 'utf8')
  return { ok: true, message: `评分 ${rating} 已写回今日工作单，记得「结算」入库。` }
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

/** 课程生成管线：上下文包 + 提示词 → ctx.llm → 质检门 apply（draft 落盘）→ 自动出题。
 * 出题失败不回滚正文：任务标记 done 并在 message 里说明，练习页可单独重试出题。 */
async function generateContent(ctx: Context, course: string, node: string): Promise<string> {
  const key = `${course}/${node}`
  const existing = genJobs.get(key)
  if (existing && (existing.status === 'running' || existing.status === 'cancelling')) {
    throw new Error(`「${node}」正在生成中，请稍候。`)
  }
  const job: GenJob = { course, node, startedAt: new Date().toISOString(), status: 'running', phase: 'content' }
  genJobs.set(key, job)
  try {
    const pack = await engine.contentPack(course, node)
    const tpl = await engine.loadPrompt('课程生成')
    const body = stripFences(await llmComplete(ctx, `${tpl}\n\n---\n\n${pack}`))
    // 取消语义：置旗标后 LLM 结果直接丢弃（不落盘），模型调用自然跑完
    if (job.status === 'cancelling') throw new Error('生成已取消，结果已丢弃。')
    const res = await engine.contentApply(course, node, body)

    job.phase = 'quiz'
    job.message = `${res.message}；自动出题中…`
    try {
      const quiz = await generateQuiz(ctx, course, node, 6)
      job.status = 'done'
      job.message = `${res.message}；自动出题 ${quiz.added} 道（题库共 ${quiz.total}）`
    } catch (quizErr) {
      job.status = 'done'
      job.message = `${res.message}；自动出题失败（${quizErr instanceof Error ? quizErr.message : String(quizErr)}）——可在练习页单独重试`
    }
    return job.message
  } catch (err) {
    job.status = job.status === 'cancelling' ? 'cancelled' : 'failed'
    job.message = err instanceof Error ? err.message : String(err)
    throw err
  } finally {
    // 终态保留：失败/取消留 24h 供排查与重试，成功留 30 分钟；之后清出注册表
    const keep = job.status === 'failed' || job.status === 'cancelled' ? 24 * 60 * 60_000 : 30 * 60_000
    setTimeout(() => {
      const cur = genJobs.get(key)
      if (cur && cur.status !== 'running' && cur.status !== 'cancelling') genJobs.delete(key)
    }, keep).unref()
  }
}

function generationStatus(): Array<GenJob & { key: string }> {
  return [...genJobs.entries()].map(([key, j]) => ({ key, ...j }))
}

function cancelGeneration(course: string, node: string): { cancelled: boolean; status?: string } {
  const job = genJobs.get(`${course}/${node}`)
  if (!job) return { cancelled: false }
  if (job.status === 'running') job.status = 'cancelling'
  return { cancelled: true, status: job.status }
}

/** AI 判卷（引擎 aiGrade：严格 JSON 解析 + 失败降级 + record-attempt）。 */
async function aiGrade(ctx: Context, course: string, node: string, ex: number, answer: string): Promise<Record<string, unknown>> {
  return engine.aiGrade(async (prompt, system) => {
    if (system) return llmComplete(ctx, prompt, system)
    const tpl = await engine.loadPrompt('AI判卷')
    return llmComplete(ctx, `${tpl}\n\n${prompt}`)
  }, course, node, ex, answer)
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

/** 字符串或数字参数取值（引擎 JSON 的 ex 号是数字）。 */
function needEx(body: Record<string, unknown>, key: string): number {
  const v = body[key]
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN
  if (!Number.isFinite(n)) throw new Error(`missing required field: ${key}`)
  return Math.round(n)
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
    if (req.method === 'GET' && route === '/exercises') {
      const node = url.searchParams.get('node')
      const course = url.searchParams.get('course')
      if (!node || !course) throw new Error('missing required field: node/course')
      sendJson(res, 200, await apiRun('api/exercises', () => engine.exercises(course, node)))
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
    if (req.method === 'GET' && route === '/checkins/today') {
      sendJson(res, 200, await apiRun('api/checkins/today', () => engine.checkinToday()))
      return
    }
    if (req.method === 'GET' && route === '/stats/calendar') {
      const year = Number(url.searchParams.get('year')) || new Date().getFullYear()
      const monthRaw = url.searchParams.get('month')
      const month = monthRaw && Number.isFinite(Number(monthRaw)) ? Number(monthRaw) : undefined
      sendJson(res, 200, await apiRun('api/stats/calendar', () => engine.calendarStats(year, month)))
      return
    }
    if (req.method === 'GET' && route === '/tags') {
      sendJson(res, 200, await apiRun('api/tags', () => engine.listTags()))
      return
    }
    if (req.method === 'GET' && route === '/questions-all') {
      const course = url.searchParams.get('course') ?? undefined
      sendJson(res, 200, await apiRun('api/questions-all', () => engine.questionsAll(course)))
      return
    }
    if (req.method === 'GET' && route === '/generate/status') {
      sendJson(res, 200, await apiRun('api/generate/status', () => generationStatus()))
      return
    }
    if (req.method === 'POST') {
      const body = await readJson(req)
      if (route === '/today') {
        const minutes = typeof body.minutes === 'number' && Number.isFinite(body.minutes) ? body.minutes : 25
        sendJson(res, 200, { message: (await engine.today(minutes)).message })
        return
      }
      if (route === '/settle') {
        const r = await engine.settle()
        if (r.code !== 0) throw new Error(r.message)
        sendJson(res, 200, { message: r.message })
        return
      }
      if (route === '/rebuild') {
        sendJson(res, 200, { message: (await engine.rebuild()).message })
        return
      }
      if (route === '/check') {
        const out = await engine.check(need(body, 'course'), need(body, 'node'), needEx(body, 'ex'),
          typeof body.answer === 'string' ? body.answer : '')
        sendJson(res, 200, out)
        return
      }
      if (route === '/grade') {
        const rating = Number(body.rating)
        if (!Number.isInteger(rating) || rating < 1 || rating > 4) throw new Error('rating must be 1-4')
        const out = await engine.grade(`${need(body, 'course')}/${need(body, 'node')}`, rating)
        sendJson(res, 200, { message: out })
        return
      }
      if (route === '/writeback') {
        const rating = Number(body.rating)
        if (!Number.isInteger(rating) || rating < 1 || rating > 4) throw new Error('rating must be 1-4')
        sendJson(res, 200, await writeBack(need(body, 'course'), need(body, 'node'), rating))
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
        // 单次非流式：模型写完整课正文（30–90s）+ 自动出题，请求挂起直到完成
        sendJson(res, 200, await apiRun('api/generate', async () => ({
          message: await generateContent(ctx, need(body, 'course'), need(body, 'node')),
        })))
        return
      }
      if (route === '/question-generate') {
        const count = Number(body.count)
        sendJson(res, 200, await apiRun('api/question-generate', () =>
          generateQuiz(ctx, need(body, 'course'), need(body, 'node'), Number.isInteger(count) && count > 0 ? count : 6)))
        return
      }
      if (route === '/ai-grade') {
        sendJson(res, 200, await apiRun('api/ai-grade', () => aiGrade(
          ctx, need(body, 'course'), need(body, 'node'), needEx(body, 'ex'),
          typeof body.answer === 'string' ? body.answer : '')))
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
          typeof body.answer === 'string' ? body.answer : '')))
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
      if (route === '/course/tags') {
        const tags = Array.isArray(body.tags) ? body.tags.map(String) : []
        sendJson(res, 200, await apiRun('api/course/tags', () => engine.setCourseTags(need(body, 'course'), tags)))
        return
      }
      if (route === '/question/tags') {
        const tags = Array.isArray(body.tags) ? body.tags.map(String) : []
        sendJson(res, 200, await apiRun('api/question/tags', () =>
          engine.setQuestionTags(need(body, 'course'), need(body, 'node'), need(body, 'qid'), tags)))
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
  tool('learnhub_today',
    "Generate today's worksheet (会话/YYYY-MM-DD.md) aggregating all enabled courses.",
    { minutes: { type: 'number', description: 'Available minutes today (default 25)' } },
    (args: { minutes?: number }) => run('learnhub_today', async () =>
      (await engine.today(args.minutes === undefined ? 25 : args.minutes)).message))
  tool('learnhub_settle',
    "Settle today's worksheet into the review system (per-section course attribution, audit-gated). Ratings must already be written into the worksheet.",
    {}, () => run('learnhub_settle', async () => {
      const r = await engine.settle()
      if (r.code !== 0) throw new Error(r.message)
      return r.message
    }))
  tool('learnhub_grade',
    'Backfill a single 1-4 rating for a node (1=forgot, 2=hard, 3=normal, 4=easy). Use "course/node" when the node name is ambiguous across courses.',
    {
      node: { type: 'string', required: true, description: 'Node name, or "course/node" to disambiguate' },
      rating: { type: 'number', required: true, description: 'Rating 1-4' },
    },
    (args: { node: string; rating: number }) => run('learnhub_grade', () => engine.grade(args.node, args.rating)))
  tool('learnhub_exercises',
    'Fetch the exercise list of a course node as JSON (no answers). Fields: ex, q, difficulty, check (sympy|choice|ai|human), uses, options (choice only).',
    {
      node: { type: 'string', required: true, description: 'Node name' },
      course: { type: 'string', required: true, description: 'Course name' },
    },
    (args: { node: string; course: string }) => run('learnhub_exercises', async () => JSON.stringify(await engine.exercises(args.course, args.node))))
  tool('learnhub_lesson',
    "Fetch one node's lesson pack as JSON: course body split into teaching sections (练习/反馈 excluded, 答案 merged into 例题), its exercises, prereqs, and suggested next nodes. Use this to teach a node step by step.",
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
  tool('learnhub_check',
    'Judge one exercise answer. sympy/choice return correct boolean; ai returns {"judge":"ai","q","answer":rubric} without recording (the panel route /ai-grade does the model call); human returns {"judge":"human","answer":reference} for self-grading.',
    {
      node: { type: 'string', required: true, description: 'Node name' },
      ex: { type: 'string', required: true, description: 'Exercise number, e.g. "ex1"' },
      answer: { type: 'string', required: true, description: 'User answer ("" for human exercises)' },
      course: { type: 'string', required: true, description: 'Course name' },
    },
    (args: { node: string; ex: string; answer: string; course: string }) => run('learnhub_check', async () =>
      JSON.stringify(await engine.check(args.course, args.node, Number(args.ex), args.answer))))
  tool('learnhub_rebuild',
    'Run audit gate + ready-list regeneration for all enabled courses, or one course.',
    { course: { type: 'string', description: 'Course name; omit to rebuild all enabled courses' } },
    (args: { course?: string }) => run('learnhub_rebuild', async () =>
      (await engine.rebuild(args.course)).message))
  tool('learnhub_feedback',
    'Submit content feedback of a course note: reads the note「内容反馈」section and marks the node flagged + regeneration queue.',
    { path: { type: 'string', required: true, description: 'Note path, vault-relative or absolute' } },
    (args: { path: string }) => run('learnhub_feedback', () => engine.submitFeedback(VAULT, CENTER_REL, args.path)))
  tool('learnhub_writeback',
    "D15: write a 1-4 rating into the rating line of today's worksheet for one node. This is the only scheduling file write allowed outside the engine.",
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
      rating: { type: 'number', required: true, description: 'Rating 1-4' },
    },
    async (args: { course: string; node: string; rating: number }) =>
      run('learnhub_writeback', async () => JSON.stringify(await writeBack(args.course, args.node, args.rating))))
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
  tool('learnhub_exercises_gen',
    'Generate exercises for a course node: validates the ExerciseSet YAML (answer presence, choice letters, uses in graph) then writes into the note practice section.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name (must match the node field inside the YAML)' },
      yaml: { type: 'string', required: true, description: 'ExerciseSet YAML text (node/mode/exercises[q,answer,check,difficulty,uses])' },
    },
    (args: { course: string; node: string; yaml: string }) => run('learnhub_exercises_gen', async () =>
      JSON.stringify(await engine.genExercises(args.course, args.node, args.yaml))))
  tool('learnhub_generate',
    'Generate one course note via the model: assembles the context pack (prereqs, domain boundary, forbidden concepts) + the user-editable prompt template (state/提示词/课程生成.md), calls the model, and applies the result through the quality gates as a draft (status=draft, awaiting human review). Missing notes are scaffolded first (on-demand lesson semantics).',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name to generate' },
    },
    (args: { course: string; node: string }) => run('learnhub_generate', () => generateContent(ctx, args.course, args.node)))
  tool('learnhub_question_list',
    'List the question-bank questions of a node as JSON (no answers). Bank files live at <课程根>/题库/<节点>.yaml; kinds: single_choice / true_false / fill_in_blank / reflection.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
    },
    (args: { course: string; node: string }) => run('learnhub_question_list', async () =>
      JSON.stringify(await engine.questions(args.course, args.node))))
  tool('learnhub_question_save',
    'Save a question bank for a node: validates the Bank YAML (node/kind/q/answer per kind: single_choice needs options + letter answer; true_false boolean; fill_in_blank accepted answers; reflection grading rubric) then writes <课程根>/题库/<节点>.yaml.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name (must match the node field inside the YAML)' },
      yaml: { type: 'string', required: true, description: 'Bank YAML text (node/questions[id,kind,q,answer,options?,explanation?,difficulty?,uses?])' },
    },
    (args: { course: string; node: string; yaml: string }) => run('learnhub_question_save', async () =>
      JSON.stringify(await engine.questionSave(args.course, args.node, args.yaml))))
  tool('learnhub_question_answer',
    'Answer one bank question (allo grading): auto-judged 1.0/0.0 (reflection graded by AI against its rubric), records practice evidence (JSONL + counters/EMA). Scheduling is NOT touched here — rate via learnhub_grade or the worksheet writeback.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
      qid: { type: 'string', required: true, description: 'Question id inside the bank, e.g. "q1"' },
      answer: { type: 'string', required: true, description: 'User answer (choice: letter; true_false: 对/错; fill_in_blank: text; reflection: free text)' },
    },
    (args: { course: string; node: string; qid: string; answer: string }) => run('learnhub_question_answer', async () =>
      JSON.stringify(await engine.questionAnswer(prompt => llmComplete(ctx, prompt), args.course, args.node, args.qid, args.answer))))
  tool('learnhub_record_attempt',
    'Record one already-graded attempt for a note exercise (practice JSONL + frontmatter counters/EMA). Use after you judged an "ai" or "human" exercise yourself; learnhub_check with judge=ai/human does NOT record.',
    {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
      ex: { type: 'number', required: true, description: 'Exercise number, e.g. 1' },
      answer: { type: 'string', required: true, description: 'User answer' },
      judge: { type: 'string', required: true, description: 'Judge kind: sympy | choice | ai | human' },
      correct: { type: 'boolean', required: true, description: 'Grading result (decide it yourself for ai/human exercises)' },
      feedback: { type: 'string', description: 'Optional grading feedback' },
    },
    (args: { course: string; node: string; ex: number; answer: string; judge: string; correct: boolean; feedback?: string }) =>
      run('learnhub_record_attempt', async () =>
        JSON.stringify(await engine.recordAttempt(args.course, args.node, args.ex, args.answer, args.judge, args.correct, args.feedback))))

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

  console.log(`[learnhub] plugin loaded: vault=${VAULT}, center=${VAULT}/${CENTER_REL}, 21 tools registered (pure TS engine), page at ${PAGE}, API at ${API}/*`)

  // 加载自检：不依赖模型直接跑一次 status，验证引擎通路。
  void engine.statusJson()
    .then(doc => console.log(`[learnhub] self-check status OK (${JSON.stringify(doc).length} bytes)`))
    .catch(err => console.error(`[learnhub] self-check FAILED: ${err instanceof Error ? err.message : String(err)}`))
}
