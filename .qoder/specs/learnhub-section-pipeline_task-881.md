# LearnHub 节粒度内容管线与学习视图重构（四阶段）

## 现状关键事实（已核实）

- 生成：`generateContent`（src/index.ts:168）= 一次 LLM 调用整节点正文 → `engine.contentApply` 质检落盘 draft → `generateQuiz` 自动出题；genJobs 状态机已有 phase/取消/重试语义。
- 节：正文 `## 类型：标题` 前缀，`Sessions.lessonSections`（sessions.ts:248）运行时切分；`PracticeFlow.buildRounds` 按节标题字符串配题（`question.section` 存标题）；节无 id、无状态。
- 渲染：`RENDERERS` 注册表含 `interactive`（renderers.tsx:65 InteractiveBlock 沙箱 iframe）；`LEARNHUB_COMPLETE` 只亮徽标、无 score、不结算；`extractInteractive`（content.ts:427）已支持模型内联 HTML（```learnhub-interactive:<rel>```)提取落盘，但提示词从未告知模型该写法。
- 质检：`gateReport`（content.ts:402）已查超纲/别名/未注册 lang/交互件文件存在性；`applyGeneration`（content.ts:571）version+1、status=draft、整体替换 `fm.content`。
- 可读性诊断（截图）：内容列已居中；真问题是舞台层级缺失（卡 800px/文字 640px/页面 2000px 三层打架）、并列块无视觉分块、行内 chip 密度过高、子标题与正文同字号、顶部信息碎片堆叠、进度不可见。

---

## Phase 0 — 学习视图「舞台」重构（先行，独立于生成改造）

### 0.1 版式骨架（ui/src/components/LessonView.tsx + PracticeFlow.tsx）
- 学习内容列改「舞台」布局：单列 max-width 720px 水平居中，分屏窄列自适应 `min(720px, 100%)`；卡内文字仍左对齐（居中只发生在舞台与 display 公式层面）。
- 节进度 stepper：卡片头上方横向进度条（每节一个节点：已过=实心、当前=高亮、未到=空心；读节/练习节形状区分）——数据源先用 lessonSections 运行时切分序列，Phase 1 manifest 落地后自动切换；已过节可点击跳转（与「上一步」同语义）。
- 节点头部重排为两行：标题行（← 返回 + 节点标题 + 类型 tag + 掌握度）+ 动作行（问 AI 老师 / 与 AI 讨论本课 / 在图中查看 / 跳过此节点，合并为一个右对齐工具条），消除五层碎片堆叠。
- 底部常驻的灰色玩法说明收进动作行 InfoCircle Tooltip；居中单行提示语保留。

### 0.2 排版系统（ui/src/global.css .md-body）
- 正文档位升 16px / 行高 1.8 / 段距 1em；文本元素限宽 680px；卡片 padding 24–28px。
- 标题层级拉开：h3 17px、h4 16px、margin-top 1.6em——「误区一」这类子标题一眼可辨。
- blockquote 升级为 callout 卡：左侧 3px 主题色条 + 浅底（--color-fill-1）+ 8/12px padding——误区/要点块的视觉分块载体。
- 行内 code：0.9em、padding 1px 5px、bg --color-fill-3，降低密集 chip 的突兀感。
- `.katex-display`：居中 + margin 1.2em auto + 保留横向滚动。
- 全部走 arco 变量，深浅主题自适应（既有惯例）。

### 0.3 组件细节（QuestionCard.tsx / PracticeFlow.tsx）
- 题干 16px/1.75；选项行距 ≥ 10px；判卷反馈块用 callout 样式（对=绿条、错=红条）。
- 阅读卡卡尾按钮区（上一步/继续）右对齐并与文字列对齐。

### 0.4 生成侧排版契约（在 Phase 1.2 同步落地）
- `课程节生成` 提示词内嵌排版约定：误区/注意/要点块用 blockquote；关键结论用 display 公式；每节 ≤ 400 字 + 至少一个可视化——排版升级从存量样式变成增量内容契约。

---

## Phase 1 — 大纲 + 逐节生成

### 1.1 节清单数据模型
- `src/engine/types.ts`：`Fm.content` 增加可选字段 `sections?: SectionManifest[]`，`SectionManifest = { id: string; title: string; type: string; status: 'pending' | 'ready'; version: number }`。
- `notes.ts`：`defaultFrontmatter`/`asFm` 不强制该字段（旧笔记兼容）；`feedback`/`review` 的 content spread 自动保留。
- `content.ts applyGeneration`：整节点应用（风格变体路径）时从 body 重解析 manifest 并全部标 ready。

### 1.2 提示词（content.ts PROMPT_KINDS）
- 新增 `课程大纲`：输入上下文包（`engine.contentPack`），输出 YAML `sections: [{id, title, type, points, visual}]`；约束 3-7 节、每节单知识点、类型分布（概念为主 + 至少一个例题/演示）、`承上启下`/`内容反馈` 不入大纲。
- 新增 `课程节生成`：输入 = 大纲 YAML + 本节 spec + 前一节已生成正文（连贯性锚点）+ `{{renderers}}` 能力清单；输出单节 `## 类型：标题` 正文；模板内嵌 Phase 0.4 排版约定。
- `课程生成`（含苏格拉底/费曼变体）保留为整节点兼容路径，不迁移。
- vault 快照：向 `obdb/学习中心/state/提示词/` 预写 `课程大纲.md`、`课程节生成.md`（规避 stale-snapshot 陷阱，做法同 2026-09-05 同步）。

