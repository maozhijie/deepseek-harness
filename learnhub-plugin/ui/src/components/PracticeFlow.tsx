/** mastery 练习会话（Math Academy active learning loop）：
 * 读一节 → 做该节的题（连对 2 过、至多 5 题）→ 读下一节 → … → 通用题收尾 →
 * 练习通过（引导「完成学习」）。节 = 类型化原子学习单元（标题前缀 概念/例题/
 * 演示/小结，shared 清单驱动）；题目按 section 标注落到对应节，未标注/旧题进
 * 通用收尾轮。节未过关 → struggle 分支：重读本节 / AI 再出题 / 跳过本节。 */
import { Alert, Button, Card, Space, Tag, Typography } from '@arco-design/web-react'
import { useEffect, useMemo, useState } from 'react'
import MdView from './MdView'
import QuestionCard, { type AnswerOutcome } from './QuestionCard'
import { parseSectionTitle } from '../../../shared/content-renderers'
import type { QuestionItem } from '../types'

const { Text, Title } = Typography

const PASS_STREAK = 2        // 连对即过该节（MA）
const MAX_ASK_PER_ROUND = 5  // 每节至多 5 题（MA），超过未连对 2 → struggle

interface Round {
  key: string
  type: 'read' | 'quiz'
  title: string
  typeLabel: string
  md?: string
  questions?: QuestionItem[]
}

/** 节标题归一化：剥类型前缀 + 去空白——AI 的 section 标注常有
 * 「概念：X」vs 正文「X」这类前缀/空白差异，精确匹配会漏题进综合轮。 */
function normSection(s: string): string {
  return parseSectionTitle(s).clean.replace(/\s+/g, '')
}

/** 轮次计划快照：每节 read+quiz 成对，未落节的题收进「通用」quiz 轮。 */
function buildRounds(sections: Array<{ title: string; md: string }>, questions: QuestionItem[]): Round[] {
  const rounds: Round[] = []
  const used = new Set<string>()
  for (const s of sections) {
    const parsed = parseSectionTitle(s.title)
    rounds.push({ key: `read:${s.title}`, type: 'read', title: parsed.clean, typeLabel: parsed.type.label, md: s.md })
    const key = normSection(s.title)
    // != null 同时挡 null 与 undefined：旧引擎的 questions 响应没有 section 字段
    const qs = questions.filter(q => q.section === s.title || (q.section != null && normSection(q.section) === key))
    qs.forEach(q => used.add(q.id))
    if (qs.length) rounds.push({ key: `quiz:${s.title}`, type: 'quiz', title: parsed.clean, typeLabel: parsed.type.label, questions: qs })
  }
  const generic = questions.filter(q => !used.has(q.id))
  if (generic.length) rounds.push({ key: 'quiz:generic', type: 'quiz', title: '综合', typeLabel: '通用', questions: generic })
  return rounds
}

