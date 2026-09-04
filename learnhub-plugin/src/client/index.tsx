import { useEffect, useState } from 'react'

/**
 * dsh-learnhub 客户端：侧边栏底栏「学习中心」入口 + 全屏面板。
 * 面板以 iframe 嵌入 host 插件伺服的 /learnhub SPA（ui/ 构建产物），
 * 页面本体改动无需重建客户端（host 每次请求现读 web/dist）。
 * 架构参照 dsh-worktable：slots 座位注入 + ModuleLoader 单文件 bundle。
 */

/** 面板开关的模块级 store（侧边栏区块与 overlay 组件跨座位共享）。 */
const panelStore = {
  open: false,
  listeners: new Set<() => void>(),
  set(open: boolean) {
    if (panelStore.open === open) return
    panelStore.open = open
    for (const fn of panelStore.listeners) fn()
  },
  toggle() {
    panelStore.set(!panelStore.open)
  },
}

function usePanelOpen(): boolean {
  const [open, setOpen] = useState(panelStore.open)
  useEffect(() => {
    const fn = () => setOpen(panelStore.open)
    panelStore.listeners.add(fn)
    return () => { panelStore.listeners.delete(fn) }
  }, [])
  return open
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
  inset: 0;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  background: var(--background-primary, #1e1e1e);
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

/** 全屏面板 overlay（shell.overlay 座位）：iframe 嵌入 /learnhub 独立页。 */
function LearnhubPanel() {
  const open = usePanelOpen()
  // Esc 关闭；iframe 获焦时宿主收不到 keydown，这里监听捕获阶段兜底
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') panelStore.set(false)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])
  if (!open) return null
  return (
    <div className="dsh-lh_overlay">
      <div className="dsh-lh_header">
        <div className="dsh-lh_title"><span className="dsh-lh_icon">📚</span>学习中心</div>
        <button type="button" className="dsh-lh_close" onClick={() => panelStore.set(false)}>
          关闭（Esc）
        </button>
      </div>
      <iframe className="dsh-lh_frame" src="/learnhub" title="学习中心" />
    </div>
  )
}

export const inject = ['slots']

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
  }, LearnhubPanel), 'dsh-learnhub: panel overlay')

  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'dsh-learnhub',
    order: 30,
  }, LearnhubSection), 'dsh-learnhub: sidebar entry')
}
