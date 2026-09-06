# Agent Note: LearnHub graph health score, cognitive dimensions, and prosecutor subagent

Status: implemented

[English] | [中文](2026-09-06-learnhub-graph-quality.zh.md)

## Problem

Graph construction had exactly one exit signal: "audit has no ERROR". The audit is structural only (cycles, dangling refs, duplicates), so a batch that applied cleanly felt done — the model had nothing to optimize by spending more batches, and the skill's "ask yourself if a zero-base learner can learn this in 30 minutes" stayed a prompt-level plea with nothing to check it against. Pedagogical quality was uncomputable: nodes carried no difficulty or cognitive-level fields, so "difficulty jump" could not be evaluated mechanically. Two smaller defects compounded this: `EditOp` had no est/type fields, so `add_node` in the batch-expansion path (the main path) silently dropped what the gen path kept; and the graph, once drawn, never heard back from content generation even though every note's `enc_candidates` names the prerequisites its content actually relies on.

## Decision

Quality becomes a number, a suggestion list, an adversarial reviewer, and two audit rules.

`graphHealthScore` (new `src/engine/health.ts`, five components of 20 points: action-verb naming ratio, est coverage, prerequisite completeness, convergence, structural hygiene) is returned by `learnhub_graph_analyze` as `health` and written into the audit baseline table. `analyzeGraph` also returns actionable `suggestions` (expand_blocks / missing_pre / unconverged, with per-list caps that scale with graph size, 8-16), and the tool description requires each next-batch plan to cite concrete entries. The skill's exit condition is now "audit no ERROR **and health score >= 80**" — the threshold lives in the skill text, not engine config; the engine only reports.

`applyGen`/`applyEdit` take an `ApplyAudit { ok, warns, health }` from the facade and return `findings` (audit warns digest plus an explicit below-80 reminder), so every apply is a forced feedback point. The graph-generate skill adds a per-batch **edge-level self-check table** (verdict per new pre edge: necessary / redundant / missing-middle-step; redundant edges removed, missing steps block the edge until nodes exist) and mandates delegating the new **`subagent_graph_prosecutor`** every ~50 cumulative ops (every 2-3 batches at the standard batch size) — the cadence is measured in cumulative ops, decoupled from batch size. The prosecutor persona is deliberately adversarial and context-isolated from the designer: it receives the graph JSON and the batch ops, interrogates every edge and node (where exactly does the learner stall; delete this pre and what breaks), and outputs typed findings — it never edits.

Cognitive dimensions enter the schema: optional `bloom` (six levels) and `difficulty` (1-5) on `GNode`, accepted by gen proposals, edit `add_node` (which now also round-trips est/type — the dropped-fields bug), and the graph YAML loader `parseNode` (whose strict unknown-field whitelist and `regionDoc` serializer both learned the new fields — a reminder that this schema has three independent gate/serialize sites that must move together). Audit grows **R11 difficulty jump** (adjacent pre edge with |Δ| >= 2, warn) and **R12 cognitive-duration mismatch** (info), both skipped when fields are absent. Content feeds back: `contentApply`/`contentSection` return `hints` when `enc_candidates` name graph nodes outside the node's prerequisite closure — moving that correction from audit time to content-landing time.

## Consequences

Existing graphs score unchanged semantics (all fields optional; R11/R12 silent until difficulty is annotated, so adoption is gradual via new batches). The 80 threshold is agent discipline, not a gate — apply still succeeds below it. Health score and suggestions reach only tool consumers; the panel DAG view is untouched. The prosecutor spends extra spawn rounds per construction; batches of <=15 ops can skip it.

Every quantity limit scales with graph size — courses with several hundred nodes are normal, and fixed quotas would distort the health score, the suggestions, and the delegation cadence all at once: alias hits in structural hygiene are normalized by node count (1 tolerated pair per 50 nodes, otherwise legitimate derived namings like "Pythagorean theorem" ⊂ "converse of the Pythagorean theorem" would max out the penalty on large graphs); the R1 shallow-leaf threshold relativizes to maximum depth (maxDepth/4, floor 5); R1/R2/R9 lists cap at 15 with an overflow line — caps exist against report flooding, not as quality quotas; batch size is tiered at <=25 (relaxed to <=40 once the graph passes ~150 nodes with several consecutive clean batches).

## Verification

e2e grew to 31 steps. The new step plants a gen proposal with est/type/bloom/difficulty (including a deliberate difficulty 3→5 edge), asserts apply `findings`, byte-level persistence of the fields in `data/*.yaml`, `health` in range with full breakdown, `suggestions` shape (expand_blocks non-empty, all <5 nodes), an edit `add_node` round-trip of est/type (regression for the dropped-fields bug), the audit baseline health-score row, R11 firing on the planted jump, schema rejection of `bloom: 顿悟`, and `contentApply` hints for an enc candidate outside the prerequisite closure. `npm run build`, `npm run check`, UI `tsc --noEmit` all green.

## Rejected alternatives

- **Hard health-score threshold in the engine** — the repo bans hardcoded tunables; the exit condition belongs to agent discipline (skill text) while the engine only reports the score.
- **Sixth score component for difficulty coverage now** — kept the 5-item formula stable; R11 already surfaces jumps in audit and the breakdown can extend later without breaking consumers.
- **Letting the prosecutor edit the graph** — adversarial value comes from isolation; fixes flow back through the designer's proposal path where they belong.
- **Fixed entry caps and fixed batch quotas** — on graphs with hundreds of nodes, fixed top-N lists hide suggestions, fixed alias/shallow-leaf thresholds permanently punish large graphs, and a fixed batch count sends delegation rounds out of control; caps exist against flooding, while quality quotas stay with the exit condition and the prosecutor.
