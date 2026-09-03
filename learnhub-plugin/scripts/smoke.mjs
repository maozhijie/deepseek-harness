/**
 * 只读冒烟测试：真实 vault 数据过一遍引擎的读路径（不写任何文件）。
 * 用法：node scripts/smoke.mjs <vault 路径>
 */
import { LearnhubEngine } from '../lib/engine.js'

const vault = process.argv[2]
if (!vault) {
  console.error('usage: node scripts/smoke.mjs <vault>')
  process.exit(1)
}

const engine = new LearnhubEngine({ vault })
let failed = 0
const step = async (name, fn) => {
  try {
    const out = await fn()
    const size = typeof out === 'string' ? out.length : JSON.stringify(out).length
    console.log(`OK  ${name} (${size} bytes)`)
  } catch (err) {
    failed++
    console.error(`FAIL ${name}: ${err.message}`)
  }
}

await step('statusJson', () => engine.statusJson())
await step('recommend', () => engine.recommend(5))
await step('doctor', () => engine.doctor())
await step('queueItemsAll', () => engine.queueItemsAll())
await step('graphAnalyze', () => engine.graphAnalyze(undefined, false))
await step('graphAnalyze.elements', () => engine.graphAnalyze(undefined, true))
await step('coursesTree', () => engine.coursesTree())
const courses = await engine.enabledCourses()
console.log(`courses: ${courses.map(c => c.name).join(', ')}`)
if (courses.length) {
  const c = courses[0]
  const { graph } = await engine.loadView(c)
  const node = graph.names[0]
  await step(`exercises(${node})`, () => engine.exercises(c.name, node).catch(e => { throw new Error(e.message) }))
  await step(`lesson(${node})`, () => engine.lesson(c.name, node).catch(e => { throw new Error(e.message) }))
  await step(`contentPack(${node})`, () => engine.contentPack(c.name, node))
  await step(`questions(${node})`, () => engine.questions(c.name, node))
}
console.log(failed ? `\n${failed} step(s) FAILED` : '\nall smoke steps OK')
process.exit(failed ? 1 : 0)
