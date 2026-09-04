import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/engine/paths.ts
var paths_exports = {};
__export(paths_exports, {
  Paths: () => Paths,
  safeFilename: () => safeFilename
});
function safeFilename(name) {
  return [...name].map((c) => FW_MAP[c] ?? c).join("");
}
var FW_MAP, Paths;
var init_paths = __esm({
  "src/engine/paths.ts"() {
    "use strict";
    FW_MAP = {
      "\\": "\uFF3C",
      "/": "\uFF0F",
      ":": "\uFF1A",
      "*": "\uFF0A",
      "?": "\uFF1F",
      '"': "\uFF02",
      "<": "\uFF1C",
      ">": "\uFF1E",
      "|": "\uFF5C"
    };
    Paths = class {
      constructor(centerRoot) {
        this.centerRoot = centerRoot;
      }
      // ---- 中心级 ----
      get registryPath() {
        return `${this.centerRoot}/\u8BFE\u7A0B\u6CE8\u518C\u8868.yaml`;
      }
      get sessionDir() {
        return `${this.centerRoot}/\u4F1A\u8BDD`;
      }
      get centerStateDir() {
        return `${this.centerRoot}/state`;
      }
      get journalPath() {
        return `${this.centerStateDir}/journal.jsonl`;
      }
      get practicePath() {
        return `${this.centerStateDir}/practice.jsonl`;
      }
      get proposalsPath() {
        return `${this.centerStateDir}/proposals.json`;
      }
      get proposalDir() {
        return `${this.centerStateDir}/proposals`;
      }
      get snapshotDir() {
        return `${this.centerStateDir}/snapshots`;
      }
      get dashboardPath() {
        return `${this.centerRoot}/\u5B66\u4E60\u4EEA\u8868\u76D8.md`;
      }
      get recoveryStatePath() {
        return `${this.centerStateDir}/recovery_state.json`;
      }
      get runLogPath() {
        return `${this.centerStateDir}/\u8FD0\u884C\u65E5\u5FD7.md`;
      }
      get promptDir() {
        return `${this.centerStateDir}/\u63D0\u793A\u8BCD`;
      }
      get trashDir() {
        return `${this.centerRoot}/.trash`;
      }
      sessionPath(dateStr) {
        return `${this.sessionDir}/${dateStr}.md`;
      }
      proposalArtifactPath(pid, kind, course) {
        return `${this.proposalDir}/${pid}-${kind}-${course}.yaml`;
      }
      snapshotPath(course, version2) {
        return `${this.snapshotDir}/${course}-v${version2}.json`;
      }
      // ---- 课程级 ----
      courseRoot(root) {
        return `${this.centerRoot}/${root}`;
      }
      /** 题库目录（question-bank 的 <课程根>/题库/<节点>.yaml）。 */
      bankDir(root) {
        return `${this.courseRoot(root)}/\u9898\u5E93`;
      }
      dataDir(root) {
        return `${this.courseRoot(root)}/data`;
      }
      courseDir(root) {
        return `${this.courseRoot(root)}/\u8BFE\u7A0B`;
      }
      statusPath(root) {
        return `${this.courseRoot(root)}/\u8FDB\u5EA6.md`;
      }
      readyPath(root) {
        return `${this.courseRoot(root)}/\u5C31\u7EEA\u6E05\u5355.md`;
      }
      reportPath(root) {
        return `${this.courseRoot(root)}/\u5BA1\u8BA1\u62A5\u544A.md`;
      }
      courseStateDir(root) {
        return `${this.courseRoot(root)}/state`;
      }
      queuePath(root) {
        return `${this.courseStateDir(root)}/\u751F\u6210\u961F\u5217.md`;
      }
      fsrsParamsPath(root) {
        return `${this.courseStateDir(root)}/fsrs\u53C2\u6570.json`;
      }
      /** 课程文件规范路径：课程/<区名>/<节点名>.md。 */
      courseNotePath(root, regionName, nodeName) {
        return `${this.courseDir(root)}/${safeFilename(regionName)}/${safeFilename(nodeName)}.md`;
      }
    };
  }
});

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = Symbol.for("yaml.alias");
    var DOC = Symbol.for("yaml.document");
    var MAP = Symbol.for("yaml.map");
    var PAIR = Symbol.for("yaml.pair");
    var SCALAR = Symbol.for("yaml.scalar");
    var SEQ = Symbol.for("yaml.seq");
    var NODE_TYPE = Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path) {
      const ctrl = callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visit_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = visit_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path) {
      const ctrl = await callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visitAsync_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path) {
      if (typeof visitor === "function")
        return visitor(key, node, path);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
      return void 0;
    }
    function replaceNode(key, path, node) {
      const parent = path[path.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version2] = parts;
            if (version2 === "1.1" || version2 === "1.2") {
              this.yaml.version = version2;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version2);
              onError(6, `Unsupported YAML version ${version2}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const { anchors: anchors2, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        let data = anchors2.get(source);
        if (!data) {
          toJS.toJS(source, null, ctx);
          data = anchors2.get(source);
        }
        if (data?.res === void 0) {
          const msg = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
          data.count += 1;
          if (data.aliasCount === 0)
            data.aliasCount = getAliasCount(doc, source, anchors2);
          if (data.count * data.aliasCount > maxAliasCount) {
            const msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
        return data.res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path, value) {
      let v = value;
      for (let i = path.length - 1; i >= 0; --i) {
        const k = path[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path, value) {
        if (isEmptyPath(path))
          this.add(value);
        else {
          const [key, ...rest] = path;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify2(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify2;
  }
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify2 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify2.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify2.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify2 = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify2.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify2 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify3 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify3(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify2.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify2.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify2 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify2.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify2.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify2.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version: version2 } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version2 = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version: version2 });
        this.setSchema(version2, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path) {
        if (Collection.isEmptyPath(path))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        if (Collection.isEmptyPath(path)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version2, options = {}) {
        if (typeof version2 === "number")
          version2 = String(version2);
        let opt;
        switch (version2) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version2;
            else
              this.directives = new directives.Directives({ version: version2 });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version2);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return foldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return foldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function foldLines(source) {
      let first, line;
      try {
        first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
        line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
      } catch {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
      }
      let match = first.exec(source);
      if (!match)
        return source;
      let res = match[1];
      let sep = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match = line.exec(source)) {
        if (match[1] === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + match[1];
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify2 = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify2;
  }
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path) => {
      let item = cst;
      for (const [field, index] of path) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path) => {
      const parent = visit.itemAtPath(cst, path.slice(0, -1));
      const field = path[path.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path, item, visitor) {
      let ctrl = visitor(item, path);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse2(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify2(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse2;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument;
    exports.stringify = stringify2;
  }
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// src/engine/yaml.ts
var import_yaml, YAML;
var init_yaml = __esm({
  "src/engine/yaml.ts"() {
    "use strict";
    import_yaml = __toESM(require_dist(), 1);
    YAML = {
      parse: (text) => (0, import_yaml.parse)(text),
      stringify: (value) => (0, import_yaml.stringify)(value, { aliasDuplicateObjects: false, lineWidth: 120 })
    };
  }
});

// src/engine/dates.ts
function todayStr(now = /* @__PURE__ */ new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function parseDay(s) {
  if (!s || typeof s !== "string") return null;
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) {
    const t = Date.parse(s.trim());
    return Number.isNaN(t) ? null : new Date(Math.floor(t / 864e5) * 864e5);
  }
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
}
function fmtDay(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function daysBetween(a, b) {
  return Math.round((a.getTime() - b.getTime()) / 864e5);
}
function nowIso() {
  const d = /* @__PURE__ */ new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
var init_dates = __esm({
  "src/engine/dates.ts"() {
    "use strict";
  }
});

// src/engine/store.ts
var store_exports = {};
__export(store_exports, {
  Store: () => Store,
  atomicWrite: () => atomicWrite
});
import { mkdir as mkdir2, readFile as readFile2, rename, appendFile, writeFile as writeFile2 } from "node:fs/promises";
import { existsSync } from "node:fs";
async function atomicWrite(path, data) {
  await mkdir2(path.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}-${Date.now()}`;
  await writeFile2(tmp, data, "utf8");
  await rename(tmp, path);
}
var Store;
var init_store = __esm({
  "src/engine/store.ts"() {
    "use strict";
    init_dates();
    Store = class {
      constructor(paths) {
        this.paths = paths;
      }
      // ---- journal ----
      /** 写一条 journal（JSONL 追加）→ 条目。 */
      async appendJournal(rec) {
        const full = {
          ts: rec.ts ?? nowIso(),
          course: rec.course,
          node: rec.node,
          rating: rec.rating ?? null,
          kind: rec.kind,
          elapsed_days: Math.round(rec.elapsed_days ?? 0),
          session: rec.session ?? null,
          duration_s: rec.duration_s ?? null,
          ...rec.detail ? { detail: rec.detail } : {}
        };
        await mkdir2(this.paths.centerStateDir, { recursive: true });
        await appendFile(this.paths.journalPath, JSON.stringify(full) + "\n", "utf8");
        return full;
      }
      /** 最近 N 条 journal（course 过滤可选）。 */
      async journalTail(course = null, limit = 50) {
        const lines = await this.readJsonl(this.paths.journalPath);
        const hit = course ? lines.filter((r) => r.course === course) : lines;
        return hit.slice(-limit).reverse();
      }
      async journalCount(course) {
        const lines = await this.readJsonl(this.paths.journalPath);
        return course ? lines.filter((r) => r.course === course).length : lines.length;
      }
      /** 学习行为按日聚合（journal + practice；ts 为本地时间 ISO，slice(0,10) 即本地日）。
       * 打卡/日历热力图的数据源——行为流水即事实，零新增文件。 */
      async activityCounts() {
        const [journal, practice] = await Promise.all([
          this.readJsonl(this.paths.journalPath),
          this.readJsonl(this.paths.practicePath)
        ]);
        const byDay = {};
        const bump = (ts, key) => {
          if (!ts) return;
          const day = ts.slice(0, 10);
          const slot = byDay[day] ?? (byDay[day] = { journal: 0, practice: 0, total: 0 });
          slot[key] += 1;
          slot.total += 1;
        };
        for (const r of journal) bump(r.ts, "journal");
        for (const r of practice) bump(r.ts, "practice");
        return byDay;
      }
      // ---- practice ----
      /** 追加一条作答记录。 */
      async appendPractice(rec) {
        const full = {
          ts: rec.ts ?? nowIso(),
          course: rec.course,
          node: rec.node,
          ex: rec.ex,
          answer: rec.answer,
          correct: rec.correct === void 0 ? null : rec.correct,
          judge: rec.judge,
          ...rec.qid ? { qid: rec.qid } : {},
          ...rec.feedback ? { feedback: rec.feedback } : {}
        };
        await mkdir2(this.paths.centerStateDir, { recursive: true });
        await appendFile(this.paths.practicePath, JSON.stringify(full) + "\n", "utf8");
        return full;
      }
      /** 全部作答记录（节点/课程过滤由调用方做；量级小，全读可接受）。 */
      async practiceAll() {
        return this.readJsonl(this.paths.practicePath);
      }
      /** 节点作答统计（attempts/judged/correct/accuracy + 正确率）。 */
      async attemptStats(course, node) {
        const all = await this.practiceAll();
        const hit = all.filter((r) => r.course === course && r.node === node);
        const judged = hit.filter((r) => r.correct !== null);
        const right = judged.filter((r) => r.correct === true).length;
        return {
          attempts: hit.length,
          judged: judged.length,
          correct: right,
          accuracy: judged.length ? Math.round(right / judged.length * 1e3) / 1e3 : null
        };
      }
      // ---- proposals ----
      async loadProposals() {
        try {
          const raw = await readFile2(this.paths.proposalsPath, "utf8");
          const doc = JSON.parse(raw);
          return Array.isArray(doc) ? doc : [];
        } catch {
          return [];
        }
      }
      async saveProposals(list) {
        await atomicWrite(this.paths.proposalsPath, JSON.stringify(list, null, 1) + "\n");
      }
      /** 新建提案 → id（自增）。 */
      async createProposal(kind, course, summary, artifact) {
        const list = await this.loadProposals();
        const id = list.reduce((m, p) => Math.max(m, p.id), 0) + 1;
        list.push({
          id,
          kind,
          course,
          status: "pending",
          summary,
          artifact,
          created: nowIso(),
          decided: null,
          decision_note: ""
        });
        await this.saveProposals(list);
        return id;
      }
      async updateProposal(id, patch) {
        const list = await this.loadProposals();
        const hit = list.find((p) => p.id === id);
        if (!hit) return null;
        Object.assign(hit, patch);
        await this.saveProposals(list);
        return hit;
      }
      /** 取 pending 提案（缺省 = 该 kind 最新一条）。 */
      async takePending(kind, pid) {
        const list = await this.loadProposals();
        let prop;
        if (pid) {
          prop = list.find((p) => p.id === pid);
          if (!prop) throw new Error(`[apply] \u63D0\u6848 #${pid} \u4E0D\u5B58\u5728\u3002`);
        } else {
          prop = [...list].reverse().find((p) => p.status === "pending" && p.kind === kind);
          if (!prop) throw new Error(`[apply] \u6CA1\u6709 pending \u7684 ${kind} \u63D0\u6848\uFF08\u5148 propose\uFF09\u3002`);
        }
        if (prop.status !== "pending") throw new Error(`[apply] \u63D0\u6848 #${prop.id} \u5DF2 ${prop.status}\u3002`);
        return prop;
      }
      // ---- snapshots ----
      async latestSnapshotVersion(course) {
        const dir = this.paths.snapshotDir;
        if (!existsSync(dir)) return 0;
        const { readdir: readdir4 } = await import("node:fs/promises");
        let max = 0;
        for (const f of await readdir4(dir)) {
          const m = f.match(new RegExp(`^${course}-v(\\d+)\\.json$`));
          if (m) max = Math.max(max, Number(m[1]));
        }
        return max;
      }
      async saveSnapshot(course, version2, doc) {
        await atomicWrite(this.paths.snapshotPath(course, version2), JSON.stringify(doc, null, 1) + "\n");
      }
      // ---- utils ----
      async readJsonl(path) {
        let raw;
        try {
          raw = await readFile2(path, "utf8");
        } catch {
          return [];
        }
        const out = [];
        for (const line of raw.split("\n")) {
          const s = line.trim();
          if (!s) continue;
          try {
            out.push(JSON.parse(s));
          } catch {
          }
        }
        return out;
      }
    };
  }
});

// src/engine/notes.ts
var notes_exports = {};
__export(notes_exports, {
  CONTENT_STATUS: () => CONTENT_STATUS,
  asFm: () => asFm,
  defaultFrontmatter: () => defaultFrontmatter,
  loadNote: () => loadNote,
  renderFrontmatter: () => renderFrontmatter,
  saveNote: () => saveNote,
  scanAll: () => scanAll,
  splitFrontmatter: () => splitFrontmatter,
  stateMap: () => stateMap,
  updateNote: () => updateNote
});
import { mkdir as mkdir4, readFile as readFile4, readdir as readdir2, writeFile as writeFile4 } from "node:fs/promises";
import { join as join2 } from "node:path";
function defaultFrontmatter(nodeName) {
  return {
    node: nodeName,
    stage: "ready",
    fsrs: null,
    mastery: 0,
    content: { version: 0, generated_at: null, status: "draft" },
    practice: { attempts: 0, correct: 0 }
  };
}
function splitFrontmatter(text) {
  if (!text.startsWith("---")) return { fm: null, body: text };
  const end = text.indexOf("\n---", 3);
  if (end < 0) return { fm: null, body: text };
  const raw = text.slice(3, end).replace(/^[\r\n]+|[\r\n]+$/g, "").replace(/\r/g, "");
  const body = text.slice(end + 4).replace(/^[\r\n]+/, "").replace(/\r\n/g, "\n");
  let fm = null;
  try {
    fm = YAML.parse(raw);
  } catch {
    fm = null;
  }
  const okFm = typeof fm === "object" && fm !== null ? fm : null;
  return { fm: okFm, body: okFm ? body : text };
}
function renderFrontmatter(fm) {
  const ordered = {};
  for (const k of FM_ORDER) if (k in fm) ordered[k] = fm[k];
  for (const [k, v] of Object.entries(fm)) if (!(k in ordered)) ordered[k] = v;
  return YAML.stringify(ordered).replace(/\n$/, "");
}
async function loadNote(path) {
  let raw;
  try {
    raw = await readFile4(path, "utf8");
  } catch {
    return { fm: null, body: "" };
  }
  return splitFrontmatter(raw);
}
function asFm(fm) {
  if (!fm || typeof fm.node !== "string") return null;
  const stage = fm.stage ?? "unseen";
  const content = fm.content ?? { version: 0, generated_at: null, status: "draft" };
  const practice = fm.practice ?? { attempts: 0, correct: 0 };
  return {
    node: fm.node,
    stage,
    fsrs: fm.fsrs ?? null,
    mastery: typeof fm.mastery === "number" ? fm.mastery : 0,
    practice_ema: typeof fm.practice_ema === "number" ? fm.practice_ema : void 0,
    content,
    practice
  };
}
async function saveNote(path, fm, body) {
  await mkdir4(path.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
  const head = `---
${renderFrontmatter(fm)}
---

`;
  await writeFile4(path, head + (body.startsWith("#") || !body.trim() ? body : body), "utf8");
}
async function updateNote(path, patch) {
  const { fm, body } = await loadNote(path);
  if (!fm) throw new Error(`\u65E0\u6709\u6548 frontmatter: ${path}`);
  const next = { ...fm, ...patch };
  await saveNote(path, next, body);
  return next;
}
async function scanAll(courseDir) {
  const found = {};
  const broken = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir2(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const p = join2(dir, e.name);
      if (e.isDirectory()) {
        await walk(p);
      } else if (e.name.endsWith(".md")) {
        const { fm } = await loadNote(p);
        const node = fm && typeof fm.node === "string" ? fm.node : null;
        if (!node) {
          broken.push(p);
          continue;
        }
        found[node] = { path: p, fm };
      }
    }
  }
  await walk(courseDir);
  return { found, broken };
}
async function stateMap(courseDir) {
  const { found, broken } = await scanAll(courseDir);
  const state = {};
  for (const [node, { fm }] of Object.entries(found)) {
    const f = asFm(fm);
    if (f) state[node] = f;
  }
  return { state, broken };
}
var CONTENT_STATUS, FM_ORDER;
var init_notes = __esm({
  "src/engine/notes.ts"() {
    "use strict";
    init_yaml();
    CONTENT_STATUS = ["draft", "reviewed", "flagged"];
    FM_ORDER = ["node", "stage", "fsrs", "mastery", "practice_ema", "content", "practice"];
  }
});

// src/engine/index.ts
init_paths();
import { existsSync as existsSync6 } from "node:fs";
import { mkdir as mkdir9, readdir as readdir3, readFile as readFile10, rename as rename3 } from "node:fs/promises";

// src/engine/registry.ts
init_yaml();
import { readFile, writeFile, mkdir } from "node:fs/promises";
var Registry = class {
  constructor(paths) {
    this.paths = paths;
  }
  /** 读注册表 → 课程条目列表（保序）。文件缺失返回 []。 */
  async load() {
    let raw;
    try {
      raw = await readFile(this.paths.registryPath, "utf8");
    } catch {
      return [];
    }
    const doc = YAML.parse(raw);
    const courses = doc?.courses;
    if (!Array.isArray(courses)) return [];
    return courses.filter((c) => typeof c === "object" && c !== null && typeof c.name === "string");
  }
  async save(courses) {
    await mkdir(this.paths.centerRoot, { recursive: true });
    await writeFile(this.paths.registryPath, YAML.stringify({ courses }), "utf8");
  }
  /** 按 name 或 id 精确匹配；未找到返回 null。 */
  async get(key) {
    for (const c of await this.load()) {
      if (key === c.name || key === c.id) return c;
    }
    return null;
  }
  /** 全部启用中的课程（保序）。 */
  async enabled() {
    return (await this.load()).filter((c) => c.enabled !== false);
  }
  /** 设置课程标签（整体替换；空数组移除字段，保持注册表干净）。 */
  async setTags(courseKey, tags) {
    const courses = await this.load();
    const hit = courses.find((c) => courseKey === c.name || courseKey === c.id);
    if (!hit) throw new Error(`[learnhub] \u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${courseKey}\u300D\u3002`);
    const clean = [...new Set(tags.map((t) => t.trim()).filter(Boolean))];
    if (clean.length) hit.tags = clean;
    else delete hit.tags;
    await this.save(courses);
    return clean;
  }
  /** CLI 课程选择语义：显式指定 → 精确匹配；未指定 → 唯一启用课程。 */
  async resolve(key) {
    if (key) {
      const c = await this.get(key);
      if (!c) {
        const known = (await this.load()).map((x) => `${x.name}(${x.id ?? "?"})`).join("\u3001");
        throw new Error(`[learnhub] \u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${key}\u300D\u3002\u73B0\u6709\uFF1A${known || "\uFF08\u7A7A\uFF09"}`);
      }
      if (c.enabled === false) throw new Error(`[learnhub] \u8BFE\u7A0B\u300C${c.name}\u300D\u5DF2\u505C\u7528\u3002`);
      return c;
    }
    const en = await this.enabled();
    if (en.length === 1) return en[0];
    if (!en.length) throw new Error("[learnhub] \u6CA1\u6709\u542F\u7528\u4E2D\u7684\u8BFE\u7A0B\u3002");
    throw new Error(`[learnhub] \u591A\u95E8\u8BFE\u7A0B\u542F\u7528\u4E2D\uFF0C\u8BF7\u7528 --course \u6307\u5B9A\uFF1A${en.map((c) => c.name).join("\u3001")}`);
  }
};

// src/engine/index.ts
init_store();

// src/engine/graph.ts
init_yaml();
init_store();
init_paths();
import { readdir, readFile as readFile3, writeFile as writeFile3, mkdir as mkdir3 } from "node:fs/promises";
import { join } from "node:path";
var NODE_KEYS = /* @__PURE__ */ new Set(["name", "pre", "opt", "note", "enc"]);
var SchemaError = class extends Error {
};
function fail(path, msg) {
  throw new SchemaError(`${path.replace(/[/\\]/g, "/").split("/").pop()}: ${msg}`);
}
function parseEnc(raw, path, where, name) {
  if (!Array.isArray(raw)) fail(path, `${where}[${name}] enc \u5FC5\u987B\u662F\u5217\u8868`);
  const out = [];
  for (const item of raw) {
    if (typeof item === "string") {
      out.push({ node: item, w: 1 });
    } else if (typeof item === "object" && item !== null) {
      const e = item;
      const t = e.node;
      if (typeof t !== "string" || !t.trim()) fail(path, `${where}[${name}] enc \u6761\u76EE\u7F3A node`);
      const w = e.w ?? 1;
      if (typeof w !== "number" || !(w >= 0 && w <= 1)) fail(path, `${where}[${name}] enc \u6743\u91CD w \u5FC5\u987B\u662F 0\u20131 \u7684\u6570`);
      const entry = { node: t, w };
      if (e.note !== void 0) {
        if (typeof e.note !== "string") fail(path, `${where}[${name}] enc note \u5FC5\u987B\u662F\u5B57\u7B26\u4E32`);
        entry.note = e.note;
      }
      const unknown = Object.keys(e).filter((k) => !["node", "w", "note"].includes(k));
      if (unknown.length) fail(path, `${where}[${name}] enc \u6761\u76EE\u542B\u672A\u77E5\u5B57\u6BB5 ${JSON.stringify(unknown)}`);
      out.push(entry);
    } else {
      fail(path, `${where}[${name}] enc \u6761\u76EE\u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u6216\u6620\u5C04`);
    }
  }
  return out;
}
function parseNode(raw, path, where) {
  if (typeof raw !== "object" || raw === null) fail(path, `${where} \u8282\u70B9\u5FC5\u987B\u662F\u6620\u5C04`);
  const r = raw;
  const unknown = Object.keys(r).filter((k) => !NODE_KEYS.has(k));
  if (unknown.length) fail(path, `${where} \u542B\u672A\u77E5\u5B57\u6BB5 ${JSON.stringify(unknown)}\uFF08\u53EA\u5141\u8BB8 name/pre/opt/note/enc\uFF09`);
  const name = r.name;
  if (typeof name !== "string" || !name.trim()) fail(path, `${where} \u8282\u70B9 name \u7F3A\u5931\u6216\u4E3A\u7A7A`);
  const pre = r.pre ?? [];
  if (!Array.isArray(pre) || pre.some((p) => typeof p !== "string")) fail(path, `${where}[${name}] pre \u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u5217\u8868`);
  const opt = r.opt ?? false;
  if (typeof opt !== "boolean") fail(path, `${where}[${name}] opt \u5FC5\u987B\u662F\u5E03\u5C14\u503C`);
  const note = r.note ?? "";
  if (typeof note !== "string") fail(path, `${where}[${name}] note \u5FC5\u987B\u662F\u5B57\u7B26\u4E32`);
  const enc = parseEnc(r.enc ?? [], path, where, name);
  return { name: name.trim(), pre, opt, note, enc };
}
function loadRegionDoc(doc, path) {
  if (typeof doc !== "object" || doc === null) fail(path, "\u9876\u5C42\u5FC5\u987B\u662F\u6620\u5C04\uFF08region/color/blocks\uFF09");
  const d = doc;
  const region = d.region;
  if (typeof region !== "string" || !region.trim()) fail(path, "region \u7F3A\u5931\u6216\u4E3A\u7A7A");
  const color = typeof d.color === "string" ? d.color : "";
  if (typeof d.color === "undefined") {
  }
  if (!Array.isArray(d.blocks)) fail(path, "blocks \u5FC5\u987B\u662F\u5217\u8868");
  const blocks = d.blocks.map((braw, bi) => {
    const where = `\u5757#${bi + 1}`;
    if (typeof braw !== "object" || braw === null || typeof braw.name !== "string") {
      fail(path, `${where} \u7F3A\u5C11 name`);
    }
    const b = braw;
    const bname = b.name.trim();
    if (!Array.isArray(b.nodes)) fail(path, `\u5757[${bname}] nodes \u5FC5\u987B\u662F\u5217\u8868`);
    const nodes = b.nodes.map((nraw) => parseNode(nraw, path, `\u5757[${bname}]`));
    return { name: bname, nodes };
  });
  return { name: region.trim(), color, blocks };
}
var GraphStore = class {
  constructor(paths, courseRoot) {
    this.paths = paths;
    this.courseRoot = courseRoot;
  }
  get dataDir() {
    return join(this.courseRoot, "data");
  }
  /** 按文件名顺序加载 data 目录全部 .yaml → Region 列表。 */
  async load() {
    const files = await this.regionFilePaths();
    if (!files.length) throw new SchemaError(`\u6570\u636E\u76EE\u5F55\u4E3A\u7A7A\u6216\u4E0D\u5B58\u5728: ${this.dataDir}`);
    const out = [];
    for (const p of files) {
      out.push(loadRegionDoc(YAML.parse(await readFile3(p, "utf8")), p));
    }
    return out;
  }
  async regionFilePaths() {
    let entries;
    try {
      entries = await readdir(this.dataDir);
    } catch {
      return [];
    }
    return entries.filter((f) => f.endsWith(".yaml")).sort().map((f) => join(this.dataDir, f));
  }
  /** 区名 → yaml 文件路径（gen 的 append/编辑用）。 */
  async regionFiles() {
    const out = {};
    for (const p of await this.regionFilePaths()) {
      const r = loadRegionDoc(YAML.parse(await readFile3(p, "utf8")), p);
      out[r.name] = p;
    }
    return out;
  }
  /** Region → YAML 文本（节点字段按 name/pre/opt/note/enc 顺序，省空值）。 */
  regionDoc(region, color) {
    return {
      region: region.name,
      color: color !== void 0 ? color : region.color,
      blocks: region.blocks.map((b) => ({
        name: b.name,
        nodes: b.nodes.map((n) => {
          const doc = { name: n.name };
          if (n.pre.length) doc.pre = [...n.pre];
          if (n.opt) doc.opt = true;
          if (n.note) doc.note = n.note;
          if (n.enc.length) doc.enc = n.enc.map((e) => {
            const edge = { node: e.node, w: e.w };
            if (e.note) edge.note = e.note;
            return edge;
          });
          return doc;
        })
      }))
    };
  }
  async writeRegionDoc(path, region) {
    await mkdir3(path.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
    await writeFile3(path, YAML.stringify(this.regionDoc(region)), "utf8");
  }
};
var Graph = class {
  constructor(regions) {
    this.regions = regions;
    for (const n of this.regions.flatMap((r) => r.blocks.flatMap((b) => b.nodes))) {
      this.names.push(n.name);
      this.count[n.name] = (this.count[n.name] ?? 0) + 1;
      this.preOf[n.name] = [...n.pre];
    }
    for (const [ridx, region] of this.regions.entries()) {
      for (const block of region.blocks) {
        for (const node of block.nodes) {
          const n = node.name;
          this.regionIdxOf[n] = ridx;
          this.blockOf[n] = [ridx, region.name, block.name];
          this.encOf[n] = node.enc.map((e) => [e.node, e.w]);
          if (node.opt) this.opt.add(n);
          if (node.note) this.noteOf[n] = node.note;
        }
      }
    }
    this.nset = new Set(this.names);
    for (const n of this.names) {
      this.succ[n] = [];
      this.pred[n] = [];
    }
    for (const n of this.names) {
      for (const p of this.preOf[n]) {
        if (this.nset.has(p)) {
          this.succ[p].push(n);
          this.pred[n].push(p);
        }
      }
    }
    const indeg = {};
    for (const n of this.names) indeg[n] = this.pred[n].length;
    const queue = this.names.filter((n) => indeg[n] === 0);
    while (queue.length) {
      const u = queue.shift();
      this.order.push(u);
      for (const v of this.succ[u]) {
        if (--indeg[v] === 0) queue.push(v);
      }
    }
    this.hasCycle = this.order.length !== this.names.length;
    this.cycleNodes = this.names.filter((n) => indeg[n] > 0);
    if (!this.hasCycle) {
      for (const u of this.order) {
        this.depth[u] = Math.max(-1, ...this.pred[u].map((p) => this.depth[p] ?? -1)) + 1;
      }
      for (const u of [...this.order].reverse()) {
        const s = /* @__PURE__ */ new Set();
        for (const v of this.succ[u]) {
          s.add(v);
          for (const w of this.reach[v] ?? []) s.add(w);
        }
        this.reach[u] = s;
      }
    }
    this.leaves = this.names.filter((n) => !this.succ[n].length);
    this.roots = this.names.filter((n) => !this.pred[n].length);
    if (!this.hasCycle) {
      const keep = /* @__PURE__ */ new Set();
      for (const u of this.names) {
        for (const v of this.succ[u]) {
          const redundant = this.succ[u].some((w) => w !== v && this.reach[w]?.has(v));
          if (!redundant) keep.add(`${u}\0${v}`);
        }
      }
      this.edges = [...keep].map((s) => s.split("\0")).sort();
    }
    this.buildComponents();
  }
  names = [];
  preOf = {};
  opt = /* @__PURE__ */ new Set();
  noteOf = {};
  regionIdxOf = {};
  /** name → [区序号, 区名, 块名]。 */
  blockOf = {};
  encOf = {};
  count = {};
  succ = {};
  pred = {};
  nset = /* @__PURE__ */ new Set();
  order = [];
  hasCycle = false;
  cycleNodes = [];
  depth = {};
  reach = {};
  leaves = [];
  roots = [];
  /** 渲染用边 = 传递约简后的边（[u, v] 升序）。 */
  edges = [];
  components = [];
  buildComponents() {
    const parent = {};
    for (const n of this.names) parent[n] = n;
    const find = (a) => {
      while (parent[a] !== a) {
        parent[a] = parent[parent[a]];
        a = parent[a];
      }
      return a;
    };
    for (const n of this.names) {
      for (const p of this.pred[n]) {
        const ra = find(n);
        const rb = find(p);
        if (ra !== rb) parent[ra] = rb;
      }
    }
    const comp = {};
    for (const n of this.names) {
      const r = find(n);
      (comp[r] ??= []).push(n);
    }
    this.components = Object.values(comp);
  }
  /** 就绪 = 全部前置已完成或为可选概念。 */
  isReady(n, done) {
    return this.preOf[n].every((p) => done.has(p) || this.opt.has(p));
  }
  /** a 是否为 n 的祖先（pre 传递闭包内，不含自身）。 */
  isAncestor(a, n) {
    return a !== n && (this.reach[a]?.has(n) ?? false);
  }
  readySet(done, doing) {
    return this.names.filter((n) => !done.has(n) && !doing.has(n) && this.isReady(n, done)).sort();
  }
  edgeCount() {
    return Object.values(this.succ).reduce((s, v) => s + v.length, 0);
  }
};
function structureCheck(existing, newRegions, label) {
  const errors = [];
  const mergedNames = existing ? [...existing.names] : [];
  const newNodes = newRegions.flatMap((r) => r.blocks.flatMap((b) => b.nodes));
  const seen = new Set(mergedNames);
  for (const n of newNodes) {
    if (seen.has(n.name)) errors.push(`${label}\u91CD\u540D\u8282\u70B9: ${n.name}`);
    seen.add(n.name);
  }
  for (const n of newNodes) {
    for (const p of n.pre) {
      if (!seen.has(p)) errors.push(`${label}\u65AD\u8FB9: ${n.name} -> ${p}\uFF08\u672A\u5B9A\u4E49\u7684\u524D\u7F6E\uFF09`);
    }
    for (const e of n.enc) {
      if (!seen.has(e.node)) errors.push(`${label}enc \u65AD\u8FB9: ${n.name} -> ${e.node}`);
    }
  }
  if (!errors.length) {
    const merged = new Graph([...existing?.regions ?? [], ...newRegions]);
    if (merged.hasCycle) errors.push(`${label}\u5F15\u5165\u73AF\uFF1A\u6D89\u53CA ${merged.cycleNodes.slice(0, 5).join("\u3001")}`);
  }
  return errors;
}
function snapshotDoc(store, regions) {
  return regions.map((r) => store.regionDoc(r));
}
async function writeReadyList(paths, root, graph, done) {
  const lines = ["# \u5C31\u7EEA\u6E05\u5355", "", "> \u5F15\u64CE\u81EA\u52A8\u751F\u6210\uFF1A\u5F53\u524D\u5C31\u7EEA\uFF08\u524D\u7F6E\u8FBE\u6807\uFF09\u7684\u672A\u5B66\u8282\u70B9\uFF0C\u6309\u533A/\u5757\u5206\u7EC4\u3002", ""];
  const ready = graph.readySet(done, /* @__PURE__ */ new Set());
  const byRegion = {};
  for (const n of ready) {
    const region = graph.blockOf[n][1];
    (byRegion[region] ??= []).push(n);
  }
  for (const region of graph.regions) {
    const items = byRegion[region.name];
    if (!items?.length) continue;
    lines.push(`## ${region.name}`, "");
    for (const n of items) lines.push(`- ${n}\uFF08\u5757\uFF1A${graph.blockOf[n][2]}\uFF09`);
    lines.push("");
  }
  await atomicWrite(paths.readyPath(root), lines.join("\n"));
}

// src/engine/index.ts
init_notes();

// src/engine/srs.ts
import { readFile as readFile5 } from "node:fs/promises";

// node_modules/ts-fsrs/dist/index.mjs
var FSRSError = class _FSRSError extends Error {
  constructor(message = "FSRS Error") {
    super(message);
    this.name = "FSRSError";
    Error.captureStackTrace?.(this, _FSRSError);
  }
};
var FSRSValidationError = class _FSRSValidationError extends FSRSError {
  constructor(message) {
    super(message);
    this.name = "FSRSValidationError";
    Error.captureStackTrace?.(this, _FSRSValidationError);
  }
};
var State = /* @__PURE__ */ ((State2) => {
  State2[State2["New"] = 0] = "New";
  State2[State2["Learning"] = 1] = "Learning";
  State2[State2["Review"] = 2] = "Review";
  State2[State2["Relearning"] = 3] = "Relearning";
  return State2;
})(State || {});
var Rating = /* @__PURE__ */ ((Rating2) => {
  Rating2[Rating2["Manual"] = 0] = "Manual";
  Rating2[Rating2["Again"] = 1] = "Again";
  Rating2[Rating2["Hard"] = 2] = "Hard";
  Rating2[Rating2["Good"] = 3] = "Good";
  Rating2[Rating2["Easy"] = 4] = "Easy";
  return Rating2;
})(Rating || {});
var TypeConvert = class _TypeConvert {
  static card(card) {
    return {
      ...card,
      state: _TypeConvert.state(card.state),
      due: _TypeConvert.time(card.due),
      last_review: card.last_review ? _TypeConvert.time(card.last_review) : void 0
    };
  }
  static rating(value) {
    if (typeof value === "string") {
      const firstLetter = value.charAt(0).toUpperCase();
      const restOfString = value.slice(1).toLowerCase();
      const ret = Rating[`${firstLetter}${restOfString}`];
      if (ret === void 0) {
        throw new FSRSValidationError(`Invalid rating:[${value}]`);
      }
      return ret;
    } else if (typeof value === "number") {
      return value;
    }
    throw new FSRSValidationError(`Invalid rating:[${value}]`);
  }
  static state(value) {
    if (typeof value === "string") {
      const firstLetter = value.charAt(0).toUpperCase();
      const restOfString = value.slice(1).toLowerCase();
      const ret = State[`${firstLetter}${restOfString}`];
      if (ret === void 0) {
        throw new FSRSValidationError(`Invalid state:[${value}]`);
      }
      return ret;
    } else if (typeof value === "number") {
      return value;
    }
    throw new FSRSValidationError(`Invalid state:[${value}]`);
  }
  static time(value) {
    if (value instanceof Date) {
      return value;
    }
    const date = new Date(value);
    if (typeof value === "object" && value !== null && !Number.isNaN(Date.parse(value) || +date)) {
      return date;
    } else if (typeof value === "string") {
      const timestamp = Date.parse(value);
      if (!Number.isNaN(timestamp)) {
        return new Date(timestamp);
      } else {
        throw new FSRSValidationError(`Invalid date:[${value}]`);
      }
    } else if (typeof value === "number") {
      return new Date(value);
    }
    throw new FSRSValidationError(`Invalid date:[${value}]`);
  }
  static review_log(log) {
    return {
      ...log,
      due: _TypeConvert.time(log.due),
      rating: _TypeConvert.rating(log.rating),
      state: _TypeConvert.state(log.state),
      review: _TypeConvert.time(log.review)
    };
  }
};
Date.prototype.scheduler = function(t, isDay) {
  return date_scheduler(this, t, isDay);
};
Date.prototype.diff = function(pre, unit) {
  return date_diff(this, pre, unit);
};
Date.prototype.format = function() {
  return formatDate(this);
};
Date.prototype.dueFormat = function(last_review, unit, timeUnit) {
  return show_diff_message(this, last_review, unit, timeUnit);
};
function date_scheduler(now, t, isDay) {
  return new Date(
    isDay ? TypeConvert.time(now).getTime() + t * 24 * 60 * 60 * 1e3 : TypeConvert.time(now).getTime() + t * 60 * 1e3
  );
}
function date_diff(now, pre, unit) {
  if (!now || !pre) {
    throw new FSRSValidationError("Invalid date");
  }
  const diff = TypeConvert.time(now).getTime() - TypeConvert.time(pre).getTime();
  let r = 0;
  switch (unit) {
    case "days":
      r = Math.floor(diff / (24 * 60 * 60 * 1e3));
      break;
    case "minutes":
      r = Math.floor(diff / (60 * 1e3));
      break;
  }
  return r;
}
function formatDate(dateInput) {
  const date = TypeConvert.time(dateInput);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(
    minutes
  )}:${padZero(seconds)}`;
}
function padZero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}
var TIMEUNIT = [60, 60, 24, 31, 12];
var TIMEUNITFORMAT = ["second", "min", "hour", "day", "month", "year"];
function show_diff_message(due, last_review, unit, timeUnit = TIMEUNITFORMAT) {
  due = TypeConvert.time(due);
  last_review = TypeConvert.time(last_review);
  if (timeUnit.length !== TIMEUNITFORMAT.length) {
    timeUnit = TIMEUNITFORMAT;
  }
  let diff = due.getTime() - last_review.getTime();
  let i = 0;
  diff /= 1e3;
  for (i = 0; i < TIMEUNIT.length; i++) {
    if (diff < TIMEUNIT[i]) {
      break;
    } else {
      diff /= TIMEUNIT[i];
    }
  }
  return `${Math.floor(diff)}${unit ? timeUnit[i] : ""}`;
}
var Grades = Object.freeze([
  Rating.Again,
  Rating.Hard,
  Rating.Good,
  Rating.Easy
]);
var FUZZ_RANGES = [
  {
    start: 2.5,
    end: 7,
    factor: 0.15
  },
  {
    start: 7,
    end: 20,
    factor: 0.1
  },
  {
    start: 20,
    end: Infinity,
    factor: 0.05
  }
];
function get_fuzz_range(interval, elapsed_days, maximum_interval) {
  let delta = 1;
  for (const range of FUZZ_RANGES) {
    delta += range.factor * Math.max(Math.min(interval, range.end) - range.start, 0);
  }
  interval = Math.min(interval, maximum_interval);
  let min_ivl = Math.max(2, Math.round(interval - delta));
  const max_ivl = Math.min(Math.round(interval + delta), maximum_interval);
  if (interval > elapsed_days) {
    min_ivl = Math.max(min_ivl, elapsed_days + 1);
  }
  min_ivl = Math.min(min_ivl, max_ivl);
  return { min_ivl, max_ivl };
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function roundTo(num, decimals) {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}
function dateDiffInDays(last, cur) {
  const utc1 = Date.UTC(
    last.getUTCFullYear(),
    last.getUTCMonth(),
    last.getUTCDate()
  );
  const utc2 = Date.UTC(
    cur.getUTCFullYear(),
    cur.getUTCMonth(),
    cur.getUTCDate()
  );
  return Math.floor(
    (utc2 - utc1) / 864e5
    /** 1000 * 60 * 60 * 24*/
  );
}
var ConvertStepUnitToMinutes = (step) => {
  const unit = step.slice(-1);
  const value = parseInt(step.slice(0, -1), 10);
  if (Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
    throw new FSRSValidationError(`Invalid step value: ${step}`);
  }
  switch (unit) {
    case "m":
      return value;
    case "h":
      return value * 60;
    case "d":
      return value * 1440;
    default:
      throw new FSRSValidationError(
        `Invalid step unit: ${step}, expected m/h/d`
      );
  }
};
var BasicLearningStepsStrategy = (params, state, cur_step) => {
  const learning_steps = state === State.Relearning || state === State.Review ? params.relearning_steps : params.learning_steps;
  const steps_length = learning_steps.length;
  if (steps_length === 0 || cur_step >= steps_length) return {};
  const firstStep = learning_steps[0];
  const toMinutes = ConvertStepUnitToMinutes;
  const getAgainInterval = () => {
    return toMinutes(firstStep);
  };
  const getHardInterval = () => {
    if (steps_length === 1) return Math.round(toMinutes(firstStep) * 1.5);
    const nextStep = learning_steps[1];
    return Math.round((toMinutes(firstStep) + toMinutes(nextStep)) / 2);
  };
  const getStepInfo = (index) => {
    if (index < 0 || index >= steps_length) {
      return null;
    } else {
      return learning_steps[index];
    }
  };
  const getGoodMinutes = (step) => {
    return toMinutes(step);
  };
  const result = {};
  const step_info = getStepInfo(Math.max(0, cur_step));
  if (state === State.Review) {
    result[Rating.Again] = {
      scheduled_minutes: toMinutes(step_info),
      next_step: 0
    };
    return result;
  } else {
    result[Rating.Again] = {
      scheduled_minutes: getAgainInterval(),
      next_step: 0
    };
    result[Rating.Hard] = {
      scheduled_minutes: getHardInterval(),
      next_step: cur_step
    };
    const next_info = getStepInfo(cur_step + 1);
    if (next_info) {
      const nextMin = getGoodMinutes(next_info);
      if (nextMin) {
        result[Rating.Good] = {
          scheduled_minutes: Math.round(nextMin),
          next_step: cur_step + 1
        };
      }
    }
  }
  return result;
};
function DefaultInitSeedStrategy() {
  const time = this.review_time.getTime();
  const reps = this.current.reps;
  const mul = this.current.difficulty * this.current.stability;
  return `${time}_${reps}_${mul}`;
}
var StrategyMode = /* @__PURE__ */ ((StrategyMode2) => {
  StrategyMode2["SCHEDULER"] = "Scheduler";
  StrategyMode2["LEARNING_STEPS"] = "LearningSteps";
  StrategyMode2["SEED"] = "Seed";
  return StrategyMode2;
})(StrategyMode || {});
var AbstractScheduler = class {
  last;
  current;
  review_time;
  next = /* @__PURE__ */ new Map();
  algorithm;
  strategies;
  elapsed_days = 0;
  // init
  constructor(card, now, algorithm, strategies) {
    this.algorithm = algorithm;
    this.last = TypeConvert.card(card);
    this.current = TypeConvert.card(card);
    this.review_time = TypeConvert.time(now);
    this.strategies = strategies;
    this.init();
  }
  checkGrade(grade) {
    if (!Number.isFinite(grade) || grade < 1 || grade > 4) {
      throw new FSRSValidationError(`Invalid grade "${grade}",expected 1-4`);
    }
  }
  init() {
    const { state, last_review } = this.current;
    let interval = 0;
    if (state !== State.New && last_review) {
      interval = dateDiffInDays(last_review, this.review_time);
    }
    this.current.last_review = this.review_time;
    this.elapsed_days = interval;
    this.current.elapsed_days = interval;
    this.current.reps += 1;
    let seed_strategy = DefaultInitSeedStrategy;
    if (this.strategies) {
      const custom_strategy = this.strategies.get(StrategyMode.SEED);
      if (custom_strategy) {
        seed_strategy = custom_strategy;
      }
    }
    this.algorithm.seed = seed_strategy.call(this);
  }
  preview() {
    return {
      [Rating.Again]: this.review(Rating.Again),
      [Rating.Hard]: this.review(Rating.Hard),
      [Rating.Good]: this.review(Rating.Good),
      [Rating.Easy]: this.review(Rating.Easy),
      [Symbol.iterator]: this.previewIterator.bind(this)
    };
  }
  *previewIterator() {
    for (const grade of Grades) {
      yield this.review(grade);
    }
  }
  review(grade) {
    const { state } = this.last;
    let item;
    this.checkGrade(grade);
    switch (state) {
      case State.New:
        item = this.newState(grade);
        break;
      case State.Learning:
      case State.Relearning:
        item = this.learningState(grade);
        break;
      case State.Review:
        item = this.reviewState(grade);
        break;
    }
    return item;
  }
  buildLog(rating) {
    const { last_review, due, elapsed_days } = this.last;
    return {
      rating,
      state: this.current.state,
      due: last_review || due,
      stability: this.current.stability,
      difficulty: this.current.difficulty,
      elapsed_days: this.elapsed_days,
      last_elapsed_days: elapsed_days,
      scheduled_days: this.current.scheduled_days,
      learning_steps: this.current.learning_steps,
      review: this.review_time
    };
  }
};
var Alea = class {
  c;
  s0;
  s1;
  s2;
  constructor(seed) {
    const mash = Mash();
    this.c = 1;
    this.s0 = mash(" ");
    this.s1 = mash(" ");
    this.s2 = mash(" ");
    if (seed == null) seed = Date.now();
    this.s0 -= mash(seed);
    if (this.s0 < 0) this.s0 += 1;
    this.s1 -= mash(seed);
    if (this.s1 < 0) this.s1 += 1;
    this.s2 -= mash(seed);
    if (this.s2 < 0) this.s2 += 1;
  }
  next() {
    const t = 2091639 * this.s0 + this.c * 23283064365386963e-26;
    this.s0 = this.s1;
    this.s1 = this.s2;
    this.c = t | 0;
    this.s2 = t - this.c;
    return this.s2;
  }
  set state(state) {
    this.c = state.c;
    this.s0 = state.s0;
    this.s1 = state.s1;
    this.s2 = state.s2;
  }
  get state() {
    return {
      c: this.c,
      s0: this.s0,
      s1: this.s1,
      s2: this.s2
    };
  }
};
function Mash() {
  let n = 4022871197;
  return function mash(data) {
    data = String(data);
    for (let i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      let h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 4294967296;
    }
    return (n >>> 0) * 23283064365386963e-26;
  };
}
function alea(seed) {
  const xg = new Alea(seed);
  const prng = () => xg.next();
  prng.int32 = () => xg.next() * 4294967296 | 0;
  prng.double = () => prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
  prng.state = () => xg.state;
  prng.importState = (state) => {
    xg.state = state;
    return prng;
  };
  return prng;
}
var version = "5.4.2";
var default_request_retention = 0.9;
var default_maximum_interval = 36500;
var default_enable_fuzz = false;
var default_enable_short_term = true;
var default_learning_steps = Object.freeze([
  "1m",
  "10m"
]);
var default_relearning_steps = Object.freeze([
  "10m"
]);
var FSRSVersion = `v${version} using FSRS-6.0`;
var S_MIN = 1e-3;
var INIT_S_MAX = 100;
var FSRS5_DEFAULT_DECAY = 0.5;
var FSRS6_DEFAULT_DECAY = 0.1542;
var default_w = Object.freeze([
  0.212,
  1.2931,
  2.3065,
  8.2956,
  6.4133,
  0.8334,
  3.0194,
  1e-3,
  1.8722,
  0.1666,
  0.796,
  1.4835,
  0.0614,
  0.2629,
  1.6483,
  0.6014,
  1.8729,
  0.5425,
  0.0912,
  0.0658,
  FSRS6_DEFAULT_DECAY
]);
var W17_W18_Ceiling = 2;
var CLAMP_PARAMETERS = (w17_w18_ceiling, enable_short_term = default_enable_short_term) => [
  [S_MIN, INIT_S_MAX],
  [S_MIN, INIT_S_MAX],
  [S_MIN, INIT_S_MAX],
  [S_MIN, INIT_S_MAX],
  [1, 10],
  [1e-3, 4],
  [1e-3, 4],
  [1e-3, 0.75],
  [0, 4.5],
  [0, 0.8],
  [1e-3, 3.5],
  [1e-3, 5],
  [1e-3, 0.25],
  [1e-3, 0.9],
  [0, 4],
  [0, 1],
  [1, 6],
  [0, w17_w18_ceiling],
  [0, w17_w18_ceiling],
  [
    enable_short_term ? 0.01 : 0,
    0.8
  ],
  [0.1, 0.8]
];
var clipParameters = (parameters, numRelearningSteps, enableShortTerm = default_enable_short_term) => {
  const clip = CLAMP_PARAMETERS(W17_W18_Ceiling, enableShortTerm).slice(
    0,
    parameters.length
  );
  if (Math.max(0, numRelearningSteps) > 1) {
    const w11 = clamp(parameters[11] || 0, clip[11][0], clip[11][1]);
    const w13 = clamp(parameters[13] || 0, clip[13][0], clip[13][1]);
    const w14 = clamp(parameters[14] || 0, clip[14][0], clip[14][1]);
    const value = -(Math.log(w11) + Math.log(Math.pow(2, w13) - 1) + w14 * 0.3) / numRelearningSteps;
    const w17_w18_ceiling = clamp(
      roundTo(Math.sqrt(Math.max(value, 0)), 8),
      0.01,
      W17_W18_Ceiling
    );
    if (clip[17]) clip[17] = [clip[17][0], w17_w18_ceiling];
    if (clip[18]) clip[18] = [clip[18][0], w17_w18_ceiling];
  }
  return clip.map(
    ([min, max], index) => clamp(parameters[index] || 0, min, max)
  );
};
var migrateParameters = (parameters, numRelearningSteps = 0, enableShortTerm = default_enable_short_term) => {
  if (parameters === void 0) {
    return [...default_w];
  }
  switch (parameters.length) {
    case 21:
      return clipParameters(
        Array.from(parameters),
        numRelearningSteps,
        enableShortTerm
      );
    case 19:
      console.debug("[FSRS-6]auto fill w from 19 to 21 length");
      return clipParameters(
        Array.from(parameters),
        numRelearningSteps,
        enableShortTerm
      ).concat([0, FSRS5_DEFAULT_DECAY]);
    case 17: {
      const w = clipParameters(
        Array.from(parameters),
        numRelearningSteps,
        enableShortTerm
      );
      w[4] = +(w[5] * 2 + w[4]).toFixed(8);
      w[5] = +(Math.log(w[5] * 3 + 1) / 3).toFixed(8);
      w[6] = +(w[6] + 0.5).toFixed(8);
      console.debug("[FSRS-6]auto fill w from 17 to 21 length");
      return w.concat([0, 0, 0, FSRS5_DEFAULT_DECAY]);
    }
    default:
      console.warn("[FSRS]Invalid parameters length, using default parameters");
      return [...default_w];
  }
};
var generatorParameters = (props) => {
  const learning_steps = Array.isArray(props?.learning_steps) ? props.learning_steps : default_learning_steps;
  const relearning_steps = Array.isArray(props?.relearning_steps) ? props.relearning_steps : default_relearning_steps;
  const enable_short_term = props?.enable_short_term ?? default_enable_short_term;
  const w = migrateParameters(
    props?.w,
    relearning_steps.length,
    enable_short_term
  );
  return {
    request_retention: props?.request_retention || default_request_retention,
    maximum_interval: props?.maximum_interval || default_maximum_interval,
    w,
    enable_fuzz: props?.enable_fuzz ?? default_enable_fuzz,
    enable_short_term,
    learning_steps,
    relearning_steps
  };
};
function createEmptyCard(now, afterHandler) {
  const emptyCard = {
    due: now ? TypeConvert.time(now) : /* @__PURE__ */ new Date(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    learning_steps: 0,
    state: State.New,
    last_review: void 0
  };
  if (afterHandler && typeof afterHandler === "function") {
    return afterHandler(emptyCard);
  } else {
    return emptyCard;
  }
}
var computeDecayFactor = (decayOrParams) => {
  const decay = typeof decayOrParams === "number" ? -decayOrParams : -decayOrParams[20];
  const factor = Math.exp(Math.pow(decay, -1) * Math.log(0.9)) - 1;
  return { decay, factor: roundTo(factor, 8) };
};
function forgetting_curve(decayOrParams, elapsed_days, stability) {
  const { decay, factor } = computeDecayFactor(decayOrParams);
  return roundTo(Math.pow(1 + factor * elapsed_days / stability, decay), 8);
}
var FSRSAlgorithm = class {
  param;
  intervalModifier;
  _seed;
  constructor(params) {
    this.param = new Proxy(
      this.prepare_parameters(params),
      this.params_handler_proxy()
    );
    this.intervalModifier = this.calculate_interval_modifier(
      this.param.request_retention
    );
    this.forgetting_curve = forgetting_curve.bind(this, this.param.w);
  }
  get interval_modifier() {
    return this.intervalModifier;
  }
  set seed(seed) {
    this._seed = seed;
  }
  /**
   * @see https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm#fsrs-5
   *
   * The formula used is: $$I(r,s) = (r^{\frac{1}{DECAY}} - 1) / FACTOR \times s$$
   * @param request_retention 0<request_retention<=1,Requested retention rate
   * @throws {Error} Requested retention rate should be in the range (0,1]
   */
  calculate_interval_modifier(request_retention) {
    if (request_retention <= 0 || request_retention > 1) {
      throw new FSRSValidationError(
        "Requested retention rate should be in the range (0,1]"
      );
    }
    const { decay, factor } = computeDecayFactor(this.param.w);
    return roundTo((Math.pow(request_retention, 1 / decay) - 1) / factor, 8);
  }
  /**
   * Get the parameters of the algorithm.
   */
  get parameters() {
    return this.param;
  }
  /**
   * Set the parameters of the algorithm.
   * @param params Partial<FSRSParameters>
   */
  set parameters(params) {
    this.update_parameters(params);
  }
  params_handler_proxy() {
    const _this = this;
    return {
      set: function(target, prop, value) {
        if (prop === "request_retention" && Number.isFinite(value)) {
          _this.intervalModifier = _this.calculate_interval_modifier(
            Number(value)
          );
        } else if (prop === "w") {
          value = migrateParameters(
            value,
            target.relearning_steps.length,
            target.enable_short_term
          );
          value = clipParameters(
            Array.from(value),
            target.relearning_steps.length,
            target.enable_short_term
          );
          _this.forgetting_curve = forgetting_curve.bind(this, value);
          _this.intervalModifier = _this.calculate_interval_modifier(
            Number(target.request_retention)
          );
        }
        Reflect.set(target, prop, value);
        return true;
      }
    };
  }
  update_parameters(params) {
    const _params = this.prepare_parameters(params);
    for (const key in _params) {
      const paramKey = key;
      this.param[paramKey] = _params[paramKey];
    }
  }
  prepare_parameters = (params) => {
    const generated = generatorParameters(params);
    generated.w = clipParameters(
      Array.from(generated.w),
      generated.relearning_steps.length,
      generated.enable_short_term
    );
    return generated;
  };
  /**
     * The formula used is :
     * $$ S_0(G) = w_{G-1}$$
     * $$S_0 = \max \lbrace S_0,0.1\rbrace $$

     * @param g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
     * @return Stability (interval when R=90%)
     */
  init_stability(g) {
    return Math.max(this.param.w[g - 1], 0.1);
  }
  /**
   * The formula used is :
   * $$D_0(G) = w_4 - e^{(G-1) \cdot w_5} + 1 $$
   * $$D_0 = \min \lbrace \max \lbrace D_0(G),1 \rbrace,10 \rbrace$$
   * where the $$D_0(1)=w_4$$ when the first rating is good.
   *
   * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
   * @return {number} Difficulty $$D \in [1,10]$$
   */
  init_difficulty(g) {
    const w = this.param.w;
    const d = w[4] - Math.exp((g - 1) * w[5]) + 1;
    return roundTo(d, 8);
  }
  /**
   * If fuzzing is disabled or ivl is less than 2.5, it returns the original interval.
   * @param {number} ivl - The interval to be fuzzed.
   * @param {number} elapsed_days t days since the last review
   * @return {number} - The fuzzed interval.
   **/
  apply_fuzz(ivl, elapsed_days) {
    if (!this.param.enable_fuzz || ivl < 2.5) return Math.round(ivl);
    const generator = alea(this._seed);
    const fuzz_factor = generator();
    const { min_ivl, max_ivl } = get_fuzz_range(
      ivl,
      elapsed_days,
      this.param.maximum_interval
    );
    return Math.floor(fuzz_factor * (max_ivl - min_ivl + 1) + min_ivl);
  }
  /**
   *   @see The formula used is : {@link FSRSAlgorithm.calculate_interval_modifier}
   *   @param {number} s - Stability (interval when R=90%)
   *   @param {number} elapsed_days t days since the last review
   */
  next_interval(s, elapsed_days) {
    const newInterval = Math.min(
      Math.max(1, Math.round(s * this.intervalModifier)),
      this.param.maximum_interval
    );
    return this.apply_fuzz(newInterval, elapsed_days);
  }
  /**
   * @see https://github.com/open-spaced-repetition/fsrs4anki/issues/697
   */
  linear_damping(delta_d, old_d) {
    return roundTo(delta_d * (10 - old_d) / 9, 8);
  }
  /**
   * The formula used is :
   * $$\text{delta}_d = -w_6 \cdot (g - 3)$$
   * $$\text{next}_d = D + \text{linear damping}(\text{delta}_d , D)$$
   * $$D^\prime(D,R) = w_7 \cdot D_0(4) +(1 - w_7) \cdot \text{next}_d$$
   * @param {number} d Difficulty $$D \in [1,10]$$
   * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
   * @return {number} $$\text{next}_D$$
   */
  next_difficulty(d, g) {
    const delta_d = -this.param.w[6] * (g - 3);
    const next_d = d + this.linear_damping(delta_d, d);
    return clamp(
      this.mean_reversion(this.init_difficulty(Rating.Easy), next_d),
      1,
      10
    );
  }
  /**
   * The formula used is :
   * $$w_7 \cdot \text{init} +(1 - w_7) \cdot \text{current}$$
   * @param {number} init $$w_2 : D_0(3) = w_2 + (R-2) \cdot w_3= w_2$$
   * @param {number} current $$D - w_6 \cdot (R - 2)$$
   * @return {number} difficulty
   */
  mean_reversion(init, current) {
    const w = this.param.w;
    return roundTo(w[7] * init + (1 - w[7]) * current, 8);
  }
  /**
   * The formula used is :
   * $$S^\prime_r(D,S,R,G) = S\cdot(e^{w_8}\cdot (11-D)\cdot S^{-w_9}\cdot(e^{w_{10}\cdot(1-R)}-1)\cdot w_{15}(\text{if} G=2) \cdot w_{16}(\text{if} G=4)+1)$$
   * @param {number} d Difficulty D \in [1,10]
   * @param {number} s Stability (interval when R=90%)
   * @param {number} r Retrievability (probability of recall)
   * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
   * @return {number} S^\prime_r new stability after recall
   */
  next_recall_stability(d, s, r, g) {
    const w = this.param.w;
    const hard_penalty = Rating.Hard === g ? w[15] : 1;
    const easy_bound = Rating.Easy === g ? w[16] : 1;
    return roundTo(
      clamp(
        s * (1 + Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp((1 - r) * w[10]) - 1) * hard_penalty * easy_bound),
        S_MIN,
        36500
      ),
      8
    );
  }
  /**
   * The formula used is :
   * $$S^\prime_f(D,S,R) = w_{11}\cdot D^{-w_{12}}\cdot ((S+1)^{w_{13}}-1) \cdot e^{w_{14}\cdot(1-R)}$$
   * enable_short_term = true : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, \frac{S}{e^{w_{17} \cdot w_{18}}} \rbrace$$
   * enable_short_term = false : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, S \rbrace$$
   * @param {number} d Difficulty D \in [1,10]
   * @param {number} s Stability (interval when R=90%)
   * @param {number} r Retrievability (probability of recall)
   * @return {number} S^\prime_f new stability after forgetting
   */
  next_forget_stability(d, s, r) {
    const w = this.param.w;
    return roundTo(
      clamp(
        w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp((1 - r) * w[14]),
        S_MIN,
        36500
      ),
      8
    );
  }
  /**
   * The formula used is :
   * $$S^\prime_s(S,G) = S \cdot e^{w_{17} \cdot (G-3+w_{18})}$$
   * @param {number} s Stability (interval when R=90%)
   * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
   */
  next_short_term_stability(s, g) {
    const w = this.param.w;
    const sinc = Math.pow(s, -w[19]) * Math.exp(w[17] * (g - 3 + w[18]));
    const maskedSinc = g >= Rating.Hard ? Math.max(sinc, 1) : sinc;
    return roundTo(clamp(s * maskedSinc, S_MIN, 36500), 8);
  }
  /**
   * The formula used is :
   * $$R(t,S) = (1 + \text{FACTOR} \times \frac{t}{9 \cdot S})^{\text{DECAY}}$$
   * @param {number} elapsed_days t days since the last review
   * @param {number} stability Stability (interval when R=90%)
   * @return {number} r Retrievability (probability of recall)
   */
  forgetting_curve;
  /**
   * Calculates the next state of memory based on the current state, time elapsed, and grade.
   *
   * @param memory_state - The current state of memory, which can be null.
   * @param t - The time elapsed since the last review.
   * @param {Rating} g Grade (Rating[0.Manual,1.Again,2.Hard,3.Good,4.Easy])
   * @param r - Optional retrievability value. If not provided, it will be calculated.
   * @returns The next state of memory with updated difficulty and stability.
   */
  next_state(memory_state, t, g, r) {
    const { difficulty: d, stability: s } = memory_state ?? {
      difficulty: 0,
      stability: 0
    };
    if (t < 0) {
      throw new FSRSValidationError(`Invalid delta_t "${t}"`);
    }
    if (g < 0 || g > 4) {
      throw new FSRSValidationError(`Invalid grade "${g}"`);
    }
    if (d === 0 && s === 0) {
      return {
        difficulty: clamp(this.init_difficulty(g), 1, 10),
        stability: this.init_stability(g)
      };
    }
    if (g === 0) {
      return {
        difficulty: d,
        stability: s
      };
    }
    if (d < 1 || s < S_MIN) {
      throw new FSRSValidationError(
        `Invalid memory state { difficulty: ${d}, stability: ${s} }`
      );
    }
    const w = this.param.w;
    r = typeof r === "number" ? r : this.forgetting_curve(t, s);
    let new_s;
    if (t === 0 && this.param.enable_short_term) {
      new_s = this.next_short_term_stability(s, g);
    } else if (g === 1) {
      const s_after_fail = this.next_forget_stability(d, s, r);
      let [w_17, w_18] = [0, 0];
      if (this.param.enable_short_term) {
        w_17 = w[17];
        w_18 = w[18];
      }
      const next_s_min = s / Math.exp(w_17 * w_18);
      new_s = clamp(roundTo(next_s_min, 8), S_MIN, s_after_fail);
    } else {
      new_s = this.next_recall_stability(d, s, r, g);
    }
    const new_d = this.next_difficulty(d, g);
    return { difficulty: new_d, stability: new_s };
  }
};
var BasicScheduler = class extends AbstractScheduler {
  learningStepsStrategy;
  constructor(card, now, algorithm, strategies) {
    super(card, now, algorithm, strategies);
    let learningStepStrategy = BasicLearningStepsStrategy;
    if (this.strategies) {
      const custom_strategy = this.strategies.get(StrategyMode.LEARNING_STEPS);
      if (custom_strategy) {
        learningStepStrategy = custom_strategy;
      }
    }
    this.learningStepsStrategy = learningStepStrategy;
  }
  getLearningInfo(card, grade) {
    const parameters = this.algorithm.parameters;
    card.learning_steps = card.learning_steps || 0;
    const steps_strategy = this.learningStepsStrategy(
      parameters,
      card.state,
      card.learning_steps
    );
    const scheduled_minutes = Math.max(
      0,
      steps_strategy[grade]?.scheduled_minutes ?? 0
    );
    const next_steps = Math.max(0, steps_strategy[grade]?.next_step ?? 0);
    return {
      scheduled_minutes,
      next_steps
    };
  }
  /**
   * @description This function applies the learning steps based on the current card's state and grade.
   */
  applyLearningSteps(nextCard, grade, to_state) {
    const { scheduled_minutes, next_steps } = this.getLearningInfo(
      this.current,
      grade
    );
    if (scheduled_minutes > 0 && scheduled_minutes < 1440) {
      nextCard.learning_steps = next_steps;
      nextCard.scheduled_days = 0;
      nextCard.state = to_state;
      nextCard.due = date_scheduler(
        this.review_time,
        Math.round(scheduled_minutes),
        false
        /** true:days false: minute */
      );
    } else {
      nextCard.state = State.Review;
      if (scheduled_minutes >= 1440) {
        nextCard.learning_steps = next_steps;
        nextCard.due = date_scheduler(
          this.review_time,
          Math.round(scheduled_minutes),
          false
          /** true:days false: minute */
        );
        nextCard.scheduled_days = Math.floor(scheduled_minutes / 1440);
      } else {
        nextCard.learning_steps = 0;
        const interval = this.algorithm.next_interval(
          nextCard.stability,
          this.elapsed_days
        );
        nextCard.scheduled_days = interval;
        nextCard.due = date_scheduler(this.review_time, interval, true);
      }
    }
  }
  newState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    const next = this.next_ds(this.elapsed_days, grade);
    this.applyLearningSteps(next, grade, State.Learning);
    const item = {
      card: next,
      log: this.buildLog(grade)
    };
    this.next.set(grade, item);
    return item;
  }
  learningState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    const next = this.next_ds(this.elapsed_days, grade);
    this.applyLearningSteps(
      next,
      grade,
      this.last.state
      /** Learning or Relearning */
    );
    const item = {
      card: next,
      log: this.buildLog(grade)
    };
    this.next.set(grade, item);
    return item;
  }
  reviewState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    const interval = this.elapsed_days;
    const retrievability2 = this.algorithm.forgetting_curve(
      interval,
      this.current.stability
    );
    const next_again = this.next_ds(interval, Rating.Again, retrievability2);
    const next_hard = this.next_ds(interval, Rating.Hard, retrievability2);
    const next_good = this.next_ds(interval, Rating.Good, retrievability2);
    const next_easy = this.next_ds(interval, Rating.Easy, retrievability2);
    this.next_interval(next_hard, next_good, next_easy, interval);
    this.next_state(next_hard, next_good, next_easy);
    this.applyLearningSteps(next_again, Rating.Again, State.Relearning);
    next_again.lapses += 1;
    const item_again = {
      card: next_again,
      log: this.buildLog(Rating.Again)
    };
    const item_hard = {
      card: next_hard,
      log: super.buildLog(Rating.Hard)
    };
    const item_good = {
      card: next_good,
      log: super.buildLog(Rating.Good)
    };
    const item_easy = {
      card: next_easy,
      log: super.buildLog(Rating.Easy)
    };
    this.next.set(Rating.Again, item_again);
    this.next.set(Rating.Hard, item_hard);
    this.next.set(Rating.Good, item_good);
    this.next.set(Rating.Easy, item_easy);
    return this.next.get(grade);
  }
  /**
   * Review next_ds
   */
  next_ds(t, g, r) {
    const next_state = this.algorithm.next_state(
      {
        difficulty: this.current.difficulty,
        stability: this.current.stability
      },
      t,
      g,
      r
    );
    const card = TypeConvert.card(this.current);
    card.difficulty = next_state.difficulty;
    card.stability = next_state.stability;
    return card;
  }
  /**
   * Review next_interval
   */
  next_interval(next_hard, next_good, next_easy, interval) {
    let hard_interval, good_interval;
    hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
    good_interval = this.algorithm.next_interval(next_good.stability, interval);
    hard_interval = Math.min(hard_interval, good_interval);
    good_interval = Math.max(good_interval, hard_interval + 1);
    const easy_interval = Math.max(
      this.algorithm.next_interval(next_easy.stability, interval),
      good_interval + 1
    );
    next_hard.scheduled_days = hard_interval;
    next_hard.due = date_scheduler(this.review_time, hard_interval, true);
    next_good.scheduled_days = good_interval;
    next_good.due = date_scheduler(this.review_time, good_interval, true);
    next_easy.scheduled_days = easy_interval;
    next_easy.due = date_scheduler(this.review_time, easy_interval, true);
  }
  /**
   * Review next_state
   */
  next_state(next_hard, next_good, next_easy) {
    next_hard.state = State.Review;
    next_hard.learning_steps = 0;
    next_good.state = State.Review;
    next_good.learning_steps = 0;
    next_easy.state = State.Review;
    next_easy.learning_steps = 0;
  }
};
var LongTermScheduler = class extends AbstractScheduler {
  newState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    this.current.scheduled_days = 0;
    this.current.elapsed_days = 0;
    const first_interval = 0;
    const next_again = this.next_ds(first_interval, Rating.Again);
    const next_hard = this.next_ds(first_interval, Rating.Hard);
    const next_good = this.next_ds(first_interval, Rating.Good);
    const next_easy = this.next_ds(first_interval, Rating.Easy);
    this.next_interval(
      next_again,
      next_hard,
      next_good,
      next_easy,
      first_interval
    );
    this.next_state(next_again, next_hard, next_good, next_easy);
    this.update_next(next_again, next_hard, next_good, next_easy);
    return this.next.get(grade);
  }
  next_ds(t, g, r) {
    const next_state = this.algorithm.next_state(
      {
        difficulty: this.current.difficulty,
        stability: this.current.stability
      },
      t,
      g,
      r
    );
    const card = TypeConvert.card(this.current);
    card.difficulty = next_state.difficulty;
    card.stability = next_state.stability;
    return card;
  }
  /**
   * @see https://github.com/open-spaced-repetition/ts-fsrs/issues/98#issuecomment-2241923194
   */
  learningState(grade) {
    return this.reviewState(grade);
  }
  reviewState(grade) {
    const exist = this.next.get(grade);
    if (exist) {
      return exist;
    }
    const interval = this.elapsed_days;
    const retrievability2 = this.algorithm.forgetting_curve(
      interval,
      this.current.stability
    );
    const next_again = this.next_ds(interval, Rating.Again, retrievability2);
    const next_hard = this.next_ds(interval, Rating.Hard, retrievability2);
    const next_good = this.next_ds(interval, Rating.Good, retrievability2);
    const next_easy = this.next_ds(interval, Rating.Easy, retrievability2);
    this.next_interval(next_again, next_hard, next_good, next_easy, interval);
    this.next_state(next_again, next_hard, next_good, next_easy);
    next_again.lapses += 1;
    this.update_next(next_again, next_hard, next_good, next_easy);
    return this.next.get(grade);
  }
  /**
   * Review/New next_interval
   */
  next_interval(next_again, next_hard, next_good, next_easy, interval) {
    let again_interval, hard_interval, good_interval, easy_interval;
    again_interval = this.algorithm.next_interval(
      next_again.stability,
      interval
    );
    hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
    good_interval = this.algorithm.next_interval(next_good.stability, interval);
    easy_interval = this.algorithm.next_interval(next_easy.stability, interval);
    again_interval = Math.min(again_interval, hard_interval);
    hard_interval = Math.max(hard_interval, again_interval + 1);
    good_interval = Math.max(good_interval, hard_interval + 1);
    easy_interval = Math.max(easy_interval, good_interval + 1);
    next_again.scheduled_days = again_interval;
    next_again.due = date_scheduler(this.review_time, again_interval, true);
    next_hard.scheduled_days = hard_interval;
    next_hard.due = date_scheduler(this.review_time, hard_interval, true);
    next_good.scheduled_days = good_interval;
    next_good.due = date_scheduler(this.review_time, good_interval, true);
    next_easy.scheduled_days = easy_interval;
    next_easy.due = date_scheduler(this.review_time, easy_interval, true);
  }
  /**
   * Review/New next_state
   */
  next_state(next_again, next_hard, next_good, next_easy) {
    next_again.state = State.Review;
    next_again.learning_steps = 0;
    next_hard.state = State.Review;
    next_hard.learning_steps = 0;
    next_good.state = State.Review;
    next_good.learning_steps = 0;
    next_easy.state = State.Review;
    next_easy.learning_steps = 0;
  }
  update_next(next_again, next_hard, next_good, next_easy) {
    const item_again = {
      card: next_again,
      log: this.buildLog(Rating.Again)
    };
    const item_hard = {
      card: next_hard,
      log: super.buildLog(Rating.Hard)
    };
    const item_good = {
      card: next_good,
      log: super.buildLog(Rating.Good)
    };
    const item_easy = {
      card: next_easy,
      log: super.buildLog(Rating.Easy)
    };
    this.next.set(Rating.Again, item_again);
    this.next.set(Rating.Hard, item_hard);
    this.next.set(Rating.Good, item_good);
    this.next.set(Rating.Easy, item_easy);
  }
};
var Reschedule = class {
  fsrs;
  /**
   * Creates an instance of the `Reschedule` class.
   * @param fsrs - An instance of the FSRS class used for scheduling.
   */
  constructor(fsrs2) {
    this.fsrs = fsrs2;
  }
  /**
   * Replays a review for a card and determines the next review date based on the given rating.
   * @param card - The card being reviewed.
   * @param reviewed - The date the card was reviewed.
   * @param rating - The grade given to the card during the review.
   * @returns A `RecordLogItem` containing the updated card and review log.
   */
  replay(card, reviewed, rating) {
    return this.fsrs.next(card, reviewed, rating);
  }
  /**
   * Processes a manual review for a card, allowing for custom state, stability, difficulty, and due date.
   * @param card - The card being reviewed.
   * @param state - The state of the card after the review.
   * @param reviewed - The date the card was reviewed.
   * @param elapsed_days - The number of days since the last review.
   * @param stability - (Optional) The stability of the card.
   * @param difficulty - (Optional) The difficulty of the card.
   * @param due - (Optional) The due date for the next review.
   * @returns A `RecordLogItem` containing the updated card and review log.
   * @throws Will throw an error if the state or due date is not provided when required.
   */
  handleManualRating(card, state, reviewed, elapsed_days, stability, difficulty, due) {
    if (typeof state === "undefined") {
      throw new FSRSValidationError(
        "reschedule: state is required for manual rating"
      );
    }
    let log;
    let next_card;
    if (state === State.New) {
      log = {
        rating: Rating.Manual,
        state,
        due: due ?? reviewed,
        stability: card.stability,
        difficulty: card.difficulty,
        elapsed_days,
        last_elapsed_days: card.elapsed_days,
        scheduled_days: card.scheduled_days,
        learning_steps: card.learning_steps,
        review: reviewed
      };
      next_card = createEmptyCard(reviewed);
      next_card.last_review = reviewed;
    } else {
      if (typeof due === "undefined") {
        throw new FSRSValidationError(
          "reschedule: due is required for manual rating"
        );
      }
      const scheduled_days = date_diff(due, reviewed, "days");
      log = {
        rating: Rating.Manual,
        state: card.state,
        due: card.last_review || card.due,
        stability: card.stability,
        difficulty: card.difficulty,
        elapsed_days,
        last_elapsed_days: card.elapsed_days,
        scheduled_days: card.scheduled_days,
        learning_steps: card.learning_steps,
        review: reviewed
      };
      next_card = {
        ...card,
        state,
        due,
        last_review: reviewed,
        stability: stability || card.stability,
        difficulty: difficulty || card.difficulty,
        elapsed_days,
        scheduled_days,
        reps: card.reps + 1
      };
    }
    return { card: next_card, log };
  }
  /**
   * Reschedules a card based on its review history.
   *
   * @param current_card - The card to be rescheduled.
   * @param reviews - An array of review history objects.
   * @returns An array of record log items representing the rescheduling process.
   */
  reschedule(current_card, reviews) {
    const collections = [];
    let cur_card = createEmptyCard(current_card.due);
    for (const review of reviews) {
      let item;
      review.review = TypeConvert.time(review.review);
      if (review.rating === Rating.Manual) {
        let interval = 0;
        if (cur_card.state !== State.New && cur_card.last_review) {
          interval = date_diff(review.review, cur_card.last_review, "days");
        }
        item = this.handleManualRating(
          cur_card,
          review.state,
          review.review,
          interval,
          review.stability,
          review.difficulty,
          review.due ? TypeConvert.time(review.due) : void 0
        );
      } else {
        item = this.replay(cur_card, review.review, review.rating);
      }
      collections.push(item);
      cur_card = item.card;
    }
    return collections;
  }
  calculateManualRecord(current_card, now, record_log_item, update_memory) {
    if (!record_log_item) {
      return null;
    }
    const { card: reschedule_card, log } = record_log_item;
    const cur_card = TypeConvert.card(current_card);
    if (cur_card.due.getTime() === reschedule_card.due.getTime()) {
      return null;
    }
    cur_card.scheduled_days = date_diff(
      reschedule_card.due,
      cur_card.due,
      "days"
    );
    return this.handleManualRating(
      cur_card,
      reschedule_card.state,
      TypeConvert.time(now),
      log.elapsed_days,
      update_memory ? reschedule_card.stability : void 0,
      update_memory ? reschedule_card.difficulty : void 0,
      reschedule_card.due
    );
  }
};
function applyAfterHandler(value, afterHandler) {
  return typeof afterHandler === "function" ? afterHandler(value) : value;
}
var FSRS = class extends FSRSAlgorithm {
  strategyHandler = /* @__PURE__ */ new Map();
  Scheduler;
  constructor(param) {
    super(param);
    const { enable_short_term } = this.parameters;
    this.Scheduler = enable_short_term ? BasicScheduler : LongTermScheduler;
  }
  params_handler_proxy() {
    const _this = this;
    return {
      set: function(target, prop, value) {
        if (prop === "request_retention" && Number.isFinite(value)) {
          _this.intervalModifier = _this.calculate_interval_modifier(
            Number(value)
          );
        } else if (prop === "enable_short_term") {
          _this.Scheduler = value === true ? BasicScheduler : LongTermScheduler;
        } else if (prop === "w") {
          value = migrateParameters(
            value,
            target.relearning_steps.length,
            target.enable_short_term
          );
          value = clipParameters(
            Array.from(value),
            target.relearning_steps.length,
            target.enable_short_term
          );
          _this.forgetting_curve = forgetting_curve.bind(this, value);
          _this.intervalModifier = _this.calculate_interval_modifier(
            Number(target.request_retention)
          );
        }
        Reflect.set(target, prop, value);
        return true;
      }
    };
  }
  useStrategy(mode, handler) {
    this.strategyHandler.set(mode, handler);
    return this;
  }
  clearStrategy(mode) {
    if (mode) {
      this.strategyHandler.delete(mode);
    } else {
      this.strategyHandler.clear();
    }
    return this;
  }
  getScheduler(card, now) {
    const schedulerStrategy = this.strategyHandler.get(
      StrategyMode.SCHEDULER
    );
    const Scheduler = schedulerStrategy || this.Scheduler;
    const instance = new Scheduler(card, now, this, this.strategyHandler);
    return instance;
  }
  /**
   * Display the collection of cards and logs for the four scenarios after scheduling the card at the current time.
   * @param card Card to be processed
   * @param now Current time or scheduled time
   * @param afterHandler Convert the result to another type. (Optional)
   * @example
   * ```typescript
   * const card: Card = createEmptyCard(new Date());
   * const f = fsrs();
   * const recordLog = f.repeat(card, new Date());
   * ```
   * @example
   * ```typescript
   * interface RevLogUnchecked
   *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
   *   cid: string;
   *   due: Date | number;
   *   state: StateType;
   *   review: Date | number;
   *   rating: RatingType;
   * }
   *
   * interface RepeatRecordLog {
   *   card: CardUnChecked; //see method: createEmptyCard
   *   log: RevLogUnchecked;
   * }
   *
   * function repeatAfterHandler(recordLog: RecordLog) {
   *     const record: { [key in Grade]: RepeatRecordLog } = {} as {
   *       [key in Grade]: RepeatRecordLog;
   *     };
   *     for (const grade of Grades) {
   *       record[grade] = {
   *         card: {
   *           ...(recordLog[grade].card as Card & { cid: string }),
   *           due: recordLog[grade].card.due.getTime(),
   *           state: State[recordLog[grade].card.state] as StateType,
   *           last_review: recordLog[grade].card.last_review
   *             ? recordLog[grade].card.last_review!.getTime()
   *             : null,
   *         },
   *         log: {
   *           ...recordLog[grade].log,
   *           cid: (recordLog[grade].card as Card & { cid: string }).cid,
   *           due: recordLog[grade].log.due.getTime(),
   *           review: recordLog[grade].log.review.getTime(),
   *           state: State[recordLog[grade].log.state] as StateType,
   *           rating: Rating[recordLog[grade].log.rating] as RatingType,
   *         },
   *       };
   *     }
   *     return record;
   * }
   * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
   * const f = fsrs();
   * const recordLog = f.repeat(card, new Date(), repeatAfterHandler);
   * ```
   */
  repeat(card, now, afterHandler) {
    const instance = this.getScheduler(card, now);
    const recordLog = instance.preview();
    return applyAfterHandler(recordLog, afterHandler);
  }
  /**
   * Display the collection of cards and logs for the card scheduled at the current time, after applying a specific grade rating.
   * @param card Card to be processed
   * @param now Current time or scheduled time
   * @param grade Rating of the review (Again, Hard, Good, Easy)
   * @param afterHandler Convert the result to another type. (Optional)
   * @example
   * ```typescript
   * const card: Card = createEmptyCard(new Date());
   * const f = fsrs();
   * const recordLogItem = f.next(card, new Date(), Rating.Again);
   * ```
   * @example
   * ```typescript
   * interface RevLogUnchecked
   *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
   *   cid: string;
   *   due: Date | number;
   *   state: StateType;
   *   review: Date | number;
   *   rating: RatingType;
   * }
   *
   * interface NextRecordLog {
   *   card: CardUnChecked; //see method: createEmptyCard
   *   log: RevLogUnchecked;
   * }
   *
  function nextAfterHandler(recordLogItem: RecordLogItem) {
    const recordItem = {
      card: {
        ...(recordLogItem.card as Card & { cid: string }),
        due: recordLogItem.card.due.getTime(),
        state: State[recordLogItem.card.state] as StateType,
        last_review: recordLogItem.card.last_review
          ? recordLogItem.card.last_review!.getTime()
          : null,
      },
      log: {
        ...recordLogItem.log,
        cid: (recordLogItem.card as Card & { cid: string }).cid,
        due: recordLogItem.log.due.getTime(),
        review: recordLogItem.log.review.getTime(),
        state: State[recordLogItem.log.state] as StateType,
        rating: Rating[recordLogItem.log.rating] as RatingType,
      },
    };
    return recordItem
  }
   * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
   * const f = fsrs();
   * const recordLogItem = f.repeat(card, new Date(), Rating.Again, nextAfterHandler);
   * ```
   */
  next(card, now, grade, afterHandler) {
    const instance = this.getScheduler(card, now);
    const g = TypeConvert.rating(grade);
    if (g === Rating.Manual) {
      throw new FSRSValidationError("Cannot review a manual rating");
    }
    const recordLogItem = instance.review(g);
    return applyAfterHandler(recordLogItem, afterHandler);
  }
  /**
   * Get the retrievability of the card
   * @param card  Card to be processed
   * @param now  Current time or scheduled time
   * @param format  default:true , Convert the result to another type. (Optional)
   * @returns  The retrievability of the card,if format is true, the result is a string, otherwise it is a number
   */
  get_retrievability(card, now, format = true) {
    const processedCard = TypeConvert.card(card);
    now = now ? TypeConvert.time(now) : /* @__PURE__ */ new Date();
    const t = processedCard.state !== State.New ? Math.max(date_diff(now, processedCard.last_review, "days"), 0) : 0;
    const r = processedCard.state !== State.New ? this.forgetting_curve(t, +processedCard.stability.toFixed(8)) : 0;
    return format ? `${(r * 100).toFixed(2)}%` : r;
  }
  /**
   *
   * @param card Card to be processed
   * @param log last review log
   * @param afterHandler Convert the result to another type. (Optional)
   * @example
   * ```typescript
   * const now = new Date();
   * const f = fsrs();
   * const emptyCardFormAfterHandler = createEmptyCard(now);
   * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now);
   * const { card, log } = repeatFormAfterHandler[Rating.Hard];
   * const rollbackFromAfterHandler = f.rollback(card, log);
   * ```
   *
   * @example
   * ```typescript
   * const now = new Date();
   * const f = fsrs();
   * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler);  //see method: createEmptyCard
   * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
   * const { card, log } = repeatFormAfterHandler[Rating.Hard];
   * const rollbackFromAfterHandler = f.rollback(card, log, cardAfterHandler);
   * ```
   */
  rollback(card, log, afterHandler) {
    const processedCard = TypeConvert.card(card);
    const processedLog = TypeConvert.review_log(log);
    if (processedLog.rating === Rating.Manual) {
      throw new FSRSValidationError("Cannot rollback a manual rating");
    }
    let last_due;
    let last_review;
    let last_lapses;
    switch (processedLog.state) {
      case State.New:
        last_due = processedLog.due;
        last_review = void 0;
        last_lapses = 0;
        break;
      case State.Learning:
      case State.Relearning:
      case State.Review:
        last_due = processedLog.review;
        last_review = processedLog.due;
        last_lapses = processedCard.lapses - (processedLog.rating === Rating.Again && processedLog.state === State.Review ? 1 : 0);
        break;
    }
    const prevCard = {
      ...processedCard,
      due: last_due,
      stability: processedLog.stability,
      difficulty: processedLog.difficulty,
      elapsed_days: processedLog.last_elapsed_days,
      scheduled_days: processedLog.scheduled_days,
      reps: Math.max(0, processedCard.reps - 1),
      lapses: Math.max(0, last_lapses),
      learning_steps: processedLog.learning_steps,
      state: processedLog.state,
      last_review
    };
    return applyAfterHandler(prevCard, afterHandler);
  }
  /**
   *
   * @param card Card to be processed
   * @param now Current time or scheduled time
   * @param reset_count Should the review count information(reps,lapses) be reset. (Optional)
   * @param afterHandler Convert the result to another type. (Optional)
   * @example
   * ```typescript
   * const now = new Date();
   * const f = fsrs();
   * const emptyCard = createEmptyCard(now);
   * const scheduling_cards = f.repeat(emptyCard, now);
   * const { card, log } = scheduling_cards[Rating.Hard];
   * const forgetCard = f.forget(card, new Date(), true);
   * ```
   *
   * @example
   * ```typescript
   * interface RepeatRecordLog {
   *   card: CardUnChecked; //see method: createEmptyCard
   *   log: RevLogUnchecked; //see method: fsrs.repeat()
   * }
   *
   * function forgetAfterHandler(recordLogItem: RecordLogItem): RepeatRecordLog {
   *     return {
   *       card: {
   *         ...(recordLogItem.card as Card & { cid: string }),
   *         due: recordLogItem.card.due.getTime(),
   *         state: State[recordLogItem.card.state] as StateType,
   *         last_review: recordLogItem.card.last_review
   *           ? recordLogItem.card.last_review!.getTime()
   *           : null,
   *       },
   *       log: {
   *         ...recordLogItem.log,
   *         cid: (recordLogItem.card as Card & { cid: string }).cid,
   *         due: recordLogItem.log.due.getTime(),
   *         review: recordLogItem.log.review.getTime(),
   *         state: State[recordLogItem.log.state] as StateType,
   *         rating: Rating[recordLogItem.log.rating] as RatingType,
   *       },
   *     };
   * }
   * const now = new Date();
   * const f = fsrs();
   * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler); //see method:  createEmptyCard
   * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
   * const { card } = repeatFormAfterHandler[Rating.Hard];
   * const forgetFromAfterHandler = f.forget(card, date_scheduler(now, 1, true), false, forgetAfterHandler);
   * ```
   */
  forget(card, now, reset_count = false, afterHandler) {
    const processedCard = TypeConvert.card(card);
    now = TypeConvert.time(now);
    const scheduled_days = processedCard.state === State.New ? 0 : date_diff(now, processedCard.due, "days");
    const forget_log = {
      rating: Rating.Manual,
      state: processedCard.state,
      due: processedCard.due,
      stability: processedCard.stability,
      difficulty: processedCard.difficulty,
      elapsed_days: 0,
      last_elapsed_days: processedCard.elapsed_days,
      scheduled_days,
      learning_steps: processedCard.learning_steps,
      review: now
    };
    const forget_card = {
      ...processedCard,
      due: now,
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: reset_count ? 0 : processedCard.reps,
      lapses: reset_count ? 0 : processedCard.lapses,
      learning_steps: 0,
      state: State.New,
      last_review: processedCard.last_review
    };
    const recordLogItem = { card: forget_card, log: forget_log };
    return applyAfterHandler(recordLogItem, afterHandler);
  }
  /**
   * Reschedules the current card and returns the rescheduled collections and reschedule item.
   *
   * @template T - The type of the record log item.
   * @param {CardInput | Card} current_card - The current card to be rescheduled.
   * @param {Array<FSRSHistory>} reviews - The array of FSRSHistory objects representing the reviews.
   * @param {Partial<RescheduleOptions<T>>} options - The optional reschedule options.
   * @returns {IReschedule<T>} - The rescheduled collections and reschedule item.
   *
   * @example
   * ```typescript
   * const f = fsrs()
   * const grades: Grade[] = [Rating.Good, Rating.Good, Rating.Good, Rating.Good]
   * const reviews_at = [
   *   new Date(2024, 8, 13),
   *   new Date(2024, 8, 13),
   *   new Date(2024, 8, 17),
   *   new Date(2024, 8, 28),
   * ]
   *
   * const reviews: FSRSHistory[] = []
   * for (let i = 0; i < grades.length; i++) {
   *   reviews.push({
   *     rating: grades[i],
   *     review: reviews_at[i],
   *   })
   * }
   *
   * const results_short = scheduler.reschedule(
   *   createEmptyCard(),
   *   reviews,
   *   {
   *     skipManual: false,
   *   }
   * )
   * console.log(results_short)
   * ```
   */
  reschedule(current_card, reviews = [], options = {}) {
    const {
      recordLogHandler,
      reviewsOrderBy,
      skipManual = true,
      now = /* @__PURE__ */ new Date(),
      update_memory_state: updateMemoryState = false
    } = options;
    if (reviewsOrderBy && typeof reviewsOrderBy === "function") {
      reviews.sort(reviewsOrderBy);
    }
    if (skipManual) {
      reviews = reviews.filter((review) => review.rating !== Rating.Manual);
    }
    const rescheduleSvc = new Reschedule(this);
    const collections = rescheduleSvc.reschedule(
      options.first_card || createEmptyCard(),
      reviews
    );
    const len = collections.length;
    const cur_card = TypeConvert.card(current_card);
    const manual_item = rescheduleSvc.calculateManualRecord(
      cur_card,
      now,
      len ? collections[len - 1] : void 0,
      updateMemoryState
    );
    return {
      collections: typeof recordLogHandler === "function" ? collections.map(recordLogHandler) : collections,
      reschedule_item: manual_item ? applyAfterHandler(manual_item, recordLogHandler) : null
    };
  }
};
var fsrs = (params) => {
  return new FSRS(params || {});
};

// src/engine/srs.ts
init_dates();

// src/engine/params.ts
var DESIRED_RETENTION = 0.9;
var S_MASTER = 30;

// src/engine/srs.ts
var RATING_BY_NUM = {
  1: Rating.Again,
  2: Rating.Hard,
  3: Rating.Good,
  4: Rating.Easy
};
async function getScheduler(paths, courseRoot = null) {
  let w;
  if (courseRoot) {
    try {
      const doc = JSON.parse(await readFile5(paths.fsrsParamsPath(courseRoot), "utf8"));
      if (Array.isArray(doc.parameters) && doc.parameters.length) w = doc.parameters;
    } catch {
    }
  }
  return fsrs(generatorParameters({
    request_retention: DESIRED_RETENTION,
    enable_fuzz: false,
    enable_short_term: false,
    ...w ? { w } : {}
  }));
}
function cardFromFm(fm) {
  const fs = fm?.fsrs;
  if (!fs || !fs.reps) return createEmptyCard();
  return {
    due: parseDay(fs.due) ?? /* @__PURE__ */ new Date(),
    stability: fs.stability,
    difficulty: fs.difficulty,
    elapsed_days: 0,
    scheduled_days: 0,
    learning_steps: 0,
    reps: fs.reps,
    lapses: fs.lapses,
    state: State.Review,
    last_review: parseDay(fs.last_review) ?? void 0
  };
}
function fmFromCard(card, fsOld, today) {
  const fs = {
    ...fsOld ?? { reps: 0, lapses: 0 },
    stability: Math.round(card.stability * 100) / 100,
    difficulty: Math.round(card.difficulty * 100) / 100,
    due: fmtDay(card.due),
    last_review: today
  };
  return fs;
}
function retrievability(sched, fm, today) {
  const fs = fm?.fsrs;
  if (!fs || !fs.reps) return 1;
  const now = parseDay(today) ?? /* @__PURE__ */ new Date();
  return sched.get_retrievability(cardFromFm(fm ?? null), now, false);
}
function applyRating(fm, ratingNum, today, sched) {
  const card = cardFromFm(fm);
  const wasReview = Boolean(fm.fsrs?.reps) && (fm.stage === "review" || fm.stage === "mastered");
  const fsOld = fm.fsrs;
  let elapsed = 0;
  if (fsOld?.last_review) {
    const lr = parseDay(fsOld.last_review);
    const t = parseDay(today);
    if (lr && t) elapsed = Math.max(0, daysBetween(t, lr));
  }
  const rating = RATING_BY_NUM[Math.round(ratingNum)] ?? Rating.Good;
  const now = parseDay(today) ?? /* @__PURE__ */ new Date();
  const { card: newCard } = sched.next(card, now, rating);
  const fs = fmFromCard(newCard, fsOld ?? null, today);
  fs.reps = (fsOld?.reps ?? 0) + 1;
  let kind = "learn";
  if (ratingNum === 1 && wasReview) {
    fs.lapses = (fsOld?.lapses ?? 0) + 1;
    kind = "relearn";
  } else if (fsOld?.reps) {
    kind = "review";
  }
  return { fs, meta: { kind, elapsed_days: elapsed } };
}
function stageAfter(newFs, rating, firstLearn) {
  const s = newFs.stability;
  if (firstLearn) return rating >= 3 ? "review" : "learning";
  if (s >= S_MASTER) return "mastered";
  return "review";
}
function masteryValue(fs, practice, ema) {
  if (!fs || !fs.reps) return 0;
  const sComp = Math.min(1, fs.stability / (S_MASTER * 2));
  if (practice.attempts >= 1 && ema && ema > 0) {
    return Math.round((0.7 * sComp + 0.3 * ema) * 100) / 100;
  }
  if (practice.attempts >= 3) {
    const acc = practice.correct / practice.attempts;
    return Math.round((0.7 * sComp + 0.3 * acc) * 100) / 100;
  }
  return Math.round(sComp * 100) / 100;
}

// src/engine/audit.ts
init_notes();

// src/engine/types.ts
var STAGES = ["unseen", "ready", "learning", "review", "mastered"];

// src/engine/audit.ts
init_dates();
async function runAudit(paths, root, courseName, graph, regions) {
  const errors = [];
  const warns = [];
  const infos = [];
  const { names, nset, preOf, depth, reach, hasCycle, blockOf } = graph;
  const name2region = Object.fromEntries(names.map((n) => [n, blockOf[n][1]]));
  const name2block = Object.fromEntries(names.map((n) => [n, blockOf[n][2]]));
  const today = todayStr();
  for (const [n, c] of Object.entries(graph.count)) {
    if (c > 1) errors.push(`E1 \u91CD\u540D\u8282\u70B9: ${n} \u51FA\u73B0 ${c} \u6B21`);
  }
  for (const n of names) {
    for (const p of preOf[n]) {
      if (!nset.has(p)) errors.push(`E2 \u672A\u5B9A\u4E49\u7684\u524D\u7F6E\u5F15\u7528: ${n} -> ${p}`);
    }
  }
  if (hasCycle) errors.push(`E3 \u5B58\u5728\u73AF\uFF01\u6D89\u53CA ${graph.cycleNodes.length} \u4E2A\u8282\u70B9\uFF0C\u4F8B\u5982: ${graph.cycleNodes.slice(0, 5).join("\u3001")}`);
  for (const n of graph.leaves) {
    if (!hasCycle && (depth[n] ?? 0) <= 5) warns.push(`R1 \u6D45\u53F6\u5B50\uFF08depth=${depth[n]}\uFF09: [${name2region[n]}] ${n}`);
  }
  for (const n of names) {
    const ps = preOf[n];
    if (ps.length === 1 && depth[ps[0]] !== void 0 && depth[ps[0]] <= 1 && depth[n] !== void 0 && !graph.succ[n].length) {
      warns.push(`R2 \u5355\u6D45\u524D\u7F6E\u53F6\u5B50: ${n} \u4EC5\u4F9D\u8D56 ${ps[0]}\uFF08depth=${depth[n]}\uFF09`);
    }
  }
  const blockDepths = {};
  for (const n of names) {
    if (depth[n] !== void 0) {
      const key = `${name2region[n]}\uFF5C${name2block[n]}`;
      (blockDepths[key] ??= []).push([depth[n], n]);
    }
  }
  for (const [key, items] of Object.entries(blockDepths)) {
    if (items.length < 3) continue;
    const mean = items.reduce((s, [d]) => s + d, 0) / items.length;
    const [region, block] = key.split("\uFF5C");
    for (const [d, n] of items) {
      const ps = preOf[n];
      const isEntry = !ps.length || ps.every((p) => name2block[p] !== block);
      if (isEntry) continue;
      if (mean > 0 && d < mean / 2) warns.push(`R4 \u6DF1\u5EA6\u5F02\u5E38: [${region} \xB7 ${block}] ${n} depth=${d}\uFF0C\u5757\u5747\u503C=${mean.toFixed(1)}`);
    }
  }
  for (const n of names) {
    for (const p of preOf[n]) {
      if (nset.has(p) && name2region[p] !== name2region[n]) {
        infos.push(`R5 \u8DE8\u533A\u5F15\u7528: [${name2region[n]}] ${n} <- [${name2region[p]}] ${p}`);
      }
    }
  }
  if (!hasCycle) {
    for (const n of names) {
      const ps = preOf[n].filter((p) => nset.has(p));
      for (const p of ps) {
        if (ps.some((q) => q !== p && reach[q]?.has(p))) {
          infos.push(`R6 \u5197\u4F59\u524D\u7F6E: ${n} \u7684 pre \u4E2D ${p} \u53EF\u7ECF\u5176\u5B83\u524D\u7F6E\u4F20\u9012\u5230\u8FBE`);
        }
      }
    }
  }
  if (graph.components.length > 1) {
    for (const members of [...graph.components].sort((a, b) => b.length - a.length)) {
      warns.push(`R8 \u5B64\u7ACB\u8FDE\u901A\u5206\u91CF\uFF08${members.length} \u8282\u70B9\uFF09: ${members.slice(0, 5).join("\u3001")}${members.length > 5 ? "\u2026" : ""}`);
    }
  }
  const uniq = [...nset].sort((a, b) => a.length - b.length);
  const aliasHits = [];
  for (let i = 0; i < uniq.length; i++) {
    if (uniq[i].length < 3) continue;
    for (let j = i + 1; j < uniq.length; j++) {
      if (uniq[i] !== uniq[j] && uniq[j].includes(uniq[i])) aliasHits.push(`${uniq[i]} \u2282 ${uniq[j]}`);
    }
  }
  if (aliasHits.length) infos.push("R9 \u7591\u4F3C\u522B\u540D/\u5305\u542B\u547D\u540D: " + aliasHits.join("\uFF1B"));
  const { found, broken } = await scanAll(paths.courseDir(root));
  const fsErrors = /* @__PURE__ */ new Set();
  for (const p of broken) {
    errors.push(`E4 \u8BFE\u7A0B\u6587\u4EF6 frontmatter \u4E0D\u53EF\u89E3\u6790: ${p.replace(/\\/g, "/").split(`${root}/`)[1] ?? p}`);
  }
  for (const [nodeName, { path, fm: rawFm }] of Object.entries(found).sort()) {
    const rel = path.replace(/\\/g, "/").split(`${root}/`)[1] ?? path;
    if (!nset.has(nodeName)) {
      errors.push(`E4 \u8BFE\u7A0B\u6587\u4EF6\u5BF9\u5E94\u672A\u77E5\u8282\u70B9\uFF08\u6539\u540D\u672A\u540C\u6B65\uFF1F\u7528 rename op\uFF09: ${rel} \u2192 ${nodeName}`);
      continue;
    }
    const canonical = paths.courseNotePath(root, blockOf[nodeName][1], nodeName);
    if (path.replace(/\\/g, "/").toLowerCase() !== canonical.replace(/\\/g, "/").toLowerCase()) {
      warns.push(`R10 \u8BFE\u7A0B\u6587\u4EF6\u4F4D\u7F6E\u975E\u89C4\u8303\uFF08\u5E94\u7528 rename/move op\uFF09: ${rel}`);
    }
    const fm = rawFm;
    const stage = fm.stage;
    if (typeof stage !== "string" || !STAGES.includes(stage)) {
      errors.push(`E5 stage \u975E\u6CD5\uFF08${JSON.stringify(stage)}\uFF09: ${rel}\uFF0C\u5141\u8BB8 ${STAGES.join("/")}`);
    }
    let fs = null;
    if (fm.fsrs !== null && fm.fsrs !== void 0) {
      if (typeof fm.fsrs !== "object") {
        fsErrors.add(`E5 fsrs \u5B57\u6BB5\u7C7B\u578B\u9519\u8BEF: ${rel}`);
      } else {
        fs = fm.fsrs;
      }
    }
    if ((stage === "review" || stage === "mastered") && !fs) {
      fsErrors.add(`E5 stage=${stage} \u4F46 fsrs \u5B57\u6BB5\u7F3A\u5931: ${rel}`);
    }
    if (fs) {
      const s = fs.stability;
      const d = fs.difficulty;
      if (typeof s !== "number" || s <= 0) fsErrors.add(`E5 fsrs.stability \u975E\u6CD5\uFF08${JSON.stringify(s)}\uFF09: ${rel}`);
      if (typeof d !== "number" || !(d >= 1 && d <= 10)) fsErrors.add(`E5 fsrs.difficulty \u975E\u6CD5\uFF08${JSON.stringify(d)}\uFF09: ${rel}`);
      for (const key of ["due", "last_review"]) {
        if (fs[key] !== null && fs[key] !== void 0 && !parseDay(fs[key])) {
          fsErrors.add(`E5 fsrs.${key} \u65E5\u671F\u4E0D\u53EF\u89E3\u6790\uFF08${JSON.stringify(fs[key])}\uFF09: ${rel}`);
        }
      }
      for (const key of ["reps", "lapses"]) {
        if (fs[key] !== null && fs[key] !== void 0 && !Number.isInteger(fs[key])) {
          fsErrors.add(`E5 fsrs.${key} \u5FC5\u987B\u662F\u6574\u6570: ${rel}`);
        }
      }
      const due = parseDay(fs.due);
      if (stage === "review" || stage === "mastered") {
        if (!due) warns.push(`R10 stage=${stage} \u4F46 due \u7F3A\u5931: ${rel}`);
        else {
          const gap = daysBetween(parseDay(today), due);
          if (gap > 14) warns.push(`R10 stage=${stage} \u4E14 due \u8FDC\u8FC7\u671F\uFF08${fmt(due)}\uFF09: ${rel}`);
        }
      }
      const practice = fm.practice ?? {};
      const reps = Number(fs.reps ?? 0);
      if ((stage === "review" || stage === "mastered") && reps > 0 && !practice.attempts) {
        warns.push(`R10 \u5DF2\u590D\u4E60 ${reps} \u6B21\u4F46\u7EC3\u4E60\u4F5C\u7B54\u4E3A 0: ${rel}`);
      }
    }
    const content = fm.content;
    if (content && typeof content === "object" && !["draft", "reviewed", "flagged"].includes(String(content.status))) {
      fsErrors.add(`E5 content.status \u975E\u6CD5\uFF08${JSON.stringify(content.status)}\uFF09: ${rel}`);
    }
  }
  errors.push(...fsErrors);
  for (const n of names) {
    for (const [target] of graph.encOf[n] ?? []) {
      if (!nset.has(target)) errors.push(`E6 enc \u65AD\u8FB9: ${n} -> ${target}`);
      else if (!hasCycle && !graph.isAncestor(target, n)) errors.push(`E7 enc \u975E\u7956\u5148\uFF08\u76EE\u6807\u4E0D\u5728 pre \u4F20\u9012\u95ED\u5305\u5185\uFF09: ${n} -> ${target}`);
    }
  }
  const exempt = names.filter((n) => !found[n]);
  const baseline = {
    \u6982\u5FF5\u8282\u70B9: names.length,
    \u6709\u5411\u8FB9: graph.edgeCount(),
    "enc \u8FB9": Object.values(graph.encOf).reduce((s, v) => s + v.length, 0),
    "\u6839\u8282\u70B9\uFF08\u65E0\u524D\u7F6E\uFF09": graph.roots.length,
    "\u53F6\u5B50\uFF08\u65E0\u540E\u7EE7\uFF09": graph.leaves.length,
    \u6700\u5927\u6DF1\u5EA6: Object.keys(depth).length ? Math.max(...Object.values(depth)) : "-",
    "\u8BFE\u7A0B\u6587\u4EF6\uFF08\u5DF2\u7EB3\u7BA1\uFF09": Object.keys(found).length,
    \u672A\u751F\u6210\u8C41\u514D: exempt.length,
    "ERROR / WARN / INFO": `${errors.length} / ${warns.length} / ${infos.length}`
  };
  const lines = [];
  lines.push(`# ${courseName} \xB7 \u5BA1\u8BA1\u62A5\u544A`, "");
  lines.push("> \u7531 learnhub \u5F15\u64CE\uFF08TS\uFF09\u81EA\u52A8\u751F\u6210\u3002ERROR \u963B\u65AD\u751F\u6210\u4E0E\u7ED3\u7B97\uFF0CWARN \u9700\u4EBA\u5DE5\u88C1\u51B3\uFF0CINFO \u4EC5\u63D0\u793A\u3002", "");
  lines.push("## \u57FA\u7EBF\u6307\u6807", "", "| \u6307\u6807 | \u6570\u503C |", "|---|---|");
  for (const [k, v] of Object.entries(baseline)) lines.push(`| ${k} | ${v} |`);
  lines.push("");
  const section = (title, items) => {
    lines.push(`## ${title}`, "");
    if (items.length) for (const it of items) lines.push(`- ${it}`);
    else lines.push("\uFF08\u65E0\uFF09");
    lines.push("");
  };
  section("ERROR\uFF08\u963B\u65AD\u7EA7\uFF0C\u5FC5\u987B\u4FEE\u590D\uFF09", errors);
  section("WARN\uFF08\u9700\u4EBA\u5DE5\u88C1\u51B3\uFF09", warns);
  lines.push(`## \u672A\u751F\u6210\u8BFE\u7A0B\u6587\u4EF6\u8C41\u514D\u767B\u8BB0\uFF08E4\uFF0C\u5171 ${exempt.length} \u4E2A\uFF1B\u5185\u5BB9\u7BA1\u7EBF\u751F\u6210\u540E\u81EA\u52A8\u9500\u53F7\uFF09`, "");
  if (exempt.length) {
    const byRegion = {};
    for (const n of exempt) (byRegion[name2region[n]] ??= []).push(n);
    for (const region of regions) {
      if (byRegion[region.name]) lines.push(`- [${region.name}] ${byRegion[region.name].length} \u4E2A`);
    }
  } else {
    lines.push("\uFF08\u65E0\uFF09");
  }
  lines.push("");
  section("INFO \xB7 R5/R6/R9 \u63D0\u793A\u9879", infos);
  await Promise.resolve().then(() => (init_store(), store_exports)).then((m) => m.atomicWrite(paths.reportPath(root), lines.join("\n")));
  return { failed: errors.length > 0, errors, warns, infos, baseline, exempt };
}
function fmt(d) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
function effectiveStage(state, n) {
  const fm = state[n];
  if (!fm) return "unseen";
  return STAGES.includes(fm.stage) ? fm.stage : "unseen";
}

