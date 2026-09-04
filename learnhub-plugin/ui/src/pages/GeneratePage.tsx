/** 生成页：进行中/近期生成任务（服务端任务注册表）+ 取消。
 * 页面刷新后状态从这里恢复（服务端注册表是事实来源，allo 同语义）。 */
import { Button, Card, Empty, Message, Space, Table, Tag, Typography } from '@arco-design/web-react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import type { GenJobItem } from '../types'

const { Text } = Typography

const STATUS_TAG: Record<GenJobItem['status'], { label: string; color: string }> = {
  running: { label: '生成中', color: 'arcoblue' },
  cancelling: { label: '取消中', color: 'orange' },
  done: { label: '已完成', color: 'green' },
  failed: { label: '失败', color: 'red' },
  cancelled: { label: '已取消', color: 'gray' },
}

export default function GeneratePage() {
  const [jobs, setJobs] = useState<GenJobItem[] | null>(null)

  const load = useCallback(async () => {
    try {
      setJobs(await api.generateStatus())
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }, [])

  useEffect(() => {
    void load()
    // 生成中 3s 轮询；空闲 15s
    const timer = setInterval(() => void load(), 5000)
    return () => clearInterval(timer)
  }, [load])

  const cancel = async (j: GenJobItem) => {
    try {
      await api.generateCancel(j.course, j.node)
      Message.success('已请求取消（结果会被丢弃）')
      await load()
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <Space direction='vertical' style={{ width: '100%' }} size={14}>
      <Card size='small' title='正文生成任务' style={{ borderRadius: 10 }}>
        <Text type='secondary' style={{ display: 'block', marginBottom: 8 }}>
          在学习图页签点「AI 生成正文」后，任务出现在这里；刷新页面不丢失。课程图的多轮生成在 dsh 对话里进行（agent 侧）。
        </Text>
        {jobs === null ? null : jobs.length === 0 ? (
          <Empty description='当前没有生成任务' />
        ) : (
          <Table size='small' data={jobs} rowKey={j => j.key} pagination={false}
            columns={[
              { title: '节点', dataIndex: 'node', ellipsis: true },
              { title: '课程', dataIndex: 'course', width: 130 },
              { title: '开始时间', dataIndex: 'startedAt', width: 170, render: v => new Date(v).toLocaleTimeString() },
              { title: '状态', width: 90, render: (_, j) => {
                const t = STATUS_TAG[j.status]
                return <Tag size='small' color={t.color}>{t.label}</Tag>
              } },
              { title: '信息', dataIndex: 'message', ellipsis: true },
              { title: '操作', width: 90, render: (_, j) => (
                j.status === 'running'
                  ? <Button size='mini' type='text' status='danger' onClick={() => void cancel(j)}>取消</Button>
                  : null
              ) },
            ]} />
        )}
      </Card>
    </Space>
  )
}
