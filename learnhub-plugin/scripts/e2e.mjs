/**
 * 端到端写路径测试：把 学习中心 的最小子集复制到临时目录，在副本上跑
 * 题库保存/作答/工作单生成/评分/结算/审计/doctor/面板扩展接口 全链路，绝不触碰真实 vault。
 * 种子课程动态探测（注册表第一门启用课），课程名不硬编码。
 * 用法：node scripts/e2e.mjs <vault 路径>
 */
import { mkdirSync, cpSync, rmSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, basename } from 'node:path'
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

// 种子课程动态探测：注册表第一门启用课（真实 vault 的课程名不固定）
const probe = new LearnhubEngine({ vault })
const seed = (await probe.enabledCourses())[0]
if (!seed) {
  console.error('e2e: 注册表里没有启用中的课程，无法取种子')
  process.exit(1)
}
const courseName = seed.name
const courseRoot = seed.root
// 最小子集：单课程注册表 + 该课图数据 + 一份课程笔记（重置为未学状态）
mkdirSync(join(dstCenter, courseRoot, 'state'), { recursive: true })
mkdirSync(join(dstCenter, 'state'), { recursive: true })
writeFileSync(
  join(dstCenter, '课程注册表.yaml'),
  ['courses:', `  - id: ${seed.id ?? `${courseRoot}-01`}`, `    name: ${courseName}`, `    root: ${courseRoot}`, '    enabled: true', ''].join('\n'),
  'utf8',
)
cpSync(join(srcCenter, courseRoot, 'data'), join(dstCenter, courseRoot, 'data'), { recursive: true })
function findNote(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      const hit = findNote(p)
      if (hit) return hit
    } else if (e.name.endsWith('.md')) return p
  }
  return null
}
const srcNote = findNote(join(srcCenter, courseRoot, '课程'))
if (!srcNote) {
  console.error('e2e: 种子课程没有课程笔记，无法取节点')
  process.exit(1)
}
const noteName = basename(srcNote).replace(/\.md$/, '')
{
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
    const r = await engine.questionSave(courseName, noteName, [
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
    const r = await engine.questions(courseName, noteName)
    assert(r.questions.length === 2 && r.questions[0].id === 'q1', 'bank list mismatch')
    assert(!('answer' in r.questions[0]), 'answers must not leak in list')
  })
  await step('questionAnswer 正确(single_choice)', async () => {
    const r = await engine.questionAnswer(async () => { throw new Error('should not call llm') }, courseName, noteName, 'q1', 'A')
    assert(r.correct === true && r.score === 100, `expected correct, got ${JSON.stringify(r)}`)
    assert(r.explanation.includes('0 是自然数'), 'explanation missing')
  })
  await step('questionAnswer 错误(fill_in_blank)', async () => {
    const r = await engine.questionAnswer(async () => { throw new Error('should not call llm') }, courseName, noteName, 'q2', '1')
    assert(r.correct === false, 'expected wrong answer')
    assert(String(r.answer).includes('0'), 'correct answer not revealed')
  })
  await step('practice 证据落盘（frontmatter EMA + JSONL）', async () => {
    const { state } = await engine.loadView({ name: courseName, root: courseRoot })
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
    const out = await engine.grade(`${courseName}/${noteName}`, 3)
    assert(out.includes('[grade]'), out)
    const { state } = await engine.loadView({ name: courseName, root: courseRoot })
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
    assert(existsSync(join(dstCenter, courseRoot, '审计报告.md')), 'audit report missing')
    assert(existsSync(join(dstCenter, courseRoot, '就绪清单.md')), 'ready list missing')
  })
  await step('doctor', async () => {
    const doc = await engine.doctor()
    assert(doc.courses.length === 1, 'doctor shape')
  })
  await step('checkin/calendar/tags/questionsAll（面板扩展接口）', async () => {
    const ck = await engine.checkinToday()
    assert(ck.journal >= 1, `checkin journal=${ck.journal}`)
    const cal = await engine.calendarStats(new Date().getFullYear())
    assert(cal.days.some(d => d.total > 0), 'calendar has no activity day')
    await engine.setCourseTags(courseName, ['e2e-tag'])
    const tags = await engine.listTags()
    assert(tags.includes('e2e-tag'), 'course tag missing')
    await engine.questionAdd(courseName, noteName, { kind: 'true_false', q: '追加题', answer: false, tags: ['e2e-q'] })
    await engine.setQuestionTags(courseName, noteName, 'q1', ['入门'])
    const all = await engine.questionsAll()
    assert(all.total === 3, `questionsAll total=${all.total}`)
    assert(!('answer' in all.questions[0]), 'answers must not leak in questionsAll')
    await engine.questionArchive(courseName, noteName, 'q3', true)
    const vis = await engine.questions(courseName, noteName)
    assert(vis.questions.every(q => q.id !== 'q3'), 'archived question still visible')
    await engine.questionUpdate(courseName, noteName, 'q2', { difficulty: 3 })
  })
  await step('graph edit propose→apply（rename 联动：笔记改名+题库随迁）', async () => {
    const prop = await engine.graphPropose('edit', [
      `course: ${courseName}`,
      'reason: e2e rename 联动验证',
      'ops:',
      `  - { op: rename, node: ${noteName}, new: ${noteName}B }`,
    ].join('\n'))
    const applied = await engine.graphApply('edit', prop.id)
    assert(applied.renames && applied.renames[noteName] === `${noteName}B`, 'rename not applied')
    const { state } = await engine.loadView({ name: courseName, root: courseRoot })
    assert(state[`${noteName}B`] && !state[noteName], 'note not relinked (frontmatter scan)')
    assert(existsSync(join(dstCenter, courseRoot, '题库', `${noteName}B.yaml`)), 'bank not migrated')
    assert(!existsSync(join(dstCenter, courseRoot, '题库', `${noteName}.yaml`)), 'old bank file still there')
  })
  await step('courseDelete（移入 .trash）', async () => {
    const r = await engine.courseDelete(courseName)
    assert(r.removed === courseName && existsSync(r.trash), 'trash dir missing')
    assert((await engine.registry.load()).length === 0, 'registry not emptied')
  })
  console.log(failed ? `\n${failed} step(s) FAILED (scratch: ${scratch})` : `\nall e2e steps OK (scratch: ${scratch})`)
  rmSync(scratch, { recursive: true, force: true })
  process.exit(failed ? 1 : 0)
}

await run()
