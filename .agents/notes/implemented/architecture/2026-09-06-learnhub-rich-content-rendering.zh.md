# Agent Note：LearnHub 用单一共享渲染清单承载富生成内容

Status: implemented

[English](2026-09-06-learnhub-rich-content-rendering.md) | 中文

## 问题

LearnHub 生成内容此前只能表达公式、mermaid 图、vault 图片与 v1 交互件。MathAcademy 式课程需要精确几何示意图、函数图像、数据图表、交互件内公式，以及能在答疑时驱动交互件的 AI 老师。三个结构性缺口挡住了这条路：提示词能力清单、质检门白名单与面板渲染注册表要靠手工同步；交互件沙箱禁止一切外部加载，widget 库与公式没有供给路径；内置提示词模板只在首用时落盘，模板升级到不了存量课程。

## 决策

`shared/content-renderers.ts` 是块格式的单一事实源：`RENDERERS` 的一项同时驱动生成提示词能力段、质检门语言白名单与面板注册表对账（`verifyRendererCoverage`）。新格式 = 清单一项 + UI 一处实现：`svg`（模型手写 SVG，经 DOMPurify svg profile + URI 白名单清洗）、`plot`（模型产出数学对象闭联合集 JSON spec，面板用 `mathjs/number` 求值、Mafs 绘制）、`chart`（模型产出标准 ECharts option，渲染器把 series 限制为 line/bar/pie/scatter、拒绝外部 URL，并只从 `echarts/core` 按需注册这几类模块）。

交互件契约升级到 v2：交互件内嵌 `widget-config` JSON（`type` 必须是 simulation/visualization3d/diagram/game/code 之一）；缺 config 降级为警告（存量 v1 交互件不返工），JSON 不可解析或类型未知是 finding。host 从 `/learnhub/api/vendor/*` 伺服 vendored KaTeX 与 Three.js（`build.mjs` 从面板 node_modules 复制、`web/vendor/` 纳入 git），交互件沙箱 CSP 在 `script-src`/`style-src`/`img-src`/`font-src` 上放开 `'self'`，`default-src 'none'` 继续封死一切网络请求。伺服路由对含公式定界符且未自带 KaTeX 的交互件注入 vendored auto-render，存量交互件免重生成即获得公式渲染。面板经 React context 总线向学习视图内全部交互件广播 `LEARNHUB_TEACHER` 动作（highlight/setState/reveal/annotate）；老师答案可携带 `learnhub-teacher` 围栏 JSON 块，抽屉将其转成「在交互件上演示」按钮。

内置提示词模板首行携带 `<!-- learnhub:prompt/vN -->` 版本标记；`loadPrompt` 比对 vault 快照版本，过期文件先复制为 `<kind>.md.bak` 再覆盖；无内置对应的自建变体不受影响。`{{renderers}}` 能力段保持加载时动态注入，不受快照影响。

Manim 动画留在纯 TS 引擎之外：`learnhub-manim` agent 技能按需渲染 MP4 资产并经普通 `media` 块引用，调度与门禁仍归引擎。

## 后果

存量课程无需重生成即可渲染新格式并通过门禁；过期快照在下次 `loadPrompt` 时升级——这意味着用户手编模板会被按设计覆盖，只能从 `.bak` 恢复。面板 bundle 因 Mafs、mathjs/number、echarts、DOMPurify 增大，全部挂在懒加载渲染 chunk 的动态 import 之后。交互件 CSP 放开 `'self'` 后也可经既有 file 路由引用 vault 图片；`connect-src` 仍被 `default-src 'none'` 封死。`web/vendor/` 与 `lib/`、`web/dist/` 同属提交产物；dev-server 复制 vendor 与 interactive 路由，保证面板走查与 host 一致。

## 验证

`scripts/e2e.mjs`（27 步，临时副本 vault）覆盖 v2 交互件门禁（缺上报与坏类型被拒、齐备过门）、富内容块门禁（plot/chart 非法 JSON 与非 SVG 块在 apply 即拒）、提示词迁移（无标记快照升级 v4 且 `.bak` 只写一次）。`scripts/smoke-panel.mjs` 断言 vendor 路由以正确 MIME 伺服 JS、拒绝 `%2e%2e` 穿越、interactive 路由响应头含 `script-src 'unsafe-inline' 'self'` 与 `default-src 'none'`；另以 scratch vault 的 fetch 断言正路径注入把 KaTeX 标签放到 `</head>` 之前。UI `tsc --noEmit`、`npm run build`、`npm run check` 全部通过。本机 Node 的 `fs.cpSync` 会原生崩溃（0xC0000409，HEAD 基线同样可复现），因此 e2e 用 readFile/writeFile 复制种子数据并同步打点各步骤。

## 已否决的替代方案

- **Mafs 之外再引 JSXGraph** —— 同一内容维护两套绘图栈；砍掉，面板只留一个几何渲染器。
- **交互件库走 CDN** —— 破坏离线可用、沙箱安全姿态与确定性渲染；vendored 同源文件在不动 `connect-src` 的前提下解决供给。
- **用结构化 widget DSL 取代自由 HTML** —— OpenMAIC 的场景 DSL 用表达力换可审计性；widget-config 元数据保留了可审计的部分，自由 HTML 仍是创作面。
- **Manim 进引擎** —— Python/LaTeX/ffmpeg 工具链与纯 TS 引擎纪律冲突；agent 技能产出同样的持久资产而不需要引擎缝。
