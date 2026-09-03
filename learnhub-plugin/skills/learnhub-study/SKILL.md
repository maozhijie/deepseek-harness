---
name: learnhub-study
description: 主持一次 learnhub 学习会话：动态推荐接下来该做的事（复习/继续/新课）、讲学节点、陪练练习题、判卷、记录评分（自动结算）再取下一批。用户说「开始学习」「今天学什么」「做题」时使用。
---

# learnhub 学习会话

主持完整的学-练-评闭环。数据权威在 vault：课程笔记 frontmatter 携带调度状态
（无数据库），一切变更只走 learnhub_* 工具。
学习节奏是动态的：不提前规划一天的任务，而是每做完一件事自动取下一批推荐。

## 会话流程

1. **开局**：`learnhub_recommend`（默认 5 条）拿跨课动态推荐队列：逾期复习 > 今日到期 > 半途未完成的课 > 新课（解锁后继多者优先 + 分区轮转）。把事件列给用户挑（每条带 type/course/node/score/why）。
2. **讲学**：用户选定后 `learnhub_lesson`（node+course，course 可省由引擎跨课唯一匹配）取学习包：分节正文（练习/反馈区已剔除、答案已并入例题，含图片与图表）+ 练习题 + 前置。逐节讲解，每节讲完确认用户听懂再进下一节。
3. **陪练**：优先走题库作答流（allo 语义）——`learnhub_question_list` 取四题型题目（single_choice/true_false/fill_in_blank/reflection，不含答案），让用户作答后 `learnhub_question_answer` 自动判卷并落库（对错立判、错题公布答案与解析；reflection 由 AI 按评分要点判卷），无需再手工记录。若该节点没有题库，用 lesson 包里的旧练习区 exercises：`learnhub_check` 判卷——sympy 题（含数值容差）与 choice 选择题（选项字母）直接给对错；human 题返回参考答案让用户自评；ai 开放题返回 `{judge:"ai", q, answer:评分要点}` 且不记录——由你按评分要点判卷（对/半对/错 + 反馈），再用 `learnhub_record_attempt`（course+node+ex+answer+judge+correct+feedback）落库。
4. **记录评分**：`learnhub_grade`（node 支持 `课程/节点` 消歧，直写 frontmatter 与 journal）即时入库，无需结算。
5. **续学**：评分入库后再调一次 `learnhub_recommend`——队列已自动更新，向用户报下一批推荐并提议继续。

工作单路线（`learnhub_today`/`learnhub_settle`/`learnhub_writeback`）仍可用，但默认走上述动态推荐路线；除非用户明确要一次性排好一天的计划。

## 准则

- 评分必须来自用户本人的回忆质量判断，不要替用户打分；拿不准就问。
- 练习判错后先讲清错因再继续，必要时回讲知识点。
- 节点内容有问题时引导用户在笔记「内容反馈」区写意见，然后 `learnhub_feedback` 提交，进入重生成队列。
- 题目不够或太简单，走 learnhub-graph-generate / 出题流程补题（`subagent_exercise_gen`），别手改笔记练习区。

## 课程生成

缺课正文时两条路共用同一门禁（上下文包 + 可编辑提示词模板 state/提示词/课程生成.md → 模型 → 质检门 → draft）：

- 面板「生成」页签一键生成（待生成队列来自前置解锁触发），生成后人审通过/打回；
- agent 侧用 `learnhub_generate`（course+node），产出同样是 draft，需引导用户在面板「生成」页签人审通过后才能进入学习。超纲靠提示词与上下文包的「领域边界/禁止使用的概念」约束，质检门只警告不拦截，人审是最后关口。
