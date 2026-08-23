/**
 * learnhub 学习引擎插件（Host 侧）。
 *
 * 移植 Obsidian learnhub 插件的全部功能面到 dsh：
 * - agent 工具：status / today / settle / grade / exercises / check / rebuild /
 *   feedback / writeback / note_resolve + 图谱四面（analyze / propose / apply /
 *   exercises_gen）+ 通用 CLI 逃生口
 * - HTTP 路由 /learnhub/api/*：供 learnhub-ui 客户端面板调用
 * - 运行日志：每次引擎调用追加 state/运行日志.md（07 §7 第 3 条）
 *
 * 纪律：
 * - D14：一切引擎调用收口 runLearnhub（spawn python -X utf8 -m learnhub）。
 * - D15：writeBack 唯一允许写的调度相关文件 = 今日工作单的评分行。
 */
import type { Context } from '@deepseek-ai/cordis'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { spawn } from 'node:child_process'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'

export const name = 'learnhub'
export const inject = ['tools', 'webServer', 'llm']

/** AI 调用的 provider/model（cordis.yml config 可覆盖，apply 时写入）。 */
const llmCfg = { provider: 'deepseek-official', model: 'deepseek-v4-flash' }
/** 进行中的课程生成任务（course/node 键，防重复触发）。 */
const generating = new Set<string>()

/** learnhub 引擎中心目录（vault 内 学习中心/）。 */
const CENTER = 'C:/Users/Administrator/Desktop/obdb/学习中心'
/** vault 根目录，用于解析 UI/agent 传入的笔记路径。 */
const VAULT = 'C:/Users/Administrator/Desktop/obdb'
/** 中心相对 vault 的路径（courseOfFile 首段反查用）。 */
const CENTER_REL = '学习中心'
/** 单条运行日志输出截断上限（与 OB 插件同源）。 */
const LOG_LIMIT = 1500
/** 客户端面板的 HTTP 路由前缀。 */
const API = '/learnhub/api'
/** 独立面板页面路由（伺服 web/index.html）。 */
const PAGE = '/learnhub'
/** 面板页面源文件（每次请求现读，改 UI 无需重启）。 */
const PAGE_FILE = new URL('../web/index.html', import.meta.url)
/** /file 路由允许伺服的二进制媒体扩展名 → MIME（课程插图等）。 */
const FILE_MIME: Record<string, string> = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
}

interface EngineResult {
  code: number
  stdout: string
  stderr: string
}

/** spawn 引擎子进程，stdout/stderr 以 utf-8 收集。 */
function spawnLearnhub(args: string[]): Promise<EngineResult> {
  return new Promise((resolve, reject) => {
    const child = spawn('python', ['-X', 'utf8', '-m', 'learnhub', ...args], {
      cwd: CENTER,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      windowsHide: true,
    })
    let stdout = ''
    let stderr = ''
    // setEncoding 走 StringDecoder：跨 chunk 的多字节 UTF-8 字符（如「图」）
    // 会缓存半字符等下一片，逐片 Buffer.toString() 则会切出 U+FFFD 乱码。
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', d => (stdout += d))
    child.stderr.on('data', d => (stderr += d))
    child.on('error', reject)
    child.on('close', code => resolve({ code: code ?? -1, stdout, stderr }))
  })
}

/** 追加运行日志（state/运行日志.md），格式与 OB 插件一致。 */
async function appendLog(args: string[], res: EngineResult): Promise<void> {
  const path = `${CENTER}/state/运行日志.md`
  let old = ''
  try {
    old = await readFile(path, 'utf8')
  } catch {
    old = '# 运行日志\n\n> 插件调用 learnhub 引擎的记录（07 §2 / §7）。引擎自动产出，勿手工改。\n'
  }
  const ts = new Date().toLocaleString('sv-SE')
  const clip = (s: string) => (s.length > LOG_LIMIT ? s.slice(0, LOG_LIMIT) + '\n…（已截断）' : s)
  const entry = [
    '',
    `## ${ts} · learnhub ${args.join(' ')}`,
    '',
    `退出码：${res.code}`,
    '',
    '```',
    clip((res.stdout + (res.stderr ? '\n[stderr]\n' + res.stderr : '')).trim() || '（无输出）'),
    '```',
    '',
  ].join('\n')
  await writeFile(path, old + entry, 'utf8')
}

