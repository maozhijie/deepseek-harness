# Agent Note: LearnHub renders rich generated content through one shared renderer manifest

Status: implemented

[English] | [中文](2026-09-06-learnhub-rich-content-rendering.zh.md)

## Problem

Generated LearnHub course content could only express formulas, mermaid diagrams, vault images, and v1 interactive widgets. MathAcademy-style lessons need precise geometric figures, function plots, data charts, formulas inside widgets, and an AI teacher that can drive a widget during tutoring. Three structural gaps blocked this: the prompt capability list, the quality gate whitelist, and the panel renderer registry had to be kept in sync by hand; the interactive sandbox prohibited all external loads, so widget libraries and formulas had no supply path; and builtin prompt templates were written to the vault on first use only, so template upgrades never reached existing courses.

## Decision

`shared/content-renderers.ts` is the single source of truth for block formats. One `RENDERERS` entry simultaneously feeds the generation-prompt capability block, the quality-gate language whitelist, and the panel registry reconciliation (`verifyRendererCoverage`). New formats ship as one manifest entry plus one UI implementation: `svg` (hand-written SVG sanitized through DOMPurify's svg profile with an allow-list URI scheme), `plot` (the model emits a closed-union JSON spec of mathematical objects; the panel evaluates expressions through `mathjs/number` and draws with Mafs), and `chart` (the model emits a standard ECharts option; the renderer guards series types to line/bar/pie/scatter, rejects external URLs, and registers only those modules from `echarts/core`).

The interactive widget contract moves to v2. Widgets embed a `widget-config` JSON script (`type` must be one of simulation/visualization3d/diagram/game/code); a missing config is a warning so v1 widgets keep applying, while an unparseable config or unknown type is a finding. The host serves vendored KaTeX and Three.js from `/learnhub/api/vendor/*` (files copied by `build.mjs` from the panel's node_modules and committed under `web/vendor/`), and the widget sandbox CSP relaxes `script-src`, `style-src`, `img-src`, and `font-src` with `'self'` while `default-src 'none'` keeps every network fetch dead. The serve route injects the vendored KaTeX auto-render into widgets that contain math delimiters and do not already reference KaTeX, so existing widgets gain formula rendering without regeneration. The panel broadcasts `LEARNHUB_TEACHER` actions (highlight/setState/reveal/annotate) to every widget in the lesson view through a React context bus; tutor answers may carry `learnhub-teacher` fenced JSON blocks that the drawer converts into demo buttons.

Builtin prompt templates carry a leading `<!-- learnhub:prompt/vN -->` marker. `loadPrompt` compares the vault snapshot's version and overwrites stale files after copying them to `<kind>.md.bak`; self-authored variants without a builtin are untouched. The `{{renderers}}` capability block stays dynamically injected at load time and is unaffected by snapshots.

Manim animation remains outside the pure-TS engine: the `learnhub-manim` agent skill renders MP4 assets on demand and references them through ordinary `media` blocks, keeping scheduling and gating engine-side.

## Consequences

Existing courses render the new formats and keep passing gates without regeneration; a stale snapshot upgrades on the next `loadPrompt` call, which means user-edited templates are overwritten by design and are recoverable only from the `.bak` copy. The panel bundle grows by Mafs, mathjs/number, echarts, and DOMPurify, all behind dynamic imports in the lazy renderer chunk. Widget CSP with `'self'` also lets widgets reference vault images through the existing file route; `connect-src` remains blocked by `default-src 'none'`. `web/vendor/` joins `lib/` and `web/dist/` as committed build output, and the dev-server duplicates the vendor and interactive routes so panel walkthroughs match the host.

## Verification

`scripts/e2e.mjs` (27 steps, scratch-copy vault) covers v2 widget gating (missing report and unknown type rejected, config-bearing widget accepted), visual-block gating (malformed plot/chart JSON and non-SVG blocks rejected at apply), and prompt migration (marker-less snapshot upgrades to v4 with `.bak` written once). `scripts/smoke-panel.mjs` asserts the vendor route serves JavaScript with the right MIME, rejects `%2e%2e` traversal, and serves the interactive route with `script-src 'unsafe-inline' 'self'` plus `default-src 'none'`; a scratch-vault fetch asserts the positive injection path places the KaTeX tags before `</head>`. UI `tsc --noEmit`, `npm run build`, and `npm run check` pass. On this machine Node's `fs.cpSync` crashes natively (0xC0000409, reproducible with the HEAD baseline), so e2e copies seed data through readFile/writeFile and logs steps synchronously.

## Alternatives considered

- **JSXGraph alongside Mafs** — two plotting stacks for the same content; dropped to keep one geometry renderer in the panel.
- **CDN loading for widget libraries** — breaks offline use, the sandbox security posture, and deterministic rendering; vendored same-origin files provide the supply without relaxing `connect-src`.
- **A structured widget DSL replacing free HTML** — OpenMAIC's scene DSL trades expressiveness for auditability; the widget-config metadata keeps the auditable part while free HTML stays the authoring surface.
- **Manim inside the engine** — a Python/LaTeX/ffmpeg toolchain contradicts the pure-TS engine discipline; an agent skill produces the same durable asset without an engine seam.
