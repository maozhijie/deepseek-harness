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
  listeners: /* @__PURE__ */ new Set(),
  set(open) {
    if (panelStore.open === open) return;
    panelStore.open = open;
    for (const fn of panelStore.listeners) fn();
  },
  toggle() {
    panelStore.set(!panelStore.open);
  }
};
function usePanelOpen() {
  const [open, setOpen] = (0, import_react.useState)(panelStore.open);
  (0, import_react.useEffect)(() => {
    const fn = () => setOpen(panelStore.open);
    panelStore.listeners.add(fn);
    return () => {
      panelStore.listeners.delete(fn);
    };
  }, []);
  return open;
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
  inset: 0;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  background: var(--background-primary, #1e1e1e);
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
function LearnhubPanel() {
  const open = usePanelOpen();
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") panelStore.set(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);
  if (!open) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-lh_overlay", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-lh_header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-lh_title", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-lh_icon", children: "\u{1F4DA}" }),
        "\u5B66\u4E60\u4E2D\u5FC3"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-lh_close", onClick: () => panelStore.set(false), children: "\u5173\u95ED\uFF08Esc\uFF09" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", { className: "dsh-lh_frame", src: "/learnhub", title: "\u5B66\u4E60\u4E2D\u5FC3" })
  ] });
}
var inject = ["slots"];
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
  }, LearnhubPanel), "dsh-learnhub: panel overlay");
  ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
    name: "sidebar.footer.action",
    id: "dsh-learnhub",
    order: 30
  }, LearnhubSection), "dsh-learnhub: sidebar entry");
}
return module.exports; } });
//# sourceMappingURL=client.js.map
