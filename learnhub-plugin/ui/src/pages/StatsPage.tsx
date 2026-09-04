/** 统计页：打卡日历热力图（journal+practice 行为流水聚合）+ 各课程五态统计。 */
import { Button, Card, Message, Select, Space, Statistic, Table, Tag, Typography } from '@arco-design/web-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import type { AppFrame } from '../App'
import type { CalendarDoc } from '../types'

const { Text } = Typography

/** 月历热力：行为次数 → 绿色深浅。 */
function MonthHeat({ doc, year, month, onMonth }: {
  doc: CalendarDoc | null
  year: number
  month: number
  onMonth: (m: number) => void
}) {
  const byDay = useMemo(() => {
    const m = new Map<string, number>()
    for (const d of doc?.days ?? []) m.set(d.date, d.total)
    return m
  }, [doc])

  const cells = useMemo(() => {
    const first = new Date(year, month - 1, 1)
    const days = new Date(year, month, 0).getDate()
    const lead = first.getDay()
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ]
  }, [year, month])

  const heat = (n: number | undefined) => {
    if (!n) return 'var(--color-fill-2,#f2f3f5)'
    if (n <= 2) return '#b8edb9'
    if (n <= 5) return '#6fdd74'
    if (n <= 10) return '#35b93c'
    return '#0e7a14'
  }

  return (
    <Card size='small' title={<Space size={10}>
      <span>{year} 年打卡日历</span>
      <Select value={month} onChange={onMonth} size='mini' style={{ width: 90 }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <Select.Option key={m} value={m}>{m} 月</Select.Option>)}
      </Select>
    </Space>} style={{ borderRadius: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, maxWidth: 420 }}>
        {['日', '一', '二', '三', '四', '五', '六'].map(w => (
          <Text key={w} type='secondary' style={{ textAlign: 'center', fontSize: 11 }}>{w}</Text>
        ))}
        {cells.map((d, i) => {
          const key = d ? `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}` : `x${i}`
          const count = d ? byDay.get(key) : undefined
          return (
            <div key={key} title={d ? `${key}：${count ?? 0} 次行为` : ''}
              style={{
                aspectRatio: '1', borderRadius: 4, background: heat(count),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: count && count > 5 ? '#fff' : 'var(--color-text-2,#4e5969)',
              }}>
              {d ?? ''}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function StatsPage({ frame }: { frame: AppFrame }) {
  const now = new Date()
  const [year] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [doc, setDoc] = useState<CalendarDoc | null>(null)

  const load = useCallback(async () => {
    try {
      setDoc(await api.calendar(year))
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }, [year])

  useEffect(() => { void load() }, [load])

  const totals = useMemo(() => {
    const t = { days: 0, journal: 0, practice: 0 }
    for (const d of doc?.days ?? []) {
      if (d.total > 0) t.days += 1
      t.journal += d.journal
      t.practice += d.practice
    }
    return t
  }, [doc])

  return (
    <Space direction='vertical' style={{ width: '100%' }} size={14}>
      <Space size={24} wrap>
        <Statistic title='今年学习天数' value={totals.days} />
        <Statistic title='调度/评分行为' value={totals.journal} />
        <Statistic title='作答次数' value={totals.practice} />
        <Button size='small' onClick={() => void load()}>刷新</Button>
      </Space>
      <MonthHeat doc={doc} year={year} month={month} onMonth={setMonth} />

      <Card size='small' title='课程状态总览' style={{ borderRadius: 10 }}>
        <Table size='small' data={frame.status?.courses ?? []} rowKey={c => c.id} pagination={false}
          columns={[
            { title: '课程', dataIndex: 'name' },
            { title: '总节点', dataIndex: 'total', width: 80 },
            { title: '未学', width: 70, render: (_, c) => <Tag size='small'>{c.counts.unseen}</Tag> },
            { title: '就绪/进行', width: 90, render: (_, c) => <Tag size='small' color='arcoblue'>{c.counts.ready + c.counts.learning}</Tag> },
            { title: '复习/掌握', width: 90, render: (_, c) => <Tag size='small' color='green'>{c.counts.review + c.counts.mastered}</Tag> },
            { title: '今日到期', width: 90, render: (_, c) => c.due_today > 0
              ? <Tag size='small' color='red'>{c.due_today}</Tag>
              : <Tag size='small' color='gray'>0</Tag> },
          ]} />
      </Card>
    </Space>
  )
}
