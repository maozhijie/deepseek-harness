/** 面板伺服冒烟：301 重定向 + 资产可达 + 关键 API 形状。用法：node scripts/smoke-panel.mjs [port] */
const port = process.argv[2] ?? '3214'
const base = `http://localhost:${port}`

const r1 = await fetch(`${base}/learnhub`, { redirect: 'manual' })
console.log('no-slash:', r1.status, 'location:', r1.headers.get('location'))
if (r1.status !== 301 || !r1.headers.get('location')?.endsWith('/learnhub/')) {
  console.error('FAIL: no-slash should 301')
  process.exit(1)
}

const r2 = await fetch(`${base}/learnhub/`)
const html = await r2.text()
console.log('slash page:', r2.status, 'has assets ref:', html.includes('./assets/'))

const asset = html.match(/\.\/assets\/[^"]+/)?.[0]
if (!asset) { console.error('FAIL: no asset ref'); process.exit(1) }
const r3 = await fetch(`${base}/learnhub/${asset.slice(2)}`)
console.log('asset:', r3.status, r3.headers.get('content-type'))

const g = await (await fetch(`${base}/learnhub/api/graph?course=MathForGames`)).json()
console.log('graph nodes:', g.nodes?.length, 'edges:', g.edges?.length)
const s = await (await fetch(`${base}/learnhub/api/status`)).json()
console.log('status courses:', s.courses?.length, 'first keys:', Object.keys(s.courses?.[0] ?? {}).join(','))
const t = await (await fetch(`${base}/learnhub/api/courses/tree`)).json()
console.log('tree courses:', t.courses?.length)
console.log('PANEL SMOKE OK')
