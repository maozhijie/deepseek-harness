/**
 * 图分析（吸收自 Python analysis.py 的核心口径；networkx → Graph 派生结构直算）。
 * 输出：结构统计、不可达节点、瓶颈（高扇出枢纽）、逾期热点（journal 驱动）、
 * cytoscape 渲染元素（面板 DAG 视图消费）。
 */
import type { Graph } from './graph.ts'
import type { Fm } from './types.ts'
import type { Store } from './store.ts'
import { effectiveStage } from './audit.ts'
import { parseDay, todayStr, daysBetween } from './dates.ts'

export interface GraphAnalysis {
  stats: {
    nodes: number
    edges: number
    enc_edges: number
    roots: number
    leaves: number
    max_depth: number
    components: number
    has_cycle: boolean
  }
  unreachable: string[]
  bottlenecks: Array<{ node: string; successors: number; unlocks: number }>
  lapse_hotspots: Array<{ node: string; lapses: number }>
  nodes: Array<{ data: { id: string; region: string; block: string; depth: number; stage: string; opt: boolean } }>
  edges: Array<{ data: { id: string; source: string; target: string; kind: string; w?: number } }>
}

export async function analyzeGraph(
  courseName: string, graph: Graph, state: Record<string, Fm>, store: Store,
): Promise<GraphAnalysis> {
  const today = todayStr()
  const t = parseDay(today)!

  // 不可达 = 从任一根出发 BFS 达不到的节点（有环时跳过）
  const unreachable: string[] = []
  if (!graph.hasCycle) {
    const seen = new Set<string>()
    const queue = graph.roots.slice()
    while (queue.length) {
      const u = queue.shift()!
      if (seen.has(u)) continue
      seen.add(u)
      for (const v of graph.succ[u]) if (!seen.has(v)) queue.push(v)
    }
    unreachable.push(...graph.names.filter(n => !seen.has(n)).sort())
  }

  // 瓶颈：后继数 top（解锁口径 = succ 中未学者数）
  const bottlenecks = graph.names
    .map(n => ({ node: n, successors: graph.succ[n].length, unlocks: graph.succ[n].filter(x => effectiveStage(state, x) === 'unseen' || effectiveStage(state, x) === 'ready').length }))
    .filter(b => b.successors >= 3)
    .sort((a, b) => b.unlocks - a.unlocks || b.successors - a.successors)
    .slice(0, 10)

  // 逾期热点：journal 聚合 lapse/relearn 次数
  const lapses: Record<string, number> = {}
  for (const rec of await store.journalTail(courseName, 500)) {
    if (rec.kind === 'relearn' || (rec.rating === 1)) {
      lapses[rec.node] = (lapses[rec.node] ?? 0) + 1
    }
  }
  const lapseHotspots = Object.entries(lapses)
    .map(([node, n]) => ({ node, lapses: n }))
    .filter(h => h.lapses >= 2)
    .sort((a, b) => b.lapses - a.lapses)
    .slice(0, 10)

  // cytoscape 元素：渲染用边 = 传递约简后的 pre 边 + enc 成分技能边（kind 区分）
  const nodes = graph.names.map(n => ({
    data: {
      id: n,
      region: graph.blockOf[n][1],
      block: graph.blockOf[n][2],
      depth: graph.depth[n] ?? 0,
      stage: effectiveStage(state, n),
      opt: graph.opt.has(n),
    },
  }))
  const edges = [
    ...graph.edges.map(([u, v]) => ({ data: { id: `${u}->${v}`, source: u, target: v, kind: 'pre' } })),
    ...Object.entries(graph.encOf).flatMap(([u, list]) =>
      list.map(([v, w]) => ({ data: { id: `${u}~enc~${v}`, source: u, target: v, kind: 'enc', w } }))),
  ]

  return {
    stats: {
      nodes: graph.names.length,
      edges: graph.edgeCount(),
      enc_edges: Object.values(graph.encOf).reduce((s, v) => s + v.length, 0),
      roots: graph.roots.length,
      leaves: graph.leaves.length,
      max_depth: Object.keys(graph.depth).length ? Math.max(...Object.values(graph.depth)) : 0,
      components: graph.components.length,
      has_cycle: graph.hasCycle,
    },
    unreachable,
    bottlenecks,
    lapse_hotspots: lapseHotspots,
    nodes,
    edges,
  }
}

/** 逾期天数（状态视图用）。 */
export function overdueDays(due: string, today = todayStr()): number {
  const d = parseDay(due)
  const t = parseDay(today)
  return d && t ? Math.max(0, daysBetween(t, d)) : 0
}
