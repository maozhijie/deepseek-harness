# dsh-learnhub

学习中心 Learnhub：DeepSeek Harness 的学习引擎插件（v3 纯 TS 引擎 + allo 移植面板）。

Python 引擎已退役：原 `spawn python -m learnhub` 的全部逻辑吸收进
`src/engine/`（TS），同进程直调，不再有子进程与 CLI 逃生口。
判卷语义移植自 allo（四题型 + 自动判卷 + 掌握度 EMA），
调度仍是 ts-fsrs 日粒度，事实源依旧在 Obsidian Vault。

- **host**（`lib/index.js`）：21 个 agent 工具直调 engine、`/learnhub/api/*` 面板后端、`/learnhub` SPA 伺服（`web/dist/`，改 UI 重跑 build 即生效）
- **client**（`lib/client.js`）：侧边栏底栏「学习中心」入口 + 全屏 iframe 面板
- **引擎**（`lib/engine.js`）：独立构建产物，脚本（smoke/e2e/dev-server）与 UI 复用同一入口
- **面板 UI**（`ui/`）：Vite + React 18 + Arco Design + React Flow（@xyflow/react + dagre），组件移植自 allo learning 模块

## 数据主权（v3）

vault `学习中心/` 是唯一事实源，没有数据库：

| 数据 | 位置 | 说明 |
|---|---|---|
| 调度状态 | 课程笔记 frontmatter | `fsrs` 块 + `stage` + `mastery` + `practice` 计数/EMA，Obsidian 直接可见可编辑 |
| 图结构 | `<课程根>/data/*.yaml` | region/block/nodes{name,pre,opt,note,enc}，人类可读可手编 |
| 题库 | `<课程根>/题库/<节点>.yaml` | 四题型（single_choice/multi_choice/fill_in_blank/true_false/reflection）+ 候选答案 + 解析 + `tags`/`archived` |
| 课程标签 | `课程注册表.yaml` 条目 `tags` | 面板标签体系（课程级） |
| 流水 | `state/journal.jsonl`、`state/practice.jsonl` | 调度记录与作答记录，逐行追加；打卡/日历热力图的聚合源 |
| 提案/快照 | `state/proposals.json`、`state/snapshots/*.json` | 图谱变更提案与 apply 前快照 |
| 工作单/日志 | `会话/YYYY-MM-DD.md`、`state/学习日志.md`、`state/运行日志.md` | 人类视角的计划与流水 |

纪律：**D14** 一切数据访问收口 `engine/` 模块，工具/路由/UI 不得绕过；
**D15** 评分只经工作单 → settle（或 `learnhub_grade`/面板 writeback 补录）入库；
`config.vault` 缺失/目录不存在加载即报错（fail loud，不做静默兜底）。

## 工具面（21 个）

- 调度与学习：`learnhub_status / today / settle / grade / recommend / lesson / exercises / check / record_attempt / rebuild / feedback / writeback / note_resolve`
- 图谱四面：`learnhub_graph_analyze / propose / apply / exercises_gen`
- 题库（allo 作答流）：`learnhub_question_list / question_save / question_answer`
- 生成：`learnhub_generate`（大纲先行、正文按需；缺笔记先补骨架，on-demand 课时语义）

## 面板（Vite SPA，移植自 allo learning）

`/learnhub/` 六个页签：

- **学习**：打卡横幅（今日行为计数）+ 课程卡（进度/五态计数/标签/删除）+ 下一步建议 + 复习会话（刷卡流：题库作答对→rating3、错→rating1，无题自评 1-4，跳过不落分）
- **学习图**（重点）：React Flow + dagre BT 分层 DAG——五态色板节点卡、推荐星标（琥珀入边引导）、前置未完成锁定虚线、MiniMap、>300 节点视口裁剪；可切大纲视图（区/块折叠）；节点抽屉 = 笔记分节（AI 生成正文/人审/反馈）+ 题库作答（四题型 QuestionCard）+ 自评评分
- **题目管理**：全库浏览/筛选/搜索、编辑（答案留空不改）、自建题（过 validateBank 门禁）、归档/恢复、题目标签
- **统计**：打卡日历热力图（journal+practice 按日聚合）+ 课程五态总览
- **生成**：正文生成任务注册表（运行中/取消/终态，页面刷新可恢复，服务端为事实源）
- **提案**：agent 图构建 gen/edit 提案人审（应用/拒绝全留痕）

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
node scripts/e2e.mjs <vault>         # 写路径端到端：临时副本上跑 题库→作答→工作单→评分→审计→doctor→edit 联动
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
