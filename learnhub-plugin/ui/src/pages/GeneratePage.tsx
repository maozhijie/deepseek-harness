/** 生成页：待生成队列（生成队列.md 人审产物）+ 进行中/近期生成任务（服务端任务注册表）。
 * 页面刷新后状态从这里恢复（服务端注册表是事实来源，allo 同语义）。
 * 生成支持提示词风格变体（课程生成-<style>）；失败任务可一键转 dsh 会话讨论。 */
import { Button, Card, Empty, Message, Select, Space, Table, Tag, Typography } from '@arco-design/web-react'
import { useCallback, useEffect, useState } from 'react'
import { api, discussInHost } from '../api'
import type { AppFrame } from '../App'
import type { GenJobItem, QueueItem } from '../types'

const { Text } = Typography

const STATUS_TAG: Record<GenJobItem['status'], { label: string; color: string }> = {
  running: { label: '生成中', color: 'arcoblue' },
  cancelling: { label: '取消中', color: 'orange' },
  done: { label: '已完成', color: 'green' },
  failed: { label: '失败', color: 'red' },
  cancelled: { label: '已取消', color: 'gray' },
}

export default function GeneratePage({ frame }: { frame?: AppFrame }) {
  const [jobs, setJobs] = useState<GenJobItem[] | null>(null)
  const [queue, setQueue] = useState<QueueItem[] | null>(null)
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [styles, setStyles] = useState<string[]>([])
  const [style, setStyle] = useState<string | undefined>(undefined)

  const load = useCallback(async () => {
    try {
      const [j, q] = await Promise.all([
        api.generateStatus(),
        api.queue().catch(() => [] as QueueItem[]),
      ])
      setJobs(j)
      setQueue(q)
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }, [])

  useEffect(() => {
    void load()
    // 生成中 5s 轮询（任务与队列同源刷新）
    const timer = setInterval(() => void load(), 5000)
    return () => clearInterval(timer)
  }, [load])

  // 风格清单 = 「课程生成」前缀的提示词类型（默认/内置变体/自建）
  useEffect(() => {
    void api.prompts().then(kinds => {
      setStyles(kinds
        .filter(k => k === '课程生成' || k.startsWith('课程生成-'))
        .map(k => (k === '课程生成' ? '' : k.slice('课程生成-'.length))))
    }).catch(() => setStyles([]))
  }, [])

  const cancel = async (j: GenJobItem) => {
    try {
      await api.generateCancel(j.course, j.node)
      Message.success('已请求取消（结果会被丢弃）')
      await load()
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    }
  }

  const generate = async (item: QueueItem) => {
    setBusyKey(`${item.course}/${item.node}`)
    try {
      const res = await api.generate(item.course, item.node, style || undefined)
      Message.success(res.message)
      await Promise.all([load(), frame?.reload()])
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setBusyKey(null)
    }
  }

  return (
    <Space direction='vertical' style={{ width: '100%' }} size={14}>
      <Card size='small' title={
        <Space size={10}>
          <span>待生成队列</span>
          {styles.length > 1 && (
            <Select value={style ?? ''} onChange={v => setStyle(v || undefined)} size='mini' style={{ width: 130 }}>
              {styles.map(s => <Select.Option key={s || '默认'} value={s}>{s ? `风格：${s}` : '默认风格'}</Select.Option>)}
            </Select>
          )}
        </Space>
      } style={{ borderRadius: 10 }}>
        <Text type='secondary' style={{ display: 'block', marginBottom: 8 }}>
          来自 生成队列.md（agent 补内容建议 / 内容反馈自动入队）；一键生成后正文落盘 Obsidian，条目自动勾掉。
        </Text>
        {queue === null ? null : queue.length === 0 ? (
          <Empty description='队列为空：在学习图页签对任意节点点「AI 生成正文」即可' />
        ) : (
          <Table size='small' data={queue} rowKey={q => `${q.course}/${q.node}`} pagination={false}
            columns={[
              { title: '课程', dataIndex: 'course', width: 130 },
              { title: '节点', dataIndex: 'node', ellipsis: true },
              { title: '类型', width: 80, render: (_, q) => <Tag size='small' color={q.kind === '重生成' ? 'orange' : 'blue'}>{q.kind}</Tag> },
              { title: '原因', dataIndex: 'reason', ellipsis: true },
              { title: '优先级', dataIndex: 'priority', width: 80 },
              { title: '操作', width: 170, render: (_, q) => (
                <Space size={4}>
                  <Button size='mini' type='primary' loading={busyKey === `${q.course}/${q.node}`}
                    onClick={() => void generate(q)}>生成正文</Button>
                  <Button size='mini' type='text' onClick={() => {
                    frame?.setCourse(q.course)
                    frame?.goto('graph')
                  }}>去学习图</Button>
                </Space>
              ) },
            ]} />
        )}
      </Card>
      <Card size='small' title='正文生成任务' style={{ borderRadius: 10 }}>
        <Text type='secondary' style={{ display: 'block', marginBottom: 8 }}>
          生成中/近期任务在这里；刷新页面不丢失。课程图的多轮生成在 dsh 对话里进行（agent 侧）。
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
              { title: '操作', width: 170, render: (_, j) => (
                <Space size={4}>
                  {j.status === 'running'
                    ? <Button size='mini' type='text' status='danger' onClick={() => void cancel(j)}>取消</Button>
                    : null}
                  {j.status === 'failed' && (
                    <Button size='mini' type='text' onClick={() =>
                      discussInHost(j.course, j.node, `上次生成失败：${j.message ?? '（无错误信息）'}。请分析原因并帮我修复，然后重试生成。`)
                    }>与 AI 讨论</Button>
                  )}
                </Space>
              ) },
            ]} />
        )}
      </Card>
    </Space>
  )
}
