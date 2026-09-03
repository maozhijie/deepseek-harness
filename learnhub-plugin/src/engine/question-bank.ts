/**
 * 题库（P4，抄 allo 题型体系）：课程根/题库/<节点>.yaml，人类可读可手编。
 *
 * schema（单文件一节点）：
 *   node: 自然数
 *   questions:
 *     - id: q1
 *       kind: single_choice | true_false | fill_in_blank | reflection
 *       q: 题干
 *       answer: "B" | true | ["答案1","答案2"] | 评分要点
 *       options: ["A. …","B. …"]        # single_choice 必填
 *       explanation: 解析                # 可选
 *       difficulty: 1-3                  # 可选
 *       uses: [前置技能]                  # 可选
 *
 * 判卷语义 = allo evaluate：对 1.0 / 错 0.0；reflection 走 AI 反思判卷。
 * 作答副作用 = practice 流水 + frontmatter 计数/EMA（调度仍走 D15 settle）。
 */
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { YAML } from './yaml.ts'
import { writeFile } from 'node:fs/promises'
import { normChoice } from './grading.ts'
import type { AlloKind } from './grading.ts'
import type { Paths } from './paths.ts'
import { safeFilename } from './paths.ts'

export interface BankQuestion {
  id: string
  kind: AlloKind
  q: string
  answer: string | boolean | string[]
  options?: string[]
  explanation?: string
  difficulty?: number
  uses?: string[]
}

export interface BankDoc { node: string; questions: BankQuestion[] }

const KINDS: AlloKind[] = ['single_choice', 'true_false', 'fill_in_blank', 'reflection']

/** 题库 schema 校验（手写，错误行风格与引擎其余门禁一致）。 */
export function validateBank(doc: unknown, expectedNode?: string): { errors?: string[]; spec?: BankDoc } {
  const errors: string[] = []
  if (typeof doc !== 'object' || doc === null) return { errors: ['(顶层): 必须是映射'] }
  const d = doc as Record<string, unknown>
  if (typeof d.node !== 'string' || !d.node.trim()) errors.push('node: 不能为空')
  if (!Array.isArray(d.questions) || !d.questions.length) errors.push('questions: 题组为空')
  const questions: BankQuestion[] = []
  if (Array.isArray(d.questions)) {
    d.questions.forEach((raw, i) => {
      const n = i + 1
      if (typeof raw !== 'object' || raw === null) {
        errors.push(`questions.${n}: 必须是映射`)
        return
      }
      const e = raw as Record<string, unknown>
      const id = typeof e.id === 'string' && e.id.trim() ? e.id.trim() : `q${n}`
      if (!KINDS.includes(e.kind as AlloKind)) {
        errors.push(`questions.${n}.kind: 非法题型 ${String(e.kind)}（允许 ${KINDS.join('/')}）`)
        return
      }
      if (typeof e.q !== 'string' || !e.q.trim()) {
        errors.push(`questions.${n}.q: 题干不能为空`)
        return
      }
      const kind = e.kind as AlloKind
      const answer = e.answer
      if (kind === 'single_choice') {
        const options = Array.isArray(e.options) ? e.options.map(String) : []
        const letters = options.map((_, j) => String.fromCharCode(65 + j))
        if (!options.length || typeof answer !== 'string' || !letters.includes(normChoice(answer))) {
          errors.push(`questions.${n}: single_choice 需要 options 且 answer 为合法选项字母（选项 ${options.length} 个）`)
          return
        }
      } else if (kind === 'true_false') {
        if (typeof answer !== 'boolean' && !['true', 'false', '对', '错', '正确', '错误', '是', '否'].includes(String(answer))) {
          errors.push(`questions.${n}: true_false 的 answer 必须是布尔或对/错`)
          return
        }
      } else if (kind === 'fill_in_blank') {
        const accepted = Array.isArray(answer) ? answer.map(String) : typeof answer === 'string' ? [answer] : []
        if (!accepted.length) {
          errors.push(`questions.${n}: fill_in_blank 的 answer 必须是字符串或字符串列表（可接受答案）`)
          return
        }
      } else if (kind === 'reflection') {
        if (typeof answer !== 'string' || !answer.trim()) {
          errors.push(`questions.${n}: reflection 的 answer 必须是评分要点文本`)
          return
        }
      }
      questions.push({
        id,
        kind,
        q: String(e.q).trim(),
        answer: Array.isArray(answer) ? answer.map(String) : answer as string | boolean,
        ...(Array.isArray(e.options) && e.options.length ? { options: e.options.map(String) } : {}),
        ...(typeof e.explanation === 'string' && e.explanation ? { explanation: e.explanation } : {}),
        ...(e.difficulty !== undefined && Number.isInteger(Number(e.difficulty)) ? { difficulty: Number(e.difficulty) } : {}),
        ...(Array.isArray(e.uses) && e.uses.length ? { uses: e.uses.map(String) } : {}),
      })
    })
  }
  if (errors.length) return { errors }
  const spec: BankDoc = { node: (d.node as string).trim(), questions }
  if (expectedNode && spec.node !== expectedNode) {
    return { errors: [`node「${spec.node}」与命令行节点「${expectedNode}」不一致`] }
  }
  return { spec }
}

export class QuestionBank {
  constructor(private paths: Paths) {}

  bankPath(courseRoot: string, node: string): string {
    return `${courseRoot}/题库/${safeFilename(node)}.yaml`
  }

  /** 读某节点题库；文件缺失返回空题库。 */
  async load(courseRoot: string, node: string): Promise<BankDoc> {
    const p = this.bankPath(courseRoot, node)
    if (!existsSync(p)) return { node, questions: [] }
    try {
      const doc = YAML.parse(await import('node:fs/promises').then(m => m.readFile(p, 'utf8')))
      const v = validateBank(doc)
      return v.spec ?? { node, questions: [] }
    } catch {
      return { node, questions: [] }
    }
  }

  /** 校验并写入题库 YAML（LLM 产出过门禁后落盘）。 */
  async save(courseRoot: string, yamlText: string, expectedNode?: string): Promise<{ node: string; count: number; path: string }> {
    const doc = YAML.parse(yamlText)
    const v = validateBank(doc, expectedNode)
    if (v.errors) throw new Error(`[question-save] schema 校验失败，题库未写入。\n${v.errors.map(e => `  ✗ ${e}`).join('\n')}`)
    const spec = v.spec!
    const p = this.bankPath(courseRoot, spec.node)
    await mkdir(p.replace(/[/\\][^/\\]+$/, ''), { recursive: true })
    await writeFile(p, YAML.stringify(doc), 'utf8')
    return { node: spec.node, count: spec.questions.length, path: p }
  }
}
