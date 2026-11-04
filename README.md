# Mica Space / Mica空间

Mica Space 是 DSH 的可缩放对话地图插件：一条纵向主线，多条从回答分叉的支线，每个空间是一张独立画布。

## 功能

- 多空间、文件夹、子文件夹；
- 主线 / 支线 / 子支线树；
- 引用选中文字后继续追问；
- 图片和文件附件；
- 回收站、撤销、搜索、整库导入导出；
- 卡片折叠、颜色、标签、待追问和红旗；
- 待追问卡片离开视口时的边缘 `!` 提醒；
- 横竖布局切换；
- 本地记忆：主线摘要 + 分支摘要 + 父子级检索；
- 长回答自动分 chunk，命中子片段时回带父 turn；
- 零配置的轻量哈希向量，以及可选的本地共现语义模式；
- Git 备份（本地提交 + 可选私有 remote push）。

## 安装

1. 在 DSH 插件管理中安装本目录对应的插件包；
2. 确认侧边栏出现“Mica空间”；
3. 在 DSH 里配置一个聊天模型；
4. 新建空间，从第一个问题开始。

不需要用户另外安装：

- 向量数据库；
- embedding 模型；
- Python；
- embedding API。

## 两种记忆模式

在画布顶部点“记忆”切换：

### 轻量（默认）

- 关键词；
- 字符 n-gram 哈希向量；
- 零配置，速度最快。

### 本地语义增强

- 在当前空间的词语共现上构建分布语义向量；
- 零配置，不需要外部 API；
- 不是通用神经语义模型，不能理解任意同义改写；
- 每个空间独立构建，不共享其他用户数据。

## 数据位置

默认工作区的：

```text
.chat-space/library.json
.chat-space/spaces/<id>.json
.chat-space/trash/
```

每个空间独立保存，包含主线、分支、视图、memory。

## 隐私

- 轻量/本地语义模式不访问网络；
- 正常聊天时，问题、上下文和附件会发送给用户配置的 DSH 模型提供商；
- 文件抽取后的文本也会进入聊天上下文；
- Git 备份只有用户主动配置 remote 并点击备份时才 push；
- 插件本身不包含遥测，不包含作者 API key。

## 已知限制

- 当前不是神经语义 RAG；
- PDF 仅抽取文本流，扫描版需要 OCR；
- 附件文件由 DSH attachment 服务管理，插件没有删除底层附件的能力；
- 大空间尚未做完整虚拟化；
- 自动化测试覆盖上下文、空间库、embedding 和语义排序，尚未覆盖全部 UI/E2E；
- 当前版本为预览版，升级前请保留 `.chat-space` 备份。

## Live E2E

`npm run e2e:live` 会启动本机 Chrome 访问 `MICA_URL`。DSH Web 如果要求认证 URL，脚本会 SKIP；请把 `dsh web` 打印的带认证 URL 设到 `MICA_URL`。

## 平板/Web

Mica 运行在 DSH Web GUI 中，平板浏览器只要能打开 DSH Web 就能使用。窄屏下空间库变为上下布局、画布工具栏自动换行、输入框和弹窗适配屏幕宽度。

## 测试

```bash
node --test tests/context.test.mjs tests/library.test.mjs tests/embedding.test.mjs tests/semantic.test.mjs tests/parent-child.test.mjs tests/rag-eval.test.mjs tests/performance.test.mjs tests/ui-smoke.test.cjs
```

## 项目主页

https://github.com/ToiMee

## 版本

`0.10.0` — 预览版，零配置本地记忆 + 父子级轻量检索 + 主线 callback + 设置/备份恢复 + 响应式平板/Web 布局。
