/**
 * 给 自然数 节点写入门题库（走引擎 question-save 门禁，D14 合规）。
 * 用法：node scripts/seed-bank.mjs <vault>
 */
import { LearnhubEngine } from '../lib/engine.js'

const vault = process.argv[2]
const engine = new LearnhubEngine({ vault })
const r = await engine.questionSave('数学', '自然数', [
  'node: 自然数',
  'questions:',
  '  - id: q1',
  '    kind: single_choice',
  '    q: 0 是不是自然数？',
  '    options: ["A. 是","B. 不是"]',
  '    answer: A',
  '    explanation: 现行中小学教材规定 0 是自然数：它表示「一个也没有」，是最小的自然数。',
  '    difficulty: 1',
  '  - id: q2',
  '    kind: fill_in_blank',
  '    q: 最小的自然数是____。',
  '    answer: ["0","零"]',
  '    explanation: 自然数从 0 开始一个接一个排下去，没有最大的，只有最小的。',
  '    difficulty: 1',
  '  - id: q3',
  '    kind: true_false',
  '    q: 「自然数有无穷多个」这句话对吗？',
  '    answer: true',
  '    explanation: 每个自然数都有唯一的后继 n+1，所以数不完。',
  '    difficulty: 2',
].join('\n'))
console.log(`bank written: ${r.count} questions -> ${r.path}`)