/** D14 唯一出口：引擎调用 + 运行日志追加；非零退出视为失败。 */
async function runLearnhub(args: string[]): Promise<string> {
  const res = await spawnLearnhub(args)
  await appendLog(args, res)
  if (res.code !== 0) {
    throw new Error(`learnhub exited with code ${res.code}\n${res.stderr || res.stdout}`)
  }
  return res.stdout.trim()
}

/** 展开 [[target|别名]]：取别名，否则取 target 最后一段。 */
function unwrapLink(s: string): string {
  const m = s.trim().match(/^\[\[(.+?)(?:\|(.+?))?\]\]$/)
  if (!m) return s.trim()
  if (m[2]) return m[2].trim()
  return m[1].split('/').pop()!.trim()
}

/** D15：把评分写进今日工作单（## [课程] 段内命中节点评分行）。 */
async function writeBack(
  course: string,
  node: string,
  rating: number,
): Promise<{ ok: boolean; message: string }> {
  const today = new Date().toISOString().slice(0, 10)
  const path = `${CENTER}/会话/${today}.md`
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

interface RegistryCourse {
  name: string
  root: string
  enabled: string
}

/** 行解析 课程注册表.yaml（不引入 yaml 依赖，与 OB 插件同源）。 */
async function registryCourses(): Promise<RegistryCourse[]> {
  let raw: string
  try {
    raw = await readFile(`${CENTER}/课程注册表.yaml`, 'utf8')
  } catch {
    return []
  }
  const out: RegistryCourse[] = []
  let cur: RegistryCourse | null = null
  for (const line of raw.split(/\r?\n/)) {
    if (/^-\s/.test(line)) {
      if (cur && cur.root) out.push(cur)
      cur = { name: '', root: '', enabled: 'true' }
    }
    const m = line.match(/^\s*-?\s*(name|root|enabled):\s*(.+)$/)
    if (m && cur) cur[m[1] as keyof RegistryCourse] = m[2].trim()
  }
  if (cur && cur.root) out.push(cur)
  return out
}

/** 由中心相对路径（<root>/课程/...）首段反查启用课程名。 */
async function courseOfRelPath(rel: string): Promise<string | null> {
  const seg = rel.split('/')[0]
  const reg = await registryCourses()
  const hit = reg.find(c => c.root === seg && c.enabled !== 'false')
  return hit ? hit.name : null
}

/** 把传入路径规约为 vault 相对路径（接受绝对路径或 vault 相对路径）。 */
function toVaultRel(input: string): string {
  const p = input.replace(/\\/g, '/')
  return p.startsWith(`${VAULT}/`) ? p.slice(VAULT.length + 1) : p.replace(/^\/+/, '')
}

/** 提取笔记 frontmatter 的 node 字段。 */
function frontmatterNode(raw: string): string | null {
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) return null
  const n = fm[1].match(/^node:\s*(.+)$/m)
  return n ? n[1].trim() : null
}

/** 解析笔记 → { path, node, course }，任一环节缺失即抛错。 */
async function resolveNote(input: string): Promise<{ path: string; node: string; course: string }> {
  const rel = toVaultRel(input)
  const abs = `${VAULT}/${rel}`
  const raw = await readFile(abs, 'utf8')
  const node = frontmatterNode(raw)
  if (!node) throw new Error(`${rel} 的 frontmatter 缺少 node 字段，不是课程文件。`)
  if (!rel.startsWith(`${CENTER_REL}/`)) throw new Error(`${rel} 不在学习中心内。`)
  const course = await courseOfRelPath(rel.slice(CENTER_REL.length + 1))
  if (!course) throw new Error('无法从注册表定位当前笔记对应的课程。')
  return { path: rel, node, course }
}

