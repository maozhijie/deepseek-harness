import { useEffect, useState } from 'react'

/**
 * dsh-learnhub 客户端：侧边栏底栏「学习中心」入口 + 全屏面板。
 * 面板以 iframe 嵌入 host 插件伺服的 /learnhub SPA（ui/ 构建产物），
 * 页面本体改动无需重建客户端（host 每次请求现读 web/dist）。
 * 架构参照 dsh-worktable：slots 座位注入 + ModuleLoader 单文件 bundle。
 */

/** 面板开关与分屏状态的模块级 store（侧边栏区块与 overlay 组件跨座位共享）。 */
const panelStore = {
  open: false,
  /** 分屏（默认，右侧 55%，不遮挡会话）/ 全屏切换。 */
  full: false,
  listeners: new Set<() => void>(),
  set(open: boolean) {
    if (panelStore.open === open) return
    panelStore.open = open
    for (const fn of panelStore.listeners) fn()
  },
  toggle() {
    panelStore.set(!panelStore.open)
  },
  setFull(full: boolean) {
    if (panelStore.full === full) return
    panelStore.full = full
    for (const fn of panelStore.listeners) fn()
  },
}

function usePanelOpen(): boolean {
  const [open, setOpen] = useState(panelStore.open)
  const [full, setFull] = useState(panelStore.full)
  useEffect(() => {
    const fn = () => { setOpen(panelStore.open); setFull(panelStore.full) }
    panelStore.listeners.add(fn)
    return () => { panelStore.listeners.delete(fn) }
  }, [])
  return open
}

function usePanelFull(): boolean {
  const [full, setFull] = useState(panelStore.full)
  useEffect(() => {
    const fn = () => setFull(panelStore.full)
    panelStore.listeners.add(fn)
    return () => { panelStore.listeners.delete(fn) }
  }, [])
  return full
}

/** 「与 AI 讨论本课」：取课程上下文 → 新开 dsh 会话注入首条消息 → 关面板回到会话。 */
async function discussInDsh(sessions: {
  list: { getSnapshot(): { current?: string; byId: Record<string, { cwd?: string }> } }
  create(opts?: { cwd?: string }): Promise<string>
  open(id: string): void
  binding(id: string): { session: { prompt(content: Array<{ type: 'text'; text: string }>, mode: 'queue'): Promise<unknown> } } | undefined
}, course: string, node: string, intent: string): Promise<void> {
  let pack = ''
  try {
    const res = await fetch(`/learnhub/api/discuss-pack?course=${encodeURIComponent(course)}&node=${encodeURIComponent(node)}`)
    if (res.ok) {
      const doc: unknown = await res.json()
      if (typeof doc === 'string') pack = doc
    }
  } catch { /* 上下文拿不到也能讨论（agent 可用 learnhub 工具自取） */ }
  let cwd: string | undefined
  try {
    const snap = sessions.list.getSnapshot()
    cwd = snap.current ? snap.byId[snap.current]?.cwd : undefined
  } catch { /* 无当前会话时让 host 自行解析目录 */ }
  const sessionId = await sessions.create(cwd ? { cwd } : {})
  sessions.open(sessionId)
  const text = [
    '（本条消息来自学习中心面板「与 AI 讨论本课」。请先读课程上下文，再回应学习者的请求；'
    + '涉及数据修改时遵守 learnhub 技能 SOP：题库/图/状态走 learnhub_* 工具，正文修订后跑 learnhub_content_check。）',
    pack,
    `[学习者的请求] ${intent}`,
  ].filter(Boolean).join('\n\n---\n\n')
  const binding = sessions.binding(sessionId)
  await binding?.session.prompt([{ type: 'text', text }], 'queue')
}

