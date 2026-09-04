/** 节点抽屉：笔记正文（AI 生成/人审/反馈）+ 题库作答 + 自评评分。
 * 对应 allo LearningGraphWorkspace 的节点抽屉，语义换成 learnhub 的
 * FSRS 节点调度（自评走 writeback 工作单行，D15 settle 落库）。 */
import { Button, Drawer, Empty, Message, Space, Spin, Tabs, Tag, Typography } from '@arco-design/web-react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import type { QuestionItem, Stage } from '../types'
import QuestionCard from './QuestionCard'
import { mdToHtml } from './md'

const { Text, Title } = Typography

const STAGE_TAG: Record<Stage, { label: string; color: string }> = {
  unseen: { label: '未学', color: 'gray' },
  ready: { label: '就绪', color: 'blue' },
  learning: { label: '进行中', color: 'arcoblue' },
  review: { label: '复习', color: 'green' },
  mastered: { label: '已掌握', color: 'green' },
}

const RATING_BTNS: Array<{ rating: number; label: string; color?: string }> = [
  { rating: 1, label: '忘了', color: 'red' },
  { rating: 2, label: '困难' },
  { rating: 3, label: '良好' },
  { rating: 4, label: '简单', color: 'green' },
]

export default function NodeDrawer(props: {
  course: string
  node: string
  stage: Stage
  open: boolean
  onClose: () => void
  onRefresh: () => Promise<void>
}) {
  const { course, node, open } = props
  const [sections, setSections] = useState<Array<{ title: string; md: string }> | null>(null)
  const [questions, setQuestions] = useState<QuestionItem[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [reloadTick, setReloadTick] = useState(0)

  const refreshNode = useCallback(async () => {
    setSections(null)
    setQuestions(null)
    try {
      const [lesson, bank] = await Promise.all([
        api.lesson(node, course).catch(() => null),
        api.questions(course, node).catch(() => null),
      ])
      setSections(lesson?.sections ?? [])
      setQuestions(bank?.questions ?? [])
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }, [course, node])

  useEffect(() => {
    if (open) void refreshNode()
  }, [open, refreshNode, reloadTick])

  const generate = async () => {
    setBusy('generate')
    try {
      const res = await api.generate(course, node)
      Message.success(res.message)
      await props.onRefresh()
      setReloadTick(t => t + 1)
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  const review = async () => {
    setBusy('review')
    try {
      const res = await api.review(course, node)
      Message.success(res.message)
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  const feedback = async () => {
    setBusy('feedback')
    try {
      const res = await api.feedback(`${course}/${node}`)
      Message.success(res.message)
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
      await props.onRefresh()
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(null)
    }
  }

  const tag = STAGE_TAG[props.stage] ?? STAGE_TAG.unseen

  return (
    <Drawer width={580} visible={open} onCancel={props.onClose} footer={null} unmountOnExit>
      <Space direction='vertical' style={{ width: '100%' }} size={10}>
        <Title heading={5} style={{ margin: 0 }}>{node}</Title>
        <Space size={8} wrap>
          <Tag color={tag.color}>{tag.label}</Tag>
          <Text type='secondary'>课程：{course}</Text>
        </Space>
        <Tabs defaultActiveTab='lesson' size='small'>
          <Tabs.TabPane key='lesson' title='笔记'>
            <Space direction='vertical' style={{ width: '100%', marginBottom: 10 }} size={6}>
              <Space size={6} wrap>
                <Button size='small' type='primary' loading={busy === 'generate'} onClick={() => void generate()}>
                  AI 生成正文
                </Button>
                <Button size='small' loading={busy === 'review'} onClick={() => void review()}>人审通过</Button>
                <Button size='small' loading={busy === 'feedback'} onClick={() => void feedback()}>标记需改</Button>
              </Space>
              <Text type='secondary' style={{ fontSize: 12 }}>
                生成 30–90s；完成后笔记正文落盘 Obsidian，可人审定稿
              </Text>
            </Space>
            {sections === null ? <Spin dot /> : sections.length > 0
              ? (
                <div className='md-body'>
                  {sections.map((s, i) => (
                    <div key={i}>
                      {s.title && <h3>{s.title}</h3>}
                      <div dangerouslySetInnerHTML={{ __html: mdToHtml(s.md) }} />
                    </div>
                  ))}
                </div>
              )
              : <Empty description='还没有正文：点上方「AI 生成正文」' />}
          </Tabs.TabPane>
          <Tabs.TabPane key='practice' title={`练习${questions?.length ? ` (${questions.length})` : ''}`}>
            {questions === null ? <Spin dot /> : questions.length === 0
              ? <Empty description='该节点还没有题库：在「题目管理」页签为节点添加题目' />
              : (
                <Space direction='vertical' style={{ width: '100%' }} size={12}>
                  {questions.map(q => (
                    <QuestionCard key={q.id} course={course} node={node} question={q}
                      onDone={() => void props.onRefresh()} />
                  ))}
                </Space>
              )}
          </Tabs.TabPane>
          <Tabs.TabPane key='rate' title='自评'>
            <Text type='secondary' style={{ display: 'block', marginBottom: 10 }}>
              无题库节点直接按回忆质量自评；评分写入今日工作单，结算（settle）后驱动 FSRS 调度
            </Text>
            <Space size={8}>
              {RATING_BTNS.map(b => (
                <Button key={b.rating} loading={busy === `rate-${b.rating}`} color={b.color}
                  onClick={() => void rate(b.rating)}>
                  {b.rating} · {b.label}
                </Button>
              ))}
            </Space>
          </Tabs.TabPane>
        </Tabs>
      </Space>
    </Drawer>
  )
}
