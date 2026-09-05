/**
 * 内容渲染器与节类型清单——UI 渲染注册表与引擎提示词的单一事实源（零依赖）。
 *
 * 消费方：
 * - ui/src/components/renderers.ts：按 lang 实现渲染器、MdView 查表分发
 * - src/engine/content.ts：loadPrompt 把清单注入生成提示词、gateReport 校验未注册 lang
 *
 * 扩展新格式 = 在 RENDERERS 加一项 + UI 注册表加一个实现，两侧自动同步。
 */
export interface RendererSpec {
  /** 代码块语言标记（```lang）。 */
  lang: string
  label: string
  /** 创作提示：这个格式适合表达什么。 */
  hint: string
  /** 写法示例（注入提示词）。 */
  example: string
}

export const RENDERERS: RendererSpec[] = [
  {
    lang: 'mermaid',
    label: 'Mermaid 图',
    hint: '流程图、时序图、状态图等矢量示意图',
    example: '```mermaid\ngraph LR\nA[概念] --> B[应用]\n```',
  },
  {
    lang: 'math',
    label: '数学公式',
    hint: 'KaTeX 排版；行内 $...$、独立成行 $$...$$，直接写在正文里，不用代码块',
    example: '行内 $E = mc^2$；独立公式 $$\\int_0^1 x^2\\,dx = \\tfrac{1}{3}$$',
  },
  {
    lang: 'media',
    label: '音视频',
    hint: '代码块内每行写一个 vault 相对媒体路径，按扩展名渲染为视频/音频播放器',
    example: '```media\n<课程根>/课程图/demo.mp4\n```',
  },
  {
    lang: 'interactive',
    label: '交互模拟',
    hint: '代码块内写一个 vault 相对 HTML 路径（自包含交互件，禁外联），面板内嵌沙箱渲染；交互件结尾应 postMessage({type:\'LEARNHUB_COMPLETE\'},\'*\') 上报完成',
    example: '```interactive\n<课程根>/交互/单摆模拟.html\n```',
  },
]

export interface SectionTypeSpec {
  /** 节标题前缀（`## 前缀：标题`）。 */
  prefix: string
  label: string
  /** 该类型节的创作要求（提示词用）。 */
  rule: string
}

/** 节 = 类型化原子学习单元；无前缀默认「概念」。 */
export const SECTION_TYPES: SectionTypeSpec[] = [
  { prefix: '概念', label: '概念', rule: '只讲一个知识点：动机融进行文（不设栏目化标题），定义 → 最小示例' },
  { prefix: '例题', label: '例题', rule: '完整 worked example：题目 → 分步解答 → 参考答案' },
  { prefix: '演示', label: '演示', rule: '可视化承载主要信息（图表/图片/动画/交互），文字只作旁注' },
  { prefix: '小结', label: '小结', rule: '要点回顾与易错点清单' },
]

/** 节标题解析 → {type, clean}；无匹配前缀返回默认「概念」类型。 */
export function parseSectionTitle(title: string): { type: SectionTypeSpec; clean: string } {
  const m = title.match(/^(.+?)[:：]\s*(.+)$/)
  const hit = m ? SECTION_TYPES.find(t => t.prefix === m[1].trim()) : undefined
  if (hit && m) return { type: hit, clean: m[2].trim() }
  return { type: SECTION_TYPES[0], clean: title.trim() }
}

/** 渲染能力清单 → 提示词注入段（{{renderers}} 占位符替换文本）。 */
export function rendererCapabilityBlock(): string {
  const out: string[] = ['## 面板支持的渲染格式（只能使用下列格式；未列出的格式面板无法渲染，写了等于没写）', '']
  for (const r of RENDERERS) {
    out.push(`- **${r.label}**：${r.hint}。写法：`, '', r.example, '')
  }
  out.push('- **图片/动画**：`![[<课程根>/课程图/xx.png]]`（支持 png/jpg/webp/gif/svg，路径相对 vault 根）', '')
  return out.join('\n')
}

/** gateReport 白名单外的代码块语言 → 未渲染能力警告用的通用编程语言。 */
export const PLAIN_CODE_LANGS = new Set([
  'text', 'plain', 'txt', 'code', 'yaml', 'yml', 'json', 'bash', 'sh', 'shell',
  'python', 'py', 'js', 'javascript', 'ts', 'typescript', 'sql', 'java', 'c',
  'cpp', 'html', 'css', 'xml', 'md', 'markdown', 'diff', 'none', '',
])