const css = `
.dsh-lh_section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
}
.dsh-lh_btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-normal, #d4d4d4);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}
.dsh-lh_btn:hover { background: var(--background-modifier-hover, rgba(255,255,255,.07)); }
.dsh-lh_btn[data-open="true"] { background: var(--background-modifier-hover, rgba(255,255,255,.07)); }
.dsh-lh_icon { font-size: 15px; line-height: 1; }
.dsh-lh_overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  /* 默认右侧分屏（不遮挡会话界面）；data-full 时全屏 */
  width: min(55vw, 1100px);
  min-width: 420px;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  background: var(--background-primary, #1e1e1e);
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.35);
}
.dsh-lh_overlay[data-full="true"] {
  width: 100vw;
  min-width: 0;
  box-shadow: none;
}
.dsh-lh_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid var(--background-modifier-border, rgba(255,255,255,.09));
  color: var(--text-normal, #d4d4d4);
  font-size: 13px;
  flex: none;
}
.dsh-lh_title { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.dsh-lh_close {
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted, #999);
  font-size: 13px;
  padding: 4px 10px;
  cursor: pointer;
}
.dsh-lh_close:hover { background: var(--background-modifier-hover, rgba(255,255,255,.07)); color: var(--text-normal, #d4d4d4); }
.dsh-lh_frame { flex: 1; width: 100%; border: none; background: var(--background-primary, #1e1e1e); }
`

/** 侧边栏底栏入口：一个按钮切换面板开关。 */
function LearnhubSection() {
  const open = usePanelOpen()
  return (
    <div className="dsh-lh_section">
      <button
        type="button"
        className="dsh-lh_btn"
        data-open={open}
        title="打开学习中心面板"
        onClick={() => panelStore.toggle()}
      >
        <span className="dsh-lh_icon">📚</span>
        <span>学习中心</span>
      </button>
    </div>
  )
}

/** 全屏/分屏面板 overlay（shell.overlay 座位）：iframe 嵌入 /learnhub 独立页。
 * 监听面板 postMessage：learnhub:discuss → 取上下文、新开 dsh 会话注入首条消息、收起面板。 */
function LearnhubPanel(props: { sessions: unknown }) {
  const open = usePanelOpen()
  const full = usePanelFull()
  // Esc 关闭；iframe 获焦时宿主收不到 keydown，这里监听捕获阶段兜底
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') panelStore.set(false)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])
  // 面板 → 宿主桥：课程讨论请求转 dsh 会话
  useEffect(() => {
    if (!open) return
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { type?: string; course?: unknown; node?: unknown; intent?: unknown } | null
      if (!data || typeof data !== 'object' || data.type !== 'learnhub:discuss') return
      const course = typeof data.course === 'string' ? data.course : ''
      const node = typeof data.node === 'string' ? data.node : ''
      const intent = typeof data.intent === 'string' && data.intent.trim() ? data.intent.trim() : '请带我过一遍本节内容，指出我可能卡住的地方。'
      if (!node) return
      void discussInDsh(props.sessions as Parameters<typeof discussInDsh>[0], course, node, intent)
        .then(() => panelStore.set(false))
        .catch(err => console.error('[dsh-learnhub] discuss failed:', err))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [open, props.sessions])
  if (!open) return null
  return (
    <div className="dsh-lh_overlay" data-full={full}>
      <div className="dsh-lh_header">
        <div className="dsh-lh_title"><span className="dsh-lh_icon">📚</span>学习中心</div>
        <button type="button" className="dsh-lh_close" onClick={() => panelStore.setFull(!full)}>
          {full ? '分屏' : '全屏'}
        </button>
        <button type="button" className="dsh-lh_close" onClick={() => panelStore.set(false)}>
          关闭（Esc）
        </button>
      </div>
      <iframe className="dsh-lh_frame" src="/learnhub" title="学习中心" />
    </div>
  )
}

export const inject = ['slots', 'sessions']

export function apply(ctx: any) {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.setAttribute('data-dsh-plugin', 'dsh-learnhub')
    style.textContent = css
    document.head.appendChild(style)
    return () => { style.remove() }
  }, 'dsh-learnhub: styles')

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'dsh-learnhub-panel',
    order: 90,
  }, () => <LearnhubPanel sessions={ctx.sessions} />), 'dsh-learnhub: panel overlay')

  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'dsh-learnhub',
    order: 30,
  }, LearnhubSection), 'dsh-learnhub: sidebar entry')
}
