# dsh-learnhub

学习中心 Learnhub：DeepSeek Harness 的学习引擎插件（v3 纯 TS 引擎）。

Python 引擎已退役：原 `spawn python -m learnhub` 的全部逻辑吸收进
`src/engine/`（TS），同进程直调，不再有子进程与 CLI 逃生口。
判卷语义移植自 allo（四题型 + 自动判卷 + 掌握度 EMA），
调度仍是 ts-fsrs 日粒度，事实源依旧在 Obsidian Vault。

- **host**（`lib/index.js`）：21 个 agent 工具直调 engine、`/learnhub/api/*` 面板后端、`/learnhub` 独立面板页（伺服 `web/index.html`，改页面无需重建）
- **client**（`lib/client.js`）：侧边栏底栏「学习中心」入口 + 全屏 iframe 面板
- **引擎**（`lib/engine.js`）：独立构建产物，脚本（smoke/e2e）与未来 UI 复用同一入口

## 数据主权（v3）

vault `学习中心/` 是唯一事实源，没有数据库：

| 数据 | 位置 | 说明 |
|---|---|---|
| 调度状态 | 课程笔记 frontmatter | `fsrs` 块 + `stage` + `mastery` + `practice` 计数/EMA，Obsidian 直接可见可编辑 |
| 图结构 | `<课程根>/data/*.yaml` | region/block/nodes{name,pre,opt,note,enc}，人类可读可手编 |
| 题库 | `<课程根>/题库/<节点>.yaml` | 四题型（single_choice/true_false/fill_in_blank/reflection）+ 候选答案 + 解析 |
| 流水 | `state/journal.jsonl`、`state/practice.jsonl` | 调度记录与作答记录，逐行追加 |
| 提案/快照 | `state/proposals.json`、`state/snapshots/*.json` | 图谱变更提案与 apply 前快照 |
| 工作单/日志 | `会话/YYYY-MM-DD.md`、`state/学习日志.md`、`state/运行日志.md` | 人类视角的计划与流水 |

纪律：**D14** 一切数据访问收口 `engine/` 模块，工具/路由/UI 不得绕过；
**D15** 评分只经工作单 → settle（或 `learnhub_grade` 补录）入库；
`config.vault` 缺失/目录不存在加载即报错（fail loud，不做静默兜底）。

## 工具面（21 个）

- 调度与学习：`learnhub_status / today / settle / grade / recommend / lesson / exercises / check / record_attempt / rebuild / feedback / writeback / note_resolve`
- 图谱四面：`learnhub_graph_analyze / propose / apply / exercises_gen`
- 题库（allo 作答流）：`learnhub_question_list / question_save / question_answer`
- 生成：`learnhub_generate`（大纲先行、正文按需；缺笔记先补骨架，on-demand 课时语义）

判卷对 agent 与面板同源（都调 `engine/grading.ts`）：
选择题/判断/填空机器判卷，reflection 走 LLM（严格 JSON `{score,feedback}`，解析失败降级）；
错题立即公布答案与解析；掌握度 EMA（首证取分，之后 `mastery*0.7 + score*0.3`）。

## 面板

`/learnhub` 页面含六个页签：仪表盘（动态推荐队列）、学习（事件卡片进入学-练-评流）、
练习面板（笔记练习区判卷）、课程（工作区树 + 题库作答，allo 流：答题 → 自动判卷 → 对错反馈 → 答案/解析）、
生成（待生成队列一键生成 + 人审）、知识图谱（cytoscape DAG + 提案列表）。

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
npm run build     # lib/index.js + lib/client.js + lib/engine.js + 技能同步
npm run check
```

`npm run build` 同时把 `skills/*` 真实复制到 `<dshHome>/skills/`
（skill-filesystem 的内置扫描根，`DSH_HOME` 环境变量可覆盖 home），
技能随构建安装、对所有 dsh 会话可见；改技能后重跑 build 即生效。
`lib/` 产物已纳入 git 管理（根 `.gitignore` 的 `!learnhub-plugin/lib/` 例外），
克隆即可用；修改 `src/` 后重新 build 并提交产物。

## 脚本

```sh
node scripts/smoke.mjs <vault>   # 只读冒烟：status/recommend/doctor/analyze/coursesTree/题库等
node scripts/e2e.mjs <vault>     # 写路径端到端：临时副本上跑 题库→作答→工作单→评分→审计→doctor
```

e2e 在系统临时目录复制最小 vault 子集并重置笔记 frontmatter，绝不触碰真实 vault。

## 目录

```
src/index.ts          host 插件源码（工具面 + HTTP 路由 + 面板伺服）
src/engine/*.ts       TS 引擎（paths/registry/graph/notes/srs/grading/sessions/content/gengraph/audit/analysis/question-bank/store/门面）
src/client/index.tsx  客户端源码（slots 座位注入）
web/index.html        独立面板页（host 现读伺服）
scripts/              smoke / e2e / export-db（SQLite 时代一次性导出）
cordis.patch.yml      bundle patch 层
preset/ skills/       「学习伙伴」preset 与 agent skills
```

preset 的用户根安装（一次性）：复制 `preset/learnhub/user-root-composition.yml`
到 `~/.dsh/.agent-presets/learnhub/agent.cordis.yml`（连同 `preset.yml`），
Include 指向本仓库内真实 composition，改仓库文件即生效。
注意必须真实目录：scanRoot 只认 `isDirectory()`，junction 会被跳过。
