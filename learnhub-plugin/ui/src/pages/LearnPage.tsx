/** 学习页（默认首屏）：打卡横幅 + 就绪推荐 + 课程卡网格 + 复习会话。
 * 移植 allo 学习页编排（ReviewBanner/CourseCard/ReviewSession），
 * 复习语义映射 learnhub：作答对→rating3、错/忘→rating1，自评 1-4，跳过不落分。 */
import {
  Alert, Button, Card, Drawer, Empty, Input, Message, Modal, Progress, Space,
  Tag, Typography,
} from '@arco-design/web-react'
import { useCallback, useEffect, useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import { api } from '../api'
import type { AppFrame } from '../App'
import type { CheckinDoc, QuestionItem, RecEvent, RecommendDoc } from '../types'

const { Text, Title } = Typography

const RATING_BTNS: Array<{ rating: number; label: string }> = [
  { rating: 1, label: '忘了' }, { rating: 2, label: '困难' },
  { rating: 3, label: '良好' }, { rating: 4, label: '简单' },
]

/** 打卡横幅：今日行为计数 + 近 14 日迷你热力 + 开始复习。 */
function CheckinBanner({ checkin, dueCount, onStart }: {
  checkin: CheckinDoc | null
  dueCount: number
  onStart: () => void
}) {
  return (
    <Card size='small' style={{ borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <Text type='secondary' style={{ display: 'block', fontSize: 12 }}>今日打卡</Text>
          <Text style={{ fontSize: 20, fontWeight: 600, color: checkin?.checked ? 'var(--color-success-6,#00b42a)' : 'var(--color-text-2,#4e5969)' }}>
            {checkin?.checked ? '已完成' : '未开始'}
          </Text>
        </div>
        <div>
          <Text type='secondary' style={{ display: 'block', fontSize: 12 }}>今日行为</Text>
          <Text style={{ fontSize: 20, fontWeight: 600 }}>{checkin?.total ?? 0}</Text>
        </div>
        <div>
          <Text type='secondary' style={{ display: 'block', fontSize: 12 }}>待复习</Text>
          <Text style={{ fontSize: 20, fontWeight: 600 }}>{dueCount}</Text>
        </div>
        <Button type='primary' onClick={onStart} disabled={dueCount === 0} style={{ marginLeft: 'auto' }}>
          开始复习（{dueCount}）
        </Button>
      </div>
    </Card>
  )
}

/** 课程卡：进度 + 五态计数 + 操作（打开学习图 / 复习 / 标签 / 删除）。 */
function CourseCard(props: {
  name: string
  counts: { unseen: number; ready: number; learning: number; review: number; mastered: number }
  total: number
  due: number
  tags: string[]
  onOpen: () => void
  onReview: () => void
  onTags: () => void
  onDelete: () => void
}) {
  const done = props.counts.mastered + props.counts.review
  const percent = props.total ? Math.round((done / props.total) * 100) : 0
  return (
    <Card size='small' hoverable style={{ borderRadius: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Title heading={6} style={{ margin: 0 }}>{props.name}</Title>
        <Progress percent={percent} showText size='small' />
        <Space size={4} wrap>
          <Tag size='small' color='gray'>未学 {props.counts.unseen}</Tag>
          <Tag size='small' color='arcoblue'>进行 {props.counts.learning + props.counts.ready}</Tag>
          <Tag size='small' color='green'>复习 {props.counts.review}</Tag>
          <Tag size='small' color='green'>掌握 {props.counts.mastered}</Tag>
          {props.due > 0 && <Tag size='small' color='red'>到期 {props.due}</Tag>}
        </Space>
        {props.tags.length > 0 && (
          <Space size={4} wrap>
            {props.tags.map(t => <Tag key={t} size='small' color='purple'>{t}</Tag>)}
          </Space>
        )}
        <Space size={6}>
          <Button size='mini' type='primary' onClick={props.onOpen}>打开学习图</Button>
          <Button size='mini' onClick={props.onReview}>复习</Button>
          <Button size='mini' type='text' onClick={props.onTags}>标签</Button>
          <Button size='mini' type='text' status='danger' onClick={props.onDelete}>删除</Button>
        </Space>
      </div>
    </Card>
  )
}

/** 复习会话：逐条刷卡（题库作答或自评），对→3 错/忘→1，跳过不落分。 */
function ReviewSession(props: {
  queue: RecEvent[]
  onClose: () => void
  onFinish: () => Promise<void>
}) {
  const [idx, setIdx] = useState(0)
  const [questions, setQuestions] = useState<QuestionItem[] | null>(null)
  const [busy, setBusy] = useState(false)
  const item = props.queue[idx]

  const loadQuestions = useCallback(async () => {
    setQuestions(null)
    if (!item) return
    try {
      const bank = await api.questions(item.course, item.node)
      setQuestions(bank.questions)
    } catch {
      setQuestions([])
    }
  }, [item])

  useEffect(() => { void loadQuestions() }, [loadQuestions])

  if (!item) return null

  const rate = async (rating: number) => {
    setBusy(true)
    try {
      await api.writeback(item.course, item.node, rating)
      setIdx(i => i + 1)
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const onAnswered = async (o: { correct: boolean | null; judge: string; feedback?: string }) => {
    // 判卷落地：对→良好(3)、错→忘了(1)、无法判卷→不落分留给自评
    if (o.correct === true) await rate(3)
    else if (o.correct === false) await rate(1)
  }

  const finish = async () => {
    await props.onFinish()
    props.onClose()
  }

  return (
    <Modal
      title={`复习会话 ${idx + 1}/${props.queue.length}`} visible footer={null} unmountOnExit
      onCancel={() => { if (!busy) void finish() }} style={{ width: 620 }}>
      <Space direction='vertical' style={{ width: '100%' }} size={12}>
        <div>
          <Text type='secondary'>{item.course} · </Text>
          <Text bold>{item.node}</Text>
          {item.why && <Text type='secondary' style={{ display: 'block', fontSize: 12 }}>{item.why}</Text>}
        </div>
        {questions === null ? <Text type='secondary'>加载题库…</Text>
          : questions.length > 0 ? (
            questions.map(q => (
              <QuestionCard key={q.id} course={item.course} node={item.node} question={q}
                onDone={correct => void onAnswered(correct)} />
            ))
          ) : (
            <Alert type='info' content='该节点没有题库：按回忆质量自评（1 忘了 ~ 4 简单）' />
          )}
        <Space size={8} wrap>
          {RATING_BTNS.map(b => (
            <Button key={b.rating} size='small' disabled={busy} onClick={() => void rate(b.rating)}>
              {b.rating} · {b.label}
            </Button>
          ))}
          <Button size='small' type='text' onClick={() => setIdx(i => i + 1)}>跳过</Button>
        </Space>
      </Space>
    </Modal>
  )
}

/** 标签编辑抽屉（课程级）。 */
function TagEditor(props: { course: string; initial: string[]; allTags: string[]; onClose: () => void; onSaved: () => Promise<void> }) {
  const [value, setValue] = useState(props.initial.join(','))
  const [busy, setBusy] = useState(false)
  const save = async () => {
    setBusy(true)
    try {
      const tags = value.split(/[,，]/).map(s => s.trim()).filter(Boolean)
      await api.setCourseTags(props.course, tags)
      Message.success('标签已保存')
      await props.onSaved()
      props.onClose()
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Drawer width={420} visible onCancel={props.onClose} footer={null} title={`标签 · ${props.course}`} unmountOnExit>
      <Space direction='vertical' style={{ width: '100%' }} size={10}>
        {props.allTags.length > 0 && (
          <Space size={6} wrap>
            {props.allTags.map(t => (
              <Tag key={t} size='small' color='purple' style={{ cursor: 'pointer' }}
                onClick={() => setValue(v => v ? `${v},${t}` : t)}>{t}</Tag>
            ))}
          </Space>
        )}
        <Input value={value} onChange={setValue} placeholder='逗号分隔的标签' />
        <Button type='primary' loading={busy} onClick={() => void save()}>保存</Button>
      </Space>
    </Drawer>
  )
}

/** 建课引导：多轮生成走 dsh agent（技能 learnhub-graph-generate），面板只给入口说明。 */
function CreateDialog(props: { visible: boolean; onClose: () => void }) {
  return (
    <Modal title='生成新课程' visible={props.visible} footer={null} onCancel={props.onClose} style={{ width: 560 }}>
      <Space direction='vertical' size={12}>
        <Alert type='info' content='课程图由 dsh agent 按多轮流程构建（范围分析 → 骨架 → 分批展开 ≤25 ops/批 → 审计修复），保证 200+ 节点与动作句命名。' />
        <Text>在 dsh 对话里直接说：</Text>
        <Input.TextArea
          value='用 learnhub-graph-generate 技能，为我生成课程「<主题>」，起点：<已有基础>，目标：<学会什么>'
          readOnly autoSize={{ minRows: 3, maxRows: 4 }} />
        <Text type='secondary' style={{ fontSize: 12 }}>
          提案生成后回到本面板「提案」页签审阅应用；节点正文用学习图页签的「AI 生成正文」。
        </Text>
      </Space>
    </Modal>
  )
}

export default function LearnPage({ frame }: { frame: AppFrame }) {
  const [checkin, setCheckin] = useState<CheckinDoc | null>(null)
  const [rec, setRec] = useState<RecommendDoc | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])
  const [session, setSession] = useState<RecEvent[] | null>(null)
  const [tagFor, setTagFor] = useState<string | null>(null)
  const [createVisible, setCreateVisible] = useState(false)

  const load = useCallback(async () => {
    const [c, r, t] = await Promise.all([
      api.checkinToday().catch(() => null),
      api.recommend(8).catch(() => null),
      api.tags().catch(() => []),
    ])
    setCheckin(c)
    setRec(r)
    setAllTags(t)
  }, [])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    const h = () => { void frame.reload(); void load() }
    window.addEventListener('learnhub:reload', h)
    return () => window.removeEventListener('learnhub:reload', h)
  }, [frame, load])

  const reviewQueue = (rec?.events ?? []).filter(e => e.type === 'review' || e.type === 'overdue')

  const deleteCourse = (name: string) => {
    Modal.confirm({
      title: `删除课程「${name}」？`,
      content: '注册表移除，课程目录移入 学习中心/.trash/（可手工找回）。',
      onOk: async () => {
        try {
          const r = await api.courseDelete(name)
          Message.success(`已删除 ${r.removed}，目录在 ${r.trash}`)
          await frame.reload()
        } catch (err) {
          Message.error(err instanceof Error ? err.message : String(err))
        }
      },
    })
  }

  return (
    <Space direction='vertical' style={{ width: '100%' }} size={14}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Title heading={4} style={{ margin: 0 }}>学习中心</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Button onClick={() => setCreateVisible(true)}>生成新课程</Button>
        </div>
      </div>
      <CheckinBanner checkin={checkin} dueCount={reviewQueue.length}
        onStart={() => setSession(reviewQueue)} />

      {frame.tree && frame.tree.courses.length === 0 ? (
        <Empty description='还没有课程。点右上角「生成新课程」看引导，然后在 dsh 对话里让 agent 按技能建课。' />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
          {frame.tree?.courses.map(c => {
            const s = frame.status?.courses.find(x => x.name === c.name)
            return (
              <CourseCard
                key={c.name} name={c.name} total={s?.total ?? 0} due={s?.due_today ?? 0}
                counts={s?.counts ?? { unseen: 0, ready: 0, learning: 0, review: 0, mastered: 0 }}
                tags={[]}
                onOpen={() => { frame.setCourse(c.name); frame.goto('graph') }}
                onReview={() => {
                  const q = reviewQueue.filter(e => e.course === c.name)
                  if (!q.length) { Message.info('该课程暂无到期复习'); return }
                  setSession(q)
                }}
                onTags={() => setTagFor(c.name)}
                onDelete={() => deleteCourse(c.name)} />
            )
          })}
        </div>
      )}

      {/* 就绪/新学推荐（非复习流，点击直达节点） */}
      {(rec?.events ?? []).filter(e => e.type !== 'review' && e.type !== 'overdue').length > 0 && (
        <Card size='small' title='下一步建议' style={{ borderRadius: 10 }}>
          <Space size={6} wrap>
            {rec!.events.filter(e => e.type !== 'review' && e.type !== 'overdue').map((e, i) => (
              <Button key={i} size='mini' onClick={() => { frame.setCourse(e.course); frame.goto('graph') }}>
                <Tag size='small' color={e.type === 'new' ? 'cyan' : 'blue'} style={{ marginRight: 6 }}>
                  {e.type === 'new' ? '新学' : e.type}
                </Tag>
                {e.node}
              </Button>
            ))}
          </Space>
        </Card>
      )}

      {session && session.length > 0 && (
        <ReviewSession queue={session} onClose={() => setSession(null)}
          onFinish={async () => { await Promise.all([frame.reload(), load()]) }} />
      )}
      {session && session.length === 0 && (
        <Modal visible footer={null} onCancel={() => setSession(null)} title='复习'>
          <Empty description='当前没有到期复习，先学新节点吧' />
        </Modal>
      )}
      {tagFor && (
        <TagEditor course={tagFor} initial={[]} allTags={allTags} onClose={() => setTagFor(null)}
          onSaved={async () => { await Promise.all([frame.reload(), load()]) }} />
      )}
      <CreateDialog visible={createVisible} onClose={() => setCreateVisible(false)} />
    </Space>
  )
}