/** 提取笔记「内容反馈」区正文；仅占位符或为空返回 null。 */
async function feedbackBody(absPath: string): Promise<string | null> {
  const raw = await readFile(absPath, 'utf8')
  const sec = raw.match(/## 内容反馈\n([\s\S]*?)(?=\n## |<!-- enc_candidates|$)/)
  const body = (sec?.[1] ?? '').replace(/在此写下你对本课内容的问题与建议.*$/m, '').trim()
  return body || null
}

/** 把 agent 产出的 YAML 写入临时文件 → 执行回调 → 删除临时文件。
 *
 * propose/gen-exercises 门禁会把产物另存到 state/proposals/（留痕），
 * 这里的临时文件只是 CLI 的入参载体；删除失败仅留警告，不阻塞主流程。
 */
async function withTempYaml(content: string, run: (file: string) => Promise<string>): Promise<string> {
  await mkdir(`${CENTER}/state`, { recursive: true })
  const file = `${CENTER}/state/tmp-agent-${Date.now()}.yaml`
  await writeFile(file, content, 'utf8')
  try {
    return await run(file)
  } finally {
    // 删除失败仅丢失一个临时入参文件，门禁产物已另行落盘
    await unlink(file).catch(() => undefined)
  }
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
function needText(body: Record<string, unknown>, key: string): string {
  const v = body[key]
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  if (typeof v === 'string' && v.trim()) return v.trim()
  throw new Error(`missing required field: ${key}`)
}

/** dsh llm 一次性调用：收集 text-delta；终止块非 success 即抛错。
 *
 * 凭据/重试/attribution 由 llm seam 负责，插件不碰 key。 */
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
    // 成功 finish 是 stop/tool-calls；只有 aborted/error 才是失败（FinishReasonMap）
    if (chunk.type === 'finish' && (chunk.reason.kind === 'aborted' || chunk.reason.kind === 'error')) {
      throw new Error(chunk.reason.kind === 'aborted' ? '模型调用被取消'
        : `模型调用失败：${String(chunk.reason.failure.message)}`)
    }
    if (chunk.type === 'finish' && chunk.reason.kind === 'max-tokens') truncated = true
  }
  if (!text.trim()) throw new Error('模型没有返回内容')
  if (truncated) console.warn('[learnhub] 警告：模型输出被 max-tokens 截断，正文可能不完整')
  return text.trim()
}

/** 把内容写入临时文件 → 执行回调 → 删除临时文件（CLI 入参载体，同 withTempYaml）。 */
async function withTempFile(content: string, run: (file: string) => Promise<string>): Promise<string> {
  await mkdir(`${CENTER}/state`, { recursive: true })
  const file = `${CENTER}/state/tmp-gen-${Date.now()}.md`
  await writeFile(file, content, 'utf8')
  try {
    return await run(file)
  } finally {
    await unlink(file).catch(() => undefined)
  }
}

/** 剥掉模型可能包住的整段 markdown 代码围栏。 */
function stripFences(body: string): string {
  const m = body.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/)
  return m ? m[1] : body
}

/** 课程生成管线：上下文包 + 提示词 → ctx.llm → 质检门 apply（draft 落盘）。 */
async function generateContent(ctx: Context, course: string, node: string): Promise<string> {
  const key = `${course}/${node}`
  if (generating.has(key)) throw new Error(`「${node}」正在生成中，请稍候。`)
  generating.add(key)
  try {
    const pack = await runLearnhub(['content', 'pack', node, '--course', course])
    const tpl = await runLearnhub(['prompt', '--kind', '课程生成'])
    const body = stripFences(await llmComplete(ctx, `${tpl}\n\n---\n\n${pack}`))
    return await withTempFile(body, file => runLearnhub(
      ['content', 'apply', node, '--file', file, '--course', course]))
  } finally {
    generating.delete(key)
  }
}

