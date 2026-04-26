---
title: "Agent 框架与开发生态"
outline: deep
---

> 维护说明：请直接在 docs/ 目录维护本页内容。


### 七、Agent 框架与开发生态

面试里经常会问是否用过相关框架。重点不是背所有框架 API，而是能讲清楚框架解决了什么问题、适合什么场景。

常见考点：

- `LangChain`：链式调用、工具、记忆、RAG 组件
- `LangGraph`：基于图和状态机编排 Agent 流程
- `LlamaIndex`：知识库、索引、检索增强生成
- `AutoGen`：多 Agent 对话与协作
- `CrewAI`：角色式多 Agent 任务协作
- `Dify`、`Coze`、`FastGPT`：低代码 Agent / 工作流平台
- OpenAI / Anthropic / Gemini / DeepSeek / Qwen 等模型 API
- 本地模型部署：`Ollama`、`vLLM`、`llama.cpp`
- MCP：把外部工具、数据源和 Agent 统一连接的一种协议思路

常见追问：

- LangChain 和 LlamaIndex 的侧重点有什么不同？
- 为什么复杂 Agent 更适合用状态图或工作流编排？
- 低代码 Agent 平台和代码开发 Agent 各有什么优势？
- MCP 想解决什么问题？

---