// src/engine/analysis.ts
init_dates();
async function analyzeGraph(courseName, graph, state, store) {
  const today = todayStr();
  const t = parseDay(today);
  const unreachable = [];
  if (!graph.hasCycle) {
    const seen = /* @__PURE__ */ new Set();
    const queue = graph.roots.slice();
    while (queue.length) {
      const u = queue.shift();
      if (seen.has(u)) continue;
      seen.add(u);
      for (const v of graph.succ[u]) if (!seen.has(v)) queue.push(v);
    }
    unreachable.push(...graph.names.filter((n) => !seen.has(n)).sort());
  }
  const bottlenecks = graph.names.map((n) => ({ node: n, successors: graph.succ[n].length, unlocks: graph.succ[n].filter((x) => effectiveStage(state, x) === "unseen" || effectiveStage(state, x) === "ready").length })).filter((b) => b.successors >= 3).sort((a, b) => b.unlocks - a.unlocks || b.successors - a.successors).slice(0, 10);
  const lapses = {};
  for (const rec of await store.journalTail(courseName, 500)) {
    if (rec.kind === "relearn" || rec.rating === 1) {
      lapses[rec.node] = (lapses[rec.node] ?? 0) + 1;
    }
  }
  const lapseHotspots = Object.entries(lapses).map(([node, n]) => ({ node, lapses: n })).filter((h) => h.lapses >= 2).sort((a, b) => b.lapses - a.lapses).slice(0, 10);
  const nodes = graph.names.map((n) => ({
    data: {
      id: n,
      region: graph.blockOf[n][1],
      block: graph.blockOf[n][2],
      depth: graph.depth[n] ?? 0,
      stage: effectiveStage(state, n),
      opt: graph.opt.has(n)
    }
  }));
  const edges = [
    ...graph.edges.map(([u, v]) => ({ data: { id: `${u}->${v}`, source: u, target: v, kind: "pre" } })),
    ...Object.entries(graph.encOf).flatMap(([u, list]) => list.map(([v, w]) => ({ data: { id: `${u}~enc~${v}`, source: u, target: v, kind: "enc", w } })))
  ];
  return {
    stats: {
      nodes: graph.names.length,
      edges: graph.edgeCount(),
      enc_edges: Object.values(graph.encOf).reduce((s, v) => s + v.length, 0),
      roots: graph.roots.length,
      leaves: graph.leaves.length,
      max_depth: Object.keys(graph.depth).length ? Math.max(...Object.values(graph.depth)) : 0,
      components: graph.components.length,
      has_cycle: graph.hasCycle
    },
    unreachable,
    bottlenecks,
    lapse_hotspots: lapseHotspots,
    nodes,
    edges
  };
}

