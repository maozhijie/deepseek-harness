/** 出题管线冒烟：mock llm 产题库 YAML → questionGenerate 门禁落盘 + id 自动编号。 */
import { cpSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { LearnhubEngine } from '../lib/engine.js'

const vault = 'c:/Users/test/Desktop/Obsidian Vault'
const scratch = join(tmpdir(), 'learnhub-quiz-' + process.pid)
const dst = join(scratch, '学习中心')
cpSync(join(vault, '学习中心', '课程注册表.yaml'), join(dst, '课程注册表.yaml'))
cpSync(join(vault, '学习中心', 'MathForGames'), join(dst, 'MathForGames'), { recursive: true })
const e = new LearnhubEngine({ vault: scratch })
const c0 = (await e.coursesTree('MathForGames')).courses[0]
const n0 = c0.regions[0].blocks[0].nodes[0].node
await e.contentApply('MathForGames', n0, '# 为什么需要它\n\n自然数是计数的基础。\n\n## 定义与性质\n\n自然数从 0 开始。\n\n## 内容反馈\n\n')
const yaml = [
  'node: ' + n0,
  'questions:',
  '  - id: q1',
  '    kind: single_choice',
  '    q: 自然数从几开始？',
  '    options: ["从 0 开始", "从 1 开始", "从 -1 开始"]',
  '    answer: A',
  '    explanation: 教材规定 0 是最小的自然数。',
  '    difficulty: 1',
  '    uses: [自然数]',
  '  - id: q2',
  '    kind: true_false',
  '    q: 0.5 是自然数。',
  '    answer: false',
  '    explanation: 自然数是整数，0.5 是小数。',
  '    difficulty: 1',
  '  - id: q3',
  '    kind: fill_in_blank',
  '    q: 最小的自然数是____。',
  '    answer: ["0", "零"]',
  '    explanation: ——',
  '    difficulty: 2',
].join('\n')
const r = await e.questionGenerate('MathForGames', n0, 6, async () => yaml)
console.log('quiz result:', JSON.stringify(r))
const bank = await e.questions('MathForGames', n0)
console.log('visible:', bank.questions.length, 'kinds:', bank.questions.map(q => q.kind).join(','))
const r2 = await e.questionGenerate('MathForGames', n0, 6, async () => yaml)
console.log('second run ids:', JSON.stringify(r2))
// 作答闭环：对 q1 判卷
const ans = await e.questionAnswer(async () => { throw new Error('no llm') }, 'MathForGames', n0, 'q1', 'A')
console.log('answer q1 correct:', ans.correct)
rmSync(scratch, { recursive: true, force: true })
console.log('QUIZ PIPELINE OK')
