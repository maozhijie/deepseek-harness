---
name: learnhub-graph-generate
description: 为 learnhub 学习系统生成新课程知识图谱（区/块/节点 YAML），走 propose-gen 门禁后 apply 入库。用于用户要求新建课程、规划学习路线时。
---

# learnhub 图谱生成

生成一门新课程的知识图谱。铁律：LLM 只产出 YAML 文本，一切入库必须过门禁（schema + 结构检查 + audit），绝不直接写课程文件。

## 工作流

1. **摸底**：调用 `learnhub_graph_analyze`（可加 `course` 参数）了解既有课程与可参考的结构粒度。多课程注册时看 `learnhub_status` 的课程清单。
2. **产出 YAML**：按 GenProposal schema 写完整课程声明：

```yaml
course: 课程名
mode: new          # new 新建 / append 追加到已有课程
regions:
  - region: 区名
    color: "#4e79a7"   # 可省
    blocks:
      - name: 块名
        nodes:
          - name: 节点名
            pre: [前置节点名]   # 只能引用本提案或已有图内节点
            opt: false          # 可选节点
            note: 一句话说明     # 可省
            enc: [成分技能节点]  # 可省
```

3. **提交门禁**：调用 `learnhub_graph_propose`，`kind: "gen"`，`yaml` 为上一步全文。门禁拒绝会返回逐条错误；按错误修正后重新提案。
4. **人工确认后 apply**：把提案摘要（区/块/节点数、前置结构）讲给用户；用户同意后调用 `learnhub_graph_apply`（`kind: "gen"`，可带 `id`）。apply 会再过一次 audit（重名/断边/环），成功则注册课程、写 data/*.yaml、记 journal、留快照。
5. 用户否决则 `learnhub_graph_apply` 带 `reject: true` 与 `note`。

## 设计准则

- 粒度：一个节点 = 一次学习会话可掌握的最小知识单元；一门课 20-80 节点为宜。
- 前置 `pre` 宁少勿滥：只连「不会前置就无法理解」的节点；无前置的节点构成入口集。
- 图必须无环；节点名课程内唯一；区/块名不重复。
- 重活委派：大型课程可交给 `subagent_graph_designer` 子代理产出 YAML，父 agent 负责向用户汇报并执行 apply。
