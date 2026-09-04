/** 节点学习视图（最大最丰富的主学习容器）：
 * 正文分节大区域渲染 + 练习区（四题型作答）+ 自评条；按状态引导下一步
 * （无正文→生成正文；有正文无题→AI 出题；有题→直接练习）；生成/出题
 * 进行中轮询任务状态；「在图中查看」低频跳转全局 DAG 并定位。 */
import { Button, Card, Empty, Message, Space, Spin, Tag, Typography } from '@arco-design/web-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../api'
import type { AppFrame } from '../App'
import type { GenJobItem, QuestionItem } from '../types'
import QuestionCard from './QuestionCard'
import { mdToHtml } from './md'

const { Text, Title } = Typography

const RATING_BTNS: Array<{ rating: number; label: string; color?: string }> = [
  { rating: 1, label: '忘了', color: 'red' },
  { rating: 2, label: '困难' },
  { rating: 3, label: '良好' },
  { rating: 4, label: '简单', color: 'green' },
]

const STAGE_LABEL: Record<string, { label: string; color: string }> = {
  unseen: { label: '未学', color: 'gray' },
  ready: { label: '就绪', color: 'blue' },
  learning: { label: '进行中', color: 'arcoblue' },
  review: { label: '复习', color: 'green' },
  mastered: { label: '已掌握', color: 'green' },
}

