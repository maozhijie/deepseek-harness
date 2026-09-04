/** 节点学习视图（最大最丰富的主学习容器）：
 * mastery 会话（PracticeFlow：读节→做题连对晋级）即学习主体，整课正文折叠
 * 供自由回看与加练出题；完成确认（正确率门禁：低于及格线默认拒绝，可 force）
 * + 跳过（已有基础）；按状态引导下一步（无正文→生成正文自动出题；有正文无题→
 * AI 出题）；生成/出题进行中轮询任务状态；「在图中查看」低频跳转。
 * 掌握度 = 该节点题目的作答正确率汇总（无自评）。 */
import { Button, Card, Collapse, Empty, Input, Message, Modal, Space, Spin, Tag, Typography } from '@arco-design/web-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import MdView from './MdView'
import PracticeFlow from './PracticeFlow'
import TutorDrawer from './TutorDrawer'
import { api, discussInHost } from '../api'
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

export default function LessonView(props: { course: string; node: string; frame: AppFrame }) {
  const { course, node, frame } = props
  const [sections, setSections] = useState<Array<{ title: string; md: string }> | null>(null)
  const [stage, setStage] = useState<string | null>(null)
  const [mastery, setMastery] = useState(0)
  const [questions, setQuestions] = useState<QuestionItem[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [job, setJob] = useState<GenJobItem | null>(null)
  const [reloadTick, setReloadTick] = useState(0)
  /** mastery 会话是否走完全部节（走完才放行「完成学习」）。 */
  const [sessionPassed, setSessionPassed] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)
  const [discussOpen, setDiscussOpen] = useState(false)
  const [discussIntent, setDiscussIntent] = useState('')
  const jobRef = useRef<GenJobItem | null>(null)
  /** 上次见到的正文版本（增量刷新：其他视图/agent 修订了正文时静默刷新）。 */
  const lastVersionRef = useRef<number | null>(null)

  const refresh = useCallback(async (opts?: { silent?: boolean }) => {
    // silent：作答后的统计刷新——保留旧内容直接覆盖，不闪 Spin（提交不整页刷新）
    if (!opts?.silent) { setSections(null); setQuestions(null) }
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
      // 增量刷新：正文版本变化（dsh 会话里 agent 修订了正文）→ 静默刷新当前视图
      const v = mine?.contentVersion
      if (v !== undefined && lastVersionRef.current !== null && v !== lastVersionRef.current) {
        void refresh({ silent: true })
      }
      if (v !== undefined) lastVersionRef.current = v
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

  const makeQuestions = async (): Promise<void> => {
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

  /** 完成确认：直接结算（引擎正确率门禁：低于及格线默认拒绝并提示，可 force 旁路）。
   * 成功后回学习中心页（推荐流已刷新，刚完成的节点不再出现）。 */
  const complete = async (force = false): Promise<void> => {
    setBusy('complete')
    try {
      const r = await api.nodeComplete(course, node, force)
      if (r.accepted === false) {
        Modal.confirm({
          title: '本轮还没过关',
          content: `${r.reason ?? '正确率低于及格线，建议明天再来或先复习前置概念。'}仍要标记完成吗？`,
          okText: '仍要完成',
          cancelText: '再练练',
          onOk: () => complete(true),
        })
        return
      }
      Message.success(`已完成${r.initialized ? `：${r.initialized} 道题进入复习循环` : ''}${r.due ? `（下次复习 ${r.due}）` : ''}`)
      await frame.reload()
      window.dispatchEvent(new Event('learnhub:reload'))
      frame.closeLesson()
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
          <Space size={6}>
            <Button size='small' type='outline' onClick={() => setTutorOpen(true)}>问 AI 老师</Button>
            <Button size='small' type='outline' onClick={() => { setDiscussIntent(''); setDiscussOpen(true) }}>与 AI 讨论本课</Button>
            <Button size='small' type='outline' onClick={() => frame.locateInGraph(node)}>在图中查看</Button>
          </Space>
        </div>
      </Space>

      <Modal
        title={`与 AI 讨论本课 · ${node}`}
        visible={discussOpen}
        onCancel={() => setDiscussOpen(false)}
        footer={null} unmountOnExit>
        <Space direction='vertical' size={10} style={{ width: '100%' }}>
          <Text type='secondary'>
            会在 dsh 里新开一个会话，自动带上本课上下文（正文/题库/掌握度/图位置）。
            适合：提修改意见让 AI 改正文、补题、调图结构等深度操作；答疑用「问 AI 老师」更快。
          </Text>
          <Input.TextArea
            value={discussIntent} onChange={setDiscussIntent}
            placeholder='想让 AI 做什么？如：例题 2 的讲解跳步了，请补充分步推导'
            autoSize={{ minRows: 3, maxRows: 6 }} />
          <Button type='primary' disabled={!discussIntent.trim()} onClick={() => {
            discussInHost(course, node, discussIntent.trim())
            setDiscussOpen(false)
            Message.info('已在新会话发起讨论（面板已收起，可随时再打开）')
          }}>开始讨论</Button>
        </Space>
      </Modal>

      <TutorDrawer course={course} node={node} visible={tutorOpen} onClose={() => setTutorOpen(false)} />

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

      {/* 主体：mastery 会话即学习界面——读节 → 做该节题（连对 2 过、至多 5 题）
          → 下一节；作答即驱动该题 FSRS 调度（新学与到期复习同一会话流） */}
      {questions === null ? <Card size='small' style={{ borderRadius: 10 }}><Spin dot /></Card>
        : questions.length === 0
          ? (hasContent && !active && (
            <Empty description='还没有题目：点上方「AI 出题」生成一组混合题型练习' />
          ))
          : (
            <PracticeFlow key={`${course}/${node}`} course={course} node={node}
              sections={sections ?? []} questions={questions}
              onSettled={() => void refresh({ silent: true })}
              onNeedMore={() => makeQuestions()}
              onPassChange={setSessionPassed} />
          )}

      {/* 整课正文（折叠）：会话内已按节推进阅读；这里留给自由回看与加练出题 */}
      {hasContent && (
        <Card title='整课正文（自由阅读）' size='small' style={{ borderRadius: 10 }}
          extra={!active && (
            <Button size='mini' type='text' loading={busy === 'quiz'} onClick={() => void makeQuestions()}>
              AI 再出 6 道
            </Button>
          )}>
          <Collapse>
            <Collapse.Item name='full' header='展开完整正文'>
              <div style={{ fontSize: 15, display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 8 }}>
                {sections.map((s, i) => (
                  <div key={i}>
                    {s.title && <h2 style={{ marginTop: i === 0 ? 0 : 18 }}>{s.title}</h2>}
                    <MdView md={s.md} />
                  </div>
                ))}
              </div>
            </Collapse.Item>
          </Collapse>
        </Card>
      )}

      {/* 完成确认：mastery 会话全部节过关（或本节点无题）才放行；直接结算，拒绝由引擎门禁提示 */}
      {!active && hasContent && stage !== 'skipped' && stage !== 'mastered' && (sessionPassed || !hasQuestions) && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type='primary' status='success' size='large' loading={busy === 'complete'}
            onClick={() => void complete()}>
            完成学习
          </Button>
        </div>
      )}
      {!active && hasContent && hasQuestions && !sessionPassed && (
        <Text type='secondary' style={{ fontSize: 12, textAlign: 'center' }}>
          走完上面会话的全部小节后，这里会出现「完成学习」。
        </Text>
      )}

      {!active && hasContent && (
        <Text type='secondary' style={{ fontSize: 12 }}>
          会话按节推进：读完一节点「继续」，连对 2 题过关（每节至多 5 题，卡住可重读/加题）。
          掌握度由作答正确率汇总；「完成学习」把全部题目纳入复习循环——做过的按各自下次到期复习，没做过的明天开始。
        </Text>
      )}
    </div>
  )
}
