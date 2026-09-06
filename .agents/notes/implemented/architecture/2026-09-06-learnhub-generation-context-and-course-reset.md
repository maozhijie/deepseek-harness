# Agent Note: LearnHub generation context injection, shape gates, and course regeneration

Status: implemented

[English] | [中文](2026-09-06-learnhub-generation-context-and-course-reset.zh.md)

## Problem

Generated lessons kept going out of scope because the context pack's prerequisite summary only said "已生成：讲过（详见其课程文件）" — the model knew prerequisite node names but never what they actually taught, so it freely used square roots and trigonometry before those tools were introduced. Sections ballooned with `###` subsections and thousands of characters because no gate constrained section shape, and outline models mechanically alternated content/practice sections. Separately, every generated interactive reference failed in the panel: `extractInteractive` stores course-root-relative paths (`MathForGames/交互/x.html`) while the serve route demanded vault-relative (`学习中心/…`) — the smoke test only passed because it hand-wrote the vault-relative form. And regeneration was impossible: the pipeline resumes past ready sections and existing banks, so "generate again" was a no-op without wiping vault files by hand.

## Decision

Teaching context is now data, not hope. `SectionManifest` keeps the outline's `points`, and the context pack's prerequisite summary lists each generated prerequisite's actual section titles + points ("实际教过的节"), which the v5 prompts reference with a hard notation rule: square roots, trig, absolute value, log/exp may be used only if they appear in that skeleton; otherwise add a one-sentence lemma or rewrite without the notation.

Section shape is gated, not suggested. `checkSectionShape` in the quality gate rejects `###` subsections (atomicity finding) and overlong prose (warn > 600 / finding > 2000 characters, counting after stripping code blocks, inline code, formulas, and machine comments so formulas and diagrams never consume the text budget). `checkMermaidQuotes` warns on unquoted mermaid node labels containing `|` — the recurring cause of mermaid degrading to source. The outline prompt now states section granularity (1–2 screens; split when a point needs formula + derivation + example + figure) and composition freedom: practice sections are optional, run 2–3 content sections then one practice section, interleave demos — anything but mechanical alternation. Per-section question counts adapt: 1 per content section when the outline has a practice section, otherwise 2.

Course regeneration is a first-class flow. `POST /course/reset` (panel Generate page button + course select + destructive-confirm) runs `contentReset`: every node note is backed up byte-for-byte into `.trash/regenerate-<timestamp>/`, rewritten to the ungenerated skeleton (`content: draft`, empty body), and the three generated artifact directories (`题库/`, `交互/`, `课程图/`) are renamed into the same backup. Graph data, registry, learning state, prompt snapshots, and the human-reviewed 生成队列.md stay untouched. The route then serially reruns the existing `generateContent` pipeline over `graph.order` in the background; per-node failures land in the job registry for retry without blocking the rest. The interactive serve route normalizes both reference forms (prefix `学习中心/` when missing) before its existing traversal/course/.html checks; the gate's center-relative existence check is unchanged.

Prompts v4 → v5 (five templates; 题目生成 is content-unchanged and stays v4 so user snapshots are not clobbered without cause).

## Consequences

Regeneration deletes nothing irreversibly (trash rename, restorable), but mastery numbers outlive their questions: banks are empty until the background chain reaches each node. Stale notes are overwritten by design — v5 upgrade moves user-edited prompt snapshots to `.bak`. The shape gate applies to full-note apply too, so legacy sections with `###` get flagged on the next rewrite of that node. Both SDKs are unaffected (panel-local seam).

## Verification

e2e grew to 30 steps: shape gate (### and overlong prose rejected at `contentSection`, valid section passes, mermaid-`|` warn-only), outline `points` persisted to frontmatter, `contentReset` (note back to draft, `题库/`+`交互/` moved into `.trash/regenerate-*`, graph data intact, old body gone), prompt migration asserted at v5. Panel smoke asserts the course-root-relative interactive path (the exact form from the bug report screenshot) now serves 200 alongside the vault-relative form. `npm run build`, `npm run check`, UI `tsc --noEmit` all green.

## Rejected alternatives

- **Notation-level out-of-scope findings** — symbol heuristics (√, sin, …) would misfire across subjects; the taught-skeleton injection plus prompt hard rule addresses the cause without false positives.
- **Also bump 题目生成 to v5** — its content did not change; forcing a version bump would overwrite user-edited snapshots for nothing.
- **Course reset as direct rm** — the repo already treats `.trash` as the deletion surface (`courseDelete` precedent); rename-into-trash keeps regeneration reversible.
