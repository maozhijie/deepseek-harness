# Agent Note：LearnHub 节级风格变体与 agent 工具面审查

Status: implemented

[English](2026-09-06-learnhub-style-variants-and-tool-surface.md) | 中文

## 问题

风格变体对「大纲 → 逐节」管线三重错位：内置 `课程生成-苏格拉底`/`课程生成-费曼` 提示词接在整节点一次成篇路径上，绕过大纲、断点续跑与前节衔接注入（正是之前治理的「节太长」病的根源）；更糟的是 v5 模板文本已经写成「只写指定的这一节」，代码却拿它一次生成整节点——文本与用法自相矛盾；基底模板「课程生成」则已经没有任何消费方。agent 工具面有真实缺口：agent 无法触发出题管线（自动出题只有 HTTP 面）、无法发起整课重生成（只有 HTTP）、无法修正单道题（`question_list` 不含答案，唯一的改题路径是盲写整份题库）。技能还在教五个已退役的 v2 工具（`learnhub_check`、`learnhub_grade`、`learnhub_today`、`learnhub_settle`、`learnhub_writeback`），调用即报未知工具。图谱面有同样的四处病：`analyze` 只带展示字段（agent 看得到拓扑却看不到任何节点的 est/bloom/difficulty/note 值——边级自查没有数据依据）、pending 提案对 agent 不可见、`EditOp` 无法维护存量图的 enc 成分技能边、课程删除只能绕 HTTP。

## 决策

风格回到它该在的位置——节调用。内置 `课程节生成-苏格拉底`/`课程节生成-费曼` = 节生成模板 + 一条风格约束（引导问题+锚点 / 类比→朴素语言→正式记号）；`generateContent` 在开头预载 `课程节生成-<style>`（未知 style 在浪费大纲调用之前 fail loud），大纲、断点续跑与门禁走默认路径。整课版 `课程生成*` 内置退役；存量 vault 快照留在磁盘但不再被读取（可手工清理）。面板风格 Select 改过滤 `课程节生成` 前缀。工具面新增 `learnhub_question_generate`（模型出题管线，同门禁）、`learnhub_question_update`（patch 合并 + 重新校验；`{archived:true}` 代理到归档）、`learnhub_course_reset`（与从 HTTP 路由抽出的 `resetCourseChain` 编排共用；立即返回，后台拓扑序链）。图谱面补齐：`analyze` 增每节点 `schema` 载荷（pre/enc/est/bloom/difficulty/note 字段值；elementsOnly 模式不含）、`set_enc` 操作（整体替换，形态与图 YAML 一致，enc 断边被模拟门禁拒绝）、`learnhub_graph_proposals` 列表工具（pending 可见性）与 `learnhub_course_delete`。同轮再补逐步探索面（大图不拉全量、逐点查细节）：`learnhub_graph_node`（单节点详情 + 前置传递闭包）、`learnhub_graph_browse`（区/块过滤浏览）、`learnhub_graph_path`（from 是否 to 的前置 + BFS 最短链与闭包规模）、`learnhub_question_get`（单题全量含答案——list 不带答案的作答流防泄题语义保持）——共 25 个工具。四份技能全部清淤：study 不再提退役工具并改为教 question-generate/update 流；build 的意图→工具表与 review 的定时提醒指向活工具；graph-optimize 引用健康分/建议与 set_enc。

## 后果

风格化内容严格有界（每次调用一节），且风格变体与管线全部特性组合（断点续跑、前节衔接、节形状门禁）。选过风格的用户在 Select 里看到同名项——语义变化在 UI 上不可见。agent 现在能不借 HTTP 跑完内容全生命周期（生成 → 出题 → 改题 → 整课重置）。`resetCourseChain` 状态没有其他消费方，面板与 agent 看到同一份任务记录。

## 验证

e2e 风格步骤断言五个新内置、退役的 `课程生成` 不再内置、苏格拉底变体仍带节级标记（`## 类型：标题`）、落盘与未知风格 fail loud；smoke（真实 vault）核对同一清单。图谱步骤新增 set_enc 往返落盘、analyze schema 字段断言、enc 断边拒绝与提案列表——后者拚住了 schema 初版把 `encOf` 元组直接透传、与声明的 `{node,w}` 对象不符的问题。探索工具有独立断言：节点详情字段/succ/enc、区块浏览计数、路径链与反向无关、单题含答案与未知 qid fail loud（首版断言用了被 rename 联动改名的节点而报空库——题库随迁语义的活样本）。`npm run build`、`npm run check`、UI `tsc --noEmit`、e2e 全绿。

## 已否决的替代方案

- **保留整节点一次成篇作为并行的风格路径**——一个节点两套生成语义必然漂移；逐节路径已有的形状门禁与衔接约束，一次成篇只能逼近。
- **风格作为注入段拼进共享的节生成模板**——多一层用户看不到、也无法在一处编辑的间接层；完整的每风格模板文件与现有可编辑提示词机制完全一致。
- **用一个通用 `learnhub_api` 透传工具代替三个具名工具**——具名工具让描述承担教学（何时需用户确认、patch 有哪些字段）；透传会把 HTTP 语义带进 agent 面。
