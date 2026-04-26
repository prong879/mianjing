---
layout: home

hero:
  name: 面经知识库
  text: 技术栈学习 + 岗位刷题
  tagline: 数据分析 · 商业分析 · 数据科学 · AI Agent · 量化
  actions:
    - theme: brand
      text: 进入知识库
      link: /knowledge/
    - theme: alt
      text: 面试题库
      link: /interviews/
    - theme: alt
      text: 考前冲刺
      link: /guide/exam-cram

features:
  - title: 按技术栈学
    details: SQL、Python、统计与实验、BI、业务指标体系、Agent、量化等模块并集整理，适合平时系统补齐。
  - title: 按岗位背
    details: 数据分析/商分/数科习题、AI Agent 面经问答、量化简历面与知识面分区，适合考前集中刷。
  - title: 可搜索、可部署
    details: VitePress 本地全文搜索；推送到 GitHub 后可用 Actions 发布 GitHub Pages 在线浏览。
---

## 快速入口

| 目标 | 链接 |
|------|------|
| 使用说明与目录逻辑 | [如何使用本站](/guide/how-to-use) |
| 长期学习顺序 | [学习路线总览](/guide/roadmap) |
| 7 天 / 3 天 / 面前 1 小时 | [考前冲刺](/guide/exam-cram) |

源 Markdown 位于仓库 `归档/` 目录；站点正文由 `npm run docs:split` 从源文件生成，改原文后请重新运行该命令再构建。
