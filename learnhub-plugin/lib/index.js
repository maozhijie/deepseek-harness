// src/index.ts
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
var name = "dsh-learnhub";
var inject = ["tools", "webServer", "llm"];
var llmCfg = { provider: "deepseek-official", model: "deepseek-v4-flash" };
var generating = /* @__PURE__ */ new Set();
var CENTER = "";
var VAULT = "";
var CENTER_REL = "";
var LOG_LIMIT = 1500;
var API = "/learnhub/api";
var PAGE = "/learnhub";
var PAGE_FILE = new URL("../web/index.html", import.meta.url);
var FILE_MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};
function spawnLearnhub(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("python", ["-X", "utf8", "-m", "learnhub", ...args], {
      cwd: CENTER,
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      windowsHide: true
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (d) => stdout += d);
    child.stderr.on("data", (d) => stderr += d);
    child.on("error", reject);
    child.on("close", (code) => resolve({ code: code ?? -1, stdout, stderr }));
  });
}
async function appendLog(args, res) {
  const path = `${CENTER}/state/\u8FD0\u884C\u65E5\u5FD7.md`;
  let old = "";
  try {
    old = await readFile(path, "utf8");
  } catch {
    old = "# \u8FD0\u884C\u65E5\u5FD7\n\n> \u63D2\u4EF6\u8C03\u7528 learnhub \u5F15\u64CE\u7684\u8BB0\u5F55\uFF0807 \xA72 / \xA77\uFF09\u3002\u5F15\u64CE\u81EA\u52A8\u4EA7\u51FA\uFF0C\u52FF\u624B\u5DE5\u6539\u3002\n";
  }
  const ts = (/* @__PURE__ */ new Date()).toLocaleString("sv-SE");
  const clip = (s) => s.length > LOG_LIMIT ? s.slice(0, LOG_LIMIT) + "\n\u2026\uFF08\u5DF2\u622A\u65AD\uFF09" : s;
  const entry = [
    "",
    `## ${ts} \xB7 learnhub ${args.join(" ")}`,
    "",
    `\u9000\u51FA\u7801\uFF1A${res.code}`,
    "",
    "```",
    clip((res.stdout + (res.stderr ? "\n[stderr]\n" + res.stderr : "")).trim() || "\uFF08\u65E0\u8F93\u51FA\uFF09"),
    "```",
    ""
  ].join("\n");
  await writeFile(path, old + entry, "utf8");
}
async function runLearnhub(args) {
  const res = await spawnLearnhub(args);
  await appendLog(args, res);
  if (res.code !== 0) {
    throw new Error(`learnhub exited with code ${res.code}
${res.stderr || res.stdout}`);
  }
  return res.stdout.trim();
}
function unwrapLink(s) {
  const m = s.trim().match(/^\[\[(.+?)(?:\|(.+?))?\]\]$/);
  if (!m) return s.trim();
  if (m[2]) return m[2].trim();
  return m[1].split("/").pop().trim();
}
async function writeBack(course, node, rating) {
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const path = `${CENTER}/\u4F1A\u8BDD/${today}.md`;
  let raw;
  try {
    raw = await readFile(path, "utf8");
  } catch {
    return { ok: false, message: "\u4ECA\u65E5\u5DE5\u4F5C\u5355\u4E0D\u5B58\u5728\uFF0C\u5148\u300C\u751F\u6210\u4ECA\u65E5\u5DE5\u4F5C\u5355\u300D\u3002" };
  }
  const lines = raw.split("\n");
  let section = "";
  const lineRe = /^(\s*- \[[ xX]?\] (.+?) ｜.*?(?:首学评分|复习评分|评分)：)\s*\d?\s*$/;
  let hit = false;
  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].match(/^##\s*\[(.+?)\]/);
    if (hm) section = hm[1].trim();
    if (section !== course) continue;
    const m = lines[i].match(lineRe);
    if (m && unwrapLink(m[2]) === node) {
      lines[i] = `${m[1]}${rating}`;
      hit = true;
      break;
    }
  }
  if (!hit) {
    return { ok: false, message: `\u5DE5\u4F5C\u5355\u7684 [${course}] \u6BB5\u6CA1\u6709\u300C${node}\u300D\u7684\u8BC4\u5206\u884C\uFF08\u4ECA\u65E5\u672A\u6392\u5165\uFF1F\uFF09` };
  }
  await writeFile(path, lines.join("\n"), "utf8");
  return { ok: true, message: `\u8BC4\u5206 ${rating} \u5DF2\u5199\u56DE\u4ECA\u65E5\u5DE5\u4F5C\u5355\uFF0C\u8BB0\u5F97\u300C\u7ED3\u7B97\u300D\u5165\u5E93\u3002` };
}
async function registryCourses() {
  let raw;
  try {
    raw = await readFile(`${CENTER}/\u8BFE\u7A0B\u6CE8\u518C\u8868.yaml`, "utf8");
  } catch {
    return [];
  }
  const out = [];
  let cur = null;
  for (const line of raw.split(/\r?\n/)) {
    if (/^-\s/.test(line)) {
      if (cur && cur.root) out.push(cur);
      cur = { name: "", root: "", enabled: "true" };
    }
    const m = line.match(/^\s*-?\s*(name|root|enabled):\s*(.+)$/);
    if (m && cur) cur[m[1]] = m[2].trim();
  }
  if (cur && cur.root) out.push(cur);
  return out;
}
async function courseOfRelPath(rel) {
  const seg = rel.split("/")[0];
  const reg = await registryCourses();
  const hit = reg.find((c) => c.root === seg && c.enabled !== "false");
  return hit ? hit.name : null;
}
function toVaultRel(input) {
  const p = input.replace(/\\/g, "/");
  return p.startsWith(`${VAULT}/`) ? p.slice(VAULT.length + 1) : p.replace(/^\/+/, "");
}
function frontmatterNode(raw) {
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const n = fm[1].match(/^node:\s*(.+)$/m);
  return n ? n[1].trim() : null;
}
async function resolveNote(input) {
  const rel = toVaultRel(input);
  const abs = `${VAULT}/${rel}`;
  const raw = await readFile(abs, "utf8");
  const node = frontmatterNode(raw);
  if (!node) throw new Error(`${rel} \u7684 frontmatter \u7F3A\u5C11 node \u5B57\u6BB5\uFF0C\u4E0D\u662F\u8BFE\u7A0B\u6587\u4EF6\u3002`);
  if (!rel.startsWith(`${CENTER_REL}/`)) throw new Error(`${rel} \u4E0D\u5728\u5B66\u4E60\u4E2D\u5FC3\u5185\u3002`);
  const course = await courseOfRelPath(rel.slice(CENTER_REL.length + 1));
  if (!course) throw new Error("\u65E0\u6CD5\u4ECE\u6CE8\u518C\u8868\u5B9A\u4F4D\u5F53\u524D\u7B14\u8BB0\u5BF9\u5E94\u7684\u8BFE\u7A0B\u3002");
  return { path: rel, node, course };
}
async function feedbackBody(absPath) {
  const raw = await readFile(absPath, "utf8");
  const sec = raw.match(/## 内容反馈\n([\s\S]*?)(?=\n## |<!-- enc_candidates|$)/);
  const body = (sec?.[1] ?? "").replace(/在此写下你对本课内容的问题与建议.*$/m, "").trim();
  return body || null;
}
async function withTempYaml(content, run) {
  await mkdir(`${CENTER}/state`, { recursive: true });
  const file = `${CENTER}/state/tmp-agent-${Date.now()}.yaml`;
  await writeFile(file, content, "utf8");
  try {
    return await run(file);
  } finally {
    await unlink(file).catch(() => void 0);
  }
}
function sendJson(res, code, body) {
  res.writeHead(code, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(body));
}
async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}
function need(body, key) {
  const v = body[key];
  if (typeof v !== "string" || !v.trim()) throw new Error(`missing required field: ${key}`);
  return v.trim();
}
function needText(body, key) {
  const v = body[key];
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v === "string" && v.trim()) return v.trim();
  throw new Error(`missing required field: ${key}`);
}
async function llmComplete(ctx, prompt, system) {
  const msg = createUserMessage({
    source: { kind: "user" },
    content: [{ type: "text", text: prompt }]
  });
  let text = "";
  let truncated = false;
  const stream = ctx.llm.stream({
    provider: llmCfg.provider,
    model: llmCfg.model,
    messages: [msg],
    ...system === void 0 ? {} : { system }
  });
  for await (const chunk of stream) {
    if (chunk.type === "text-delta") text += chunk.text;
    if (chunk.type === "finish" && (chunk.reason.kind === "aborted" || chunk.reason.kind === "error")) {
      throw new Error(chunk.reason.kind === "aborted" ? "\u6A21\u578B\u8C03\u7528\u88AB\u53D6\u6D88" : `\u6A21\u578B\u8C03\u7528\u5931\u8D25\uFF1A${String(chunk.reason.failure.message)}`);
    }
    if (chunk.type === "finish" && chunk.reason.kind === "max-tokens") truncated = true;
  }
  if (!text.trim()) throw new Error("\u6A21\u578B\u6CA1\u6709\u8FD4\u56DE\u5185\u5BB9");
  if (truncated) console.warn("[learnhub] \u8B66\u544A\uFF1A\u6A21\u578B\u8F93\u51FA\u88AB max-tokens \u622A\u65AD\uFF0C\u6B63\u6587\u53EF\u80FD\u4E0D\u5B8C\u6574");
  return text.trim();
}
async function withTempFile(content, run) {
  await mkdir(`${CENTER}/state`, { recursive: true });
  const file = `${CENTER}/state/tmp-gen-${Date.now()}.md`;
  await writeFile(file, content, "utf8");
  try {
    return await run(file);
  } finally {
    await unlink(file).catch(() => void 0);
  }
}
function stripFences(body) {
  const m = body.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/);
  return m ? m[1] : body;
}
async function generateContent(ctx, course, node) {
  const key = `${course}/${node}`;
  if (generating.has(key)) throw new Error(`\u300C${node}\u300D\u6B63\u5728\u751F\u6210\u4E2D\uFF0C\u8BF7\u7A0D\u5019\u3002`);
  generating.add(key);
  try {
    const pack = await runLearnhub(["content", "pack", node, "--course", course]);
    const tpl = await runLearnhub(["prompt", "--kind", "\u8BFE\u7A0B\u751F\u6210"]);
    const body = stripFences(await llmComplete(ctx, `${tpl}

---

${pack}`));
    return await withTempFile(body, (file) => runLearnhub(
      ["content", "apply", node, "--file", file, "--course", course]
    ));
  } finally {
    generating.delete(key);
  }
}
async function aiGrade(ctx, course, node, ex, answer) {
  const info = JSON.parse(await runLearnhub([
    "learn",
    "check",
    node,
    ex,
    "--answer",
    "",
    "--course",
    course,
    "--json"
  ]));
  if (info.judge !== "ai") throw new Error(`ex${ex} \u4E0D\u662F AI \u5224\u5377\u9898\uFF08judge=${info.judge ?? "?"}\uFF09\u3002`);
  const tpl = await runLearnhub(["prompt", "--kind", "AI\u5224\u5377"]);
  const raw = await llmComplete(
    ctx,
    `${tpl}

## \u9898\u76EE

${info.q ?? ""}

## \u8BC4\u5206\u8981\u70B9

${info.answer ?? ""}

## \u5B66\u751F\u4F5C\u7B54

${answer}`
  );
  const jm = raw.match(/\{[\s\S]*\}/);
  let verdict = {};
  if (jm) {
    try {
      verdict = JSON.parse(jm[0]);
    } catch {
    }
  }
  const score = typeof verdict.score === "number" ? Math.round(verdict.score) : 0;
  const feedback = `${verdict.verdict ?? (score >= 80 ? "\u5BF9" : score >= 50 ? "\u534A\u5BF9" : "\u9519")}\uFF08${score} \u5206\uFF09${verdict.feedback ? "\uFF1A" + String(verdict.feedback) : ""}${verdict.suggestions ? "\n\u5EFA\u8BAE\uFF1A" + String(verdict.suggestions) : ""}`;
  await runLearnhub([
    "learn",
    "record-attempt",
    node,
    ex,
    "--answer",
    answer,
    "--judge",
    "ai",
    "--correct",
    score >= 60 ? "1" : "0",
    "--feedback",
    feedback,
    "--course",
    course
  ]);
  return {
    score,
    verdict: verdict.verdict ?? null,
    feedback: verdict.feedback ?? "",
    suggestions: verdict.suggestions ?? "",
    correct: score >= 60,
    raw
  };
}
async function handleApi(ctx, req, res) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const route = url.pathname.slice(API.length);
  try {
    if (req.method === "GET" && route === "/status") {
      sendJson(res, 200, JSON.parse(await runLearnhub(["learn", "status", "--json"])));
      return;
    }
    if (req.method === "GET" && route === "/courses") {
      sendJson(res, 200, await registryCourses());
      return;
    }
    if (req.method === "GET" && route === "/exercises") {
      const node = url.searchParams.get("node");
      const course = url.searchParams.get("course");
      if (!node || !course) throw new Error("missing required field: node/course");
      const out = await runLearnhub(["learn", "exercises", node, "--course", course, "--json"]);
      sendJson(res, 200, JSON.parse(out));
      return;
    }
    if (req.method === "GET" && route === "/lesson") {
      const node = url.searchParams.get("node");
      if (!node) throw new Error("missing required field: node");
      const course = url.searchParams.get("course");
      const argv = ["learn", "lesson", node, "--json"];
      if (course) argv.splice(3, 0, "--course", course);
      sendJson(res, 200, JSON.parse(await runLearnhub(argv)));
      return;
    }
    if (req.method === "GET" && route === "/recommend") {
      const limit = url.searchParams.get("limit") ?? "5";
      sendJson(res, 200, JSON.parse(await runLearnhub(["learn", "recommend", "--limit", limit, "--json"])));
      return;
    }
    if (req.method === "GET" && route === "/queue") {
      sendJson(res, 200, JSON.parse(await runLearnhub(["learn", "queue", "--json"])));
      return;
    }
    if (req.method === "GET" && route === "/file") {
      const p = url.searchParams.get("path");
      if (!p) throw new Error("missing required field: path");
      const rel = p.replace(/\\/g, "/").replace(/^\/+/, "");
      if (rel.includes("..")) throw new Error("path traversal rejected");
      const ext = rel.slice(rel.lastIndexOf(".")).toLowerCase();
      const mime = FILE_MIME[ext];
      if (!mime) throw new Error(`unsupported file type: ${ext || "(none)"}`);
      let buf;
      try {
        buf = await readFile(`${VAULT}/${rel}`);
      } catch {
        sendJson(res, 404, { error: `file not found: ${rel}` });
        return;
      }
      res.writeHead(200, { "content-type": mime, "cache-control": "public, max-age=3600" });
      res.end(buf);
      return;
    }
    if (req.method === "GET" && route === "/note") {
      const path = url.searchParams.get("path");
      if (!path) throw new Error("missing required field: path");
      sendJson(res, 200, await resolveNote(path));
      return;
    }
    if (req.method === "GET" && route === "/graph") {
      const argv = ["graph", "analyze"];
      const course = url.searchParams.get("course");
      if (course) argv.push("--course", course);
      if (url.searchParams.get("elements") === "1") argv.push("--elements-only");
      sendJson(res, 200, JSON.parse(await runLearnhub(argv)));
      return;
    }
    if (req.method === "GET" && route === "/proposals") {
      sendJson(res, 200, JSON.parse(await runLearnhub(["graph", "proposals", "--json"])));
      return;
    }
    if (req.method === "GET" && route === "/doctor") {
      sendJson(res, 200, JSON.parse(await runLearnhub(["doctor", "--json"])));
      return;
    }
    if (req.method === "POST") {
      const body = await readJson(req);
      if (route === "/today") {
        const minutes = typeof body.minutes === "number" && Number.isFinite(body.minutes) ? body.minutes : 25;
        sendJson(res, 200, { message: await runLearnhub(["learn", "today", "--minutes", String(Math.round(minutes))]) });
        return;
      }
      if (route === "/settle") {
        sendJson(res, 200, { message: await runLearnhub(["learn", "settle"]) });
        return;
      }
      if (route === "/rebuild") {
        sendJson(res, 200, { message: await runLearnhub(["all"]) });
        return;
      }
      if (route === "/check") {
        const out = await runLearnhub([
          "learn",
          "check",
          need(body, "node"),
          needText(body, "ex"),
          "--answer",
          typeof body.answer === "string" ? body.answer : "",
          "--course",
          need(body, "course"),
          "--json"
        ]);
        sendJson(res, 200, JSON.parse(out));
        return;
      }
      if (route === "/grade") {
        const rating = Number(body.rating);
        if (!Number.isInteger(rating) || rating < 1 || rating > 4) throw new Error("rating must be 1-4");
        const spec = `${need(body, "course")}/${need(body, "node")}`;
        const out = await runLearnhub(["learn", "grade", spec, String(rating)]);
        sendJson(res, 200, { message: out });
        return;
      }
      if (route === "/writeback") {
        const rating = Number(body.rating);
        if (!Number.isInteger(rating) || rating < 1 || rating > 4) throw new Error("rating must be 1-4");
        sendJson(res, 200, await writeBack(need(body, "course"), need(body, "node"), rating));
        return;
      }
      if (route === "/feedback") {
        const { path, node, course } = await resolveNote(need(body, "path"));
        const bodyText = await feedbackBody(`${VAULT}/${path}`);
        if (!bodyText) throw new Error("\u8BF7\u5148\u5728\u7B14\u8BB0\u300C\u5185\u5BB9\u53CD\u9988\u300D\u533A\u5199\u4E0B\u4F60\u7684\u95EE\u9898\u4E0E\u5EFA\u8BAE\uFF0C\u518D\u63D0\u4EA4\u3002");
        sendJson(res, 200, { message: await runLearnhub(["content", "feedback", node, "--course", course]) });
        return;
      }
      if (route === "/proposals/apply") {
        const kind = need(body, "kind");
        const argv = kind === "edit" ? ["graph", "apply-edit", "--json"] : ["graph", "apply-gen", "--json"];
        if (body.id !== void 0) argv.push("--id", String(body.id));
        sendJson(res, 200, JSON.parse(await runLearnhub(argv)));
        return;
      }
      if (route === "/proposals/reject") {
        const id = Number(body.id);
        if (!Number.isInteger(id)) throw new Error("missing required field: id");
        const argv = ["graph", "reject", String(id)];
        if (typeof body.note === "string" && body.note.trim()) argv.push("--note", body.note.trim());
        sendJson(res, 200, { message: await runLearnhub(argv) });
        return;
      }
      if (route === "/generate") {
        sendJson(res, 200, {
          message: await generateContent(ctx, need(body, "course"), need(body, "node"))
        });
        return;
      }
      if (route === "/ai-grade") {
        sendJson(res, 200, await aiGrade(
          ctx,
          need(body, "course"),
          need(body, "node"),
          needText(body, "ex"),
          typeof body.answer === "string" ? body.answer : ""
        ));
        return;
      }
      if (route === "/review") {
        sendJson(res, 200, {
          message: await runLearnhub(["content", "review", need(body, "node"), "--course", need(body, "course")])
        });
        return;
      }
    }
    sendJson(res, 404, { error: `unknown route: ${req.method} ${route}` });
  } catch (err) {
    sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}