### 1.3 引擎节级方法
- `content.ts` 新增 `outlineApply(courseKey, node, yaml)`：校验（id 唯一、type ∈ SECTION_TYPES、title 非空）→ manifest 写入 frontmatter（全 pending）→ journal 流水。
- `content.ts` 新增 `sectionApply(courseKey, node, sectionId, md)`：按节正文跑 gateReport（复用 checkRendererLangs/aliases/interactive 检查）→ body 手术（按 manifest.title 定位 `## ` 段，存在则替换、否则按 manifest 顺序插入；保护 `## 练习`/`## 答案`/`## 内容反馈` 区）→ 该节 status=ready、version+1 → contentVersion 递增。
- `src/engine/index.ts` 暴露 `contentOutline` / `contentSection` RPC；`src/index.ts` 加路由 + `sectionRewrite(course, node, sectionId)`（单节重生成，复用节模板）。

### 1.4 生成管线重构（src/index.ts generateContent）
- phase: `'outline' → 'sections' → 'quiz'`；`GenJob` 增加 `progress: { done: number; total: number; current?: string }`。
- 逐节循环：每次 `llmComplete` 前查 `job.status === 'cancelling'`（沿用现有取消语义，结果丢弃不落盘）。
- 断点续跑：重试时跳过 manifest 中 `status === 'ready'` 的节。
- quiz 阶段：`questionGenerate` 调用注入大纲节标题清单；`题目生成` 模板加硬约束「section 字段必须精确等于清单中的标题」。

### 1.5 UI
- `GeneratePage.tsx`：进度显示 done/total + current 节标题（轮询 `api/generate/status` 已有）。
- `LessonView.tsx`：节头（Collapse header）加「重写本节」入口 → `sectionRewrite`，busy 态禁重复点击。

## Phase 2 — 练习节一等化

### 2.1 节类型
- `shared/content-renderers.ts` SECTION_TYPES 加 `{ prefix: '练习', label: '练习', rule: '本节为题组：题目由题库提供，正文只写能力目标与作答引导，不写题' }`；`parseSectionTitle` 自动识别。

### 2.2 题目绑定节 id
- `question.section` 语义改为 manifest id；bank 加载兼容：id 优先、标题回退匹配（旧数据不动）。
- `questionGenerate`（index.ts:823）改为按节出题：每节一次调用（注入该节正文 + id + 2-3 道量），题目带 `section: <id>`；`generateContent` 的 quiz 阶段按大纲逐节出题。

### 2.3 rounds 由节序列驱动
- `PracticeFlow.buildRounds`：入参改为 manifest 序列（id/type/title/md + 按 sectionId 分组的题）；内容节 → read 轮，练习节 → quiz 轮；无节归属的题仍进「通用」收尾轮。上一步/只答一次语义不变。
- lesson payload（sessions.ts lesson + index.ts:361）携带 manifest；旧节点无 manifest 时回退今天的标题配对逻辑。

## Phase 3 — 交互件节 + score 结算

### 3.1 节类型与生成
- SECTION_TYPES 加 `{ prefix: '交互', ... }`，rule：一节 = 一个交互模拟 + 少量旁注；正文用 ```learnhub-interactive:<课程根相对路径> + 完整自包含 HTML```。
- `rendererCapabilityBlock`（shared）增加内联创作写法与质量要求（自包含、禁外联、结尾 `postMessage({type:'LEARNHUB_COMPLETE', score, detail}, '*')` 上报）；大纲阶段允许规划交互节（visual=interactive）。

### 3.2 score 结算契约
- 协议：`{type:'LEARNHUB_COMPLETE', score?: number(0-1), detail?: string}`。
- `renderers.tsx InteractiveBlock`：收到带 score 的 COMPLETE → 调新 RPC `api/interactive/settle`（course/node/sectionId/score/detail）→ 徽标显示得分。
- `engine.interactiveSettle`：同 sectionId 同日只结算一次（防刷）→ `store.appendPractice({ judge: 'interactive', ... })` + `applyPracticeEvidence` 节点 EMA（掌握度链路复用，无题卡、不碰 FSRS）。

### 3.3 沙箱 gate
- `gateReport` 增加交互件静态扫描：HTML 含 `http(s)://` 外链 src/href 或 `fetch(`/`XMLHttpRequest` 字面量 → findings（拒绝落盘）；单文件 > 200KB → findings。

---

## 兼容与迁移
- 正文单文件格式不变（Obsidian 笔记保持完整可读）；frontmatter 只增可选字段；released 数据不搬不动。
- 旧节点无 manifest：运行时回退（标题切分 + 标题配题）；`QUEUE_REGEN` 重生成即升级到新管线。

## 验证与交付
- 每阶段：`ui npm run typecheck` → `node build.mjs` → `npm run check`。
- Phase 0 增加深/浅两主题 × 分屏/全屏两种宽度的视觉冒烟；stepper 跳转与「上一步」行为对齐。
- 手工冒烟（面板）：测试节点生成全流程（大纲/逐节/进度/取消/断点续跑）；单节重写；题目节绑定（不再落「通用」）；练习节轮转；交互节 HTML 落盘 + gate 拒外联用例 + score 入 practice 流水。
- 仓库约定：非平凡变更附 Agent Note（`.agents/notes/`）；`learnhub-plugin/README.md` 生成流程章节同步更新。

## 假设
- 出题保持引擎直调 LLM 注入模式（llm 由 host 注入）不变。
- 风格变体（苏格拉底/费曼）Phase 1 不迁移逐节路径。
- Phase 0 不依赖 Phase 1 数据模型：stepper 先吃运行时切分的节序列，manifest 落地后自动切换数据源。