# Mica Space for Codex

Mica Space 的 Codex 桌面版与 DeepSeek Harness 版共用画布和数据逻辑。`0.99.9-codex.1` 支持回答卡片上的来源跳转，并在设置、备份及恢复中说明备份不包含附件原文件。

## 安装

在本仓库根目录执行以下命令。需要 Node.js 22 或更新版本，以及支持 MCP Apps 的 Codex 桌面客户端。

```powershell
npm.cmd ci
codex.cmd plugin marketplace add .
codex.cmd plugin add mica-space@mica-space-local
```

macOS 和 Linux 使用 `npm` 和 `codex`。重启 Codex 后，支持全局 MCP Apps 入口的客户端可从左侧的 **Mica Space** 打开画布。也可以在会话中调用 `@Mica Space` 并请它打开画布。如果曾用 `mica-space-local` 注册过另一份源码，CLI 会提示市场名称冲突。先移除旧的同名市场，再注册当前目录。

## 模型和本地数据

复制仓库根目录的 `.env.example` 为 `.env`，填写 `MICA_MODEL`、`MICA_API_BASE` 和 `MICA_API_KEY`。Windows 上也可以将模型配置保存在 `%LOCALAPPDATA%/Mica Space/Codex/model.env`。画布的模型请求发往配置的 Chat Completions 服务。

Windows 默认将空间数据保存在 `%LOCALAPPDATA%/Mica Space/Codex/.chat-space`。设置 `MICA_WORKSPACE` 可以指定其他目录。可通过空间库的导入功能迁移 DSH 导出的数据，附件原文件需要重新提供。

## 验证

运行 `node --test tests/codex-sidebar.test.mjs` 检查 MCP 入口和画布资源。运行 `node tests/codex-e2e.mjs` 验证画布操作。浏览器测试需要 Playwright Chromium，或通过 `MICA_CHROMIUM` 指向现有的 Chromium 可执行文件。
