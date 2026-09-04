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
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var panelStore = {
  open: false,
  /** 分屏（默认，右侧 55%，不遮挡会话）/ 全屏切换。 */
  full: false,
  listeners: /* @__PURE__ */ new Set(),
  set(open) {
    if (panelStore.open === open) return;
    panelStore.open = open;
    for (const fn of panelStore.listeners) fn();
  },
  toggle() {
    panelStore.set(!panelStore.open);
  },
  setFull(full) {
    if (panelStore.full === full) return;
    panelStore.full = full;
    for (const fn of panelStore.listeners) fn();
  }
};
function usePanelOpen() {
  const [open, setOpen] = (0, import_react.useState)(panelStore.open);
  const [full, setFull] = (0, import_react.useState)(panelStore.full);
  (0, import_react.useEffect)(() => {
    const fn = () => {
      setOpen(panelStore.open);
      setFull(panelStore.full);
    };
    panelStore.listeners.add(fn);
    return () => {
      panelStore.listeners.delete(fn);
    };
  }, []);
  return open;
}
function usePanelFull() {
  const [full, setFull] = (0, import_react.useState)(panelStore.full);
  (0, import_react.useEffect)(() => {
    const fn = () => setFull(panelStore.full);
    panelStore.listeners.add(fn);
    return () => {
      panelStore.listeners.delete(fn);
    };
  }, []);
  return full;
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
    "\uFF08\u672C\u6761\u6D88\u606F\u6765\u81EA\u5B66\u4E60\u4E2D\u5FC3\u9762\u677F\u300C\u4E0E AI \u8BA8\u8BBA\u672C\u8BFE\u300D\u3002\u8BF7\u5148\u8BFB\u8BFE\u7A0B\u4E0A\u4E0B\u6587\uFF0C\u518D\u56DE\u5E94\u5B66\u4E60\u8005\u7684\u8BF7\u6C42\uFF1B\u6D89\u53CA\u6570\u636E\u4FEE\u6539\u65F6\u9075\u5B88 learnhub \u6280\u80FD SOP\uFF1A\u9898\u5E93/\u56FE/\u72B6\u6001\u8D70 learnhub_* \u5DE5\u5177\uFF0C\u6B63\u6587\u4FEE\u8BA2\u540E\u8DD1 learnhub_content_check\u3002\uFF09",
    pack,
    `[\u5B66\u4E60\u8005\u7684\u8BF7\u6C42] ${intent}`
  ].filter(Boolean).join("\n\n---\n\n");
  const binding = sessions.binding(sessionId);
  await binding?.session.prompt([{ type: "text", text }], "queue");
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
.dsh-lh_btn[data-open="true"] { background: var(--background-modifier-hover, rgba(255,255,255,.07)); }
.dsh-lh_icon { font-size: 15px; line-height: 1; }
.dsh-lh_overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  /* \u9ED8\u8BA4\u53F3\u4FA7\u5206\u5C4F\uFF08\u4E0D\u906E\u6321\u4F1A\u8BDD\u754C\u9762\uFF09\uFF1Bdata-full \u65F6\u5168\u5C4F */
  width: min(55vw, 1100px);
  min-width: 420px;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  background: var(--background-primary, #1e1e1e);
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.35);
}
.dsh-lh_overlay[data-full="true"] {
  width: 100vw;
  min-width: 0;
  box-shadow: none;
}
.dsh-lh_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid var(--background-modifier-border, rgba(255,255,255,.09));
  color: var(--text-normal, #d4d4d4);
  font-size: 13px;
  flex: none;
}
.dsh-lh_title { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.dsh-lh_close {
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted, #999);
  font-size: 13px;
  padding: 4px 10px;
  cursor: pointer;
}
.dsh-lh_close:hover { background: var(--background-modifier-hover, rgba(255,255,255,.07)); color: var(--text-normal, #d4d4d4); }
.dsh-lh_frame { flex: 1; width: 100%; border: none; background: var(--background-primary, #1e1e1e); }
`;
function LearnhubSection() {
  const open = usePanelOpen();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-lh_section", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "button",
    {
      type: "button",
      className: "dsh-lh_btn",
      "data-open": open,
      title: "\u6253\u5F00\u5B66\u4E60\u4E2D\u5FC3\u9762\u677F",
      onClick: () => panelStore.toggle(),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-lh_icon", children: "\u{1F4DA}" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u5B66\u4E60\u4E2D\u5FC3" })
      ]
    }
  ) });
}
function LearnhubPanel(props) {
  const open = usePanelOpen();
  const full = usePanelFull();
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") panelStore.set(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const onMessage = (e) => {
      const data = e.data;
      if (!data || typeof data !== "object" || data.type !== "learnhub:discuss") return;
      const course = typeof data.course === "string" ? data.course : "";
      const node = typeof data.node === "string" ? data.node : "";
      const intent = typeof data.intent === "string" && data.intent.trim() ? data.intent.trim() : "\u8BF7\u5E26\u6211\u8FC7\u4E00\u904D\u672C\u8282\u5185\u5BB9\uFF0C\u6307\u51FA\u6211\u53EF\u80FD\u5361\u4F4F\u7684\u5730\u65B9\u3002";
      if (!node) return;
      void discussInDsh(props.sessions, course, node, intent).then(() => panelStore.set(false)).catch((err) => console.error("[dsh-learnhub] discuss failed:", err));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, props.sessions]);
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-lh_overlay", "data-full": full, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-lh_header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-lh_title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-lh_icon", children: "\u{1F4DA}" }),
        "\u5B66\u4E60\u4E2D\u5FC3"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-lh_close", onClick: () => panelStore.setFull(!full), children: full ? "\u5206\u5C4F" : "\u5168\u5C4F" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-lh_close", onClick: () => panelStore.set(false), children: "\u5173\u95ED\uFF08Esc\uFF09" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", { className: "dsh-lh_frame", src: "/learnhub", title: "\u5B66\u4E60\u4E2D\u5FC3" })
  ] });
}
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
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "dsh-learnhub-panel",
    order: 90
  }, () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearnhubPanel, { sessions: ctx.sessions })), "dsh-learnhub: panel overlay");
  ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
    name: "sidebar.footer.action",
    id: "dsh-learnhub",
    order: 30
  }, LearnhubSection), "dsh-learnhub: sidebar entry");
}
return module.exports; } });
//# sourceMappingURL=client.js.map
