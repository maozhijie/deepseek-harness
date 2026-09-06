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
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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
function safeFilename(name2) {
  return [...name2].map((c) => FW_MAP[c] ?? c).join("");
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
      get learnhubConfigPath() {
        return `${this.centerStateDir}/learnhub.json`;
      }
      get genJobsPath() {
        return `${this.centerStateDir}/\u751F\u6210\u4EFB\u52A1.json`;
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
        const name2 = parts.shift();
        switch (name2) {
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
            onError(0, `Unknown directive ${name2}`, true);
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
        const name2 = `${prefix}${i}`;
        if (!exclude.has(name2))
          return name2;
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
        const name2 = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name2} value`);
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
      createAlias(node, name2) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name2 || prev.has(name2) ? anchors.findNewAnchor(name2 || "a", prev) : name2;
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
      constructor(name2, pos, code, message) {
        super();
        this.name = name2;
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
        const { start, key, sep: sep2, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep2?.[0],
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
          if (!keyProps.anchor && !keyProps.tag && !sep2) {
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
        const valueProps = resolveProps.resolveProps(sep2 ?? [], {
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
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep2, null, valueProps, onError);
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
        let sep2 = "";
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
                comment += sep2 + cb;
              sep2 = "";
              break;
            }
            case "newline":
              if (comment)
                sep2 += source;
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
        const { start, key, sep: sep2, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep2?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep2 && !value) {
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
        if (!isMap && !sep2 && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep2, null, props, onError);
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
          const valueProps = resolveProps.resolveProps(sep2 ?? [], {
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
              if (sep2)
                for (const st of sep2) {
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
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep2, null, valueProps, onError) : null;
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
        const name2 = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name2} must end with a ${expectedEnd}` : `${name2} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
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
      let sep2 = "";
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
          value += sep2 + indent.slice(trimIndent) + content;
          sep2 = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep2 === " ")
            sep2 = "\n";
          else if (!prevMoreIndented && sep2 === "\n")
            sep2 = "\n\n";
          value += sep2 + indent.slice(trimIndent) + content;
          sep2 = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep2 === "\n")
            value += "\n";
          else
            sep2 = "\n";
        } else {
          value += sep2 + content;
          sep2 = " ";
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
      let sep2 = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match = line.exec(source)) {
        if (match[1] === "") {
          if (sep2 === "\n")
            res += sep2;
          else
            sep2 = "\n";
        } else {
          res += sep2 + match[1];
          sep2 = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep2 + (match?.[1] ?? "");
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
    function stringifyItem({ start, key, sep: sep2, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep2)
        for (const st of sep2)
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
          let sep2;
          if (scalar.end) {
            sep2 = scalar.end;
            sep2.push(this.sourceToken);
            delete scalar.end;
          } else
            sep2 = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep: sep2 }]
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
                  const sep2 = it.sep;
                  sep2.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep: sep2 }]
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
            const sep2 = fc.end.splice(1, fc.end.length);
            sep2.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep: sep2 }]
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
      /** 模型/agent 输出解析入口：先剥掉可能包裹整段输出的 markdown 代码围栏（```yaml 等
       * 任意语言标记）再 parse——提示词虽要求「不要围栏」，但高频违反，解析边界统一容忍；
       * 围栏未闭合时剥掉首行围栏后照常 parse，让后续 schema 校验给出可读错误。
       * 盘上手写文件（注册表/题库/图数据/笔记）不是模型输出，仍用 parse。 */
      parseModel: (text) => {
        const lines = text.trim().split("\n");
        if (lines[0]?.startsWith("```")) lines.shift();
        if (lines.length > 0 && lines[lines.length - 1].trimEnd() === "```") lines.pop();
        return (0, import_yaml.parse)(lines.join("\n").trim());
      },
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
          ...rec.xp !== void 0 ? { xp: rec.xp } : {},
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
          ...rec.feedback ? { feedback: rec.feedback } : {},
          ...rec.elapsed_s !== void 0 ? { elapsed_s: Math.round(rec.elapsed_s * 10) / 10 } : {},
          ...rec.xp !== void 0 ? { xp: rec.xp } : {}
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
        const { readdir: readdir5 } = await import("node:fs/promises");
        let max = 0;
        for (const f of await readdir5(dir)) {
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

// src/index.ts
import { createUserMessage, ReasoningEffortId } from "@deepseek-ai/dsh-llm";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { existsSync as existsSync7 } from "node:fs";
import { readFile as readFile11, appendFile as appendFile2, mkdir as mkdir9 } from "node:fs/promises";
import { join as join3, resolve as resolvePath, sep } from "node:path";
import { fileURLToPath } from "node:url";

// src/engine/index.ts
init_paths();
import { existsSync as existsSync6 } from "node:fs";
import { mkdir as mkdir8, readdir as readdir4, readFile as readFile10, rename as rename3, writeFile as writeFile8 } from "node:fs/promises";

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

// src/engine/types.ts
var STAGES = ["unseen", "ready", "learning", "review", "mastered", "skipped"];
var BLOOM_LEVELS = ["\u8BB0\u5FC6", "\u7406\u89E3", "\u5E94\u7528", "\u5206\u6790", "\u8BC4\u4EF7", "\u521B\u9020"];

// src/engine/graph.ts
var NODE_KEYS = /* @__PURE__ */ new Set(["name", "pre", "opt", "note", "enc", "est", "type", "bloom", "difficulty"]);
var NODE_TYPES = /* @__PURE__ */ new Set(["practice"]);
var SchemaError = class extends Error {
};
function fail(path, msg) {
  throw new SchemaError(`${path.replace(/[/\\]/g, "/").split("/").pop()}: ${msg}`);
}
function parseEnc(raw, path, where, name2) {
  if (!Array.isArray(raw)) fail(path, `${where}[${name2}] enc \u5FC5\u987B\u662F\u5217\u8868`);
  const out = [];
  for (const item of raw) {
    if (typeof item === "string") {
      out.push({ node: item, w: 1 });
    } else if (typeof item === "object" && item !== null) {
      const e = item;
      const t = e.node;
      if (typeof t !== "string" || !t.trim()) fail(path, `${where}[${name2}] enc \u6761\u76EE\u7F3A node`);
      const w = e.w ?? 1;
      if (typeof w !== "number" || !(w >= 0 && w <= 1)) fail(path, `${where}[${name2}] enc \u6743\u91CD w \u5FC5\u987B\u662F 0\u20131 \u7684\u6570`);
      const entry = { node: t, w };
      if (e.note !== void 0) {
        if (typeof e.note !== "string") fail(path, `${where}[${name2}] enc note \u5FC5\u987B\u662F\u5B57\u7B26\u4E32`);
        entry.note = e.note;
      }
      const unknown = Object.keys(e).filter((k) => !["node", "w", "note"].includes(k));
      if (unknown.length) fail(path, `${where}[${name2}] enc \u6761\u76EE\u542B\u672A\u77E5\u5B57\u6BB5 ${JSON.stringify(unknown)}`);
      out.push(entry);
    } else {
      fail(path, `${where}[${name2}] enc \u6761\u76EE\u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u6216\u6620\u5C04`);
    }
  }
  return out;
}
function parseNode(raw, path, where) {
  if (typeof raw !== "object" || raw === null) fail(path, `${where} \u8282\u70B9\u5FC5\u987B\u662F\u6620\u5C04`);
  const r = raw;
  const unknown = Object.keys(r).filter((k) => !NODE_KEYS.has(k));
  if (unknown.length) fail(path, `${where} \u542B\u672A\u77E5\u5B57\u6BB5 ${JSON.stringify(unknown)}\uFF08\u53EA\u5141\u8BB8 name/pre/opt/note/enc/est/type\uFF09`);
  const name2 = r.name;
  if (typeof name2 !== "string" || !name2.trim()) fail(path, `${where} \u8282\u70B9 name \u7F3A\u5931\u6216\u4E3A\u7A7A`);
  const pre = r.pre ?? [];
  if (!Array.isArray(pre) || pre.some((p) => typeof p !== "string")) fail(path, `${where}[${name2}] pre \u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u5217\u8868`);
  const opt = r.opt ?? false;
  if (typeof opt !== "boolean") fail(path, `${where}[${name2}] opt \u5FC5\u987B\u662F\u5E03\u5C14\u503C`);
  const note = r.note ?? "";
  if (typeof note !== "string") fail(path, `${where}[${name2}] note \u5FC5\u987B\u662F\u5B57\u7B26\u4E32`);
  const enc = parseEnc(r.enc ?? [], path, where, name2);
  const node = { name: name2.trim(), pre, opt, note, enc };
  if (r.est !== void 0) {
    const est = Number(r.est);
    if (!Number.isFinite(est) || est <= 0) fail(path, `${where}[${node.name}] est \u5FC5\u987B\u662F\u6B63\u6570\uFF08\u5206\u949F\uFF09`);
    node.est = Math.round(est);
  }
  if (r.type !== void 0) {
    const type = String(r.type);
    if (!NODE_TYPES.has(type)) fail(path, `${where}[${node.name}] type \u53EA\u5141\u8BB8 practice`);
    node.type = type;
  }
  if (r.bloom !== void 0) {
    if (!BLOOM_LEVELS.includes(String(r.bloom))) {
      fail(path, `${where}[${node.name}] bloom \u975E\u6CD5\uFF08\u5141\u8BB8 ${BLOOM_LEVELS.join("/")}\uFF09`);
    }
    node.bloom = r.bloom;
  }
  if (r.difficulty !== void 0) {
    const difficulty = Number(r.difficulty);
    if (![1, 2, 3, 4, 5].includes(difficulty)) fail(path, `${where}[${node.name}] difficulty \u5FC5\u987B\u662F 1-5`);
    node.difficulty = difficulty;
  }
  return node;
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
  /** Region → YAML 文本（节点字段按 name/pre/opt/note/est/type/bloom/difficulty/enc 顺序，省空值）。 */
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
          if (n.est !== void 0) doc.est = n.est;
          if (n.type) doc.type = n.type;
          if (n.bloom) doc.bloom = n.bloom;
          if (n.difficulty !== void 0) doc.difficulty = n.difficulty;
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
          if (node.est !== void 0) this.estOf[n] = node.est;
          if (node.type) this.typeOf[n] = node.type;
          if (node.bloom) this.bloomOf[n] = node.bloom;
          if (node.difficulty !== void 0) this.difficultyOf[n] = node.difficulty;
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
  /** name → 标称学习时长（分钟；未标注的节点不在表内）。 */
  estOf = {};
  /** name → 节点类型（practice 交互实践；普通节点不在表内）。 */
  typeOf = {};
  /** name → Bloom 认知层级（可选字段；未标注的节点不在表内）。 */
  bloomOf = {};
  /** name → 难度 1-5（可选字段；未标注的节点不在表内）。 */
  difficultyOf = {};
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
var FSRS_DIFFICULTY_MID = 5;
var XP_BASE = {
  single_choice: 1,
  true_false: 1,
  fill_in_blank: 2,
  reflection: 3,
  multi_choice: 1,
  numeric: 2,
  ordering: 2,
  matching: 2,
  open_question: 3
};
var XP_GUESS_SECONDS = 5;
var XP_GUESS_PENALTY = -1;
var XP_PERFECT_BONUS = 2;
var XP_PER_NODE_DEFAULT = 12;
var DAILY_XP_GOAL_DEFAULT = 30;

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
function applyRatingBlock(fsOld, ratingNum, today, sched) {
  const pseudo = {
    node: "",
    stage: fsOld?.reps ? "review" : "ready",
    fsrs: fsOld,
    mastery: 0,
    content: { version: 0, generated_at: null, status: "draft" },
    practice: { attempts: 0, correct: 0 }
  };
  const { fs, meta } = applyRating(pseudo, ratingNum, today, sched);
  return { fs, kind: meta.kind };
}
function masteryValue(fs, practice, ema) {
  const sComp = fs && fs.reps ? Math.min(1, fs.stability / (S_MASTER * 2)) : 0;
  if (practice.attempts >= 1 && ema && ema > 0) {
    return Math.round((0.7 * sComp + 0.3 * ema) * 100) / 100;
  }
  if (practice.attempts >= 3) {
    const acc = practice.correct / practice.attempts;
    return Math.round((0.7 * sComp + 0.3 * acc) * 100) / 100;
  }
  return Math.round(sComp * 100) / 100;
}
function masteryOfFm(fm) {
  return masteryValue(fm?.fsrs ?? null, fm?.practice ?? { attempts: 0, correct: 0 }, fm?.practice_ema);
}

// src/engine/audit.ts
init_notes();
init_dates();

// src/engine/health.ts
var ACTION_WORDS = [
  "\u89E3",
  "\u6C42",
  "\u8BC1\u660E",
  "\u63A8\u5BFC",
  "\u8BA1\u7B97",
  "\u8FA8\u6790",
  "\u5EFA\u7ACB",
  "\u6BD4\u8F83",
  "\u5224\u5B9A",
  "\u6784\u9020",
  "\u533A\u5206",
  "\u5E94\u7528",
  "\u9A8C\u8BC1",
  "\u5316\u7B80",
  "\u53D8\u5F62",
  "\u8F6C\u5316",
  "\u4F30\u8BA1",
  "\u8FD1\u4F3C",
  "\u68C0\u9A8C",
  "\u5206\u7C7B",
  "\u5F52\u7EB3",
  "\u62BD\u8C61",
  "\u8BAD\u7EC3",
  "\u8BBE\u8BA1",
  "\u5B9E\u73B0",
  "\u7ED8\u5236",
  "\u5224\u65AD",
  "\u8BC4\u4F30",
  "\u9884\u6D4B",
  "\u4F18\u5316",
  "\u5217\u4E3E",
  "\u63CF\u8FF0",
  "\u89E3\u91CA",
  "\u5206\u6790",
  "\u9009\u62E9",
  "\u8F6C\u6362",
  "\u8BC6\u522B",
  "\u638C\u63E1",
  "\u7406\u89E3"
];
var clamp01 = (v) => Math.min(1, Math.max(0, v));
function graphHealthScore(graph) {
  const names = graph.names;
  const actionHits = names.filter((n) => ACTION_WORDS.some((w) => n.includes(w))).length;
  const actionNaming = names.length ? actionHits / names.length * 20 : 0;
  const estCoverage = names.length ? Object.keys(graph.estOf).length / names.length * 20 : 0;
  const floats = names.filter((n) => (graph.depth[n] ?? 0) > 1 && graph.preOf[n].length === 0).length;
  const preCompleteness = names.length ? (1 - floats / names.length) * 20 : 0;
  const inner = names.filter((n) => graph.preOf[n].length > 0);
  const avgPre = inner.length ? inner.reduce((s, n) => s + graph.preOf[n].length, 0) / inner.length : 0;
  const convergence = graph.hasCycle || !inner.length ? 0 : 20 * clamp01((avgPre - 1) / 1);
  const uniq = [...graph.nset].sort((a, b) => a.length - b.length);
  let aliasHits = 0;
  for (let i = 0; i < uniq.length; i++) {
    if (uniq[i].length < 3) continue;
    for (let j = i + 1; j < uniq.length; j++) {
      if (uniq[i] !== uniq[j] && uniq[j].includes(uniq[i])) aliasHits++;
    }
  }
  const aliasAllowance = Math.max(1, Math.ceil(names.length / 50));
  let hygiene = 20;
  hygiene -= Math.min(10, Math.floor(aliasHits / aliasAllowance) * 2);
  hygiene -= Math.min(6, Math.max(0, graph.components.length - 1) * 3);
  hygiene -= names.length > 0 && graph.roots.length === 0 ? 4 : 0;
  const structureHygiene = Math.max(0, hygiene);
  const breakdown = {
    action_naming: Math.round(actionNaming * 10) / 10,
    est_coverage: Math.round(estCoverage * 10) / 10,
    pre_completeness: Math.round(preCompleteness * 10) / 10,
    convergence: Math.round(convergence * 10) / 10,
    structure_hygiene: structureHygiene
  };
  const score = Math.min(100, Math.round(Object.values(breakdown).reduce((s, v) => s + v, 0)));
  return { score, breakdown };
}

// src/engine/audit.ts
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
  const maxDepth = names.length ? Math.max(...names.map((n) => depth[n] ?? 0)) : 0;
  const r1Depth = hasCycle ? 5 : Math.max(5, Math.round(maxDepth / 4));
  const r1 = graph.leaves.filter((n) => !hasCycle && (depth[n] ?? 0) <= r1Depth);
  for (const n of r1.slice(0, 15)) warns.push(`R1 \u6D45\u53F6\u5B50: [${name2region[n]}] ${n}\uFF08depth=${depth[n]}\uFF0C\u9608\u503C ${r1Depth}\uFF09`);
  if (r1.length > 15) warns.push(`R1 \u6D45\u53F6\u5B50\u53E6\u6709\u591A ${r1.length - 15} \u5904\u672A\u5217\u51FA`);
  const r2 = names.filter((n) => {
    const ps = preOf[n];
    return ps.length === 1 && depth[ps[0]] !== void 0 && depth[ps[0]] <= 1 && depth[n] !== void 0 && !graph.succ[n].length;
  });
  for (const n of r2.slice(0, 15)) warns.push(`R2 \u5355\u6D45\u524D\u7F6E\u53F6\u5B50: ${n} \u4EC5\u4F9D\u8D56 ${preOf[n][0]}\uFF08depth=${depth[n]}\uFF09`);
  if (r2.length > 15) warns.push(`R2 \u5355\u6D45\u524D\u7F6E\u53F6\u5B50\u53E6\u6709\u591A ${r2.length - 15} \u5904\u672A\u5217\u51FA`);
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
  if (aliasHits.length) {
    infos.push("R9 \u7591\u4F3C\u522B\u540D/\u5305\u542B\u547D\u540D: " + aliasHits.slice(0, 15).join("\uFF1B") + (aliasHits.length > 15 ? `\uFF1B\u53E6\u6709\u591A ${aliasHits.length - 15} \u5BF9\u672A\u5217\u51FA` : ""));
  }
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
  const jumps = /* @__PURE__ */ new Set();
  for (const n of names) {
    const d = graph.difficultyOf[n];
    if (d === void 0) continue;
    const est = graph.estOf[n];
    if (est !== void 0 && (d >= 4 && est < 15 || d <= 2 && est > 40)) {
      infos.push(`R12 \u8BA4\u77E5-\u65F6\u957F\u5931\u914D: ${n}\uFF08\u96BE\u5EA6${d}\uFF0Cest=${est}\u5206\u949F\uFF09`);
    }
    for (const p of preOf[n]) {
      if (!nset.has(p)) continue;
      const dp = graph.difficultyOf[p];
      if (dp !== void 0 && Math.abs(d - dp) >= 2) jumps.add(`${p}\uFF08\u96BE\u5EA6${dp}\uFF09-> ${n}\uFF08\u96BE\u5EA6${d}\uFF09`);
    }
  }
  for (const j of [...jumps].sort().slice(0, 15)) {
    warns.push(`R11 \u96BE\u5EA6\u8DF3\u8DC3\uFF08\u7591\u4F3C\u7F3A\u4E2D\u95F4\u53F0\u9636\uFF09: ${j}`);
  }
  if (jumps.size > 15) warns.push(`R11 \u96BE\u5EA6\u8DF3\u8DC3\u53E6\u6709\u591A ${jumps.size - 15} \u5904\u672A\u5217\u51FA`);
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
    \u56FE\u8C31\u5065\u5EB7\u5206: graphHealthScore(graph).score,
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
  const nodes = graph.names.map((n) => {
    const fm = state[n];
    return {
      data: {
        id: n,
        region: graph.blockOf[n][1],
        block: graph.blockOf[n][2],
        depth: graph.depth[n] ?? 0,
        stage: effectiveStage(state, n),
        opt: graph.opt.has(n),
        mastery: masteryOfFm(fm),
        ...graph.typeOf[n] ? { type: graph.typeOf[n] } : {}
      }
    };
  });
  const edges = [
    ...graph.edges.map(([u, v]) => ({ data: { id: `${u}->${v}`, source: u, target: v, kind: "pre" } })),
    ...Object.entries(graph.encOf).flatMap(([u, list]) => list.map(([v, w]) => ({ data: { id: `${u}~enc~${v}`, source: u, target: v, kind: "enc", w } })))
  ];
  const schema = Object.fromEntries(graph.names.map((n) => [n, {
    pre: graph.preOf[n],
    enc: (graph.encOf[n] ?? []).map(([node, w]) => ({ node, w })),
    opt: graph.opt.has(n),
    ...graph.estOf[n] !== void 0 ? { est: graph.estOf[n] } : {},
    ...graph.typeOf[n] ? { type: graph.typeOf[n] } : {},
    ...graph.bloomOf[n] ? { bloom: graph.bloomOf[n] } : {},
    ...graph.difficultyOf[n] !== void 0 ? { difficulty: graph.difficultyOf[n] } : {},
    ...graph.noteOf[n] ? { note: graph.noteOf[n] } : {}
  }]));
  const blockStats = /* @__PURE__ */ new Map();
  for (const n of graph.names) {
    const [, region, block] = graph.blockOf[n];
    const key = `${region}
${block}`;
    const s = blockStats.get(key) ?? { region, block, nodes: 0, preSum: 0 };
    s.nodes++;
    s.preSum += graph.preOf[n].length;
    blockStats.set(key, s);
  }
  const blocks = [...blockStats.values()];
  const sugCap = Math.min(16, Math.max(8, Math.ceil(graph.names.length / 25)));
  const expandBlocks = blocks.filter((b) => b.nodes < 5).sort((a, b) => a.nodes - b.nodes || a.region.localeCompare(b.region)).slice(0, sugCap).map(({ region, block, nodes: nodes2 }) => ({ region, block, nodes: nodes2 }));
  const missingPre = graph.names.filter((n) => (graph.depth[n] ?? 0) > 1 && graph.preOf[n].length === 0).slice(0, sugCap);
  const unconverged = blocks.map((b) => ({ ...b, avg_pre: Math.round(b.preSum / b.nodes * 100) / 100 })).filter((b) => b.avg_pre < 1.5).sort((a, b) => a.avg_pre - b.avg_pre).slice(0, sugCap).map(({ region, block, avg_pre }) => ({ region, block, avg_pre }));
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
    health: graphHealthScore(graph),
    suggestions: { expand_blocks: expandBlocks, missing_pre: missingPre, unconverged },
    schema,
    nodes,
    edges
  };
}

// src/engine/content.ts
init_yaml();
init_dates();
init_notes();
import { readFile as readFile6, writeFile as writeFile5, mkdir as mkdir5, readdir as readdir3 } from "node:fs/promises";
import { existsSync as existsSync2 } from "node:fs";

// shared/content-renderers.ts
var INTERACTIVE_TYPES = ["simulation", "visualization3d", "diagram", "game", "code"];
var RENDERERS = [
  {
    lang: "mermaid",
    label: "Mermaid \u56FE",
    hint: "\u6D41\u7A0B\u56FE\u3001\u65F6\u5E8F\u56FE\u3001\u72B6\u6001\u56FE\u7B49\u77E2\u91CF\u793A\u610F\u56FE",
    example: "```mermaid\ngraph LR\nA[\u6982\u5FF5] --> B[\u5E94\u7528]\n```"
  },
  {
    lang: "math",
    label: "\u6570\u5B66\u516C\u5F0F",
    hint: "KaTeX \u6392\u7248\uFF1B\u884C\u5185 $...$\u3001\u72EC\u7ACB\u6210\u884C $$...$$\uFF0C\u76F4\u63A5\u5199\u5728\u6B63\u6587\u91CC\uFF0C\u4E0D\u7528\u4EE3\u7801\u5757",
    example: "\u884C\u5185 $E = mc^2$\uFF1B\u72EC\u7ACB\u516C\u5F0F $$\\int_0^1 x^2\\,dx = \\tfrac{1}{3}$$"
  },
  {
    lang: "media",
    label: "\u97F3\u89C6\u9891",
    hint: "\u4EE3\u7801\u5757\u5185\u6BCF\u884C\u5199\u4E00\u4E2A vault \u76F8\u5BF9\u5A92\u4F53\u8DEF\u5F84\uFF0C\u6309\u6269\u5C55\u540D\u6E32\u67D3\u4E3A\u89C6\u9891/\u97F3\u9891\u64AD\u653E\u5668",
    example: "```media\n<\u8BFE\u7A0B\u6839>/\u8BFE\u7A0B\u56FE/demo.mp4\n```"
  },
  {
    lang: "interactive",
    label: "\u4EA4\u4E92\u6A21\u62DF",
    hint: "\u4EE3\u7801\u5757\u5185\u5199\u4E00\u4E2A vault \u76F8\u5BF9 HTML \u8DEF\u5F84\uFF08\u81EA\u5305\u542B\u4EA4\u4E92\u4EF6\uFF0C\u7981\u5916\u8054\uFF09\uFF0C\u9762\u677F\u5185\u5D4C\u6C99\u7BB1\u6E32\u67D3\uFF1B\u4EA4\u4E92\u4EF6\u7ED3\u5C3E\u5E94 postMessage({type:'LEARNHUB_COMPLETE'},'*') \u4E0A\u62A5\u5B8C\u6210",
    example: "```interactive\n<\u8BFE\u7A0B\u6839>/\u4EA4\u4E92/\u5355\u6446\u6A21\u62DF.html\n```"
  },
  {
    lang: "svg",
    label: "SVG \u793A\u610F\u56FE",
    hint: "\u7CBE\u786E\u9759\u6001\u793A\u610F\u56FE\uFF08\u51E0\u4F55\u56FE\u5F62/\u5411\u91CF/\u5750\u6807\u7CFB/\u7ED3\u6784\u56FE\u793A\uFF09\uFF1A\u5B8C\u6574\u624B\u5199 SVG\uFF0C\u53EF\u76F4\u63A5\u5185\u8054 <animate>/<animateTransform> \u505A\u52A8\u753B\uFF1B\u9762\u677F\u6E05\u6D17\u540E\u6E32\u67D3\uFF0C\u7981 <script> \u4E0E\u5916\u90E8\u5F15\u7528",
    example: '```svg\n<svg viewBox="0 0 220 120" xmlns="http://www.w3.org/2000/svg">\n  <line x1="10" y1="100" x2="210" y2="100" stroke="#86909c" stroke-width="1"/>\n  <path d="M10 100 Q80 10 200 40" fill="none" stroke="#165dff" stroke-width="2"/>\n  <circle cx="200" cy="40" r="3" fill="#f53f3f"/>\n  <text x="180" y="30" font-size="12">P</text>\n</svg>\n```'
  },
  {
    lang: "plot",
    label: "\u51FD\u6570\u56FE\u50CF/\u5750\u6807\u51E0\u4F55",
    hint: "\u6570\u5B66\u5750\u6807\u56FE\uFF1AJSON spec\uFF08xRange/yRange + elements\uFF09\u58F0\u660E\u6570\u5B66\u5BF9\u8C61\uFF08\u51FD\u6570/\u53C2\u6570\u66F2\u7EBF/\u70B9/\u5411\u91CF/\u7EBF\u6BB5/\u5706/\u591A\u8FB9\u5F62\uFF09\uFF0C\u9762\u677F\u7528\u5750\u6807\u7CFB\u6E32\u67D3\u2014\u2014\u6A21\u578B\u53EA\u7ED9\u6570\u5B66\u5BF9\u8C61\uFF0C\u4E0D\u5199\u50CF\u7D20",
    example: '```plot\n{ "xRange": [-4, 4], "yRange": [-3, 3],\n  "elements": [\n    { "type": "fn", "expr": "sin(x)", "label": "f(x)" },\n    { "type": "vector", "tail": [0, 0], "head": [1.57, 1], "label": "v" },\n    { "type": "point", "x": 1.57, "y": 1, "label": "P" } ] }\n```'
  },
  {
    lang: "chart",
    label: "\u6570\u636E\u56FE\u8868",
    hint: "\u6570\u636E\u53EF\u89C6\u5316\uFF1A\u6807\u51C6 ECharts option JSON\uFF08series \u9650 line/bar/pie/scatter\uFF09\uFF0C\u9762\u677F\u6309\u9700\u6E32\u67D3\uFF08\u81EA\u5E26\u52A8\u753B\uFF09\uFF1B\u7981\u5916\u90E8 URL",
    example: '```chart\n{ "xAxis": { "type": "category", "data": ["\u5468\u4E00","\u5468\u4E8C","\u5468\u4E09","\u5468\u56DB","\u5468\u4E94"] },\n  "yAxis": { "type": "value" },\n  "series": [ { "type": "line", "name": "\u590D\u4E60\u91CF", "data": [4, 7, 5, 9, 12], "smooth": true } ] }\n```'
  }
];
var SECTION_TYPES = [
  { prefix: "\u6982\u5FF5", label: "\u6982\u5FF5", rule: "\u53EA\u8BB2\u4E00\u4E2A\u77E5\u8BC6\u70B9\uFF1A\u52A8\u673A\u878D\u8FDB\u884C\u6587\uFF08\u4E0D\u8BBE\u680F\u76EE\u5316\u6807\u9898\uFF09\uFF0C\u5B9A\u4E49 \u2192 \u6700\u5C0F\u793A\u4F8B" },
  { prefix: "\u4F8B\u9898", label: "\u4F8B\u9898", rule: "\u5B8C\u6574 worked example\uFF1A\u9898\u76EE \u2192 \u5206\u6B65\u89E3\u7B54 \u2192 \u53C2\u8003\u7B54\u6848" },
  { prefix: "\u6F14\u793A", label: "\u6F14\u793A", rule: "\u53EF\u89C6\u5316\u627F\u8F7D\u4E3B\u8981\u4FE1\u606F\uFF08\u56FE\u8868/\u56FE\u7247/\u52A8\u753B/\u4EA4\u4E92\uFF09\uFF0C\u6587\u5B57\u53EA\u4F5C\u65C1\u6CE8" },
  { prefix: "\u5C0F\u7ED3", label: "\u5C0F\u7ED3", rule: "\u8981\u70B9\u56DE\u987E\u4E0E\u6613\u9519\u70B9\u6E05\u5355" },
  { prefix: "\u7EC3\u4E60", label: "\u7EC3\u4E60", rule: "\u672C\u8282\u4E3A\u9898\u7EC4\uFF1A\u9898\u76EE\u7531\u9898\u5E93\u63D0\u4F9B\uFF0C\u6B63\u6587\u53EA\u5199\u80FD\u529B\u76EE\u6807\u4E0E\u4F5C\u7B54\u5F15\u5BFC\uFF08\u2264120 \u5B57\uFF09\uFF0C\u4E0D\u5199\u9898" },
  { prefix: "\u4EA4\u4E92", label: "\u4EA4\u4E92", rule: "\u4E00\u8282 = \u4E00\u4E2A\u4EA4\u4E92\u6A21\u62DF + \u5C11\u91CF\u65C1\u6CE8\uFF1A\u6B63\u6587\u7528 learnhub-interactive \u6807\u8BB0\u5757\u5185\u8054\u5199\u5B8C\u6574\u81EA\u5305\u542B HTML" }
];
function parseSectionTitle(title) {
  const m = title.match(/^(.+?)[:：]\s*(.+)$/);
  const hit = m ? SECTION_TYPES.find((t) => t.prefix === m[1].trim()) : void 0;
  if (hit && m) return { type: hit, clean: m[2].trim() };
  return { type: SECTION_TYPES[0], clean: title.trim() };
}
function rendererCapabilityBlock() {
  const out = ["## \u9762\u677F\u652F\u6301\u7684\u6E32\u67D3\u683C\u5F0F\uFF08\u53EA\u80FD\u4F7F\u7528\u4E0B\u5217\u683C\u5F0F\uFF1B\u672A\u5217\u51FA\u7684\u683C\u5F0F\u9762\u677F\u65E0\u6CD5\u6E32\u67D3\uFF0C\u5199\u4E86\u7B49\u4E8E\u6CA1\u5199\uFF09", ""];
  for (const r of RENDERERS) {
    out.push(`- **${r.label}**\uFF1A${r.hint}\u3002\u5199\u6CD5\uFF1A`, "", r.example, "");
  }
  out.push("- **\u56FE\u7247/\u52A8\u753B**\uFF1A`![[<\u8BFE\u7A0B\u6839>/\u8BFE\u7A0B\u56FE/xx.png]]`\uFF08\u652F\u6301 png/jpg/webp/gif/svg\uFF0C\u8DEF\u5F84\u76F8\u5BF9 vault \u6839\uFF09", "");
  out.push(
    "- **\u4EA4\u4E92\u6A21\u62DF\uFF08\u300C\u4EA4\u4E92\u300D\u8282\u5185\u8054\u521B\u4F5C\uFF09**\uFF1A\u6B63\u6587\u76F4\u63A5\u7528\u6807\u8BB0\u5757\u5199\u5B8C\u6574 HTML\uFF0C\u7CFB\u7EDF\u843D\u76D8\u4E3A\u72EC\u7ACB\u6587\u4EF6\u5E76\u66FF\u6362\u4E3A\u5F15\u7528\u5757\uFF1A",
    "",
    "```learnhub-interactive:\u4EA4\u4E92/<\u8BED\u4E49\u5316\u540D\u79F0>.html",
    "<!DOCTYPE html>\u2026\u5B8C\u6574\u81EA\u5305\u542B HTML\u2026",
    "```",
    "",
    "  \u786C\u6027\u8981\u6C42\uFF1A\u5355\u6587\u4EF6\u81EA\u5305\u542B\uFF08\u5168\u90E8 CSS/JS \u5185\u8054\uFF0C\u7981\u5916\u90E8\u8D44\u6E90\u4E0E\u7F51\u7EDC\u8BF7\u6C42\uFF0C\u56FE\u5F62\u7528 canvas/SVG/DOM \u7ED8\u5236\uFF09\uFF1B\u8FBE\u6210\u6A21\u62DF\u76EE\u6807\u65F6\u7ED3\u5C3E\u4E0A\u62A5 `<script>window.parent.postMessage({type:'LEARNHUB_COMPLETE', score: <0-1 \u6210\u7EE9>, detail: '\u4E00\u53E5\u8BDD\u7ED3\u8BBA'},'*')</script>`\u3002",
    ""
  );
  return out.join("\n");
}
var PLAIN_CODE_LANGS = /* @__PURE__ */ new Set([
  "text",
  "plain",
  "txt",
  "code",
  "yaml",
  "yml",
  "json",
  "bash",
  "sh",
  "shell",
  "python",
  "py",
  "js",
  "javascript",
  "ts",
  "typescript",
  "sql",
  "java",
  "c",
  "cpp",
  "html",
  "css",
  "xml",
  "md",
  "markdown",
  "diff",
  "none",
  ""
]);

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
    const isPractice = graph.typeOf[node] === "practice";
    const out = [];
    out.push(`# \u751F\u6210\u4E0A\u4E0B\u6587\u5305\uFF1A${node}`, "");
    out.push("## 1. \u76EE\u6807\u8282\u70B9");
    out.push(`- \u540D\u79F0\uFF1A${node} \uFF5C \u533A/\u5757\uFF1A${region} \xB7 ${block} \uFF5C \u6DF1\u5EA6\uFF1A${dSelf}${isPractice ? " \uFF5C \u7C7B\u578B\uFF1A\u4EA4\u4E92\u5B9E\u8DF5\uFF08practice\uFF09" : ""}`);
    out.push(`- pre\uFF1A${pres.length ? pres.join("\u3001") : "\uFF08\u65E0\uFF0C\u6839\u8282\u70B9\uFF09"}`);
    if (graph.noteOf[node]) out.push(`- note\uFF1A${graph.noteOf[node]}`);
    out.push("");
    out.push("## 2. \u524D\u7F6E\u6458\u8981\uFF08\u4E0D\u8981\u91CD\u590D\u8BB2\u5DF2\u6559\u5185\u5BB9\uFF1B\u4E0B\u5217\u7ED3\u8BBA\u53EF\u76F4\u63A5\u5F15\u7528\uFF09");
    for (const p of pres) {
      const fm = state[p];
      if (fm && fm.content.version > 0) {
        out.push(`- **${p}**\uFF08\u5DF2\u751F\u6210\uFF09\uFF0C\u5B9E\u9645\u6559\u8FC7\u7684\u8282\uFF1A`);
        const secs = fm.content.sections ?? [];
        if (secs.length) {
          for (const s of secs) out.push(`  - ${s.title}${s.points ? `\uFF08${s.points}\uFF09` : ""}`);
        } else {
          out.push("  - \uFF08\u8282\u6E05\u5355\u7F3A\u5931\uFF0C\u6309\u8282\u70B9\u540D\u7406\u89E3\u5176\u5185\u5BB9\uFF09");
        }
      } else {
        const note = graph.noteOf[p];
        out.push(`- **${p}**\uFF08\u672A\u751F\u6210${note ? `\uFF0Cnote\uFF1A${note}` : ""}\uFF09`);
      }
    }
    out.push("");
    out.push("## 3. \u540E\u7EE7\u9884\u544A\uFF08\u5982\u9700\u6536\u5C3E\u8854\u63A5\uFF0C\u53EF\u5728\u81EA\u7136\u7ED3\u675F\u5904\u4E00\u53E5\u8BDD\u5E26\u8FC7\uFF1B\u4E0D\u8BBE\u56FA\u5B9A\u680F\u76EE\uFF09");
    out.push(succs.length ? succs.join("\u3001") : "\uFF08\u65E0\u540E\u7EE7\uFF0C\u7EC8\u70B9\u8282\u70B9\uFF09");
    out.push("");
    out.push("## 4. \u9886\u57DF\u8FB9\u754C");
    const scope = `\u672C\u8BFE\u5C5E\u4E8E${course ? `\u8BFE\u7A0B\u300C${course}\u300D\u7684` : ""}`;
    out.push(`${scope}\u300C${region} \xB7 ${block}\u300D\u533A\u5757\u3002\u53EA\u8BB2\u672C\u8282\u70B9\u8303\u56F4\u5185\u7684\u5185\u5BB9\uFF1B\u540E\u7EE7\u8282\u70B9\u81F3\u591A\u5728\u81EA\u7136\u6536\u5C3E\u5904\u4E00\u53E5\u8BDD\u5E26\u8FC7\uFF0C\u4E0D\u5C55\u5F00\u3001\u4E0D\u63D0\u524D\u6559\uFF1B\u662F\u5426\u63D0\u53CA\u7531\u4F60\u5224\u65AD\u3002`);
    const forbidden = Object.keys(graph.nset).filter((n) => n !== node && n.length >= 2 && (graph.depth[n] ?? 0) > dSelf).sort((a, b) => (graph.depth[b] ?? 0) - (graph.depth[a] ?? 0)).slice(0, 200);
    out.push("");
    out.push("## 5. \u7981\u6B62\u4F7F\u7528\u7684\u6982\u5FF5\uFF08\u672A\u5B66\uFF0C\u4E0D\u5F97\u51FA\u73B0\u3001\u4E0D\u5F97\u5F15\u7528\u5176\u7ED3\u8BBA\uFF09");
    out.push(forbidden.length ? forbidden.join("\u3001") : "\uFF08\u65E0\uFF1A\u672C\u8282\u70B9\u5DF2\u662F\u56FE\u5185\u6700\u6DF1\uFF09");
    out.push("");
    out.push("## 6. \u89C4\u8303\u7EA6\u675F");
    out.push("- \u522B\u540D\u7EDF\u4E00\u8868\uFF1A\u9E3D\u5DE2\u539F\u7406\uFF08\u975E\u62BD\u5C49\u539F\u7406\uFF09\u3001\u52FE\u80A1\u5B9A\u7406\uFF08\u975E\u6BD5\u8FBE\u54E5\u62C9\u65AF\u5B9A\u7406\uFF09\u3001\u4F59\u5F26\u5B9A\u7406\uFF08\u975E\u963F\u5C14\xB7\u5361\u897F\u5B9A\u7406\uFF09\u2014\u2014\u5B8C\u6574\u8868\u89C1 \u7406\u5FF5\u4E0E\u89C4\u8303.md \xA78");
    out.push("- \u98CE\u683C\uFF1A\u6210\u4EBA\u81EA\u5B66\u8005\uFF1B\u76F4\u89C9\u5148\u4E8E\u4E25\u683C\u3001\u5177\u4F53\u5148\u4E8E\u62BD\u8C61\u3001\u6280\u80FD\u5148\u4E8E\u5F62\u5F0F\u5316");
    out.push(isPractice ? "- \u7BC7\u5E45\uFF1A\u8BF4\u660E\u6587\u5B57 \u2264 400 \u5B57\uFF1B\u6838\u5FC3\u4EA4\u4ED8\u7269\u662F\u4EA4\u4E92\u6A21\u62DF\uFF08\u89C4\u8303\u89C1 \xA78\uFF09" : "- \u7BC7\u5E45\uFF1A\u6B63\u6587 \u2264 2500 \u5B57\uFF1B\u7EC3\u4E60 \u57FA\u7840 2\u20134 / \u53D8\u5F0F 2\u20133 / \u6311\u6218 0\u20132");
    out.push("- \u5C0F\u8282\uFF1A\u7C7B\u578B\u524D\u7F00 + \u5B9E\u9645\u6807\u9898\uFF08\u7C7B\u578B\u83DC\u5355\u89C1\u63D0\u793A\u8BCD\uFF09\uFF1B\u8282\u7684\u5212\u5206\u3001\u987A\u5E8F\u4E0E\u7C7B\u578B\u914D\u6BD4\u5B8C\u5168\u7531\u4F60\u6309\u5185\u5BB9\u4E0E\u98CE\u683C\u5224\u65AD\uFF0C\u4E0D\u8BBE\u56FA\u5B9A\u680F\u76EE\u4E0E\u56FA\u5B9A\u6536\u5C3E\u6BB5\uFF08\u53EF\u9009\u4FDD\u7559 ## \u5185\u5BB9\u53CD\u9988 \u533A\u6536\u96C6\u5B66\u4E60\u8005\u5EFA\u8BAE\uFF09");
    out.push("");
    out.push("## 7. \u65E2\u6709 enc \u8FB9\uFF08\u7EC3\u4E60\u5FC5\u987B\u771F\u5B9E\u8C03\u7528\u5B83\u4EEC\uFF09");
    out.push(enc.length ? enc.map(([t, w]) => `${t}(w=${w.toFixed(1)})`).join("\u3001") : "\uFF08\u6682\u65E0\uFF09");
    out.push("");
    out.push("## 8. \u4EA4\u4ED8\u8981\u6C42");
    if (isPractice) {
      out.push(_Content.interactiveSpecBlock());
      out.push("- \u672B\u5C3E\u673A\u5668\u5757\uFF1A`<!-- enc_candidates: [] -->`\uFF08\u4EA4\u4E92\u5B9E\u8DF5\u4E0D\u51FA\u7EC3\u4E60\u9898\uFF09");
    } else {
      out.push("- \u7EC3\u4E60\u9898\u4EE5\u9898\u7EC4 YAML \u7ECF learnhub_exercises_gen \u5199\u5165\uFF08\u4E0D\u518D\u76F4\u63A5\u5199\u8FDB\u6B63\u6587\u7EC3\u4E60\u533A\uFF09\uFF1B\u6570\u503C\u9898\u7ED9 tol \u5BB9\u5DEE");
      out.push("- \u9898\u578B\u4F18\u5148 single_choice / true_false / fill_in_blank\uFF08\u53EF\u673A\u5668\u5224\u5377\uFF09\uFF1B\u5F00\u653E\u6027\u95EE\u7B54\u9898\u7528 reflection \u5E76\u5728 answer \u5199\u8BC4\u5206\u8981\u70B9");
      out.push("- \u672B\u5C3E\u673A\u5668\u5757\uFF1A`<!-- enc_candidates: [\u672C\u8BFE\u7EC3\u4E60\u771F\u5B9E\u8C03\u7528\u7684\u524D\u7F6E\u6280\u80FD] -->`");
    }
    return out.join("\n") + "\n";
  }
  // ---- 提示词模板 ----
  /** practice/交互节交互件创作规范（注入上下文包 §8；契约吸收 OpenMAIC 五类交互场景模板经验）。
   * 面板经 /vendor 同源伺服 katex/three（沙箱 CSP 放开 'self'）；交互件内公式由伺服端自动注入
   * KaTeX 渲染（直接写 $…$/$$…$$）；类型菜单与 widget-config 契约见 shared INTERACTIVE_TYPES。 */
  static interactiveSpecBlock() {
    return `### \u4EA4\u4E92\u6A21\u62DF\u521B\u4F5C\u89C4\u8303\uFF08\u672C\u8282\u70B9\u7684\u6838\u5FC3\u4EA4\u4ED8\u7269\uFF09

\u8F93\u51FA\u4E00\u4E2A\u5B8C\u6574\u81EA\u5305\u542B\u7684 HTML \u6587\u6863\uFF0C\u5305\u88F9\u5728\u6807\u8BB0\u5757\u4E2D\uFF08\u7CFB\u7EDF\u4F1A\u843D\u76D8\u4E3A\u72EC\u7ACB\u6587\u4EF6\u5E76\u66FF\u6362\u4E3A\u5F15\u7528\u5757\uFF09\uFF1A

\`\`\`learnhub-interactive:\u4EA4\u4E92/<\u8BED\u4E49\u5316\u540D\u79F0>.html
<!DOCTYPE html>
...\uFF08\u5B8C\u6574 HTML\uFF09
\`\`\`

## \u5FC5\u5907\u5951\u7EA6\uFF08\u6BCF\u7C7B\u4EA4\u4E92\u4EF6\u90FD\u8981\u6EE1\u8DB3\uFF09

1. **widget-config \u5FC5\u586B**\uFF1A<head> \u5185\u5D4C\u7ED3\u6784\u5316\u5143\u6570\u636E\uFF0C\u9762\u677F\u636E\u6B64\u8BC6\u522B\u7C7B\u578B\u2014\u2014
   \`<script type="application/json" id="widget-config">{ "type": "<\u7C7B\u578B>", "description": "\u4E00\u53E5\u8BDD\u8BF4\u660E", "variables": [{ "name": "angle", "label": "\u89D2\u5EA6", "min": 0, "max": 90, "default": 45, "unit": "\xB0" }], "presets": [{ "name": "\u9884\u8BBE\u540D", "state": { "angle": 30 } }] }</script>\`
2. **\u5B8C\u6210\u4E0A\u62A5**\uFF1A\u8FBE\u6210\u6A21\u62DF\u76EE\u6807\u65F6\u5728\u6587\u6863\u672B\u5C3E\u52A0
   \`<script>window.parent.postMessage({type:'LEARNHUB_COMPLETE', score: <0-1 \u53EF\u9009\u6210\u7EE9>, detail: '\u4E00\u53E5\u8BDD\u7ED3\u8BBA'}, '*')</script>\`
3. **AI \u8001\u5E08\u64CD\u4F5C\u63A5\u53E3**\uFF08\u5FC5\u987B\u5B9E\u73B0\uFF1B\u9762\u677F\u300C\u95EE AI \u8001\u5E08\u300D\u4F1A\u5E7F\u64AD LEARNHUB_TEACHER \u6D88\u606F\u9A71\u52A8\u4EA4\u4E92\u4EF6\u6F14\u793A\uFF09\u2014\u2014\u628A\u4E0B\u9762\u6837\u677F\u539F\u6837\u653E\u8FDB\u4F60\u7684 <script>\uFF1A
   \`window.addEventListener('message', function (e) { if (!e.data || e.data.type !== 'LEARNHUB_TEACHER') return; switch (e.data.action) { case 'highlight': { /* e.data.selector \u9AD8\u4EAE\u8BE5\u5143\u7D20 3s */ break } case 'setState': { /* e.data.state: {\u53D8\u91CF\u540D: \u503C} \u5E94\u7528\u5230\u6A21\u62DF */ break } case 'reveal': { /* e.data.selector \u663E\u793A\u9690\u85CF\u5143\u7D20 */ break } case 'annotate': { /* e.data.text \u9876\u90E8\u6279\u6CE8\u6C14\u6CE1 4s */ break } } })\`
   selector \u7528 CSS \u9009\u62E9\u5668\uFF08\u5982 '#angle-slider'\u3001'#canvas'\uFF09\uFF1B\u6BCF\u4E2A case \u5FC5\u987B\u7528\u5757\u4F5C\u7528\u57DF {} \u5305\u88F9\uFF08\u9632\u91CD\u58F0\u660E SyntaxError\uFF09\u3002
4. **\u5355\u6587\u4EF6\u81EA\u5305\u542B**\uFF1A\u5168\u90E8 CSS/JS \u5185\u8054\uFF1B\u7981\u6B62\u5916\u90E8 CDN \u4E0E\u7F51\u7EDC\u8BF7\u6C42\u3002\u6C99\u7BB1\u53EA\u653E\u884C\u540C\u6E90 /learnhub/api/vendor/ \u4E0B\u7684 katex \u4E0E three \u5E93\uFF08\u5199\u6CD5\u89C1 visualization3d\uFF09\uFF1B\u516C\u5F0F\u76F4\u63A5\u5199 $\u2026$/$$\u2026$$\uFF0C\u4F3A\u670D\u7AEF\u81EA\u52A8\u6CE8\u5165 KaTeX \u6E32\u67D3\uFF0C\u65E0\u9700\u624B\u5199\u6E32\u67D3\u4EE3\u7801\u3002
5. **\u72B6\u6001\u673A\u6E05\u6670**\uFF1Arunning/paused/ended \u4E09\u6001\u5206\u79BB\uFF1Breset \u590D\u4F4D**\u6240\u6709**\u72B6\u6001\u53D8\u91CF\uFF1B\u6309\u94AE\u6587\u6848\u4E0E\u70B9\u51FB\u540E\u7684\u52A8\u4F5C\u4E00\u81F4\uFF08\u542F\u52A8/\u6682\u505C/\u7EE7\u7EED/\u91CD\u65B0\u5F00\u59CB\uFF09\u3002
6. **\u52A8\u753B\u5FC5\u987B\u8089\u773C\u53EF\u89C1**\uFF1A\u542F\u52A8\u540E\u5BF9\u8C61\u660E\u663E\u79FB\u52A8/\u65CB\u8F6C/\u53D8\u5316\uFF08requestAnimationFrame\uFF09\uFF0C\u8BA9\u5B66\u4E60\u8005\u4E00\u773C\u786E\u8BA4\u300C\u5728\u52A8\u300D\u3002
7. **\u79FB\u52A8\u7AEF\u53CB\u597D**\uFF1A\u63A7\u5236\u533A\u4E0E\u753B\u5E03\u4E0A\u4E0B\u5806\u53E0\u4E0D\u91CD\u53E0\uFF08320px \u53EF\u7528\uFF09\uFF1B\u89E6\u63A7\u76EE\u6807 \u226544px\uFF1Bcanvas \u7528 ResizeObserver \u81EA\u9002\u5E94\u5BB9\u5668\u3002
8. **\u5B9E\u65F6\u6570\u636E**\u7B49\u5BBD\u5B57\u4F53\u663E\u793A\u5E76\u5E26\u5355\u4F4D\uFF1B\u63A7\u4EF6\u52A0 ARIA \u6807\u7B7E\uFF1B\u753B\u5E03\u6587\u5B57\u9AD8\u5BF9\u6BD4\u3002

## \u7C7B\u578B\u83DC\u5355\uFF08widget-config \u7684 type\uFF0C\u6309\u5185\u5BB9\u9009\u4E00\u4E2A\uFF09

- **simulation**\uFF1A\u8FC7\u7A0B\u4EFF\u771F\uFF08\u7269\u7406/\u5316\u5B66/\u7ECF\u6D4E/\u7B97\u6CD5\u2026\uFF09\u3002\u22652 \u4E2A\u53D8\u91CF\u6ED1\u6746 + \u22652 \u4E2A\u9884\u8BBE\u6309\u94AE\uFF1B\u5E94\u7528\u9884\u8BBE\u5B8C\u6574\u590D\u4F4D\u540E\u8FD0\u884C\uFF1B\u7ED3\u675F\u65F6\u7ED9\u6210\u8D25/\u7ED3\u8BBA\u53CD\u9988\u3002
- **visualization3d**\uFF1A3D \u53EF\u89C6\u5316\uFF08\u51E0\u4F55\u4F53/\u5206\u5B50/\u5929\u4F53/\u7ED3\u6784\u2026\uFF09\u3002\u7528 vendored three\uFF08\u7981\u6B62 CDN\uFF09\uFF1A
  \`<script type="importmap">{ "imports": { "three": "/learnhub/api/vendor/three/build/three.module.js", "three/addons/": "/learnhub/api/vendor/three/examples/jsm/" } }</script>\`
  \u7136\u540E \`import * as THREE from 'three'\`\u3001\`import { OrbitControls } from 'three/addons/controls/OrbitControls.js'\`\u3002
  \u80CC\u666F\u4E0D\u7528\u7EAF\u9ED1\uFF08\u5982 #0a0a1a\uFF09\uFF1B\u73AF\u5883\u5149 \u22650.5 + \u534A\u7403\u5149 + \u4E3B\u5E73\u884C\u5149\u8BA9\u7269\u4F53\u6E05\u6670\u53EF\u89C1\uFF1B\u5FC5\u987B\u7ED9\u653E\u5927/\u7F29\u5C0F\u6309\u94AE\uFF08\u79FB\u52A8\u7AEF\u65E0\u6EDA\u8F6E\uFF09\uFF1BWebGL \u68C0\u6D4B\u5931\u8D25\u663E\u793A\u964D\u7EA7\u63D0\u793A\u3002
- **diagram**\uFF1A\u53EF\u64CD\u4F5C\u56FE\u89E3\uFF08\u601D\u7EF4\u5BFC\u56FE/\u6D41\u7A0B/\u5173\u7CFB\u56FE\u2026\uFF09\u3002\u8282\u70B9\u53EF\u70B9\u51FB\u5C55\u5F00\u7EC6\u8282\uFF0C\u652F\u6301\u589E\u5220/\u8FDE\u7EBF\u66F4\u4F73\u3002
- **game**\uFF1A\u77E5\u8BC6\u5C0F\u6E38\u620F\uFF08\u5206\u7C7B/\u7ADE\u901F/\u62FC\u56FE\u2026\uFF09\u3002\u89C4\u5219 30 \u79D2\u5185\u53EF\u61C2\uFF1B\u8BA1\u5206\u4E0E LEARNHUB_COMPLETE \u7684 score \u4E0A\u62A5\u7ED1\u5B9A\u3002
- **code**\uFF1A\u5728\u7EBF\u7F16\u7A0B\uFF08\u7EAF JS\uFF0C\u4E0D\u5F15\u5916\u90E8\u8FD0\u884C\u65F6\uFF09\u3002\u4EE3\u7801\u7F16\u8F91\u5668 + \u8FD0\u884C\u6309\u94AE + \u8F93\u51FA\u9762\u677F\uFF1B\u7528\u6237\u4EE3\u7801\u5728 Web Worker \u6216 new Function \u5185\u6267\u884C\uFF08\u9632\u6B7B\u5FAA\u73AF\u5361 UI\uFF09\uFF1B\u9884\u7F6E 2-3 \u4E2A\u4EFB\u52A1\u4E0E\u53EF\u8FD0\u884C\u793A\u4F8B\u3002

## \u8F93\u51FA\u683C\u5F0F

\u53EA\u8F93\u51FA\u4E00\u4E2A\u5B8C\u6574 HTML \u6587\u6863\uFF08\u6070\u597D\u4E00\u4E2A <!DOCTYPE html> \u4E0E\u4E00\u4E2A </html>\uFF09\uFF0C\u4E0D\u8981\u89E3\u91CA\u3002
\u8BF4\u660E\u6587\u5B57\uFF08\u4E0A\u4E0B\u6587\u5305\u6B63\u6587\uFF09\u53EA\u505A\u5BFC\u89C8\uFF1A\u770B\u4EC0\u4E48\u3001\u8C03\u4EC0\u4E48\u3001\u89C2\u5BDF\u4EC0\u4E48\u89C4\u5F8B\uFF0C\u2264 400 \u5B57\u3002`;
  }
  static PROMPT_KINDS = {
    // 风格变体作用于「课程节生成」（课程节生成-<风格>）；整课版「课程生成*」已随
    // 大纲→逐节管线退役——旧 vault 快照文件不再被读取，可手工清理。
    \u8BFE\u7A0B\u5927\u7EB2: `<!-- learnhub:prompt/v5 -->
# \u8BFE\u7A0B\u5927\u7EB2\u63D0\u793A\u8BCD\uFF08\u7528\u6237\u53EF\u7F16\u8F91\uFF1B\u751F\u6210\u65F6\u4E0A\u4E0B\u6587\u5305\u81EA\u52A8\u9644\u5728\u672C\u6A21\u677F\u4E4B\u540E\uFF09

\u4F60\u662F learnhub \u5B66\u4E60\u7CFB\u7EDF\u7684\u8BFE\u7A0B\u8BBE\u8BA1\u5E08\u3002\u6839\u636E\u9644\u540E\u7684\u4E0A\u4E0B\u6587\u5305\uFF0C\u628A\u76EE\u6807\u8282\u70B9\u7684\u4E00\u8BFE\u62C6\u6210\u4F9D\u6B21\u5B66\u4E60\u7684\u300C\u8282\u300D\u6E05\u5355\uFF1B\u6BCF\u8282\u4E4B\u540E\u4F1A\u5355\u72EC\u751F\u6210\u6B63\u6587\u3002

## \u8BBE\u8BA1\u539F\u5219

1. \u8282\u7684\u5212\u5206\u3001\u6570\u91CF\u3001\u987A\u5E8F\u4E0E\u7C7B\u578B\u914D\u6BD4\u5B8C\u5168\u7531\u4F60\u6839\u636E\u8BFE\u7A0B\u5185\u5BB9\u3001\u4E3B\u9898\u4E0E\u8BB2\u89E3\u98CE\u683C\u5224\u65AD\uFF0C\u9009\u62E9\u6700\u81EA\u7136\u7684\u8BB2\u89E3\u9AA8\u67B6\uFF1A\u4E0D\u5957\u56FA\u5B9A\u680F\u76EE\uFF0C\u4E0D\u8BBE\u56FA\u5B9A\u6536\u5C3E\u6BB5\uFF08\u65E0\u5F3A\u5236\u7684\u8FC7\u6E21\u8282/\u603B\u7ED3\u8282\uFF09\u3002
2. \u4E00\u8282 = \u4E00\u4E2A\u53EF\u5B8C\u6210\u7684\u5B66\u4E60\u5355\u5143\uFF08\u4E00\u4E2A\u6982\u5FF5\u3001\u4E00\u9053\u4F8B\u9898\u3001\u4E00\u6B21\u6F14\u793A\u3001\u4E00\u6B21\u52A8\u624B\u7EC3\u4E60\u6216\u4E00\u4E2A\u4EA4\u4E92\u6A21\u62DF\uFF09\uFF1B\u6807\u9898\u63CF\u8FF0\u672C\u8282\u5177\u4F53\u5185\u5BB9\uFF0C\u4E0D\u7528\u680F\u76EE\u5316\u901A\u540D\uFF1B\u4E00\u8282 = \u5B66\u4E60\u9875 1\u20132 \u5C4F\u2014\u2014\u4E00\u4E2A\u77E5\u8BC6\u70B9\u9700\u8981 \u516C\u5F0F+\u63A8\u5BFC+\u4F8B\u9898+\u56FE \u624D\u80FD\u8BB2\u5B8C\u65F6\u62C6\u6210\u591A\u4E2A\u8282\uFF1B\u8282\u5185\u4E0D\u5141\u8BB8\u518D\u5206\u5C0F\u8282\uFF08### \u5B50\u6807\u9898\u4F1A\u88AB\u8D28\u68C0\u95E8\u62D2\u7EDD\uFF09\u3002
3. type \u4ECE\u8282\u7C7B\u578B\u83DC\u5355\u9009\uFF08\u6982\u5FF5/\u4F8B\u9898/\u6F14\u793A/\u5C0F\u7ED3/\u7EC3\u4E60/\u4EA4\u4E92\uFF09\uFF1B\u7EC3\u4E60\u8282\u53EF\u9009\uFF08\u6574\u8BFE\u53EF\u4EE5\u6CA1\u6709\u7EC3\u4E60\u8282\uFF09\uFF1B\u8282\u7C7B\u578B\u914D\u6BD4\u6309\u5185\u5BB9\u9009\u7EC4\u5408\u6A21\u5F0F\uFF0C\u4F8B\u5982\uFF1A\u8FDE\u7EED 2\u20133 \u4E2A\u6982\u5FF5\u8282\u540E\u8DDF\u4E00\u4E2A\u7EC3\u4E60\u8282\u96C6\u4E2D\u7EC3\u3001\u6982\u5FF5-\u6F14\u793A\u7A7F\u63D2\u3001\u5168\u6982\u5FF5\u65E0\u7EC3\u4E60\u8282\u2014\u2014\u4E0D\u8981\u673A\u68B0\u5730\u4E00\u8282\u5185\u5BB9\u8DDF\u4E00\u8282\u7EC3\u4E60\u3002
4. \u901A\u5E38 3\u20138 \u8282\uFF0C\u53EF\u6309\u5185\u5BB9\u589E\u51CF\uFF1B\u76F8\u90BB\u8282\u4E4B\u95F4\u8981\u6709\u5B66\u4E60\u4E0A\u7684\u9012\u8FDB\u5173\u7CFB\uFF08\u9010\u8282\u751F\u6210\u65F6\u4F1A\u6CE8\u5165\u524D\u8282\u5DF2\u751F\u6210\u6B63\u6587\u4FDD\u8BC1\u8FDE\u8D2F\uFF09\u3002

## \u8F93\u51FA

\u53EA\u8F93\u51FA\u4E00\u4E2A YAML \u6587\u6863\uFF08\u4E0D\u8981\u4EE3\u7801\u56F4\u680F\u3001\u4E0D\u8981\u4EFB\u4F55\u89E3\u91CA\uFF09\uFF0C\u7ED3\u6784\u5982\u4E0B\uFF1A

node: <\u8282\u70B9\u540D>
sections:
  - id: s1
    title: \u6982\u5FF5\uFF1A\u6574\u6570\u4E0E\u81EA\u7136\u6570\u7684\u5206\u754C
    type: \u6982\u5FF5
    points: \u672C\u8282\u8981\u70B9\uFF08\u4E00\u53E5\u8BDD\uFF09
    visual: \u516C\u5F0F|mermaid|\u56FE\u7247|\u4EA4\u4E92|\u793A\u610F\u56FE|\u51FD\u6570\u56FE|\u56FE\u8868 \u4E4B\u4E00\uFF08\u672C\u8282\u7684\u8BB2\u89E3\u4E3B\u4F53\u53EF\u89C6\u5316\u2014\u2014\u5B66\u4E60\u9875\u6587\u5B57\u5B9C\u5C11\u3001\u516C\u5F0F/\u56FE/\u4EA4\u4E92\u5B9C\u591A\uFF0C\u51E0\u4E4E\u6BCF\u8282\u90FD\u6709\uFF0C\u786E\u65E0\u624D\u5199\u300C\u65E0\u300D\uFF1B\u793A\u610F\u56FE=\`\`\`svg\u3001\u51FD\u6570\u56FE=\`\`\`plot\u3001\u56FE\u8868=\`\`\`chart\uFF09
`,
    \u8BFE\u7A0B\u8282\u751F\u6210: `<!-- learnhub:prompt/v5 -->
# \u8BFE\u7A0B\u8282\u751F\u6210\u63D0\u793A\u8BCD\uFF08\u7528\u6237\u53EF\u7F16\u8F91\uFF1B\u7CFB\u7EDF\u9644\u4E0A\uFF1A\u8282\u6E05\u5355\u3001\u672C\u8282\u4EFB\u52A1\u3001\u524D\u8282\u5DF2\u751F\u6210\u6B63\u6587\u3001\u4E0A\u4E0B\u6587\u5305\uFF09

\u4F60\u662F learnhub \u5B66\u4E60\u7CFB\u7EDF\u7684\u8BFE\u7A0B\u5199\u624B\u3002\u6839\u636E\u9644\u540E\u7684\u6750\u6599\uFF0C\u53EA\u5199\u300C\u672C\u8282\u4EFB\u52A1\u300D\u6307\u5B9A\u7684\u8FD9\u4E00\u8282\u6B63\u6587\u3002

## \u786C\u7EA6\u675F\uFF08\u8FDD\u53CD\u5373\u8FD4\u5DE5\uFF09

1. \u53EA\u8F93\u51FA\u4E00\u8282\uFF1A\u4EE5 \`## \u7C7B\u578B\uFF1A\u6807\u9898\` \u5F00\u5934\uFF08\u6807\u9898\u4E0E\u7C7B\u578B\u7CBE\u786E\u7167\u6284\u672C\u8282\u4EFB\u52A1\uFF09\uFF0C\u540E\u63A5\u672C\u8282\u6B63\u6587\uFF1B\u4E0D\u5199\u5176\u4ED6\u8282\u3001\u4E0D\u5199 frontmatter\u3002
2. \u53EA\u7528\u524D\u7F6E\u5DF2\u6559\u6982\u5FF5\u4E0E\u5E38\u8BC6\uFF1B\u300C\u7981\u6B62\u4F7F\u7528\u7684\u6982\u5FF5\u300D\u4E00\u8282\u5217\u51FA\u7684\u540D\u79F0\u4E0D\u5F97\u51FA\u73B0\uFF0C\u4E5F\u4E0D\u5F97\u5F15\u7528\u5176\u7ED3\u8BBA\u3002
3. \u4E0D\u8D85\u51FA\u300C\u9886\u57DF\u8FB9\u754C\u300D\u58F0\u660E\u7684\u533A\u5757\u8303\u56F4\uFF1B\u540E\u7EE7\u5185\u5BB9\u81F3\u591A\u5728\u81EA\u7136\u6536\u5C3E\u5904\u4E00\u53E5\u8BDD\u5E26\u8FC7\u3002
4. \u53EF\u89C6\u5316\u4E3A\u4E3B\u3001\u6587\u5B57\u4E3A\u8F85\uFF1A\u8BB2\u89E3\u672C\u4F53\u7528\u516C\u5F0F/mermaid \u56FE/svg \u793A\u610F\u56FE/plot \u51FD\u6570\u56FE/chart \u56FE\u8868/\u4EA4\u4E92\u4EF6\u627F\u8F7D\uFF0C\u6587\u5B57\u53EA\u505A\u5F15\u5BFC\u4E0E\u8854\u63A5\uFF08\u2264150 \u5B57\uFF09\uFF0C\u4E0D\u5199\u5927\u6BB5\u89E3\u8BF4\uFF1B\u6BCF\u8282\u81F3\u5C11\u4E00\u4E2A\u53EF\u89C6\u5316\uFF08\u4EA4\u4E92\u8282\u4E3A\u4EA4\u4E92\u4EF6\u672C\u8EAB\uFF09\uFF1B\u8282\u5185\u4E0D\u5199 ### \u5B50\u6807\u9898\uFF1B\u4E0D\u5728\u6B63\u6587\u81EA\u8BBE\u7EC3\u4E60/\u8D81\u70ED\u7EC3\u4E60\u73AF\u8282\u2014\u2014\u7EC3\u4E60\u7531\u9898\u5E93\u4E0E\u7EC3\u4E60\u8282\u627F\u8F7D\u3002
5. \u4E0E\u300C\u524D\u4E00\u8282\u5DF2\u751F\u6210\u6B63\u6587\u300D\u81EA\u7136\u8854\u63A5\uFF1A\u4E0D\u91CD\u590D\u5B83\u8BB2\u8FC7\u7684\u5185\u5BB9\uFF0C\u5F00\u5934\u4E0D\u590D\u8FF0\u524D\u8282\u7ED3\u8BBA\u3002
6. \u6392\u7248\u7EA6\u5B9A\uFF1A\u5E76\u5217\u7684\u8BEF\u533A/\u6CE8\u610F/\u8981\u70B9\u5757\u7528 blockquote\uFF08> \u9996\u884C\u52A0\u7C97\u6807\u7B7E\uFF09\uFF1B\u5173\u952E\u7ED3\u8BBA\u7528\u72EC\u7ACB\u516C\u5F0F\uFF08$$\u2026$$\uFF09\uFF1Bmermaid \u8282\u70B9/\u8FB9\u6587\u672C\u542B | { } " # \u7B49\u7279\u6B8A\u5B57\u7B26\u65F6\u5FC5\u987B\u6574\u4F53\u53CC\u5F15\u53F7\u5305\u88F9\uFF08\u5982 \`A["\u6587\u672C"]\`\uFF09\uFF0C\u5426\u5219\u6E32\u67D3\u964D\u7EA7\u4E3A\u6E90\u7801\u3002
7. \u522B\u540D\u6309\u300C\u89C4\u8303\u7EA6\u675F\u300D\u7EDF\u4E00\uFF1B\u56FE\u7247\u7528 \`![[<\u8BFE\u7A0B\u6839>/\u8BFE\u7A0B\u56FE/xx.png]]\`\u3002

{{renderers}}

## \u8F93\u51FA

\u53EA\u8F93\u51FA\u672C\u8282\u6B63\u6587\uFF08## \u6807\u9898 + \u5185\u5BB9\uFF09\uFF0C\u4E0D\u8981\u9644\u52A0\u89E3\u91CA\u3002
`,
    "\u8BFE\u7A0B\u8282\u751F\u6210-\u82CF\u683C\u62C9\u5E95": `<!-- learnhub:prompt/v5 -->
# \u8BFE\u7A0B\u8282\u751F\u6210\u63D0\u793A\u8BCD\u2014\u2014\u82CF\u683C\u62C9\u5E95\u98CE\u683C\uFF08\u7528\u6237\u53EF\u7F16\u8F91\uFF1B\u7CFB\u7EDF\u9644\u4E0A\uFF1A\u8282\u6E05\u5355\u3001\u672C\u8282\u4EFB\u52A1\u3001\u524D\u8282\u5DF2\u751F\u6210\u6B63\u6587\u3001\u4E0A\u4E0B\u6587\u5305\uFF09

\u4F60\u662F learnhub \u5B66\u4E60\u7CFB\u7EDF\u7684\u82CF\u683C\u62C9\u5E95\u5F0F\u5BFC\u5E08\u3002\u6839\u636E\u9644\u540E\u7684\u6750\u6599\uFF0C\u53EA\u5199\u300C\u672C\u8282\u4EFB\u52A1\u300D\u6307\u5B9A\u7684\u8FD9\u4E00\u8282\u6B63\u6587\uFF1A\u5C11\u7ED9\u7ED3\u8BBA\uFF0C\u591A\u7ED9\u300C\u597D\u95EE\u9898 + \u9010\u6B65\u903C\u8FD1\u7684\u601D\u8DEF\u300D\uFF0C\u8BA9\u5B66\u4E60\u8005\u5728\u56DE\u7B54\u95EE\u9898\u4E2D\u81EA\u5DF1\u5EFA\u6784\u77E5\u8BC6\u3002

## \u786C\u7EA6\u675F\uFF08\u8FDD\u53CD\u5373\u8FD4\u5DE5\uFF09

1. \u53EA\u8F93\u51FA\u4E00\u8282\uFF1A\u4EE5 \`## \u7C7B\u578B\uFF1A\u6807\u9898\` \u5F00\u5934\uFF08\u6807\u9898\u4E0E\u7C7B\u578B\u7CBE\u786E\u7167\u6284\u672C\u8282\u4EFB\u52A1\uFF09\uFF0C\u540E\u63A5\u672C\u8282\u6B63\u6587\uFF1B\u4E0D\u5199\u5176\u4ED6\u8282\u3001\u4E0D\u5199 frontmatter\u3002
2. \u53EA\u7528\u524D\u7F6E\u5DF2\u6559\u6982\u5FF5\u4E0E\u5E38\u8BC6\uFF1B\u300C\u7981\u6B62\u4F7F\u7528\u7684\u6982\u5FF5\u300D\u4E00\u8282\u5217\u51FA\u7684\u540D\u79F0\u4E0D\u5F97\u51FA\u73B0\uFF0C\u4E5F\u4E0D\u5F97\u5F15\u7528\u5176\u7ED3\u8BBA\u3002
3. \u4E0D\u8D85\u51FA\u300C\u9886\u57DF\u8FB9\u754C\u300D\u58F0\u660E\u7684\u533A\u5757\u8303\u56F4\uFF1B\u540E\u7EE7\u5185\u5BB9\u81F3\u591A\u5728\u81EA\u7136\u6536\u5C3E\u5904\u4E00\u53E5\u8BDD\u5E26\u8FC7\u3002
4. \u53EF\u89C6\u5316\u4E3A\u4E3B\u3001\u6587\u5B57\u4E3A\u8F85\uFF1A\u8BB2\u89E3\u672C\u4F53\u7528\u516C\u5F0F/mermaid \u56FE/svg \u793A\u610F\u56FE/plot \u51FD\u6570\u56FE/chart \u56FE\u8868/\u4EA4\u4E92\u4EF6\u627F\u8F7D\uFF0C\u6587\u5B57\u53EA\u505A\u5F15\u5BFC\u4E0E\u8854\u63A5\uFF08\u2264150 \u5B57\uFF09\uFF0C\u4E0D\u5199\u5927\u6BB5\u89E3\u8BF4\uFF1B\u6BCF\u8282\u81F3\u5C11\u4E00\u4E2A\u53EF\u89C6\u5316\uFF08\u4EA4\u4E92\u8282\u4E3A\u4EA4\u4E92\u4EF6\u672C\u8EAB\uFF09\uFF1B\u8282\u5185\u4E0D\u5199 ### \u5B50\u6807\u9898\uFF1B\u4E0D\u5728\u6B63\u6587\u81EA\u8BBE\u7EC3\u4E60/\u8D81\u70ED\u7EC3\u4E60\u73AF\u8282\u2014\u2014\u7EC3\u4E60\u7531\u9898\u5E93\u4E0E\u7EC3\u4E60\u8282\u627F\u8F7D\u3002
5. \u98CE\u683C\u7EA6\u675F\uFF1A\u4EE5\u5F15\u5BFC\u95EE\u9898\u63A8\u8FDB\u2014\u2014\u5148\u7ED9\u89C2\u5BDF/\u53CD\u4F8B\u5F0F\u597D\u95EE\u9898\uFF0C\u518D\u4E00\u5C0F\u6B65\u903C\u8FD1\uFF0C\u95EE\u9898\u540E\u7D27\u8DDF\u300C\u951A\u70B9\u300D\uFF08\u4E00\u4E24\u53E5\u6700\u4F4E\u9650\u5EA6\u7684\u6B63\u786E\u65B9\u5411\u63D0\u793A\uFF0C\u4E0D\u662F\u7B54\u6848\uFF09\uFF1B\u7ED3\u8BBA\u53EA\u5728\u95EE\u9898\u94FE\u8D70\u5B8C\u540E\u7ED9\u51FA\u3002
6. \u4E0E\u300C\u524D\u4E00\u8282\u5DF2\u751F\u6210\u6B63\u6587\u300D\u81EA\u7136\u8854\u63A5\uFF1A\u4E0D\u91CD\u590D\u5B83\u8BB2\u8FC7\u7684\u5185\u5BB9\uFF0C\u5F00\u5934\u4E0D\u590D\u8FF0\u524D\u8282\u7ED3\u8BBA\u3002
7. \u6392\u7248\u7EA6\u5B9A\uFF1A\u5E76\u5217\u7684\u8BEF\u533A/\u6CE8\u610F/\u8981\u70B9\u5757\u7528 blockquote\uFF08> \u9996\u884C\u52A0\u7C97\u6807\u7B7E\uFF09\uFF1B\u5173\u952E\u7ED3\u8BBA\u7528\u72EC\u7ACB\u516C\u5F0F\uFF08$$\u2026$$\uFF09\uFF1Bmermaid \u8282\u70B9/\u8FB9\u6587\u672C\u542B | { } " # \u7B49\u7279\u6B8A\u5B57\u7B26\u65F6\u5FC5\u987B\u6574\u4F53\u53CC\u5F15\u53F7\u5305\u88F9\uFF08\u5982 \`A["\u6587\u672C"]\`\uFF09\uFF0C\u5426\u5219\u6E32\u67D3\u964D\u7EA7\u4E3A\u6E90\u7801\u3002
8. \u522B\u540D\u6309\u300C\u89C4\u8303\u7EA6\u675F\u300D\u7EDF\u4E00\uFF1B\u56FE\u7247\u7528 \`![[<\u8BFE\u7A0B\u6839>/\u8BFE\u7A0B\u56FE/xx.png]]\`\u3002

{{renderers}}

## \u8F93\u51FA

\u53EA\u8F93\u51FA\u672C\u8282\u6B63\u6587\uFF08## \u6807\u9898 + \u5185\u5BB9\uFF09\uFF0C\u4E0D\u8981\u9644\u52A0\u89E3\u91CA\u3002
`,
    "\u8BFE\u7A0B\u8282\u751F\u6210-\u8D39\u66FC": `<!-- learnhub:prompt/v5 -->
# \u8BFE\u7A0B\u8282\u751F\u6210\u63D0\u793A\u8BCD\u2014\u2014\u8D39\u66FC\u98CE\u683C\uFF08\u7528\u6237\u53EF\u7F16\u8F91\uFF1B\u7CFB\u7EDF\u9644\u4E0A\uFF1A\u8282\u6E05\u5355\u3001\u672C\u8282\u4EFB\u52A1\u3001\u524D\u8282\u5DF2\u751F\u6210\u6B63\u6587\u3001\u4E0A\u4E0B\u6587\u5305\uFF09

\u4F60\u662F learnhub \u5B66\u4E60\u7CFB\u7EDF\u7684\u8D39\u66FC\u5F0F\u8BB2\u89E3\u5458\u3002\u6839\u636E\u9644\u540E\u7684\u6750\u6599\uFF0C\u53EA\u5199\u300C\u672C\u8282\u4EFB\u52A1\u300D\u6307\u5B9A\u7684\u8FD9\u4E00\u8282\u6B63\u6587\uFF1A\u5047\u8BBE\u5B66\u4E60\u8005\u8981\u628A\u8FD9\u8282\u8BFE\u8BB2\u7ED9\u4E00\u4E2A\u806A\u660E\u7684\u5341\u4E8C\u5C81\u5B69\u5B50\u542C\uFF0C\u7528\u6700\u6734\u7D20\u7684\u7C7B\u6BD4\u548C\u65E5\u5E38\u8BED\u8A00\u628A\u6982\u5FF5\u8BB2\u900F\uFF0C\u518D\u9010\u6B65\u5F15\u5165\u6B63\u5F0F\u8BB0\u53F7\u3002

## \u786C\u7EA6\u675F\uFF08\u8FDD\u53CD\u5373\u8FD4\u5DE5\uFF09

1. \u53EA\u8F93\u51FA\u4E00\u8282\uFF1A\u4EE5 \`## \u7C7B\u578B\uFF1A\u6807\u9898\` \u5F00\u5934\uFF08\u6807\u9898\u4E0E\u7C7B\u578B\u7CBE\u786E\u7167\u6284\u672C\u8282\u4EFB\u52A1\uFF09\uFF0C\u540E\u63A5\u672C\u8282\u6B63\u6587\uFF1B\u4E0D\u5199\u5176\u4ED6\u8282\u3001\u4E0D\u5199 frontmatter\u3002
2. \u53EA\u7528\u524D\u7F6E\u5DF2\u6559\u6982\u5FF5\u4E0E\u5E38\u8BC6\uFF1B\u300C\u7981\u6B62\u4F7F\u7528\u7684\u6982\u5FF5\u300D\u4E00\u8282\u5217\u51FA\u7684\u540D\u79F0\u4E0D\u5F97\u51FA\u73B0\uFF0C\u4E5F\u4E0D\u5F97\u5F15\u7528\u5176\u7ED3\u8BBA\u3002
3. \u4E0D\u8D85\u51FA\u300C\u9886\u57DF\u8FB9\u754C\u300D\u58F0\u660E\u7684\u533A\u5757\u8303\u56F4\uFF1B\u540E\u7EE7\u5185\u5BB9\u81F3\u591A\u5728\u81EA\u7136\u6536\u5C3E\u5904\u4E00\u53E5\u8BDD\u5E26\u8FC7\u3002
4. \u53EF\u89C6\u5316\u4E3A\u4E3B\u3001\u6587\u5B57\u4E3A\u8F85\uFF1A\u8BB2\u89E3\u672C\u4F53\u7528\u516C\u5F0F/mermaid \u56FE/svg \u793A\u610F\u56FE/plot \u51FD\u6570\u56FE/chart \u56FE\u8868/\u4EA4\u4E92\u4EF6\u627F\u8F7D\uFF0C\u6587\u5B57\u53EA\u505A\u5F15\u5BFC\u4E0E\u8854\u63A5\uFF08\u2264150 \u5B57\uFF09\uFF0C\u4E0D\u5199\u5927\u6BB5\u89E3\u8BF4\uFF1B\u6BCF\u8282\u81F3\u5C11\u4E00\u4E2A\u53EF\u89C6\u5316\uFF08\u4EA4\u4E92\u8282\u4E3A\u4EA4\u4E92\u4EF6\u672C\u8EAB\uFF09\uFF1B\u8282\u5185\u4E0D\u5199 ### \u5B50\u6807\u9898\uFF1B\u4E0D\u5728\u6B63\u6587\u81EA\u8BBE\u7EC3\u4E60/\u8D81\u70ED\u7EC3\u4E60\u73AF\u8282\u2014\u2014\u7EC3\u4E60\u7531\u9898\u5E93\u4E0E\u7EC3\u4E60\u8282\u627F\u8F7D\u3002
5. \u98CE\u683C\u7EA6\u675F\uFF1A\u6BCF\u4E2A\u6838\u5FC3\u6982\u5FF5\u6309\u300C\u751F\u6D3B\u7C7B\u6BD4\uFF08\u5E76\u660E\u786E\u8BF4\u7C7B\u6BD4\u5728\u54EA\u91CC\u5931\u6548\uFF09\u2192 \u6734\u7D20\u8BED\u8A00\u89E3\u91CA \u2192 \u6B63\u5F0F\u5B9A\u4E49/\u8BB0\u53F7\u300D\u63A8\u8FDB\uFF1B\u8282\u672B\u6536\u4E00\u4E2A\u300C\u8BB2\u7ED9\u522B\u4EBA\u542C\u300D\u7684\u81EA\u6D4B\u95EE\u9898\u3002
6. \u4E0E\u300C\u524D\u4E00\u8282\u5DF2\u751F\u6210\u6B63\u6587\u300D\u81EA\u7136\u8854\u63A5\uFF1A\u4E0D\u91CD\u590D\u5B83\u8BB2\u8FC7\u7684\u5185\u5BB9\uFF0C\u5F00\u5934\u4E0D\u590D\u8FF0\u524D\u8282\u7ED3\u8BBA\u3002
7. \u6392\u7248\u7EA6\u5B9A\uFF1A\u5E76\u5217\u7684\u8BEF\u533A/\u6CE8\u610F/\u8981\u70B9\u5757\u7528 blockquote\uFF08> \u9996\u884C\u52A0\u7C97\u6807\u7B7E\uFF09\uFF1B\u5173\u952E\u7ED3\u8BBA\u7528\u72EC\u7ACB\u516C\u5F0F\uFF08$$\u2026$$\uFF09\uFF1Bmermaid \u8282\u70B9/\u8FB9\u6587\u672C\u542B | { } " # \u7B49\u7279\u6B8A\u5B57\u7B26\u65F6\u5FC5\u987B\u6574\u4F53\u53CC\u5F15\u53F7\u5305\u88F9\uFF08\u5982 \`A["\u6587\u672C"]\`\uFF09\uFF0C\u5426\u5219\u6E32\u67D3\u964D\u7EA7\u4E3A\u6E90\u7801\u3002
8. \u522B\u540D\u6309\u300C\u89C4\u8303\u7EA6\u675F\u300D\u7EDF\u4E00\uFF1B\u56FE\u7247\u7528 \`![[<\u8BFE\u7A0B\u6839>/\u8BFE\u7A0B\u56FE/xx.png]]\`\u3002

{{renderers}}

## \u8F93\u51FA

\u53EA\u8F93\u51FA\u672C\u8282\u6B63\u6587\uFF08## \u6807\u9898 + \u5185\u5BB9\uFF09\uFF0C\u4E0D\u8981\u9644\u52A0\u89E3\u91CA\u3002
`,
    \u9898\u76EE\u751F\u6210: `<!-- learnhub:prompt/v4 -->
# \u9898\u76EE\u751F\u6210\u63D0\u793A\u8BCD\uFF08\u7528\u6237\u53EF\u7F16\u8F91\uFF1B\u8282\u70B9\u6B63\u6587\u7531\u7CFB\u7EDF\u9644\u5728\u672C\u6A21\u677F\u4E4B\u540E\uFF09

\u4F60\u662F learnhub \u5B66\u4E60\u7CFB\u7EDF\u7684\u51FA\u9898\u8001\u5E08\u3002\u6839\u636E\u9644\u540E\u7684\u8282\u70B9\u6B63\u6587\u51FA\u4E00\u7EC4\u7EC3\u4E60\u9898\uFF0C\u8986\u76D6\u6B63\u6587\u7684\u6838\u5FC3\u6982\u5FF5\u3001\u6613\u9519\u70B9\u4E0E\u5178\u578B\u5E94\u7528\u3002

## \u786C\u7EA6\u675F

1. \u9898\u578B\u5FC5\u987B\u591A\u6837\uFF0C\u53EA\u7528\u4EE5\u4E0B\u4E5D\u79CD\uFF0C\u4E0D\u8981\u5168\u51FA\u540C\u4E00\u9898\u578B\uFF1A
   - \u5355\u9009\uFF08single_choice\uFF09\uFF1Aoptions \u5217 4 \u9879\u3001answer \u4E3A\u4E00\u4E2A\u6B63\u786E\u9009\u9879\u5B57\u6BCD\u3002
   - \u591A\u9009\uFF08multi_choice\uFF09\uFF1Aoptions \u5217 4 \u9879\u3001answer \u4E3A\u6B63\u786E\u9009\u9879**\u5B57\u6BCD\u6570\u7EC4**\uFF08\u5982 ["A","C"]\uFF0C\u81F3\u5C11 2 \u4E2A\u6B63\u786E\u9879\uFF09\u3002
   - \u5224\u65AD\uFF08true_false\uFF09\uFF1Aanswer \u4E3A \u5BF9/\u9519\u3002
   - \u586B\u7A7A\uFF08fill_in_blank\uFF09\uFF1Aanswer \u4E3A**\u53EF\u63A5\u53D7\u7B54\u6848\u6570\u7EC4**\uFF08\u540C\u4E49\u5199\u6CD5\u90FD\u5217\u51FA\uFF09\u3002
   - \u6570\u503C\uFF08numeric\uFF09\uFF1Aanswer \u4E3A\u6570\u503C\uFF0C\u5FC5\u987B\u540C\u65F6\u7ED9 tol \u5BB9\u5DEE\uFF08\u5982 0.01\uFF09\uFF1B\u9002\u5408\u8BA1\u7B97/\u4F30\u7B97\u9898\u3002
   - \u6392\u5E8F\uFF08ordering\uFF09\uFF1Aoptions \u4E3A**\u4E71\u5E8F**\u7684\u6B65\u9AA4/\u4E8B\u4EF6\u9879\uFF08\u6BCF\u9879\u77ED\u4E14\u4E92\u4E0D\u76F8\u540C\uFF09\u3001answer \u4E3A**\u6B63\u786E\u987A\u5E8F\u7684\u9879\u6587\u672C\u6570\u7EC4**\uFF08\u540C\u4E00\u7EC4\u9879\u7684\u91CD\u6392\uFF09\u3002
   - \u914D\u5BF9\uFF08matching\uFF09\uFF1Aoptions \u4E3A\u5DE6\u5217\u9879\uFF08\u22652\uFF0C\u77ED\u4E14\u4E92\u5F02\uFF09\u3001answer \u4E3A\u4E0E\u5DE6\u5217**\u4E00\u4E00\u5BF9\u5E94**\u7684\u53F3\u5217\u6587\u672C\u6570\u7EC4\uFF08\u7B2C i \u9879\u662F\u7B2C i \u4E2A\u5DE6\u9879\u7684\u914D\u5BF9\uFF09\u3002
   - \u53CD\u601D\uFF08reflection\uFF09\uFF1A\u5F00\u653E\u5F0F\u5C0F\u53CD\u601D\uFF0Canswer \u5199\u8BC4\u5206\u8981\u70B9\u3002
   - \u5F00\u653E\u9898\uFF08open_question\uFF09\uFF1A**\u8003\u6574\u4E2A\u8BFE\u65F6\u5185\u5BB9\u7684\u7EFC\u5408\u5E94\u7528**\uFF08\u8DE8\u8282\u7EFC\u5408\uFF0C\u4E0D\u662F\u5355\u8282\u7EC6\u8282\uFF09\uFF0Csection \u56FA\u5B9A\u5199\u300C\u901A\u7528\u300D\uFF1Banswer \u5199\u53C2\u8003\u8981\u70B9\uFF08\u53EF\u7701\u7565\uFF09\u3002\u6BCF\u8F6E\u6700\u591A 1 \u9053\u3002
2. \u96BE\u5EA6\u9012\u8FDB\uFF1A\u5F00\u5934 1-2 \u9053\u6982\u5FF5\u8FA8\u6790\uFF08difficulty: 1\uFF09\uFF0C\u4E2D\u95F4\u5E94\u7528\u4E0E\u8BA1\u7B97\uFF08difficulty: 2\uFF09\uFF0C\u6536\u5C3E\u7EFC\u5408\u6216\u6613\u9519\u9677\u9631\uFF08difficulty: 3\uFF09+ \u81F3\u591A 1 \u9053\u5F00\u653E\u9898\u3002
3. \u6BCF\u9898\u5FC5\u987B\u7ED9\u5168\uFF1A\u9898\u5E72\u3001\u7B54\u6848\u3001\u89E3\u6790\uFF08\u8BF4\u660E\u4E3A\u4EC0\u4E48\u5BF9\u3001\u9519\u8BEF\u9009\u9879\u9519\u5728\u54EA\uFF09\uFF1B\u51E0\u4F55/\u51FD\u6570/\u6570\u636E\u7C7B\u9898\u7684\u89E3\u6790\u53EF\u7528\u4E00\u4E2A \`\`\`svg \u6216 \`\`\`plot \u4EE3\u7801\u5757\u914D\u56FE\u3002
4. \u53EA\u8003\u6B63\u6587\u91CC\u8BB2\u8FC7\u7684\u5185\u5BB9\uFF0C\u4E0D\u5F97\u5F15\u5165\u6B63\u6587\u6CA1\u6709\u7684\u6982\u5FF5\u3001\u8BB0\u53F7\u6216\u7ED3\u8BBA\u3002
5. \u9009\u62E9\u9898 options \u4E0D\u5E26 A./B. \u7F16\u53F7\u524D\u7F00\uFF08\u7CFB\u7EDF\u81EA\u52A8\u7F16\u53F7\uFF09\uFF1B\u586B\u7A7A\u9898 answer \u7528\u6570\u7EC4\u5217\u51FA\u6240\u6709\u53EF\u63A5\u53D7\u5199\u6CD5\uFF1Bnode \u5B57\u6BB5\u539F\u6837\u7167\u6284\u7CFB\u7EDF\u7ED9\u51FA\u7684\u8282\u70B9\u540D\u3002
6. \u6BCF\u9898\u6807\u6CE8 \`section\`\uFF1A\u7CFB\u7EDF\u63D0\u4F9B\u8282\u6807\u6CE8\u6E05\u5355\u65F6\uFF0Csection \u5FC5\u987B**\u7CBE\u786E\u7167\u6284\u6E05\u5355\u4E2D\u7684\u8282 id**\uFF08\u5982 \`s2\`\uFF09\uFF1B\u672A\u63D0\u4F9B\u6E05\u5355\u65F6\u7167\u6284\u6B63\u6587\u8282\u6807\u9898\u539F\u6587\uFF08\u5982\u300C\u6982\u5FF5\uFF1A\u5B9A\u4E49\u4E0E\u6027\u8D28\u300D\uFF09\uFF1B\u8DE8\u8282\u7EFC\u5408\u9898\u4E00\u5F8B\u5199\u300C\u901A\u7528\u300D\u3002

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
    section: \u6982\u5FF5\uFF1A\u5B9A\u4E49\u4E0E\u6027\u8D28
    uses: [\u7528\u5230\u7684\u524D\u7F6E\u6982\u5FF5]
`
  };
  /** 读提示词模板；内置模板带版本标记，vault 快照缺标记或版本更低时覆盖升级（旧文件存 .bak 供 diff 恢复），
   * 非内置类型要求用户已自建同名文件。
   * {{renderers}} 占位符注入渲染能力清单；旧模板缺占位符时在末尾追加注入段（运行时兜底，不改用户文件）。 */
  async loadPrompt(kind) {
    const builtin = _Content.PROMPT_KINDS[kind];
    await mkdir5(this.paths.promptDir, { recursive: true });
    const p = `${this.paths.promptDir}/${kind}.md`;
    if (!builtin && !existsSync2(p)) {
      throw new Error(`[prompt] \u672A\u77E5\u63D0\u793A\u8BCD\u7C7B\u578B: ${kind}\uFF08\u5185\u7F6E\uFF1A${Object.keys(_Content.PROMPT_KINDS).join("\u3001")}\uFF1B\u6216\u5728 state/\u63D0\u793A\u8BCD/ \u81EA\u5EFA ${kind}.md\uFF09`);
    }
    if (builtin) {
      const vaultVer = existsSync2(p) ? _Content.promptVersionOf(await readFile6(p, "utf8")) : 0;
      if (vaultVer < _Content.promptVersionOf(builtin)) {
        if (existsSync2(p)) await writeFile5(`${p}.bak`, await readFile6(p, "utf8"), "utf8");
        await writeFile5(p, builtin, "utf8");
      }
    }
    const text = await readFile6(p, "utf8");
    const caps = rendererCapabilityBlock();
    if (text.includes("{{renderers}}")) return text.replaceAll("{{renderers}}", caps);
    return text.trimEnd() + "\n\n" + caps;
  }
  /** 内置模板首行版本标记 → 数字；无标记（历史快照）= 0，下次 loadPrompt 即升级。 */
  static promptVersionOf(text) {
    const m = /^<!-- learnhub:prompt\/v(\d+) -->/.exec(text);
    return m ? Number(m[1]) : 0;
  }
  /** 可用提示词类型 = 内置 + state/提示词/ 下的自建变体（去 .md）。 */
  async promptKinds() {
    const names = new Set(Object.keys(_Content.PROMPT_KINDS));
    try {
      for (const f of await readdir3(this.paths.promptDir)) {
        if (f.endsWith(".md")) names.add(f.replace(/\.md$/, ""));
      }
    } catch {
    }
    return [...names].sort();
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
    for (const name2 of graph.nset) {
      if (name2 === node || name2.length < 2) continue;
      if ((graph.depth[name2] ?? 0) > dSelf && checked.includes(name2)) hits.add(name2);
    }
    return [...hits].sort();
  }
  /** 节形状门禁：节内 ### 子标题破坏原子性（finding）；节 prose 过长
   * （warn >600 / finding >2000；长度剥离代码块/行内代码/公式/机器注释后计数——
   * 公式与图表不占文字预算，可视化为辅的文字纪律才有硬约束）。 */
  static checkSectionShape(body) {
    const findings = [];
    const warns = [];
    for (const part of body.split(/^## /m).slice(1)) {
      const nl = part.indexOf("\n");
      const title = (nl >= 0 ? part.slice(0, nl) : part).trim();
      if (!title || title.startsWith("<!--")) continue;
      const md = nl >= 0 ? part.slice(nl + 1) : "";
      if (/^### /m.test(md)) {
        findings.push(`\u8282\u300C${title}\u300D\u5185\u51FA\u73B0 ### \u5B50\u6807\u9898\uFF08\u7834\u574F\u8282\u7684\u539F\u5B50\u6027\uFF1A\u4E00\u8282\u53EA\u8BB2\u4E00\u4E2A\u77E5\u8BC6\u70B9\uFF0C\u9700\u8981\u5206\u5C42\u5C31\u62C6\u6210\u591A\u4E2A\u8282\uFF09`);
      }
      const prose = md.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "").replace(/\$\$[\s\S]*?\$\$/g, "").replace(/\$[^$\n]+\$/g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, "");
      if (prose.length > 2e3) {
        findings.push(`\u8282\u300C${title}\u300D\u6B63\u6587\u8FC7\u957F\uFF08\u7EA6 ${prose.length} \u5B57\uFF09\uFF1A\u4E00\u8282 = \u5B66\u4E60\u9875 1\u20132 \u5C4F\uFF0C\u628A\u5185\u5BB9\u62C6\u6210\u591A\u4E2A\u8282`);
      } else if (prose.length > 600) {
        warns.push(`\u8282\u300C${title}\u300D\u6B63\u6587\u504F\u957F\uFF08\u7EA6 ${prose.length} \u5B57\uFF09\uFF1A\u53EF\u89C6\u5316\u4E3A\u4E3B\u3001\u6587\u5B57\u4E3A\u8F85\uFF0C\u8D85\u8FC7 600 \u5B57\u5EFA\u8BAE\u538B\u7F29\u6216\u62C6\u8282`);
      }
    }
    return { findings, warns };
  }
  /** mermaid 引号启发：节点/边文本含 | 等会破坏语法解析的字符且未整体双引号包裹 → warn
   * （渲染降级为源码块的高频根因，如 `B[模 |v| = …]`）。 */
  static checkMermaidQuotes(body) {
    const warns = [];
    for (const mm of body.matchAll(/```mermaid\n([\s\S]*?)```/g)) {
      for (const line of mm[1].split("\n")) {
        const t = line.trim();
        if (/\[[^"\]]*\|[^"\]]*\]/.test(t)) {
          warns.push(`mermaid \u8282\u70B9\u6587\u672C\u542B\u300C|\u300D\u672A\u7528\u53CC\u5F15\u53F7\u5305\u88F9\uFF0C\u6E32\u67D3\u4F1A\u964D\u7EA7\u4E3A\u6E90\u7801\uFF1A${t.slice(0, 60)}`);
          break;
        }
      }
    }
    return warns;
  }
  /** 别名一致性：正文出现不采用名 → findings。 */
  async checkAliases(root, body) {
    const table = await this.aliasTable(root);
    return Object.entries(table).filter(([bad]) => body.includes(bad)).map(([bad, good]) => `\u522B\u540D\u4E0D\u4E00\u81F4: \u6B63\u6587\u7528\u4E86\u300C${bad}\u300D\uFF0C\u5E94\u91C7\u7528\u300C${good}\u300D`);
  }
  /** 未注册的代码块语言（面板无渲染器、会降级为源码显示）→ 警告，防 AI 产出渲染不了的块。 */
  static checkRendererLangs(body) {
    const known = new Set(RENDERERS.map((r) => r.lang));
    const hits = /* @__PURE__ */ new Set();
    for (const m of body.matchAll(/^```([A-Za-z0-9_-]+)/gm)) {
      const lang = m[1].toLowerCase();
      if (lang && !known.has(lang) && !PLAIN_CODE_LANGS.has(lang)) hits.add(lang);
    }
    return [...hits].sort();
  }
  /** 富内容块语法门：plot/chart 必须是合法 JSON 对象、svg 必须以 <svg 开头
   * （这些块渲染器会降级为源码显示，生成侧越早拦截返工成本越低）。 */
  static checkVisualBlocks(body) {
    const findings = [];
    let i = 0;
    for (const m of body.matchAll(/^```plot\n([\s\S]*?)```$/gm)) {
      i++;
      if (!_Content.isPlainJsonObject(m[1])) findings.push("```plot \u7B2C " + i + " \u5757\u4E0D\u662F\u5408\u6CD5 JSON \u5BF9\u8C61\uFF08\u9762\u677F\u4F1A\u964D\u7EA7\u4E3A\u6E90\u7801\u663E\u793A\uFF09");
    }
    i = 0;
    for (const m of body.matchAll(/^```chart\n([\s\S]*?)```$/gm)) {
      i++;
      if (!_Content.isPlainJsonObject(m[1])) findings.push("```chart \u7B2C " + i + " \u5757\u4E0D\u662F\u5408\u6CD5 JSON \u5BF9\u8C61\uFF08\u9762\u677F\u4F1A\u964D\u7EA7\u4E3A\u6E90\u7801\u663E\u793A\uFF09");
    }
    i = 0;
    for (const m of body.matchAll(/^```svg\n([\s\S]*?)```$/gm)) {
      i++;
      if (!/^\s*<svg[\s>]/i.test(m[1])) findings.push("```svg \u7B2C " + i + " \u5757\u5FC5\u987B\u4EE5 <svg \u5F00\u5934\uFF08\u5B8C\u6574 SVG \u7247\u6BB5\uFF09");
    }
    return findings;
  }
  static isPlainJsonObject(text) {
    try {
      const v = JSON.parse(text);
      return typeof v === "object" && v !== null && !Array.isArray(v);
    } catch {
      return false;
    }
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
    const badLangs = _Content.checkRendererLangs(body);
    if (badLangs.length) warns.push(`\u672A\u6CE8\u518C\u7684\u4EE3\u7801\u5757\u8BED\u8A00\uFF08\u9762\u677F\u65E0\u6CD5\u6E32\u67D3\uFF0C\u8BF7\u6539\u7528\u652F\u6301\u7684\u683C\u5F0F\uFF09: ${badLangs.join("\u3001")}`);
    findings.push(..._Content.checkVisualBlocks(body));
    const checkedBody = this.stripRoadmapSections(body);
    const shape = _Content.checkSectionShape(checkedBody);
    findings.push(...shape.findings);
    warns.push(...shape.warns);
    warns.push(..._Content.checkMermaidQuotes(checkedBody));
    const missingInteractive = [];
    for (const m of body.matchAll(/```interactive\n([^\n]+)\n```/g)) {
      const rel = m[1].trim();
      if (!existsSync2(`${this.paths.centerRoot}/${rel}`)) missingInteractive.push(rel);
    }
    if (missingInteractive.length) {
      findings.push(`interactive \u5F15\u7528\u7684\u4EA4\u4E92\u4EF6\u6587\u4EF6\u4E0D\u5B58\u5728: ${missingInteractive.join("\u3001")}`);
    }
    return { passed: !findings.length, findings, warns };
  }
  /** 解析正文中的 learnhub-interactive 标记块 → (替换后的正文, 待落盘交互件, 非法路径列表)。
   * 标记块 ```learnhub-interactive:<课程根相对路径> + 完整 HTML``` → 正文替换为
   * ```interactive 引用块（vault 相对路径），HTML 由 contentApply 在质检门前落盘。 */
  static extractInteractive(body, courseRoot) {
    const files = [];
    const invalid = [];
    const out = body.replace(
      /```learnhub-interactive:([^\n]+)\n([\s\S]*?)```/g,
      (whole, rawRel, html) => {
        const rel = rawRel.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
        const bad = !rel || !rel.toLowerCase().endsWith(".html") || rel.split("/").some((seg) => !seg || seg === "." || seg === "..");
        if (bad) {
          invalid.push(rawRel.trim());
          return whole;
        }
        files.push({ rel, html: html.trim() + "\n" });
        return `\`\`\`interactive
${courseRoot}/${rel}
\`\`\``;
      }
    );
    return { body: out, files, invalid };
  }
  // ---- 节清单（逐节生成管线） ----
  /** 大纲 YAML → 节清单（id 唯一、type ∈ 节类型菜单、title 非空；全 pending）。 */
  static parseOutline(yamlText) {
    const doc = YAML.parseModel(yamlText);
    if (typeof doc !== "object" || doc === null || !Array.isArray(doc.sections) || !doc.sections.length) {
      throw new Error("[outline] \u6A21\u578B\u6CA1\u6709\u4EA7\u51FA\u53EF\u7528\u5927\u7EB2\uFF08sections \u4E3A\u7A7A\uFF09\u3002");
    }
    const out = [];
    const ids = /* @__PURE__ */ new Set();
    doc.sections.forEach((raw, i) => {
      const e = raw ?? {};
      const id = typeof e.id === "string" && e.id.trim() ? e.id.trim() : `s${i + 1}`;
      const title = String(e.title ?? "").trim();
      const type = String(e.type ?? "").trim() || parseSectionTitle(title).type.prefix;
      if (!title) throw new Error(`[outline] sections.${i + 1}.title \u4E0D\u80FD\u4E3A\u7A7A`);
      if (ids.has(id)) throw new Error(`[outline] sections.${i + 1}.id\u300C${id}\u300D\u91CD\u590D`);
      if (!SECTION_TYPES.some((t) => t.prefix === type)) {
        throw new Error(`[outline] sections.${i + 1}.type\u300C${type}\u300D\u4E0D\u5728\u8282\u7C7B\u578B\u83DC\u5355\uFF08${SECTION_TYPES.map((t) => t.prefix).join("/")}\uFF09`);
      }
      ids.add(id);
      const points = typeof e.points === "string" ? e.points.trim() : "";
      out.push({ id, title, type, status: "pending", version: 0, ...points ? { points } : {} });
    });
    return out;
  }
  /** 大纲落盘：manifest 写入 frontmatter content.sections（全 pending），正文不动。
   * fm 现读（逐节连续落盘时调用方的 stateMap 已过期）。 */
  async outlineApply(root, graph, node, yamlText, journal) {
    const manifest = _Content.parseOutline(yamlText);
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(root, regionName, node);
    const { fm, body } = await loadNote(path);
    if (!fm || typeof fm.node !== "string") throw new Error(`[outline] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728\uFF08\u5148\u4E3A\u8282\u70B9\u751F\u6210\u5185\u5BB9\u9AA8\u67B6\uFF09: ${node}`);
    await saveNote(path, { ...fm, content: { ...fm.content ?? {}, sections: manifest } }, body);
    await journal({ course: "", node, rating: null, kind: "content_outline", elapsed_days: 0, detail: `\u8282\u6E05\u5355 ${manifest.length} \u8282\u843D\u76D8\uFF08\u5168 pending\uFF09` });
    return manifest;
  }
  /** 单节落盘：交互件标记块先拆出落盘 → 节级质检门 → 正文按清单手术重组 →
   * 该节 status=ready/version+1、content.version+1（draft）；hints = enc 候选反哺图的补边提醒。 */
  async sectionApply(root, graph, node, sectionId, md, journal) {
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(root, regionName, node);
    const { fm, body } = await loadNote(path);
    if (!fm || typeof fm.node !== "string") throw new Error(`[section] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728: ${node}`);
    const sections = fm.content?.sections ?? [];
    const entry = sections.find((m) => m.id === sectionId);
    if (!entry) throw new Error(`[section] \u8282\u70B9\u300C${node}\u300D\u7684\u8282\u6E05\u5355\u91CC\u6CA1\u6709\u300C${sectionId}\u300D\u2014\u2014\u5148\u8FD0\u884C\u5927\u7EB2\u3002`);
    const split = _Content.extractInteractive(md, root);
    if (split.invalid.length) {
      throw new Error(`[section] learnhub-interactive \u6807\u8BB0\u5757\u8DEF\u5F84\u975E\u6CD5\uFF08\u53EA\u5141\u8BB8\u8BFE\u7A0B\u6839\u5185\u76F8\u5BF9 .html \u8DEF\u5F84\uFF0C\u65E0 ..\uFF09: ${split.invalid.join("\u3001")}`);
    }
    for (const f of split.files) {
      const target = `${this.paths.courseRoot(root)}/${f.rel}`;
      await mkdir5(target.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
      await writeFile5(target, f.html, "utf8");
    }
    const gate = await this.gateReport(graph, root, node, `## ${entry.title}

${split.body}`);
    const html = _Content.checkInteractiveHtml(split.files);
    if (gate.findings.length || html.findings.length) {
      throw new Error(`[section] \u300C${entry.title}\u300D\u8D28\u68C0\u95E8\u672A\u8FC7\uFF1A
${[...gate.findings, ...html.findings].map((e) => `  \u2717 ${e}`).join("\n")}
${[...gate.warns, ...html.warns].map((w) => `  \u26A0 ${w}`).join("\n")}`);
    }
    const nextSections = sections.map((m) => m.id === sectionId ? { ...m, status: "ready", version: m.version + 1 } : m);
    const newBody = _Content.assembleBody(body, sections, /* @__PURE__ */ new Map([[entry.title, split.body.trim()]]));
    const version2 = (fm.content?.version ?? 0) + 1;
    await saveNote(path, {
      ...fm,
      content: {
        ...fm.content ?? {},
        version: version2,
        generated_at: todayStr(),
        status: "draft",
        sections: nextSections
      }
    }, newBody);
    await journal({ course: "", node, rating: null, kind: "content_section", elapsed_days: 0, detail: `\u8282\u300C${entry.title}\u300Dv${entry.version + 1} \u843D\u76D8` });
    return { version: version2, title: entry.title, hints: _Content.encBackfeedHints(graph, node, split.body) };
  }
  /** 整篇正文按节清单重组：intro（首个 ## 之前）与保护区（练习/答案/内容反馈/机器块）原样保留；
   * 清单节用 provided md，否则沿用既有同名节，两者皆无（pending）则不进正文；
   * 既有内容节不在清单内即丢弃（重生成语义）。 */
  static assembleBody(existing, manifest, provided) {
    const encBlock = existing.match(/<!--\s*enc_candidates:[^>]*-->/)?.[0] ?? "";
    const withoutEnc = encBlock ? existing.replace(encBlock, "") : existing;
    const parts = withoutEnc.split(/^## /m);
    const intro = (parts[0] ?? "").trim();
    const existingSections = /* @__PURE__ */ new Map();
    const tail = [];
    for (const part of parts.slice(1)) {
      const nl = part.indexOf("\n");
      const title = (nl >= 0 ? part.slice(0, nl) : part).trim();
      const md = nl >= 0 ? part.slice(nl + 1) : "";
      const isProtected = title.startsWith("<!--") || ["\u7EC3\u4E60", "\u7B54\u6848", "\u5185\u5BB9\u53CD\u9988"].includes(title);
      if (isProtected) tail.push(`## ${part.trimEnd()}`);
      else existingSections.set(title, md.trim());
    }
    const out = [];
    if (intro) out.push(intro);
    for (const m of manifest) {
      const md = provided.get(m.title) ?? existingSections.get(m.title);
      if (!md) continue;
      out.push(`## ${m.title}

${md}`);
    }
    out.push(...tail);
    if (encBlock) out.push(encBlock);
    return out.join("\n\n") + "\n";
  }
  /** 从整篇正文重导出节清单（整节点重生成/风格变体后 manifest 与正文重对齐，全部 ready）。 */
  static manifestFromBody(body, version2) {
    const out = [];
    for (const part of body.split(/^## /m).slice(1)) {
      const title = (part.indexOf("\n") >= 0 ? part.slice(0, part.indexOf("\n")) : part).trim();
      if (!title || title.startsWith("<!--") || ["\u7EC3\u4E60", "\u7B54\u6848", "\u5185\u5BB9\u53CD\u9988"].includes(title)) continue;
      out.push({ id: `s${out.length + 1}`, title, type: parseSectionTitle(title).type.prefix, status: "ready", version: version2 });
    }
    return out;
  }
  /** 交互件 HTML 门禁：体积上限、禁外联、完成上报必查；widget-config 契约缺失降级为警告
   * （存量 v1 交互件不返工，新生成由提示词保证）。 */
  static checkInteractiveHtml(files) {
    const findings = [];
    const warns = [];
    for (const f of files) {
      if (f.html.length > 200 * 1024) findings.push(`\u4EA4\u4E92\u4EF6\u5355\u6587\u4EF6\u8D85\u8FC7 200KB: ${f.rel}`);
      if (/(?:src|href)\s*=\s*["']https?:\/\//i.test(f.html) || /fetch\(|XMLHttpRequest/.test(f.html)) {
        findings.push(`\u4EA4\u4E92\u4EF6\u542B\u5916\u8054\u8D44\u6E90\u6216\u7F51\u7EDC\u8C03\u7528\uFF08\u6C99\u7BB1\u5185\u4E0D\u53EF\u7528\uFF0C\u9700\u81EA\u5305\u542B\uFF09: ${f.rel}`);
      }
      if (!f.html.includes("LEARNHUB_COMPLETE")) findings.push(`\u4EA4\u4E92\u4EF6\u7F3A\u5C11 LEARNHUB_COMPLETE \u5B8C\u6210\u4E0A\u62A5: ${f.rel}`);
      if (!f.html.includes("LEARNHUB_TEACHER")) warns.push(`\u4EA4\u4E92\u4EF6\u672A\u5B9E\u73B0 LEARNHUB_TEACHER \u76D1\u542C\uFF08AI \u8001\u5E08\u65E0\u6CD5\u9A71\u52A8\u6F14\u793A\uFF09: ${f.rel}`);
      const m = /<script[^>]*type="application\/json"[^>]*id="widget-config"[^>]*>([\s\S]*?)<\/script>/i.exec(f.html);
      if (!m) {
        warns.push(`\u4EA4\u4E92\u4EF6\u7F3A\u5C11 widget-config \u5143\u6570\u636E\uFF08\u5EFA\u8BAE\u8865 {type, description}\uFF09: ${f.rel}`);
        continue;
      }
      try {
        const cfg = JSON.parse(m[1]);
        if (typeof cfg.type !== "string" || !INTERACTIVE_TYPES.includes(cfg.type)) {
          findings.push(`\u4EA4\u4E92\u4EF6 widget-config.type\u300C${String(cfg.type)}\u300D\u4E0D\u5728\u7C7B\u578B\u83DC\u5355\uFF08${INTERACTIVE_TYPES.join("/")}\uFF09: ${f.rel}`);
        }
      } catch {
        findings.push(`\u4EA4\u4E92\u4EF6 widget-config JSON \u4E0D\u53EF\u89E3\u6790: ${f.rel}`);
      }
    }
    return { findings, warns };
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
  /** enc 反哺 hints：enc_candidates 引用的图内节点不在本节点 pre 传递闭包 → 建议补边。
   * E7（audit）管已写入图的 enc 边；本检查把纠正时机提前到内容落盘时（内容反哺图）。 */
  static encBackfeedHints(graph, node, body) {
    const out = [];
    for (const cand of _Content.encCandidates(body)) {
      if (graph.nset.has(cand) && !graph.isAncestor(cand, node)) {
        out.push(`\u300C${cand}\u300D\u88AB enc_candidates \u5F15\u7528\u4F46\u4E0D\u5728\u672C\u8282\u70B9 pre \u95ED\u5305\u2014\u2014\u786E\u8BA4\u4F9D\u8D56\u540E\u7528 learnhub_graph_propose(kind=edit) \u7684 set_pre \u8865\u8FB9`);
      }
    }
    return out;
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
      content: {
        ...fm.content,
        version: version2,
        generated_at: todayStr(),
        status: "draft",
        // 节清单节点：整篇替换后 manifest 与正文重对齐（全部 ready、版本同步）
        ...fm.content.sections ? { sections: _Content.manifestFromBody(body, version2) } : {}
      }
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
var EDIT_OPS = ["add_node", "del_node", "set_pre", "set_enc", "rename", "move", "set_note"];
function normalizeOpEnc(raw) {
  return (raw ?? []).map((item) => typeof item === "string" ? { node: item, w: 1 } : { node: item.node, w: item.w ?? 1, ...item.note ? { note: item.note } : {} });
}
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
          nodes.forEach((rawNode, ni) => {
            const nd = rawNode ?? {};
            const nwhere = `${where}.blocks.${bi}.nodes.${String(nd.name ?? ni)}`;
            if (nd.bloom !== void 0 && !BLOOM_LEVELS.includes(String(nd.bloom))) {
              errors.push(`${nwhere}.bloom: \u975E\u6CD5\u8BA4\u77E5\u5C42\u7EA7 ${String(nd.bloom)}\uFF08\u5141\u8BB8 ${BLOOM_LEVELS.join("/")}\uFF09`);
            }
            if (nd.difficulty !== void 0 && ![1, 2, 3, 4, 5].includes(Number(nd.difficulty))) {
              errors.push(`${nwhere}.difficulty: \u975E\u6CD5\u96BE\u5EA6 ${String(nd.difficulty)}\uFF08\u5141\u8BB8 1-5\uFF09`);
            }
          });
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
      if (o.bloom !== void 0 && o.bloom !== "" && !BLOOM_LEVELS.includes(String(o.bloom))) {
        errors.push(`${where}.bloom: \u975E\u6CD5\u8BA4\u77E5\u5C42\u7EA7 ${String(o.bloom)}\uFF08\u5141\u8BB8 ${BLOOM_LEVELS.join("/")}\uFF09`);
      }
      if (o.difficulty !== void 0 && o.difficulty !== "" && ![1, 2, 3, 4, 5].includes(Number(o.difficulty))) {
        errors.push(`${where}.difficulty: \u975E\u6CD5\u96BE\u5EA6 ${String(o.difficulty)}\uFF08\u5141\u8BB8 1-5\uFF09`);
      }
      if (o.est !== void 0 && o.est !== "" && !(Number.isFinite(Number(o.est)) && Number(o.est) > 0)) {
        errors.push(`${where}.est: \u975E\u6CD5\u65F6\u957F ${String(o.est)}\uFF08\u5206\u949F\uFF0C\u6B63\u6570\uFF09`);
      }
      if (o.type !== void 0 && o.type !== "" && o.type !== "practice") {
        errors.push(`${where}.type: \u975E\u6CD5\u8282\u70B9\u7C7B\u578B ${String(o.type)}\uFF08\u53EA\u5141\u8BB8 practice\uFF09`);
      }
      if (o.enc !== void 0) {
        if (!Array.isArray(o.enc)) {
          errors.push(`${where}.enc: \u5FC5\u987B\u662F\u5217\u8868`);
        } else o.enc.forEach((e, j) => {
          const item = e;
          const t = typeof item === "string" ? item : item?.node;
          if (typeof t !== "string" || !t.trim()) errors.push(`${where}.enc.${j}: \u7F3A node`);
          const w = typeof item === "object" && item !== null ? item.w : void 0;
          if (w !== void 0 && (typeof w !== "number" || w < 0 || w > 1)) errors.push(`${where}.enc.${j}: w \u5FC5\u987B\u662F 0\u20131 \u7684\u6570`);
        });
      }
      ops.push({
        op,
        node: typeof o.node === "string" ? o.node.trim() : void 0,
        new: typeof o.new === "string" ? o.new.trim() : void 0,
        region: typeof o.region === "string" ? o.region.trim() : void 0,
        block: typeof o.block === "string" ? o.block.trim() : void 0,
        pre: Array.isArray(o.pre) ? o.pre.map(String) : [],
        ...Array.isArray(o.enc) ? { enc: o.enc } : {},
        opt: Boolean(o.opt),
        note: typeof o.note === "string" ? o.note : void 0,
        ...Number.isFinite(Number(o.est)) && Number(o.est) > 0 ? { est: Math.round(Number(o.est)) } : {},
        ...o.type === "practice" ? { type: "practice" } : {},
        ...typeof o.bloom === "string" && BLOOM_LEVELS.includes(o.bloom) ? { bloom: o.bloom } : {},
        ...[1, 2, 3, 4, 5].includes(Number(o.difficulty)) ? { difficulty: Number(o.difficulty) } : {}
      });
    });
  }
  if (errors.length) return { errors };
  return { spec: { course: d.course.trim(), reason: typeof d.reason === "string" ? d.reason : "", ops } };
}
function applyFindings(audit) {
  const findings = audit.warns.map((w) => `\u26A0 ${w}`);
  if (audit.ok && audit.health > 0 && audit.health < 80) {
    findings.push(`\u26A0 \u56FE\u8C31\u5065\u5EB7\u5206 ${audit.health} < 80\uFF1A\u7ED3\u675F\u6761\u4EF6\u672A\u6EE1\u8DB3\uFF0C\u7EE7\u7EED\u5206\u6279\u6784\u5EFA\uFF08learnhub_graph_analyze \u7684 health/suggestions \u7ED9\u51FA\u65B9\u5411\uFF09`);
  }
  return findings;
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
    const v = validateGenProposal(YAML.parseModel(yamlText));
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
    const { pid } = await this.saveArtifact("gen", spec.course, YAML.parseModel(yamlText));
    await this.store.updateProposal(pid, { summary: `${spec.mode}\uFF1A${spec.regions.length} \u533A / ${nodeCount} \u8282\u70B9` });
    return { id: pid, kind: "gen", course: spec.course, mode: spec.mode, regions: spec.regions.length, nodes: nodeCount };
  }
  /** graph apply-gen：把 pending 生成提案写入 data/*.yaml（audit 门禁在 facade 层跑）。 */
  async applyGen(pid, audit = { ok: true, warns: [], health: 0 }) {
    if (!audit.ok) throw new Error("[apply-gen] \u5BA1\u8BA1\u5B58\u5728 ERROR\uFF0C\u62D2\u7EDD\u5199\u5165\u2014\u2014\u5148\u5904\u7406 \u5BA1\u8BA1\u62A5\u544A.md\u3002");
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
    return { course: course.name, regions: written, snapshot: version2, nodes: new Graph(regions).names.length, findings: applyFindings(audit) };
  }
  /** mode=new：注册表条目 + data/课程/state 脚手架。 */
  async initCourse(name2) {
    const items = await this.registry.load();
    const root = name2;
    for (const sub of ["data", "\u8BFE\u7A0B", "state"]) {
      await mkdir6(`${this.centerRoot}/${root}/${sub}`, { recursive: true });
    }
    const entry = { id: `${root}-01`, name: name2, root, enabled: true };
    items.push(entry);
    await this.registry.save(items);
    return entry;
  }
  /** graph propose-edit：在内存图上模拟执行 → pending。 */
  async proposeEdit(yamlText) {
    const v = validateEditProposal(YAML.parseModel(yamlText));
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
    const { pid } = await this.saveArtifact("edit", spec.course, YAML.parseModel(yamlText));
    await this.store.updateProposal(pid, { summary: `${spec.ops.length} \u6761\u64CD\u4F5C\uFF1A${spec.ops.map((o) => o.op).join("\u3001")}` });
    return { id: pid, kind: "edit", course: spec.course, ops: spec.ops.length };
  }
  /** graph apply-edit：执行变更 + 改名/移动/删除联动课程笔记 + 快照。 */
  async applyEdit(pid, audit = { ok: true, warns: [], health: 0 }) {
    if (!audit.ok) throw new Error("[apply-edit] \u5BA1\u8BA1\u5B58\u5728 ERROR\uFF0C\u62D2\u7EDD\u5199\u5165\u2014\u2014\u5148\u5904\u7406 \u5BA1\u8BA1\u62A5\u544A.md\u3002");
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
    return { course: course.name, ops: spec.ops.length, snapshot: version2, renames, deleted: dels, findings: applyFindings(audit) };
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
  const node = {
    name: String(raw.name ?? "").trim(),
    pre: Array.isArray(raw.pre) ? raw.pre.map(String) : [],
    opt: Boolean(raw.opt),
    note: typeof raw.note === "string" ? raw.note : "",
    enc
  };
  if (raw.est !== void 0) {
    const est = Number(raw.est);
    if (Number.isFinite(est) && est > 0) node.est = Math.round(est);
  }
  if (raw.type === "practice") node.type = "practice";
  if (typeof raw.bloom === "string" && BLOOM_LEVELS.includes(raw.bloom)) {
    node.bloom = raw.bloom;
  }
  if ([1, 2, 3, 4, 5].includes(Number(raw.difficulty))) {
    node.difficulty = Number(raw.difficulty);
  }
  return node;
}
function simulateOps(regions, graph, ops) {
  const sim = JSON.parse(JSON.stringify(regions));
  const errors = [];
  const names = new Set(graph.names);
  const renameMap = {};
  const removed = /* @__PURE__ */ new Set();
  const regionOf = (name2) => sim.find((r) => r.name === name2);
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
      blk.nodes.push({
        name: op.node,
        pre: [...op.pre ?? []],
        opt: Boolean(op.opt),
        note: op.note ?? "",
        ...op.enc !== void 0 ? { enc: normalizeOpEnc(op.enc) } : { enc: [] },
        ...op.est !== void 0 ? { est: op.est } : {},
        ...op.type ? { type: op.type } : {},
        ...op.bloom ? { bloom: op.bloom } : {},
        ...op.difficulty !== void 0 ? { difficulty: op.difficulty } : {}
      });
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
    } else if (op.op === "set_enc") {
      if (!names.has(op.node)) {
        errors.push(`set_enc \u8282\u70B9\u4E0D\u5B58\u5728: ${op.node}`);
        continue;
      }
      for (const r of sim) for (const b of r.blocks) for (const n of b.nodes) {
        if (n.name === op.node) n.enc = normalizeOpEnc(op.enc);
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
    const encDangling = new Set(merged.names.flatMap((n) => (merged.encOf[n] ?? []).filter(([p]) => !merged.nset.has(p)).map(([p]) => `${n} ~enc~ ${p}`)));
    for (const d of [...encDangling].sort()) errors.push(`\u53D8\u66F4\u540E enc \u65AD\u8FB9: ${d}`);
    if (merged.hasCycle) errors.push(`\u53D8\u66F4\u540E\u5F15\u5165\u73AF\uFF1A${merged.cycleNodes.slice(0, 5).join("\u3001")}`);
  }
  return errors;
}
function applyOpsToRegions(regions, ops) {
  const renameMap = {};
  const removed = /* @__PURE__ */ new Set();
  const regionOf = (name2) => regions.find((r) => r.name === name2);
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
      blk.nodes.push({
        name: op.node,
        pre: [...op.pre ?? []],
        opt: Boolean(op.opt),
        note: op.note ?? "",
        ...op.enc !== void 0 ? { enc: normalizeOpEnc(op.enc) } : { enc: [] },
        ...op.est !== void 0 ? { est: op.est } : {},
        ...op.type ? { type: op.type } : {},
        ...op.bloom ? { bloom: op.bloom } : {},
        ...op.difficulty !== void 0 ? { difficulty: op.difficulty } : {}
      });
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
    } else if (op.op === "set_enc") {
      const hit = findNode(op.node);
      if (hit) hit.n.enc = normalizeOpEnc(op.enc);
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
function normChoice(s) {
  let t = normAnswer(s).toUpperCase();
  for (const pre of ["\u9009\u9879", "\u7B54\u6848", "\u9009"]) {
    if (t.startsWith(pre)) t = t.slice(pre.length);
  }
  t = t.replace(/[。．.]+$/, "");
  const m = t.match(/[A-Z]/);
  return m ? m[0] : t;
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
    case "multi_choice": {
      const s = typeof response === "string" ? response : "";
      if (!normAnswer(s)) throw new Error("multi_choice \u4F5C\u7B54\u4E0D\u80FD\u4E3A\u7A7A");
      const picked = new Set(s.split(/[,，]/).map(normChoice).filter(Boolean));
      const expected = new Set((Array.isArray(q.answer) ? q.answer : []).map(normChoice));
      correct = picked.size === expected.size && [...picked].every((x) => expected.has(x));
      break;
    }
    case "numeric": {
      const s = typeof response === "string" ? response.trim() : "";
      if (!s) throw new Error("numeric \u4F5C\u7B54\u4E0D\u80FD\u4E3A\u7A7A");
      const nu = numericOf(s);
      const ne = numericOf(String(q.answer));
      correct = nu !== null && ne !== null && Math.abs(nu - ne) <= (q.tol ?? 0);
      break;
    }
    case "ordering": {
      const s = typeof response === "string" ? response.trim() : "";
      if (!s) throw new Error("ordering \u4F5C\u7B54\u4E0D\u80FD\u4E3A\u7A7A");
      const seq = s.split(/\n/).map(normAnswer).filter(Boolean);
      const expected = (Array.isArray(q.answer) ? q.answer : []).map(normAnswer);
      correct = seq.length === expected.length && seq.every((x, i) => x === expected[i]);
      break;
    }
    case "matching": {
      const s = typeof response === "string" ? response.trim() : "";
      if (!s) throw new Error("matching \u4F5C\u7B54\u4E0D\u80FD\u4E3A\u7A7A");
      const seq = s.split(/\n/).map(normAnswer);
      const expected = (Array.isArray(q.answer) ? q.answer : []).map(normAnswer);
      correct = seq.length === expected.length && seq.every((x, i) => x === expected[i]);
      break;
    }
    case "open_question": {
      const s = typeof response === "string" ? response.trim() : "";
      if (!s) throw new Error("open_question \u4F5C\u7B54\u4E0D\u80FD\u4E3A\u7A7A");
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
var OPEN_QUESTION_GRADING_SYSTEM = `You are a strict but constructive examiner grading a learner's open-ended answer that applies an entire lesson's content.

Score the answer from 0 to 10 (6 is passing):
- Coverage: does it apply the lesson's core concepts across sections?
- Correctness: are the applied concepts used accurately?
- Depth: does it show integrated understanding rather than surface recall?

Reply with ONLY one JSON object matching this shape:
{
  "score": 7,
  "feedback": "markdown text"
}
Rules:
- score must be an integer between 0 and 10.
- feedback must be Markdown with two mandatory parts: (1) \u9010\u70B9\u6279\u6539 \u2014 go through the learner's answer point by point, marking what is right and what is wrong or missing; (2) \u6539\u8FDB\u5EFA\u8BAE \u2014 concrete, actionable suggestions to reach full marks.
- Write the feedback in the same language as the learner's answer.
- Output JSON only, without Markdown fences or commentary.`;
function parseOpenGrading(raw) {
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("unparseable open-question grading reply");
  const doc = JSON.parse(m[0].replace(/,\s*([}\]])/g, "$1"));
  if (typeof doc.score !== "number" || typeof doc.feedback !== "string") {
    throw new Error("open-question grading reply missing score/feedback");
  }
  return { score: Math.min(10, Math.max(0, Math.round(doc.score))), feedback: doc.feedback };
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

// src/engine/question-bank.ts
init_paths();
var KINDS = [
  "single_choice",
  "true_false",
  "fill_in_blank",
  "reflection",
  "multi_choice",
  "numeric",
  "ordering",
  "matching",
  "open_question"
];
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
      } else if (kind === "multi_choice") {
        const options = Array.isArray(e.options) ? e.options.map(String) : [];
        const letters = options.map((_, j) => String.fromCharCode(65 + j));
        const picks = Array.isArray(answer) ? answer.map((a) => String(a).trim()) : [];
        if (options.length < 2 || !picks.length || picks.some((p) => !letters.includes(normChoice(p)))) {
          errors.push(`questions.${n}: multi_choice \u9700\u8981 options\uFF08\u22652\uFF09\u4E14 answer \u4E3A\u5408\u6CD5\u9009\u9879\u5B57\u6BCD\u6570\u7EC4`);
          return;
        }
      } else if (kind === "numeric") {
        if (numericOf(String(answer)) === null) {
          errors.push(`questions.${n}: numeric \u7684 answer \u5FC5\u987B\u662F\u6570\u503C\uFF08\u652F\u6301\u5C0F\u6570/\u5206\u6570/\u767E\u5206\u6570\uFF09`);
          return;
        }
        if (e.tol !== void 0 && !(Number(e.tol) > 0)) {
          errors.push(`questions.${n}: numeric \u7684 tol \u5FC5\u987B\u662F\u6B63\u6570`);
          return;
        }
      } else if (kind === "ordering") {
        const options = Array.isArray(e.options) ? e.options.map(String) : [];
        const seq = Array.isArray(answer) ? answer.map(String) : [];
        const same = options.length >= 2 && seq.length === options.length && [...seq].sort().join("\0") === [...options].sort().join("\0");
        if (!same) {
          errors.push(`questions.${n}: ordering \u9700\u8981 options\uFF08\u22652 \u4E71\u5E8F\u9879\uFF09\u4E14 answer \u4E3A\u540C\u4E00\u7EC4\u9879\u7684\u6B63\u786E\u987A\u5E8F\u6392\u5217`);
          return;
        }
      } else if (kind === "matching") {
        const options = Array.isArray(e.options) ? e.options.map(String) : [];
        const pairs = Array.isArray(answer) ? answer.map(String) : [];
        if (options.length < 2 || pairs.length !== options.length || pairs.some((p) => !p.trim())) {
          errors.push(`questions.${n}: matching \u9700\u8981 options\uFF08\u5DE6\u5217 \u22652\uFF09\u4E14 answer \u4E3A\u4E0E\u5DE6\u5217\u4E00\u4E00\u5BF9\u5E94\u7684\u53F3\u5217\u6587\u672C\u6570\u7EC4`);
          return;
        }
      } else if (kind === "open_question") {
        if (answer !== void 0 && answer !== null && typeof answer !== "string") {
          errors.push(`questions.${n}: open_question \u7684 answer \u5FC5\u987B\u662F\u53C2\u8003\u8981\u70B9\u6587\u672C\uFF08\u53EF\u7701\u7565\uFF09`);
          return;
        }
      }
      questions.push({
        id,
        kind,
        q: String(e.q).trim(),
        answer: kind === "numeric" ? String(answer) : Array.isArray(answer) ? answer.map(String) : answer,
        ...Array.isArray(e.options) && e.options.length ? { options: e.options.map(String) } : {},
        ...typeof e.explanation === "string" && e.explanation ? { explanation: e.explanation } : {},
        ...e.difficulty !== void 0 && Number.isInteger(Number(e.difficulty)) ? { difficulty: Number(e.difficulty) } : {},
        ...Array.isArray(e.uses) && e.uses.length ? { uses: e.uses.map(String) } : {},
        ...Array.isArray(e.tags) && e.tags.length ? { tags: e.tags.map(String) } : {},
        ...kind === "numeric" && Number(e.tol) > 0 ? { tol: Number(e.tol) } : {},
        ...typeof e.section === "string" && e.section.trim() ? { section: e.section.trim() } : {},
        ...e.archived === true ? { archived: true } : {},
        // 调度/统计块由作答侧写入，schema 只透传不做内部校验
        ...e.fsrs && typeof e.fsrs === "object" ? { fsrs: e.fsrs } : {},
        ...e.stats && typeof e.stats === "object" ? { stats: e.stats } : {}
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
    const doc = YAML.parseModel(yamlText);
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
import { existsSync as existsSync5 } from "node:fs";
init_notes();
function doneSet(graph, state) {
  return new Set(graph.names.filter((n) => ["review", "mastered", "skipped"].includes(effectiveStage(state, n))));
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
  const counts = { unseen: 0, ready: 0, learning: 0, review: 0, mastered: 0, skipped: 0 };
  const t = parseDay(today);
  for (const n of graph.names) {
    counts[effectiveStage(state, n)]++;
  }
  void t;
  return {
    counts,
    ready: readySet(graph, state, rValue),
    gated: readySet(graph, state, rValue, rGate),
    due: [],
    overdue: [],
    // 复习到期改由题库聚合驱动（bankDue 注入），不再读节点 frontmatter
    blocked: gateBlockers(graph, state, rValue, rGate)
  };
}
var Sessions = class _Sessions {
  constructor(paths, viewOf) {
    this.paths = paths;
    this.viewOf = viewOf;
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
  async statusJson(enabled, statsByCourse, today = todayStr()) {
    const courses = [];
    for (const c of enabled) {
      const { graph, state } = await this.viewOf(c);
      const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root));
      const rValue = (n) => retrievability(sched, state[n], today);
      const st = courseStats(graph, state, rValue, today);
      const stats = statsByCourse.get(c.name) ?? [];
      const t = parseDay(today);
      const withDue = stats.filter((s) => s.due !== null);
      const overdueNodes = withDue.filter((s) => (parseDay(s.due ?? "")?.getTime() ?? t.getTime()) < t.getTime());
      const dueNodes = withDue.filter((s) => s.due === today);
      courses.push({
        id: c.id,
        name: c.name,
        total: graph.names.length,
        counts: st.counts,
        due_today: dueNodes.length,
        overdue: overdueNodes.map((o) => ({ node: o.node, since: o.due, count: o.count, path: this.notePath(c.root, graph, o.node) })),
        ready: st.ready.map((n) => ({ node: n, path: this.notePath(c.root, graph, n) })),
        gated: st.gated.map((n) => ({ node: n, path: this.notePath(c.root, graph, n) })),
        blocked: Object.fromEntries(Object.entries(st.blocked).map(([n, weak]) => [n, weak.map(([p, r]) => ({ pre: p, r: Math.round(r * 1e3) / 1e3 }))]))
      });
    }
    return { date: today, courses };
  }
  // ---- 动态推荐 ----
  async recommendEvents(enabled, statsByCourse, today, limit) {
    const events = [];
    const seen = /* @__PURE__ */ new Set();
    for (const c of enabled) {
      const { graph, state } = await this.viewOf(c);
      const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root));
      const rValue = (n) => retrievability(sched, state[n], today);
      const st = courseStats(graph, state, rValue, today);
      const stats = statsByCourse.get(c.name) ?? [];
      const t = parseDay(today);
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
      for (const s of [...stats].sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""))) {
        const d = parseDay(s.due ?? "");
        if (!d) continue;
        if (d.getTime() < t.getTime()) {
          const days = daysBetween(t, d);
          add(
            "overdue",
            s.node,
            60 + Math.min(days, 10) * 3 + s.count * 2,
            `\u903E\u671F ${days} \u5929\uFF0C${s.count} \u9053\u9898\u5230\u671F`
          );
        } else if (d.getTime() === t.getTime()) {
          add("review", s.node, 55, `\u4ECA\u65E5 ${s.count} \u9053\u9898\u5230\u671F`);
        }
      }
      for (const n of graph.names.filter((x) => effectiveStage(state, x) === "learning").sort()) {
        const r = state[n] ? rValue(n) : 0.9;
        const stat = stats.find((s) => s.node === n);
        const struggling = stat?.accuracy !== null && stat !== void 0 && stat.accuracy < 0.6;
        const why = struggling ? `\u6B63\u786E\u7387\u4EC5 ${Math.round((stat?.accuracy ?? 0) * 100)}%\uFF0C\u5EFA\u8BAE\u5148\u590D\u4E60\u524D\u7F6E\u6982\u5FF5\u518D\u7EE7\u7EED` : `\u5B66\u5230\u4E00\u534A\uFF0C\u7EE7\u7EED\u5B8C\u6210\u5B83\uFF08\u4FDD\u6301\u7387\u7EA6 ${Math.round(r * 100)}%\uFF09`;
        add("learning", n, 52 + (1 - r) * 10 + (struggling ? 6 : 0), why);
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
  /** 单节点课程学习包：分节正文 + 前置 + 推荐下一步。 */
  async lesson(courseName, root, graph, state, node) {
    if (!graph.nset.has(node)) throw new Error(`[lesson] \u8BFE\u7A0B\u300C${courseName}\u300D\u4E2D\u6CA1\u6709\u8282\u70B9\u300C${node}\u300D\u3002`);
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(root, regionName, node);
    const { fm: rawFm, body } = await loadNote(path);
    const fm = asFm(rawFm);
    if (!fm) throw new Error(`[lesson] \u8BFE\u7A0B\u6587\u4EF6\u4E0D\u5B58\u5728\uFF08\u5185\u5BB9\u672A\u751F\u6210\uFF1F\uFF09\uFF1A${node}`);
    const sections = _Sessions.lessonSections(body);
    const sched = await getScheduler(this.paths, this.paths.courseRoot(root));
    const rValue = (n) => retrievability(sched, state[n], todayStr());
    const candidates = readySet(graph, state, rValue).filter((n) => n !== node);
    const unlocks = candidates.filter((n) => graph.preOf[n].includes(node));
    return {
      course: courseName,
      node,
      region: regionName,
      stage: effectiveStage(state, node),
      mastery: masteryOfFm(fm),
      sections,
      prereqs: [...graph.preOf[node]],
      suggest_next: [...unlocks, ...candidates.filter((n) => !unlocks.includes(n))].slice(0, 8)
    };
  }
};

// src/engine/index.ts
init_dates();
init_store();

// src/engine/xp.ts
import { readFile as readFile9 } from "node:fs/promises";
init_dates();
init_store();
function xpForAnswer(kind, difficulty, correct, elapsedS, scheduled) {
  if (!correct && elapsedS !== null && elapsedS < XP_GUESS_SECONDS) return { xp: XP_GUESS_PENALTY, reason: "guess" };
  if (!scheduled) return { xp: 0, reason: "repeat" };
  if (!correct) return { xp: 0, reason: "wrong" };
  const w = XP_BASE[kind] ?? 1;
  return { xp: Math.max(1, Math.round(w * Math.max(1, difficulty))), reason: "correct" };
}
function nominalBudget(est, questions) {
  if (est !== void 0 && est > 0) return est;
  const sum = questions.reduce((s, q) => s + (XP_BASE[q.kind] ?? 1) * Math.max(1, q.difficulty ?? 1), 0);
  return sum > 0 ? sum : XP_PER_NODE_DEFAULT;
}
function difficultyCalibration(questions) {
  let weighted = 0;
  let weights = 0;
  for (const q of questions) {
    const w = (XP_BASE[q.kind] ?? 1) * Math.max(1, q.difficulty ?? 1);
    weights += w;
    const d = q.fsrs && typeof q.fsrs.difficulty === "number" && q.fsrs.difficulty > 0 ? q.fsrs.difficulty / FSRS_DIFFICULTY_MID : 1;
    weighted += w * d;
  }
  if (!weights) return 1;
  return Math.min(3, Math.max(0.5, weighted / weights));
}
async function readDailyGoal(paths) {
  try {
    const doc = JSON.parse(await readFile9(paths.learnhubConfigPath, "utf8"));
    return clampGoal(doc.daily_xp_goal ?? DAILY_XP_GOAL_DEFAULT);
  } catch {
    return DAILY_XP_GOAL_DEFAULT;
  }
}
async function writeDailyGoal(paths, goal) {
  const clamped = clampGoal(goal);
  let prev = {};
  try {
    prev = JSON.parse(await readFile9(paths.learnhubConfigPath, "utf8"));
  } catch {
  }
  await atomicWrite(paths.learnhubConfigPath, JSON.stringify({ ...prev, daily_xp_goal: clamped }, null, 1) + "\n");
  return clamped;
}
function clampGoal(n) {
  return Number.isFinite(n) ? Math.min(1e3, Math.max(5, Math.round(n))) : DAILY_XP_GOAL_DEFAULT;
}
function recXp(r) {
  return r.xp ?? 0;
}
function sumXp(practice, journal, day) {
  const hit = (ts) => !day || ts.slice(0, 10) === day;
  return practice.filter((r) => hit(r.ts)).reduce((s, r) => s + recXp(r), 0) + journal.filter((r) => hit(r.ts)).reduce((s, r) => s + recXp(r), 0);
}
function streakFrom(byDay, today) {
  const cursor = parseDay(today);
  if (!cursor) return 0;
  if (!(byDay[fmtDay(cursor)]?.total > 0)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (byDay[fmtDay(cursor)]?.total > 0) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

// src/engine/index.ts
function shuffled(items) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function revealAnswer(q) {
  switch (q.kind) {
    case "multi_choice":
      return Array.isArray(q.answer) ? q.answer.join("") : String(q.answer);
    case "ordering":
      return Array.isArray(q.answer) ? q.answer.join(" \u2192 ") : String(q.answer);
    case "matching":
      return Array.isArray(q.answer) && q.options?.length ? q.options.map((o, i) => `${o} \u2192 ${q.answer[i] ?? "?"}`).join("\uFF1B") : Array.isArray(q.answer) ? q.answer.join(" / ") : String(q.answer);
    case "fill_in_blank":
      return Array.isArray(q.answer) ? q.answer.join(" / ") : String(q.answer);
    default:
      return String(q.answer);
  }
}
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
    this.sessions = new Sessions(this.paths, async (course) => this.loadView(course));
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
  /** 无笔记节点补占位文件（保证 frontmatter 始终可查）。 */
  async ensureNote(root, graph, node) {
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(root, regionName, node);
    const fm = defaultFrontmatter(node);
    await saveNote(path, fm, "> \u5185\u5BB9\u5F85\u751F\u6210\u3002\n");
    return fm;
  }
  // ---- status / recommend ----
  async statusJson() {
    const stats = await this.bankSnapshot();
    return this.sessions.statusJson(await this.enabledCourses(), stats);
  }
  async recommend(limit = 5) {
    const stats = await this.bankSnapshot();
    const events = await this.sessions.recommendEvents(await this.enabledCourses(), stats, todayStr(), limit);
    return { date: todayStr(), events };
  }
  /** 全部启用课程的题库聚合（一次遍历）：每节点 due/count/accuracy/attempts。
   * 复习队列（due/count）与 struggle 提示（accuracy）共用；未做题节点也入表
   * （accuracy=null），供推荐流判定 struggle 与面板通用轮组装。 */
  async bankSnapshot() {
    const out = /* @__PURE__ */ new Map();
    const today = todayStr();
    for (const c of await this.enabledCourses()) {
      const items = [];
      let files = [];
      try {
        files = await readdir4(this.paths.bankDir(c.root));
      } catch {
        out.set(c.name, items);
        continue;
      }
      for (const f of files.filter((f2) => f2.endsWith(".yaml"))) {
        const node = f.replace(/\.yaml$/, "");
        const bank = await this.bank.load(this.paths.courseRoot(c.root), node);
        const qs = bank.questions.filter((q) => !q.archived);
        if (!qs.length) continue;
        let attempts = 0;
        let correct = 0;
        const dues = [];
        for (const q of qs) {
          attempts += q.stats?.attempts ?? 0;
          correct += q.stats?.correct ?? 0;
          if (q.fsrs?.reps && q.fsrs.due <= today) dues.push(q.fsrs.due);
        }
        items.push({
          node,
          due: dues.sort()[0] ?? null,
          count: dues.length,
          accuracy: attempts ? Math.round(correct / attempts * 100) / 100 : null,
          attempts
        });
      }
      out.set(c.name, items);
    }
    return out;
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
      const done = new Set(Object.entries(state).filter(([, f]) => ["review", "mastered", "skipped"].includes(f.stage)).map(([n]) => n));
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
  // ---- 图探索（agent 逐步查询，不拉全图）----
  /** 单节点图详情：schema 字段值 + 直接邻域（succ）+ enc 边（含 note）+ 前置传递闭包。 */
  async graphNode(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[graph-node] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u8BFE\u7A0B\u300C${c.name}\u300D\u7684\u56FE\u5185\u3002`);
    let gnode;
    for (const r of graph.regions) for (const b of r.blocks) {
      const hit = b.nodes.find((n) => n.name === node);
      if (hit) {
        gnode = hit;
        break;
      }
    }
    const seen = /* @__PURE__ */ new Set([node]);
    const queue = [node];
    while (queue.length) {
      const u = queue.shift();
      for (const p of graph.preOf[u]) if (!seen.has(p)) {
        seen.add(p);
        queue.push(p);
      }
    }
    const closure = [...seen].filter((n) => n !== node).sort((a, b) => (graph.depth[b] ?? 0) - (graph.depth[a] ?? 0));
    const fm = state[node];
    return {
      course: c.name,
      node,
      region: graph.blockOf[node][1],
      block: graph.blockOf[node][2],
      depth: graph.depth[node] ?? 0,
      opt: graph.opt.has(node),
      pre: graph.preOf[node],
      succ: graph.succ[node] ?? [],
      enc: gnode?.enc ?? [],
      est: graph.estOf[node],
      type: graph.typeOf[node],
      bloom: graph.bloomOf[node],
      difficulty: graph.difficultyOf[node],
      note: graph.noteOf[node],
      stage: effectiveStage(state, node),
      mastery: masteryOfFm(fm),
      content: fm?.content ? { version: fm.content.version, status: fm.content.status } : void 0,
      prereq_closure: closure
    };
  }
  /** 区/块浏览：按区名/块名过滤的节点清单（探索某区域的结构与内容状态）。 */
  async graphBrowse(courseKey, region, block) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (region && !graph.regions.some((r) => r.name === region)) {
      throw new Error(`[graph-browse] \u533A\u300C${region}\u300D\u4E0D\u5B58\u5728\uFF08\u53EF\u7528\uFF1A${graph.regions.map((r) => r.name).join("\u3001")}\uFF09`);
    }
    const regions = graph.regions.filter((r) => !region || r.name === region).map((r) => ({
      name: r.name,
      blocks: r.blocks.filter((b) => !block || b.name === block).map((b) => ({
        name: b.name,
        nodes: b.nodes.map((n) => ({
          node: n.name,
          depth: graph.depth[n.name] ?? 0,
          stage: effectiveStage(state, n.name),
          est: graph.estOf[n.name],
          difficulty: graph.difficultyOf[n.name],
          type: graph.typeOf[n.name],
          content_status: state[n.name]?.content.status ?? "draft"
        }))
      }))
    }));
    const total = regions.reduce((s, r) => s + r.blocks.reduce((t, b) => t + b.nodes.length, 0), 0);
    return { course: c.name, total, regions };
  }
  /** 前置路径查询：from 是否（以及经哪条链）是 to 的前置。 */
  async graphPath(courseKey, from, to) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    if (!graph.nset.has(from)) throw new Error(`[graph-path] from \u8282\u70B9\u300C${from}\u300D\u4E0D\u5728\u8BFE\u7A0B\u300C${c.name}\u300D\u7684\u56FE\u5185\u3002`);
    if (!graph.nset.has(to)) throw new Error(`[graph-path] to \u8282\u70B9\u300C${to}\u300D\u4E0D\u5728\u8BFE\u7A0B\u300C${c.name}\u300D\u7684\u56FE\u5185\u3002`);
    const seen = /* @__PURE__ */ new Set([to]);
    const parent = {};
    const queue = [to];
    while (queue.length) {
      const u = queue.shift();
      for (const p of graph.preOf[u]) if (!seen.has(p)) {
        seen.add(p);
        parent[p] = u;
        queue.push(p);
      }
    }
    if (!seen.has(from)) {
      return { course: c.name, from, to, related: false, message: `\u300C${from}\u300D\u4E0D\u5728\u300C${to}\u300D\u7684\u524D\u7F6E\u95ED\u5305\u5185\u3002` };
    }
    const chain = [from];
    let cur = from;
    while (cur !== to) {
      cur = parent[cur];
      chain.push(cur);
    }
    return {
      course: c.name,
      from,
      to,
      related: true,
      direct: graph.preOf[to].includes(from),
      closure_size: seen.size - 1,
      chain,
      depth_span: (graph.depth[to] ?? 0) - (graph.depth[from] ?? 0)
    };
  }
  // ---- 提案门禁包装（apply 前 audit 拦截） ----
  async graphPropose(kind, yamlText) {
    return kind === "edit" ? this.proposals.proposeEdit(yamlText) : this.proposals.proposeGen(yamlText);
  }
  async graphApply(kind, pid) {
    const pending = await this.store.takePending(kind, pid);
    const course = await this.registry.get(pending.course);
    let audit = { ok: true, warns: [], health: 0 };
    if (course) {
      const { graph } = await this.loadView(course);
      const result = await runAudit(this.paths, course.root, course.name, graph, graph.regions);
      audit = { ok: !result.failed, warns: result.warns.slice(0, 8), health: graphHealthScore(graph).score };
    }
    return kind === "edit" ? this.proposals.applyEdit(pid, audit) : this.proposals.applyGen(pid, audit);
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
  /** 可用提示词类型（内置 + 自建变体）。 */
  async promptKinds() {
    return this.content.promptKinds();
  }
  /** 节点内容版本（frontmatter content.version；面板增量刷新依据）。 */
  async contentVersion(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { state } = await this.loadView(c);
    return state[node]?.content.version ?? 0;
  }
  /** 对现有课程笔记跑质检门（agent 手改正文后的校验入口；只读，不落盘不改状态）。 */
  async contentCheck(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[check] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    const [, regionName] = graph.blockOf[node];
    const { body } = await loadNote(this.paths.courseNotePath(c.root, regionName, node));
    return this.content.gateReport(graph, c.root, node, body);
  }
  /** 生成落盘门：gate_report → applyGeneration（version+1, draft）。
   * 节点笔记不存在时先建骨架（allo on-demand 语义：大纲即时、正文按需落盘）。
   * learnhub-interactive 标记块先拆出 HTML 落盘为交互件文件，再以引用块进质检门——
   * 门禁检查「interactive 引用文件存在」时文件必须已就位。 */
  async contentApply(courseKey, node, body) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[apply] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    if (!state[node]) await this.ensureNote(c.root, graph, node);
    const split = Content.extractInteractive(body, c.root);
    if (split.invalid.length) {
      throw new Error(`[apply] learnhub-interactive \u6807\u8BB0\u5757\u8DEF\u5F84\u975E\u6CD5\uFF08\u53EA\u5141\u8BB8\u8BFE\u7A0B\u6839\u5185\u76F8\u5BF9 .html \u8DEF\u5F84\uFF0C\u65E0 ..\uFF09: ${split.invalid.join("\u3001")}`);
    }
    const courseRoot = this.paths.courseRoot(c.root);
    for (const f of split.files) {
      const target = `${courseRoot}/${f.rel}`;
      await mkdir8(target.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
      await writeFile8(target, f.html, "utf8");
    }
    const gate = await this.content.gateReport(graph, c.root, node, split.body);
    const html = Content.checkInteractiveHtml(split.files);
    if (!gate.passed || html.findings.length) {
      throw new Error(`[apply] \u8D28\u68C0\u95E8\u672A\u8FC7\uFF1A
${[...gate.findings, ...html.findings].map((e) => `  \u2717 ${e}`).join("\n")}
${[...gate.warns, ...html.warns].map((w) => `  \u26A0 ${w}`).join("\n")}`);
    }
    const normalized = this.content.normalizePractice(split.body);
    const version2 = await this.content.applyGeneration(
      c.root,
      graph,
      node,
      normalized.body,
      (n) => state[n],
      (rec) => this.store.appendJournal({ ...rec, course: c.name })
    );
    await this.content.queueDone(c.root, node);
    const interactiveNote = split.files.length ? `\uFF1B\u4EA4\u4E92\u4EF6 ${split.files.length} \u4E2A\u843D\u76D8 \u4EA4\u4E92/` : "";
    const hints = Content.encBackfeedHints(graph, node, split.body);
    const hintNote = hints.length ? `\uFF1B\u56FE\u4F9D\u8D56\u63D0\u9192 ${hints.length} \u6761` : "";
    return { version: version2, message: `[apply] ${node} \u6B63\u6587 v${version2} \u843D\u76D8\uFF08status=draft\uFF0C\u5F85\u4EBA\u5BA1\uFF09${interactiveNote}${hintNote}`, hints };
  }
  /** 大纲落盘：节清单 YAML → 校验 → frontmatter content.sections（全 pending），正文不动。
   * 骨架节点先建占位文件（allo on-demand：大纲即时）。 */
  async contentOutline(courseKey, node, yamlText) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[outline] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    if (!state[node]) await this.ensureNote(c.root, graph, node);
    return this.content.outlineApply(c.root, graph, node, yamlText, (rec) => this.store.appendJournal({ ...rec, course: c.name }));
  }
  /** 整课重置（「重新生成整课」第一步）：全部节点笔记备份进 .trash 后重写为未生成骨架
   * （content=draft/sections 清空、正文清空）；题库/交互/课程图三个生成产物目录移入同一
   * trash 备份目录（rename，可恢复）。图谱（data/）、注册表、学习进度（state/）、
   * 提示词快照、生成队列.md 均不动；重新生成由调用方按拓扑序串行跑生成管线。 */
  async contentReset(courseKey) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const trashBase = `${this.paths.trashDir}/regenerate-${stamp}`;
    const nodes = [];
    for (const node of graph.order.length ? graph.order : graph.names) {
      if (!state[node]) continue;
      const [, regionName] = graph.blockOf[node];
      const path = this.paths.courseNotePath(c.root, regionName, node);
      const backup = `${trashBase}/${c.root}/\u8BFE\u7A0B/${safeFilename(regionName)}/${safeFilename(node)}.md`;
      await mkdir8(backup.replace(/[/\\][^/\\]+$/, ""), { recursive: true });
      await writeFile8(backup, await readFile10(path, "utf8"), "utf8");
      const { fm } = await loadNote(path);
      await saveNote(path, {
        ...fm ?? {},
        content: { version: 0, generated_at: null, status: "draft", sections: [] }
      }, "> \u5185\u5BB9\u5F85\u751F\u6210\u3002\n");
      nodes.push(node);
    }
    const trashed = [];
    for (const dir of ["\u9898\u5E93", "\u4EA4\u4E92", "\u8BFE\u7A0B\u56FE"]) {
      const src = `${this.paths.courseRoot(c.root)}/${dir}`;
      if (!existsSync6(src)) continue;
      await mkdir8(trashBase, { recursive: true });
      await rename3(src, `${trashBase}/${dir}`);
      trashed.push(dir);
    }
    await this.store.appendJournal({
      course: c.name,
      node: "*",
      rating: null,
      kind: "content_reset",
      elapsed_days: 0,
      detail: `\u6574\u8BFE\u91CD\u7F6E\uFF1A${nodes.length} \u8282\u70B9\u7B14\u8BB0\u56DE draft\uFF1B\u79FB\u5165 .trash\uFF1A${trashed.join("\u3001") || "\uFF08\u65E0\uFF09"}`
    });
    return { course: c.name, nodes, trashed };
  }
  /** 单节正文落盘：门禁通过后按清单重组正文，该节置 ready/version+1；hints = enc 候选反哺提醒。 */
  async contentSection(courseKey, node, sectionId, md) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[section] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    return this.content.sectionApply(c.root, graph, node, sectionId, md, (rec) => this.store.appendJournal({ ...rec, course: c.name }));
  }
  /** 节清单视图：manifest + 每节现正文（面板节进度/单节重写入口用；
   * 无清单旧节点回退为整篇重导出，全部 ready）。 */
  async contentSectionsView(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[sections] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    const [, regionName] = graph.blockOf[node];
    const { body } = await loadNote(this.paths.courseNotePath(c.root, regionName, node));
    const mdByTitle = /* @__PURE__ */ new Map();
    for (const part of body.split(/^## /m).slice(1)) {
      const nl = part.indexOf("\n");
      const title = (nl >= 0 ? part.slice(0, nl) : part).trim();
      if (title) mdByTitle.set(title, (nl >= 0 ? part.slice(nl + 1) : "").trim());
    }
    const manifest = state[node]?.content.sections ?? Content.manifestFromBody(body, 0);
    return manifest.map((s) => ({ ...s, md: mdByTitle.get(s.title) ?? null }));
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
  async lesson(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    const lesson = await this.sessions.lesson(c.name, c.root, graph, state, node);
    const view = lesson;
    view.mastery = await this.nodeMastery(this.paths.courseRoot(c.root), node);
    const manifest = state[node]?.content.sections ?? null;
    view.manifest = manifest;
    if (manifest?.length) {
      const byTitle = new Map(manifest.map((s) => [s.title, s]));
      for (const s of view.sections ?? []) {
        const hit = byTitle.get(s.title);
        if (hit) {
          s.id = hit.id;
          s.type = hit.type;
        }
      }
    }
    return lesson;
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
            mastery: masteryOfFm(state[n.name]),
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
  /** 某节点题库题目列表（不含答案/评分要点；带到期日与作答统计——刷卡视图）。 */
  async questions(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node);
    return {
      course: c.name,
      node,
      mastery: await this.nodeMastery(this.paths.courseRoot(c.root), node),
      questions: bank.questions.filter((q) => q.archived !== true).map((q, i) => ({
        id: q.id,
        kind: q.kind,
        q: q.q,
        no: i + 1,
        difficulty: q.difficulty ?? 1,
        section: q.section ?? null,
        ...q.options?.length ? { options: q.options } : {},
        ...q.kind === "matching" && Array.isArray(q.answer) ? { pairOptions: shuffled([...new Set(q.answer)]) } : {},
        hasExplanation: Boolean(q.explanation),
        due: q.fsrs?.reps ? q.fsrs.due : null,
        attempts: q.stats?.attempts ?? 0,
        lastCorrect: q.stats?.attempts ? q.stats.correct / q.stats.attempts >= 0.6 : null
      }))
    };
  }
  /** 题库写入（LLM 产出过 schema 门禁后落盘）。 */
  async questionSave(courseKey, node, yamlText) {
    const c = await this.registry.resolve(courseKey);
    return this.bank.save(this.paths.courseRoot(c.root), yamlText, node);
  }
  /** allo 作答流：答题 → 自动判卷（reflection 走 AI）→ practice 流水 + 计数/EMA。
   * 调度不在此触碰（D15：评分仍经工作单 settle / grade 通道）。
   * elapsedS = 前端计时（题目渲染到提交的秒数）：记入流水并用于乱猜判定。 */
  async questionAnswer(llmComplete2, courseKey, node, qid, answer, elapsedS) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[question] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node);
    const idx = bank.questions.findIndex((q2) => q2.id === qid);
    if (idx < 0) throw new Error(`[question] ${node} \u7684\u9898\u5E93\u6CA1\u6709 ${qid}\u3002`);
    const q = bank.questions[idx];
    let score = 0;
    let feedback = "";
    if (q.kind === "reflection" || q.kind === "open_question") {
      const isOpen = q.kind === "open_question";
      const prompt = isOpen ? `Lesson question (\u7EFC\u5408\u5E94\u7528):
${q.q}

Learner's answer:
${answer}` + (String(q.answer).trim() ? `

Reference points (\u53C2\u8003\u8981\u70B9):
${String(q.answer)}` : "") : `Exercise prompt:
${q.q}

Learner's answer:
${answer}

Grading rubric (\u8BC4\u5206\u8981\u70B9):
${String(q.answer)}`;
      const raw = await llmComplete2(prompt, isOpen ? OPEN_QUESTION_GRADING_SYSTEM : REFLECTION_GRADING_SYSTEM);
      try {
        const v = isOpen ? parseOpenGrading(raw) : parseReflectionGrading(raw);
        score = isOpen ? v.score / 10 : v.score;
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
    const today = todayStr();
    const guessed = !correct && elapsedS !== null && elapsedS < XP_GUESS_SECONDS;
    const repeated = q.stats?.last === today && Boolean(q.fsrs?.reps) || guessed;
    const settle = xpForAnswer(q.kind, q.difficulty ?? 1, correct, elapsedS ?? null, !repeated);
    await this.store.appendPractice({
      course: c.name,
      node,
      ex: idx + 1,
      answer,
      correct,
      judge: q.kind,
      qid,
      feedback: feedback || void 0,
      elapsed_s: elapsedS ?? void 0,
      xp: settle.xp
    });
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(c.root, regionName, node);
    const { fm: rawFm, body } = await loadNote(path);
    const fm = asFm(rawFm);
    if (fm) {
      const next = applyPracticeEvidence(fm, correct ? 1 : 0);
      if (next.stage === "ready" || next.stage === "unseen") next.stage = "learning";
      await saveNote(path, next, body);
      if (next.stage !== fm.stage) {
        const { state: stateNow } = await this.loadView(c);
        await this.content.onStageChange(c.root, graph, stateNow, node, next.stage);
      }
    }
    let fs;
    if (guessed || repeated && q.fsrs) {
      fs = q.fsrs ?? null;
    } else {
      const sched = await getScheduler(this.paths, this.paths.courseRoot(c.root));
      fs = applyRatingBlock(q.fsrs ?? null, correct ? 3 : 1, today, sched).fs;
    }
    const stats = {
      attempts: (q.stats?.attempts ?? 0) + 1,
      correct: (q.stats?.correct ?? 0) + (correct ? 1 : 0),
      last: today
    };
    await this.bank.updateQuestion(this.paths.courseRoot(c.root), node, qid, { fsrs: fs, stats });
    const mastery = await this.nodeMastery(this.paths.courseRoot(c.root), node);
    return {
      correct,
      score: Math.round(score * 100),
      feedback,
      explanation: q.explanation ?? "",
      // 错题公布答案（allo answer_review 语义；reflection 的 rubric 与开放题的参考要点也回显供对照）
      answer: revealAnswer(q),
      kind: q.kind,
      due: fs.due,
      mastery,
      // 本次作答是否推进了该题 FSRS 调度（每题每天至多一次）
      scheduled: fs !== q.fsrs,
      // XP 时间账本：本次作答的结算结果
      xp: settle.xp,
      xp_reason: settle.reason
    };
  }
  /** 节点掌握度 = 该节点全部题目的作答正确率汇总（Σcorrect/Σattempts；无作答 → 0）。 */
  async nodeMastery(courseRoot, node) {
    const bank = await this.bank.load(courseRoot, node);
    let attempts = 0;
    let correct = 0;
    for (const q of bank.questions) {
      if (q.archived) continue;
      attempts += q.stats?.attempts ?? 0;
      correct += q.stats?.correct ?? 0;
    }
    if (!attempts) return 0;
    return Math.round(correct / attempts * 100) / 100;
  }
  // ---- 节点跳过 / 完成确认 ----
  /** 跳过（已有基础）：stage 置 skipped，调度视同已通过；取消跳过回 ready。 */
  async nodeSkip(courseKey, node, skipped) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[skip] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    if (!state[node]) await this.ensureNote(c.root, graph, node);
    const stage = skipped ? "skipped" : "ready";
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(c.root, regionName, node);
    const { fm: rawFm, body } = await loadNote(path);
    const fm = asFm(rawFm);
    if (fm) await saveNote(path, { ...fm, stage }, body);
    return { course: c.name, node, stage };
  }
  /** 完成确认（Math Academy 语义的 lesson 通过判定）：
   * 正确率（题库 stats 聚合）< 及格线且作答次数足够时默认拒绝——不推进 stage、
   * 不初始化复习卡，返回 accepted=false 供前端引导复习（force=true 旁路）。
   * 通过时：全部未归档题目纳入复习循环（已作答的按各自 FSRS 调度到期复习，
   * 没作答的初始化为明天起刷），节点 stage→review；全部做过且全对 → 满分
   * bonus XP（journal 流水）。节点 frontmatter 同步写一份「聚合代表」fsrs
   * （全部题里到期最早的那张卡）：审计 E5 要求 review 有 fsrs，且 R_gate 的
   * 可提取性仍从节点状态读。 */
  async nodeComplete(courseKey, node, force = false) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[complete] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    if (!state[node]) await this.ensureNote(c.root, graph, node);
    const courseRoot = this.paths.courseRoot(c.root);
    const bank = await this.bank.load(courseRoot, node);
    let attempts = 0;
    let correct = 0;
    for (const q of bank.questions) {
      if (q.archived) continue;
      attempts += q.stats?.attempts ?? 0;
      correct += q.stats?.correct ?? 0;
    }
    const accuracy = attempts ? Math.round(correct / attempts * 100) / 100 : null;
    if (state[node]?.stage === "mastered" || state[node]?.stage === "skipped") {
      return { accepted: true, accuracy, course: c.name, node, stage: state[node].stage, initialized: 0, due: null };
    }
    if (!force && attempts >= 3 && accuracy !== null && accuracy < PASS_SCORE) {
      return {
        accepted: false,
        accuracy,
        course: c.name,
        node,
        reason: `\u6B63\u786E\u7387 ${Math.round(accuracy * 100)}% \u4F4E\u4E8E\u53CA\u683C\u7EBF\uFF08${PASS_SCORE}\uFF09\uFF0C\u5EFA\u8BAE\u660E\u5929\u518D\u6765\u6216\u5148\u590D\u4E60\u524D\u7F6E\u6982\u5FF5\u3002`
      };
    }
    const sched = await getScheduler(this.paths, courseRoot);
    const today = todayStr();
    let initialized = 0;
    let due = null;
    let repCard = null;
    for (const q of bank.questions) {
      if (q.archived) continue;
      if (q.fsrs?.reps) {
        const d = q.fsrs.due;
        if (d && (!due || d < due)) {
          due = d;
          repCard = q.fsrs;
        }
        continue;
      }
      const { fs } = applyRatingBlock(null, 3, today, sched);
      await this.bank.updateQuestion(courseRoot, node, q.id, { fsrs: fs });
      initialized++;
      if (!due || fs.due < due) {
        due = fs.due;
        repCard = fs;
      }
    }
    if (attempts > 0 && correct === attempts) {
      await this.store.appendJournal({
        course: c.name,
        node,
        rating: null,
        kind: "xp_bonus",
        elapsed_days: 0,
        xp: XP_PERFECT_BONUS,
        detail: `\u6EE1\u5206\u5B8C\u6210 +${XP_PERFECT_BONUS} XP`
      });
    }
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(c.root, regionName, node);
    const { fm: rawFm, body } = await loadNote(path);
    const fm = asFm(rawFm);
    if (fm && fm.stage !== "review") {
      const next = { ...fm, stage: "review" };
      if (repCard) next.fsrs = repCard;
      next.mastery = await this.nodeMastery(courseRoot, node);
      await saveNote(path, next, body);
      const { state: stateNow } = await this.loadView(c);
      await this.content.onStageChange(c.root, graph, stateNow, node, "review");
      const activeQs = bank.questions.filter((q) => !q.archived);
      const budget = Math.round(nominalBudget(graph.estOf[node], activeQs) * difficultyCalibration(activeQs));
      let earned = 0;
      for (const rec of await this.store.practiceAll()) {
        if (rec.course === c.name && rec.node === node) earned += rec.xp ?? 0;
      }
      for (const rec of await this.store.journalTail(c.name, Number.MAX_SAFE_INTEGER)) {
        if (rec.node === node) earned += rec.xp ?? 0;
      }
      const delta = budget - earned;
      if (delta !== 0) {
        await this.store.appendJournal({
          course: c.name,
          node,
          rating: null,
          kind: "xp_settle",
          elapsed_days: 0,
          xp: delta,
          detail: `XP \u9884\u7B97\u5BF9\u8D26\uFF1AN\u2080=${nominalBudget(graph.estOf[node], activeQs)} \xD7 k=${difficultyCalibration(activeQs).toFixed(2)} = ${budget}\uFF0C\u8FC7\u7A0B\u51C0 ${earned}`
        });
      }
    }
    return { accepted: true, accuracy, course: c.name, node, stage: "review", initialized, due };
  }
  // ---- XP 时间账本（Math Academy 语义：1 XP ≈ 1 分钟有效专注） ----
  /** XP 视图：今日 XP / streak / 每日目标 / 每课程 ETA。
   * ETA 预算制：剩余工作量 = Σ(未完成节点 N₀×k)——est 内容定价 × FSRS 难度校准，
   * 随作答证据积累自动校准；days = 剩余预算 ÷ 每日目标。 */
  async xpStatus() {
    const today = todayStr();
    const [practice, journal, activity, goal] = await Promise.all([
      this.store.practiceAll(),
      this.store.journalTail(null, Number.MAX_SAFE_INTEGER),
      this.store.activityCounts(),
      readDailyGoal(this.paths)
    ]);
    const eta = [];
    for (const c of await this.enabledCourses()) {
      const { graph, state } = await this.loadView(c);
      const counts = { unseen: 0, ready: 0, learning: 0, review: 0, mastered: 0, skipped: 0 };
      for (const n of graph.names) counts[effectiveStage(state, n)]++;
      const remaining = counts.unseen + counts.ready + counts.learning;
      const done = counts.review + counts.mastered + counts.skipped;
      let remainingXp = 0;
      for (const n of graph.names) {
        const st = effectiveStage(state, n);
        if (st !== "unseen" && st !== "ready" && st !== "learning") continue;
        const bankDoc = await this.bank.load(this.paths.courseRoot(c.root), n);
        const activeQs = bankDoc.questions.filter((q) => !q.archived);
        remainingXp += nominalBudget(graph.estOf[n], activeQs) * difficultyCalibration(activeQs);
      }
      const per = remaining ? Math.max(1, Math.round(remainingXp / remaining)) : 0;
      eta.push({
        course: c.name,
        remaining,
        done,
        per_node: per,
        days: remainingXp > 0 ? Math.ceil(remainingXp / Math.max(1, goal)) : 0
      });
    }
    return { date: today, today_xp: sumXp(practice, journal, today), goal, streak: streakFrom(activity, today), eta };
  }
  /** 调整每日 XP 目标（state/learnhub.json）。 */
  async setDailyGoal(goal) {
    return { goal: await writeDailyGoal(this.paths, goal) };
  }
  // ---- 生成任务持久化（host 的 genJobs 内存态落盘出口；D14：文件读写收口 engine）----
  /** 全量写入生成任务注册表（host 在每次任务状态变更时调用）。 */
  async saveGenJobs(jobs) {
    await atomicWrite(this.paths.genJobsPath, JSON.stringify(jobs, null, 1) + "\n");
  }
  /** 读入生成任务注册表；文件缺失/损坏返回空表。 */
  async loadGenJobs() {
    try {
      const doc = JSON.parse(await readFile10(this.paths.genJobsPath, "utf8"));
      return Array.isArray(doc) ? doc : [];
    } catch {
      return [];
    }
  }
  /** 「与 AI 讨论本课」上下文包：节点元信息 + 正文 + 题库摘要 + 图位置（面板 → dsh 会话的首条消息原料）。 */
  async discussionPack(courseKey, node) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[discuss] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    const fm = state[node];
    const mastery = await this.nodeMastery(this.paths.courseRoot(c.root), node);
    const lines = [];
    lines.push(`# \u8BFE\u7A0B\u4E0A\u4E0B\u6587\uFF1A${c.name} / ${node}`);
    lines.push(`- \u533A/\u5757\uFF1A${graph.blockOf[node][1]} \xB7 ${graph.blockOf[node][2]}\uFF1B\u6DF1\u5EA6 L${(graph.depth[node] ?? 0) + 1}\uFF1B\u9636\u6BB5\uFF1A${fm?.stage ?? "unknown"}\uFF1B\u638C\u63E1\u5EA6\uFF1A${Math.round(mastery * 100)}%`);
    const note = graph.noteOf[node];
    if (note) lines.push(`- note\uFF1A${note}`);
    const [, regionName] = graph.blockOf[node];
    try {
      const { body } = await loadNote(this.paths.courseNotePath(c.root, regionName, node));
      const cleaned = body.replace(/^>\s*内容待生成。\s*$/m, "").trim();
      lines.push("", "## \u8282\u70B9\u6B63\u6587", cleaned ? cleaned.slice(0, 6e3) : "\uFF08\u5C1A\u672A\u751F\u6210\u6B63\u6587\uFF09");
    } catch {
      lines.push("", "## \u8282\u70B9\u6B63\u6587", "\uFF08\u6B63\u6587\u6587\u4EF6\u7F3A\u5931\uFF09");
    }
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node);
    const qs = bank.questions.filter((q) => !q.archived);
    if (qs.length) {
      lines.push("", "## \u9898\u5E93\u6458\u8981", ...qs.map((q) => `- [${q.kind}] ${q.q.slice(0, 80)}`));
    }
    lines.push(
      "",
      "## \u56FE\u4F4D\u7F6E",
      `- \u524D\u7F6E\uFF1A${graph.preOf[node].join("\u3001") || "\u65E0"}`,
      `- \u540E\u7EE7\uFF1A${(graph.succ[node] ?? []).join("\u3001") || "\u65E0"}`
    );
    return lines.join("\n");
  }
  // ---- 学习面板扩展（题目管理/课程删除）----
  /** 全部题库条目（题目管理列表；不含答案，带到期与统计）。 */
  async questionsAll(courseKey) {
    const courses = courseKey ? [await this.registry.resolve(courseKey)] : await this.registry.enabled();
    const out = [];
    for (const c of courses) {
      let files = [];
      try {
        files = await readdir4(this.paths.bankDir(c.root));
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
            ...q.options?.length ? { options: q.options } : {},
            ...q.kind === "matching" && Array.isArray(q.answer) ? { pairOptions: [...new Set(q.answer)] } : {}
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
  /** 单题全量读取（含 answer/explanation）：修订/审题用——questionList 不带答案（作答流防泄题），改题前用这个看原题。 */
  async questionGet(courseKey, node, qid) {
    const c = await this.registry.resolve(courseKey);
    const bank = await this.bank.load(this.paths.courseRoot(c.root), node);
    const q = bank.questions.find((x) => x.id === qid);
    if (!q) throw new Error(`[question-get] \u300C${node}\u300D\u7684\u9898\u5E93\u6CA1\u6709 ${qid}\uFF08\u5171 ${bank.questions.length} \u9898\uFF09\u3002`);
    return { course: c.name, node, question: q };
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
   * llm 由 host 注入（输出可能带 markdown 围栏，解析侧 parseModel 统一剥离）。骨架节点（无正文）直接报错。
   * opts.sections = 节标注清单（逐节管线）：模型照抄清单节 id 进 section 字段；
   * opts.generic = 只出跨节综合题（section 强制「通用」，逐节管线收尾用）。 */
  async questionGenerate(courseKey, node, count, llm, opts) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[quiz] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    const [, regionName] = graph.blockOf[node];
    const note = await loadNote(this.paths.courseNotePath(c.root, regionName, node));
    const body = note.body.replace(/^>\s*内容待生成。\s*$/m, "").trim();
    if (!body) throw new Error(`[quiz] \u300C${node}\u300D\u8FD8\u6CA1\u6709\u6B63\u6587\u2014\u2014\u5148\u300C\u751F\u6210\u6B63\u6587\u300D\u518D\u51FA\u9898\u3002`);
    const tpl = await this.loadPrompt("\u9898\u76EE\u751F\u6210");
    const listing = opts?.sections?.length ? `

## \u8282\u6807\u6CE8\u6E05\u5355

section \u5B57\u6BB5\u5FC5\u987B\u7CBE\u786E\u53D6\u81EA\u4E0B\u5217\u8282 id\uFF08\u8DE8\u8282\u7EFC\u5408\u9898\u5199\u300C\u901A\u7528\u300D\uFF09\uFF1A
${opts.sections.map((s) => `- ${s.id} \uFF5C ${s.title}`).join("\n")}` : "";
    const raw = await llm(`${tpl}${listing}

## \u9898\u76EE\u6570\u91CF

${count} \u9053

---

${body}`);
    const doc = YAML.parseModel(raw);
    if (typeof doc !== "object" || doc === null || !Array.isArray(doc.questions) || !doc.questions.length) {
      throw new Error("[quiz] \u6A21\u578B\u6CA1\u6709\u4EA7\u51FA\u53EF\u7528\u9898\u76EE\uFF08questions \u4E3A\u7A7A\uFF09\u3002");
    }
    let added = 0;
    let skipped = 0;
    for (const raw2 of doc.questions.slice(0, Math.max(1, count))) {
      const q = { ...raw2 };
      delete q.id;
      if (opts?.generic) q.section = "\u901A\u7528";
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
  /** 逐节出题（逐节管线第 2 段）：每个内容节一次模型调用（出题量自适应：大纲含练习节 1 道，否则 2 道），
   * section 服务端强制为该节 id；练习/交互节跳过，正文未生成的节（断点续跑）跳过。 */
  async questionGenerateSections(courseKey, node, llm) {
    const c = await this.registry.resolve(courseKey);
    const { graph, state } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[quiz] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    const manifest = state[node]?.content.sections;
    if (!manifest?.length) throw new Error(`[quiz] \u300C${node}\u300D\u6CA1\u6709\u8282\u6E05\u5355\u2014\u2014\u5148\u8FD0\u884C\u5927\u7EB2\u3002`);
    const [, regionName] = graph.blockOf[node];
    const { body } = await loadNote(this.paths.courseNotePath(c.root, regionName, node));
    const mdByTitle = /* @__PURE__ */ new Map();
    for (const part of body.split(/^## /m).slice(1)) {
      const nl = part.indexOf("\n");
      const title = (nl >= 0 ? part.slice(0, nl) : part).trim();
      if (title) mdByTitle.set(title, (nl >= 0 ? part.slice(nl + 1) : "").trim());
    }
    const tpl = await this.loadPrompt("\u9898\u76EE\u751F\u6210");
    const perSection = manifest.some((s) => s.type === "\u7EC3\u4E60") ? 1 : 2;
    let added = 0;
    let sections = 0;
    for (const s of manifest) {
      if (s.type === "\u7EC3\u4E60" || s.type === "\u4EA4\u4E92") continue;
      const sectionMd = mdByTitle.get(s.title);
      if (!sectionMd) continue;
      sections++;
      const raw = await llm(`${tpl}

## \u8282\u6807\u6CE8\u6E05\u5355

section \u5B57\u6BB5\u5FC5\u987B\u7CBE\u786E\u5199\u300C${s.id}\u300D\uFF08\u672C\u6279\u5168\u90E8\u9898\u76EE\u90FD\u5C5E\u4E8E\u8FD9\u4E00\u8282\uFF09\u3002

## \u9898\u76EE\u6570\u91CF

${perSection} \u9053

---

## ${s.title}

${sectionMd}`);
      let doc = null;
      try {
        doc = YAML.parseModel(raw);
      } catch {
        continue;
      }
      if (typeof doc !== "object" || doc === null || !Array.isArray(doc.questions)) continue;
      for (const rawQ of doc.questions) {
        const q = { ...rawQ ?? {}, section: s.id };
        delete q.id;
        try {
          await this.bank.addQuestion(this.paths.courseRoot(c.root), node, q);
          added++;
        } catch {
        }
      }
    }
    return { course: c.name, node, added, sections };
  }
  /** 交互件成绩结算：面板 sandbox iframe 上报 LEARNHUB_COMPLETE → practice 流水 +
   * 练习证据 EMA（复用题库作答链路；judge='interactive'、qid='interactive:<节id>'）。
   * 同一节同日只记一次（防刷）；不碰题目 FSRS（交互件不是题库题），
   * 节点掌握度仍是题库作答正确率，不随交互件成绩变化。 */
  async interactiveSettle(courseKey, node, sectionId, score, detail) {
    const c = await this.registry.resolve(courseKey);
    const { graph } = await this.loadView(c);
    if (!graph.nset.has(node)) throw new Error(`[interactive] \u8282\u70B9\u300C${node}\u300D\u4E0D\u5728\u56FE\u5185\u3002`);
    if (!Number.isFinite(score)) throw new Error("[interactive] score \u5FC5\u987B\u662F\u6570\u5B57\u3002");
    const clamped = Math.min(1, Math.max(0, score));
    const qid = `interactive:${sectionId}`;
    const today = todayStr();
    const played = (await this.store.practiceAll()).some((r) => r.course === c.name && r.node === node && r.judge === "interactive" && r.qid === qid && r.ts.startsWith(today));
    const mastery = await this.nodeMastery(this.paths.courseRoot(c.root), node);
    if (played) return { settled: false, mastery };
    await this.store.appendPractice({
      course: c.name,
      node,
      ex: 0,
      answer: detail ?? "",
      correct: clamped >= PASS_SCORE,
      judge: "interactive",
      qid,
      ...detail ? { feedback: detail } : {}
    });
    const [, regionName] = graph.blockOf[node];
    const path = this.paths.courseNotePath(c.root, regionName, node);
    const { fm: rawFm, body } = await loadNote(path);
    const fm = asFm(rawFm);
    if (fm) {
      const next = applyPracticeEvidence(fm, clamped);
      if (next.stage === "ready" || next.stage === "unseen") next.stage = "learning";
      await saveNote(path, next, body);
    }
    return { settled: true, mastery };
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
      await mkdir8(this.paths.trashDir, { recursive: true });
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

// src/index.ts
var name = "dsh-learnhub";
var inject = ["tools", "webServer", "llm"];
var llmCfg = { provider: "deepseek-official", model: "deepseek-v4-flash", fastEffort: "off" };
var genJobs = /* @__PURE__ */ new Map();
function persistGenJobs() {
  void engine.saveGenJobs([...genJobs.values()].map((j) => ({ ...j }))).catch(() => {
  });
}
var VAULT = "";
var CENTER_REL = "\u5B66\u4E60\u4E2D\u5FC3";
var engine;
var LOG_LIMIT = 1500;
var API = "/learnhub/api";
var PAGE = "/learnhub";
var PAGE_DIST = fileURLToPath(new URL("../web/dist/", import.meta.url));
var VENDOR_DIST = fileURLToPath(new URL("../web/vendor/", import.meta.url));
var FILE_MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};
var ASSET_MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8"
};
async function runLog(tool, output) {
  const path = `${engine.paths.centerStateDir}/\u8FD0\u884C\u65E5\u5FD7.md`;
  try {
    if (!existsSync7(path)) {
      await mkdir9(engine.paths.centerStateDir, { recursive: true });
      await appendFile2(path, "# \u8FD0\u884C\u65E5\u5FD7\n\n> \u63D2\u4EF6\u8C03\u7528 learnhub \u5F15\u64CE\u7684\u8BB0\u5F55\u3002\u5F15\u64CE\u81EA\u52A8\u4EA7\u51FA\uFF0C\u52FF\u624B\u5DE5\u6539\u3002\n", "utf8");
    }
    const ts = (/* @__PURE__ */ new Date()).toLocaleString("sv-SE");
    const clip = output.length > LOG_LIMIT ? output.slice(0, LOG_LIMIT) + "\n\u2026\uFF08\u5DF2\u622A\u65AD\uFF09" : output;
    await appendFile2(path, `
## ${ts} \xB7 ${tool}

\`\`\`
${clip.trim() || "\uFF08\u65E0\u8F93\u51FA\uFF09"}
\`\`\`
`, "utf8");
  } catch {
  }
}
async function run(tool, fn) {
  const out = await fn();
  await runLog(tool, out);
  return out;
}
async function apiRun(tool, fn) {
  const out = await fn();
  await runLog(tool, typeof out === "string" ? out : JSON.stringify(out));
  return out;
}
async function llmComplete(ctx, prompt, system, opts) {
  if (opts?.effort === void 0) return llmStreamOnce(ctx, prompt, system);
  try {
    return await llmStreamOnce(ctx, prompt, system, opts.effort);
  } catch (err) {
    if (!(err instanceof Error && err.code === "UNSUPPORTED_REASONING_EFFORT")) throw err;
    return llmStreamOnce(ctx, prompt, system);
  }
}
async function llmStreamOnce(ctx, prompt, system, effort) {
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
    ...system === void 0 ? {} : { system },
    ...effort === void 0 ? {} : { reasoningEffort: ReasoningEffortId(effort) }
  });
  for await (const chunk of stream) {
    if (chunk.type === "text-delta") text += chunk.text;
    if (chunk.type === "finish" && (chunk.reason.kind === "aborted" || chunk.reason.kind === "error")) {
      if (chunk.reason.kind === "aborted") throw new Error("\u6A21\u578B\u8C03\u7528\u88AB\u53D6\u6D88");
      const f = chunk.reason.failure;
      const status = f.status ? `/${f.status}` : "";
      const e = new Error(`\u6A21\u578B\u8C03\u7528\u5931\u8D25[${f.code}${status}]\uFF1A${String(f.message)}`);
      e.code = f.code;
      throw e;
    }
    if (chunk.type === "finish" && chunk.reason.kind === "max-tokens") truncated = true;
  }
  if (!text.trim()) throw new Error("\u6A21\u578B\u6CA1\u6709\u8FD4\u56DE\u5185\u5BB9");
  if (truncated) console.warn("[learnhub] \u8B66\u544A\uFF1A\u6A21\u578B\u8F93\u51FA\u88AB max-tokens \u622A\u65AD\uFF0C\u6B63\u6587\u53EF\u80FD\u4E0D\u5B8C\u6574");
  return text.trim();
}
function stripFences(body) {
  const m = body.match(/^```(?:markdown|md|yaml|yml|json)?\s*\n([\s\S]*?)\n```\s*$/);
  return m ? m[1] : body;
}
async function generateQuiz(ctx, course, node, count, opts) {
  return engine.questionGenerate(course, node, count, async (prompt) => stripFences(await llmComplete(ctx, prompt)), opts);
}
function sectionPrompt(tpl, pack, s) {
  return `${tpl}

## \u672C\u8282\u4EFB\u52A1

- \u8282 id\uFF1A${s.id}
- \u8282\u6807\u9898\uFF1A${s.title}
- \u8282\u7C7B\u578B\uFF1A${s.type}

---

${pack}`;
}
async function generateContent(ctx, course, node, style) {
  const key = `${course}/${node}`;
  const existing = genJobs.get(key);
  if (existing && (existing.status === "running" || existing.status === "cancelling")) {
    throw new Error(`\u300C${node}\u300D\u6B63\u5728\u751F\u6210\u4E2D\uFF0C\u8BF7\u7A0D\u5019\u3002`);
  }
  const job = { course, node, startedAt: (/* @__PURE__ */ new Date()).toISOString(), status: "running", phase: "outline", ...style ? { style } : {} };
  genJobs.set(key, job);
  persistGenJobs();
  try {
    const pack = await engine.contentPack(course, node);
    const sectionTpl = await engine.loadPrompt(style ? `\u8BFE\u7A0B\u8282\u751F\u6210-${style}` : "\u8BFE\u7A0B\u8282\u751F\u6210");
    let views = await engine.contentSectionsView(course, node);
    if (!views.some((s) => s.status === "ready")) {
      const outlineTpl = await engine.loadPrompt("\u8BFE\u7A0B\u5927\u7EB2");
      const outlineYaml = stripFences(await llmComplete(ctx, `${outlineTpl}

---

${pack}`, void 0, { effort: llmCfg.fastEffort }));
      if (job.status === "cancelling") throw new Error("\u751F\u6210\u5DF2\u53D6\u6D88\uFF0C\u7ED3\u679C\u5DF2\u4E22\u5F03\u3002");
      await engine.contentOutline(course, node, outlineYaml);
      views = await engine.contentSectionsView(course, node);
      if (!views.length) throw new Error("[generate] \u5927\u7EB2\u6CA1\u6709\u4EA7\u51FA\u4EFB\u4F55\u8282\u3002");
    }
    job.phase = "sections";
    job.progress = { done: views.filter((s) => s.status === "ready").length, total: views.length };
    persistGenJobs();
    for (const s of views) {
      if (s.status === "ready") continue;
      job.progress = { ...job.progress, current: s.title };
      persistGenJobs();
      const sectionMd = stripFences(await llmComplete(ctx, sectionPrompt(sectionTpl, pack, s), void 0, { effort: llmCfg.fastEffort }));
      if (job.status === "cancelling") throw new Error("\u751F\u6210\u5DF2\u53D6\u6D88\uFF0C\u7ED3\u679C\u5DF2\u4E22\u5F03\u3002");
      await engine.contentSection(course, node, s.id, sectionMd);
      job.progress = { done: job.progress.done + 1, total: job.progress.total };
      persistGenJobs();
    }
    return await finishWithQuiz(ctx, job, `\u300C${node}\u300D\u6B63\u6587\u5B8C\u6210\uFF08${job.progress.total} \u8282\uFF09`);
  } catch (err) {
    job.status = job.status === "cancelling" ? "cancelled" : "failed";
    job.message = err instanceof Error ? err.message : String(err);
    persistGenJobs();
    throw err;
  } finally {
    const keep = job.status === "failed" || job.status === "cancelled" ? 24 * 60 * 6e4 : 30 * 6e4;
    setTimeout(() => {
      const cur = genJobs.get(key);
      if (cur && cur.status !== "running" && cur.status !== "cancelling") genJobs.delete(key);
      persistGenJobs();
    }, keep).unref();
  }
}
async function finishWithQuiz(ctx, job, contentMsg) {
  job.phase = "quiz";
  job.message = `${contentMsg}\uFF1B\u81EA\u52A8\u51FA\u9898\u4E2D\u2026`;
  persistGenJobs();
  try {
    const per = await engine.questionGenerateSections(job.course, job.node, async (prompt) => stripFences(await llmComplete(ctx, prompt)));
    const quiz = await generateQuiz(ctx, job.course, job.node, 3, { generic: true });
    job.status = "done";
    job.message = `${contentMsg}\uFF1B\u51FA\u9898 ${per.added + quiz.added} \u9053\uFF08\u8282\u7ED1 ${per.added} + \u7EFC\u5408 ${quiz.added}\uFF0C\u9898\u5E93\u5171 ${quiz.total}\uFF09`;
  } catch (quizErr) {
    job.status = "done";
    job.message = `${contentMsg}\uFF1B\u81EA\u52A8\u51FA\u9898\u5931\u8D25\uFF08${quizErr instanceof Error ? quizErr.message : String(quizErr)}\uFF09\u2014\u2014\u53EF\u5728\u7EC3\u4E60\u9875\u5355\u72EC\u91CD\u8BD5`;
  }
  persistGenJobs();
  return job.message;
}
async function generateSection(ctx, course, node, sectionId) {
  const pack = await engine.contentPack(course, node);
  const views = await engine.contentSectionsView(course, node);
  const s = views.find((v) => v.id === sectionId);
  if (!s) throw new Error(`\u300C${node}\u300D\u6CA1\u6709\u8282\u300C${sectionId}\u300D\u2014\u2014\u5148\u8FD0\u884C\u5927\u7EB2\u3002`);
  const sectionTpl = await engine.loadPrompt("\u8BFE\u7A0B\u8282\u751F\u6210");
  const sectionMd = stripFences(await llmComplete(ctx, sectionPrompt(sectionTpl, pack, s), void 0, { effort: llmCfg.fastEffort }));
  const r = await engine.contentSection(course, node, sectionId, sectionMd);
  return `[section] \u300C${r.title}\u300Dv${r.version} \u843D\u76D8\u3002`;
}
async function resetCourseChain(ctx, courseKey) {
  const running = [...genJobs.values()].filter((j) => j.course === courseKey && (j.status === "running" || j.status === "cancelling"));
  if (running.length) throw new Error(`\u8BFE\u7A0B\u300C${courseKey}\u300D\u6709 ${running.length} \u4E2A\u751F\u6210\u4EFB\u52A1\u8FDB\u884C\u4E2D\uFF0C\u5148\u53D6\u6D88\u6216\u7B49\u5B8C\u6210\u518D\u91CD\u751F\u6210\u3002`);
  const c = await engine.resolveCourse(courseKey);
  const { graph } = await engine.loadView(c);
  const reset = await engine.contentReset(c.name);
  for (const [key, j] of genJobs.entries()) if (j.course === c.name) genJobs.delete(key);
  persistGenJobs();
  let chain = Promise.resolve();
  let queued = 0;
  for (const node of graph.order.length ? graph.order : graph.names) {
    queued++;
    chain = chain.then(() => generateContent(ctx, c.name, node).catch(() => {
    }));
  }
  void chain;
  return { reset, queued };
}
async function generationStatus() {
  const out = [];
  for (const [key, j] of genJobs.entries()) {
    let contentVersion;
    try {
      contentVersion = await engine.contentVersion(j.course, j.node);
    } catch {
    }
    out.push({ key, ...j, contentVersion });
  }
  return out;
}
function cancelGeneration(course, node) {
  const job = genJobs.get(`${course}/${node}`);
  if (!job) return { cancelled: false };
  if (job.status === "running") job.status = "cancelling";
  return { cancelled: true, status: job.status };
}
async function tutorChat(ctx, course, node, history) {
  const pack = await engine.discussionPack(course, node);
  const turns = history.map((h) => h).filter((h) => (h.role === "user" || h.role === "assistant") && typeof h.content === "string" && h.content.trim()).slice(-12);
  if (!turns.length || turns[turns.length - 1].role !== "user") {
    throw new Error("tutor \u5BF9\u8BDD\u5386\u53F2\u5FC5\u987B\u4EE5\u5B66\u4E60\u8005\u7684\u63D0\u95EE\u7ED3\u5C3E\u3002");
  }
  const transcript = turns.map((h) => `${h.role === "assistant" ? "[AI \u8001\u5E08]" : "[\u5B66\u4E60\u8005]"} ${h.content}`).join("\n\n");
  const system = `\u4F60\u662F learnhub \u7684 AI \u8001\u5E08\uFF0C\u6B63\u5728\u8F85\u5BFC\u5B66\u4E60\u8005\u653B\u514B\u4E00\u4E2A\u8BFE\u7A0B\u8282\u70B9\u3002\u53EA\u4F9D\u636E\u4E0B\u9762\u7684\u8BFE\u7A0B\u4E0A\u4E0B\u6587\u4E0E\u672C\u8BFE\u8303\u56F4\u56DE\u7B54\uFF1B\u8D85\u51FA\u8303\u56F4\u7684\u8FFD\u95EE\u7ED9\u4E00\u53E5\u6982\u62EC\u5E76\u5EFA\u8BAE\u56DE\u5230\u8BFE\u7A0B\u4E3B\u7EBF\u3002\u56DE\u7B54\u7528 Markdown\uFF0C\u7B80\u6D01\u76F4\u63A5\uFF0C\u516C\u5F0F\u7528 KaTeX\uFF08$...$\uFF09\u3002

\u82E5\u9875\u9762\u4E0A\u6709\u4EA4\u4E92\u6A21\u62DF\u4EF6\u4E14\u6F14\u793A\u80FD\u5E2E\u52A9\u7406\u89E3\uFF0C\u53EF\u5728\u56DE\u7B54\u672B\u5C3E\u9644\u4E00\u4E2A learnhub-teacher \u52A8\u4F5C\u5757\uFF08\u666E\u901A\u56DE\u7B54\u4E0D\u8981\u8F93\u51FA\uFF09\uFF1A
\`\`\`learnhub-teacher
{ "action": "highlight|setState|reveal|annotate", "selector": "#\u5143\u7D20CSS\u9009\u62E9\u5668", "state": {"\u53D8\u91CF\u540D": \u503C}, "text": "\u6279\u6CE8\u6587\u5B57" }
\`\`\`
\u9762\u677F\u4F1A\u628A\u5757\u8F6C\u6210\u300C\u5728\u4EA4\u4E92\u4EF6\u4E0A\u6F14\u793A\u300D\u6309\u94AE\u5E76\u5E7F\u64AD\u7ED9\u672C\u9875\u5168\u90E8\u4EA4\u4E92\u4EF6\uFF1Bhighlight/reveal \u9700 selector\uFF0Cannotate \u9700 text\uFF0CsetState \u9700 state\uFF08\u53D8\u91CF\u540D\u4E0E\u4EA4\u4E92\u4EF6\u6ED1\u6746\u4E00\u81F4\uFF09\u3002

${pack}`;
  return llmComplete(ctx, `${transcript}

\uFF08\u8BF7\u56DE\u7B54\u4E0A\u9762\u6700\u540E\u4E00\u6761\u5B66\u4E60\u8005\u7684\u63D0\u95EE\u3002\uFF09`, system);
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
function injectKatexIfMathed(html) {
  if (!/\$\$|\\\(|\\\[/.test(html) || /katex/i.test(html)) return html;
  const inject2 = [
    '<link rel="stylesheet" href="/learnhub/api/vendor/katex/katex.min.css">',
    '<script src="/learnhub/api/vendor/katex/katex.min.js"></script>',
    '<script src="/learnhub/api/vendor/katex/contrib/auto-render.min.js"></script>',
    '<script>document.addEventListener("DOMContentLoaded",function(){window.renderMathInElement(document.body,{delimiters:[{left:"$$",right:"$$",display:true},{left:"$",right:"$",display:false}],throwOnError:false})})</script>'
  ].join("\n");
  const head = html.toLowerCase().indexOf("</head>");
  return head === -1 ? html + inject2 : html.slice(0, head) + inject2 + "\n" + html.slice(head);
}
async function handleApi(ctx, req, res) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const route = url.pathname.slice(API.length);
  try {
    if (req.method === "GET" && route === "/status") {
      sendJson(res, 200, await apiRun("api/status", () => engine.statusJson()));
      return;
    }
    if (req.method === "GET" && route === "/courses") {
      const list = (await engine.enabledCourses()).map((c) => ({
        name: c.name,
        root: c.root,
        enabled: String(c.enabled !== false)
      }));
      sendJson(res, 200, list);
      return;
    }
    if (req.method === "GET" && route === "/lesson") {
      const node = url.searchParams.get("node");
      if (!node) throw new Error("missing required field: node");
      const course = url.searchParams.get("course") ?? void 0;
      sendJson(res, 200, await apiRun("api/lesson", () => engine.lesson(course, node)));
      return;
    }
    if (req.method === "GET" && route === "/recommend") {
      const limit = Number(url.searchParams.get("limit") ?? "5");
      sendJson(res, 200, await apiRun("api/recommend", () => engine.recommend(Number.isFinite(limit) ? limit : 5)));
      return;
    }
    if (req.method === "GET" && route === "/queue") {
      sendJson(res, 200, await apiRun("api/queue", () => engine.queueItemsAll()));
      return;
    }
    if (req.method === "GET" && route === "/courses/tree") {
      const course = url.searchParams.get("course") ?? void 0;
      sendJson(res, 200, await apiRun("api/courses/tree", () => engine.coursesTree(course)));
      return;
    }
    if (req.method === "GET" && route === "/questions") {
      const node = url.searchParams.get("node");
      if (!node) throw new Error("missing required field: node");
      const course = url.searchParams.get("course") ?? void 0;
      sendJson(res, 200, await apiRun("api/questions", () => engine.questions(course, node)));
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
        buf = await readFile11(`${VAULT}/${rel}`);
      } catch {
        sendJson(res, 404, { error: `file not found: ${rel}` });
        return;
      }
      res.writeHead(200, { "content-type": mime, "cache-control": "public, max-age=3600" });
      res.end(buf);
      return;
    }
    if (req.method === "GET" && route.startsWith("/vendor/")) {
      const rel = decodeURIComponent(route.slice("/vendor/".length)).replace(/\\/g, "/");
      if (!rel || rel.includes("..")) throw new Error("path traversal rejected");
      const ext = rel.slice(rel.lastIndexOf(".")).toLowerCase();
      const mime = ASSET_MIME[ext];
      if (!mime) throw new Error(`unsupported vendor file type: ${ext || "(none)"}`);
      const file = resolvePath(VENDOR_DIST, rel);
      if (!(file + sep).startsWith(VENDOR_DIST)) throw new Error("path traversal rejected");
      let buf;
      try {
        buf = await readFile11(file);
      } catch {
        sendJson(res, 404, { error: `vendor file not found: ${rel}` });
        return;
      }
      res.writeHead(200, { "content-type": mime, "cache-control": "public, max-age=86400" });
      res.end(buf);
      return;
    }
    if (req.method === "GET" && route === "/interactive") {
      const p = url.searchParams.get("path");
      if (!p) throw new Error("missing required field: path");
      const raw = p.replace(/\\/g, "/").replace(/^\/+/, "");
      if (raw.includes("..")) throw new Error("path traversal rejected");
      const rel = raw.startsWith(`${CENTER_REL}/`) ? raw : `${CENTER_REL}/${raw}`;
      const courseRoot = rel.slice(CENTER_REL.length + 1).split("/")[0];
      if (!(await engine.enabledCourses()).some((c) => c.root === courseRoot)) {
        throw new Error(`interactive \u4E0D\u5728\u4EFB\u4F55\u542F\u7528\u8BFE\u7A0B\u7684\u6839\u5185: ${courseRoot}`);
      }
      if (!rel.toLowerCase().endsWith(".html")) throw new Error("interactive \u53EA\u5141\u8BB8 .html");
      let buf;
      try {
        buf = await readFile11(`${VAULT}/${rel}`);
      } catch {
        sendJson(res, 404, { error: `file not found: ${rel}` });
        return;
      }
      res.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "content-security-policy": "default-src 'none'; script-src 'unsafe-inline' 'self'; style-src 'unsafe-inline' 'self'; img-src data: blob: 'self'; font-src data: 'self'",
        "cache-control": "no-store"
      });
      res.end(injectKatexIfMathed(buf.toString("utf8")));
      return;
    }
    if (req.method === "GET" && route === "/note") {
      const path = url.searchParams.get("path");
      if (!path) throw new Error("missing required field: path");
      sendJson(res, 200, await engine.resolveNote(VAULT, path, CENTER_REL));
      return;
    }
    if (req.method === "GET" && route === "/graph") {
      const course = url.searchParams.get("course") ?? void 0;
      const elementsOnly = url.searchParams.get("elements") === "1";
      sendJson(res, 200, await apiRun("api/graph", () => engine.graphAnalyze(course, elementsOnly)));
      return;
    }
    if (req.method === "GET" && route === "/proposals") {
      sendJson(res, 200, await apiRun("api/proposals", () => engine.graphProposals()));
      return;
    }
    if (req.method === "GET" && route === "/doctor") {
      sendJson(res, 200, await apiRun("api/doctor", () => engine.doctor()));
      return;
    }
    if (req.method === "GET" && route === "/questions-all") {
      const course = url.searchParams.get("course") ?? void 0;
      sendJson(res, 200, await apiRun("api/questions-all", () => engine.questionsAll(course)));
      return;
    }
    if (req.method === "GET" && route === "/xp") {
      sendJson(res, 200, await apiRun("api/xp", () => engine.xpStatus()));
      return;
    }
    if (req.method === "GET" && route === "/generate/status") {
      sendJson(res, 200, await apiRun("api/generate/status", () => generationStatus()));
      return;
    }
    if (req.method === "GET" && route === "/prompts") {
      sendJson(res, 200, await apiRun("api/prompts", () => engine.promptKinds()));
      return;
    }
    if (req.method === "GET" && route === "/discuss-pack") {
      const node = url.searchParams.get("node");
      if (!node) throw new Error("missing required field: node");
      const course = url.searchParams.get("course") ?? void 0;
      sendJson(res, 200, await apiRun("api/discuss-pack", () => engine.discussionPack(course, node)));
      return;
    }
    if (req.method === "POST") {
      const body = await readJson(req);
      if (route === "/rebuild") {
        sendJson(res, 200, { message: (await engine.rebuild()).message });
        return;
      }
      if (route === "/node/skip") {
        sendJson(res, 200, await apiRun("api/node/skip", () => engine.nodeSkip(need(body, "course"), need(body, "node"), body.skipped !== false)));
        return;
      }
      if (route === "/node/complete") {
        sendJson(res, 200, await apiRun("api/node/complete", () => engine.nodeComplete(need(body, "course"), need(body, "node"), body.force === true)));
        return;
      }
      if (route === "/feedback") {
        sendJson(res, 200, { message: await engine.submitFeedback(VAULT, CENTER_REL, need(body, "path")) });
        return;
      }
      if (route === "/proposals/apply") {
        const kind = need(body, "kind") === "edit" ? "edit" : "gen";
        sendJson(res, 200, await engine.graphApply(kind, body.id !== void 0 ? Number(body.id) : void 0));
        return;
      }
      if (route === "/proposals/reject") {
        const id = Number(body.id);
        if (!Number.isInteger(id)) throw new Error("missing required field: id");
        await engine.graphReject(id, typeof body.note === "string" ? body.note.trim() : "");
        sendJson(res, 200, { message: `[reject] \u63D0\u6848 #${id} \u5DF2\u62D2\u7EDD\u7559\u75D5\u3002` });
        return;
      }
      if (route === "/generate") {
        const style = typeof body.style === "string" && body.style.trim() ? body.style.trim() : void 0;
        sendJson(res, 200, await apiRun("api/generate", async () => ({
          message: await generateContent(ctx, need(body, "course"), need(body, "node"), style)
        })));
        return;
      }
      if (route === "/generate/section") {
        sendJson(res, 200, await apiRun("api/generate/section", async () => ({
          message: await generateSection(ctx, need(body, "course"), need(body, "node"), need(body, "section"))
        })));
        return;
      }
      if (route === "/course/reset") {
        sendJson(res, 200, await apiRun("api/course/reset", async () => resetCourseChain(ctx, need(body, "course"))));
        return;
      }
      if (route === "/interactive/settle") {
        const score = Number(body.score);
        sendJson(res, 200, await apiRun("api/interactive/settle", () => engine.interactiveSettle(
          need(body, "course"),
          need(body, "node"),
          need(body, "section"),
          Number.isFinite(score) ? score : 0,
          typeof body.detail === "string" ? body.detail : void 0
        )));
        return;
      }
      if (route === "/tutor") {
        const history = Array.isArray(body.messages) ? body.messages : [];
        sendJson(res, 200, await apiRun("api/tutor", async () => ({
          answer: await tutorChat(ctx, need(body, "course"), need(body, "node"), history)
        })));
        return;
      }
      if (route === "/question-generate") {
        const count = Number(body.count);
        sendJson(res, 200, await apiRun("api/question-generate", () => generateQuiz(ctx, need(body, "course"), need(body, "node"), Number.isInteger(count) && count > 0 ? count : 6)));
        return;
      }
      if (route === "/review") {
        sendJson(res, 200, { message: await engine.contentReview(need(body, "course"), need(body, "node")) });
        return;
      }
      if (route === "/question-save") {
        sendJson(res, 200, await engine.questionSave(need(body, "course"), need(body, "node"), need(body, "yaml")));
        return;
      }
      if (route === "/question-answer") {
        sendJson(res, 200, await apiRun("api/question-answer", () => engine.questionAnswer(
          (prompt) => llmComplete(ctx, prompt),
          need(body, "course"),
          need(body, "node"),
          need(body, "qid"),
          typeof body.answer === "string" ? body.answer : "",
          typeof body.elapsed_s === "number" && Number.isFinite(body.elapsed_s) ? body.elapsed_s : null
        )));
        return;
      }
      if (route === "/question-add") {
        const q = body.question;
        if (typeof q !== "object" || q === null) throw new Error("missing required field: question");
        sendJson(res, 200, await engine.questionAdd(
          need(body, "course"),
          need(body, "node"),
          q
        ));
        return;
      }
      if (route === "/question-archive") {
        sendJson(res, 200, await engine.questionArchive(
          need(body, "course"),
          need(body, "node"),
          need(body, "qid"),
          body.archived === true
        ));
        return;
      }
      if (route === "/course/delete") {
        sendJson(res, 200, await engine.courseDelete(need(body, "course")));
        return;
      }
      if (route === "/generate/cancel") {
        sendJson(res, 200, cancelGeneration(need(body, "course"), need(body, "node")));
        return;
      }
    }
    if (req.method === "PUT") {
      const body = await readJson(req);
      if (route === "/daily-goal") {
        const goal = Number(body.goal);
        if (!Number.isFinite(goal)) throw new Error("missing required field: goal");
        sendJson(res, 200, await apiRun("api/daily-goal", () => engine.setDailyGoal(goal)));
        return;
      }
      if (route === "/question-update") {
        const patch = typeof body.patch === "object" && body.patch !== null ? body.patch : {};
        sendJson(res, 200, await engine.questionUpdate(need(body, "course"), need(body, "node"), need(body, "qid"), patch));
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
  if (!existsSync7(vault)) throw new Error(`[learnhub] config.vault \u76EE\u5F55\u4E0D\u5B58\u5728\uFF1A${vault}`);
  CENTER_REL = (config?.centerRel ?? "\u5B66\u4E60\u4E2D\u5FC3").replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const center = `${vault}/${CENTER_REL}`;
  if (!existsSync7(center)) throw new Error(`[learnhub] \u5B66\u4E60\u4E2D\u5FC3\u76EE\u5F55\u4E0D\u5B58\u5728\uFF1A${center}`);
  VAULT = vault;
  engine = new LearnhubEngine({ vault, centerRel: CENTER_REL });
  void engine.loadGenJobs().then((stale) => {
    for (const raw of stale) {
      const j = raw;
      if (typeof j.course !== "string" || typeof j.node !== "string") continue;
      const key = `${j.course}/${j.node}`;
      const interrupted = j.status === "running" || j.status === "cancelling";
      genJobs.set(key, {
        course: j.course,
        node: j.node,
        startedAt: typeof j.startedAt === "string" ? j.startedAt : (/* @__PURE__ */ new Date()).toISOString(),
        status: interrupted ? "failed" : j.status ?? "failed",
        ...j.phase ? { phase: j.phase } : {},
        ...j.progress ? { progress: j.progress } : {},
        ...j.style ? { style: j.style } : {},
        message: interrupted ? "\u8FDB\u7A0B\u91CD\u542F\uFF0C\u4EFB\u52A1\u4E2D\u65AD\u2014\u2014\u53EF\u91CD\u8BD5" : typeof j.message === "string" ? j.message : void 0
      });
    }
    persistGenJobs();
    if (stale.length) console.log(`[learnhub] gen-jobs restored: ${stale.length} (interrupted marked failed)`);
  });
  if (config?.provider) llmCfg.provider = config.provider;
  if (config?.model) llmCfg.model = config.model;
  if (config?.fastEffort) llmCfg.fastEffort = config.fastEffort;
  const textOutput = {
    schema: { type: "string" },
    render: (_args, value) => [{ type: "text", text: String(value) }]
  };
  const tool = (name2, description, parameters, fn) => ctx.tools.register(defineTool({
    name: name2,
    description,
    parameters,
    output: textOutput,
    execute: fn
  }));
  tool(
    "learnhub_status",
    "Return the learning center status (center summary + per-course detail) as JSON.",
    {},
    () => run("learnhub_status", async () => JSON.stringify(await engine.statusJson()))
  );
  tool(
    "learnhub_skip",
    "Mark a node as skipped (learner already knows it) or un-skip. Skipped nodes count as passed: they leave the recommendation queue and no longer block successors.",
    {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name" },
      skipped: { type: "boolean", description: "true to skip (default), false to un-skip" }
    },
    (args) => run("learnhub_skip", async () => JSON.stringify(await engine.nodeSkip(args.course, args.node, args.skipped !== false)))
  );
  tool(
    "learnhub_complete",
    "Confirm a node has been learned this round. Accuracy below the passing line (0.6, with enough attempts) is rejected with accepted=false \u2014 review prerequisites or retry with force. On acceptance: unanswered bank questions get their FSRS card initialized (due tomorrow), the node stage moves to review, and a perfect-score completion earns bonus XP.",
    {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name" },
      force: { type: "boolean", description: "true to bypass the accuracy gate" }
    },
    (args) => run("learnhub_complete", async () => JSON.stringify(await engine.nodeComplete(args.course, args.node, args.force === true)))
  );
  tool(
    "learnhub_lesson",
    "Fetch one node's lesson pack as JSON: course body split into teaching sections (\u7EC3\u4E60/\u53CD\u9988 excluded, \u7B54\u6848 merged into \u4F8B\u9898), prereqs, and suggested next nodes. Use this to teach a node step by step.",
    {
      node: { type: "string", required: true, description: "Node name" },
      course: { type: "string", required: true, description: "Course name" }
    },
    (args) => run("learnhub_lesson", async () => JSON.stringify(await engine.lesson(args.course, args.node)))
  );
  tool(
    "learnhub_recommend",
    "Get the dynamic cross-course recommendation queue as JSON: next events (review/learning/new lesson) ranked by the priority rule (overdue reviews first by days overdue and retention decay, then half-finished lessons, then new lessons by unlock count and region rotation). Each event has type/course/node/score/why. Fetch the next batch after finishing one.",
    { limit: { type: "number", description: "Max events to return (default 5)" } },
    (args) => run("learnhub_recommend", async () => JSON.stringify(await engine.recommend(args.limit === void 0 ? 5 : args.limit)))
  );
  tool(
    "learnhub_rebuild",
    "Run audit gate + ready-list regeneration for all enabled courses, or one course.",
    { course: { type: "string", description: "Course name; omit to rebuild all enabled courses" } },
    (args) => run("learnhub_rebuild", async () => (await engine.rebuild(args.course)).message)
  );
  tool(
    "learnhub_feedback",
    "Submit content feedback of a course note: reads the note\u300C\u5185\u5BB9\u53CD\u9988\u300Dsection and marks the node flagged + regeneration queue.",
    { path: { type: "string", required: true, description: "Note path, vault-relative or absolute" } },
    (args) => run("learnhub_feedback", () => engine.submitFeedback(VAULT, CENTER_REL, args.path))
  );
  tool(
    "learnhub_note_resolve",
    "Resolve a course note: read its frontmatter node and map the path to its enabled course via \u8BFE\u7A0B\u6CE8\u518C\u8868.yaml.",
    { path: { type: "string", required: true, description: "Note path, vault-relative or absolute" } },
    (args) => run("learnhub_note_resolve", async () => JSON.stringify(await engine.resolveNote(VAULT, args.path, CENTER_REL)))
  );
  tool(
    "learnhub_graph_analyze",
    "Analyze a course knowledge graph: structural stats, unreachable nodes, bottlenecks, lapse hotspots, graph health score (0-100, see health), next-batch suggestions (suggestions.expand_blocks/missing_pre/unconverged), the full per-node schema (schema: pre/enc/est/bloom/difficulty/note per node \u2014 the data basis for edge-level self-checks), plus cytoscape render elements. Returns JSON. Run before planning each batch of graph edits; the next-batch plan must cite concrete entries from health/suggestions.",
    {
      course: { type: "string", description: "Course name; omit when only one course is enabled" },
      elementsOnly: { type: "boolean", description: "Only output cytoscape render elements (nodes/edges)" }
    },
    (args) => run("learnhub_graph_analyze", async () => JSON.stringify(await engine.graphAnalyze(args.course, args.elementsOnly)))
  );
  tool(
    "learnhub_graph_node",
    "Inspect one graph node in depth: schema field values (pre/est/type/bloom/difficulty/note), direct successors, enc component-skill edges with weights and notes, block placement, learning stage/content status, and the full transitive prerequisite closure (sorted deepest-first). Use to drill into a single node without pulling the whole graph.",
    {
      course: { type: "string", description: "Course name; omit when only one course is enabled" },
      node: { type: "string", required: true, description: "Node name" }
    },
    (args) => run("learnhub_graph_node", async () => JSON.stringify(await engine.graphNode(args.course, args.node)))
  );
  tool(
    "learnhub_graph_browse",
    "Browse a course graph by region and/or block: node listings with depth/stage/est/difficulty/type/content status. Omit both filters to list every region (structure overview); give region (and optionally block) to explore one area. Unknown region names fail loud with the valid list.",
    {
      course: { type: "string", description: "Course name; omit when only one course is enabled" },
      region: { type: "string", description: "Region name filter" },
      block: { type: "string", description: "Block name filter (requires region when ambiguous)" }
    },
    (args) => run("learnhub_graph_browse", async () => JSON.stringify(await engine.graphBrowse(args.course, args.region, args.block)))
  );
  tool(
    "learnhub_graph_path",
    "Ask whether one node is a (transitive) prerequisite of another and via which chain: returns related, direct, the BFS shortest chain from\u2192\u2026\u2192to, the full prerequisite-closure size of `to`, and the depth span. Use for teaching-path planning and for explaining why something is locked.",
    {
      course: { type: "string", description: "Course name; omit when only one course is enabled" },
      from: { type: "string", required: true, description: "Candidate prerequisite node" },
      to: { type: "string", required: true, description: "Target node" }
    },
    (args) => run("learnhub_graph_path", async () => JSON.stringify(await engine.graphPath(args.course, args.from, args.to)))
  );
  tool(
    "learnhub_graph_propose",
    "Submit a graph proposal for human review. kind=gen: full course graph YAML (course/mode/regions/blocks/nodes/pre); kind=edit: change ops (add_node/del_node/set_pre/set_enc/rename/move/set_note). add_node may carry optional per-node fields: est (minutes), type: practice, bloom (\u8BB0\u5FC6/\u7406\u89E3/\u5E94\u7528/\u5206\u6790/\u8BC4\u4EF7/\u521B\u9020), difficulty (1-5), enc (component-skill edges, same shape as the graph YAML) \u2014 keep difficulty jumps across pre edges under 2 or the audit flags R11. set_enc replaces a node's whole enc edge list (string item = weight 1, or {node,w,note}). Schema + structure gates reject bad YAML (including dangling enc edges); accepted proposals become pending until applied.",
    {
      kind: { type: "string", required: true, description: '"gen" (new/append course graph) or "edit" (change ops)' },
      yaml: { type: "string", required: true, description: "Full proposal YAML text (GenProposal or EditProposal schema)" }
    },
    (args) => run("learnhub_graph_propose", async () => JSON.stringify(await engine.graphPropose(args.kind === "edit" ? "edit" : "gen", args.yaml)))
  );
  tool(
    "learnhub_graph_proposals",
    "List graph proposals (gen/edit) by status \u2014 use status=pending to see what awaits human review in the panel, with the proposal id, course, reason, and op summary. After the user decides in the panel, apply with learnhub_graph_apply using that id.",
    {
      status: { type: "string", description: "Filter by status (default pending; e.g. applied/rejected)" },
      kind: { type: "string", description: "Filter by kind: gen or edit" }
    },
    (args) => run("learnhub_graph_proposals", async () => JSON.stringify(await engine.graphProposals(args.status, args.kind)))
  );
  tool(
    "learnhub_graph_apply",
    "Decide a pending graph proposal after human review: apply (audit-gated, writes data/*.yaml with rename linkage + journal + snapshot) or reject (kept on record). The apply result carries findings: audit warns plus a health-score hint when below the skill exit threshold \u2014 address them in the next batch.",
    {
      kind: { type: "string", required: true, description: '"gen" or "edit"' },
      id: { type: "number", description: "Proposal id; omit for the latest pending of this kind" },
      reject: { type: "boolean", description: "true to reject instead of apply" },
      note: { type: "string", description: "Rejection reason (recorded)" }
    },
    async (args) => run("learnhub_graph_apply", async () => {
      if (args.reject) {
        if (!args.id) throw new Error("reject requires the proposal id");
        await engine.graphReject(args.id, args.note ?? "");
        return `[reject] \u63D0\u6848 #${args.id} \u5DF2\u62D2\u7EDD\u7559\u75D5\u3002`;
      }
      return JSON.stringify(await engine.graphApply(args.kind === "edit" ? "edit" : "gen", args.id));
    })
  );
  tool(
    "learnhub_generate",
    "Generate one course note via the model: outline first (the model decides section split, order, and types from the content, topic, and style \u2014 no fixed structure), then one model call per section through the quality gates as a draft (ready sections are skipped, so retrying resumes the pipeline), then per-section + synthesis quiz questions. The context pack (prereqs, domain boundary, forbidden concepts) and user-editable prompt templates (state/\u63D0\u793A\u8BCD/\u8BFE\u7A0B\u5927\u7EB2.md, \u8BFE\u7A0B\u8282\u751F\u6210.md) drive the calls. Missing notes are scaffolded first (on-demand lesson semantics). style selects a per-section prompt variant (\u8BFE\u7A0B\u8282\u751F\u6210-<style>, e.g. \u82CF\u683C\u62C9\u5E95/\u8D39\u66FC) applied to every section call; the outline and gates stay on the default path.",
    {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name to generate" },
      style: { type: "string", description: "Prompt style variant; omit for the default template" }
    },
    (args) => run("learnhub_generate", () => generateContent(ctx, args.course, args.node, args.style))
  );
  tool(
    "learnhub_course_reset",
    "Reset one course for full regeneration: all node notes are backed up into .trash/regenerate-<ts>/ and rewritten as ungenerated skeletons; the question bank, interactive artifacts, and generated-image dirs move into the same backup. The graph, learning progress, and prompt snapshots are kept. Regeneration then runs as a background chain over all nodes in graph topological order (each node: outline \u2192 sections \u2192 quiz) and this call returns immediately with the queued count; progress shows in the panel generate tab. Refuses while generation tasks are running. Destructive but recoverable \u2014 confirm with the user before calling.",
    { course: { type: "string", required: true, description: "Course name" } },
    (args) => run("learnhub_course_reset", async () => {
      const r = await resetCourseChain(ctx, args.course);
      return JSON.stringify({ message: `\u5DF2\u91CD\u7F6E\u300C${args.course}\u300D\uFF08${r.reset.nodes.length} \u8282\u70B9\uFF09\uFF0C${r.queued} \u4E2A\u8282\u70B9\u5DF2\u5165\u961F\u91CD\u65B0\u751F\u6210\uFF08\u540E\u53F0\u94FE\uFF0C\u8FDB\u5EA6\u770B\u4EFB\u52A1\u6CE8\u518C\u8868\uFF09`, reset: r.reset, queued: r.queued });
    })
  );
  tool(
    "learnhub_course_delete",
    "Delete one course: remove it from the course registry and move the whole course directory into \u5B66\u4E60\u4E2D\u5FC3/.trash/ (recoverable by hand). Learning progress lives inside the course directory, so it goes too. Destructive \u2014 confirm with the user before calling; for a content-only redo prefer learnhub_course_reset (keeps the graph and progress).",
    { course: { type: "string", required: true, description: "Course name" } },
    (args) => run("learnhub_course_delete", async () => JSON.stringify(await engine.courseDelete(args.course)))
  );
  tool(
    "learnhub_question_generate",
    "Generate quiz questions for a node via the model \u2014 the same pipeline as the auto-quiz: node body \u2192 question prompt \u2192 llm \u2192 validateBank gate appends every question to the bank. Use when a node has no/too few questions.",
    {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name (must have generated content)" },
      count: { type: "number", description: "Question count cap (default 6)" }
    },
    (args) => run("learnhub_question_generate", async () => {
      const n = Number.isInteger(args.count) && args.count > 0 ? args.count : 6;
      return JSON.stringify(await generateQuiz(ctx, args.course, args.node, n));
    })
  );
  tool(
    "learnhub_question_update",
    "Update one bank question: patch merges into the stored question (q/options/answer/explanation/difficulty/section/uses) and the bank re-validates before writing; patch {archived:true|false} hides/restores it instead. learnhub_question_list omits answers \u2014 take corrections from the user or the note content, not from thin air.",
    {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name" },
      qid: { type: "string", required: true, description: 'Question id inside the bank, e.g. "q1"' },
      patch: { type: "object", additionalProperties: true, required: true, description: 'Fields to merge, e.g. {"answer":"A","explanation":"\u2026"} or {"archived":true}' }
    },
    (args) => run("learnhub_question_update", async () => {
      if (typeof args.patch.archived === "boolean") {
        await engine.questionArchive(args.course, args.node, args.qid, args.patch.archived);
        const { archived: _a, ...rest } = args.patch;
        if (Object.keys(rest).length) await engine.questionUpdate(args.course, args.node, args.qid, rest);
        return JSON.stringify({ course: args.course, node: args.node, qid: args.qid, archived: args.patch.archived });
      }
      return JSON.stringify(await engine.questionUpdate(args.course, args.node, args.qid, args.patch));
    })
  );
  tool(
    "learnhub_question_get",
    "Read one bank question in full, including answer, explanation, difficulty, section, and uses \u2014 the revision/authoring companion to learnhub_question_list (which omits answers on purpose for the answering flow). Read the original before correcting a question with learnhub_question_update.",
    {
      course: { type: "string", description: "Course name; omit when only one course is enabled" },
      node: { type: "string", required: true, description: "Node name" },
      qid: { type: "string", required: true, description: 'Question id inside the bank, e.g. "q1"' }
    },
    (args) => run("learnhub_question_get", async () => JSON.stringify(await engine.questionGet(args.course, args.node, args.qid)))
  );
  tool(
    "learnhub_content_check",
    "Run the automated content quality gates (out-of-scope references, alias consistency, unregistered code-block languages, interactive file existence) on an existing course note without applying anything. Run this after manually editing a course note in the vault; fix every reported finding.",
    {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name" }
    },
    (args) => run("learnhub_content_check", async () => JSON.stringify(await engine.contentCheck(args.course, args.node)))
  );
  tool(
    "learnhub_question_list",
    "List the question-bank questions of a node as JSON (no answers). Bank files live at <\u8BFE\u7A0B\u6839>/\u9898\u5E93/<\u8282\u70B9>.yaml; kinds: single_choice / true_false / fill_in_blank / multi_choice / numeric / ordering / matching / reflection / open_question.",
    {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name" }
    },
    (args) => run("learnhub_question_list", async () => JSON.stringify(await engine.questions(args.course, args.node)))
  );
  tool(
    "learnhub_question_save",
    "Save a question bank for a node: validates the Bank YAML (node/kind/q/answer per kind: single_choice needs options + letter answer; multi_choice options + letter array; true_false boolean; fill_in_blank accepted answers; numeric numeric answer + optional tol; ordering options + ordered answer items; matching left-column options + paired right-column answers; reflection grading rubric; open_question reference points) then writes <\u8BFE\u7A0B\u6839>/\u9898\u5E93/<\u8282\u70B9>.yaml.",
    {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name (must match the node field inside the YAML)" },
      yaml: { type: "string", required: true, description: "Bank YAML text (node/questions[id,kind,q,answer,options?,explanation?,difficulty?,uses?])" }
    },
    (args) => run("learnhub_question_save", async () => JSON.stringify(await engine.questionSave(args.course, args.node, args.yaml)))
  );
  tool(
    "learnhub_question_answer",
    "Answer one bank question (flashcard model): auto-judged 1.0/0.0 (reflection graded by AI against its rubric); the result drives THAT question's FSRS schedule (correct=Good, wrong=Again) and the node mastery aggregates per-question stats.",
    {
      course: { type: "string", required: true, description: "Course name" },
      node: { type: "string", required: true, description: "Node name" },
      qid: { type: "string", required: true, description: 'Question id inside the bank, e.g. "q1"' },
      answer: { type: "string", required: true, description: "User answer (choice: letter, multi_choice: comma-joined letters; true_false: \u5BF9/\u9519; fill_in_blank: text; numeric: number; ordering/matching: newline-joined item texts in submitted order; reflection/open_question: free text)" }
    },
    (args) => run("learnhub_question_answer", async () => JSON.stringify(await engine.questionAnswer((prompt) => llmComplete(ctx, prompt), args.course, args.node, args.qid, args.answer)))
  );
  ctx.effect(
    () => ctx.webServer.register({ kind: "prefix", path: API, handler: (req, res) => handleApi(ctx, req, res) }),
    "learnhub: client panel API routes"
  );
  ctx.effect(
    () => ctx.webServer.register({
      kind: "prefix",
      path: PAGE,
      handler: async (req, res) => {
        try {
          const url = new URL(req.url ?? "/", "http://localhost");
          if (url.pathname === PAGE) {
            res.writeHead(301, { location: `${PAGE}/` });
            res.end();
            return;
          }
          const rel = decodeURIComponent(url.pathname.slice(PAGE.length).replace(/^\/+/, "")) || "index.html";
          let file = resolvePath(PAGE_DIST, rel);
          if (!(file + sep).startsWith(PAGE_DIST)) file = join3(PAGE_DIST, "index.html");
          let data;
          try {
            data = await readFile11(file);
          } catch {
            file = join3(PAGE_DIST, "index.html");
            data = await readFile11(file);
          }
          const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
          const mime = ASSET_MIME[ext] ?? "application/octet-stream";
          const immutable = rel.startsWith("assets/");
          res.writeHead(200, {
            "content-type": mime,
            "cache-control": immutable ? "public, max-age=31536000, immutable" : "no-store"
          });
          res.end(data);
        } catch (err) {
          res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
          res.end(`learnhub panel missing (build ui/ first: npm run build): ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }),
    "learnhub: panel SPA (web/dist)"
  );
  console.log(`[learnhub] plugin loaded: vault=${VAULT}, center=${VAULT}/${CENTER_REL}, 25 tools registered (pure TS engine), page at ${PAGE}, API at ${API}/*`);
  void engine.statusJson().then((doc) => console.log(`[learnhub] self-check status OK (${JSON.stringify(doc).length} bytes)`)).catch((err) => console.error(`[learnhub] self-check FAILED: ${err instanceof Error ? err.message : String(err)}`));
}
export {
  apply,
  inject,
  name
};
/*! Bundled license information:

ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
  (* istanbul ignore next -- @preserve *)
*/
//# sourceMappingURL=index.js.map
