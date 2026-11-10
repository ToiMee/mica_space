# Mica Space 0.99.9 Demo — 安装说明

这个压缩包已经包含运行依赖，不需要再执行 `npm install`。

## 安装

1. 把压缩包完整解压到一个固定目录，例如：

   ```text
   D:\MicaSpace\mica-space-0.99.9
   ```

2. 打开 DSH。
3. 进入 **插件管理 / Plugins**。
4. 选择 **从本地安装 / 从文件夹安装**。
5. 选中解压后的目录，也就是包含 `package.json`、`index.js`、`client.js` 的那一层。
6. 安装后完整退出 DSH，再重新打开。
7. 侧边栏出现 **Mica空间 / Mica Space**。

## 注意

- 不要只复制 `index.js` 或 `client.js`，必须整个目录一起安装。
- 不要把这个目录放进 `.chat-space` 数据目录。
- 第一次使用会显示欢迎页和 Demo 说明。
- OCR 依赖和中文/英文语言包已经包含在 `node_modules` 里。
- 当前安装包面向 Windows x64（`@napi-rs/canvas` 原生二进制）。

## 数据位置

数据默认在当前工作区的：

```text
.chat-space/
  library.json
  spaces/
  attachments/
  trash/
```

升级前建议先导出空间库或备份整个 `.chat-space`。

## 当前版本说明

这是 `v0.99 Demo`：

- 包含分支对话地图、文件夹、回收站、本地记忆、备份恢复、OCR 和附件；
- 不包含 Agent 模式，Agent 计划在 v1.0 尝试；
- OCR 只处理扫描/图片型 PDF 的前 8 页。
