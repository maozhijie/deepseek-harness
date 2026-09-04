# dsh-learnhub

学习中心 Learnhub：DeepSeek Harness 的学习引擎插件（v3 纯 TS 引擎 + allo 移植面板）。

Python 引擎已退役：原 `spawn python -m learnhub` 的全部逻辑吸收进
`src/engine/`（TS），同进程直调，不再有子进程与 CLI 逃生口。
评分模型是**题目级 FSRS 刷卡**：每道题自带一张调度卡，作答对错直接推进该题；
节点掌握度 = 其题目作答数据的汇总（派生，无自评）。
事实源依旧在 Obsidian Vault，调度仍是 ts-fsrs 日粒度。
XP 是**时间账本**（1 XP ≈ 1 分钟有效专注）：节点定价 = 内容标称 est × FSRS 难度
客观校准 k，完成时 settle 对账锁定；课程不变则总账有序稳定（见「XP 预算制」）。

- **host**（`lib/index.js`）：16 个 agent 工具直调 engine、`/learnhub/api/*` 面板后端、`/learnhub` SPA 伺服（`web/dist/`，改 UI 重跑 build 即生效）
- **client**（`lib/client.js`）：侧边栏底栏「学习中心」入口 + iframe 面板（默认右侧分屏，头部可切全屏）
- **引擎**（`lib/engine.js`）：独立构建产物，脚本（smoke/e2e/dev-server）与 UI 复用同一入口
- **面板 UI**（`ui/`）：Vite + React 18 + Arco Design + React Flow（@xyflow/react + dagre），组件移植自 allo learning 模块

## 数据主权（v3）

vault `学习中心/` 是唯一事实源，没有数据库：

| 数据 | 位置 | 说明 |
|---|---|---|
| 题目级调度 | `<课程根>/题库/<节点>.yaml` | **每题一张 FSRS 卡**（`fsrs` 块：due/stability/difficulty/reps/lapses）+ 作答统计（`stats.attempts/correct/last`）；作答对错驱动推进 |
| 节点状态 | 课程笔记 frontmatter | `stage`（unseen/ready/learning/review/mastered/skipped）+ `mastery` + `practice` 计数/EMA；`fsrs` 字段是节点题目的聚合代表（到期最早那张卡的快照，审计与兼容用） |
| 图结构 | `<课程根>/data/*.yaml` | region/block/nodes{name,pre,opt,note,enc,est?,type?}，人类可读可手编；`est` 为标称学习时长（分钟，XP 内容定价）、`type: practice` 为实践节点（交互模拟交付，不出练习题） |
| 题库 | `<课程根>/题库/<节点>.yaml` | 题型 single_choice / true_false / fill_in_blank / multi_choice（字母数组）/ numeric（`tol` 容差）/ ordering / matching / reflection / open_question（AI 批改）+ 候选答案 + 解析 + `archived` |
| 流水 | `state/journal.jsonl`、`state/practice.jsonl` | 调度留痕与作答记录（审计用），逐行追加；journal 含 `xp_settle` 对账行与 XP 过程信号 |
| 生成任务/提示词 | `state/生成任务.json`、`state/提示词/*.md` | 生成任务注册表落盘（进程重启后 running→failed 可重试）；提示词风格变体首用落盘、可手编 |
| 提案/快照 | `state/proposals.json`、`state/snapshots/*.json` | 图谱变更提案与 apply 前快照 |
| 日志 | `state/学习日志.md`、`state/运行日志.md` | 生成/审计等运行流水 |

纪律：**D14** 一切数据访问收口 `engine/` 模块，工具/路由/UI 不得绕过；
**D15** 评分即作答——判卷后直接推进该题 FSRS 并写回题库（无工作单中间层）；
XP 例外：完成节点时有一次 `xp_settle` 对账（见「XP 预算制」），属于账本层不碰调度；
`config.vault` 缺失/目录不存在加载即报错（fail loud，不做静默兜底）。

## 工具面（16 个）

