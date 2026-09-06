# 学习中心内容渲染升级（L1+L2+L3）实施 Spec

## 总体决策（已定死，不再选择）

| 决策点 | 结论 | 理由 |
|---|---|---|
| 静态示意图 | 新增 ` ```svg ` 渲染器，模型手写 SVG，DOMPurify 白名单清洗 | 最贴 MathAcademy 截图风格；零绘制逻辑 |
| 函数图像/坐标几何 | 新增 ` ```plot ` 渲染器：模型只产 JSON spec → Mafs（React）绘制 | 模型出数学对象、渲染器管像素，出错率最低；面板是 React 18 |
| 数据图表 | 新增 ` ```chart ` 渲染器：模型写标准 ECharts option → echarts/core 按需注册渲染 | LLM 写 ECharts JSON 的可靠性业界验证最充分；自带动画 |
| 表达式求值 | `mathjs` compile（plot 的 fn/parametric） | AGENTS「优先维护依赖，不手搓」 |
| SVG 清洗 | `dompurify`（USE_PROFILES svg） | 同上 |
| 交互件引库 | host 新增 `/learnhub/api/vendor/*` 同源伺服 + CSP 放开 `'self'`；vendor = **KaTeX + Three.js** 两个 | OpenMAIC 的 CDN 路线被现有 CSP 禁止；只 vendored 必需库，砍掉 JSXGraph（避免双绘图栈） |
| 交互件公式 | `/interactive` 路由 **伺服时**注入 vendored KaTeX（检测 `$$`/`\(`/`\[` 且未含 katex 才注入） | 移植 OpenMAIC post-processor，存量交互件免重生成即受益 |
| 交互件类型 | 提示词层类型菜单：simulation / visualization3d / diagram / game / code(`编程`)；不拆独立 prompt kind | 交互节仍是单次调用产出节+交互件，避免管线改造 |
| AI 老师操作 | 单一 panel→widget 消息 `LEARNHUB_TEACHER`（action: highlight/setState/reveal/annotate）， Tutor 答案中的 ` ```learnhub-teacher ` JSON 块 → UI 转演示按钮 | 比 OpenMAIC 四种消息类型收敛为一种，向后兼容 |
| 提示词迁移 | builtin 模板首行加 `<!-- learnhub:prompt/v<N> -->`；loadPrompt 检测 vault 版本 < builtin → 覆盖升级，旧文件存 `<kind>.md.bak` | 解决「提示词快照不随内置更新」既有坑；`{{renderers}}` 本就动态注入，仅硬编码约束文字需要迁移 |
| 明确不做 | pyodide/浏览器 Python、GeoGebra/Desmos（license+联网）、PBL 多 agent 课堂、MP4 渲染服务 | 记入 README Out of scope |

## PR1 — L1：新渲染器 + 公式扩展 + 提示词迁移

### 渲染格式清单（单一事实源）
- `shared/content-renderers.ts`：`RENDERERS` 追加三项（lang: `svg` / `plot` / `chart`），各带 label/hint/example（example 即提示词注入的写法规范）。质检门 `checkRendererLangs` 自动覆盖，UI 侧 `verifyRendererCoverage` 构建期对账。

### UI 渲染器实现（`ui/src/components/renderers.tsx`）
- 三个组件一律 **动态 import**（沿用 MermaidBlock 的 lazy 模式），失败/校验不过 → 降级源码 `<pre>` 显示（misconfig fail loud 与 mermaid 同构）。
- `SvgBlock`：dompurify 清洗（禁 script/on*/外链）→ dangerouslySetInnerHTML；最大高度 ~420px 自适应宽。
- `PlotBlock`：JSON spec schema（xRange/yRange/grid + elements 闭联合集：fn/parametric/point/vector/segment/circle/polygon/label，每个带 color/style/label 可选项）→ mathjs compile 求值 → Mafs `Plot.OfX`/`Vector`/`Circle`/`Polygon`/`Point`/`Text` 渲染；未知 element type 编译期 assertNever、运行期跳过并 console.warn。
- `ChartBlock`：JSON.parse → 守卫（series type ∈ line/bar/pie/scatter，字符串值禁 `https?://`）→ echarts/core 按需注册（4 图型 + Grid/Tooltip/Legend/DataZoom + CanvasRenderer）→ ResizeObserver + arco 主题 dark 切换。
- `ui/src/components/MdView.tsx`：InlineMd 补 code 分发（复用 renderBlock），题干/解析可带图。
- `ui/src/main.tsx` 或 MdView：`import 'katex/contrib/mhchem'`（注册 `\ce`，与 rehype-katex 共享 katex 单例）；`mafs/dist/index.css` 随组件引入。

