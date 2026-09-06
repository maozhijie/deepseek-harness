# Agent Note: Learnhub section-manifest pipeline — outline-first per-section generation and section-typed learning flow

Status: implemented

English | [中文](2026-09-06-learnhub-section-pipeline.zh.md)

## Problem

`dsh-learnhub` generated a course note in one whole-node LLM call. Three limits followed. A 2500-character budget capped course depth, and any failure or cancellation discarded the entire draft. The rendered note was a flat `## ` heading list, so the learning flow could not tell a concept section from an exercise or an interactive simulation — practice always came after all reading, and practice nodes only entered the flow if a title happened to match. Interactive completions lit a badge with no score semantics. Separately, the generation prompts mandated a fixed column structure (motivation, recap, feedback …), which produced formulaic articles regardless of subject matter, topic, or teaching style.

## Decision

The section list is now the durable spine, stored as `content.sections` in the note frontmatter — an ordered `SectionManifest` of `{id, title, type, status: 'pending'|'ready', version}`. Generation runs as three stages, each reported live on the generation job (`phase: outline|sections|quiz`, `progress: {done, total, current?}`):

1. **Outline** — the "课程大纲" prompt turns the context pack into a YAML section list (id/title/type/points/visual; type menu: 概念/例题/演示/小结/练习/交互) that is validated into the frontmatter with every section pending. The prompts set quality floors only — text-light visual-heavy bodies (the explanation itself lives in formulas, diagrams, or interactive pieces; ≤150 characters of prose per section), typography conventions, banned concepts, atomic sections — and the model decides section count, order, and type mix from the content, topic, and teaching style; no fixed columns or mandated closing section exist.
2. **Per-section body** — one LLM call per section (the "课程节生成" prompt plus the section task, the previous section's generated body for continuity, and the context pack); each result passes the quality gate and lands through `sectionApply`, which bumps that section's `version` and marks it ready. Regeneration skips the outline and every ready section, so a cancelled job resumes where it stopped. Outline and per-section calls run on a fast thinking tier (`fastEffort`, default `off`) to keep generation latency down; quiz generation, grading, and tutoring keep the deployment default.
3. **Auto quiz** — two questions per content section, each pinned server-side to that section id, plus three generic questions; all pass the validateBank gate. Quiz failure never rolls back the body.

Style variants (`课程生成-苏格拉底`/`课程生成-费曼`) keep the whole-node one-shot path and realign the manifest from the produced body inside apply. `POST /generate/section` rewrites one section through the same prompt assembly and gate.

The learning flow is manifest-driven: PracticeFlow builds its rounds and stepper from the section list — a content section merges its reading and section questions into one step, a `练习` section is a first-class practice round, and an `交互` section is an interactive round. Legacy notes without a manifest fall back to whole-body re-export (all ready) and title matching. Interactive HTML reports `LEARNHUB_COMPLETE` with an optional `score` in [0,1]; the panel settles it through `POST /interactive/settle` — once per section per day, recorded into the practice journal with the frontmatter EMA — without touching question FSRS cards.

## Alternatives considered

- **Widen the whole-node budget instead.** No resumable progress: one bad section costs the entire call, and cancellation discards everything. Kept only as the style-variant path.
- **Derive the outline from graph metadata (est/type) without a model.** Section division is a content judgment a template cannot make; one outline call is cheap and is where the no-fixed-structure principle lives.
- **Feed interactive scores into question FSRS cards.** Interactive pieces are not bank questions; mixing them would pollute the node's due aggregation. Practice-journal rows plus the EMA reuse the `questionAnswer` evidence path instead.
- **Keep fixed column templates.** Rejected per user direction: columned articles read the same regardless of subject. The quality floors (typography, atomicity, banned concepts) stay; the structure judgment moves to the model.

## Consequences

- Re-running the outline overwrites the manifest; resume is bounded by "some section ready", and re-running it while everything is pending loses nothing.
- The anti-farming granularity is section × day; a free-reading render (no settle context) only lights the completion badge and never settles.
- Prompts ship as six built-in templates that write themselves to `state/提示词/` on first use; editing a built-in does not refresh an existing vault snapshot (stale snapshots are refreshed by hand).
- Legacy notes keep working through the fallback paths; no migration writes `content.sections` behind anyone's back.
- Routes whose adapter exposes no effort metadata reject an explicit effort id; the fast tier then degrades to the deployment default instead of failing generation.