function apply(ctx, config) {
  const vault = typeof config?.vault === "string" ? config.vault.replace(/\\/g, "/").replace(/\/+$/, "") : "";
  if (!vault) {
    throw new Error(
      "[learnhub] config.vault \u7F3A\u5931\uFF1A\u5728\u8BE5\u673A\u5668\u7684 profile patch\uFF08~/.dsh/profiles/web/cordis.patch.yml\uFF09\u4E3A id: learnhub \u884C\u914D\u7F6E vault\uFF08vault \u6839\u76EE\u5F55\u7EDD\u5BF9\u8DEF\u5F84\uFF09\u3002"
    );
  }
  if (!existsSync(vault)) throw new Error(`[learnhub] config.vault \u76EE\u5F55\u4E0D\u5B58\u5728\uFF1A${vault}`);
  const centerRel = (config?.centerRel ?? "\u5B66\u4E60\u4E2D\u5FC3").replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const center = `${vault}/${centerRel}`;
  if (!existsSync(center)) throw new Error(`[learnhub] \u5B66\u4E60\u4E2D\u5FC3\u76EE\u5F55\u4E0D\u5B58\u5728\uFF1A${center}`);
  VAULT = vault;
  CENTER_REL = centerRel;
  CENTER = center;
  if (config?.provider) llmCfg.provider = config.provider;
  if (config?.model) llmCfg.model = config.model;
  const textOutput = {
    schema: { type: "string" },
    render: (_args, value) => [{ type: "text", text: String(value) }]
  };
  ctx.tools.register(defineTool({
    name: "learnhub_status",
    description: "Return the learning center status (center summary + per-course detail) as JSON.",
    parameters: {},
    output: textOutput,
    execute: () => runLearnhub(["learn", "status", "--json"])
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_today",
    description: "Generate today's worksheet (\u4F1A\u8BDD/YYYY-MM-DD.md) aggregating all enabled courses.",
    parameters: {
      minutes: { type: "number", description: "Available minutes today (default 25)" }
    },
    output: textOutput,
    execute: (args) => runLearnhub(
      args.minutes === void 0 ? ["learn", "today"] : ["learn", "today", "--minutes", String(Math.round(args.minutes))]
    )
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_settle",
    description: "Settle today's worksheet into the review system (per-section course attribution, audit-gated). Ratings must already be written into the worksheet.",
    parameters: {},
    output: textOutput,
    execute: () => runLearnhub(["learn", "settle"])
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_grade",
    description: 'Backfill a single 1-4 rating for a node (1=forgot, 2=hard, 3=normal, 4=easy). Use "course/node" when the node name is ambiguous across courses.',
    parameters: {
      node: { type: "string", required: true, description: 'Node name, or "course/node" to disambiguate' },
      rating: { type: "number", required: true, description: "Rating 1-4" }
    },
    output: textOutput,
    execute: (args) => runLearnhub(["learn", "grade", args.node, String(args.rating)])
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_exercises",
    description: "Fetch the exercise list of a course node as JSON (no answers). Fields: ex, q, difficulty, check (sympy|choice|ai|human), uses, options (choice only).",
    parameters: {
      node: { type: "string", required: true, description: "Node name" },
      course: { type: "string", required: true, description: "Course name" }
    },
    output: textOutput,
    execute: (args) => runLearnhub(["learn", "exercises", args.node, "--course", args.course, "--json"])
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_lesson",
    description: "Fetch one node's lesson pack as JSON: course body split into teaching sections (\u7EC3\u4E60/\u53CD\u9988 excluded, \u7B54\u6848 merged into \u4F8B\u9898), its exercises, prereqs, and suggested next nodes. Use this to teach a node step by step.",
    parameters: {
      node: { type: "string", required: true, description: "Node name" },
      course: { type: "string", required: true, description: "Course name" }
    },
    output: textOutput,
    execute: (args) => runLearnhub(["learn", "lesson", args.node, "--course", args.course, "--json"])
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_recommend",
    description: "Get the dynamic cross-course recommendation queue as JSON: next events (review/learning/new lesson) ranked by the priority rule (overdue reviews first by days overdue and retention decay, then half-finished lessons, then new lessons by unlock count and region rotation). Each event has type/course/node/score/why. Fetch the next batch after finishing one.",
    parameters: {
      limit: { type: "number", description: "Max events to return (default 5)" }
    },
    output: textOutput,
    execute: (args) => runLearnhub(
      args.limit === void 0 ? ["learn", "recommend", "--json"] : ["learn", "recommend", "--limit", String(Math.round(args.limit)), "--json"]
    )
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_check",
    description: 'Judge one exercise answer. sympy/choice return correct boolean; ai returns {"judge":"ai","q","answer":rubric} without recording (the panel route /ai-grade does the model call); human returns {"judge":"human","answer":reference} for self-grading.',
    parameters: {
      node: { type: "string", required: true, description: "Node name" },
      ex: { type: "string", required: true, description: 'Exercise number, e.g. "ex1"' },
      answer: { type: "string", required: true, description: 'User answer ("" for human exercises)' },
      course: { type: "string", required: true, description: "Course name" }
    },
    output: textOutput,
    execute: (args) => runLearnhub([
      "learn",
      "check",
      args.node,
      args.ex,
      "--answer",
      args.answer,
      "--course",
      args.course,
      "--json"
    ])
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_rebuild",
    description: "Run audit gate + generation (audit + build) for all enabled courses, or one course.",
    parameters: {
      course: { type: "string", description: "Course name; omit to rebuild all enabled courses" }
    },
    output: textOutput,
    execute: (args) => runLearnhub(args.course ? ["all", "--course", args.course] : ["all"])
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_feedback",
    description: "Submit content feedback of a course note: reads the note\u300C\u5185\u5BB9\u53CD\u9988\u300Dsection and marks the node for regeneration queue.",
    parameters: {
      path: { type: "string", required: true, description: "Note path, vault-relative or absolute" }
    },
    output: textOutput,
    execute: async (args) => {
      const { path, node, course } = await resolveNote(args.path);
      const body = await feedbackBody(`${VAULT}/${path}`);
      if (!body) throw new Error("\u8BF7\u5148\u5728\u7B14\u8BB0\u300C\u5185\u5BB9\u53CD\u9988\u300D\u533A\u5199\u4E0B\u4F60\u7684\u95EE\u9898\u4E0E\u5EFA\u8BAE\uFF0C\u518D\u63D0\u4EA4\u3002");
      return await runLearnhub(["content", "feedback", node, "--course", course]);
    }
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_writeback",
    description: "D15: write a 1-4 rating into the rating line of today's worksheet for one node. This is the only scheduling file write allowed outside the engine.",
    parameters: {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name" },
      rating: { type: "number", required: true, description: "Rating 1-4" }
    },
    output: textOutput,
    execute: async (args) => JSON.stringify(await writeBack(args.course, args.node, args.rating))
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_note_resolve",
    description: "Resolve a course note: read its frontmatter node and map the path to its enabled course via \u8BFE\u7A0B\u6CE8\u518C\u8868.yaml.",
    parameters: {
      path: { type: "string", required: true, description: "Note path, vault-relative or absolute" }
    },
    output: textOutput,
    execute: async (args) => JSON.stringify(await resolveNote(args.path))
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_graph_analyze",
    description: "Analyze a course knowledge graph (networkx): structural stats, lapse hotspots, unreachable nodes, bottlenecks, plus cytoscape render elements. Returns JSON. Run this before proposing graph edits.",
    parameters: {
      course: { type: "string", description: "Course name; omit when only one course is enabled" },
      elementsOnly: { type: "boolean", description: "Only output cytoscape render elements (nodes/edges)" }
    },
    output: textOutput,
    execute: (args) => {
      const argv = ["graph", "analyze"];
      if (args.course) argv.push("--course", args.course);
      if (args.elementsOnly) argv.push("--elements-only");
      return runLearnhub(argv);
    }
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_graph_propose",
    description: "Submit a graph proposal for human review. kind=gen: full course graph YAML (course/mode/regions/blocks/nodes/pre); kind=edit: change ops (add_node/del_node/set_pre/rename/move/set_note). Schema + structure gates reject bad YAML; accepted proposals become pending until applied.",
    parameters: {
      kind: { type: "string", required: true, description: '"gen" (new/append course graph) or "edit" (change ops)' },
      yaml: { type: "string", required: true, description: "Full proposal YAML text (GenProposal or EditProposal schema)" }
    },
    output: textOutput,
    execute: (args) => withTempYaml(args.yaml, (file) => runLearnhub(
      args.kind === "edit" ? ["graph", "propose-edit", file, "--json"] : ["graph", "propose-gen", file, "--json"]
    ))
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_graph_apply",
    description: "Decide a pending graph proposal after human review: apply (audit-gated, writes data/*.yaml with rename linkage + journal + snapshot) or reject (kept on record).",
    parameters: {
      kind: { type: "string", required: true, description: '"gen" or "edit"' },
      id: { type: "number", description: "Proposal id; omit for the latest pending of this kind" },
      reject: { type: "boolean", description: "true to reject instead of apply" },
      note: { type: "string", description: "Rejection reason (recorded)" }
    },
    output: textOutput,
    execute: async (args) => {
      if (args.reject) {
        if (!args.id) throw new Error("reject requires the proposal id");
        const argv2 = ["graph", "reject", String(args.id)];
        if (args.note) argv2.push("--note", args.note);
        return await runLearnhub(argv2);
      }
      const argv = args.kind === "edit" ? ["graph", "apply-edit", "--json"] : ["graph", "apply-gen", "--json"];
      if (args.id) argv.push("--id", String(args.id));
      return await runLearnhub(argv);
    }
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_exercises_gen",
    description: "Generate exercises for a course node: validates the ExerciseSet YAML (sympy answer parseability, uses in graph) then writes into the note practice section. Answers must be sympy-parseable for check=sympy items.",
    parameters: {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name (must match the node field inside the YAML)" },
      yaml: { type: "string", required: true, description: "ExerciseSet YAML text (node/mode/exercises[q,answer,check,difficulty,uses])" }
    },
    output: textOutput,
    execute: (args) => withTempYaml(args.yaml, (file) => runLearnhub(
      ["content", "gen-exercises", args.node, file, "--course", args.course]
    ))
  }));
  ctx.tools.register(defineTool({
    name: "learnhub_generate",
    description: "Generate one course note via the model: assembles the context pack (prereqs, domain boundary, forbidden concepts) + the user-editable prompt template (state/\u63D0\u793A\u8BCD/\u8BFE\u7A0B\u751F\u6210.md), calls the model, and applies the result through the quality gates as a draft (status=draft, awaiting human review).",
    parameters: {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name to generate" }
    },
    output: textOutput,
    execute: (args) => generateContent(ctx, args.course, args.node)
  }));
  ctx.tools.register(defineTool({
    name: "learnhub",
    description: 'Run any learnhub learning-engine CLI command and return its output (escape hatch for the full surface: audit/build/all/migrate/course/learn/content). Examples: "learn status --json", "course list", "content queue --course \u6570\u5B66".',
    parameters: {
      command: {
        type: "string",
        required: true,
        description: 'CLI arguments after "python -m learnhub", e.g. "learn status --json"'
      }
    },
    output: textOutput,
    execute: (args) => runLearnhub(args.command.trim().split(/\s+/))
  }));
  ctx.effect(
    () => ctx.webServer.register({ kind: "prefix", path: API, handler: (req, res) => handleApi(ctx, req, res) }),
    "learnhub: client panel API routes"
  );
  ctx.effect(
    () => ctx.webServer.register({
      kind: "exact",
      path: PAGE,
      handler: async (_req, res) => {
        try {
          const html = await readFile(PAGE_FILE, "utf8");
          res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          res.end(html);
        } catch (err) {
          res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
          res.end(`learnhub page missing: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }),
    "learnhub: dashboard + practice page"
  );
  console.log(`[learnhub] plugin loaded: vault=${VAULT}, center=${CENTER}, 18 tools registered, page at ${PAGE}, API at ${API}/*`);
  void runLearnhub(["learn", "status", "--json"]).then((out) => console.log(`[learnhub] self-check status --json OK (${out.length} bytes)`)).catch((err) => console.error(`[learnhub] self-check FAILED: ${err.message}`));
}
export {
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
