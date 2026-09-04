/** 统计页：各课程阶段统计（未学 = unseen+ready；复习到期 = 有到期题目的节点）。 */
import { Card, Space, Table, Tag, Typography } from '@arco-design/web-react'
import type { AppFrame } from '../App'

const { Text } = Typography

export default function StatsPage({ frame }: { frame: AppFrame }) {
  return (
    <Space direction='vertical' style={{ width: '100%' }} size={14}>
      <Card size='small' title='课程状态总览' style={{ borderRadius: 10 }}>
        <Table size='small' data={frame.status?.courses ?? []} rowKey={c => c.id} pagination={false}
          columns={[
            { title: '课程', dataIndex: 'name' },
            { title: '总节点', dataIndex: 'total', width: 80 },
            { title: '未学', width: 70, render: (_, c) => <Tag size='small'>{c.counts.unseen + c.counts.ready}</Tag> },
            { title: '进行', width: 70, render: (_, c) => <Tag size='small' color='arcoblue'>{c.counts.learning}</Tag> },
            { title: '复习', width: 70, render: (_, c) => <Tag size='small' color='green'>{c.counts.review}</Tag> },
            { title: '掌握', width: 70, render: (_, c) => <Tag size='small' color='green'>{c.counts.mastered}</Tag> },
            { title: '已跳过', width: 80, render: (_, c) => c.counts.skipped > 0
              ? <Tag size='small' color='purple'>{c.counts.skipped}</Tag>
              : <Tag size='small' color='gray'>0</Tag> },
            { title: '今日到期', width: 90, render: (_, c) => c.due_today > 0
              ? <Tag size='small' color='red'>{c.due_today}</Tag>
              : <Tag size='small' color='gray'>0</Tag> },
          ]} />
      </Card>
      <Text type='secondary' style={{ fontSize: 12 }}>
        「今日到期」= 该课程有到期复习题目的节点数（题目级 FSRS 调度，作答即推进）。
      </Text>
    </Space>
  )
}
