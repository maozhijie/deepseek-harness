/**
 * 端到端写路径测试：把 学习中心 的最小子集复制到临时目录，在副本上跑
 * 题库保存/作答/工作单生成/评分/结算/审计/doctor 全链路，绝不触碰真实 vault。
 * 用法：node scripts/e2e.mjs <vault 路径>
 */
import { mkdirSync, cpSync, rmSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { LearnhubEngine } from '../lib/engine.js'

const vault = process.argv[2]
if (!vault) {
  console.error('usage: node scripts/e2e.mjs <vault>')
  process.exit(1)
}
const scratch = join(tmpdir(), `learnhub-e2e-${process.pid}`)
rmSync(scratch, { recursive: true, force: true })
mkdirSync(scratch, { recursive: true })
const srcCenter = join(vault, '学习中心')
const dstCenter = join(scratch, '学习中心')
// 最小子集：注册表 + 图数据 + 一份课程笔记（自然数）
mkdirSync(join(dstCenter, '数学', 'state'), { recursive: true })
mkdirSync(join(dstCenter, 'state'), { recursive: true })
cpSync(join(srcCenter, '课程注册表.yaml'), join(dstCenter, '课程注册表.yaml'))
cpSync(join(srcCenter, '数学', 'data'), join(dstCenter, '数学', 'data'), { recursive: true })
const noteName = '自然数'
function findNote(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      const hit = findNote(p)
      if (hit) return hit
    } else if (e.name === `${noteName}.md`) return p
  }
  return null
}
const srcNote = findNote(join(srcCenter, '数学', '课程'))
if (srcNote) {
  const rel = srcNote.slice(srcCenter.length + 1)
  mkdirSync(dirname(join(dstCenter, rel)), { recursive: true })
  // 重置 frontmatter 为未学状态：真实 vault 的笔记可能已有 fsrs/practice 历史，
  // 而 grade/reps/journal 断言依赖「首次学习」语义（CRLF 正文一并统一为 LF）。
  const text = readFileSync(srcNote, 'utf8')
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, '')
  const fresh = [
    '---',
    `node: ${noteName}`,
    'stage: ready',
    'fsrs: null',
    'mastery: 0',
    'content:',
    '  version: 0',
    '  generated_at: null',
    '  status: draft',
    'practice:',
    '  attempts: 0',
    '  correct: 0',
    '---',
    '',
    body.replace(/\r\n/g, '\n'),
  ].join('\n')
  writeFileSync(join(dstCenter, rel), fresh, 'utf8')
}

