# Contributing

## Layout

- `client.js` — DSH client plugin: React canvas, library, composer, memory/retrieval.
- `index.js` — DSH host routes: persistence, upload, trash, import/export, backup restore.
- `tests/` — node:test suites plus a React UI smoke test.

## Run tests

```bash
npm install
npm test
```

The UI smoke test uses React and `react-test-renderer` from devDependencies.

## Rules

- Keep data writes atomic and preserve `.bak`.
- Do not put API keys in `client.js`, `index.js`, tests, or docs.
- Keep memory bounded; do not add an unbounded index.
- Add a regression test for bug fixes.
- Do not silently delete raw turns or attachments.