// src/engine/content.ts
init_yaml();
init_dates();
init_notes();
import { readFile as readFile6, writeFile as writeFile5, mkdir as mkdir5 } from "node:fs/promises";
import { existsSync as existsSync2 } from "node:fs";

// src/engine/grading.ts
function normAnswer(s) {
  return String(s).trim().replace(/\s+/g, "");
}
function numericOf(s) {
  const t = normAnswer(s);
  if (!t) return null;
  const n = Number(t);
  if (Number.isFinite(n)) return n;
  const frac = t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (frac && Number(frac[2]) !== 0) return Number(frac[1]) / Number(frac[2]);
  const pct = t.match(/^(-?\d+(?:\.\d+)?)%$/);
  if (pct) return Number(pct[1]) / 100;
  return null;
}
function answersEqual(user, expected, tol) {
  const u = normAnswer(user);
  const e = normAnswer(expected);
  if (!u) return false;
  if (u === e) return true;
  if (tol !== void 0) {
    const nu = numericOf(u);
    const ne = numericOf(e);
    if (nu !== null && ne !== null && Math.abs(nu - ne) <= tol) return true;
  }
  if (e.includes(",") || e.includes("\uFF0C")) {
    const us = new Set(u.split(/[,，]/).map(normAnswer).filter(Boolean));
    const es = new Set(e.split(/[,，]/).map(normAnswer).filter(Boolean));
    if (us.size && us.size === es.size && [...us].every((x) => es.has(x))) return true;
  }
  return false;
}
function normChoice(s) {
  let t = normAnswer(s).toUpperCase();
  for (const pre of ["\u9009\u9879", "\u7B54\u6848", "\u9009"]) {
    if (t.startsWith(pre)) t = t.slice(pre.length);
  }
  t = t.replace(/[。．.]+$/, "");
  const m = t.match(/[A-Z]/);
  return m ? m[0] : t;
}
function choiceAnswerOk(user, expected) {
  return Boolean(normAnswer(user)) && normChoice(user) === normChoice(expected);
}
var PASS_SCORE = 0.6;
function evaluateAllo(q, response) {
  let correct = false;
  const explanation = q.explanation || "Try again and retrieve the governing concept before answering.";
  switch (q.kind) {
    case "single_choice":
      correct = typeof response === "string" && normChoice(response) === normChoice(String(q.answer));
      break;
    case "true_false":
      correct = normalizeBool(response) === normalizeBool(q.answer);
      break;
    case "fill_in_blank": {
      const s = typeof response === "string" ? response.trim() : "";
      if (!s) throw new Error("fill_in_blank \u4F5C\u7B54\u4E0D\u80FD\u4E3A\u7A7A");
      correct = Array.isArray(q.answer) && q.answer.some((c) => typeof c === "string" && c.trim().toLowerCase() === s.toLowerCase());
      break;
    }
    case "reflection": {
      const s = typeof response === "string" ? response.trim() : "";
      if (!s) throw new Error("reflection \u4F5C\u7B54\u4E0D\u80FD\u4E3A\u7A7A");
      correct = true;
      break;
    }
  }
  const score = correct ? 1 : 0;
  const feedback = correct ? q.explanation || "" : explanation;
  return { score, feedback, correct };
}
function normalizeBool(v) {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "\u5BF9" || s === "\u6B63\u786E" || s === "\u662F" || s === "\u221A" || s === "t" || s === "yes";
}
var REFLECTION_GRADING_SYSTEM = `You are a strict but encouraging learning coach grading a learner's answer for a course exercise.

Score the answer from 0.0 to 1.0 (0.6 is passing):
- Correctness: does the answer align with the concepts this exercise targets?
- Completeness: does it cover the key points of those concepts?

Reply with ONLY one JSON object matching this shape:
{
  "score": 0.75,
  "feedback": "markdown text"
}
Rules:
- score must be a number between 0.0 and 1.0.
- feedback must be Markdown with two parts: (1) an evaluation of the answer, (2) concrete improvement suggestions.
- Write the feedback in the same language as the learner's answer.
- Output JSON only, without Markdown fences or commentary.`;
function parseReflectionGrading(raw) {
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("unparseable reflection grading reply");
  const doc = JSON.parse(m[0].replace(/,\s*([}\]])/g, "$1"));
  if (typeof doc.score !== "number" || typeof doc.feedback !== "string") {
    throw new Error("reflection grading reply missing score/feedback");
  }
  return { score: Math.min(1, Math.max(0, doc.score)), feedback: doc.feedback };
}
function nextEma(current, score) {
  const prev = current && current > 0 ? current : null;
  const next = prev === null ? score : prev * 0.7 + score * 0.3;
  return Math.round(Math.min(1, Math.max(0, next)) * 1e3) / 1e3;
}
function applyPracticeEvidence(fm, score) {
  const practice = {
    attempts: fm.practice.attempts + 1,
    correct: fm.practice.correct + (score >= PASS_SCORE ? 1 : 0)
  };
  const practice_ema = nextEma(fm.practice_ema, score);
  return { ...fm, practice, practice_ema };
}

