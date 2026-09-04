/** 节点学习视图（最大最丰富的主学习容器）：
 * 正文分节 MdView 渲染 + 练习区（题目级 FSRS 刷卡：作答即调度）+ 完成确认 +
 * 跳过（已有基础）；按状态引导下一步（无正文→生成正文自动出题；有正文无题→
 * AI 出题；有题→练习→完成）；生成/出题进行中轮询任务状态；「在图中查看」低频跳转。
 * 掌握度 = 该节点题目的作答正确率汇总（无自评）。 */
import { Button, Card, Empty, Message, Popconfirm, Space, Spin, Tag, Typography } from '@arco-design/web-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import MdView from './MdView'
import QuestionCard from './QuestionCard'
import { api } from '../api'
import type { AppFrame } from '../App'
import type { GenJobItem, QuestionItem } from '../types'

const { Text, Title } = Typography

const STAGE_LABEL: Record<string, { label: string; color: string }> = {
  unseen: { label: '未学', color: 'gray' },
  ready: { label: '就绪', color: 'blue' },
  learning: { label: '进行中', color: 'arcoblue' },
  review: { label: '复习', color: 'green' },
  mastered: { label: '已掌握', color: 'green' },
  skipped: { label: '已跳过', color: 'purple' },
}

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function LessonView(props: { course: string; node: string; frame: AppFrame }) {
  const { course, node, frame } = props
  const [sections, setSections] = useState<Array<{ title: string; md: string }> | null>(null)
  const [stage, setStage] = useState<string | null>(null)
  const [mastery, setMastery] = useState(0)
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
      setStage(lesson?.stage ?? null)
      setMastery(bank?.mastery ?? 0)
      setQuestions(bank?.questions ?? [])
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }, [course, node])

  useEffect(() => { void refresh() }, [refresh])

  // 生成/出题进行中：轮询本节点任务（running 时 3s，空闲 15s）
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
    let wasActive = false
    const tick = async () => {
      const mine = await poll()
      if (stopped) return
      const active = !!mine && (mine.status === 'running' || mine.status === 'cancelling')
      // 任务完成边沿（running→终态）：/generate 挂起请求若在出题阶段断开，
      // 出题仍会在服务端后台落盘，这里兜底刷新，避免「重开页面才见题目」。
      if (wasActive && !active) { wasActive = false; void refresh(); void frame.reload() }
      else if (active) wasActive = true
      timer = setTimeout(() => void tick(), active ? 3000 : 15000)
    }
    void tick()
    return () => { stopped = true; clearTimeout(timer) }
  }, [poll, refresh, frame.reload, reloadTick])

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

  const complete = async () => {
    setBusy('complete')
    try {
      const r = await api.nodeComplete(course, node)
      Message.success(`已完成：进入「${STAGE_LABEL[r.stage]?.label ?? r.stage}」${r.initialized ? `，${r.initialized} 道题进入复习循环` : ''}${r.due ? `（下次复习 ${r.due}）` : ''}`)
      await Promise.all([refresh(), frame.reload()])
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  const toggleSkip = async () => {
    setBusy('skip')
    try {
      const skipping = stage !== 'skipped'
      await api.nodeSkip(course, node, skipping)
      Message.success(skipping ? '已跳过：该节点视同已通过，不再出现在推荐与阻塞判定' : '已取消跳过')
      await Promise.all([refresh(), frame.reload()])
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
  const stageInfo = stage ? STAGE_LABEL[stage] ?? STAGE_LABEL.unseen : null
  const today = todayStr()
  // 刷卡排序：到期题优先，未调度题随后，未到期靠后
  const sortedQuestions = questions === null ? null : [...questions].sort((a, b) => {
    const rank = (q: QuestionItem) => (q.due && q.due <= today ? 0 : q.attempts === 0 ? 1 : 2)
    return rank(a) - rank(b)
  })
  const dueCount = questions?.filter(q => q.due && q.due <= today).length ?? 0

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
        <Text type='secondary' style={{ fontSize: 12 }}>掌握度 {(mastery * 100).toFixed(0)}%（题目作答汇总）</Text>
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

      {/* 状态引导：单一主按钮 + 跳过；「完成学习」在练习区下方（做完题再确认） */}
      <Space size={10} wrap>
        {nextAction && (
          <Button type='primary' size='large' loading={nextAction.loading} onClick={nextAction.onClick}>
            {nextAction.label}
          </Button>
        )}
        {!active && (
          <Button size='small' type='text' status='warning' loading={busy === 'skip'} onClick={() => void toggleSkip()}>
            {stage === 'skipped' ? '取消跳过' : '跳过此节点（已有基础）'}
          </Button>
        )}
      </Space>

      {/* 正文（大区域） */}
      <Card title='课程内容' size='small' style={{ borderRadius: 10 }}>
        {sections === null ? <Spin dot /> : sections.length === 0
          ? <Empty description='还没有正文。点上方「生成正文」，正文落盘后自动出题。' />
          : (
            <div style={{ fontSize: 15, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {sections.map((s, i) => (
                <div key={i}>
                  {s.title && <h2 style={{ marginTop: i === 0 ? 0 : 18 }}>{s.title}</h2>}
                  <MdView md={s.md} />
                </div>
              ))}
            </div>
          )}
      </Card>

      {/* 练习区（大区域）：作答即驱动该题 FSRS 调度 */}
      <Card title={`练习${questions?.length ? `（${questions.length} 题${dueCount ? `，${dueCount} 道今日到期` : ''}）` : ''}`} size='small' style={{ borderRadius: 10 }}
        extra={hasContent && !active && (
          <Button size='mini' type='text' loading={busy === 'quiz'} onClick={() => void makeQuestions()}>
            AI 再出 6 道
          </Button>
        )}>
        {questions === null ? <Spin dot /> : questions.length === 0
          ? <Empty description={hasContent ? '还没有题目：点上方「AI 出题」生成一组混合题型练习' : '生成正文后会自动出题'} />
          : (
            <Space direction='vertical' style={{ width: '100%' }} size={14}>
              {sortedQuestions!.map(q => (
                <div key={q.id}>
                  {q.due && q.due <= today && (
                    <Tag size='small' color='red' style={{ marginBottom: 4 }}>
                      {q.due < today ? `逾期（${q.due}）` : '今日到期'}
                    </Tag>
                  )}
                  {q.attempts > 0 && (
                    <Text type='secondary' style={{ fontSize: 12, marginLeft: 6 }}>
                      已刷 {q.attempts} 次
                    </Text>
                  )}
                  <QuestionCard course={course} node={node} question={q}
                    onDone={() => void refresh()} />
                </div>
              ))}
            </Space>
          )}
      </Card>

      {/* 完成确认：做完题后再确认（操作顺序与视线一致） */}
      {!active && hasContent && stage !== 'skipped' && stage !== 'mastered' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Popconfirm
            title='确认完成这一轮学习？'
            content='全部题目进入复习循环：做过的按各自下次到期复习，没做过的明天开始。'
            onOk={() => void complete()}>
            <Button type='primary' status='success' size='large' loading={busy === 'complete'}>
              完成学习
            </Button>
          </Popconfirm>
        </div>
      )}

      {!active && hasContent && (
        <Text type='secondary' style={{ fontSize: 12 }}>
          掌握度由本节点题目的作答正确率汇总得出；「完成学习」把全部题目纳入复习循环——做过的按各自下次到期复习，没做过的明天开始。
        </Text>
      )}
    </div>
  )
}
