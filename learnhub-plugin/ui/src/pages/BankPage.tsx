/** 题目管理：全库浏览 / 筛选 / 编辑 / 自建 / 归档 + 题目标签。 */
import { Button, Drawer, Empty, Input, Message, Select, Space, Switch, Table, Tag, Typography } from '@arco-design/web-react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import type { AppFrame } from '../App'
import type { BankEntry } from '../types'

const { Text } = Typography

const KIND_LABEL: Record<string, string> = {
  single_choice: '单选', multi_choice: '多选', fill_in_blank: '填空', true_false: '判断',
}

/** 自建题表单（四题型动态字段）。 */
function CreateQuestionForm(props: { course: string; nodes: string[]; onDone: () => void }) {
  const [node, setNode] = useState(props.nodes[0] ?? '')
  const [kind, setKind] = useState('true_false')
  const [q, setQ] = useState('')
  const [options, setOptions] = useState('')
  const [answer, setAnswer] = useState('')
  const [explanation, setExplanation] = useState('')
  const [difficulty, setDifficulty] = useState(1)
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!node || !q.trim()) { Message.warning('节点与题干必填'); return }
    setBusy(true)
    try {
      const question: Record<string, unknown> = { kind, q: q.trim(), difficulty, explanation: explanation.trim() || undefined }
      if (kind === 'true_false') question.answer = answer.trim() === 'true'
      else if (kind === 'fill_in_blank') question.answer = answer.split('|').map(s => s.trim()).filter(Boolean)
      else {
        question.answer = answer.trim()
        question.options = options.split('\n').map(s => s.trim()).filter(Boolean)
      }
      const r = await api.questionAdd(props.course, node, question)
      Message.success(`已添加 ${r.id}（题库共 ${r.count} 题）`)
      props.onDone()
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Space direction='vertical' style={{ width: '100%' }} size={10}>
      <Select value={node} onChange={setNode} placeholder='选择节点' style={{ width: '100%' }}>
        {props.nodes.map(n => <Select.Option key={n} value={n}>{n}</Select.Option>)}
      </Select>
      <Select value={kind} onChange={setKind} style={{ width: 160 }}>
        {Object.entries(KIND_LABEL).map(([k, v]) => <Select.Option key={k} value={k}>{v}</Select.Option>)}
      </Select>
      <Input.TextArea value={q} onChange={setQ} placeholder='题干（支持 LaTeX 文本）' autoSize={{ minRows: 2, maxRows: 6 }} />
      {(kind === 'single_choice' || kind === 'multi_choice') && (
        <Input.TextArea value={options} onChange={setOptions} placeholder='选项，每行一个（A/B/C 自动编号）'
          autoSize={{ minRows: 3, maxRows: 8 }} />
      )}
      <Input
        value={answer} onChange={setAnswer}
        placeholder={kind === 'true_false' ? '答案：true / false'
          : kind === 'fill_in_blank' ? '可接受答案，用 | 分隔多个'
            : '正确答案（选项字母，多选用 | 分隔）'} />
      <Input value={explanation} onChange={setExplanation} placeholder='解析（可选）' />
      <Space size={10}>
        <Text>难度</Text>
        <Select value={difficulty} onChange={setDifficulty} style={{ width: 90 }}>
          {[1, 2, 3].map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
        </Select>
      </Space>
      <Button type='primary' loading={busy} onClick={() => void submit()}>添加（过 schema 门禁后落盘）</Button>
    </Space>
  )
}