// src/engine/content.ts
var QUEUE_GENERATE = "\u751F\u6210";
var QUEUE_REGEN = "\u91CD\u751F\u6210";
var Content = class _Content {
  constructor(paths) {
    this.paths = paths;
  }
  // ---- 生成队列 ----
  async queueLines(root) {
    const p = this.paths.queuePath(root);
    if (!existsSync2(p)) return null;
    return (await readFile6(p, "utf8")).split("\n");
  }
  async queueInit(root) {
    const p = this.paths.queuePath(root);
    if (existsSync2(p)) return;
    await mkdir5(this.paths.courseStateDir(root), { recursive: true });
    await writeFile5(p, "# \u751F\u6210\u961F\u5217\n\n> \u5F85\u751F\u6210/\u5F85\u91CD\u751F\u6210\u6E05\u5355\u3002\u5F15\u64CE\u81EA\u52A8\u7EF4\u62A4\uFF0C\u4EBA\u53EF\u7F16\u8F91\uFF1B\u5B8C\u6210\u6761\u76EE\u6253\u52FE\u5373\u6B62\u3002\n", "utf8");
  }
  /** 入队一条任务；同节点同 kind 未完成条目不重复。 */
  async queueAdd(root, kind, node, reason, priority = "\u4E2D") {
    await this.queueInit(root);
    const lines = await this.queueLines(root);
    for (const ln of lines) {
      if (ln.startsWith("- [ ]") && ln.includes(`${kind}\uFF1A${node}`)) return false;
    }
    lines.push(`- [ ] ${kind}\uFF1A${node} \uFF5C ${reason} \uFF5C \u4F18\u5148\uFF1A${priority}`);
    await writeFile5(this.paths.queuePath(root), lines.join("\n").replace(/\n+$/, "") + "\n", "utf8");
    return true;
  }
  /** 解析生成队列未完成项 → [{kind, node, reason, priority}]。 */
  async queueItems(root) {
    const items = [];
    for (const ln of await this.queueLines(root) ?? []) {
      const m = ln.match(/^- \[ \] (生成|重生成)：(.+?) ｜ (.*?) ｜ 优先：(.+)$/);
      if (m) items.push({ kind: m[1], node: m[2], reason: m[3], priority: m[4] });
    }
    return items;
  }
  /** apply 落盘后勾掉该节点的未完成条目。 */
  async queueDone(root, node) {
    const lines = await this.queueLines(root);
    if (!lines) return false;
    let changed = false;
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^- \[ \] (生成|重生成)：(.+?) ｜/);
      if (m && m[2] === node) {
        lines[i] = "- [x] " + lines[i].slice("- [ ] ".length);
        changed = true;
      }
    }
    if (changed) await writeFile5(this.paths.queuePath(root), lines.join("\n"), "utf8");
    return changed;
  }
  /** T1/T2 触发：返回 (触发类型, 节点) 列表。 */
  async onStageChange(root, graph, state, node, newStage) {
    if (!["learning", "review", "mastered"].includes(newStage)) return [];
    const added = [];
    const done = new Set(Object.entries(state).filter(([, f]) => f.stage === "review" || f.stage === "mastered").map(([n]) => n));
    done.add(node);
    for (const x of graph.succ[node] ?? []) {
      const xs = state[x]?.stage;
      if (xs === "learning" || xs === "review" || xs === "mastered") continue;
      const pres = graph.preOf[x].filter((p) => !graph.opt.has(p));
      const missing = pres.filter((p) => !done.has(p));
      if (!missing.length) {
        if (await this.queueAdd(root, QUEUE_GENERATE, x, `\u89E6\u53D1\uFF1A${node} \u5B8C\u6210\u540E\u89E3\u9501`, "\u9AD8")) added.push(["T2", x]);
      } else if (missing.length === 1 && missing[0] === node) {
        if (await this.queueAdd(root, QUEUE_GENERATE, x, `\u89E6\u53D1\uFF1A${node} \u7684\u6700\u540E\u524D\u7F6E\u8FDB\u5165\u5B66\u4E60`, "\u4E2D")) added.push(["T1", x]);
      }
    }
    return added;
  }
  // ---- 上下文包 ----
  /** 组装生成上下文包 → Markdown 文本。 */
  contextPack(graph, state, node, course) {
    const [, region, block] = graph.blockOf[node];
    const pres = graph.preOf[node];
    const succs = graph.succ[node] ?? [];
    const enc = graph.encOf[node] ?? [];
    const dSelf = graph.depth[node] ?? 0;
    const out = [];
    out.push(`# \u751F\u6210\u4E0A\u4E0B\u6587\u5305\uFF1A${node}`, "");
    out.push("## 1. \u76EE\u6807\u8282\u70B9");
    out.push(`- \u540D\u79F0\uFF1A${node} \uFF5C \u533A/\u5757\uFF1A${region} \xB7 ${block} \uFF5C \u6DF1\u5EA6\uFF1A${dSelf}`);
    out.push(`- pre\uFF1A${pres.length ? pres.join("\u3001") : "\uFF08\u65E0\uFF0C\u6839\u8282\u70B9\uFF09"}`);
    if (graph.noteOf[node]) out.push(`- note\uFF1A${graph.noteOf[node]}`);
    out.push("");
    out.push("## 2. \u524D\u7F6E\u6458\u8981\uFF08\u4E0D\u8981\u91CD\u590D\u8BB2\u5DF2\u6559\u5185\u5BB9\uFF1B\u4E0B\u5217\u7ED3\u8BBA\u53EF\u76F4\u63A5\u5F15\u7528\uFF09");
    for (const p of pres) {
      const fm = state[p];
      if (fm && fm.content.version > 0) {
        out.push(`- **${p}**\uFF08\u5DF2\u751F\u6210\uFF09\uFF1A\u8BB2\u8FC7\uFF08\u8BE6\u89C1\u5176\u8BFE\u7A0B\u6587\u4EF6\uFF09`);
      } else {
        const note = graph.noteOf[p];
        out.push(`- **${p}**\uFF08\u672A\u751F\u6210${note ? `\uFF0Cnote\uFF1A${note}` : ""}\uFF09`);
      }
    }
    out.push("");
    out.push("## 3. \u540E\u7EE7\u9884\u544A\uFF08\u672C\u8BFE\u7ED3\u5C3E\u57CB\u8854\u63A5\u94A9\u5B50\uFF09");
    out.push(succs.length ? succs.join("\u3001") : "\uFF08\u65E0\u540E\u7EE7\uFF0C\u7EC8\u70B9\u8282\u70B9\uFF09");
    out.push("");
    out.push("## 4. \u9886\u57DF\u8FB9\u754C");
    const scope = `\u672C\u8BFE\u5C5E\u4E8E${course ? `\u8BFE\u7A0B\u300C${course}\u300D\u7684` : ""}`;
    out.push(`${scope}\u300C${region} \xB7 ${block}\u300D\u533A\u5757\u3002\u53EA\u8BB2\u672C\u8282\u70B9\u8303\u56F4\u5185\u7684\u5185\u5BB9\uFF1B\u540E\u7EE7\u8282\u70B9\u53EA\u4F5C\u300C\u627F\u4E0A\u542F\u4E0B\u300D\u7684\u4E00\u53E5\u8BDD\u94A9\u5B50\uFF0C\u4E0D\u5C55\u5F00\u3001\u4E0D\u63D0\u524D\u6559\u3002`);
    const forbidden = Object.keys(graph.nset).filter((n) => n !== node && n.length >= 2 && (graph.depth[n] ?? 0) > dSelf).sort((a, b) => (graph.depth[b] ?? 0) - (graph.depth[a] ?? 0)).slice(0, 200);
    out.push("");
    out.push("## 5. \u7981\u6B62\u4F7F\u7528\u7684\u6982\u5FF5\uFF08\u672A\u5B66\uFF0C\u4E0D\u5F97\u51FA\u73B0\u3001\u4E0D\u5F97\u5F15\u7528\u5176\u7ED3\u8BBA\uFF09");
    out.push(forbidden.length ? forbidden.join("\u3001") : "\uFF08\u65E0\uFF1A\u672C\u8282\u70B9\u5DF2\u662F\u56FE\u5185\u6700\u6DF1\uFF09");
    out.push("");
    out.push("## 6. \u89C4\u8303\u7EA6\u675F");
    out.push("- \u522B\u540D\u7EDF\u4E00\u8868\uFF1A\u9E3D\u5DE2\u539F\u7406\uFF08\u975E\u62BD\u5C49\u539F\u7406\uFF09\u3001\u52FE\u80A1\u5B9A\u7406\uFF08\u975E\u6BD5\u8FBE\u54E5\u62C9\u65AF\u5B9A\u7406\uFF09\u3001\u4F59\u5F26\u5B9A\u7406\uFF08\u975E\u963F\u5C14\xB7\u5361\u897F\u5B9A\u7406\uFF09\u2014\u2014\u5B8C\u6574\u8868\u89C1 \u7406\u5FF5\u4E0E\u89C4\u8303.md \xA78");
    out.push("- \u98CE\u683C\uFF1A\u6210\u4EBA\u81EA\u5B66\u8005\uFF1B\u76F4\u89C9\u5148\u4E8E\u4E25\u683C\u3001\u5177\u4F53\u5148\u4E8E\u62BD\u8C61\u3001\u6280\u80FD\u5148\u4E8E\u5F62\u5F0F\u5316");
    out.push("- \u7BC7\u5E45\uFF1A\u6B63\u6587 \u2264 2500 \u5B57\uFF1B\u7EC3\u4E60 \u57FA\u7840 2\u20134 / \u53D8\u5F0F 2\u20133 / \u6311\u6218 0\u20132");
    out.push("- \u6A21\u677F\uFF1A\u4E3A\u4EC0\u4E48\u9700\u8981\u5B83/\u5B9A\u4E49\u4E0E\u6027\u8D28/\u4F8B\u9898/\u7EC3\u4E60/\u5E38\u89C1\u8BEF\u533A/\u627F\u4E0A\u542F\u4E0B/\u5185\u5BB9\u53CD\u9988");
    out.push("");
    out.push("## 7. \u65E2\u6709 enc \u8FB9\uFF08\u7EC3\u4E60\u5FC5\u987B\u771F\u5B9E\u8C03\u7528\u5B83\u4EEC\uFF09");
    out.push(enc.length ? enc.map(([t, w]) => `${t}(w=${w.toFixed(1)})`).join("\u3001") : "\uFF08\u6682\u65E0\uFF09");
    out.push("");
    out.push("## 8. \u4EA4\u4ED8\u8981\u6C42");
    out.push("- \u7EC3\u4E60\u9898\u4EE5\u9898\u7EC4 YAML \u7ECF learnhub_exercises_gen \u5199\u5165\uFF08\u4E0D\u518D\u76F4\u63A5\u5199\u8FDB\u6B63\u6587\u7EC3\u4E60\u533A\uFF09\uFF1B\u6570\u503C\u9898\u7ED9 tol \u5BB9\u5DEE");
    out.push("- \u9898\u578B\u4F18\u5148 single_choice / true_false / fill_in_blank\uFF08\u53EF\u673A\u5668\u5224\u5377\uFF09\uFF1B\u5F00\u653E\u6027\u95EE\u7B54\u9898\u7528 reflection \u5E76\u5728 answer \u5199\u8BC4\u5206\u8981\u70B9");
    out.push("- \u672B\u5C3E\u673A\u5668\u5757\uFF1A`<!-- enc_candidates: [\u672C\u8BFE\u7EC3\u4E60\u771F\u5B9E\u8C03\u7528\u7684\u524D\u7F6E\u6280\u80FD] -->`");
    return out.join("\n") + "\n";
  }
  // ---- 提示词模板 ----
  static PROMPT_KINDS = {
    \u8BFE\u7A0B\u751F\u6210: `# \u8BFE\u7A0B\u751F\u6210\u63D0\u793A\u8BCD\uFF08\u7528\u6237\u53EF\u7F16\u8F91\uFF1B\u751F\u6210\u65F6\u4E0A\u4E0B\u6587\u5305\u81EA\u52A8\u9644\u5728\u672C\u6A21\u677F\u4E4B\u540E\uFF09

\u4F60\u662F learnhub \u5B66\u4E60\u7CFB\u7EDF\u7684\u8BFE\u7A0B\u5199\u624B\u3002\u6839\u636E\u9644\u540E\u7684\u4E0A\u4E0B\u6587\u5305\uFF0C\u4E3A\u300C\u76EE\u6807\u8282\u70B9\u300D\u5199\u4E00\u8282\u8BFE\u7A0B\u7B14\u8BB0\u3002

## \u786C\u7EA6\u675F\uFF08\u8FDD\u53CD\u5373\u8FD4\u5DE5\uFF09

1. \u53EA\u7528\u524D\u7F6E\u5DF2\u6559\u6982\u5FF5\u4E0E\u5E38\u8BC6\uFF1B\u300C\u7981\u6B62\u4F7F\u7528\u7684\u6982\u5FF5\u300D\u4E00\u8282\u5217\u51FA\u7684\u540D\u79F0\u4E0D\u5F97\u51FA\u73B0\uFF0C\u4E5F\u4E0D\u5F97\u5F15\u7528\u5176\u7ED3\u8BBA\u3002
2. \u4E0D\u8D85\u51FA\u300C\u9886\u57DF\u8FB9\u754C\u300D\u58F0\u660E\u7684\u533A\u5757\u8303\u56F4\uFF1B\u540E\u7EE7\u53EA\u5728\u300C\u627F\u4E0A\u542F\u4E0B\u300D\u91CC\u4E00\u53E5\u8BDD\u5E26\u8FC7\u3002
3. \u7BC7\u5E45 \u2264 2500 \u5B57\uFF1B\u5C0F\u8282\u987A\u5E8F\uFF1A\u4E3A\u4EC0\u4E48\u9700\u8981\u5B83 / \u5B9A\u4E49\u4E0E\u6027\u8D28 / \u4F8B\u9898 / \u5E38\u89C1\u8BEF\u533A / \u627F\u4E0A\u542F\u4E0B / \u5185\u5BB9\u53CD\u9988\u3002
4. \u522B\u540D\u6309\u300C\u89C4\u8303\u7EA6\u675F\u300D\u7EDF\u4E00\uFF1B\u56FE\u7247\u7528 \`![[<\u8BFE\u7A0B\u6839>/\u8BFE\u7A0B\u56FE/xx.png]]\`\uFF0C\u793A\u610F\u56FE\u53EF\u7528 \`\`\`mermaid \u4EE3\u7801\u5757\u3002

## \u8F93\u51FA

\u53EA\u8F93\u51FA\u8BFE\u7A0B\u7B14\u8BB0\u6B63\u6587\uFF08\u4E0D\u542B frontmatter\uFF09\uFF0C\u4E0D\u8981\u9644\u52A0\u89E3\u91CA\u3002
`,
    AI\u5224\u5377: `# AI \u5224\u5377\u63D0\u793A\u8BCD\uFF08\u7528\u6237\u53EF\u7F16\u8F91\uFF1B\u9898\u76EE/\u53C2\u8003\u7B54\u6848/\u5B66\u751F\u4F5C\u7B54\u7531\u7CFB\u7EDF\u62FC\u5728\u672C\u6A21\u677F\u4E4B\u540E\uFF09

\u4F60\u662F\u4E25\u683C\u7684\u9605\u5377\u8001\u5E08\u3002\u6839\u636E\u9898\u76EE\u3001\u8BC4\u5206\u8981\u70B9\u4E0E\u5B66\u751F\u4F5C\u7B54\uFF0C\u7ED9\u51FA\u8BC4\u5224\u3002

## \u8BC4\u5206\u6807\u51C6

- \u6838\u5FC3\u7ED3\u8BBA\u6B63\u786E\u4E14\u5173\u952E\u6B65\u9AA4/\u7406\u7531\u5230\u4F4D\uFF1Ascore \u2265 0.8\uFF08\u5224\u5BF9\uFF09\uFF1B
- \u65B9\u5411\u5BF9\u4F46\u6709\u7F3A\u6F0F\u6216\u5C0F\u9519\uFF1Ascore 0.5\u20130.79\uFF08\u534A\u5BF9\uFF09\uFF1B
- \u7ED3\u8BBA\u9519\u8BEF\u6216\u672A\u4F5C\u7B54\u5230\u70B9\uFF1Ascore < 0.5\uFF08\u5224\u9519\uFF09\u3002

## \u8F93\u51FA\u683C\u5F0F\uFF08\u53EA\u8F93\u51FA\u4E00\u4E2A JSON\uFF0C\u4E0D\u8981\u4EFB\u4F55\u5176\u4ED6\u6587\u5B57\uFF09

\`\`\`json
{"score": 0-1\u5C0F\u6570, "verdict": "\u5BF9|\u534A\u5BF9|\u9519", "feedback": "\u9488\u5BF9\u4F5C\u7B54\u7684\u5177\u4F53\u70B9\u8BC4", "suggestions": "\u4E0B\u4E00\u6B65\u600E\u4E48\u6539\u8FDB"}
\`\`\`
`,
    \u9898\u76EE\u751F\u6210: `# \u9898\u76EE\u751F\u6210\u63D0\u793A\u8BCD\uFF08\u7528\u6237\u53EF\u7F16\u8F91\uFF1B\u8282\u70B9\u6B63\u6587\u7531\u7CFB\u7EDF\u9644\u5728\u672C\u6A21\u677F\u4E4B\u540E\uFF09

\u4F60\u662F learnhub \u5B66\u4E60\u7CFB\u7EDF\u7684\u51FA\u9898\u8001\u5E08\u3002\u6839\u636E\u9644\u540E\u7684\u8282\u70B9\u6B63\u6587\u51FA\u4E00\u7EC4\u7EC3\u4E60\u9898\uFF0C\u8986\u76D6\u6B63\u6587\u7684\u6838\u5FC3\u6982\u5FF5\u3001\u6613\u9519\u70B9\u4E0E\u5178\u578B\u5E94\u7528\u3002

## \u786C\u7EA6\u675F

1. \u9898\u578B\u5FC5\u987B\u591A\u6837\u4E14\u53EA\u7528\u8FD9\u4E09\u79CD\uFF1A\u5355\u9009\uFF08single_choice\uFF09\u3001\u5224\u65AD\uFF08true_false\uFF09\u3001\u586B\u7A7A\uFF08fill_in_blank\uFF09\uFF0C\u6BCF\u79CD\u81F3\u5C11\u4E00\u9053\uFF0C\u4E0D\u8981\u5168\u51FA\u540C\u4E00\u9898\u578B\u3002
2. \u96BE\u5EA6\u9012\u8FDB\uFF1A\u5F00\u5934 1-2 \u9053\u6982\u5FF5\u8FA8\u6790\uFF08difficulty: 1\uFF09\uFF0C\u4E2D\u95F4\u5E94\u7528\u4E0E\u8BA1\u7B97\uFF08difficulty: 2\uFF09\uFF0C\u6536\u5C3E 1-2 \u9053\u7EFC\u5408\u6216\u6613\u9519\u9677\u9631\uFF08difficulty: 3\uFF09\u3002
3. \u6BCF\u9898\u5FC5\u987B\u7ED9\u5168\uFF1A\u9898\u5E72\u3001\u7B54\u6848\u3001\u89E3\u6790\uFF08\u8BF4\u660E\u4E3A\u4EC0\u4E48\u5BF9\u3001\u9519\u8BEF\u9009\u9879\u9519\u5728\u54EA\uFF09\u3002
4. \u53EA\u8003\u6B63\u6587\u91CC\u8BB2\u8FC7\u7684\u5185\u5BB9\uFF0C\u4E0D\u5F97\u5F15\u5165\u6B63\u6587\u6CA1\u6709\u7684\u6982\u5FF5\u3001\u8BB0\u53F7\u6216\u7ED3\u8BBA\u3002
5. \u9009\u62E9\u9898 options \u4E0D\u5E26 A./B. \u7F16\u53F7\u524D\u7F00\uFF08\u7CFB\u7EDF\u81EA\u52A8\u7F16\u53F7\uFF09\uFF1B\u586B\u7A7A\u9898 answer \u7528\u6570\u7EC4\u5217\u51FA\u6240\u6709\u53EF\u63A5\u53D7\u5199\u6CD5\uFF1Bnode \u5B57\u6BB5\u539F\u6837\u7167\u6284\u7CFB\u7EDF\u7ED9\u51FA\u7684\u8282\u70B9\u540D\u3002

## \u8F93\u51FA

\u53EA\u8F93\u51FA\u4E00\u4E2A YAML \u6587\u6863\uFF08\u4E0D\u8981\u4EE3\u7801\u56F4\u680F\u3001\u4E0D\u8981\u4EFB\u4F55\u89E3\u91CA\uFF09\uFF0C\u7ED3\u6784\u5982\u4E0B\uFF1A

node: <\u8282\u70B9\u540D>
questions:
  - id: q1
    kind: single_choice
    q: \u9898\u5E72
    options: ["\u9009\u9879\u4E00", "\u9009\u9879\u4E8C", "\u9009\u9879\u4E09", "\u9009\u9879\u56DB"]
    answer: A
    explanation: \u89E3\u6790
    difficulty: 1
    uses: [\u7528\u5230\u7684\u524D\u7F6E\u6982\u5FF5]
`
  };
  /** 读提示词模板；不存在时写入内置默认。 */
  async loadPrompt(kind) {
    const builtin = _Content.PROMPT_KINDS[kind];
    if (!builtin) throw new Error(`[prompt] \u672A\u77E5\u63D0\u793A\u8BCD\u7C7B\u578B: ${kind}\uFF08\u53EF\u9009\uFF1A${Object.keys(_Content.PROMPT_KINDS).join("\u3001")}\uFF09`);
    await mkdir5(this.paths.promptDir, { recursive: true });
    const p = `${this.paths.promptDir}/${kind}.md`;
    if (!existsSync2(p)) await writeFile5(p, builtin, "utf8");
    return readFile6(p, "utf8");
  }
  // ---- 质检门 ----
  /** 解析课程理念与规范.md §8 别名表 → {不采用名: 采用名}。 */
  async aliasTable(root) {
    const p = `${this.paths.courseRoot(root)}/\u7406\u5FF5\u4E0E\u89C4\u8303.md`;
    const table = {};
    if (!existsSync2(p)) return table;
    let inSection = false;
    for (const line of (await readFile6(p, "utf8")).split("\n")) {
      if (line.startsWith("## 8.")) {
        inSection = true;
        continue;
      }
      if (inSection && line.startsWith("## ")) break;
      if (inSection && line.startsWith("|") && !line.includes("\u91C7\u7528\u540D") && !line.includes("---")) {
        const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (cells.length >= 2 && cells[0] && cells[1]) table[cells[1]] = cells[0];
      }
    }
    return table;
  }
  stripRoadmapSections(body) {
    const out = [];
    let skip = false;
    for (const ln of body.split("\n")) {
      if (ln.startsWith("## ")) skip = ln.trim().startsWith("## \u627F\u4E0A\u542F\u4E0B") || ln.trim().startsWith("## \u5185\u5BB9\u53CD\u9988");
      if (!skip) out.push(ln);
    }
    return out.join("\n");
  }
  /** 超纲引用检测：正文提到的图内概念深度大于本节点 → 警告。 */
  checkOutOfScope(graph, node, body) {
    const checked = this.stripRoadmapSections(body);
    const dSelf = graph.depth[node] ?? 0;
    const hits = /* @__PURE__ */ new Set();
    for (const name of graph.nset) {
      if (name === node || name.length < 2) continue;
      if ((graph.depth[name] ?? 0) > dSelf && checked.includes(name)) hits.add(name);
    }
    return [...hits].sort();
  }
  /** 别名一致性：正文出现不采用名 → findings。 */
  async checkAliases(root, body) {
    const table = await this.aliasTable(root);
    return Object.entries(table).filter(([bad]) => body.includes(bad)).map(([bad, good]) => `\u522B\u540D\u4E0D\u4E00\u81F4: \u6B63\u6587\u7528\u4E86\u300C${bad}\u300D\uFF0C\u5E94\u91C7\u7528\u300C${good}\u300D`);
  }
  /** 跑全部可自动化的质检门 → (passed, findings, warns)。 */
  async gateReport(graph, root, node, body) {
    const findings = [];
    const warns = [];
    const oos = this.checkOutOfScope(graph, node, body);
    if (oos.length) warns.push(`\u8D85\u7EB2\u5F15\u7528\uFF08\u5F15\u7528\u4E86\u66F4\u6DF1\u7684\u672A\u5B66\u6982\u5FF5\uFF09: ${oos.join("\u3001")}`);
    findings.push(...await this.checkAliases(root, body));
    const usesMarked = /<!--\s*ex:\d+/.test(body) && /uses:\s*\[[^\]]/.test(body);
    if (!usesMarked) warns.push("\u7EC3\u4E60\u5143\u6570\u636E\u7F3A\u5C11 uses \u6807\u6CE8\uFF08\u4E00\u671F\u5C3D\u529B\u6807\u6CE8\uFF0C\u5EFA\u8BAE\u8865\u4E0A\uFF09");
    return { passed: !findings.length, findings, warns };
  }
  // ---- 练习区 ----
  /** 解析练习元数据行 → [{ex, answer, check, difficulty, uses, options?, tol?}]。 */
  static practiceMeta(body) {
    const out = [];
    for (const m of body.matchAll(/<!--\s*ex:(\d+)\s*\|([^>]*)-->/g)) {
      const fields = { ex: Number(m[1]) };
      for (const part of m[2].split("|")) {
        const p = part.trim();
        const ci = p.indexOf(":");
        if (ci < 0) continue;
        const k = p.slice(0, ci).trim();
        const v = p.slice(ci + 1).trim();
        if (k === "uses") {
          fields.uses = v.replace(/^\[|\]$/g, "").split(",").map((x) => x.trim().replace(/^["']|["']$/g, "").trim()).filter(Boolean);
        } else if (k === "difficulty") {
          fields.difficulty = /^\d+$/.test(v) ? Number(v) : 1;
        } else if (k === "options") {
          fields.options = v.split("\uFF1B").map((x) => x.trim()).filter(Boolean);
        } else if (k === "tol") {
          const n = Number(v);
          if (Number.isFinite(n)) fields.tol = n;
        } else {
          ;
          fields[k] = v;
        }
      }
      out.push(fields);
    }
    return out;
  }
  /** 解析 enc 候选机器块 → [节点名]。 */
  static encCandidates(body) {
    const m = body.match(/<!--\s*enc_candidates:\s*\[([^\]]*)\]\s*-->/);
    return m ? m[1].split(",").map((x) => x.trim()).filter(Boolean) : [];
  }
  /** 题干下方选项行（A. … / A) …）→ ["A. …"]；不足 2 项视为无选项。 */
  extractOptions(text) {
    const opts = [];
    for (const ln of text.split("\n")) {
      const s = ln.trim();
      if (/^[A-Z][.、．)）]/.test(s)) {
        opts.push(s);
        continue;
      }
      if (opts.length) break;
    }
    return opts.length >= 2 ? opts : [];
  }
  /** 练习区容错归一化 → (new_body, changed)。 */
  normalizePractice(body) {
    const m = body.match(/## 练习\s*\n([\s\S]*?)(?=\n## |$)/);
    if (!m) return { body, changed: false };
    const head = m[0].slice(0, m[0].length - m[1].length);
    const sec = m[1];
    const metas = [...sec.matchAll(/<!--\s*ex:\d+\s*\|([^>]*)-->/g)];
    if (!metas.length) return { body, changed: false };
    const out = [];
    let changed = false;
    let prevEnd = 0;
    metas.forEach((mm, i) => {
      out.push(sec.slice(prevEnd, mm.index));
      prevEnd = mm.index + mm[0].length;
      const fields = {};
      const order = [];
      for (const part of mm[1].split("|")) {
        const p = part.trim();
        const ci = p.indexOf(":");
        if (ci < 0) continue;
        const k = p.slice(0, ci).trim();
        if (!(k in fields)) order.push(k);
        fields[k] = p.slice(ci + 1).trim();
      }
      if (fields.check === "choice" && !fields.options) {
        const qEnd = i < metas.length - 1 ? metas[i + 1].index : sec.length;
        const opts = this.extractOptions(sec.slice(prevEnd, qEnd));
        if (opts.length) {
          fields.options = opts.join("\uFF1B");
          if (!order.includes("options")) order.unshift("options");
          changed = true;
        }
      }
      const newLine = `<!-- ex:${i + 1} | ${order.filter((k) => k in fields).map((k) => `${k}: ${fields[k]}`).join(" | ")} -->`;
      if (newLine !== mm[0]) changed = true;
      out.push(newLine);
    });
    if (!changed) return { body, changed: false };
    out.push(sec.slice(prevEnd));
    return { body: body.slice(0, m.index) + head + out.join("") + body.slice(m.index + m[0].length), changed };
  }
  // ---- 反馈与生成落盘 ----
  /** 读课程文件「## 内容反馈」区的用户文字。 */
  async collectFeedback(root, graph, node) {
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(root, regionName, node);
    const { body } = await loadNote(path);
    const m = body.match(/## 内容反馈\s*\n([\s\S]*?)(?=\n## |$)/);
    if (!m) return "";
    return m[1].replace(/<!--[\s\S]*?-->/g, "").replace(/^（[\s\S]*?）$/m, "").trim();
  }
  /** 标记反馈 → flagged + 重生成入队。返回消息或抛错。 */
  async feedback(root, graph, node, noteOf, project) {
    if (!graph.nset.has(node)) throw new Error(`[feedback] \u672A\u77E5\u8282\u70B9: ${node}`);
    const fm = noteOf(node);
    if (!fm) throw new Error(`[feedback] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728: ${node}`);
    const text = await this.collectFeedback(root, graph, node);
    if (!text) throw new Error("[feedback] \u300C\u5185\u5BB9\u53CD\u9988\u300D\u533A\u4E3A\u7A7A\u2014\u2014\u5148\u5199\u4E0B\u95EE\u9898\u4E0E\u5EFA\u8BAE\u518D\u8FD0\u884C\u672C\u547D\u4EE4\u3002");
    const next = { ...fm, content: { ...fm.content, status: "flagged" } };
    await project(node, next);
    const brief = text.split(/\s+/).join(" ").slice(0, 40);
    await this.queueAdd(root, QUEUE_REGEN, node, `\u53CD\u9988\uFF1A${brief}`, `\u7248\u672C\uFF1A${fm.content.version}\u2192${fm.content.version + 1}`);
    return `[feedback] \u5DF2\u6807\u8BB0 flagged \u5E76\u5165\u91CD\u751F\u6210\u961F\u5217\uFF1A${node}\uFF08\u53CD\u9988\uFF1A${brief}\u2026\uFF09`;
  }
  /** 写入生成内容：version+1，status=draft 待人审（frontmatter + journal）。 */
  async applyGeneration(root, graph, node, body, fmOf, journal) {
    const fm = fmOf(node);
    if (!fm) throw new Error(`[apply] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728\uFF08\u5148\u4E3A\u8282\u70B9\u751F\u6210\u5185\u5BB9\u9AA8\u67B6\uFF09: ${node}`);
    const version2 = fm.content.version + 1;
    const next = {
      ...fm,
      content: { version: version2, generated_at: todayStr(), status: "draft" }
    };
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(root, regionName, node);
    await saveNote(path, next, body);
    await journal({ course: "", node, rating: null, kind: "content_apply", elapsed_days: 0, detail: `\u6B63\u6587 v${version2} \u843D\u76D8\uFF08status=draft\uFF09` });
    return version2;
  }
  /** 人审通过 → content.status=reviewed。 */
  async review(root, graph, node, fmOf, project) {
    const fm = fmOf(node);
    if (!fm) throw new Error(`[review] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728: ${node}`);
    const next = { ...fm, content: { ...fm.content, status: "reviewed" } };
    await project(node, next);
    return `[review] ${node} \u2192 reviewed\uFF08v${fm.content.version}\uFF09\u3002`;
  }
  // ---- gen-exercises（题组写入练习区；schema 门禁内联） ----
  /** 题组 schema 校验（ExerciseSet 同构，手写以输出与旧引擎一致的中文错误行）。 */
  static validateExerciseSet(doc) {
    const errors = [];
    if (typeof doc !== "object" || doc === null) return { ok: false, errors: ["(\u9876\u5C42): \u5FC5\u987B\u662F\u6620\u5C04"] };
    const d = doc;
    if (typeof d.node !== "string" || !d.node.trim()) errors.push("node: \u4E0D\u80FD\u4E3A\u7A7A");
    if (d.mode !== void 0 && d.mode !== "replace" && d.mode !== "append") errors.push("mode: \u53EA\u5141\u8BB8 replace/append");
    if (!Array.isArray(d.exercises) || !d.exercises.length) errors.push("exercises: \u9898\u7EC4\u4E3A\u7A7A");
    const exercises = [];
    if (Array.isArray(d.exercises)) {
      d.exercises.forEach((raw, i) => {
        const n = i + 1;
        if (typeof raw !== "object" || raw === null) {
          errors.push(`exercises.${n}: \u5FC5\u987B\u662F\u6620\u5C04`);
          return;
        }
        const e = raw;
        if (typeof e.q !== "string" || !e.q.trim()) errors.push(`exercises.${n}.q: \u4E0D\u80FD\u4E3A\u7A7A`);
        if (typeof e.answer !== "string" || !e.answer.trim()) errors.push(`exercises.${n}.answer: \u4E0D\u80FD\u4E3A\u7A7A`);
        const check = e.check ?? "human";
        if (!["sympy", "choice", "ai", "human", "single_choice", "true_false", "fill_in_blank", "reflection"].includes(String(check))) {
          errors.push(`exercises.${n}.check: \u975E\u6CD5\u7C7B\u578B ${String(check)}`);
        }
        let difficulty = 1;
        if (e.difficulty !== void 0) {
          const dv = Number(e.difficulty);
          if (!Number.isInteger(dv) || dv < 1 || dv > 3) errors.push(`exercises.${n}.difficulty: \u5FC5\u987B\u662F 1-3`);
          else difficulty = dv;
        }
        const uses = Array.isArray(e.uses) ? e.uses.map(String) : [];
        const options = Array.isArray(e.options) ? e.options.map(String) : [];
        let tol;
        if (e.tol !== void 0) {
          const tv = Number(e.tol);
          if (!(tv > 0)) errors.push(`exercises.${n}.tol: \u5FC5\u987B\u662F\u6B63\u6570`);
          else tol = tv;
        }
        exercises.push({ ex: n, q: String(e.q ?? ""), answer: String(e.answer ?? ""), check: String(check), difficulty, uses, options, tol });
      });
    }
    if (errors.length) return { ok: false, errors };
    return {
      ok: true,
      spec: {
        node: d.node.trim(),
        mode: d.mode ?? "replace",
        exercises
      }
    };
  }
  /** 题组过门禁后写入练习区。返回结果对象；门禁失败抛错（错误行已拼入）。 */
  async genExercises(root, graph, node, yamlText, fmOf, journal, expectedNode) {
    const doc = YAML.parse(yamlText);
    const v = _Content.validateExerciseSet(doc);
    if (!v.ok) throw new Error(`[gen-exercises] schema \u6821\u9A8C\u5931\u8D25\uFF0C\u9898\u7EC4\u672A\u5199\u5165\u3002
${v.errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    const spec = v.spec;
    if (expectedNode && expectedNode !== spec.node) {
      throw new Error(`[gen-exercises] \u547D\u4EE4\u884C\u8282\u70B9\u300C${expectedNode}\u300D\u4E0E\u9898\u7EC4\u6587\u4EF6\u5185 node\u300C${spec.node}\u300D\u4E0D\u4E00\u81F4\u3002`);
    }
    if (!graph.nset.has(spec.node)) throw new Error(`[gen-exercises] \u8282\u70B9\u300C${spec.node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    const errors = [];
    spec.exercises.forEach((e, i) => {
      for (const u of e.uses ?? []) {
        if (!graph.nset.has(u)) errors.push(`\u7B2C${i + 1}\u9898 uses \u542B\u56FE\u5916\u8282\u70B9: ${u}`);
      }
      if (e.check === "choice") {
        const letters = (e.options ?? []).map((_, j) => String.fromCharCode(65 + j));
        if (!e.options?.length || !letters.includes(normChoice(e.answer))) {
          errors.push(`\u7B2C${i + 1}\u9898\uFF08choice\uFF09answer \u5FC5\u987B\u662F\u5408\u6CD5\u9009\u9879\u5B57\u6BCD\uFF08\u9009\u9879 ${e.options?.length ?? 0} \u4E2A\uFF09`);
        }
      }
    });
    if (errors.length) throw new Error(`[gen-exercises] \u95E8\u7981\u672A\u8FC7\uFF0C\u9898\u7EC4\u672A\u5199\u5165\uFF08\u4FEE\u6B63\u540E\u91CD\u63D0\uFF09\u3002
${errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    const [, regionName] = graph.blockOf[spec.node];
    const path = this.paths.courseNotePath(root, regionName, spec.node);
    const { fm, body } = await loadNote(path);
    if (!fm) throw new Error(`[gen-exercises] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728\uFF08\u5148 content apply \u6B63\u6587\uFF09: ${spec.node}`);
    let startNo = 1;
    const secMatch = body.match(/## 练习\s*\n([\s\S]*?)(?=\n## |$)/);
    if (spec.mode === "append" && secMatch) startNo = _Content.practiceMeta(secMatch[1]).length + 1;
    const lines = spec.exercises.map((e, i) => this.exerciseMetaLine(startNo + i, e));
    let section = lines.join("\n") + "\n";
    if (spec.mode === "append" && secMatch) section = secMatch[1].replace(/\n+$/, "") + "\n" + section;
    const newBody = this.replaceExerciseSection(body, section);
    await saveNote(path, fm, newBody);
    await journal({
      course: "",
      node: spec.node,
      rating: null,
      kind: "exercises_gen",
      elapsed_days: 0,
      detail: `${spec.mode} \u9898\u7EC4 ${spec.exercises.length} \u9053\uFF08ex${startNo}\u2013ex${startNo + spec.exercises.length - 1}\uFF09`
    });
    return { node: spec.node, mode: spec.mode, count: spec.exercises.length, range: [startNo, startNo + spec.exercises.length - 1], path };
  }
  /** 单题 → 元数据注释行 + 题干行。 */
  exerciseMetaLine(i, e) {
    const parts = [`answer: ${e.answer}`, `check: ${e.check}`, `difficulty: ${e.difficulty ?? 1}`, `uses: [${(e.uses ?? []).join(", ")}]`];
    if (e.check === "choice" && e.options?.length) parts.unshift(`options: ${e.options.join("\uFF1B")}`);
    if (e.check === "sympy" && e.tol) parts.push(`tol: ${e.tol}`);
    return `<!-- ex:${i} | ${parts.join(" | ")} -->
${i}. ${e.q}`;
  }
  /** 正文的「## 练习」区替换（无该区则追加到正文末尾）。 */
  replaceExerciseSection(body, sectionText) {
    const nl = String.fromCharCode(10);
    const m = body.match(/## 练习\s*\n[\s\S]*?(?=\n## |$)/);
    if (m) return body.slice(0, m.index) + "## \u7EC3\u4E60" + nl + sectionText + body.slice(m.index + m[0].length);
    return (body || "").replace(new RegExp(nl + "+$"), "") + nl + nl + "## \u7EC3\u4E60" + nl + sectionText;
  }
  /** 手动插队（T3）。 */
  async queueManual(root, node) {
    const ok = await this.queueAdd(root, QUEUE_GENERATE, node, "\u89E6\u53D1\uFF1A\u624B\u52A8\u63D2\u961F\uFF08T3\uFF09", "\u9AD8");
    return `[queue] ${node}${ok ? " \u5DF2\u5165\u961F" : " \u5DF2\u5728\u961F\u5217\u4E2D"}`;
  }
};

// src/engine/gengraph.ts
init_yaml();
init_store();
import { readFile as readFile7, writeFile as writeFile6, rename as rename2, mkdir as mkdir6, unlink } from "node:fs/promises";
import { existsSync as existsSync3 } from "node:fs";
init_notes();
var EDIT_OPS = ["add_node", "del_node", "set_pre", "rename", "move", "set_note"];
function nonempty(v, what) {
  if (typeof v !== "string" || !v.trim()) throw new Error(`${what} \u4E0D\u80FD\u4E3A\u7A7A`);
  return v.trim();
}
function validateGenProposal(doc) {
  const errors = [];
  const d = doc;
  if (typeof d !== "object" || d === null) return { errors: ["(\u9876\u5C42): \u5FC5\u987B\u662F\u6620\u5C04"] };
  try {
    nonempty(d.course, "course");
  } catch (e) {
    errors.push(e.message);
  }
  if (d.mode !== void 0 && d.mode !== "new" && d.mode !== "append") errors.push("mode: \u53EA\u5141\u8BB8 new/append");
  const regions = [];
  if (!Array.isArray(d.regions) || !d.regions.length) {
    errors.push("regions: \u4E0D\u80FD\u4E3A\u7A7A");
  } else {
    d.regions.forEach((rr, i) => {
      const r = rr;
      const where = `regions.${i}`;
      if (typeof r !== "object" || r === null) {
        errors.push(`${where}: \u5FC5\u987B\u662F\u6620\u5C04`);
        return;
      }
      try {
        nonempty(r.region, `${where}.region`);
      } catch (e) {
        errors.push(e.message);
        return;
      }
      const blocks = [];
      if (!Array.isArray(r.blocks) || !r.blocks.length) {
        errors.push(`${where}.blocks: \u5757[${String(r.region)}] \u6CA1\u6709\u8282\u70B9`);
      } else {
        r.blocks.forEach((br, bi) => {
          const b = br;
          if (typeof b !== "object" || b === null || typeof b.name !== "string" || !b.name.trim()) {
            errors.push(`${where}.blocks.${bi}: \u5757 name \u4E0D\u80FD\u4E3A\u7A7A`);
            return;
          }
          const nodes = Array.isArray(b.nodes) ? b.nodes : [];
          if (!nodes.length) {
            errors.push(`${where}.blocks.${bi}: \u5757[${b.name}] \u6CA1\u6709\u8282\u70B9`);
            return;
          }
          blocks.push({ name: b.name.trim(), nodes });
        });
      }
      regions.push({ region: r.region.trim(), color: typeof r.color === "string" ? r.color : "", blocks });
    });
  }
  if (errors.length) return { errors };
  return { spec: { course: d.course.trim(), mode: d.mode ?? "append", regions } };
}
function validateEditProposal(doc) {
  const errors = [];
  const d = doc;
  if (typeof d !== "object" || d === null) return { errors: ["(\u9876\u5C42): \u5FC5\u987B\u662F\u6620\u5C04"] };
  try {
    nonempty(d.course, "course");
  } catch (e) {
    errors.push(e.message);
  }
  const ops = [];
  if (!Array.isArray(d.ops) || !d.ops.length) {
    errors.push("ops: \u63D0\u6848\u6CA1\u6709\u64CD\u4F5C\u6761\u76EE");
  } else {
    d.ops.forEach((raw, i) => {
      const o = raw;
      const where = `ops.${i}`;
      if (typeof o !== "object" || o === null) {
        errors.push(`${where}: \u5FC5\u987B\u662F\u6620\u5C04`);
        return;
      }
      const op = o.op;
      if (typeof op !== "string" || !EDIT_OPS.includes(op)) {
        errors.push(`${where}.op: \u975E\u6CD5\u64CD\u4F5C ${String(op)}`);
        return;
      }
      if (!(o.node && String(o.node).trim())) errors.push(`${where}: op=${op} \u9700\u8981 node`);
      if (op === "rename" && !(o.new && String(o.new).trim())) errors.push(`${where}: rename \u9700\u8981 new`);
      if ((op === "add_node" || op === "move") && !(o.region && o.block)) errors.push(`${where}: op=${op} \u9700\u8981 region \u4E0E block`);
      ops.push({
        op,
        node: typeof o.node === "string" ? o.node.trim() : void 0,
        new: typeof o.new === "string" ? o.new.trim() : void 0,
        region: typeof o.region === "string" ? o.region.trim() : void 0,
        block: typeof o.block === "string" ? o.block.trim() : void 0,
        pre: Array.isArray(o.pre) ? o.pre.map(String) : [],
        opt: Boolean(o.opt),
        note: typeof o.note === "string" ? o.note : void 0
      });
    });
  }
  if (errors.length) return { errors };
  return { spec: { course: d.course.trim(), reason: typeof d.reason === "string" ? d.reason : "", ops } };
}
var GraphProposals = class {
  constructor(paths, store, registry, centerRoot) {
    this.paths = paths;
    this.store = store;
    this.registry = registry;
    this.centerRoot = centerRoot;
  }
  /** 为图中缺笔记的节点补骨架文件（幂等）：gen/edit apply 落图后调用。
   * 节点存在于图就该有 frontmatter 文件——vault 笔记是调度状态的事实源。 */
  async ensureNotesFor(root, regions) {
    let created = 0;
    for (const r of regions) {
      for (const b of r.blocks) {
        for (const n of b.nodes) {
          const path = this.paths.courseNotePath(root, r.name, n.name);
          if (existsSync3(path)) continue;
          await saveNote(path, defaultFrontmatter(n.name), "> \u5185\u5BB9\u5F85\u751F\u6210\u3002\n");
          created++;
        }
      }
    }
    return created;
  }
  /** 提案产物 YAML 落盘（全留痕）→ artifact 路径。 */
  async saveArtifact(kind, course, doc) {
    const pid = await this.store.createProposal(kind, course, "", "");
    const path = this.paths.proposalArtifactPath(pid, kind, course);
    await mkdir6(this.paths.proposalDir, { recursive: true });
    await writeFile6(path, YAML.stringify(doc), "utf8");
    await this.store.updateProposal(pid, { artifact: path });
    return { pid, path };
  }
  async loadArtifact(path) {
    if (!existsSync3(path)) throw new Error(`[gen] \u6587\u4EF6\u4E0D\u5B58\u5728: ${path}`);
    return YAML.parse(await readFile7(path, "utf8"));
  }
  /** graph propose-gen：校验课程图 YAML → pending 提案。 */
  async proposeGen(yamlText) {
    const v = validateGenProposal(YAML.parse(yamlText));
    if (v.errors) throw new Error(`[propose-gen] schema \u6821\u9A8C\u5931\u8D25\uFF0C\u63D0\u6848\u672A\u53D7\u7406\u3002
${v.errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    const spec = v.spec;
    const course = await this.registry.get(spec.course);
    if (spec.mode === "new" && course) throw new Error(`[propose-gen] mode=new \u4F46\u8BFE\u7A0B\u300C${spec.course}\u300D\u5DF2\u5728\u6CE8\u518C\u8868\uFF08\u6539\u7528 append\uFF09\u3002`);
    if (spec.mode === "append" && !course) throw new Error(`[propose-gen] mode=append \u4F46\u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${spec.course}\u300D\u3002`);
    const newRegions = specToRegions(spec.regions);
    const existing = course ? new Graph(await new GraphStore(this.paths, this.paths.courseRoot(course.root)).load()) : null;
    const errors = structureCheck(existing, newRegions, "\u751F\u6210\u63D0\u6848");
    if (errors.length) throw new Error(`[propose-gen] \u7ED3\u6784\u68C0\u67E5\u5931\u8D25\uFF0C\u63D0\u6848\u672A\u53D7\u7406\uFF08\u4FEE\u6B63\u540E\u91CD\u63D0\uFF09\u3002
${errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    const nodeCount = newRegions.flatMap((r) => r.blocks.flatMap((b) => b.nodes)).length;
    const { pid } = await this.saveArtifact("gen", spec.course, YAML.parse(yamlText));
    await this.store.updateProposal(pid, { summary: `${spec.mode}\uFF1A${spec.regions.length} \u533A / ${nodeCount} \u8282\u70B9` });
    return { id: pid, kind: "gen", course: spec.course, mode: spec.mode, regions: spec.regions.length, nodes: nodeCount };
  }
  /** graph apply-gen：把 pending 生成提案写入 data/*.yaml（audit 门禁在 facade 层跑）。 */
  async applyGen(pid, auditOk = true) {
    if (!auditOk) throw new Error("[apply-gen] \u5BA1\u8BA1\u5B58\u5728 ERROR\uFF0C\u62D2\u7EDD\u5199\u5165\u2014\u2014\u5148\u5904\u7406 \u5BA1\u8BA1\u62A5\u544A.md\u3002");
    const prop = await this.store.takePending("gen", pid);
    const v = validateGenProposal(await this.loadArtifact(prop.artifact));
    if (v.errors || !v.spec) throw new Error(`[apply-gen] \u63D0\u6848\u4EA7\u7269 schema \u5931\u6548\u3002
${(v.errors ?? []).map((e) => `  \u2717 ${e}`).join("\n")}`);
    const spec = v.spec;
    const newRegions = specToRegions(spec.regions);
    let course = await this.registry.get(spec.course);
    if (spec.mode === "new" && !course) course = await this.initCourse(spec.course);
    if (!course) throw new Error(`[apply-gen] \u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${spec.course}\u300D\u3002`);
    const root = course.root;
    const store = new GraphStore(this.paths, this.paths.courseRoot(root));
    const existingFiles = await store.regionFiles();
    const written = [];
    for (const region of newRegions) {
      if (region.name in existingFiles) {
        const path = existingFiles[region.name];
        const current = loadRegionDoc(YAML.parse(await readFile7(path, "utf8")), path);
        const byName = new Map(current.blocks.map((b) => [b.name, b]));
        for (const nb of region.blocks) {
          const hit = byName.get(nb.name);
          if (hit) hit.nodes.push(...nb.nodes);
          else current.blocks.push(nb);
        }
        await store.writeRegionDoc(path, current);
      } else {
        const idx = Object.keys(existingFiles).length + written.length;
        const path = `${this.paths.dataDir(root)}/${String(idx).padStart(2, "0")}_${region.name}.yaml`;
        await store.writeRegionDoc(path, region);
      }
      written.push(region.name);
    }
    const regions = await store.load();
    const version2 = await this.store.latestSnapshotVersion(course.name) + 1;
    await this.store.saveSnapshot(course.name, version2, snapshotDoc(store, regions));
    await this.ensureNotesFor(root, regions);
    await this.store.appendJournal({ course: course.name, node: "*", rating: null, kind: "graph_gen", elapsed_days: 0, session: String(prop.id), detail: `\u65B0\u589E\u533A: ${written.join("\u3001")}` });
    await this.store.updateProposal(prop.id, { status: "applied", decided: (/* @__PURE__ */ new Date()).toISOString(), decision_note: `\u5FEB\u7167 v${version2}` });
    return { course: course.name, regions: written, snapshot: version2, nodes: new Graph(regions).names.length };
  }
  /** mode=new：注册表条目 + data/课程/state 脚手架。 */
  async initCourse(name) {
    const items = await this.registry.load();
    const root = name;
    for (const sub of ["data", "\u8BFE\u7A0B", "state"]) {
      await mkdir6(`${this.centerRoot}/${root}/${sub}`, { recursive: true });
    }
    const entry = { id: `${root}-01`, name, root, enabled: true };
    items.push(entry);
    await this.registry.save(items);
    return entry;
  }
  /** graph propose-edit：在内存图上模拟执行 → pending。 */
  async proposeEdit(yamlText) {
    const v = validateEditProposal(YAML.parse(yamlText));
    if (v.errors) throw new Error(`[propose-edit] schema \u6821\u9A8C\u5931\u8D25\uFF0C\u63D0\u6848\u672A\u53D7\u7406\u3002
${v.errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    const spec = v.spec;
    const course = await this.registry.get(spec.course);
    if (!course) throw new Error(`[propose-edit] \u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${spec.course}\u300D\u3002`);
    const regions = await new GraphStore(this.paths, this.paths.courseRoot(course.root)).load();
    const graph = new Graph(regions);
    const errors = simulateOps(regions, graph, spec.ops);
    if (errors.length) throw new Error(`[propose-edit] \u6A21\u62DF\u6267\u884C\u5931\u8D25\uFF0C\u63D0\u6848\u672A\u53D7\u7406\uFF08\u4FEE\u6B63\u540E\u91CD\u63D0\uFF09\u3002
${errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    const { pid } = await this.saveArtifact("edit", spec.course, YAML.parse(yamlText));
    await this.store.updateProposal(pid, { summary: `${spec.ops.length} \u6761\u64CD\u4F5C\uFF1A${spec.ops.map((o) => o.op).join("\u3001")}` });
    return { id: pid, kind: "edit", course: spec.course, ops: spec.ops.length };
  }
  /** graph apply-edit：执行变更 + 改名/移动/删除联动课程笔记 + 快照。 */
  async applyEdit(pid, auditOk = true) {
    if (!auditOk) throw new Error("[apply-edit] \u5BA1\u8BA1\u5B58\u5728 ERROR\uFF0C\u62D2\u7EDD\u5199\u5165\u2014\u2014\u5148\u5904\u7406 \u5BA1\u8BA1\u62A5\u544A.md\u3002");
    const prop = await this.store.takePending("edit", pid);
    const v = validateEditProposal(await this.loadArtifact(prop.artifact));
    if (v.errors || !v.spec) throw new Error(`[apply-edit] \u63D0\u6848\u4EA7\u7269 schema \u5931\u6548\u3002
${(v.errors ?? []).map((e) => `  \u2717 ${e}`).join("\n")}`);
    const spec = v.spec;
    const course = await this.registry.get(spec.course);
    if (!course) throw new Error(`[apply-edit] \u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${spec.course}\u300D\u3002`);
    const root = course.root;
    const store = new GraphStore(this.paths, this.paths.courseRoot(root));
    const regions = await store.load();
    const graph = new Graph(regions);
    const errors = simulateOps(regions, graph, spec.ops);
    if (errors.length) throw new Error("[apply-edit] \u63D0\u6848\u5DF2\u4E0D\u9002\u7528\u5F53\u524D\u56FE\uFF08\u88AB\u62D2\u7EDD\uFF0C\u53EF\u91CD\u63D0\uFF09\u3002");
    const renames = {};
    const moves = [];
    const dels = [];
    for (const op of spec.ops) {
      if (op.op === "rename") renames[op.node] = op.new;
      else if (op.op === "move") moves.push([op.node, op.region, op.block]);
      else if (op.op === "del_node") dels.push(op.node);
    }
    applyOpsToRegions(regions, spec.ops);
    const files = await store.regionFiles();
    for (const region of regions) {
      if (region.name in files) await store.writeRegionDoc(files[region.name], region);
    }
    for (const [oldName, newName] of Object.entries(renames)) await this.relocateNote(root, graph, oldName, newName, void 0);
    for (const [node, regionName] of moves) await this.relocateNote(root, graph, node, void 0, regionName);
    for (const node of dels) await this.archiveNote(root, graph, node, prop.id);
    const regions2 = await store.load();
    const version2 = await this.store.latestSnapshotVersion(course.name) + 1;
    await this.store.saveSnapshot(course.name, version2, snapshotDoc(store, regions2));
    await this.ensureNotesFor(root, regions2);
    await this.store.appendJournal({
      course: course.name,
      node: "*",
      rating: null,
      kind: "graph_edit",
      elapsed_days: 0,
      session: String(prop.id),
      detail: spec.ops.map((o) => `${o.op}(${o.node})`).join("\uFF1B")
    });
    await this.store.updateProposal(prop.id, { status: "applied", decided: (/* @__PURE__ */ new Date()).toISOString(), decision_note: `\u5FEB\u7167 v${version2}` });
    return { course: course.name, ops: spec.ops.length, snapshot: version2, renames, deleted: dels };
  }
  /** 改名/移动联动课程笔记：搬文件 + 更新 fm.node + 题库随迁；无笔记静默跳过。 */
  async relocateNote(root, graph, node, newName, newRegion) {
    if (!graph.blockOf[node]) return;
    const region = graph.blockOf[node][1];
    const oldPath = this.paths.courseNotePath(root, region, node);
    const targetName = newName ?? node;
    const targetRegion = newRegion ?? region;
    if (existsSync3(oldPath)) {
      const { loadNote: loadNote2, saveNote: saveNote2 } = await Promise.resolve().then(() => (init_notes(), notes_exports));
      const { fm, body } = await loadNote2(oldPath);
      const newPath = this.paths.courseNotePath(root, targetRegion, targetName);
      await saveNote2(newPath, { ...fm ?? {}, node: targetName }, body);
      if (oldPath.toLowerCase() !== newPath.toLowerCase()) {
        await unlink(oldPath).catch(async () => {
          await writeFile6(oldPath, "").catch(() => void 0);
        });
      }
    }
    if (newName) {
      const { safeFilename: safeFilename2 } = await Promise.resolve().then(() => (init_paths(), paths_exports));
      const bankDir = this.paths.courseRoot(root);
      const oldBank = `${bankDir}/\u9898\u5E93/${safeFilename2(node)}.yaml`;
      if (existsSync3(oldBank)) {
        await rename2(oldBank, `${bankDir}/\u9898\u5E93/${safeFilename2(targetName)}.yaml`).catch(() => void 0);
      }
    }
  }
  /** del_node：课程笔记与题库移入 state/archive（不丢用户内容）。 */
  async archiveNote(root, graph, node, pid) {
    if (!graph.blockOf[node]) return;
    const region = graph.blockOf[node][1];
    const oldPath = this.paths.courseNotePath(root, region, node);
    const archiveDir = `${this.paths.courseStateDir(root)}/archive`;
    const { safeFilename: safeFilename2 } = await Promise.resolve().then(() => (init_paths(), paths_exports));
    if (existsSync3(oldPath)) {
      await mkdir6(archiveDir, { recursive: true });
      await rename2(oldPath, `${archiveDir}/del-${pid}-${safeFilename2(node)}.md`);
    }
    const oldBank = `${this.paths.courseRoot(root)}/\u9898\u5E93/${safeFilename2(node)}.yaml`;
    if (existsSync3(oldBank)) {
      await mkdir6(archiveDir, { recursive: true });
      await rename2(oldBank, `${archiveDir}/del-${pid}-${safeFilename2(node)}.yaml`);
    }
  }
  /** graph reject。 */
  async reject(pid, note = "") {
    const list = await this.store.loadProposals();
    const prop = list.find((p) => p.id === pid);
    if (!prop || prop.status !== "pending") throw new Error(`[reject] \u63D0\u6848 #${pid} \u4E0D\u5B58\u5728\u6216\u5DF2\u51B3\u3002`);
    await this.store.updateProposal(pid, { status: "rejected", decided: (/* @__PURE__ */ new Date()).toISOString(), decision_note: note });
    return prop;
  }
  /** 提案清单（status/kind 过滤可选）。 */
  async list(status, kind, limit = 100) {
    let list = await this.store.loadProposals();
    if (status) list = list.filter((p) => p.status === status);
    if (kind) list = list.filter((p) => p.kind === kind);
    return list.slice(-limit).reverse();
  }
};
function specToRegions(specRegions) {
  return specRegions.map((r) => ({
    name: r.region,
    color: r.color ?? "",
    blocks: r.blocks.map((b) => ({
      name: b.name,
      nodes: b.nodes.map((n) => parseProposalNode(n))
    }))
  }));
}
function parseProposalNode(raw) {
  const enc = Array.isArray(raw.enc) ? raw.enc.map((e) => typeof e === "string" ? { node: e, w: 1 } : { node: String(e.node), w: Number(e.w ?? 1) }) : [];
  return {
    name: String(raw.name ?? "").trim(),
    pre: Array.isArray(raw.pre) ? raw.pre.map(String) : [],
    opt: Boolean(raw.opt),
    note: typeof raw.note === "string" ? raw.note : "",
    enc
  };
}
function simulateOps(regions, graph, ops) {
  const sim = JSON.parse(JSON.stringify(regions));
  const errors = [];
  const names = new Set(graph.names);
  const renameMap = {};
  const removed = /* @__PURE__ */ new Set();
  const regionOf = (name) => sim.find((r) => r.name === name);
  for (const op of ops) {
    if (op.op === "add_node") {
      if (names.has(op.node)) {
        errors.push(`add_node \u91CD\u540D: ${op.node}`);
        continue;
      }
      const r = regionOf(op.region);
      if (!r) {
        errors.push(`add_node \u533A\u4E0D\u5B58\u5728: ${op.region}`);
        continue;
      }
      let blk = r.blocks.find((b) => b.name === op.block);
      if (!blk) {
        blk = { name: op.block, nodes: [] };
        r.blocks.push(blk);
      }
      blk.nodes.push({ name: op.node, pre: [...op.pre ?? []], opt: Boolean(op.opt), note: op.note ?? "", enc: [] });
      names.add(op.node);
    } else if (op.op === "del_node") {
      if (!names.has(op.node)) {
        errors.push(`del_node \u8282\u70B9\u4E0D\u5B58\u5728: ${op.node}`);
        continue;
      }
      names.delete(op.node);
      removed.add(op.node);
    } else if (op.op === "rename") {
      if (!names.has(op.node)) errors.push(`rename \u65E7\u540D\u4E0D\u5B58\u5728: ${op.node}`);
      else if (names.has(op.new)) errors.push(`rename \u65B0\u540D\u5DF2\u5360\u7528: ${op.new}`);
      else {
        renameMap[op.node] = op.new;
        names.delete(op.node);
        names.add(op.new);
      }
    } else if (op.op === "move") {
      if (!names.has(op.node)) {
        errors.push(`move \u8282\u70B9\u4E0D\u5B58\u5728: ${op.node}`);
        continue;
      }
      if (!regionOf(op.region)) errors.push(`move \u76EE\u6807\u533A\u4E0D\u5B58\u5728: ${op.region}`);
    } else if (op.op === "set_pre") {
      if (!names.has(op.node)) {
        errors.push(`set_pre \u8282\u70B9\u4E0D\u5B58\u5728: ${op.node}`);
        continue;
      }
      for (const r of sim) for (const b of r.blocks) for (const n of b.nodes) {
        if (n.name === op.node) n.pre = [...op.pre ?? []];
      }
    }
  }
  const mapped = (p) => renameMap[p] ?? p;
  for (const r of sim) {
    for (const b of r.blocks) {
      for (const n of b.nodes) {
        if (removed.has(n.name)) continue;
        n.name = mapped(n.name);
        n.pre = n.pre.map(mapped).filter((p) => !removed.has(p));
        n.enc = n.enc.map((e) => ({ ...e, node: mapped(e.node) })).filter((e) => !removed.has(e.node));
      }
      b.nodes = b.nodes.filter((n) => !removed.has(n.name));
    }
  }
  if (!errors.length) {
    const merged = new Graph(sim);
    const dangling = new Set(merged.names.flatMap((n) => merged.preOf[n].filter((p) => !merged.nset.has(p)).map((p) => `${n} -> ${p}`)));
    for (const d of [...dangling].sort()) errors.push(`\u53D8\u66F4\u540E\u65AD\u8FB9: ${d}`);
    if (merged.hasCycle) errors.push(`\u53D8\u66F4\u540E\u5F15\u5165\u73AF\uFF1A${merged.cycleNodes.slice(0, 5).join("\u3001")}`);
  }
  return errors;
}
function applyOpsToRegions(regions, ops) {
  const renameMap = {};
  const removed = /* @__PURE__ */ new Set();
  const regionOf = (name) => regions.find((r) => r.name === name);
  const findNode = (node) => {
    for (const r of regions) for (const b of r.blocks) {
      const n = b.nodes.find((x) => x.name === node);
      if (n) return { r, b, n };
    }
    return null;
  };
  for (const op of ops) {
    if (op.op === "add_node") {
      const r = regionOf(op.region);
      let blk = r.blocks.find((b) => b.name === op.block);
      if (!blk) {
        blk = { name: op.block, nodes: [] };
        r.blocks.push(blk);
      }
      blk.nodes.push({ name: op.node, pre: [...op.pre ?? []], opt: Boolean(op.opt), note: op.note ?? "", enc: [] });
    } else if (op.op === "del_node") {
      removed.add(op.node);
    } else if (op.op === "rename") {
      renameMap[op.node] = op.new;
    } else if (op.op === "move") {
      const hit = findNode(op.node);
      if (!hit) continue;
      hit.b.nodes = hit.b.nodes.filter((n) => n.name !== op.node);
      const dstR = regionOf(op.region);
      let dstBlk = dstR.blocks.find((b) => b.name === op.block);
      if (!dstBlk) {
        dstBlk = { name: op.block, nodes: [] };
        dstR.blocks.push(dstBlk);
      }
      dstBlk.nodes.push(hit.n);
    } else if (op.op === "set_pre") {
      const hit = findNode(op.node);
      if (hit) hit.n.pre = [...op.pre ?? []];
    } else if (op.op === "set_note") {
      const hit = findNode(op.node);
      if (hit) hit.n.note = op.note ?? "";
    }
  }
  const mapped = (p) => renameMap[p] ?? p;
  for (const r of regions) {
    for (const b of r.blocks) {
      for (const n of b.nodes) {
        n.name = mapped(n.name);
        n.pre = n.pre.map(mapped).filter((p) => !removed.has(p));
        n.enc = n.enc.map((e) => ({ ...e, node: mapped(e.node) })).filter((e) => !removed.has(e.node));
      }
      b.nodes = b.nodes.filter((n) => !removed.has(n.name));
    }
    r.blocks = r.blocks.filter((b) => b.nodes.length);
  }
}

// src/engine/question-bank.ts
init_yaml();
import { existsSync as existsSync4 } from "node:fs";
import { mkdir as mkdir7, readFile as readFile8, writeFile as writeFile7 } from "node:fs/promises";
init_paths();
var KINDS = ["single_choice", "true_false", "fill_in_blank", "reflection"];
function validateBank(doc, expectedNode) {
  const errors = [];
  if (typeof doc !== "object" || doc === null) return { errors: ["(\u9876\u5C42): \u5FC5\u987B\u662F\u6620\u5C04"] };
  const d = doc;
  if (typeof d.node !== "string" || !d.node.trim()) errors.push("node: \u4E0D\u80FD\u4E3A\u7A7A");
  if (!Array.isArray(d.questions) || !d.questions.length) errors.push("questions: \u9898\u7EC4\u4E3A\u7A7A");
  const questions = [];
  if (Array.isArray(d.questions)) {
    d.questions.forEach((raw, i) => {
      const n = i + 1;
      if (typeof raw !== "object" || raw === null) {
        errors.push(`questions.${n}: \u5FC5\u987B\u662F\u6620\u5C04`);
        return;
      }
      const e = raw;
      const id = typeof e.id === "string" && e.id.trim() ? e.id.trim() : `q${n}`;
      if (!KINDS.includes(e.kind)) {
        errors.push(`questions.${n}.kind: \u975E\u6CD5\u9898\u578B ${String(e.kind)}\uFF08\u5141\u8BB8 ${KINDS.join("/")}\uFF09`);
        return;
      }
      if (typeof e.q !== "string" || !e.q.trim()) {
        errors.push(`questions.${n}.q: \u9898\u5E72\u4E0D\u80FD\u4E3A\u7A7A`);
        return;
      }
      const kind = e.kind;
      const answer = e.answer;
      if (kind === "single_choice") {
        const options = Array.isArray(e.options) ? e.options.map(String) : [];
        const letters = options.map((_, j) => String.fromCharCode(65 + j));
        if (!options.length || typeof answer !== "string" || !letters.includes(normChoice(answer))) {
          errors.push(`questions.${n}: single_choice \u9700\u8981 options \u4E14 answer \u4E3A\u5408\u6CD5\u9009\u9879\u5B57\u6BCD\uFF08\u9009\u9879 ${options.length} \u4E2A\uFF09`);
          return;
        }
      } else if (kind === "true_false") {
        if (typeof answer !== "boolean" && !["true", "false", "\u5BF9", "\u9519", "\u6B63\u786E", "\u9519\u8BEF", "\u662F", "\u5426"].includes(String(answer))) {
          errors.push(`questions.${n}: true_false \u7684 answer \u5FC5\u987B\u662F\u5E03\u5C14\u6216\u5BF9/\u9519`);
          return;
        }
      } else if (kind === "fill_in_blank") {
        const accepted = Array.isArray(answer) ? answer.map(String) : typeof answer === "string" ? [answer] : [];
        if (!accepted.length) {
          errors.push(`questions.${n}: fill_in_blank \u7684 answer \u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u6216\u5B57\u7B26\u4E32\u5217\u8868\uFF08\u53EF\u63A5\u53D7\u7B54\u6848\uFF09`);
          return;
        }
      } else if (kind === "reflection") {
        if (typeof answer !== "string" || !answer.trim()) {
          errors.push(`questions.${n}: reflection \u7684 answer \u5FC5\u987B\u662F\u8BC4\u5206\u8981\u70B9\u6587\u672C`);
          return;
        }
      }
      questions.push({
        id,
        kind,
        q: String(e.q).trim(),
        answer: Array.isArray(answer) ? answer.map(String) : answer,
        ...Array.isArray(e.options) && e.options.length ? { options: e.options.map(String) } : {},
        ...typeof e.explanation === "string" && e.explanation ? { explanation: e.explanation } : {},
        ...e.difficulty !== void 0 && Number.isInteger(Number(e.difficulty)) ? { difficulty: Number(e.difficulty) } : {},
        ...Array.isArray(e.uses) && e.uses.length ? { uses: e.uses.map(String) } : {},
        ...Array.isArray(e.tags) && e.tags.length ? { tags: e.tags.map(String) } : {},
        ...e.archived === true ? { archived: true } : {}
      });
    });
  }
  if (errors.length) return { errors };
  const spec = { node: d.node.trim(), questions };
  if (expectedNode && spec.node !== expectedNode) {
    return { errors: [`node\u300C${spec.node}\u300D\u4E0E\u547D\u4EE4\u884C\u8282\u70B9\u300C${expectedNode}\u300D\u4E0D\u4E00\u81F4`] };
  }
  return { spec };
}
var QuestionBank = class {
  constructor(paths) {
    this.paths = paths;
  }
  bankPath(courseRoot, node) {
    return `${courseRoot}/\u9898\u5E93/${safeFilename(node)}.yaml`;
  }
  /** 读某节点题库；文件缺失返回空题库。 */
  async load(courseRoot, node) {
    const p = this.bankPath(courseRoot, node);
    if (!existsSync4(p)) return { node, questions: [] };
    try {
      const doc = YAML.parse(await import("node:fs/promises").then((m) => m.readFile(p, "utf8")));
      const v = validateBank(doc);
      return v.spec ?? { node, questions: [] };
    } catch {
      return { node, questions: [] };
    }
  }
  /** 校验并写入题库 YAML（LLM 产出过门禁后落盘）。 */
  async save(courseRoot, yamlText, expectedNode) {
    const doc = YAML.parse(yamlText);
    const v = validateBank(doc, expectedNode);
    if (v.errors) throw new Error(`[question-save] schema \u6821\u9A8C\u5931\u8D25\uFF0C\u9898\u5E93\u672A\u5199\u5165\u3002
${v.errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    const spec = v.spec;
    const p = this.bankPath(courseRoot, spec.node);
    await mkdir7(p.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
    await writeFile7(p, YAML.stringify(doc), "utf8");
    return { node: spec.node, count: spec.questions.length, path: p };
  }
  // ---- 单题操作（题目管理面板用；每次写回前全量过 validateBank 门禁）----
  /** 读题库原始 YAML 文档（缺失/损坏返回 null）。 */
  async loadDoc(courseRoot, node) {
    const p = this.bankPath(courseRoot, node);
    if (!existsSync4(p)) return null;
    try {
      const doc = YAML.parse(await readFile8(p, "utf8"));
      return typeof doc === "object" && doc !== null ? doc : null;
    } catch {
      return null;
    }
  }
  async writeDoc(courseRoot, node, doc) {
    const p = this.bankPath(courseRoot, node);
    await mkdir7(p.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
    await writeFile7(p, YAML.stringify(doc), "utf8");
  }
  /** 追加单题 → 新题 id 与题库总题数。 */
  async addQuestion(courseRoot, node, question) {
    const doc = await this.loadDoc(courseRoot, node) ?? { node, questions: [] };
    const list = Array.isArray(doc.questions) ? doc.questions : [];
    const id = typeof question.id === "string" && question.id.trim() ? question.id.trim() : `q${list.length + 1}`;
    if (list.some((q) => q.id === id)) {
      throw new Error(`[question-add] \u9898\u76EE id\u300C${id}\u300D\u5DF2\u5B58\u5728\u3002`);
    }
    const next = [...list, { ...question, id }];
    const v = validateBank({ ...doc, questions: next }, node);
    if (v.errors) throw new Error(`[question-add] \u6821\u9A8C\u5931\u8D25\uFF0C\u672A\u5199\u5165\u3002
${v.errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    await this.writeDoc(courseRoot, node, { ...doc, questions: next });
    return { id, count: next.length };
  }
  /** 更新单题字段（patch 合并；id 不可改）。 */
  async updateQuestion(courseRoot, node, qid, patch) {
    const doc = await this.loadDoc(courseRoot, node);
    if (!doc) throw new Error(`[question-update] ${node} \u6CA1\u6709\u9898\u5E93\u6587\u4EF6\u3002`);
    const list = Array.isArray(doc.questions) ? doc.questions : [];
    const idx = list.findIndex((q) => q.id === qid);
    if (idx < 0) throw new Error(`[question-update] ${node} \u7684\u9898\u5E93\u6CA1\u6709 ${qid}\u3002`);
    const merged = { ...list[idx], ...patch, id: qid };
    const next = [...list];
    next[idx] = merged;
    const v = validateBank({ ...doc, questions: next }, node);
    if (v.errors) throw new Error(`[question-update] \u6821\u9A8C\u5931\u8D25\uFF0C\u672A\u5199\u5165\u3002
${v.errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    await this.writeDoc(courseRoot, node, { ...doc, questions: next });
  }
  /** 归档/取消归档单题（归档题在 questionsAll 里仍可见并带标记，作答侧过滤）。 */
  async archiveQuestion(courseRoot, node, qid, archived) {
    const doc = await this.loadDoc(courseRoot, node);
    if (!doc) throw new Error(`[question-archive] ${node} \u6CA1\u6709\u9898\u5E93\u6587\u4EF6\u3002`);
    const list = Array.isArray(doc.questions) ? doc.questions : [];
    const hit = list.find((q) => q.id === qid);
    if (!hit) throw new Error(`[question-archive] ${node} \u7684\u9898\u5E93\u6CA1\u6709 ${qid}\u3002`);
    if (archived) hit.archived = true;
    else delete hit.archived;
    const v = validateBank({ ...doc, questions: list }, node);
    if (v.errors) throw new Error(`[question-archive] \u6821\u9A8C\u5931\u8D25\uFF0C\u672A\u5199\u5165\u3002
${v.errors.map((e) => `  \u2717 ${e}`).join("\n")}`);
    await this.writeDoc(courseRoot, node, { ...doc, questions: list });
  }
};

// src/engine/index.ts
init_yaml();

// src/engine/sessions.ts
init_dates();
import { readFile as readFile9, writeFile as writeFile8, mkdir as mkdir8 } from "node:fs/promises";
import { existsSync as existsSync5 } from "node:fs";
init_notes();
function doneSet(graph, state) {
  return new Set(graph.names.filter((n) => ["review", "mastered"].includes(effectiveStage(state, n))));
}
function learningSet(graph, state) {
  return new Set(graph.names.filter((n) => effectiveStage(state, n) === "learning"));
}
function readySet(graph, state, rValue, rGate) {
  const done = doneSet(graph, state);
  const started = /* @__PURE__ */ new Set([...done, ...learningSet(graph, state)]);
  const out = [];
  for (const n of graph.names) {
    if (started.has(n)) continue;
    let ok = true;
    for (const p of graph.preOf[n]) {
      if (graph.opt.has(p)) continue;
      if (!done.has(p)) {
        ok = false;
        break;
      }
      if (rGate !== void 0 && rValue(p) < rGate) {
        ok = false;
        break;
      }
    }
    if (ok) out.push(n);
  }
  return out.sort();
}
function gateBlockers(graph, state, rValue, rGate) {
  const done = doneSet(graph, state);
  const started = /* @__PURE__ */ new Set([...done, ...learningSet(graph, state)]);
  const blockers = {};
  for (const n of graph.names) {
    if (started.has(n)) continue;
    const weak = [];
    let blocked = false;
    for (const p of graph.preOf[n]) {
      if (graph.opt.has(p)) continue;
      if (!done.has(p)) {
        blocked = true;
        break;
      }
      const r = rValue(p);
      if (r < rGate) weak.push([p, r]);
    }
    if (blocked || !weak.length) continue;
    blockers[n] = weak.sort((a, b) => a[1] - b[1]);
  }
  return blockers;
}
function regionLru(graph, state) {
  const last = {};
  for (const n of graph.names) {
    const fs = state[n]?.fsrs;
    if (fs?.last_review) {
      const region = graph.blockOf[n][1];
      if (!last[region] || fs.last_review > last[region]) last[region] = fs.last_review;
    }
  }
  const regions = graph.regions.map((r) => r.name);
  return regions.slice().sort((a, b) => {
    const la = last[a] ?? "";
    const lb = last[b] ?? "";
    if (la !== lb) return la < lb ? -1 : 1;
    return regions.indexOf(b) - regions.indexOf(a);
  });
}
function courseStats(graph, state, rValue, today, rGate = 0.85) {
  const counts = { unseen: 0, ready: 0, learning: 0, review: 0, mastered: 0 };
  const due = [];
  const overdue = [];
  const t = parseDay(today);
  for (const n of graph.names) {
    const st = effectiveStage(state, n);
    counts[st]++;
    const fs = state[n]?.fsrs;
    if (fs?.due && ["review", "mastered", "learning"].includes(st)) {
      const d = parseDay(fs.due);
      if (d && d <= t) {
        const r = rValue(n);
        (d.getTime() < t.getTime() ? overdue : due).push({ d: fs.due, n, r });
      }
    }
  }
  return {
    counts,
    ready: readySet(graph, state, rValue),
    gated: readySet(graph, state, rValue, rGate),
    due,
    overdue,
    blocked: gateBlockers(graph, state, rValue, rGate)
  };
}
var Sessions = class _Sessions {
  constructor(paths, store, registry, viewOf, settleRating, content) {
    this.paths = paths;
    this.store = store;
    this.registry = registry;
    this.viewOf = viewOf;
    this.settleRating = settleRating;
    this.content = content;
  }
  /** 当前操作的课程根目录（notePath 解析用；跨课循环内由调用方重设）。 */
  rootOf = "";
  // ---- 笔记路径 ----
  /** 节点课程笔记的 vault 相对路径（不含 .md）；无笔记返回 null。 */
  notePath(root, graph, n) {
    if (!graph.blockOf[n]) return null;
    const region = graph.blockOf[n][1];
    const path = this.paths.courseNotePath(root, region, n);
    if (!existsSync5(path)) return null;
    const marker = "/\u5B66\u4E60\u4E2D\u5FC3/";
    const idx = path.replace(/\\/g, "/").indexOf(marker);
    return idx >= 0 ? path.replace(/\\/g, "/").slice(idx + 1).replace(/\.md$/, "") : null;
  }
  nodeLink(root, graph, n) {
    const vp = this.notePath(root, graph, n);
    return vp ? `[[${vp}|${n}]]` : n;
  }
  // ---- status ----
  async statusJson(enabled, today = todayStr()) {
    const courses = [];
    for (const c of enabled) {
      const { graph, state } = await this.viewOf(c);
      const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root));
      const rValue = (n) => retrievability(sched, state[n], today);
      const st = courseStats(graph, state, rValue, today);
      courses.push({
        id: c.id,
        name: c.name,
        total: graph.names.length,
        counts: st.counts,
        due_today: st.due.length,
        overdue: st.overdue.map((o) => ({ node: o.n, since: o.d, r: Math.round(o.r * 1e3) / 1e3, path: this.notePath(c.root, graph, o.n) })),
        ready: st.ready.map((n) => ({ node: n, path: this.notePath(c.root, graph, n) })),
        gated: st.gated.map((n) => ({ node: n, path: this.notePath(c.root, graph, n) })),
        blocked: Object.fromEntries(Object.entries(st.blocked).map(([n, weak]) => [n, weak.map(([p, r]) => ({ pre: p, r: Math.round(r * 1e3) / 1e3 }))]))
      });
    }
    return { date: today, courses };
  }
  // ---- 动态推荐 ----
  async recommendEvents(enabled, today, limit) {
    const events = [];
    const seen = /* @__PURE__ */ new Set();
    for (const c of enabled) {
      const { graph, state } = await this.viewOf(c);
      const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root));
      const rValue = (n) => retrievability(sched, state[n], today);
      const st = courseStats(graph, state, rValue, today);
      const add = (etype, node, score, why) => {
        if (seen.has(node)) return;
        seen.add(node);
        events.push({
          type: etype,
          course: c.name,
          node,
          region: graph.blockOf[node]?.[1] ?? "",
          score: Math.round(score * 10) / 10,
          why,
          path: this.notePath(c.root, graph, node)
        });
      };
      for (const o of [...st.overdue].sort((a, b) => a.d.localeCompare(b.d))) {
        const days = daysBetween(parseDay(today), parseDay(o.d));
        add(
          "review",
          o.n,
          60 + Math.min(days, 10) * 3 + (1 - o.r) * 10,
          `\u903E\u671F ${days} \u5929\uFF08${o.d} \u8D77\u5230\u671F\uFF09\uFF0C\u8BB0\u5FC6\u4FDD\u6301\u7387\u7EA6 ${Math.round(o.r * 100)}%`
        );
      }
      for (const d0 of [...st.due].sort((a, b) => a.d.localeCompare(b.d))) {
        add("review", d0.n, 55, `\u4ECA\u65E5\u5230\u671F\uFF0C\u8BB0\u5FC6\u4FDD\u6301\u7387\u7EA6 ${Math.round(d0.r * 100)}%`);
      }
      for (const n of graph.names.filter((x) => effectiveStage(state, x) === "learning").sort()) {
        const r = state[n] ? rValue(n) : 0.9;
        add("learning", n, 52 + (1 - r) * 10, `\u5B66\u5230\u4E00\u534A\uFF0C\u7EE7\u7EED\u5B8C\u6210\u5B83\uFF08\u4FDD\u6301\u7387\u7EA6 ${Math.round(r * 100)}%\uFF09`);
      }
      const lru = regionLru(graph, state);
      const lruBonus = new Map(lru.map((r0, i) => [r0, Math.max(0, 8 - i * 2)]));
      const ready = readySet(graph, state, rValue);
      const unlockedCount = {};
      for (const n of ready) {
        for (const p of graph.preOf[n]) unlockedCount[p] = (unlockedCount[p] ?? 0) + 1;
      }
      for (const n of ready) {
        const region = graph.blockOf[n][1];
        const unlocks = unlockedCount[n] ?? 0;
        const parts = [];
        if (unlocks) parts.push(`\u5B66\u597D\u53EF\u89E3\u9501 ${unlocks} \u4E2A\u540E\u7EE7`);
        parts.push(`\u300C${region}\u300D\u533A${lru.length && lru[0] === region ? "\u6700\u4E45\u672A\u5B66\uFF0C\u8F6E\u8F6C\u4F18\u5148" : "\u6309\u8F6E\u8F6C\u6392\u5E8F"}`);
        add("new", n, 30 + Math.min(unlocks * 4, 16) + (lruBonus.get(region) ?? 0), parts.join("\uFF1B"));
      }
    }
    events.sort((a, b) => b.score - a.score);
    return events.slice(0, limit);
  }
  // ---- today（跨课程统一工作单） ----
  async buildCenterSession(enabled, minutes, today = todayStr()) {
    const budget = minutes;
    const entries = [];
    for (const c of enabled) {
      const { graph, state } = await this.viewOf(c);
      const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root));
      const rValue = (n) => retrievability(sched, state[n], today);
      const debt = [];
      for (const n of graph.names) {
        const stg = effectiveStage(state, n);
        if (!["review", "mastered", "learning"].includes(stg)) continue;
        const fs = state[n]?.fsrs;
        if (!fs?.due) continue;
        const d = parseDay(fs.due);
        const t = parseDay(today);
        if (d && d <= t) debt.push({ r: rValue(n), n, fs });
      }
      debt.sort((a, b) => a.r - b.r || a.n.localeCompare(b.n));
      const candidates = readySet(graph, state, rValue);
      const withContent = [];
      const pending = [];
      for (const n of candidates) {
        const fm = state[n];
        const ok = fm && ["draft", "reviewed"].includes(fm.content.status) && fm.content.version > 0;
        (ok ? withContent : pending).push(n);
      }
      let lastStudy = "";
      for (const fm of Object.values(state)) {
        if (fm.fsrs?.last_review && fm.fsrs.last_review > lastStudy) lastStudy = fm.fsrs.last_review;
      }
      entries.push({ course: c, graph, state, debt, withContent, pending, lastStudy });
    }
    const debtTotal = entries.reduce((s, e) => s + e.debt.length, 0);
    const overload = debtTotal > 2 * 20;
    const allReviews = entries.flatMap((e) => e.debt.map((d) => ({ ...d, course: e.course.name })));
    allReviews.sort((a, b) => a.r - b.r || a.course.localeCompare(b.course) || a.n.localeCompare(b.n));
    const kReview = Math.floor(budget * 0.6 / 3);
    const reviews = allReviews.slice(0, allReviews.length ? Math.max(kReview, 1) : 0);
    const newItems = [];
    const remain = budget - reviews.length * 3;
    let slots = Math.max(0, Math.floor(remain / 12));
    const order = [...entries].sort((a, b) => a.lastStudy.localeCompare(b.lastStudy));
    for (const e of order) {
      if (slots <= 0) break;
      if (!e.withContent.length) continue;
      const picked = this.pickNew(e.graph, e.state, e.withContent, 1);
      if (!picked.length) continue;
      newItems.push([e.course.name, picked[0]]);
      slots -= 1;
    }
    return {
      date: today,
      minutes,
      budget,
      course_order: enabled.map((c) => c.name),
      debt_total: debtTotal,
      overload,
      reviews: reviews.map((r) => ({ course: r.course, node: r.n, r: r.r, stability: r.fs.stability, due: r.fs.due })),
      new: newItems,
      roots: Object.fromEntries(enabled.map((c) => [c.name, c.root])),
      pending: Object.fromEntries(entries.map((e) => [e.course.name, e.pending]))
    };
  }
  /** 按区 LRU 轮转选新课：优先最久未学的区，区内取最浅候选。 */
  pickNew(graph, state, candidates, count) {
    if (count <= 0 || !candidates.length) return [];
    const byRegion = {};
    for (const n of candidates) {
      ;
      (byRegion[graph.blockOf[n][1]] ??= []).push(n);
    }
    for (const items of Object.values(byRegion)) {
      items.sort((a, b) => (graph.depth[a] ?? 0) - (graph.depth[b] ?? 0) || a.localeCompare(b));
    }
    const picked = [];
    let orderRegion = regionLru(graph, state).filter((r) => r in byRegion);
    while (picked.length < count && orderRegion.length) {
      const exhausted = [];
      for (const r of orderRegion) {
        if (picked.length >= count) break;
        picked.push(byRegion[r].shift());
        if (!byRegion[r].length) exhausted.push(r);
      }
      orderRegion = orderRegion.filter((r) => !exhausted.includes(r));
    }
    return picked;
  }
  /** 跨课程统一工作单 Markdown（## [课程名] 段型，全角 ｜ 契约）。 */
  renderSession(pack) {
    const today = pack.date;
    const lines = ["---", `date: ${today}`, `minutes: ${pack.minutes}`, "mode: normal", "settled: false", "---", ""];
    lines.push(`# \u5B66\u4E60\u4F1A\u8BDD ${today}\uFF08\u9884\u7B97 ${pack.budget} \u5206\u949F \xB7 \u7EA6 ${pack.reviews.length} \u590D\u4E60 + ${pack.new.length} \u65B0\u8BFE\uFF09`);
    lines.push("");
    for (const cname of pack.course_order) {
      const reviews = pack.reviews.filter((x) => x.course === cname);
      const news = pack.new.filter(([c]) => c === cname).map(([, n]) => n);
      const pending = pack.pending[cname] ?? [];
      if (!reviews.length && !news.length && !pending.length) continue;
      lines.push(`## [${cname}] \u5230\u671F\u590D\u4E60`, "");
      if (reviews.length) {
        for (const r of reviews) {
          const tier = r.r >= 0.8 ? "\u5FEB\u8FC7" : r.r < 0.5 ? "\u91CD\u5B66" : "\u6B63\u5E38";
          lines.push(`- [ ] ${this.nodeLink(pack.roots[cname] ?? "", this.graphOf(pack, cname), r.node)} \uFF5C S=${r.stability.toFixed(1)}d \uFF5C R=${Math.round(r.r * 100)}% \uFF5C ${tier} \uFF5C \u8BC4\u5206\uFF1A`);
        }
      } else {
        lines.push("\uFF08\u65E0\u5230\u671F\u590D\u4E60\uFF09");
      }
      lines.push("");
      if (news.length) {
        lines.push(`## [${cname}] \u65B0\u8BFE`, "");
        for (const n of news) lines.push(`- [ ] ${this.nodeLink(pack.roots[cname] ?? "", this.graphOf(pack, cname), n)} \uFF5C \u9996\u5B66\u8BC4\u5206\uFF1A`);
        lines.push("");
      }
      if (pending.length) {
        lines.push(`\u5185\u5BB9\u5F85\u751F\u6210\uFF08ready \u4F46\u8BFE\u7A0B\u672A\u4EA7\u51FA\uFF09\uFF1A${pending.slice(0, 10).join("\u3001")}`, "");
      }
    }
    lines.push("## \u5907\u6CE8", "");
    lines.push("- \u8BC4\u5206\u8BF4\u660E\uFF1A1=Again \u5FD8\u4E86 / 2=Hard \u8D39\u52B2 / 3=Good \u6B63\u5E38 / 4=Easy \u8F7B\u677E\u3002\u590D\u4E60 = \u4E0D\u7FFB\u5F00\u8BFE\u7A0B\u5148\u56DE\u5FC6\u8BE5\u8282\u70B9\u7684\u5B9A\u4E49\u4E0E\u6027\u8D28\uFF0C\u518D\u5BF9\u7167\u81EA\u8BC4\u3002");
    return lines.join("\n") + "\n";
  }
  graphCache = /* @__PURE__ */ new Map();
  graphOf(pack, cname) {
    return this.graphCache.get(cname) ?? { blockOf: {}, names: [] };
  }
  /** 组装今日统一工作单 → 会话/YYYY-MM-DD.md；已存在且未结算时直接继续作答。 */
  async today(enabled, minutes, today = todayStr()) {
    const path = this.paths.sessionPath(today);
    if (existsSync5(path)) {
      const raw = await readFile9(path, "utf8");
      const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (m && /settled:\s*false/.test(m[1])) {
        return { message: `[today] \u4ECA\u65E5\u5DE5\u4F5C\u5355\u5DF2\u5B58\u5728\u4E14\u672A\u7ED3\u7B97\uFF0C\u76F4\u63A5\u7EE7\u7EED\u4F5C\u7B54: ${path}` };
      }
    }
    const pack = await this.buildCenterSession(enabled, minutes, today);
    this.graphCache.clear();
    for (const c of enabled) {
      const { graph } = await this.viewOf(c);
      this.graphCache.set(c.name, graph);
    }
    await mkdir8(this.paths.sessionDir, { recursive: true });
    await writeFile8(path, this.renderSession(pack), "utf8");
    return {
      message: `[today] \u5DE5\u4F5C\u5355\u5DF2\u751F\u6210: ${path}
  \u590D\u4E60 ${pack.reviews.length}\uFF08\u503A\u5171 ${pack.debt_total}\uFF09\uFF5C \u65B0\u8BFE ${pack.new.length} \uFF5C \u6A21\u5F0F normal`
    };
  }
  // ---- settle / grade ----
  unwrapLink(s) {
    const m = s.trim().match(/^\[\[(.+?)(?:\|(.+?))?\]\]$/);
    if (!m) return s.trim();
    if (m[2]) return m[2].trim();
    return m[1].split("/").pop().trim();
  }
  /** 解析统一工作单作答 → {reviews, new}，条目均带课程归属。 */
  parseSession(text) {
    const out = { reviews: [], new: [] };
    let course = null;
    let section = "";
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (line.startsWith("## ")) {
        const m2 = line.match(/^##\s*\[(.+?)\]\s*(\S+)/);
        course = m2 ? m2[1].trim() : null;
        section = m2 ? m2[2] : line;
        continue;
      }
      if (!section) continue;
      const m = line.match(/^- \[[ xX]?\] (.+?) ｜ .*?评分：\s*(\d)\s*$/);
      if (!m) continue;
      const node = this.unwrapLink(m[1]);
      const rating = Number(m[2]);
      if (!(rating >= 1 && rating <= 4)) continue;
      if (line.includes("\u9996\u5B66\u8BC4\u5206")) out.new.push([course, node, rating]);
      else if (section.includes("\u590D\u4E60") || line.includes("S=")) out.reviews.push([course, node, rating]);
    }
    return out;
  }
  /** 结算会话：逐课 audit 门禁由 facade 预检 → 按段归属写 frontmatter/日志。 */
  async settle(dateStr, today = todayStr()) {
    const ds = dateStr || today;
    const path = this.paths.sessionPath(ds);
    if (!existsSync5(path)) return { message: `[settle] \u672A\u627E\u5230\u4F1A\u8BDD\u5DE5\u4F5C\u5355: ${path}`, code: 1 };
    const raw = await readFile9(path, "utf8");
    if (/^---[\s\S]*?settled:\s*true[\s\S]*?---/.test(raw)) {
      return { message: "[settle] \u8BE5\u4F1A\u8BDD\u5DF2\u7ED3\u7B97\u8FC7\uFF08\u5E42\u7B49\u4FDD\u62A4\uFF09\uFF0C\u8DF3\u8FC7\u3002", code: 0 };
    }
    const parsed = this.parseSession(raw);
    if (!parsed.reviews.length && !parsed.new.length) {
      return { message: "[settle] \u5DE5\u4F5C\u5355\u4E2D\u6CA1\u6709\u5DF2\u8BC4\u5206\u6761\u76EE\uFF08\u5728\u6761\u76EE\u672B\u5C3E\u586B \u8BC4\u5206\uFF1A1-4\uFF09\u3002", code: 1 };
    }
    const names = new Set([...parsed.reviews, ...parsed.new].map(([c]) => c));
    if (names.has(null)) {
      const en = await this.registry.enabled();
      if (en.length !== 1) throw new Error("[settle] \u5DE5\u4F5C\u5355\u5B58\u5728\u65E0\u8BFE\u7A0B\u5F52\u5C5E\u7684\u6761\u76EE\uFF0C\u800C\u542F\u7528\u8BFE\u7A0B\u4E0D\u6B62\u4E00\u95E8\uFF1B\u6BB5\u5934\u5FC5\u987B\u4E3A `## [\u8BFE\u7A0B\u540D] \u6BB5\u578B`\u3002");
      names.delete(null);
      names.add(en[0].name);
    }
    const views = /* @__PURE__ */ new Map();
    for (const cname of [...names].sort()) {
      const c = await this.registry.get(cname);
      if (!c) return { message: `[settle] \u5DE5\u4F5C\u5355\u8BFE\u7A0B\u300C${cname}\u300D\u4E0D\u5728\u6CE8\u518C\u8868\u4E2D\u3002`, code: 1 };
      const v = await this.viewOf(c);
      views.set(cname, { graph: v.graph, root: c.root });
    }
    let nDone = 0;
    const details = [];
    for (const [cname, node, rating] of [...parsed.reviews, ...parsed.new]) {
      const v = views.get(cname);
      if (!v) continue;
      if (!v.graph.nset.has(node)) {
        details.push(`[settle] \u8DF3\u8FC7\u672A\u77E5\u8282\u70B9: [${cname}] ${node}`);
        continue;
      }
      const { newFs, kind } = await this.settleRating(cname, v.graph, node, rating, today, ds);
      nDone += 1;
      details.push(`  \u2713 [${cname}] ${node} \u2190 ${rating}\uFF08${kind}\uFF0CS=${newFs.stability.toFixed(1)} \u2192 due ${newFs.due}\uFF09`);
    }
    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    const body = fmMatch ? raw.slice(fmMatch[0].length) : raw;
    let fmRaw = fmMatch ? fmMatch[1] : "";
    fmRaw = fmRaw ? fmRaw.replace(/settled:\s*false/, "settled: true") : "settled: true";
    await writeFile8(path, `---
${fmRaw}
---

${body}`, "utf8");
    return {
      message: `[settle] \u7ED3\u7B97\u5B8C\u6210\uFF1A${nDone} \u6761\u8BC4\u5206\u5165\u5E93\uFF08${ds}\uFF09\u3002
${details.join("\n")}`,
      code: 0
    };
  }
  /** 单条补录：节点跨课唯一直接命中（「课程/节点」消歧）。 */
  async grade(nodeSpec, rating, enabled, today = todayStr()) {
    if (nodeSpec.includes("/")) {
      const [cname, node] = nodeSpec.split("/", 2);
      const c = await this.registry.get(cname.trim());
      if (!c) throw new Error(`[learnhub] \u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${cname.trim()}\u300D\u3002`);
      return this.gradeIn(c, node.trim(), rating, today);
    }
    const hits = [];
    for (const c of enabled) {
      const { graph } = await this.viewOf(c);
      if (graph.nset.has(nodeSpec)) hits.push(c);
    }
    if (!hits.length) throw new Error(`[learnhub] \u542F\u7528\u8BFE\u7A0B\u4E2D\u627E\u4E0D\u5230\u8282\u70B9\u300C${nodeSpec}\u300D\u3002`);
    if (hits.length > 1) throw new Error(`[learnhub] \u8282\u70B9\u300C${nodeSpec}\u300D\u5728\u591A\u95E8\u8BFE\u7A0B\u4E2D\u5B58\u5728\uFF0C\u8BF7\u7528\u300C\u8BFE\u7A0B/\u8282\u70B9\u300D\u6307\u5B9A\uFF1A${hits.map((h) => h.name).join("\u3001")}`);
    return this.gradeIn(hits[0], nodeSpec, rating, today);
  }
  async gradeIn(c, node, rating, today) {
    const { graph } = await this.viewOf(c);
    if (!graph.nset.has(node)) throw new Error(`[learnhub] \u8BFE\u7A0B\u300C${c.name}\u300D\u4E2D\u6CA1\u6709\u8282\u70B9\u300C${node}\u300D\u3002`);
    const { newFs, kind } = await this.settleRating(c.name, graph, node, rating, today, today);
    return `[grade] [${c.name}] ${node} \u2190 ${rating}\uFF08${kind}\uFF09\uFF0C\u5DF2\u5199 frontmatter \u4E0E\u65E5\u5FD7\u3002\uFF08S=${newFs.stability.toFixed(1)} \u2192 due ${newFs.due}\uFF09`;
  }
  // ---- 练习判卷 ----
  /** 课程文件练习区 → [{q, meta}]；无文件返回 null。 */
  async exerciseItems(root, graph, node) {
    if (!graph.blockOf[node]) return null;
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(root, regionName, node);
    const { fm, body } = await loadNote(path);
    if (!fm) return null;
    const m = body.match(/## 练习\s*\n([\s\S]*?)(?=\n## |$)/);
    if (!m) return [];
    const metas = Content.practiceMeta(m[1]);
    const items = [];
    const qs = [...m[1].matchAll(/^\s*\d+\.\s*(.+)$/gm)];
    metas.forEach((meta, i) => {
      if (qs[i]) items.push({ q: qs[i][1].trim(), meta });
    });
    return items;
  }
  /** 练习题目列表（不含答案）。 */
  async exercises(root, graph, node) {
    const items = await this.exerciseItems(root, graph, node);
    if (items === null) throw new Error(`[exercises] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728: ${node}`);
    if (!items.length) throw new Error(`[exercises] ${node} \u6CA1\u6709\u7EC3\u4E60\u533A\uFF08\u5185\u5BB9\u672A\u751F\u6210\uFF1F\uFF09\u3002`);
    return items.map(({ q, meta }) => ({
      ex: meta.ex,
      q,
      difficulty: meta.difficulty ?? 1,
      check: meta.check ?? "human",
      uses: meta.uses ?? [],
      ...meta.check === "choice" && meta.options?.length ? { options: meta.options } : {}
    }));
  }
  /** 判卷入口（练习区四 check 类型；不碰调度状态）。
   * ai 题返回评分要点不记录（由 host 调模型后走 record-attempt）。 */
  async check(courseName, root, graph, node, exNo, answer) {
    const items = await this.exerciseItems(root, graph, node);
    if (items === null) throw new Error(`[check] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728: ${node}`);
    const found = items.find((x) => x.meta.ex === exNo);
    if (!found) throw new Error(`[check] ${node} \u6CA1\u6709 ex${exNo}\u3002`);
    const expected = found.meta.answer ?? "";
    const kind = found.meta.check ?? "human";
    if (kind === "ai") return { judge: "ai", q: found.q, answer: expected };
    if (kind === "choice") {
      const correct2 = choiceAnswerOk(answer, expected);
      await this.recordAttempt(courseName, root, graph, node, exNo, answer, "choice", correct2);
      return { judge: "choice", correct: correct2, answer: expected };
    }
    if (kind !== "sympy") {
      await this.recordAttempt(courseName, root, graph, node, exNo, answer, "human", null);
      return { judge: "human", correct: null, answer: expected };
    }
    const correct = answersEqual(answer, expected, found.meta.tol);
    await this.recordAttempt(courseName, root, graph, node, exNo, answer, "sympy", correct);
    return { judge: "sympy", correct, answer: expected };
  }
  /** 补录一次作答：验题存在 → practice 流水 + frontmatter 计数/EMA。 */
  async recordAttempt(courseName, root, graph, node, exNo, answer, judge, correct, feedback) {
    const items = await this.exerciseItems(root, graph, node);
    if (items === null) throw new Error(`[record] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728: ${node}`);
    if (!items.some((x) => x.meta.ex === exNo)) throw new Error(`[record] ${node} \u6CA1\u6709 ex${exNo}\u3002`);
    await this.store.appendPractice({ course: courseName, node, ex: exNo, answer, correct, judge, feedback });
    if (correct !== null) {
      const [, regionName] = graph.blockOf[node];
      const path = this.paths.courseNotePath(root, regionName, node);
      const { fm: rawFm, body } = await loadNote(path);
      const fm = asFm(rawFm);
      if (fm) {
        const next = applyPracticeEvidence(fm, correct ? 1 : 0);
        await saveNote(path, next, body);
      }
    }
    return { recorded: true, judge, correct };
  }
  // ---- 课程学习（面板全链路） ----
  /** 正文 → 学习分节 [{title, md}]（_lesson_sections 同语义）。 */
  static lessonSections(body) {
    const SKIP = ["\u7EC3\u4E60", "\u5185\u5BB9\u53CD\u9988"];
    const parts = body.split(/^## /m);
    const sections = [];
    const intro = parts[0].trim();
    if (intro) {
      const nl = intro.indexOf("\n");
      const title = nl >= 0 ? intro.slice(0, nl) : intro;
      const md = nl >= 0 ? intro.slice(nl + 1).trim() : "";
      if (md) sections.push({ title: title.replace(/^#+\s*/, "").trim() || "\u5BFC\u8BED", md });
    }
    let answersMd = "";
    for (const part of parts.slice(1)) {
      const nl = part.indexOf("\n");
      const title = (nl >= 0 ? part.slice(0, nl) : part).trim();
      const md = (nl >= 0 ? part.slice(nl + 1) : "").trim();
      if (SKIP.includes(title) || title.startsWith("<!--")) continue;
      if (!md) continue;
      if (title === "\u7B54\u6848") {
        answersMd = md;
        continue;
      }
      sections.push({ title, md });
    }
    if (answersMd) {
      const hit = sections.find((s) => s.title === "\u4F8B\u9898");
      if (hit) hit.md += "\n\n### \u53C2\u8003\u7B54\u6848\n" + answersMd;
      else sections.push({ title: "\u7B54\u6848", md: answersMd });
    }
    return sections;
  }
  /** 单节点课程学习包：分节正文 + 练习 + 前置 + 推荐下一步。 */
  async lesson(courseName, root, graph, state, node) {
    if (!graph.nset.has(node)) throw new Error(`[lesson] \u8BFE\u7A0B\u300C${courseName}\u300D\u4E2D\u6CA1\u6709\u8282\u70B9\u300C${node}\u300D\u3002`);
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(root, regionName, node);
    const { fm: rawFm, body } = await loadNote(path);
    const fm = asFm(rawFm);
    if (!fm) throw new Error(`[lesson] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728\uFF08\u5185\u5BB9\u672A\u751F\u6210\uFF1F\uFF09\uFF1A${node}`);
    const sections = _Sessions.lessonSections(body);
    const exercises = await this.exercises(root, graph, node).catch(() => []);
    const sched = await getScheduler(this.paths, this.paths.courseRoot(root));
    const rValue = (n) => retrievability(sched, state[n], todayStr());
    const candidates = readySet(graph, state, rValue).filter((n) => n !== node);
    const unlocks = candidates.filter((n) => graph.preOf[n].includes(node));
    return {
      course: courseName,
      node,
      region: regionName,
      stage: effectiveStage(state, node),
      mastery: fm.mastery,
      sections,
      exercises,
      prereqs: [...graph.preOf[node]],
      suggest_next: [...unlocks, ...candidates.filter((n) => !unlocks.includes(n))].slice(0, 8)
    };
  }
};

// src/engine/index.ts
init_dates();
var LearnhubEngine = class {
  paths;
  registry;
  store;
  content;
  proposals;
  bank;
  sessions;
  constructor(config) {
    const centerRel = (config.centerRel ?? "\u5B66\u4E60\u4E2D\u5FC3").replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
    const centerRoot = `${config.vault}/${centerRel}`;
    this.paths = new Paths(centerRoot);
    this.registry = new Registry(this.paths);
    this.store = new Store(this.paths);
    this.content = new Content(this.paths);
    this.bank = new QuestionBank(this.paths);
    this.proposals = new GraphProposals(this.paths, this.store, this.registry, centerRoot);
    this.sessions = new Sessions(
      this.paths,
      this.store,
      this.registry,
      async (course) => this.loadView(course),
      void 0,
      this.content
    );
    this.sessions.settleRating = (courseName, graph, node, rating, today, sessionId) => this.settleRating(courseName, graph, node, rating, today, sessionId);
  }
  // ---- 加载与解析 ----
  /** 单课完整视图：图 + frontmatter 状态（每次现读，文件量小，天然最新）。 */
  async loadView(course) {
    const store = new GraphStore(this.paths, this.paths.courseRoot(course.root));
    const regions = await store.load();
    const graph = new Graph(regions);
    const { state, broken } = await stateMap(this.paths.courseDir(course.root));
    return { graph, state, broken };
  }
  async enabledCourses() {
    return this.registry.enabled();
  }
  async resolveCourse(key) {
    return this.registry.resolve(key);
  }
  /** 跨课定位节点：「课程/节点」直接命中；否则在启用课程中搜唯一命中。 */
  async locateNode(nodeSpec) {
    if (nodeSpec.includes("/")) {
      const [cname, node] = nodeSpec.split("/", 2);
      const c = await this.registry.get(cname.trim());
      if (!c) throw new Error(`[learnhub] \u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${cname.trim()}\u300D\u3002`);
      return { course: c, node: node.trim() };
    }
    const hits = [];
    for (const c of await this.enabledCourses()) {
      const { graph } = await this.loadView(c);
      if (graph.nset.has(nodeSpec)) hits.push(c);
    }
    if (!hits.length) throw new Error(`[learnhub] \u542F\u7528\u8BFE\u7A0B\u4E2D\u627E\u4E0D\u5230\u8282\u70B9\u300C${nodeSpec}\u300D\u3002`);
    if (hits.length > 1) throw new Error(`[learnhub] \u8282\u70B9\u300C${nodeSpec}\u300D\u5728\u591A\u95E8\u8BFE\u7A0B\u4E2D\u5B58\u5728\uFF0C\u8BF7\u7528\u300C\u8BFE\u7A0B/\u8282\u70B9\u300D\u6307\u5B9A\uFF1A${hits.map((h) => h.name).join("\u3001")}`);
    return { course: hits[0], node: nodeSpec };
  }
  // ---- 评分落盘（D15 唯一入口） ----
  /** 单节点评分落盘：frontmatter + journal。settle/grade 的共享底层。 */
  async settleRating(courseName, graph, node, rating, today, sessionId) {
    const course = await this.registry.get(courseName);
    if (!course) throw new Error(`[settle] \u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${courseName}\u300D\u3002`);
    const { state } = await this.loadView(course);
    const fm = state[node] ?? await this.ensureNote(course.root, graph, node);
    const sched = await getScheduler(this.paths, this.paths.courseRoot(course.root));
    const firstLearn = !fm.fsrs?.reps;
    const { fs: newFs, meta } = applyRating(fm, rating, today, sched);
    const nextStage = stageAfter(newFs, rating, firstLearn);
    const practice = await this.store.attemptStats(courseName, node);
    const next = {
      ...fm,
      stage: nextStage,
      fsrs: newFs,
      mastery: masteryValue(newFs, fm.practice, fm.practice_ema)
    };
    void practice;
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(course.root, regionName, node);
    await saveNote(path, next, (await loadNote(path)).body);
    const rec = await this.store.appendJournal({
      course: courseName,
      node,
      rating,
      kind: meta.kind,
      elapsed_days: meta.elapsed_days,
      session: sessionId
    });
    const { state: stateNow } = await this.loadView(course);
    await this.content.onStageChange(course.root, graph, stateNow, node, nextStage);
    return { rec, newFs, kind: meta.kind, stage: nextStage };
  }
  /** 无笔记节点补占位文件（保证 frontmatter 始终可查）。 */
  async ensureNote(root, graph, node) {
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(root, regionName, node);
    const fm = defaultFrontmatter(node);
    await saveNote(path, fm, "> \u5185\u5BB9\u5F85\u751F\u6210\u3002\n");
    return fm;
  }
  // ---- status / recommend / today / settle / grade ----
  async statusJson() {
    return this.sessions.statusJson(await this.enabledCourses());
  }
  async recommend(limit = 5) {
    const events = await this.sessions.recommendEvents(await this.enabledCourses(), todayStr(), limit);
    return { date: todayStr(), events };
  }
  async today(minutes) {
    return this.sessions.today(await this.enabledCourses(), Math.round(minutes));
  }
  async settle(dateStr) {
    return this.sessions.settle(dateStr);
  }
  async grade(nodeSpec, rating) {
    return this.sessions.grade(nodeSpec, rating, await this.enabledCourses());
  }
  // ---- doctor（fm schema 对账） ----
  async doctor() {
    const courses = [];
    for (const c of await this.enabledCourses()) {
      const { graph, state, broken } = await this.loadView(c);
      const missing = graph.names.filter((n) => !state[n]);
      const unknown = Object.keys(state).filter((n) => !graph.nset.has(n));
      courses.push({ course: c.name, total: graph.names.length, notes: Object.keys(state).length, broken, missing, unknown });
    }
    return { generated_at: nowIso(), courses };
  }
  // ---- rebuild（audit + 就绪清单） ----
  async rebuild(courseKey) {
    const targets = courseKey ? [await this.registry.resolve(courseKey)] : await this.enabledCourses();
    const lines = [];
    let failed = false;
    for (const c of targets) {
      const { graph, state } = await this.loadView(c);
      const regions = graph.regions;
      const audit = await runAudit(this.paths, c.root, c.name, graph, regions);
      if (audit.failed) failed = true;
      lines.push(`[${c.name}] \u5BA1\u8BA1\uFF1AERROR ${audit.errors.length} | WARN ${audit.warns.length} | INFO ${audit.infos.length}${audit.failed ? "\uFF08\u963B\u65AD\uFF09" : ""}`);
      const done = new Set(Object.entries(state).filter(([, f]) => ["review", "mastered"].includes(f.stage)).map(([n]) => n));
      await writeReadyList(this.paths, c.root, graph, done);
    }
    if (failed) throw new Error(`[rebuild] \u5BA1\u8BA1\u5B58\u5728 ERROR\uFF1A
${lines.join("\n")}`);
    return { message: `[rebuild] \u5B8C\u6210\uFF1A
${lines.join("\n")}` };
  }
  // ---- graph analyze ----
  async graphAnalyze(courseKey, elementsOnly = false) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    const doc = await analyzeGraph(c.name, graph, state, this.store);
    if (elementsOnly) return { nodes: doc.nodes, edges: doc.edges };
    return doc;
  }
  // ---- 提案门禁包装（apply 前 audit 拦截） ----
  async graphPropose(kind, yamlText) {
    return kind === "edit" ? this.proposals.proposeEdit(yamlText) : this.proposals.proposeGen(yamlText);
  }
  async graphApply(kind, pid) {
    const pending = await this.store.takePending(kind, pid);
    const course = await this.registry.get(pending.course);
    let auditOk = true;
    if (course) {
      const { graph } = await this.loadView(course);
      const audit = await runAudit(this.paths, course.root, course.name, graph, graph.regions);
      auditOk = !audit.failed;
    }
    return kind === "edit" ? this.proposals.applyEdit(pid, auditOk) : this.proposals.applyGen(pid, auditOk);
  }
  async graphReject(pid, note = "") {
    return this.proposals.reject(pid, note);
  }
  async graphProposals(status, kind) {
    return this.proposals.list(status, kind);
  }
  // ---- 内容管线 ----
  async contentPack(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    return this.content.contextPack(graph, state, node, c.name);
  }
  async loadPrompt(kind) {
    return this.content.loadPrompt(kind);
  }
  /** 生成落盘门：gate_report → applyGeneration（version+1, draft）。
   * 节点笔记不存在时先建骨架（allo on-demand 语义：大纲即时、正文按需落盘）。 */
  async contentApply(courseKey, node, body) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[apply] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    if (!state[node]) await this.ensureNote(c.root, graph, node);
    const gate = await this.content.gateReport(graph, c.root, node, body);
    if (!gate.passed) {
      throw new Error(`[apply] \u8D28\u68C0\u95E8\u672A\u8FC7\uFF1A
${gate.findings.map((e) => `  \u2717 ${e}`).join("\n")}
${gate.warns.map((w) => `  \u26A0 ${w}`).join("\n")}`);
    }
    const normalized = this.content.normalizePractice(body);
    const version2 = await this.content.applyGeneration(
      c.root,
      graph,
      node,
      normalized.body,
      (n) => state[n],
      (rec) => this.store.appendJournal({ ...rec, course: c.name })
    );
    await this.content.queueDone(c.root, node);
    return { version: version2, message: `[apply] ${node} \u6B63\u6587 v${version2} \u843D\u76D8\uFF08status=draft\uFF0C\u5F85\u4EBA\u5BA1\uFF09` };
  }
  async contentFeedback(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    return this.content.feedback(c.root, graph, node, (n) => state[n], async (n, fm) => {
      const path = this.paths.courseNotePath(c.root, graph.blockOf[n][1], n);
      await this.updateNoteFm(path, fm);
    });
  }
  async contentReview(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    return this.content.review(c.root, graph, node, (n) => state[n], async (n, fm) => {
      const path = this.paths.courseNotePath(c.root, graph.blockOf[n][1], n);
      await this.updateNoteFm(path, fm);
    });
  }
  async genExercises(courseKey, node, yamlText) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    return this.content.genExercises(
      c.root,
      graph,
      node,
      yamlText,
      async (n) => (await this.loadView(c)).state[n],
      (rec) => this.store.appendJournal({ ...rec, course: c.name }),
      node
    );
  }
  async contentQueue(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    return this.content.queueManual(c.root, node);
  }
  async queueItemsAll() {
    const out = [];
    for (const c of await this.enabledCourses()) {
      for (const it of await this.content.queueItems(c.root)) {
        out.push({ ...it, course: c.name });
      }
    }
    return out;
  }
  // ---- 练习与判卷 ----
  async exercises(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    return this.sessions.exercises(c.root, graph, node);
  }
  async lesson(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    return this.sessions.lesson(c.name, c.root, graph, state, node);
  }
  async check(courseKey, node, exNo, answer) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    return this.sessions.check(c.name, c.root, graph, node, exNo, answer);
  }
  async recordAttempt(courseKey, node, exNo, answer, judge, correct, feedback) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    return this.sessions.recordAttempt(c.name, c.root, graph, node, exNo, answer, judge, correct, feedback);
  }
  /** AI 反思判卷（reflection / ai 题）：题目+评分要点+作答 → 模型 → {score, feedback}。
   * 完成后自动 record-attempt 入流水（correct = score ≥ 0.6）。 */
  async aiGrade(llmComplete, courseKey, node, exNo, answer) {
    const info = await this.check(courseKey, node, exNo, "");
    if (info.judge !== "ai") throw new Error(`ex${exNo} \u4E0D\u662F AI \u5224\u5377\u9898\uFF08judge=${String(info.judge)}\uFF09\u3002`);
    const rubric = String(info.answer ?? "");
    const raw = await llmComplete(
      `## \u9898\u76EE

${String(info.q ?? "")}

## \u8BC4\u5206\u8981\u70B9

${rubric}

## \u5B66\u751F\u4F5C\u7B54

${answer}`,
      REFLECTION_GRADING_SYSTEM
    );
    let score = 0;
    let feedback = "";
    try {
      const v = parseReflectionGrading(raw);
      score = v.score;
      feedback = v.feedback;
    } catch {
      score = answer.trim() ? 0.5 : 0;
      feedback = raw.slice(0, 500);
    }
    const correct = score >= 0.6;
    await this.recordAttempt(courseKey, node, exNo, answer, "ai", correct, feedback);
    return { score: Math.round(score * 100), correct, feedback, raw };
  }
  // ---- note resolve / 反馈区读取 ----
  /** 解析笔记 → { path, node, course }，任一环节缺失即抛错。 */
  async resolveNote(vaultRoot, input, centerRel) {
    const p = input.replace(/\\/g, "/");
    const rel = p.startsWith(`${vaultRoot}/`) ? p.slice(vaultRoot.length + 1) : p.replace(/^\/+/, "");
    const abs = `${vaultRoot}/${rel}`;
    const raw = await readFile10(abs, "utf8");
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const node = m ? (m[1].match(/^node:\s*(.+)$/m)?.[1] ?? "").trim() : "";
    if (!node) throw new Error(`${rel} \u7684 frontmatter \u7F3A\u5C11 node \u5B57\u6BB5\uFF0C\u4E0D\u662F\u8BFE\u7A0B\u6587\u4EF6\u3002`);
    if (!rel.startsWith(`${centerRel}/`)) throw new Error(`${rel} \u4E0D\u5728\u5B66\u4E60\u4E2D\u5FC3\u5185\u3002`);
    const seg = rel.slice(centerRel.length + 1).split("/")[0];
    const reg = await this.registry.load();
    const hit = reg.find((c) => c.root === seg && c.enabled !== false);
    if (!hit) throw new Error("\u65E0\u6CD5\u4ECE\u6CE8\u518C\u8868\u5B9A\u4F4D\u5F53\u524D\u7B14\u8BB0\u5BF9\u5E94\u7684\u8BFE\u7A0B\u3002");
    return { path: rel, node, course: hit.name };
  }
  /** 提取笔记「内容反馈」区正文；仅占位符或为空返回 null。 */
  async feedbackBody(absPath) {
    const raw = await readFile10(absPath, "utf8");
    const sec = raw.match(/## 内容反馈\n([\s\S]*?)(?=\n## |<!-- enc_candidates|$)/);
    const body = (sec?.[1] ?? "").replace(/在此写下你对本课内容的问题与建议.*$/m, "").trim();
    return body || null;
  }
  /** 提交内容反馈（feedback 工具/路由共用）。 */
  async submitFeedback(vaultRoot, centerRel, input) {
    const { path, node, course } = await this.resolveNote(vaultRoot, input, centerRel);
    const body = await this.feedbackBody(`${vaultRoot}/${path}`);
    if (!body) throw new Error("\u8BF7\u5148\u5728\u7B14\u8BB0\u300C\u5185\u5BB9\u53CD\u9988\u300D\u533A\u5199\u4E0B\u4F60\u7684\u95EE\u9898\u4E0E\u5EFA\u8BAE\uFF0C\u518D\u63D0\u4EA4\u3002");
    return this.contentFeedback(course, node);
  }
  // ---- P4：课程工作区（树形）与题库 ----
  /** 课程工作区树：course → region → block → node（stage/mastery/笔记/题库状态）。 */
  async coursesTree(courseKey) {
    const targets = courseKey ? [await this.registry.resolve(courseKey)] : await this.enabledCourses();
    const courses = [];
    for (const c of targets) {
      const { graph, state } = await this.loadView(c);
      const regions = graph.regions.map((r) => ({
        name: r.name,
        color: r.color,
        blocks: r.blocks.map((b) => ({
          name: b.name,
          nodes: b.nodes.map((n) => ({
            node: n.name,
            opt: n.opt,
            stage: effectiveStage(state, n.name),
            mastery: state[n.name]?.mastery ?? 0,
            contentVersion: state[n.name]?.content.version ?? 0,
            contentStatus: state[n.name]?.content.status ?? "draft",
            path: this.sessions.notePath(c.root, graph, n.name),
            hasBank: existsSync6(this.bank.bankPath(this.paths.courseRoot(c.root), n.name))
          }))
        }))
      }));
      courses.push({ name: c.name, id: c.id, regions });
    }
    return { courses };
  }
  /** 某节点题库题目列表（不含答案/评分要点）。 */
  async questions(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node);
    return {
      course: c.name,
      node,
      questions: bank.questions.filter((q) => q.archived !== true).map((q, i) => ({
        id: q.id,
        kind: q.kind,
        q: q.q,
        no: i + 1,
        difficulty: q.difficulty ?? 1,
        ...q.options?.length ? { options: q.options } : {},
        hasExplanation: Boolean(q.explanation)
      }))
    };
  }
  /** 题库写入（LLM 产出过 schema 门禁后落盘）。 */
  async questionSave(courseKey, node, yamlText) {
    const c = await this.registry.resolve(courseKey);
    return this.bank.save(this.paths.courseRoot(c.root), yamlText, node);
  }
  /** allo 作答流：答题 → 自动判卷（reflection 走 AI）→ practice 流水 + 计数/EMA。
   * 调度不在此触碰（D15：评分仍经工作单 settle / grade 通道）。 */
  async questionAnswer(llmComplete, courseKey, node, qid, answer) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[question] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node);
    const idx = bank.questions.findIndex((q2) => q2.id === qid);
    if (idx < 0) throw new Error(`[question] ${node} \u7684\u9898\u5E93\u6CA1\u6709 ${qid}\u3002`);
    const q = bank.questions[idx];
    let score = 0;
    let feedback = "";
    if (q.kind === "reflection") {
      const raw = await llmComplete(
        `Exercise prompt:
${q.q}

Learner's answer:
${answer}

Grading rubric (\u8BC4\u5206\u8981\u70B9):
${String(q.answer)}`,
        REFLECTION_GRADING_SYSTEM
      );
      try {
        const v = parseReflectionGrading(raw);
        score = v.score;
        feedback = v.feedback;
      } catch {
        score = answer.trim() ? 0.5 : 0;
        feedback = raw.slice(0, 500);
      }
    } else {
      const r = evaluateAllo(q, answer);
      score = r.score;
      feedback = r.feedback;
    }
    const correct = score >= PASS_SCORE;
    await this.store.appendPractice({
      course: c.name,
      node,
      ex: idx + 1,
      answer,
      correct,
      judge: q.kind,
      qid,
      feedback: feedback || void 0
    });
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(c.root, regionName, node);
    const { fm: rawFm, body } = await loadNote(path);
    const fm = asFm(rawFm);
    if (fm) {
      const next = applyPracticeEvidence(fm, correct ? 1 : 0);
      await saveNote(path, next, body);
    }
    return {
      correct,
      score: Math.round(score * 100),
      feedback,
      explanation: q.explanation ?? "",
      // 错题公布答案（allo answer_review 语义；reflection 的 rubric 也回显供对照）
      answer: q.kind === "true_false" ? q.answer : q.kind === "single_choice" ? q.answer : q.kind === "fill_in_blank" ? Array.isArray(q.answer) ? q.answer.join(" / ") : q.answer : String(q.answer),
      kind: q.kind
    };
  }
  // ---- 学习面板扩展（打卡/日历/标签/题目管理/课程删除）----
  /** 今日打卡状态（本地日；journal/practice 有行为即打卡，行为流水即事实）。 */
  async checkinToday() {
    const byDay = await this.store.activityCounts();
    const today = byDay[todayStr()] ?? { journal: 0, practice: 0, total: 0 };
    return { checked: today.total > 0, journal: today.journal, practice: today.practice, total: today.total };
  }
  /** 日历热力图数据（指定年；month 缺省=全年）。 */
  async calendarStats(year, month) {
    const byDay = await this.store.activityCounts();
    const days = Object.entries(byDay).filter(([date]) => {
      const m = date.match(/^(\d{4})-(\d{2})/);
      if (!m || +m[1] !== year) return false;
      return month === void 0 || +m[2] === month;
    }).map(([date, c]) => ({ date, journal: c.journal, practice: c.practice, total: c.total })).sort((a, b) => a.date.localeCompare(b.date));
    return { year, month: month ?? null, days };
  }
  /** 全中心标签聚合（课程 tags + 启用课程全部题库的题目 tags，去重排序）。 */
  async listTags() {
    const tags = /* @__PURE__ */ new Set();
    const courses = await this.registry.enabled();
    for (const c of courses) (c.tags ?? []).forEach((t) => tags.add(t));
    for (const c of courses) {
      let files = [];
      try {
        files = await readdir3(this.paths.bankDir(c.root));
      } catch {
        continue;
      }
      for (const f of files.filter((f2) => f2.endsWith(".yaml"))) {
        const bank = await this.bank.load(this.paths.courseRoot(c.root), f.replace(/\.yaml$/, ""));
        bank.questions.forEach((q) => (q.tags ?? []).forEach((t) => tags.add(t)));
      }
    }
    return [...tags].sort();
  }
  async setCourseTags(courseKey, tags) {
    const c = await this.registry.resolve(courseKey);
    return { course: c.name, tags: await this.registry.setTags(c.name, tags) };
  }
  async setQuestionTags(courseKey, node, qid, tags) {
    const c = await this.registry.resolve(courseKey);
    await this.bank.updateQuestion(this.paths.courseRoot(c.root), node, qid, { tags });
    return { course: c.name, node, qid, tags };
  }
  /** 全部题库条目（题目管理列表；不含答案）。 */
  async questionsAll(courseKey) {
    const courses = courseKey ? [await this.registry.resolve(courseKey)] : await this.registry.enabled();
    const out = [];
    for (const c of courses) {
      let files = [];
      try {
        files = await readdir3(this.paths.bankDir(c.root));
      } catch {
        continue;
      }
      for (const f of files.filter((f2) => f2.endsWith(".yaml")).sort()) {
        const node = f.replace(/\.yaml$/, "");
        const bank = await this.bank.load(this.paths.courseRoot(c.root), node);
        bank.questions.forEach((q, i) => {
          out.push({
            course: c.name,
            node,
            qid: q.id,
            no: i + 1,
            kind: q.kind,
            q: q.q,
            difficulty: q.difficulty ?? 1,
            tags: q.tags ?? [],
            archived: q.archived === true,
            hasExplanation: Boolean(q.explanation),
            ...q.options?.length ? { options: q.options } : {}
          });
        });
      }
    }
    return { total: out.length, questions: out };
  }
  async questionAdd(courseKey, node, question) {
    const c = await this.registry.resolve(courseKey);
    const r = await this.bank.addQuestion(this.paths.courseRoot(c.root), node, question);
    return { course: c.name, node, ...r };
  }
  async questionUpdate(courseKey, node, qid, patch) {
    const c = await this.registry.resolve(courseKey);
    await this.bank.updateQuestion(this.paths.courseRoot(c.root), node, qid, patch);
    return { course: c.name, node, qid };
  }
  async questionArchive(courseKey, node, qid, archived) {
    const c = await this.registry.resolve(courseKey);
    await this.bank.archiveQuestion(this.paths.courseRoot(c.root), node, qid, archived);
    return { course: c.name, node, qid, archived };
  }
  /** AI 出题：节点正文 → 出题提示词 + llm → 产出的题库 YAML 逐题过 validateBank 门禁追加落盘。
   * llm 由 host 注入（返回已剥围栏的纯文本）。骨架节点（无正文）直接报错。 */
  async questionGenerate(courseKey, node, count, llm) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[quiz] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    const [, regionName] = graph.blockOf[node];
    const note = await loadNote(this.paths.courseNotePath(c.root, regionName, node));
    const body = note.body.replace(/^>\s*内容待生成。\s*$/m, "").trim();
    if (!body) throw new Error(`[quiz] \u300C${node}\u300D\u8FD8\u6CA1\u6709\u6B63\u6587\u2014\u2014\u5148\u300C\u751F\u6210\u6B63\u6587\u300D\u518D\u51FA\u9898\u3002`);
    const tpl = await this.loadPrompt("\u9898\u76EE\u751F\u6210");
    const raw = await llm(`${tpl}

## \u9898\u76EE\u6570\u91CF

${count} \u9053

---

${body}`);
    const doc = YAML.parse(raw);
    if (typeof doc !== "object" || doc === null || !Array.isArray(doc.questions) || !doc.questions.length) {
      throw new Error("[quiz] \u6A21\u578B\u6CA1\u6709\u4EA7\u51FA\u53EF\u7528\u9898\u76EE\uFF08questions \u4E3A\u7A7A\uFF09\u3002");
    }
    let added = 0;
    let skipped = 0;
    for (const raw2 of doc.questions.slice(0, Math.max(1, count))) {
      const q = { ...raw2 };
      delete q.id;
      try {
        await this.bank.addQuestion(this.paths.courseRoot(c.root), node, q);
        added++;
      } catch {
        skipped++;
      }
    }
    if (!added) throw new Error("[quiz] \u6A21\u578B\u4EA7\u51FA\u7684\u9898\u76EE\u5168\u90E8\u672A\u8FC7\u6821\u9A8C\u95E8\uFF08\u9898\u578B/\u7B54\u6848\u683C\u5F0F\u4E0D\u7B26\uFF09\uFF0C\u4E00\u9053\u90FD\u6CA1\u5165\u5E93\u3002");
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node);
    return { course: c.name, node, added, skipped, total: bank.questions.length };
  }
  /** 删除课程：注册表移除 + 课程目录移入 学习中心/.trash/（不真删，可手工找回）。 */
  async courseDelete(courseKey) {
    const c = await this.registry.get(courseKey);
    if (!c) throw new Error(`[learnhub] \u6CE8\u518C\u8868\u4E2D\u6CA1\u6709\u8BFE\u7A0B\u300C${courseKey}\u300D\u3002`);
    const rest = (await this.registry.load()).filter((x) => x.name !== c.name && x.id !== c.id);
    await this.registry.save(rest);
    const src = this.paths.courseRoot(c.root);
    const trash = `${this.paths.trashDir}/${c.root}-${Date.now()}`;
    if (existsSync6(src)) {
      await mkdir9(this.paths.trashDir, { recursive: true });
      await rename3(src, trash);
    }
    return { removed: c.name, trash };
  }
  /** 为课程缺笔记的节点补骨架文件（幂等；存量课程修复/维护用）。 */
  async ensureAllNotes(courseKey) {
    const courses = courseKey ? [await this.registry.resolve(courseKey)] : await this.registry.enabled();
    const out = [];
    for (const c of courses) {
      const { graph } = await this.loadView(c);
      const created = await this.proposals.ensureNotesFor(c.root, graph.regions);
      out.push({ course: c.name, created });
    }
    return { courses: out };
  }
  // ---- utils ----
  async updateNoteFm(path, fm) {
    const { body } = await loadNote(path);
    await saveNote(path, fm, body);
  }
  /** 写一条 journal（运行日志等由插件层做）。 */
  journal() {
    return this.store;
  }
};
export {
  LearnhubEngine
};
/*! Bundled license information:

ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
  (* istanbul ignore next -- @preserve *)
*/
//# sourceMappingURL=engine.js.map
