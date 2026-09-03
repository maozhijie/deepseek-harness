/**
 * 开发验证服务器（不随插件分发）：直调 lib/engine.js 伺服面板与 API 子集，
 * 用于在不启动完整 dsh web 的情况下浏览器走查面板（引擎与路由与 host 同源）。
 * 用法：node scripts/dev-server.mjs <vault> [port]
 * 注意：无模型 seam——reflection AI 判卷走引擎降级规则；/generate 与 /ai-grade 不可用。
 */
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LearnhubEngine } from '../lib/engine.js'

const vault = process.argv[2]
const port = Number(process.argv[3] ?? 3210)
if (!vault) {
  console.error('usage: node scripts/dev-server.mjs <vault> [port]')
  process.exit(1)
}
const PAGE_FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'web', 'index.html')
const engine = new LearnhubEngine({ vault })
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' }

function sendJson(res, code, body) {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

async function readJson(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  const text = Buffer.concat(chunks).toString('utf8')
  return text ? JSON.parse(text) : {}
}

const need = (b, k) => {
  const v = b[k]
  if (typeof v !== 'string' || !v.trim()) throw new Error(`missing required field: ${k}`)
  return v.trim()
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const path = url.pathname
  try {
    if (req.method === 'GET' && path === '/learnhub') {
      const html = await readFile(PAGE_FILE, 'utf8')
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' })
      res.end(html)
      return
    }
    if (!path.startsWith('/learnhub/api/')) {
      res.writeHead(404).end()
      return
    }
    const route = path.slice('/learnhub/api'.length)
    const q = (k) => url.searchParams.get(k) ?? undefined
    if (req.method === 'GET') {
      switch (route) {
        case '/status': return sendJson(res, 200, await engine.statusJson())
        case '/courses': return sendJson(res, 200, (await engine.enabledCourses()).map(c => ({ name: c.name, root: c.root, enabled: String(c.enabled !== false) })))
        case '/courses/tree': return sendJson(res, 200, await engine.coursesTree(q('course')))
        case '/exercises': return sendJson(res, 200, await engine.exercises(need({ course: q('course') }, 'course'), need({ node: q('node') }, 'node')))
        case '/lesson': return sendJson(res, 200, await engine.lesson(q('course'), need({ node: q('node') }, 'node')))
        case '/recommend': return sendJson(res, 200, await engine.recommend(Number(q('limit') ?? 5)))
        case '/queue': return sendJson(res, 200, await engine.queueItemsAll())
        case '/questions': return sendJson(res, 200, await engine.questions(q('course'), need({ node: q('node') }, 'node')))
        case '/file': {
          const rel = (q('path') ?? '').replace(/\\/g, '/').replace(/^\/+/, '')
          if (rel.includes('..')) throw new Error('path traversal rejected')
          const mime = MIME[rel.slice(rel.lastIndexOf('.')).toLowerCase()]
          if (!mime) throw new Error(`unsupported file type`)
          const buf = await readFile(`${vault}/${rel}`)
          res.writeHead(200, { 'content-type': mime, 'cache-control': 'public, max-age=3600' })
          res.end(buf)
          return
        }
        case '/note': return sendJson(res, 200, await engine.resolveNote(vault, need({ path: q('path') }, 'path'), '学习中心'))
        case '/graph': return sendJson(res, 200, await engine.graphAnalyze(q('course'), url.searchParams.get('elements') === '1'))
        case '/proposals': return sendJson(res, 200, await engine.graphProposals())
        case '/doctor': return sendJson(res, 200, await engine.doctor())
      }
    } else if (req.method === 'POST') {
      const body = await readJson(req)
      switch (route) {
        case '/today': return sendJson(res, 200, { message: (await engine.today(typeof body.minutes === 'number' ? body.minutes : 25)).message })
        case '/settle': {
          const r = await engine.settle()
          if (r.code !== 0) throw new Error(r.message)
          return sendJson(res, 200, { message: r.message })
        }
        case '/rebuild': return sendJson(res, 200, { message: (await engine.rebuild()).message })
        case '/check': return sendJson(res, 200, await engine.check(need(body, 'course'), need(body, 'node'), Number(body.ex), typeof body.answer === 'string' ? body.answer : ''))
        case '/grade': {
          const rating = Number(body.rating)
          if (!Number.isInteger(rating) || rating < 1 || rating > 4) throw new Error('rating must be 1-4')
          return sendJson(res, 200, { message: await engine.grade(`${need(body, 'course')}/${need(body, 'node')}`, rating) })
        }
        case '/question-answer':
          // dev-server 无模型：reflection 走引擎的「非空即对」降级；其余题型机器判卷
          return sendJson(res, 200, await engine.questionAnswer(async () => { throw new Error('dev-server 无模型') }, need(body, 'course'), need(body, 'node'), need(body, 'qid'), typeof body.answer === 'string' ? body.answer : ''))
        case '/proposals/apply': return sendJson(res, 200, await engine.graphApply(need(body, 'kind') === 'edit' ? 'edit' : 'gen', body.id !== undefined ? Number(body.id) : undefined))
        case '/proposals/reject': {
          const id = Number(body.id)
          await engine.graphReject(id, typeof body.note === 'string' ? body.note.trim() : '')
          return sendJson(res, 200, { message: `[reject] 提案 #${id} 已拒绝留痕。` })
        }
        case '/review': return sendJson(res, 200, { message: await engine.contentReview(need(body, 'course'), need(body, 'node')) })
      }
      throw new Error(`dev-server 未实现该路由（完整环境用 dsh web）: POST ${route}`)
    }
    sendJson(res, 404, { error: `unknown route: ${req.method} ${route}` })
  } catch (err) {
    sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) })
  }
}).listen(port, () => {
  console.log(`[learnhub-dev] http://localhost:${port}/learnhub  vault=${vault}`)
})
