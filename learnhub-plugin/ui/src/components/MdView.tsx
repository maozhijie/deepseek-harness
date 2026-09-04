/** 课程正文 Markdown 渲染：react-markdown + remark-gfm（表格/删除线/任务列表）。
 * mermaid 代码块动态 import 渲染为 SVG（失败降级显示源码）；Obsidian 图片嵌入
 * ![[path]] 预处理为面板文件路由 URL。不渲染裸 HTML（生成内容无注入面）。 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Obsidian 嵌入语法 → 标准 markdown 图片（面板 /file 路由伺服 vault 相对路径）。 */
function preprocessWikilinks(md: string): string {
  return md.replace(/!\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g, (_m, path: string, label?: string) => {
    const p = path.trim().replace(/\\/g, '/')
    const alt = (label ?? '').trim() || p.split('/').pop() || p
    return `![${alt}](/learnhub/api/file?path=${encodeURIComponent(p)})`
  })
}

/** mermaid 块渲染：动态加载库，主题跟随 arco-theme。 */
const MermaidBlock: React.FC<{ code: string }> = ({ code }) => {
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const idRef = useRef(`mmd-${Math.random().toString(36).slice(2, 9)}`)
  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const mermaid = (await import('mermaid')).default
        const dark = document.body.getAttribute('arco-theme') === 'dark'
        mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'default' })
        const { svg } = await mermaid.render(idRef.current, code)
        if (!cancelled) { setSvg(svg); setFailed(false) }
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => { cancelled = true }
  }, [code])
  if (failed) {
    return <pre className='md-mermaid-fallback'><code>{code}</code></pre>
  }
  if (svg === null) return <pre className='md-mermaid-fallback'><code>{code}</code></pre>
  return <div className='md-mermaid' dangerouslySetInnerHTML={{ __html: svg }} />
}

export default function MdView(props: { md: string; className?: string }) {
  const md = useMemo(() => preprocessWikilinks(props.md), [props.md])
  return (
    <div className={`md-body ${props.className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className: cls, children, ...rest }) {
            const text = String(children ?? '')
            if (/language-mermaid/.test(cls ?? '')) return <MermaidBlock code={text.replace(/\n$/, '')} />
            return <code className={cls} {...rest}>{children}</code>
          },
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  )
}
