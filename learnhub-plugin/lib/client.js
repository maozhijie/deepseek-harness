window.__ModuleLoader__.load({ id: 'dsh-learnhub', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var PANEL_WINDOW = "dsh-learnhub";
function LearnhubSection() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-lh_section", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "button",
    {
      type: "button",
      className: "dsh-lh_btn",
      title: "\u5728\u65B0\u6807\u7B7E\u9875\u6253\u5F00\u5B66\u4E60\u4E2D\u5FC3",
      onClick: () => {
        window.open("/learnhub", PANEL_WINDOW)?.focus();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-lh_icon", children: "\u{1F4DA}" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u5B66\u4E60\u4E2D\u5FC3" })
      ]
    }
  ) });
}
async function discussInDsh(sessions, course, node, intent) {
  let pack = "";
  try {
    const res = await fetch(`/learnhub/api/discuss-pack?course=${encodeURIComponent(course)}&node=${encodeURIComponent(node)}`);
    if (res.ok) {
      const doc = await res.json();
      if (typeof doc === "string") pack = doc;
    }
  } catch {
  }
  let cwd;
  try {
    const snap = sessions.list.getSnapshot();
    cwd = snap.current ? snap.byId[snap.current]?.cwd : void 0;
  } catch {
  }
  const sessionId = await sessions.create(cwd ? { cwd } : {});
  sessions.open(sessionId);
  const text = [
    "\uFF08\u672C\u6761\u6D88\u606F\u6765\u81EA\u5B66\u4E60\u4E2D\u5FC3\u300C\u4E0E AI \u8BA8\u8BBA\u672C\u8BFE\u300D\u3002\u8BF7\u5148\u8BFB\u8BFE\u7A0B\u4E0A\u4E0B\u6587\uFF0C\u518D\u56DE\u5E94\u5B66\u4E60\u8005\u7684\u8BF7\u6C42\uFF1B\u6D89\u53CA\u6570\u636E\u4FEE\u6539\u65F6\u9075\u5B88 learnhub \u6280\u80FD SOP\uFF1A\u9898\u5E93/\u56FE/\u72B6\u6001\u8D70 learnhub_* \u5DE5\u5177\uFF0C\u6B63\u6587\u4FEE\u8BA2\u540E\u8DD1 learnhub_content_check\u3002\uFF09",
    pack,
    `[\u5B66\u4E60\u8005\u7684\u8BF7\u6C42] ${intent}`
  ].filter(Boolean).join("\n\n---\n\n");
  const binding = sessions.binding(sessionId);
  await binding?.session.prompt([{ type: "text", text }], "queue");
  window.focus();
}
var css = `
.dsh-lh_section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
}
.dsh-lh_btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-normal, #d4d4d4);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}
.dsh-lh_btn:hover { background: var(--background-modifier-hover, rgba(255,255,255,.07)); }
.dsh-lh_icon { font-size: 15px; line-height: 1; }
`;
var inject = ["slots", "sessions"];
function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-dsh-plugin", "dsh-learnhub");
    style.textContent = css;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, "dsh-learnhub: styles");
  ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
    name: "sidebar.footer.action",
    id: "dsh-learnhub",
    order: 30
  }, LearnhubSection), "dsh-learnhub: sidebar entry");
  ctx.effect(() => {
    const onMessage = (e) => {
      const data = e.data;
      if (!data || typeof data !== "object" || data.type !== "learnhub:discuss") return;
      const course = typeof data.course === "string" ? data.course : "";
      const node = typeof data.node === "string" ? data.node : "";
      const intent = typeof data.intent === "string" && data.intent.trim() ? data.intent.trim() : "\u8BF7\u5E26\u6211\u8FC7\u4E00\u904D\u672C\u8282\u5185\u5BB9\uFF0C\u6307\u51FA\u6211\u53EF\u80FD\u5361\u4F4F\u7684\u5730\u65B9\u3002";
      if (!node) return;
      void discussInDsh(ctx.sessions, course, node, intent).catch((err) => console.error("[dsh-learnhub] discuss failed:", err));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, "dsh-learnhub: discuss bridge");
}
return module.exports; } });
//# sourceMappingURL=client.js.map
