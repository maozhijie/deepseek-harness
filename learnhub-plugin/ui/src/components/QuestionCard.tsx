/** 三题型作答卡（allo evaluate 交互）：single_choice / true_false 选项作答、
 * fill_in_blank / reflection 文本作答；全部提交引擎判卷。结果内联展示判卷反馈；
 * 作答即驱动该题 FSRS 调度（对=Good、错=Again）。 */
import { Button, Input, Message, Radio, Tag, Typography } from '@arco-design/web-react'
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
  single_choice: '单选', fill_in_blank: '填空', true_false: '判断', reflection: '反思',
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
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [outcome, setOutcome] = useState<AnswerOutcome | null>(null)
  const [redoToken, setRedoToken] = useState(0)

  const textKind = q.kind === 'fill_in_blank' || q.kind === 'reflection'
  const canSubmit = !busy && (textKind ? text.trim() !== '' : choice !== '')

  const submit = async () => {
    setBusy(true)
    try {
      const answer = q.kind === 'true_false' ? (choice === 'T' ? 'true' : 'false')
        : textKind ? text.trim()
          : choice
      const res = await api.questionAnswer(props.course, props.node, q.id, answer)
      if (res.scheduled === false) {
        Message.info('该题今日已推进过复习调度，本次仅记录练习统计')
      }
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

      {(q.kind === 'single_choice' || q.kind === 'true_false') && (
        q.kind === 'single_choice' ? (
          <Radio.Group value={choice} onChange={v => setChoice(v)} direction='vertical' disabled={!!outcome}>
            {(q.options ?? []).map((opt, i) => (
              <Radio key={i} value={String.fromCharCode(65 + i)}>{String.fromCharCode(65 + i)}. {opt}</Radio>
            ))}
          </Radio.Group>
        ) : (
          <Radio.Group value={choice} onChange={v => setChoice(v)} disabled={!!outcome}>
            <Radio value='T'>正确</Radio>
            <Radio value='F'>错误</Radio>
          </Radio.Group>
        )
      )}
      {textKind && (
        <Input.TextArea
          value={text} onChange={setText}
          placeholder={q.kind === 'reflection' ? '写下你的回答（AI 按评分要点判卷）' : '输入答案'}
          autoSize={{ minRows: 1, maxRows: 6 }} disabled={!!outcome} />
      )}

      {!outcome ? (
        <Button type='primary' size='small' loading={busy} disabled={!canSubmit} onClick={() => void submit()}
          style={{ alignSelf: 'flex-start' }}>提交</Button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {outcome.correct === true && <Tag color='green'>答对了</Tag>}
            {outcome.correct === false && <Tag color='red'>答错了</Tag>}
            {outcome.correct === null && <Tag>已记录</Tag>}
            <Text type='secondary' style={{ fontSize: 12 }}>判卷：{outcome.judge}</Text>
            <Button size='mini' type='text' onClick={redo}>再做一次</Button>
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
