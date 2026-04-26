# 面经知识库（VitePress）

在线知识库源码位于 `docs/`，这是一个基于 VitePress 构建的高内聚静态站点。

```bash
npm install
npm run docs:dev    # 本地预览 http://localhost:5173
npm run docs:build  # 生产构建
npm run docs:preview
```

### GitHub Pages 部署

1. 仓库 **Settings → Pages**：Source 选 **GitHub Actions**。
2. 推送至 `main` 或 `master` 分支后，由 `.github/workflows/deploy-docs.yml` 自动构建并发布。
3. 访问链接为 `https://<user>.github.io/<repo>/`。若仓库名变化，请将 `docs/.vitepress/config.ts` 中的 `base` 同步修改。

### 目录说明

| 路径 | 说明 |
|------|------|
| `docs/.vitepress/` | VitePress 配置文件（包括侧边栏导航） |
| `docs/public/images/` | **所有静态图片资源必须存放在此处** |
| `docs/guide/` | 使用说明、学习路线、考前冲刺 |
| `docs/knowledge/` | 遵循严格 **6大支柱** 的理论与知识页（如 `01-data-infrastructure/`） |
| `docs/interviews/` | 遵循严格 **4大岗位** 的面试题库（如 `01-data-analytics/`） |
| `.cursor/rules/` | Cursor AI 编辑、排版与 Git 提交规范（确保内容高内聚、低耦合） |
| `.cursor/skills/` | AI Agent 技能配置（用于自动化处理外部学习资料和零散面经） |


todo：把md注释式的标签，换为徽标 https://vitepress.dev/zh/reference/default-theme-badge