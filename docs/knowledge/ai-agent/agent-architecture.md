---
title: "Agent 架构与核心机制"
outline: deep
---

> 原文备份路径：`归档/AI Agent面经/AI Agent面经.md`（与站点并列，编辑时请直接改归档目录下源文件后重新运行 `npm run docs:split`）


### 六、Agent 架构与核心机制

Agent 的关键不只是调用模型，而是让系统具备“理解任务、规划步骤、调用工具、观察结果、继续决策”的闭环。

常见考点：

- Agent 基本循环：`Plan -> Act -> Observe -> Reflect`
- ReAct 思路：推理与行动交替进行
- Planner：任务拆解、步骤规划、子任务排序
- Executor：执行工具调用、代码运行、外部系统操作
- Memory：短期记忆、长期记忆、用户画像、任务状态
- Reflection：自我检查、错误修正、结果复盘
- Multi-Agent：多个 Agent 分工协作、角色划分、消息传递
- 状态机与工作流：把不稳定的自由推理约束成可控流程
- Human-in-the-loop：关键节点引入人工确认

常见追问：

- Agent 和普通 Chatbot 的区别是什么？
- ReAct 框架解决了什么问题？
- 为什么真实业务里不能让 Agent 完全自由行动？
- 多 Agent 一定比单 Agent 更好吗？

---