### 依赖（`ui/package.json`）
- dependencies：`mafs`、`echarts`、`dompurify`、`mathjs`；devDependencies：`three`（仅 PR2 用，可随 PR2 加）。

### 引擎门禁（`src/engine/content.ts`）
- 新增 `checkVisualBlocks(body)`：` ```plot `/` ```chart ` 块 JSON.parse 失败 → finding；` ```svg ` 不以 `<svg` 开头 → finding。挂进 `gateReport`。

### 提示词升级 + 版本迁移（`src/engine/content.ts`）
- `PROMPT_KINDS` 六个内置模板更新：课程生成/苏格拉底/费曼/课程节生成的可视化约束文字加入 svg/plot/chart；`课程大纲` 的 `visual:` 枚举改为 `公式|mermaid|图片|交互|函数图|图表|示意图`；`题目生成` 加一句「解析可用一个 ```svg 或 ```plot 块配图」。
- 每个内置模板首行加版本注释 `<!-- learnhub:prompt/v4 -->`；`loadPrompt` 改造：vault 文件无标记或版本 < builtin → 备份为 `<kind>.md.bak`（覆盖旧 bak）后写入 builtin。自建变体不受影响。
- 同步覆盖本机 vault 存量快照（`学习中心/state/提示词/*.md`），走迁移逻辑自动完成。

### PR1 验证
- `scripts/e2e.mjs` 增 case：plot/chart 合法 JSON 过门、非法 JSON 被拒、svg 块过门、旧版提示词文件触发迁移 + bak 生成。
- `npm run build`（vite 对账门 + verifyRendererCoverage）+ `npm run check`（ui typecheck）+ e2e 全绿。
- README「面板支持的渲染格式」与目录说明更新；Agent Note 一个（`.agents/notes/`，随 PR 提交）。

## PR2 — L2：交互件契约 v2 + vendor 同源伺服 + AI 老师操作

### vendor 伺服
- `build.mjs`：新增 `copyVendor()` — 从 `ui/node_modules` 复制 katex（min.css/katex.min.js/contrib/auto-render.min.js/fonts/）与 three（`build/three.module.js`、`examples/jsm/controls/OrbitControls.js`）→ `web/vendor/`；`web/vendor/` 纳入 git（与 lib/web/dist 同属提交产物）。
- `src/index.ts`：新增 `GET /learnhub/api/vendor/*` 路由 — 根目录 `web/vendor/`（`fileURLToPath(new URL('../web/vendor/', import.meta.url))`），防穿越守卫与 SPA 同款，MIME 复用 `ASSET_MIME`，`cache-control: public, max-age=86400`。

### CSP 放开（`src/index.ts` /interactive 路由）
- 改为 `default-src 'none'; script-src 'unsafe-inline' 'self'; style-src 'unsafe-inline' 'self'; img-src data: blob: 'self'; font-src data: 'self'; connect-src 'none'`。附带能力解锁：交互件可经 `/file` 引 vault 图片（README 更新）。

### 伺服时 KaTeX 注入（`src/index.ts` /interactive 路由）
- 新增 `injectKatexIfMathed(html)`：检测 `$$`/`\(`/`\[` 且 HTML 不含 katex → `</head>` 前注入 `<link href="/learnhub/api/vendor/katex/katex.min.css">` + `<script src=.../katex.min.js>` + `<script src=.../contrib/auto-render.min.js>` + 行内初始化脚本（移植 OpenMAIC 的 delimiter 配置，URL 全部改相对 vendor 路径）。

### 交互件契约 v2（`src/engine/content.ts`）
- `interactiveSpecBlock()` 重写为类型化规范：**widget-config 必填**（`<script type="application/json" id="widget-config">`，字段 type/description/variables/presets）；类型菜单五类，各附 8–12 行紧凑检查表（从 OpenMAIC simulation/visualization3d/game/diagram/code 模板提炼：复位状态机、44px 触控、可见动画、光照/缩放按钮（3D）、Mobile 布局、switch 块作用域）；visualization3d 给 vendored importmap 模板（`"three": "/learnhub/api/vendor/three/three.module.js"`、`"three/addons/"` 同理）；**AI 老师协议监听样板**：`window.addEventListener('message', e => e.data.type === 'LEARNHUB_TEACHER' && ...)`（highlight/setState/reveal/annotate 四 action，学习器侧必须实现）。
- `checkInteractiveHtml` 升级：保留 200KB/外联检查；新增 `LEARNHUB_COMPLETE` 上报缺失 → finding；widget-config 存在但 JSON 不可解析或 type 不在菜单 → finding；存量交互件无 widget-config → warn（不返工）。

### 面板：WidgetBus + Tutor 桥（`ui/src/components/`）
- 新增 `widget-bus.tsx`：React context（`register(id, post) / broadcast(msg)`）。
- `renderers.tsx` `InteractiveBlock`：挂载时向 WidgetBus 注册 `iframe.contentWindow.postMessage` 发送器，卸载注销。
- `LessonView.tsx`：包裹 WidgetBus.Provider；`TutorDrawer.tsx`：解析 assistant 答案中的 ` ```learnhub-teacher ` JSON 块 → 渲染为「在交互件上演示」按钮（chips），点击 `broadcast({type:'LEARNHUB_TEACHER', action, selector?, state?, text?})`。
- `src/index.ts` `/tutor` 路由的 system prompt 增补：需要演示时输出 ` ```learnhub-teacher ` 块的格式说明（单一 target=all 广播语义，selector 用 CSS 选择器、state 为变量名→值映射）。

### PR2 验证
- `scripts/smoke-panel.mjs` 增断言：`/learnhub/api/vendor/katex/katex.min.js` 200 + 正确 content-type；`/interactive` 响应 CSP 头含 `script-src 'self'`。
- e2e 增 case：widget-config 齐备过门、缺 COMPLETE 上报被拒、math 交互件 serve 后响应体含注入的 katex link。
- 手动：dev-server 起服务，生成一个含 `$$` 的交互件确认公式渲染；Tutor 演示按钮驱动 highlight。
- README 交互件契约章节重写；Agent Note 一个。

## PR3 — L3：Manim 技能 + 编程交互类型

- `skills/learnhub-manim/SKILL.md`（build 时随 syncSkills 安装到 `<dshHome>/skills/`）：SOP = 前置自检（python/manim/latex/ffmpeg 可用性，缺失给 fail-loud 安装指引）→ 在 `<课程根>/课程图/manim/<node>_<slug>.py` 写场景脚本 → `python -m manim -qm` 渲染 mp4 → 移入 `课程图/` → 正文加 ` ```media ` 引用块 → 跑 `learnhub_content_check` 修尽 findings。定位：**agent 技能而非引擎功能**（与纯 TS 引擎纪律一致，按需在「与 AI 讨论本课」会话里调用）。
- 「编程」交互类型（纯 JS）：并入 PR2 已建的类型菜单 + 提示词检查表（代码编辑器 + 运行按钮，沙箱内 `new Function`/Web Worker 执行、输出面板、完成上报）；widget-config `type: "code"`。不引 pyodide。
- e2e 增 code 类型 widget-config 过门 case；README 工具面/技能清单更新；Agent Note 一个。

## 关键文件清单
`shared/content-renderers.ts` · `ui/src/components/{renderers,MdView,LessonView,TutorDrawer}.tsx` · `ui/src/components/widget-bus.tsx`(新) · `ui/package.json` · `src/engine/content.ts` · `src/index.ts` · `build.mjs` · `scripts/{e2e,smoke-panel}..mjs` · `skills/learnhub-manim/SKILL.md`(新) · `learnhub-plugin/README.md` · `.agents/notes/`（每 PR 一篇）

## 假设与风险
- Mafs/echarts/mathjs/dompurify 使面板 bundle 增 ~150KB gz（均动态 import，首屏不涨）；本地面板可接受。
- Mafs 需 React ≥18（当前 18.3 ✓）；echarts 按需注册树摇后 ~120KB gz。
- CSP 放开 `'self'` 后交互件仍无外联面（connect-src 由 default-src 'none' 封死）；`img-src 'self'` 解锁 vault 图片属有意的能力升级。
- 提示词版本迁移会覆盖用户手编模板（.bak 保底）——这是产品语义选择：内置升级必须传播，用户定制以 bak diff 恢复。
- 存量课程无需重生成：KaTeX 伺服注入对旧交互件生效；无 widget-config 旧件降级为 warn。