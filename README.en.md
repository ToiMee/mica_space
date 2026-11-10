# Mica Space

[中文](README.md)

**Current demo:** `0.99.14` · [Download / Release](https://github.com/ToiMee/mica_space/releases/latest)

Mica Space is a zoomable, branching conversation map for **DSH (DeepSeek Harness)**. Instead of scrolling through one long chat, each follow-up grows from the answer it belongs to: the main line keeps its context, and every branch stays independently explorable.

## Why

In a long conversation, follow-ups pile up under a single answer. To return to an earlier point, you have to scroll up and hunt for it. Mica makes that follow-up a branch on a canvas:

- main line = the complete thread;
- branches = focused follow-up conversations;
- local memory lets the main line call back conclusions from a branch later.

## Features

- Multiple spaces, folders, and nested folders;
- Vertical and horizontal canvas layouts;
- Main line, branches, and sub-branches;
- Select text in an answer and start a follow-up branch from it;
- Fold/unfold branches with stacked cards and aggregated pending markers;
- Dot overview mode for large canvases;
- Zoom, pan, drag, resize, and marquee selection;
- Card colors, tags, todo flags, unread markers, and edge reminders;
- Local memory: main summary + branch summaries + parent/child retrieval;
- Local zero-config lexical / co-occurrence semantic retrieval;
- Image and file attachments;
- Local OCR for image attachments and scanned PDFs (Chinese + English, first 8 pages);
- Trash with folder-level restore;
- Import/export the whole library, Git backup, recovery;
- Mica-owned attachment storage with migration of older DSH attachments;
- First-run guide with editable Chinese/English copy and a built-in demo space;
- Source chips under answers, linking back to the main/branch turn used as context;
- Demo space with main line, branch, pending marker, and source chips;
- Interaction guide covering click, double-click, right-click, drag, marquee, zoom, collapse, and point mode.
- Backup/restore UI clearly states that attachment files are not included.

## Install (bundled Demo)

On the GitHub Releases page, download:

```text
mica-space-0.99.11-demo.zip
```

Then:

1. Extract the whole zip to a fixed directory.
2. Open DSH → Plugins.
3. Choose “install from local folder”.
4. Select the directory containing `package.json`, `index.js`, and `client.js`.
5. Fully quit DSH and reopen it.

The bundled zip includes runtime dependencies and OCR language data. **You do not need to run `npm install`.**

The current bundled installer targets **Windows x64**.

## Install from source

```bash
npm install
```

Then install this directory as a DSH plugin and restart DSH.

## Memory modes

Switch modes from the “Memory” menu on the canvas:

### Lightweight (default)

- Keywords;
- character n-gram hashed vectors;
- zero configuration, fastest.

### Local semantic

- Builds distributional vectors from term co-occurrence inside the current space;
- no external API or embedding model;
- not a general neural semantic model.

## Data

Data lives in the active workspace:

```text
.chat-space/
  library.json
  spaces/
  attachments/
  trash/
```

Each space is stored independently and contains its main line, branches, view state, and memory.

Attachment files are not included in exported JSON or Git backups.

## Privacy

- Lightweight/local semantic retrieval does not access the network;
- When you ask, the question, context, attachments, and extracted text are sent to the model provider configured in DSH;
- OCR runs locally with Tesseract; images/PDFs are not sent to an OCR service;
- Git backup only pushes when you configure a remote and click backup;
- The plugin contains no telemetry and no author API key.

## Agent mode

**Mica Space 0.99 does not include Agent mode.**

The current conversation path is a normal model call with a system prompt, context, attachments, memory, and retrieval. It does not run tool loops, edit files, execute commands, or call MCP.

Agent integration is planned as a v1.0 exploration: optional per-space/per-branch agent sessions, tool calls with permission prompts, and clear rules for branch/session state.

## Known limits

- The bundled E2E suite uses a mocked Host API; it is browser-real but not a full DSH backend test;
- Large canvases use viewport culling, not full node virtualization;
- OCR processes at most 8 pages and depends on scan quality;
- Older attachments migrate when their space is first opened; original DSH files are kept;
- The bundled Demo targets Windows x64;
- This is a preview: back up `.chat-space` before upgrading.

## Tests

```bash
npm test
npm run test:e2e
```

`npm run test:e2e` uses Playwright + Chromium against the plugin UI with a mocked Host API. Set `MICA_CHROMIUM` if Chromium is not in the default path.

## License

MIT

## Links

- Repository: https://github.com/ToiMee/mica_space
- Latest release: https://github.com/ToiMee/mica_space/releases/latest