/** AI 判卷：引擎取题与评分要点 → 提示词 + 作答 → ctx.llm → record-attempt 落库。 */
async function aiGrade(
  ctx: Context,
  course: string,
  node: string,
  ex: string,
  answer: string,
): Promise<Record<string, unknown>> {
  const info = JSON.parse(await runLearnhub([
    'learn', 'check', node, ex, '--answer', '', '--course', course, '--json',
  ])) as { judge?: string; q?: string; answer?: string }
  if (info.judge !== 'ai') throw new Error(`ex${ex} 不是 AI 判卷题（judge=${info.judge ?? '?'}）。`)
  const tpl = await runLearnhub(['prompt', '--kind', 'AI判卷'])
  const raw = await llmComplete(ctx,
    `${tpl}\n\n## 题目\n\n${info.q ?? ''}\n\n## 评分要点\n\n${info.answer ?? ''}\n\n## 学生作答\n\n${answer}`)
  const jm = raw.match(/\{[\s\S]*\}/)
  let verdict: Record<string, unknown> = {}
  if (jm) {
    try { verdict = JSON.parse(jm[0]) as Record<string, unknown> } catch { /* 解析失败留给下面兑底 */ }
  }
  const score = typeof verdict.score === 'number' ? Math.round(verdict.score) : 0
  const feedback = `${verdict.verdict ?? (score >= 80 ? '对' : score >= 50 ? '半对' : '错')}（${score} 分）`
    + `${verdict.feedback ? '：' + String(verdict.feedback) : ''}`
    + `${verdict.suggestions ? '\n建议：' + String(verdict.suggestions) : ''}`
  await runLearnhub([
    'learn', 'record-attempt', node, ex, '--answer', answer, '--judge', 'ai',
    '--correct', score >= 60 ? '1' : '0', '--feedback', feedback, '--course', course,
  ])
  return { score, verdict: verdict.verdict ?? null, feedback: verdict.feedback ?? '',
    suggestions: verdict.suggestions ?? '', correct: score >= 60, raw }
}