- 调度与学习：`learnhub_status / recommend / lesson / rebuild / feedback / note_resolve`
- 节点操作：`learnhub_skip`（跳过/取消跳过，已有基础的节点）、`learnhub_complete`（完成确认，未答题入复习循环）
- 图谱四面：`learnhub_graph_analyze / propose / apply`
- 题库（刷卡作答流）：`learnhub_question_list / question_save / question_answer`
- 生成：`learnhub_generate`（大纲先行、正文按需；缺笔记先补骨架，on-demand 课时语义；可选 `style` 风格变体）
- 质检：`learnhub_content_check`（对现有课程笔记跑质检门——超纲引用/别名一致性/未注册代码块语言/interactive 引用文件存在；agent 手改正文后必须跑一遍并修掉全部 findings）

## 面板（Vite SPA，移植自 allo learning）

`/learnhub/` 六个页签，信息架构以「学习流为主、图为总览」，明暗双主题（arco-theme 跟随系统，可手动切换）：

- **学习**（主界面）：复习横幅（待复习数 + 开始复习）+ **「接下来」推荐流**（逾期/复习/就绪/新学大卡片，复习项来自题库聚合 due，点开直接进入节点学习视图）+ 课程卡（进度/六态计数/删除，收窄为次要区）+ 复习会话（刷卡流：只刷到期题与未做题，答对 rating3、答错 rating1，无题提示出题或完成）
- **节点学习视图（LessonView）**：学习页二级全屏视图，最大最丰富的学习容器——状态引导单按钮（无正文→「生成正文（自动出题）」；有正文无题→「AI 出题」；有题→直接练习）+ 正文分节 Markdown 渲染（GFM 表格 / mermaid 图 / Obsidian 图片嵌入 / interactive 交互件）+ 练习区（题目 FSRS 到期排序 + 九种题型 QuestionCard）+ 掌握度（题目作答汇总）+「完成学习」与「跳过」按钮（完成按钮在练习区下方，做完题再确认）+ 生成中阶段/耗时/取消（`/generate/status` 附 `contentVersion`，正文版本变化才整页刷新）+「在图中查看」低频跳转 + 右下角「问 AI 老师」抽屉（节点范围即时答疑）+「与 AI 讨论本课」（把节点上下文注入新建 dsh 会话，深度讨论/修订）
- **学习图**（全局总览，低频操作）：React Flow + dagre BT 分层 DAG——六态色板节点卡（skipped 紫色「跳」角标、practice 节点「练」角标）、推荐星标（琥珀入边引导）、前置未完成锁定虚线（skipped 视同已通过）、MiniMap、>300 节点视口裁剪；区过滤 / 节点名搜索 / 只看进行中开关；点节点进入学习视图；「在图中查看」跳入时红描边定位并居中
- **题目管理**：全库浏览/筛选/搜索、编辑（答案留空不改）、自建题（过 validateBank 门禁）、归档/恢复
- **统计**：课程六态总览（未学=unseen+ready、进行、复习、掌握、已跳过）+ XP / 每日目标 / streak / ETA（预算制推导，随作答证据越学越准）
- **生成**：正文生成任务注册表（运行中/取消/终态，落盘 `state/生成任务.json`，页面刷新可恢复，服务端为事实源；失败保留 24h + 完整错误与重试 +「与 AI 讨论」直通 dsh 会话）+「生成正文」旁风格 Select（`/prompts` 列可用变体）

### 生成与出题管线

「生成正文」= 组合管线：上下文包 + 「课程生成」提示词（可选 `style` 变体：`课程生成-苏格拉底`/`课程生成-费曼`，内置变体首用落盘 `state/提示词/` 可手编，`GET /learnhub/api/prompts` 列可用；未知 style fail loud）→ llm → 质检门 apply（draft 落盘）→ **同任务自动出题**（「题目生成」提示词 → llm 产题库 YAML → validateBank 门禁逐题落盘，九种题型混合、难度递进）；出题失败不回滚正文，可在练习页单独重试（POST `/question-generate`）。LLM 失败带稳定错误码（如 `[MISSING_CREDENTIAL/401]`）写运行日志。

正文里的交互件用标记块交付（吸收 OpenMAIC 仿真内容契约）：

````markdown
```learnhub-interactive:交互/单摆.html
<!doctype html><html>…完整自包含 HTML…</html>
```
````

