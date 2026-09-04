/**
 * 开发验证服务器（不随插件分发）：直调 lib/engine.js 伺服面板与全部 API，
 * 用于在不启动完整 dsh web 的情况下浏览器走查面板（引擎与路由与 host 同源）。
 * 用法：node scripts/dev-server.mjs <vault> [port]
 * 注意：无模型 seam——reflection AI 判卷走引擎降级规则；/generate 与 /ai-grade 不可用。
 */
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join, resolve, sep, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LearnhubEngine } from '../lib/engine.js'

const vault = process.argv[2]
const port = Number(process.argv[3] ?? 3210)
if (!vault) {
  console.error('usage: node scripts/dev-server.mjs <vault> [port]')
  process.exit(1)
}
const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'web', 'dist')
const engine = new LearnhubEngine({ vault })
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.json': 'application/json; charset=utf-8',
}
const FILE_MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' }

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
    // —— 面板 SPA（web/dist，与 host 同逻辑：资产 immutable，index.html no-store）——
    if (path === '/learnhub' || path.startsWith('/learnhub/')) {
      if (!path.startsWith('/learnhub/api/')) {
        // 无尾斜杠的 /learnhub 会把 base './' 的资产解析到根路径（404）→ 统一重定向
        if (path === '/learnhub') {
          res.writeHead(301, { location: '/learnhub/' })
          res.end()
          return
        }
        const rel = decodeURIComponent(path.slice('/learnhub'.length).replace(/^\/+/, '')) || 'index.html'
        let file = resolve(DIST, rel)
        if (!(file + sep).startsWith(DIST)) file = join(DIST, 'index.html')
        let data
        try {
          data = await readFile(file)
        } catch {
          file = join(DIST, 'index.html')
          data = await readFile(file)
        }
        const ext = file.slice(file.lastIndexOf('.')).toLowerCase()
        res.writeHead(200, {
          'content-type': MIME[ext] ?? 'application/octet-stream',
          'cache-control': rel.startsWith('assets/') ? 'public, max-age=31536000, immutable' : 'no-store',
        })
        res.end(data)
        return
      }
    } else {
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
        case '/lesson': return sendJson(res, 200, await engine.lesson(q('course'), need({ node: q('node') }, 'node')))
        case '/recommend': return sendJson(res, 200, await engine.recommend(Number(q('limit') ?? 5)))
        case '/queue': return sendJson(res, 200, await engine.queueItemsAll())
        case '/questions': return sendJson(res, 200, await engine.questions(q('course'), need({ node: q('node') }, 'node')))
        case '/questions-all': return sendJson(res, 200, await engine.questionsAll(q('course')))
        case '/file': {
          const rel = (q('path') ?? '').replace(/\\/g, '/').replace(/^\/+/, '')
          if (rel.includes('..')) throw new Error('path traversal rejected')
          const mime = FILE_MIME[rel.slice(rel.lastIndexOf('.')).toLowerCase()]
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
        case '/generate/status': return sendJson(res, 200, [])
      }
    } else if (req.method === 'PUT') {
      const body = await readJson(req)
      switch (route) {
        case '/question-update': {
          const patch = typeof body.patch === 'object' && body.patch !== null ? body.patch : {}
          return sendJson(res, 200, await engine.questionUpdate(need(body, 'course'), need(body, 'node'), need(body, 'qid'), patch))
        }
      }
    } else if (req.method === 'POST') {
      const body = await readJson(req)
      switch (route) {
        case '/rebuild': return sendJson(res, 200, { message: (await engine.rebuild()).message })
        case '/node/skip': return sendJson(res, 200, await engine.nodeSkip(need(body, 'course'), need(body, 'node'), body.skipped !== false))
        case '/node/complete': return sendJson(res, 200, await engine.nodeComplete(need(body, 'course'), need(body, 'node')))
        case '/question-answer':
          // dev-server 无模型：reflection 走引擎的「非空即对」降级；其余题型机器判卷
          return sendJson(res, 200, await engine.questionAnswer(async () => { throw new Error('dev-server 无模型') }, need(body, 'course'), need(body, 'node'), need(body, 'qid'), typeof body.answer === 'string' ? body.answer : ''))
        case '/question-add': {
          const question = typeof body.question === 'object' && body.question !== null ? body.question : null
          if (!question) throw new Error('missing required field: question')
          return sendJson(res, 200, await engine.questionAdd(need(body, 'course'), need(body, 'node'), question))
        }
        case '/question-archive': return sendJson(res, 200, await engine.questionArchive(need(body, 'course'), need(body, 'node'), need(body, 'qid'), body.archived === true))
        case '/course/delete': return sendJson(res, 200, await engine.courseDelete(need(body, 'course')))
        case '/generate/cancel': return sendJson(res, 200, { cancelled: false })
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
  console.log(`[learnhub-dev] http://localhost:${port}/learnhub  vault=${vault}  dist=${existsSync(DIST) ? 'ok' : 'MISSING (run npm run build)'}`)
})
