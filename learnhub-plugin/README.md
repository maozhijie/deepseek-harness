# dsh-learnhub

学习中心 Learnhub：DeepSeek Harness 的学习引擎插件（v3 纯 TS 引擎 + allo 移植面板）。

Python 引擎已退役：原 `spawn python -m learnhub` 的全部逻辑吸收进
`src/engine/`（TS），同进程直调，不再有子进程与 CLI 逃生口。
评分模型是**题目级 FSRS 刷卡**：每道题自带一张调度卡，作答对错直接推进该题；
节点掌握度 = 其题目作答数据的汇总（派生，无自评）。
事实源依旧在 Obsidian Vault，调度仍是 ts-fsrs 日粒度。

- **host**（`lib/index.js`）：15 个 agent 工具直调 engine、`/learnhub/api/*` 面板后端、`/learnhub` SPA 伺服（`web/dist/`，改 UI 重跑 build 即生效）
- **client**（`lib/client.js`）：侧边栏底栏「学习中心」入口 + 全屏 iframe 面板
- **引擎**（`lib/engine.js`）：独立构建产物，脚本（smoke/e2e/dev-server）与 UI 复用同一入口
- **面板 UI**（`ui/`）：Vite + React 18 + Arco Design + React Flow（@xyflow/react + dagre），组件移植自 allo learning 模块

## 数据主权（v3）

vault `学习中心/` 是唯一事实源，没有数据库：

| 数据 | 位置 | 说明 |
|---|---|---|
| 题目级调度 | `<课程根>/题库/<节点>.yaml` | **每题一张 FSRS 卡**（`fsrs` 块：due/stability/difficulty/reps/lapses）+ 作答统计（`stats.attempts/correct/last`）；作答对错驱动推进 |
| 节点状态 | 课程笔记 frontmatter | `stage`（unseen/ready/learning/review/mastered/skipped）+ `mastery` + `practice` 计数/EMA；`fsrs` 字段是节点题目的聚合代表（到期最早那张卡的快照，审计与兼容用） |
| 图结构 | `<课程根>/data/*.yaml` | region/block/nodes{name,pre,opt,note,enc}，人类可读可手编 |
| 题库 | `<课程根>/题库/<节点>.yaml` | 题型 single_choice/true_false/fill_in_blank/reflection（旧 multi_choice 数据兼容保留）+ 候选答案 + 解析 + `archived` |
| 流水 | `state/journal.jsonl`、`state/practice.jsonl` | 调度留痕与作答记录（审计用），逐行追加 |
| 提案/快照 | `state/proposals.json`、`state/snapshots/*.json` | 图谱变更提案与 apply 前快照 |
| 日志 | `state/学习日志.md`、`state/运行日志.md` | 生成/审计等运行流水 |

纪律：**D14** 一切数据访问收口 `engine/` 模块，工具/路由/UI 不得绕过；
**D15** 评分即作答——判卷后直接推进该题 FSRS 并写回题库（无工作单/settle 中间层）；
`config.vault` 缺失/目录不存在加载即报错（fail loud，不做静默兜底）。

## 工具面（15 个）

- 调度与学习：`learnhub_status / recommend / lesson / rebuild / feedback / note_resolve`
- 节点操作：`learnhub_skip`（跳过/取消跳过，已有基础的节点）、`learnhub_complete`（完成确认，未答题入复习循环）
- 图谱四面：`learnhub_graph_analyze / propose / apply`
- 题库（刷卡作答流）：`learnhub_question_list / question_save / question_answer`
- 生成：`learnhub_generate`（大纲先行、正文按需；缺笔记先补骨架，on-demand 课时语义）

## 面板（Vite SPA，移植自 allo learning）

`/learnhub/` 六个页签，信息架构以「学习流为主、图为总览」，明暗双主题（arco-theme 跟随系统，可手动切换）：

- **学习**（主界面）：复习横幅（待复习数 + 开始复习）+ **「接下来」推荐流**（逾期/复习/就绪/新学大卡片，复习项来自题库聚合 due，点开直接进入节点学习视图）+ 课程卡（进度/六态计数/删除，收窄为次要区）+ 复习会话（刷卡流：只刷到期题与未做题，答对 rating3、答错 rating1，无题提示出题或完成）
- **节点学习视图（LessonView）**：学习页二级全屏视图，最大最丰富的学习容器——状态引导单按钮（无正文→「生成正文（自动出题）」；有正文无题→「AI 出题」；有题→直接练习）+ 正文分节 Markdown 渲染（GFM 表格 / mermaid 图 / Obsidian 图片嵌入）+ 练习区（题目 FSRS 到期排序 + 三组题型 QuestionCard）+ 掌握度（题目作答汇总）+「完成学习」与「跳过」按钮（完成按钮在练习区下方，做完题再确认）+ 生成中阶段/耗时/取消 +「在图中查看」低频跳转
- **学习图**（全局总览，低频操作）：React Flow + dagre BT 分层 DAG——六态色板节点卡（skipped 紫色「跳」角标）、推荐星标（琥珀入边引导）、前置未完成锁定虚线（skipped 视同已通过）、MiniMap、>300 节点视口裁剪；区过滤 / 节点名搜索 / 只看进行中开关；点节点进入学习视图；「在图中查看」跳入时红描边定位并居中
- **题目管理**：全库浏览/筛选/搜索、编辑（答案留空不改）、自建题（过 validateBank 门禁）、归档/恢复
- **统计**：课程六态总览（未学=unseen+ready、进行、复习、掌握、已跳过）
- **生成**：正文生成任务注册表（运行中/取消/终态，页面刷新可恢复，服务端为事实源；失败保留 24h + 完整错误与重试）

### 生成与出题管线

「生成正文」= 组合管线：上下文包 + 「课程生成」提示词 → llm → 质检门 apply（draft 落盘）→ **同任务自动出题**（「题目生成」提示词 → llm 产题库 YAML → validateBank 门禁逐题落盘，题型混合、难度递进）；出题失败不回滚正文，可在练习页单独重试（POST `/question-generate`）。LLM 失败带稳定错误码（如 `[MISSING_CREDENTIAL/401]`）写运行日志。

### 评分模型（题目即刷卡卡）

作答判卷后按对错映射 FSRS rating（对=3、错=1）推进**该题**的调度卡并写回题库；
同节点多题各自独立推进，互不干扰。节点 due = 其题目 due 的最小值，复习队列读
题库聚合（无题节点不进复习队列）。「完成学习」把全部未归档题纳入复习循环——
做过的按各自下次到期复习，没做过的初始化为明天起刷；节点 stage→review。

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
node scripts/smoke.mjs <vault>       # 只读冒烟：status/recommend/doctor/analyze/coursesTree/题库等
node scripts/e2e.mjs <vault>         # 写路径端到端：临时副本上跑 题库→作答(FSRS)→skip/complete→审计→doctor→edit 联动
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
