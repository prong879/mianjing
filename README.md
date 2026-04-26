# 面经知识库（VitePress）

在线知识库源码位于 `docs/`，从 `归档/` 目录下的 Markdown **自动生成**正文页面。

```bash
npm install
npm run docs:split   # 从 归档/ 拆分写入 docs/knowledge、docs/interviews
npm run docs:dev    # 本地预览 http://localhost:5173
npm run docs:build  # 生产构建
npm run docs:preview
```

### GitHub Pages

1. 仓库 **Settings → Pages**：Source 选 **GitHub Actions**。
2. 若站点地址为 `https://<user>.github.io/<repo>/`，请将 [`docs/.vitepress/config.ts`](docs/.vitepress/config.ts) 中的 `base` 改为 `'/<repo>/'`。
3. 推送至 `main` 或 `master` 分支后，由 [`.github/workflows/deploy-docs.yml`](.github/workflows/deploy-docs.yml) 自动构建并发布。

### 目录说明

| 路径 | 说明 |
|------|------|
| `归档/` | 原始面经 Markdown（手工维护） |
| `docs/.vitepress/` | VitePress 配置 |
| `docs/guide/` | 使用说明、学习路线、考前冲刺 |
| `docs/knowledge/` | 按技术栈拆分的知识页（`npm run docs:split` 生成） |
| `docs/interviews/` | 按岗位拆分的面试题页（同上） |
| `scripts/split-interview-notes.mjs` | 拆分脚本 |