apply 时拆出 HTML 落盘 `<课程根>/交互/单摆.html`，正文替换为 ```` ```interactive ```` 引用块（学习中心相对路径）；质检门校验引用文件存在。交互件写法约束：**自包含单文件**（内联 CSS/JS，禁外部网络与 CDN）、变量滑杆 + 预设、reset 完整复位（running/paused/ended 状态机）、移动端不重叠 + 44px 触控、requestAnimationFrame 且动画肉眼可见、结尾 `postMessage({type:'LEARNHUB_COMPLETE'}, '*')` 上报完成（面板显示「交互已完成」；`SHOW_ANNOTATION` 事件可让 AI 标注文字叠加）。面板经 `GET /learnhub/api/interactive?path=` 伺服：仅限启用课程根内 `.html`，CSP `default-src 'none'` 禁外联，sandbox iframe（`allow-scripts`）内运行——所以只能 canvas/SVG/DOM，加载不了 vault 图片。

`type: practice` 实践节点：图节点加 `type: practice` 后，生成提示词切换为「交互模拟 + 简短说明、不出练习题」，学习视图完成语义走无题路径，交互完成事件作 UI 引导。

### 会话化与答疑（面板 ↔ dsh 会话分层）

- **生成任务 durable**：genJobs 每次状态变更原子落盘 `state/生成任务.json`；进程重启读入，遗留 running/cancelling 标 `failed`（「进程重启中断，可重试」）。
- **问 AI 老师**（面板内即时答疑）：`POST /learnhub/api/tutor`，body 携带本节点正文 + 题库摘要 + 掌握度的 system 与完整对话历史；只答不写，历史由前端持久。
- **与 AI 讨论本课**（深度讨论/修订）：面板发 `learnhub:discuss` → host 给出 `GET /learnhub/api/discuss-pack`（节点正文 + 题库摘要 + 掌握度 + 图位置）→ client 用 `sessions.create/open` 开新 dsh 会话并把上下文与用户意图作为首条 prompt 注入 → 收起面板回到会话。agent 侧 SOP 见 `skills/learnhub-build`（何时直接回答、何时用 `learnhub_*` 工具、何时编辑课程笔记、图变更必须走 propose 人审）。

### 评分模型（题目即刷卡卡）

作答判卷后按对错映射 FSRS rating（对=3、错=1）推进**该题**的调度卡并写回题库；
同节点多题各自独立推进，互不干扰；**每题每天至多推进一次调度**——同日重复作答
（「再做一次」）只记练习统计，不再碰调度卡。**乱猜作答（耗时 < 5s 且答错）同样不碰卡**
（含首答）——难度证据只由认真作答驱动。节点 due = 其题目 due 的最小值，复习队列读
题库聚合（无题节点不进复习队列）。「完成学习」把全部未归档题纳入复习循环——
做过的按各自下次到期复习，没做过的初始化为明天起刷；节点 stage→review。
九种题型判卷：选择题字母集合相等（多选顺序无关）、true_false 布尔、填空候选归一/数值容差
（`tol`，兼容分数与百分数）、排序/配对逐项归一（排序顺序敏感）、reflection 与 open_question
走 AI（开放题 10 分制，≥6 及格，feedback 必含逐点批改 + 具体改进建议）。

### XP 预算制（est 内容定价 × FSRS 难度客观校准）

**不变量**：节点 XP 预算 = N₀ × k，是课程内容与客观难度证据的确定函数——与作答路径
（顺序、重复、乱猜）无关；完成后定价锁定，总账 = Σ已完成节点 N₀×k，课程图不变时总量有序稳定。

- **标称预算 N₀**（分钟）：节点 `est`（图 YAML 可手编、图生成提示词要求产出）优先；
  缺省回落 Σ题(题型权重 × 难度)（`XP_BASE`：single/true_false 1、fill/multi/numeric/ordering/matching 2、reflection/open 3）；
  再缺省 `XP_PER_NODE_DEFAULT`（12）。
- **难度校准因子 k**（客观、零人工干预）：k = Σ题(w_q × d̂_q) ÷ Σ题(w_q)，
  其中 d̂_q = `fsrs.difficulty / 5`（ts-fsrs difficulty ∈ [1,10]，中性 5 → 因子 1），
  无作答记录的题取 1；clamp 到 [0.5, 3]。乱猜不推进 FSRS，故乱猜不能推高节点定价。
- **结算**：作答即时入账过程信号（答对 +w×d、答错 0、乱猜 −1、同日重复 0）；
  `nodeComplete` 时以完成时刻的 N = N₀×k 对账，Δ = N − 过程净 XP 写 journal
  `{kind:'xp_settle'}`；**完成后该节点定价锁定**（重复完成 Δ=0，幂等）。
- **ETA**：剩余工作量 = Σ未完成节点当前 N₀×k（unseen+ready+learning；skipped 视同完成），
  `eta.days = ceil(剩余预算 ÷ 每日目标)`——随作答证据积累自动校准，越学越准。

## 安装

```sh
dsh plugin --profile web add "link:<repo>/learnhub-plugin"
```

bundle 已注册进 profile 的 `dsh.profile.bundles`；`time-context` 与 `schedule` 两行随 bundle patch 一起插入。

## 机器级配置（跨机器的关键）

仓库内不含任何机器路径。每台机器在自己的 profile patch
（`~/.dsh/profiles/web/cordis.patch.yml`）按 id 覆盖行 config：

```yaml
- id: dsh-learnhub
  config:
    vault: c:/Users/<you>/path/to/vault   # 必填：vault 根目录
    # centerRel: 学习中心                  # 缺省即可
    provider: deepseek-official
    model: deepseek-v4-flash
