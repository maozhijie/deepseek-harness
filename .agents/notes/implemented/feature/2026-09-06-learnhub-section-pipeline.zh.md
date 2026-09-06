# Agent Note: Learnhub section-manifest pipeline — outline-first per-section generation and section-typed learning flow

Status: implemented

[English](2026-09-06-learnhub-section-pipeline.md) | 中文

## Problem

`dsh-learnhub` 旧版用一次整节点 LLM 调用生成整篇课程笔记，由此有三个限制：2500 字预算封顶课程深度，失败或取消会丢弃整篇草稿；渲染出的正文只是 `## ` 标题的平铺列表，学习流无法区分概念节、练习节与交互节——练习永远排在全部阅读之后，练习节只有标题碰巧匹配才进得了流程；交互件完成只亮徽标，没有成绩语义。此外生成提示词曾强制固定栏目结构（动机、回顾、反馈……），无论内容、主题与讲解风格如何，产出的都是千篇一律的栏目化文章。

## Decision

节清单现在是持久主干，落在笔记 frontmatter 的 `content.sections`——有序的 `SectionManifest`（`{id, title, type, status: 'pending'|'ready', version}`）。生成改为三段管线，每段实时上报到生成任务（`phase: outline|sections|quiz`、`progress: {done, total, current?}`）：

1. **大纲**——「课程大纲」提示词把上下文包转成 YAML 节清单（id/title/type/points/visual；类型菜单：概念/例题/演示/小结/练习/交互），校验后落 frontmatter、全部 pending。提示词只设质量底线——文字少可视化为主（讲解本体放在公式/图/交互件里，每节文字 ≤150 字）、排版约定、禁用概念、节原子性——节数、顺序与类型配比由模型按内容、主题与讲解风格判断；不存在固定栏目，也不设强制收尾节。
2. **逐节正文**——每节一次 LLM 调用（「课程节生成」提示词 + 本节任务 + 前节已生成正文保连贯 + 上下文包）；每次结果过质检门，经 `sectionApply` 落盘，该节 `version` 递增并标 ready。重生成跳过大纲与全部 ready 节，取消的任务从断点继续。大纲与逐节正文走快速思考档（`fastEffort`，默认 `off`）压低生成延迟；出题、批改与答疑保留部署默认。
3. **自动出题**——每内容节 2 道、section 由服务端强制绑该节 id，再加 3 道通用题；全部过 validateBank 门禁。出题失败绝不回滚正文。

风格变体（`课程生成-苏格拉底`/`课程生成-费曼`）保留整节点一次成篇路径，在 apply 内从产出正文重对齐节清单。`POST /generate/section` 单节重写，与管线共用同一拼装与门禁。

学习流由 manifest 驱动：PracticeFlow 依据节清单装配轮次与 stepper——内容节把阅读与本节练习并入一个步骤，`练习` 节是一等练习轮，`交互` 节是交互轮。没有 manifest 的旧节点回退为整篇重导出清单（全部 ready）与标题匹配。交互 HTML 上报 `LEARNHUB_COMPLETE`（可选 `score` ∈ [0,1]）；面板经 `POST /interactive/settle` 结算——每节每天一次，记入练习流水并推进 frontmatter EMA——不碰题目 FSRS 卡。

## Alternatives considered

- **扩大整节点篇幅预算。** 无法断点续跑：一节写坏就损失整次调用，取消则全部丢弃。仅保留为风格变体路径。
- **从图元数据（est/type）推导大纲、不经模型。** 节划分是模板推不出的内容判断；一次大纲调用成本低，且「无固定结构」原则正是落在这里。
- **把交互成绩喂进题目 FSRS 卡。** 交互件不是题库题，混入会污染节点 due 聚合。改用练习流水记录 + EMA，复用 `questionAnswer` 的证据链路。
- **保留固定栏目模板。** 按用户方向否决：栏目化文章无论题材读起来都一样。质量底线（排版、原子性、禁用概念）保留，结构判断交给模型。

## Consequences

- 重跑大纲会覆盖 manifest；断点续跑以「存在 ready 节」为界，全 pending 时重跑大纲没有信息损失。
- 防刷粒度是节 × 日；自由阅读渲染（无结算上下文）只亮完成徽标，永不结算。
- 提示词以六个内置模板交付，首用写入 `state/提示词/`；修改内置模板不会刷新既有 vault 快照（过期快照需手工刷新）。
- 旧节点经回退路径继续工作；没有任何迁移会偷偷写入 `content.sections`。
- 适配器未暴露思考档位的路由会拒绝显式 effort id；此时快速档降级为部署默认，生成不失败。
