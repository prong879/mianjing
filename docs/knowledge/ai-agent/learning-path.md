---
title: "推荐学习路线"
outline: deep
---

> 原文备份路径：`归档/AI Agent面经/AI Agent面经.md`（与站点并列，编辑时请直接改归档目录下源文件后重新运行 `npm run docs:split`）


### 十三、推荐学习路线

可以按“先会开发，再会 LLM，再会 Agent，再会落地”的顺序学习，避免一开始就陷入复杂框架。

建议顺序：

1. 补齐 Python、Web API、数据库、Git 等工程基础。
2. 学会调用主流大模型 API，理解 Token、上下文、流式输出和结构化输出。
3. 学 Prompt Engineering，能写出稳定可复用的任务提示词。
4. 学 Tool Calling，做一个能调用查询、计算、搜索等工具的小 Agent。
5. 学 RAG，完成一个带文档上传、检索、引用来源的知识库问答系统。
6. 学 Agent 架构，理解规划、执行、观察、记忆和状态管理。
7. 学一个主流框架，例如 `LangGraph` 或 `LangChain`，重点理解编排思想。
8. 加入评估、日志、权限、安全和成本控制，把 Demo 做成可交付应用。

建议项目：

- 个人知识库问答 Agent
- 简历 / 面经整理 Agent
- 数据分析 SQL Agent
- 网页搜索与报告生成 Agent
- 自动读取文件并生成摘要的办公 Agent
- 带人工确认的业务流程 Agent

---
