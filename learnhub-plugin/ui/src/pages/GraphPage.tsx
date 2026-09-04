/** 学习图工作区（重点页面）：DAG 主视图 + 大纲树切换 + 就绪推荐 + 节点抽屉。
 * 移植自 allo LearningGraphWorkspace 的编排，数据源换 learnhub 引擎。 */
import { Button, Collapse, Message, Radio, Select, Space, Spin, Tag, Tooltip, Typography } from '@arco-design/web-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import GraphDagView from '../components/GraphDagView'
import NodeDrawer from '../components/NodeDrawer'
import { api } from '../api'
import type { AppFrame } from '../App'
import type { GraphDoc, RecommendDoc, Stage } from '../types'

const { Text } = Typography

/** 锁定语义：存在任一前置未达 review/mastered（前置线由 edges 反查）。 */
function computeLocked(doc: GraphDoc, stageOf: Map<string, Stage>): Set<string> {
  const pre = new Map<string, string[]>()
  for (const e of doc.edges) {
    const list = pre.get(e.data.target) ?? []
    list.push(e.data.source)
    pre.set(e.data.target, list)
  }
  const locked = new Set<string>()
  for (const n of doc.nodes) {
    const ups = pre.get(n.data.id) ?? []
    if (ups.length && ups.some(id => {
      const s = stageOf.get(id) ?? 'unseen'
      return s !== 'review' && s !== 'mastered'
    })) locked.add(n.data.id)
  }
  return locked
}

const REC_TYPE: Record<string, { label: string; color: string }> = {
  review: { label: '复习', color: 'green' },
  overdue: { label: '逾期', color: 'red' },
  ready: { label: '就绪', color: 'blue' },
  new: { label: '新学', color: 'cyan' },
}

export default function GraphPage({ frame }: { frame: AppFrame }) {
  const { tree, course } = frame
  const [view, setView] = useState<'dag' | 'outline'>('dag')
  const [doc, setDoc] = useState<GraphDoc | null>(null)
  const [rec, setRec] = useState<RecommendDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  const loadGraph = useCallback(async () => {
    if (!course) return
    setLoading(true)
    try {
      const [g, r] = await Promise.all([
        api.graph(course),
        api.recommend(8).catch(() => null),
      ])
      setDoc(g)
      setRec(r)
    } catch (err) {
      Message.error(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [course])

  useEffect(() => { void loadGraph() }, [loadGraph])

  const stageOf = useMemo(() => {
    const m = new Map<string, Stage>()
    for (const n of doc?.nodes ?? []) m.set(n.data.id, n.data.stage)
    return m
  }, [doc])
  const lockedIds = useMemo(() => (doc ? computeLocked(doc, stageOf) : new Set<string>()), [doc, stageOf])
  const recommended = useMemo(() => (rec?.events ?? []).map(e => e.node), [rec])
  const bankSet = useMemo(() => {
    const s = new Set<string>()
    const c = tree?.courses.find(c => c.name === course)
    for (const r of c?.regions ?? []) for (const b of r.blocks) for (const n of b.nodes) {
      if (n.hasBank) s.add(n.node)
    }
    return s
  }, [tree, course])

  const stats = useMemo(() => {
    const counts: Record<Stage, number> = { unseen: 0, ready: 0, learning: 0, review: 0, mastered: 0 }
    for (const n of doc?.nodes ?? []) counts[n.data.stage] += 1
    return counts
  }, [doc])

  const treeCourse = tree?.courses.find(c => c.name === course)

  if (!course || !treeCourse || !tree) return null
  const drawerNode = selected !== null ? stageOf.get(selected) : undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 12px 0' }}>
        <Select value={course} onChange={v => frame.setCourse(v)} style={{ width: 220 }} size='small'>
          {tree.courses.map(c => <Select.Option key={c.name} value={c.name}>{c.name}</Select.Option>)}
        </Select>
        <Radio.Group type='button' size='small' value={view} onChange={v => setView(v as 'dag' | 'outline')}>
          <Radio value='dag'>依赖图</Radio>
          <Radio value='outline'>大纲</Radio>
        </Radio.Group>
        <Space size={4} wrap>
          <Tag size='small'>共 {doc?.nodes.length ?? 0}</Tag>
          <Tag size='small' color='green'>掌握 {stats.mastered + stats.review}</Tag>
          <Tag size='small' color='arcoblue'>进行 {stats.learning + stats.ready}</Tag>
          <Tag size='small' color='gray'>未学 {stats.unseen}</Tag>
        </Space>
        <Button size='small' onClick={() => void loadGraph()} loading={loading}>刷新</Button>
      </div>

      {/* 就绪推荐条 */}
      {rec && rec.events.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '0 12px' }}>
          {rec.events.map((e, i) => {
            const t = REC_TYPE[e.type] ?? { label: e.type, color: 'gray' }
            return (
              <Button key={i} size='mini' onClick={() => setSelected(e.node)}
                style={{ justifyContent: 'flex-start' }}>
                <Tag size='small' color={t.color} style={{ marginRight: 6 }}>{t.label}</Tag>
                <span style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.node}
                </span>
              </Button>
            )
          })}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {loading && !doc ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin dot />
          </div>
        ) : view === 'dag' ? (
          doc && <GraphDagView doc={doc} recommended={recommended} lockedIds={lockedIds} bankSet={bankSet}
            onSelect={id => setSelected(id)} />
        ) : (
          <div style={{ height: '100%', overflow: 'auto', padding: '8px 12px 24px' }}>
            <Collapse bordered={false} defaultActiveKey={treeCourse.regions.map((_, i) => String(i))}>
              {treeCourse.regions.map((r, i) => (
                <Collapse.Item key={String(i)} name={String(i)}
                  header={<Space size={8}><span style={{ width: 8, height: 8, borderRadius: 4, background: r.color, display: 'inline-block' }} />{r.name}</Space>}>
                  {r.blocks.map(b => (
                    <div key={b.name} style={{ marginBottom: 8 }}>
                      <Text bold style={{ display: 'block', margin: '6px 0 4px' }}>{b.name}</Text>
                      <Space size={6} wrap>
                        {b.nodes.map(n => (
                          <Tooltip key={n.node} content={`${n.stage} · 掌握度 ${(n.mastery * 100).toFixed(0)}%`}>
                            <Button size='mini' onClick={() => setSelected(n.node)}
                              disabled={n.stage === 'unseen' && b.nodes.length > 0 && false}>
                              {n.node}
                              {n.hasBank ? ' ·题' : ''}
                            </Button>
                          </Tooltip>
                        ))}
                      </Space>
                    </div>
                  ))}
                </Collapse.Item>
              ))}
            </Collapse>
          </div>
        )}
      </div>

      {selected && drawerNode && (
        <NodeDrawer course={course} node={selected} stage={drawerNode} open
          onClose={() => setSelected(null)}
          onRefresh={async () => { await Promise.all([loadGraph(), frame.reload()]) }} />
      )}
    </div>
  )
}
