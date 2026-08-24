# dsh-learnhub

学习中心 Learnhub：DeepSeek Harness 的学习引擎插件。

- **host**（`lib/index.js`）：18 个 agent 工具（status / today / settle / grade / exercises / check / rebuild / feedback / writeback / note_resolve + 图谱四面 + CLI 逃生口）、`/learnhub/api/*` 面板后端路由、`/learnhub` 独立面板页（伺服 `web/index.html`，改页面无需重建）
- **client**（`lib/client.js`）：侧边栏底栏「学习中心」入口 + 全屏 iframe 面板（`shell.overlay` 座位）
- **引擎**：一切调用收口 `python -X utf8 -m learnhub`（vault 内 `学习中心/`），AI 生成/判卷走 dsh llm seam

## 安装

```sh
dsh plugin --profile web add "link:<repo>/learnhub-plugin"
```

bundle 已注册进 profile 的 `dsh.profile.bundles`；`time-context` 与 `schedule` 两行随 bundle patch 一起插入。

## 机器级配置（跨机器的关键）

仓库内不含任何机器路径。每台机器在自己的 profile patch
（`~/.dsh/profiles/web/cordis.patch.yml`）按 id 覆盖行 config：

```yaml
- id: dsh-learnhub
  config:
    vault: c:/Users/<you>/path/to/vault   # 必填：vault 根目录
    # centerRel: 学习中心                  # 缺省即可
    provider: deepseek-official
    model: deepseek-v4-flash
```

`config.vault` 缺失或目录不存在时插件加载直接报错（不做静默兜底）。

## 构建

```sh
cd learnhub-plugin
npm install
npm run build     # lib/index.js + lib/client.js
npm run check
```

`lib/` 产物已纳入 git 管理（根 `.gitignore` 的 `!learnhub-plugin/lib/` 例外），
克隆即可用；修改 `src/` 后重新 build 并提交产物。

## 目录

```
src/index.ts          host 插件源码
src/client/index.tsx  客户端源码（slots 座位注入）
web/index.html        独立面板页（仪表盘 + 做题面板，host 现读伺服）
cordis.patch.yml      bundle patch 层
preset/ skills/       「学习伙伴」preset 与 agent skills
```

preset 的用户根安装（一次性）：复制 `preset/learnhub/user-root-composition.yml`
到 `~/.dsh/.agent-presets/learnhub/agent.cordis.yml`（连同 `preset.yml`），
Include 指向本仓库内真实 composition，改仓库文件即生效。
注意必须真实目录：scanRoot 只认 `isDirectory()`，junction 会被跳过。
