/** 「问 AI 老师」抽屉：节点范围轻量答疑（host /tutor：本课上下文 system + 前端全量携带的对话历史）。
 * 与 dsh 会话分层——这里即时问答不落盘；深度讨论/修订走「与 AI 讨论本课」开的会话。 */
import { Button, Drawer, Empty, Input, Message, Spin, Typography } from '@arco-design/web-react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../api'
import MdView from './MdView'

const { Text } = Typography

interface Turn { role: 'user' | 'assistant'; content: string }

export default function TutorDrawer(props: {
  course: string
  node: string
  visible: boolean
  onClose: () => void
}) {
  const [messages, setMessages] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // 换节点/重开清空会话（上下文随节点走，跨节点对话无意义）
  useEffect(() => {
    if (props.visible) { setMessages([]); setInput('') }
  }, [props.visible, props.course, props.node])
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  const ask = async () => {
    const text = input.trim()
    if (!text || busy) return
    const next = [...messages, { role: 'user' as const, content: text }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const r = await api.tutor(props.course, props.node, next)
      setMessages(m => [...m, { role: 'assistant', content: r.answer }])
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
      setMessages(messages) // 失败回滚到提问前（输入框已清，错误已提示）
    } finally {
      setBusy(false)
    }
  }

  return (
    <Drawer
      width={480} visible={props.visible} footer={null} unmountOnExit
      headerStyle={{ border: 'none' }}
      title={<Text>问 AI 老师 · {props.node}</Text>}
      onCancel={props.onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: 'calc(100vh - 120px)' }}>
        <div ref={listRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
          {messages.length === 0 && (
            <Empty description='问这道题为什么错、某个概念没看懂、公式怎么来的——老师只答本课范围' />
          )}
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'stretch',
              maxWidth: m.role === 'user' ? '85%' : '100%',
              background: m.role === 'user' ? 'var(--color-primary-light-1,#e8f3ff)' : 'var(--color-fill-1,#f7f8fa)',
              borderRadius: 8, padding: '8px 12px',
            }}>
              {m.role === 'assistant' ? <MdView md={m.content} /> : <Text style={{ whiteSpace: 'pre-wrap' }}>{m.content}</Text>}
            </div>
          ))}
          {busy && <Spin dot style={{ alignSelf: 'flex-start' }} />}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <Input.TextArea
            value={input} onChange={setInput}
            placeholder='问 AI 老师…（Enter 发送）'
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={busy}
            onPressEnter={e => {
              if (!e.shiftKey) { e.preventDefault(); void ask() }
            }} />
          <Button type='primary' loading={busy} disabled={!input.trim()} onClick={() => void ask()}>发送</Button>
        </div>
      </div>
    </Drawer>
  )
}