export default function PracticeFlow(props: {
  course: string
  node: string
  sections: Array<{ title: string; md: string }>
  questions: QuestionItem[]
  /** 每题作答后父级刷新统计（silent）。 */
  onSettled: () => void
  /** struggle 时请求 AI 追加出题（父级出题并刷新 questions）。 */
  onNeedMore: () => Promise<void>
  /** 会话通过状态变化（全部节过关）→ 父级放行「完成学习」。 */
  onPassChange?: (passed: boolean) => void
}) {
  const rounds = useMemo(() => buildRounds(props.sections, props.questions), [props.sections, props.questions])
  const [roundIdx, setRoundIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [streak, setStreak] = useState(0)
  const [asked, setAsked] = useState(0)
  const [answered, setAnswered] = useState<AnswerOutcome | null>(null)
  const [struggling, setStruggling] = useState(false)
  const [needMoreBusy, setNeedMoreBusy] = useState(false)

  const allDone = roundIdx >= rounds.length
  const round = allDone ? null : rounds[roundIdx]
  const qs = round?.type === 'quiz' ? round.questions ?? [] : []
  const current = qs[qIdx]

  useEffect(() => { props.onPassChange?.(allDone) }, [allDone, props])

  const resetRoundState = () => { setQIdx(0); setStreak(0); setAsked(0); setAnswered(null); setStruggling(false) }

  const nextRound = () => { resetRoundState(); setRoundIdx(i => i + 1) }

  const handleDone = (oc: AnswerOutcome) => {
    setAnswered(oc)
    setAsked(a => a + 1)
    props.onSettled()
  }

  /** 「下一题」：连对 2 → 过节；题目用尽/超上限 → struggle；否则继续。 */
  const advance = () => {
    const wasCorrect = answered?.correct === true
    const newStreak = wasCorrect ? streak + 1 : 0
    if (newStreak >= PASS_STREAK) { nextRound(); return }
    setStreak(newStreak)
    if (asked < MAX_ASK_PER_ROUND && qIdx + 1 < qs.length) {
      setQIdx(i => i + 1)
      setAnswered(null)
      return
    }
    setStruggling(true)
  }

  /** struggle → AI 再出题：出完回到本节 read 轮重读重做（新题经 questions 刷新进轮）。 */
  const needMore = async () => {
    setNeedMoreBusy(true)
    try {
      await props.onNeedMore()
      resetRoundState()
      setRoundIdx(i => (round?.type === 'quiz' && round.key !== 'quiz:generic' ? i - 1 : i))
    } finally {
      setNeedMoreBusy(false)
    }
  }

  if (allDone) {
    return (
      <Card size='small' style={{ borderRadius: 10, background: 'var(--color-success-light-1,#e8ffea)' }}>
        <Space direction='vertical' size={6} style={{ width: '100%' }}>
          <Title heading={6} style={{ margin: 0 }}>练习通过</Title>
          <Text type='secondary'>全部小节已过关。下方「完成学习」把本节题目纳入复习循环；明天起按间隔重复安排复习。</Text>
        </Space>
      </Card>
    )
  }
  if (!round) return null

  // ---- 阅读轮 ----
  if (round.type === 'read') {
    return (
      <Card size='small' style={{ borderRadius: 10 }}>
        <Space direction='vertical' size={10} style={{ width: '100%' }}>
          <Space size={8}>
            <Tag color='arcoblue'>{round.typeLabel}</Tag>
            <Title heading={6} style={{ margin: 0 }}>{round.title}</Title>
            <Text type='secondary' style={{ fontSize: 12 }}>第 {Math.ceil(roundIdx / 2) + 1} 节</Text>
          </Space>
          <MdView md={round.md ?? ''} />
          <Button type='primary' size='small' style={{ alignSelf: 'flex-start' }} onClick={nextRound}>
            继续
          </Button>
        </Space>
      </Card>
    )
  }

  // ---- 练习轮：struggle 分支 ----
  if (struggling) {
    const hasReadRound = round.key !== 'quiz:generic'
    return (
      <Card size='small' style={{ borderRadius: 10 }}>
        <Space direction='vertical' size={10} style={{ width: '100%' }}>
          <Alert
            type='warning'
            content={`「${round.title}」这一节还没过关（${PASS_STREAK} 题连对才通过，本节最多 ${MAX_ASK_PER_ROUND} 题）。可以先重读一遍，或让 AI 再出几道同类题。`}
          />
          <Space size={8} wrap>
            {hasReadRound && (
              <Button size='small' onClick={() => { resetRoundState(); setRoundIdx(i => i - 1) }}>
                重读本节
              </Button>
            )}
            <Button size='small' type='primary' loading={needMoreBusy} onClick={() => void needMore()}>
              AI 再出题
            </Button>
            <Button size='small' type='text' onClick={nextRound}>跳过本节，继续后面的</Button>
          </Space>
        </Space>
      </Card>
    )
  }

  // ---- 练习轮：单题 ----
  return (
    <Card size='small' style={{ borderRadius: 10 }}>
      <Space direction='vertical' size={10} style={{ width: '100%' }}>
        <Space size={8} wrap>
          <Tag color='arcoblue'>{round.typeLabel}</Tag>
          <Title heading={6} style={{ margin: 0 }}>{round.title}</Title>
          <Text type='secondary' style={{ fontSize: 12 }}>
            第 {qIdx + 1}/{qs.length} 题 · 连对 {streak}/{PASS_STREAK}
          </Text>
        </Space>
        {current && (
          <QuestionCard key={current.id} course={props.course} node={props.node} question={current} noRedo onDone={handleDone} />
        )}
        {answered && (
          <Button type='primary' size='small' style={{ alignSelf: 'flex-start' }} onClick={advance}>
            {answered.correct === true && streak + 1 >= PASS_STREAK ? '连对达标，下一节' : '下一题'}
          </Button>
        )}
      </Space>
    </Card>
  )
}
