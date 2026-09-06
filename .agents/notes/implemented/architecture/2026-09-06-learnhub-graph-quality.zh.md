# Agent Note：LearnHub 图谱健康分、认知维度与检察官子代理

Status: implemented

[English](2026-09-06-learnhub-graph-quality.md) | 中文

## 问题

图谱构建只有一个结束信号：「审计无 ERROR」。审计是纯结构的（环/断边/重名），一批干净 apply 之后模型就觉得完成了——多花批次没有任何可优化的东西，技能里的「自问零基础学习者 30 分钟能否学会」始终是提示词层面的恳求，没有任何东西承接检查。教学质量不可计算：节点没有难度与认知层级字段，「难度跳跃」无法机械评估。两个小缺陷叠加：EditOp 没有 est/type 字段，批展开主路径的 add_node 静默丢弃 gen 路径能保留的字段；图画完之后内容生成不再反哺——尽管每篇正文的 enc_candidates 都写明内容实际依赖的前置。

## 决策

质量变成一个数字、一份建议清单、一个对抗审阅者、两条审计规则。

`graphHealthScore`（新文件 src/engine/health.ts，5 项各 20 分：动作句命名比例、est 覆盖率、前置完备、收敛度、结构卫生）由 `learnhub_graph_analyze` 以 `health` 返回并写进审计基线表；`analyzeGraph` 同时返回可行动的 `suggestions`（expand_blocks / missing_pre / unconverged，条目上限随图规模伸缩，8-16），工具描述要求下一批计划引用具体条目。技能结束条件升级为「audit 无 ERROR **且 健康分 ≥ 80**」——阈值写在技能文本里而非引擎配置，引擎只报分。

`applyGen`/`applyEdit` 从门面接收 `ApplyAudit { ok, warns, health }` 并返回 `findings`（audit warns 摘要 + 低于 80 的显式提醒），每次 apply 都是强制反馈点。图谱生成技能新增每批**边级自查表**（逐条新 pre 边 verdict：必要/冗余/缺失中间层；冗余边移除、缺台阶的边在节点补上之前不得提交），并强制每累计约 50 ops（常规批次即每 2-3 批）委派新的 **`subagent_graph_prosecutor`**——节律按累计 ops 计，与批次规模解耦。检察官 persona 刻意对抗且与设计者上下文隔离：只拿图 JSON 与批次 ops，逐边逐节点审问（学习者具体卡在哪一步；删掉这条 pre 哪里失控），输出类型化 findings——它不做任何编辑。

认知维度进 schema：GNode 可选 `bloom`（六级）与 `difficulty`（1-5），gen 提案、edit add_node（顺带修复 est/type 丢字段 bug）、图 YAML 加载器 parseNode 三处接受——注意这条 schema 有门禁/序列化三个独立站点必须同步（未知字段白名单与 regionDoc 序列化器本次都补了）。审计新增 **R11 难度跳跃**（相邻 pre 边 |Δ|≥2 → warn）与 **R12 认知-时长失配**（info），字段缺失时静默跳过。内容反哺：`contentApply`/`contentSection` 在 enc_candidates 引用 pre 闭包外的图内节点时返回 `hints`——纠正时机从审计时提前到内容落盘时。

## 后果

存量图语义不变（全部可选；R11/R12 在 difficulty 标注之前静默，靠新批次渐进采纳）。80 分阈值是 agent 纪律不是门禁——低于 80 apply 照常成功。健康分与建议只到工具消费方，面板 DAG 视图未动。检察官每次构建多花若干 spawn 轮；≤15 ops 的小批可跳过。

数量限定全部按图规模伸缩——数百节点的课程属正常范围，固定配额会把大图的健康分、建议与委派轮次全部扭曲：健康分别名命中按节点数归一（每 50 节点容忍 1 对，否则「勾股定理」⊂「勾股定理的逆定理」这类合法派生命名在大图里恒扣满分）；R1 浅叶阈值随最大深度相对化（maxDepth/4，下限 5）；R1/R2/R9 条目超 15 附溢出行，只防刷屏不设质量配额；批次规模分档 ≤25（图超约 150 节点且连续多批零 ERROR 后可 ≤40）。

## 验证

e2e 增至 31 步。新步骤埋入带 est/type/bloom/difficulty 的 gen 提案（含故意设置的难度 3→5 边），断言 apply `findings`、字段在 data/*.yaml 的字节级落盘、health 在 0-100 且 breakdown 键完整、suggestions 形状（expand_blocks 非空且全部 <5 节点）、edit add_node 的 est/type 往返（丢字段 bug 回归）、审计基线健康分行、被埋跳跃触发 R11、schema 拒绝 `bloom: 顿悟`、contentApply 对闭包外 enc 候选返回 hints。`npm run build`、`npm run check`、UI `tsc --noEmit` 全绿。

## 已否决的替代方案

- **健康分阈值进引擎**——仓库禁止硬编码可调项；退出条件归 agent 纪律（技能文本），引擎只报分。
- **健康分现在就加第六项（难度覆盖）**——保持 5 项公式稳定；R11 已在审计里暴露跳跃，breakdown 以后可扩展不破坏消费方。
- **让检察官自己改图**——对抗价值来自隔离；修复应经设计者的提案路径回流。
- **固定条目上限与固定批次配额**——数百节点图里固定 top-N 看不全建议、固定别名/浅叶阈值恒罚大图、固定批次数让委派轮次失控；上限只防刷屏，质量配额交给结束条件与检察官。