export default function BankPage({ frame }: { frame: AppFrame }) {
  const [entries, setEntries] = useState<BankEntry[] | null>(null)
  const [filterCourse, setFilterCourse] = useState<string | undefined>()
  const [search, setSearch] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [editing, setEditing] = useState<BankEntry | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    try {
      const r = await api.questionsAll(filterCourse)
      setEntries(r.questions)
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }, [filterCourse])

  useEffect(() => { void load() }, [load])

  const nodesForCourse = filterCourse
    ? (frame.tree?.courses.find(c => c.name === filterCourse)?.regions ?? [])
      .flatMap(r => r.blocks.flatMap(b => b.nodes.map(n => n.node)))
    : []

  const visible = (entries ?? []).filter(e =>
    (showArchived || !e.archived)
    && (!search || e.q.includes(search) || e.node.includes(search)))

  const doArchive = async (e: BankEntry, archived: boolean) => {
    try {
      await api.questionArchive(e.course, e.node, e.qid, archived)
      await load()
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <Space direction='vertical' style={{ width: '100%' }} size={12}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <Select value={filterCourse} onChange={v => setFilterCourse(v)} placeholder='全部课程' style={{ width: 180 }} allowClear>
          {frame.tree?.courses.map(c => <Select.Option key={c.name} value={c.name}>{c.name}</Select.Option>)}
        </Select>
        <Input value={search} onChange={setSearch} placeholder='搜题干/节点' style={{ width: 220 }} allowClear />
        <Space size={6}><Text>显示已归档</Text><Switch checked={showArchived} onChange={setShowArchived} /></Space>
        <Button type='primary' size='small' style={{ marginLeft: 'auto' }}
          disabled={!filterCourse} onClick={() => setCreating(true)}>自建题</Button>
      </div>

      {entries === null ? null : visible.length === 0 ? (
        <Empty description='没有题目：选择课程后点「自建题」，或让 agent 出题（learnhub_question_save 工具）' />
      ) : (
        <Table size='small' data={visible} rowKey={e => `${e.course}/${e.node}/${e.qid}`}
          columns={[
            { title: '课程', dataIndex: 'course', width: 110 },
            { title: '节点', dataIndex: 'node', width: 170, ellipsis: true },
            { title: '#', dataIndex: 'qid', width: 54 },
            { title: '题型', width: 70, render: (_, e) => <Tag size='small'>{KIND_LABEL[e.kind] ?? e.kind}</Tag> },
            { title: '题干', dataIndex: 'q', ellipsis: true },
            { title: '状态', width: 80, render: (_, e) => e.archived
              ? <Tag size='small' color='gray'>已归档</Tag>
              : <Tag size='small' color='green'>在库</Tag> },
            { title: '操作', width: 150, render: (_, e) => (
              <Space size={4}>
                <Button size='mini' type='text' onClick={() => setEditing(e)}>编辑</Button>
                {e.archived
                  ? <Button size='mini' type='text' onClick={() => void doArchive(e, false)}>恢复</Button>
                  : <Button size='mini' type='text' status='warning' onClick={() => void doArchive(e, true)}>归档</Button>}
              </Space>
            ) },
          ]}
          pagination={{ pageSize: 20, showTotal: true }} />
      )}

      <Drawer width={480} visible={creating} footer={null} unmountOnExit
        title={`自建题 · ${filterCourse ?? ''}`} onCancel={() => setCreating(false)}>
        {filterCourse && (
          <CreateQuestionForm course={filterCourse} nodes={nodesForCourse}
            onDone={() => { setCreating(false); void load() }} />
        )}
      </Drawer>

      <EditDrawer entry={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void load() }} />
    </Space>
  )
}

/** 编辑抽屉：题干/答案/解析/难度。 */
function EditDrawer(props: { entry: BankEntry | null; onClose: () => void; onSaved: () => void }) {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState('')
  const [explanation, setExplanation] = useState('')
  const [difficulty, setDifficulty] = useState(1)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (props.entry) {
      const e = props.entry
      setQ(e.q)
      setAnswer('')
      setExplanation('')
      setDifficulty(e.difficulty)
    }
  }, [props.entry])

  const save = async () => {
    if (!props.entry) return
    setBusy(true)
    try {
      // 题目列表接口不含答案（防泄漏）；答案留空 = 不修改，填写才覆盖
      const patch: Record<string, unknown> = { q: q.trim(), difficulty }
      if (explanation.trim()) patch.explanation = explanation.trim()
      if (answer.trim()) {
        if (props.entry.kind === 'true_false') patch.answer = answer.trim() === 'true'
        else if (props.entry.kind === 'fill_in_blank') patch.answer = answer.split('|').map(s => s.trim()).filter(Boolean)
        else patch.answer = answer.trim()
      }
      await api.questionUpdate(props.entry.course, props.entry.node, props.entry.qid, patch)
      Message.success('已保存（validateBank 门禁通过）')
      props.onSaved()
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Drawer width={480} visible={!!props.entry} footer={null} unmountOnExit
      title={`编辑 ${props.entry?.qid ?? ''} · ${props.entry?.node ?? ''}`} onCancel={props.onClose}>
      {props.entry && (
        <Space direction='vertical' style={{ width: '100%' }} size={10}>
          <Text type='secondary'>
            {props.entry.kind === 'true_false' ? '答案 true/false' : '答案请与选项字母/可接受值一致（门禁会校验）'}
          </Text>
          {props.entry.options && (
            <Space size={4} wrap>{props.entry.options.map((o, i) => (
              <Tag key={i} size='small'>{String.fromCharCode(65 + i)}. {o}</Tag>
            ))}</Space>
          )}
          <Input.TextArea value={q} onChange={setQ} autoSize={{ minRows: 2, maxRows: 6 }} />
          <Input value={answer} onChange={setAnswer} placeholder='答案（留空则不修改）' />
          <Input value={explanation} onChange={setExplanation} placeholder='解析（可选，留空不修改）' />
          <Button type='primary' loading={busy} onClick={() => void save()}>保存</Button>
        </Space>
      )}
    </Drawer>
  )
}