/** /learnhub/api/* 路由分发：客户端面板的全部后端入口。 */
async function handleApi(ctx: Context, req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const route = url.pathname.slice(API.length)
  try {
    if (req.method === 'GET' && route === '/status') {
      sendJson(res, 200, JSON.parse(await runLearnhub(['learn', 'status', '--json'])))
      return
    }
    if (req.method === 'GET' && route === '/courses') {
      sendJson(res, 200, await registryCourses())
      return
    }
    if (req.method === 'GET' && route === '/exercises') {
      const node = url.searchParams.get('node')
      const course = url.searchParams.get('course')
      if (!node || !course) throw new Error('missing required field: node/course')
      const out = await runLearnhub(['learn', 'exercises', node, '--course', course, '--json'])
      sendJson(res, 200, JSON.parse(out))
      return
    }
    if (req.method === 'GET' && route === '/lesson') {
      const node = url.searchParams.get('node')
      if (!node) throw new Error('missing required field: node')
      // course 可缺省：引擎跨启用课程搜唯一命中（面板无需先选课）
      const course = url.searchParams.get('course')
      const argv = ['learn', 'lesson', node, '--json']
      if (course) argv.splice(3, 0, '--course', course)
      sendJson(res, 200, JSON.parse(await runLearnhub(argv)))
      return
    }
    if (req.method === 'GET' && route === '/recommend') {
      const limit = url.searchParams.get('limit') ?? '5'
      sendJson(res, 200, JSON.parse(await runLearnhub(['learn', 'recommend', '--limit', limit, '--json'])))
      return
    }
    if (req.method === 'GET' && route === '/queue') {
      sendJson(res, 200, JSON.parse(await runLearnhub(['learn', 'queue', '--json'])))
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
      sendJson(res, 200, await resolveNote(path))
      return
    }
    if (req.method === 'GET' && route === '/graph') {
      const argv = ['graph', 'analyze']
      const course = url.searchParams.get('course')
      if (course) argv.push('--course', course)
      if (url.searchParams.get('elements') === '1') argv.push('--elements-only')
      sendJson(res, 200, JSON.parse(await runLearnhub(argv)))
      return
    }
    if (req.method === 'GET' && route === '/proposals') {
      sendJson(res, 200, JSON.parse(await runLearnhub(['graph', 'proposals', '--json'])))
      return
    }
    if (req.method === 'GET' && route === '/doctor') {
      sendJson(res, 200, JSON.parse(await runLearnhub(['doctor', '--json'])))
      return
    }
    if (req.method === 'POST') {
      const body = await readJson(req)
      if (route === '/today') {
        const minutes = typeof body.minutes === 'number' && Number.isFinite(body.minutes) ? body.minutes : 25
        sendJson(res, 200, { message: await runLearnhub(['learn', 'today', '--minutes', String(Math.round(minutes))]) })
        return
      }
      if (route === '/settle') {
        sendJson(res, 200, { message: await runLearnhub(['learn', 'settle']) })
        return
      }
      if (route === '/rebuild') {
        sendJson(res, 200, { message: await runLearnhub(['all']) })
        return
      }
      if (route === '/check') {
        const out = await runLearnhub([
          'learn', 'check', need(body, 'node'), needText(body, 'ex'),
          '--answer', typeof body.answer === 'string' ? body.answer : '',
          '--course', need(body, 'course'), '--json',
        ])
        sendJson(res, 200, JSON.parse(out))
        return
      }
      if (route === '/grade') {
        const rating = Number(body.rating)
        if (!Number.isInteger(rating) || rating < 1 || rating > 4) throw new Error('rating must be 1-4')
        // 面板学完直连单条补录（learn grade 写权威库+投影），不依赖工作单；
        // 节点名不含 /（Windows 非法字符已全角化），「课程/节点」定位无歧义。
        const spec = `${need(body, 'course')}/${need(body, 'node')}`
        const out = await runLearnhub(['learn', 'grade', spec, String(rating)])
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
        const { path, node, course } = await resolveNote(need(body, 'path'))
        const bodyText = await feedbackBody(`${VAULT}/${path}`)
        if (!bodyText) throw new Error('请先在笔记「内容反馈」区写下你的问题与建议，再提交。')
        sendJson(res, 200, { message: await runLearnhub(['content', 'feedback', node, '--course', course]) })
        return
      }
      if (route === '/proposals/apply') {
        const kind = need(body, 'kind')
        const argv = kind === 'edit' ? ['graph', 'apply-edit', '--json'] : ['graph', 'apply-gen', '--json']
        if (body.id !== undefined) argv.push('--id', String(body.id))
        sendJson(res, 200, JSON.parse(await runLearnhub(argv)))
        return
      }
      if (route === '/proposals/reject') {
        const id = Number(body.id)
        if (!Number.isInteger(id)) throw new Error('missing required field: id')
        const argv = ['graph', 'reject', String(id)]
        if (typeof body.note === 'string' && body.note.trim()) argv.push('--note', body.note.trim())
        sendJson(res, 200, { message: await runLearnhub(argv) })
        return
      }
      if (route === '/generate') {
        // 单次非流式：模型写完整课正文（30–90s），请求挂起直到完成
        sendJson(res, 200, {
          message: await generateContent(ctx, need(body, 'course'), need(body, 'node')),
        })
        return
      }
      if (route === '/ai-grade') {
        sendJson(res, 200, await aiGrade(
          ctx, need(body, 'course'), need(body, 'node'), needText(body, 'ex'),
          typeof body.answer === 'string' ? body.answer : ''))
        return
      }
      if (route === '/review') {
        sendJson(res, 200, {
          message: await runLearnhub(['content', 'review', need(body, 'node'), '--course', need(body, 'course')]),
        })
        return
      }
    }
    sendJson(res, 404, { error: `unknown route: ${req.method} ${route}` })
  } catch (err) {
    sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) })
  }
}