```

## 构建

```sh
cd learnhub-plugin
npm install
npm run build     # ui(vite→web/dist) + lib/index.js + lib/client.js + lib/engine.js + 技能同步
npm run check
```

`npm run build` 先构建面板 SPA（`ui/` → `web/dist/`，node_modules 缺失自动补 install），
再出 lib 三产物，最后把 `skills/*` 真实复制到 `<dshHome>/skills/`
（skill-filesystem 的内置扫描根，`DSH_HOME` 环境变量可覆盖 home），
技能随构建安装、对所有 dsh 会话可见；改技能后重跑 build 即生效。
`lib/`、`web/dist/` 产物已纳入 git 管理（根 `.gitignore` 例外），
克隆即可用；修改 `src/` 或 `ui/` 后重新 build 并提交产物。

## 脚本

```sh
node scripts/smoke.mjs <vault>       # 只读冒烟：status/xpStatus/promptKinds/recommend/doctor/analyze/coursesTree/读路径
node scripts/e2e.mjs <vault>         # 写路径端到端：临时副本上跑 题库(9题型)→作答(FSRS/乱猜)→XP 预算对账→skip/complete→审计→doctor→edit 联动→交互件→风格变体→genJobs
node scripts/dev-server.mjs <vault> [port]  # 面板开发伺服：直调引擎 + web/dist（无模型 seam）
node scripts/ensure-notes.mjs <vault> [course]  # 幂等补齐课程缺笔记的骨架文件（存量修复）
node scripts/smoke-panel.mjs [port]  # 面板伺服冒烟：301/资产/API 形状
```

e2e 在系统临时目录复制最小 vault 子集并重置笔记 frontmatter，绝不触碰真实 vault。

## 目录

```
src/index.ts          host 插件源码（工具面 + HTTP 路由 + SPA 伺服 + 生成任务注册表）
src/engine/*.ts       TS 引擎（paths/registry/graph/notes/srs/grading/sessions/content/gengraph/audit/analysis/question-bank/store/门面）
ui/                   面板 SPA 源码（Vite + React + Arco + React Flow；pages/ components/）
web/dist/             面板构建产物（host 伺服；assets 带 hash 永久缓存，index.html no-store）
src/client/index.tsx  客户端源码（slots 座位注入）
scripts/              smoke / e2e / dev-server / ensure-notes / smoke-panel
cordis.patch.yml      bundle patch 层
preset/ skills/       「学习伙伴」preset 与 agent skills
```

preset 的用户根安装（一次性）：复制 `preset/learnhub/user-root-composition.yml`
到 `~/.dsh/.agent-presets/learnhub/agent.cordis.yml`（连同 `preset.yml`），
Include 指向本仓库内真实 composition，改仓库文件即生效。
注意必须真实目录：scanRoot 只认 `isDirectory()`，junction 会被跳过。
