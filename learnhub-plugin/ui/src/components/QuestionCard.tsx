/** 四题型作答卡（移植自 allo QuestionDialogs 的交互骨架）：
 * single_choice / multi_choice / true_false 本地判卷、fill_in_blank 走引擎
 * 自动判卷（llm → 降级）。结果内联展示判卷反馈。 */
import { Button, Checkbox, Input, Message, Radio, Tag, Typography } from '@arco-design/web-react'
import { useState } from 'react'
import { api } from '../api'
import type { QuestionItem } from '../types'

const { Text } = Typography

export interface AnswerOutcome {
  correct: boolean | null
  judge: string
  feedback?: string
}

const KIND_LABEL: Record<QuestionItem['kind'], string> = {
  single_choice: '单选', multi_choice: '多选', fill_in_blank: '填空', true_false: '判断',
}

export default function QuestionCard(props: {
  course: string
  node: string
  question: QuestionItem
  /** 作答完成（无论对错）→ 父级刷新统计/驱动复习流。 */
  onDone?: (outcome: AnswerOutcome) => void
}) {
  const { question: q } = props
  const [choice, setChoice] = useState<string>('')
  const [multi, setMulti] = useState<string[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [outcome, setOutcome] = useState<AnswerOutcome | null>(null)
  const [redoToken, setRedoToken] = useState(0)

  const canSubmit = !busy && (
    q.kind === 'single_choice' ? choice !== ''
      : q.kind === 'multi_choice' ? multi.length > 0
        : q.kind === 'true_false' ? choice !== ''
          : text.trim() !== ''
  )

  const submit = async () => {
    setBusy(true)
    try {
      const answer = q.kind === 'multi_choice'
        ? multi.sort().join('|')
        : q.kind === 'true_false' ? (choice === 'T' ? 'true' : 'false')
          : q.kind === 'fill_in_blank' ? text.trim()
            : choice
      const res = await api.questionAnswer(props.course, props.node, q.id, answer)
      const oc: AnswerOutcome = { correct: res.correct ?? null, judge: res.judge, feedback: res.feedback }
      setOutcome(oc)
      props.onDone?.(oc)
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const redo = () => {
    setOutcome(null)
    setChoice('')
    setMulti([])
    setText('')
    setRedoToken(t => t + 1)
  }

  return (
    <div key={redoToken} style={{
      border: '1px solid var(--color-border-2,#e5e6eb)', borderRadius: 8,
      padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Tag size='small' color='arcoblue'>{KIND_LABEL[q.kind]}</Tag>
        <Text type='secondary' style={{ fontSize: 12 }}>难度 {q.difficulty} · #{q.no}</Text>
      </div>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{q.q}</div>

      {q.kind === 'single_choice' && (
        <Radio.Group value={choice} onChange={v => setChoice(v)} direction='vertical' disabled={!!outcome}>
          {(q.options ?? []).map((opt, i) => (
            <Radio key={i} value={String.fromCharCode(65 + i)}>{String.fromCharCode(65 + i)}. {opt}</Radio>
          ))}
        </Radio.Group>
      )}
      {q.kind === 'multi_choice' && (
        <Checkbox.Group value={multi} onChange={v => setMulti(v as string[])} direction='vertical' disabled={!!outcome}>
          {(q.options ?? []).map((opt, i) => (
            <Checkbox key={i} value={String.fromCharCode(65 + i)}>{String.fromCharCode(65 + i)}. {opt}</Checkbox>
          ))}
        </Checkbox.Group>
      )}
      {q.kind === 'true_false' && !outcome && (
        <Radio.Group value={choice} onChange={v => setChoice(v)}>
          <Radio value='T'>正确</Radio>
          <Radio value='F'>错误</Radio>
        </Radio.Group>
      )}
      {q.kind === 'fill_in_blank' && (
        <Input.TextArea
          value={text} onChange={setText} placeholder='输入答案'
          autoSize={{ minRows: 1, maxRows: 4 }} disabled={!!outcome} />
      )}

      {!outcome ? (
        <Button type='primary' size='small' loading={busy} disabled={!canSubmit} onClick={() => void submit()}
          style={{ alignSelf: 'flex-start' }}>提交</Button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {outcome.correct === true && <Tag color='green'>答对了</Tag>}
            {outcome.correct === false && <Tag color='red'>答错了</Tag>}
            {outcome.correct === null && outcome.correct !== undefined && <Tag>已记录</Tag>}
            <Text type='secondary' style={{ fontSize: 12 }}>判卷：{outcome.judge}</Text>
            <Button size='mini' type='text' onClick={redo}>重新提交</Button>
          </div>
          {outcome.feedback && (
            <div style={{
              background: 'var(--color-fill-1,#f7f8fa)', borderRadius: 6, padding: '6px 10px',
              fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap',
            }}>{outcome.feedback}</div>
          )}
        </div>
      )}
    </div>
  )
}