export function apply(ctx: Context, config?: { provider?: string; model?: string }) {
  // provider/model 来自 cordis.yml config（缺省用当前默认模型）
  if (config?.provider) llmCfg.provider = config.provider
  if (config?.model) llmCfg.model = config.model
  // —— agent 工具面 ——
  const textOutput = {
    schema: { type: 'string' } as const,
    render: (_args: unknown, value: unknown) => [{ type: 'text' as const, text: String(value) }],
  }
  ctx.tools.register(defineTool({
    name: 'learnhub_status',
    description: 'Return the learning center status (center summary + per-course detail) as JSON.',
    parameters: {},
    output: textOutput,
    execute: () => runLearnhub(['learn', 'status', '--json']),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_today',
    description: 'Generate today\'s worksheet (会话/YYYY-MM-DD.md) aggregating all enabled courses.',
    parameters: {
      minutes: { type: 'number', description: 'Available minutes today (default 25)' },
    },
    output: textOutput,
    execute: args => runLearnhub(
      args.minutes === undefined
        ? ['learn', 'today']
        : ['learn', 'today', '--minutes', String(Math.round(args.minutes))],
    ),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_settle',
    description: 'Settle today\'s worksheet into the review system (per-section course attribution, audit-gated). Ratings must already be written into the worksheet.',
    parameters: {},
    output: textOutput,
    execute: () => runLearnhub(['learn', 'settle']),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_grade',
    description: 'Backfill a single 1-4 rating for a node (1=forgot, 2=hard, 3=normal, 4=easy). Use "course/node" when the node name is ambiguous across courses.',
    parameters: {
      node: { type: 'string', required: true, description: 'Node name, or "course/node" to disambiguate' },
      rating: { type: 'number', required: true, description: 'Rating 1-4' },
    },
    output: textOutput,
    execute: args => runLearnhub(['learn', 'grade', args.node, String(args.rating)]),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_exercises',
    description: 'Fetch the exercise list of a course node as JSON (no answers). Fields: ex, q, difficulty, check (sympy|choice|ai|human), uses, options (choice only).',
    parameters: {
      node: { type: 'string', required: true, description: 'Node name' },
      course: { type: 'string', required: true, description: 'Course name' },
    },
    output: textOutput,
    execute: args => runLearnhub(['learn', 'exercises', args.node, '--course', args.course, '--json']),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_lesson',
    description: 'Fetch one node\'s lesson pack as JSON: course body split into teaching sections (练习/反馈 excluded, 答案 merged into 例题), its exercises, prereqs, and suggested next nodes. Use this to teach a node step by step.',
    parameters: {
      node: { type: 'string', required: true, description: 'Node name' },
      course: { type: 'string', required: true, description: 'Course name' },
    },
    output: textOutput,
    execute: args => runLearnhub(['learn', 'lesson', args.node, '--course', args.course, '--json']),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_recommend',
    description:
      'Get the dynamic cross-course recommendation queue as JSON: next events (review/learning/new lesson) ranked by the priority rule (overdue reviews first by days overdue and retention decay, then half-finished lessons, then new lessons by unlock count and region rotation). Each event has type/course/node/score/why. Fetch the next batch after finishing one.',
    parameters: {
      limit: { type: 'number', description: 'Max events to return (default 5)' },
    },
    output: textOutput,
    execute: args => runLearnhub(
      args.limit === undefined
        ? ['learn', 'recommend', '--json']
        : ['learn', 'recommend', '--limit', String(Math.round(args.limit)), '--json'],
    ),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_check',
    description: 'Judge one exercise answer. sympy/choice return correct boolean; ai returns {"judge":"ai","q","answer":rubric} without recording (the panel route /ai-grade does the model call); human returns {"judge":"human","answer":reference} for self-grading.',
    parameters: {
      node: { type: 'string', required: true, description: 'Node name' },
      ex: { type: 'string', required: true, description: 'Exercise number, e.g. "ex1"' },
      answer: { type: 'string', required: true, description: 'User answer ("" for human exercises)' },
      course: { type: 'string', required: true, description: 'Course name' },
    },
    output: textOutput,
    execute: args => runLearnhub([
      'learn', 'check', args.node, args.ex, '--answer', args.answer, '--course', args.course, '--json',
    ]),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_rebuild',
    description: 'Run audit gate + generation (audit + build) for all enabled courses, or one course.',
    parameters: {
      course: { type: 'string', description: 'Course name; omit to rebuild all enabled courses' },
    },
    output: textOutput,
    execute: args => runLearnhub(args.course ? ['all', '--course', args.course] : ['all']),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_feedback',
    description: 'Submit content feedback of a course note: reads the note「内容反馈」section and marks the node for regeneration queue.',
    parameters: {
      path: { type: 'string', required: true, description: 'Note path, vault-relative or absolute' },
    },
    output: textOutput,
    execute: async args => {
      const { path, node, course } = await resolveNote(args.path)
      const body = await feedbackBody(`${VAULT}/${path}`)
      if (!body) throw new Error('请先在笔记「内容反馈」区写下你的问题与建议，再提交。')
      return await runLearnhub(['content', 'feedback', node, '--course', course])
    },
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_writeback',
    description: 'D15: write a 1-4 rating into the rating line of today\'s worksheet for one node. This is the only scheduling file write allowed outside the engine.',
    parameters: {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name' },
      rating: { type: 'number', required: true, description: 'Rating 1-4' },
    },
    output: textOutput,
    execute: async args => JSON.stringify(await writeBack(args.course, args.node, args.rating)),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_note_resolve',
    description: 'Resolve a course note: read its frontmatter node and map the path to its enabled course via 课程注册表.yaml.',
    parameters: {
      path: { type: 'string', required: true, description: 'Note path, vault-relative or absolute' },
    },
    output: textOutput,
    execute: async args => JSON.stringify(await resolveNote(args.path)),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_graph_analyze',
    description:
      'Analyze a course knowledge graph (networkx): structural stats, lapse hotspots, unreachable nodes, bottlenecks, plus cytoscape render elements. Returns JSON. Run this before proposing graph edits.',
    parameters: {
      course: { type: 'string', description: 'Course name; omit when only one course is enabled' },
      elementsOnly: { type: 'boolean', description: 'Only output cytoscape render elements (nodes/edges)' },
    },
    output: textOutput,
    execute: args => {
      const argv = ['graph', 'analyze']
      if (args.course) argv.push('--course', args.course)
      if (args.elementsOnly) argv.push('--elements-only')
      return runLearnhub(argv)
    },
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_graph_propose',
    description:
      'Submit a graph proposal for human review. kind=gen: full course graph YAML (course/mode/regions/blocks/nodes/pre); kind=edit: change ops (add_node/del_node/set_pre/rename/move/set_note). Schema + structure gates reject bad YAML; accepted proposals become pending until applied.',
    parameters: {
      kind: { type: 'string', required: true, description: '"gen" (new/append course graph) or "edit" (change ops)' },
      yaml: { type: 'string', required: true, description: 'Full proposal YAML text (GenProposal or EditProposal schema)' },
    },
    output: textOutput,
    execute: args => withTempYaml(args.yaml, file => runLearnhub(
      args.kind === 'edit' ? ['graph', 'propose-edit', file, '--json'] : ['graph', 'propose-gen', file, '--json'],
    )),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_graph_apply',
    description:
      'Decide a pending graph proposal after human review: apply (audit-gated, writes data/*.yaml with rename linkage + journal + snapshot) or reject (kept on record).',
    parameters: {
      kind: { type: 'string', required: true, description: '"gen" or "edit"' },
      id: { type: 'number', description: 'Proposal id; omit for the latest pending of this kind' },
      reject: { type: 'boolean', description: 'true to reject instead of apply' },
      note: { type: 'string', description: 'Rejection reason (recorded)' },
    },
    output: textOutput,
    execute: async args => {
      if (args.reject) {
        if (!args.id) throw new Error('reject requires the proposal id')
        const argv = ['graph', 'reject', String(args.id)]
        if (args.note) argv.push('--note', args.note)
        return await runLearnhub(argv)
      }
      const argv = args.kind === 'edit' ? ['graph', 'apply-edit', '--json'] : ['graph', 'apply-gen', '--json']
      if (args.id) argv.push('--id', String(args.id))
      return await runLearnhub(argv)
    },
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_exercises_gen',
    description:
      'Generate exercises for a course node: validates the ExerciseSet YAML (sympy answer parseability, uses in graph) then writes into the note practice section. Answers must be sympy-parseable for check=sympy items.',
    parameters: {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name (must match the node field inside the YAML)' },
      yaml: { type: 'string', required: true, description: 'ExerciseSet YAML text (node/mode/exercises[q,answer,check,difficulty,uses])' },
    },
    output: textOutput,
    execute: args => withTempYaml(args.yaml, file => runLearnhub(
      ['content', 'gen-exercises', args.node, file, '--course', args.course],
    )),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub_generate',
    description:
      'Generate one course note via the model: assembles the context pack (prereqs, domain boundary, forbidden concepts) + the user-editable prompt template (state/提示词/课程生成.md), calls the model, and applies the result through the quality gates as a draft (status=draft, awaiting human review).',
    parameters: {
      course: { type: 'string', required: true, description: 'Course name' },
      node: { type: 'string', required: true, description: 'Node name to generate' },
    },
    output: textOutput,
    execute: args => generateContent(ctx, args.course, args.node),
  }))
  ctx.tools.register(defineTool({
    name: 'learnhub',
    description:
      'Run any learnhub learning-engine CLI command and return its output (escape hatch for the full surface: audit/build/all/migrate/course/learn/content). ' +
      'Examples: "learn status --json", "course list", "content queue --course 数学".',
    parameters: {
      command: {
        type: 'string',
        required: true,
        description: 'CLI arguments after "python -m learnhub", e.g. "learn status --json"',
      },
    },
    output: textOutput,
    execute: args => runLearnhub(args.command.trim().split(/\s+/)),
  }))

  // —— 客户端面板 HTTP 路由 ——
  ctx.effect(
    () => ctx.webServer.register({ kind: 'prefix', path: API, handler: (req, res) => handleApi(ctx, req, res) }),
    'learnhub: client panel API routes',
  )

  // —— 独立面板页面（仪表盘 + 做题面板，移植 OB 双视图）——
  ctx.effect(
    () => ctx.webServer.register({
      kind: 'exact',
      path: PAGE,
      handler: async (_req, res) => {
        try {
          const html = await readFile(PAGE_FILE, 'utf8')
          res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
          res.end(html)
        } catch (err) {
          res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
          res.end(`learnhub page missing: ${err instanceof Error ? err.message : String(err)}`)
        }
      },
    }),
    'learnhub: dashboard + practice page',
  )

  console.log(`[learnhub] plugin loaded: 18 tools registered, page at ${PAGE}, API at ${API}/*`)

  // 加载自检：不依赖模型直接跑一次 status --json，验证引擎通路。
  void runLearnhub(['learn', 'status', '--json'])
    .then(out => console.log(`[learnhub] self-check status --json OK (${out.length} bytes)`))
    .catch(err => console.error(`[learnhub] self-check FAILED: ${err.message}`))
}
