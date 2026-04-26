# 如何使用本站

本站把三份主面经拆成两类页面，对应两种复习方式：

1. **知识库**（`/knowledge/`）：按**技能模块**组织，不区分具体岗位。适合平时学习、建立知识地图。
2. **面试题库**（`/interviews/`）：按**岗位方向**聚合题目与面经原文，适合考前刷题、背回答结构。

## 内容维护方式

- 本站所有可发布内容统一在 `docs/` 目录内维护。
- 新增或修改页面后，按常规流程执行构建与预览即可（如 `npm run docs:build`）。

## 导航建议

- **数据分析 / 商业分析 / 数据科学**：先过 [知识库总览](/knowledge/) 里 SQL、统计、业务指标模块，再进 [面试题库](/interviews/) 按科目刷习题页。
- **AI Agent**：先读 [Agent 架构](/knowledge/05-ai-ml/ai-agent/agent-architecture) 与 [RAG](/knowledge/05-ai-ml/ai-agent/rag)，再打开 [面试题合集](/interviews/02-ai-agent/questions) 按章节背诵。
- **量化**：先看 [岗位与工具速览](/knowledge/06-quant-finance/quant-basics/internship-context)，再按 [因子 / 回测](/knowledge/06-quant-finance/quant-strategy/factors-and-strategy) 学习，面试前刷 [简历面](/interviews/03-quant-finance/resume-and-hr) 与 [知识面](/interviews/03-quant-finance/knowledge-questions)。

## GitHub Pages 的 `base` 路径

若网站地址为 `https://<user>.github.io/<repo>/`，请把 [`docs/.vitepress/config.ts` 中的 `base`](https://vitepress.dev/zh/guide/deploy) 设为 `'/<repo>/'`（注意首尾斜杠），否则静态资源会 404。