let failed = 0
const step = async (name, fn) => {
  try {
    await fn()
    console.log(`OK  ${name}`)
  } catch (err) {
    failed++
    console.error(`FAIL ${name}: ${err.message}`)
  }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed') }

async function run() {
  const engine = new LearnhubEngine({ vault: scratch })
  await step('questionSave', async () => {
    const r = await engine.questionSave('数学', noteName, [
      'node: ' + noteName,
      'questions:',
      '  - id: q1',
      '    kind: single_choice',
      '    q: 0 是不是自然数？',
      '    options: ["A. 是","B. 不是"]',
      '    answer: A',
      '    explanation: 我国中小学教材规定 0 是自然数。',
      '  - id: q2',
      '    kind: fill_in_blank',
      '    q: 最小的自然数是____。',
      '    answer: ["0","零"]',
    ].join('\n'))
    assert(r.count === 2 && existsSync(r.path), 'bank file not written')
  })
  await step('questions(list)', async () => {
    const r = await engine.questions('数学', noteName)
    assert(r.questions.length === 2 && r.questions[0].id === 'q1', 'bank list mismatch')
    assert(!('answer' in r.questions[0]), 'answers must not leak in list')
  })
  await step('questionAnswer 正确(single_choice)', async () => {
    const r = await engine.questionAnswer(async () => { throw new Error('should not call llm') }, '数学', noteName, 'q1', 'A')
    assert(r.correct === true && r.score === 100, `expected correct, got ${JSON.stringify(r)}`)
    assert(r.explanation.includes('0 是自然数'), 'explanation missing')
  })
  await step('questionAnswer 错误(fill_in_blank)', async () => {
    const r = await engine.questionAnswer(async () => { throw new Error('should not call llm') }, '数学', noteName, 'q2', '1')
    assert(r.correct === false, 'expected wrong answer')
    assert(String(r.answer).includes('0'), 'correct answer not revealed')
  })
  await step('practice 证据落盘（frontmatter EMA + JSONL）', async () => {
    const { state } = await engine.loadView({ name: '数学', root: '数学' })
    const fm = state[noteName]
    assert(fm.practice.attempts === 2, `attempts=${fm.practice.attempts}`)
    assert(fm.practice.correct === 1, `correct=${fm.practice.correct}`)
    assert(fm.practice_ema > 0 && fm.practice_ema < 1, `ema=${fm.practice_ema}`)
    const practiceTxt = readFileSync(join(dstCenter, 'state', 'practice.jsonl'), 'utf8')
    assert(practiceTxt.includes('"qid":"q1"'), 'practice jsonl missing qid')
  })
  await step('today 工作单生成', async () => {
    const r = await engine.today(25)
    assert(r.message.includes('工作单已生成'), r.message)
  })
  await step('settle 无评分条目 → 拒绝', async () => {
    const r = await engine.settle()
    assert(r.code === 1 && r.message.includes('没有已评分条目'), r.message)
  })
  await step('grade 单条补录 → fsrs/journal', async () => {
    const out = await engine.grade(`数学/${noteName}`, 3)
    assert(out.includes('[grade]'), out)
    const { state } = await engine.loadView({ name: '数学', root: '数学' })
    assert(state[noteName].fsrs && state[noteName].fsrs.reps === 1, 'fsrs not applied')
    assert(state[noteName].stage === 'review', `stage=${state[noteName].stage}`)
    const journalTxt = readFileSync(join(dstCenter, 'state', 'journal.jsonl'), 'utf8')
    assert(journalTxt.includes('"kind":"learn"'), 'journal missing learn row')
  })
  await step('statusJson 反映到期', async () => {
    const doc = await engine.statusJson()
    const c = doc.courses[0]
    assert(c.total > 0 && typeof c.due_today === 'number', 'status shape broken')
  })
  await step('rebuild（审计 + 就绪清单）', async () => {
    const r = await engine.rebuild()
    assert(r.message.includes('审计'), r.message)
    assert(existsSync(join(dstCenter, '数学', '审计报告.md')), 'audit report missing')
    assert(existsSync(join(dstCenter, '数学', '就绪清单.md')), 'ready list missing')
  })
  await step('doctor', async () => {
    const doc = await engine.doctor()
    assert(doc.courses.length === 1, 'doctor shape')
  })
  await step('graph edit propose→apply（rename 联动：笔记改名+题库随迁）', async () => {
    const prop = await engine.graphPropose('edit', [
      'course: 数学',
      'reason: e2e rename 联动验证',
      'ops:',
      `  - { op: rename, node: ${noteName}, new: 自然数B }`,
    ].join('\n'))
    const applied = await engine.graphApply('edit', prop.id)
    assert(applied.renames && applied.renames[noteName] === '自然数B', 'rename not applied')
    const { state } = await engine.loadView({ name: '数学', root: '数学' })
    assert(state['自然数B'] && !state[noteName], 'note not relinked (frontmatter scan)')
    assert(existsSync(join(dstCenter, '数学', '题库', '自然数B.yaml')), 'bank not migrated')
    assert(!existsSync(join(dstCenter, '数学', '题库', `${noteName}.yaml`)), 'old bank file still there')
  })
  console.log(failed ? `\n${failed} step(s) FAILED (scratch: ${scratch})` : `\nall e2e steps OK (scratch: ${scratch})`)
  rmSync(scratch, { recursive: true, force: true })
  process.exit(failed ? 1 : 0)
}

await run()