export default function LessonView(props: { course: string; node: string; frame: AppFrame }) {
  const { course, node, frame } = props
  const [sections, setSections] = useState<Array<{ title: string; md: string }> | null>(null)
  const [meta, setMeta] = useState<{ stage: string; mastery: number } | null>(null)
  const [questions, setQuestions] = useState<QuestionItem[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [job, setJob] = useState<GenJobItem | null>(null)
  const [reloadTick, setReloadTick] = useState(0)
  const jobRef = useRef<GenJobItem | null>(null)

  const refresh = useCallback(async () => {
    setSections(null)
    setQuestions(null)
    try {
      const [lesson, bank] = await Promise.all([
        api.lesson(node, course).catch(() => null),
        api.questions(course, node).catch(() => null),
      ])
      setSections(lesson?.sections ?? [])
      setMeta(lesson ? { stage: lesson.stage, mastery: lesson.mastery } : null)
      setQuestions(bank?.questions ?? [])
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }, [course, node])

  useEffect(() => { void refresh() }, [refresh])

  // 生成/出题进行中：轮询本节点任务（running 时 3s，空闲停）
  const poll = useCallback(async () => {
    try {
      const jobs = await api.generateStatus()
      const mine = jobs.find(j =>
        j.course === course && j.node === node && (j.status === 'running' || j.status === 'cancelling'))
        ?? jobs.find(j => j.course === course && j.node === node) ?? null
      jobRef.current = mine
      setJob(mine)
      return mine
    } catch {
      return null
    }
  }, [course, node])

  useEffect(() => {
    let stopped = false
    let timer: ReturnType<typeof setTimeout>
    const tick = async () => {
      const mine = await poll()
      if (stopped) return
      const active = mine && (mine.status === 'running' || mine.status === 'cancelling')
      timer = setTimeout(() => void tick(), active ? 3000 : 15000)
    }
    void tick()
    return () => { stopped = true; clearTimeout(timer) }
  }, [poll, reloadTick])

  const generate = async () => {
    setBusy('generate')
    try {
      const res = await api.generate(course, node)
      Message.success(res.message)
      await Promise.all([refresh(), frame.reload()])
      setReloadTick(t => t + 1)
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
      await Promise.all([poll(), refresh()])
    } finally {
      setBusy(null)
    }
  }

  const makeQuestions = async () => {
    setBusy('quiz')
    try {
      const r = await api.questionGenerate(course, node, 6)
      Message.success(`已出题 ${r.added} 道（题库共 ${r.total}）`)
      await refresh()
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  const rate = async (rating: number) => {
    setBusy(`rate-${rating}`)
    try {
      const res = await api.writeback(course, node, rating)
      Message.success(res.message)
      await frame.reload()
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  const hasContent = !!sections?.length
  const hasQuestions = !!questions?.length
  const active = job && (job.status === 'running' || job.status === 'cancelling')
  const elapsed = job ? Math.round((Date.now() - new Date(job.startedAt).getTime()) / 1000) : 0
  const stageInfo = meta ? STAGE_LABEL[meta.stage] ?? STAGE_LABEL.unseen : null

  // 状态引导：单一主按钮
  let nextAction: { label: string; onClick: () => void; loading: boolean } | null = null
  if (active) nextAction = null
  else if (!hasContent) nextAction = { label: '生成正文（自动出题）', onClick: () => void generate(), loading: busy === 'generate' }
  else if (!hasQuestions) nextAction = { label: 'AI 出题（6 道混合题型）', onClick: () => void makeQuestions(), loading: busy === 'quiz' }

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Space size={10} align='center' wrap>
        <Button size='small' type='text' onClick={frame.closeLesson}>← 推荐流</Button>
        <Title heading={4} style={{ margin: 0 }}>{node}</Title>
        {stageInfo && <Tag color={stageInfo.color}>{stageInfo.label}</Tag>}
        {meta && <Text type='secondary' style={{ fontSize: 12 }}>掌握度 {(meta.mastery * 100).toFixed(0)}%</Text>}
        <div style={{ marginLeft: 'auto' }}>
          <Button size='small' type='outline' onClick={() => frame.locateInGraph(node)}>在图中查看</Button>
        </div>
      </Space>

      {/* 生成/出题进行中：阶段 + 耗时 + 取消 */}
      {active && job && (
        <div style={{
          border: '1px solid var(--color-primary-3,#94bfff)', background: 'var(--color-primary-light-1,#e8f3ff)',
          borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Spin size={20} />
          <Text>
            {job.phase === 'quiz' ? '自动出题中' : '正文生成中'}（已 {elapsed}s）——
            {job.phase === 'quiz' ? '出题完成后即可练习' : '正文落盘后会自动出题，请稍候'}
          </Text>
          <Button size='mini' type='text' status='danger' style={{ marginLeft: 'auto' }}
            onClick={async () => {
              try {
                await api.generateCancel(course, node)
                Message.success('已请求取消')
                void poll()
              } catch (err) { Message.error(err instanceof Error ? err.message : String(err)) }
            }}>取消</Button>
        </div>
      )}
      {!active && job && (job.status === 'failed' || job.message?.includes('失败')) && (
        <div style={{
          border: '1px solid var(--color-danger-3,#f76560)', background: 'var(--color-danger-light-1,#ffece8)',
          borderRadius: 8, padding: '10px 14px',
        }}>
          <Text>{job.status === 'failed' ? '上次生成失败' : '部分完成'}：{job.message}</Text>
        </div>
      )}

      {/* 状态引导：单一主按钮 */}
      {nextAction && (
        <Button type='primary' size='large' loading={nextAction.loading} onClick={nextAction.onClick}
          style={{ alignSelf: 'flex-start' }}>
          {nextAction.label}
        </Button>
      )}

      {/* 正文（大区域） */}
      <Card title='课程内容' size='small' style={{ borderRadius: 10 }}>
        {sections === null ? <Spin dot /> : sections.length === 0
          ? <Empty description='还没有正文。点上方「生成正文」，正文落盘后自动出题。' />
          : (
            <div className='md-body' style={{ fontSize: 15 }}>
              {sections.map((s, i) => (
                <div key={i}>
                  {s.title && <h2 style={{ marginTop: i === 0 ? 0 : 18 }}>{s.title}</h2>}
                  <div dangerouslySetInnerHTML={{ __html: mdToHtml(s.md) }} />
                </div>
              ))}
            </div>
          )}
      </Card>

      {/* 练习区（大区域） */}
      <Card title={`练习${questions?.length ? `（${questions.length} 题）` : ''}`} size='small' style={{ borderRadius: 10 }}
        extra={hasContent && !active && (
          <Button size='mini' type='text' loading={busy === 'quiz'} onClick={() => void makeQuestions()}>
            AI 再出 6 道
          </Button>
        )}>
        {questions === null ? <Spin dot /> : questions.length === 0
          ? <Empty description={hasContent ? '还没有题目：点上方「AI 出题」生成一组混合题型练习' : '生成正文后会自动出题'} />
          : (
            <Space direction='vertical' style={{ width: '100%' }} size={14}>
              {questions.map(q => (
                <QuestionCard key={q.id} course={course} node={node} question={q}
                  onDone={() => void frame.reload()} />
              ))}
            </Space>
          )}
      </Card>

      {/* 自评条 */}
      <Card title='自评' size='small' style={{ borderRadius: 10 }}
        extra={<Text type='secondary' style={{ fontSize: 12 }}>无题或复习时按回忆质量评分；写入今日工作单，结算后驱动调度</Text>}>
        <Space size={10}>
          {RATING_BTNS.map(b => (
            <Button key={b.rating} loading={busy === `rate-${b.rating}`} color={b.color}
              onClick={() => void rate(b.rating)}>
              {b.rating} · {b.label}
            </Button>
          ))}
        </Space>
      </Card>
    </div>
  )
}
