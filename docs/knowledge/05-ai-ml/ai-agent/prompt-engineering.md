---
title: "Prompt Engineering 与上下文设计"
outline: deep
---

> 维护说明：请直接在 docs/ 目录维护本页内容。


### 三、Prompt Engineering 与上下文设计

Prompt 不是简单写一句指令，而是把任务目标、角色、约束、上下文、输出格式和失败处理都组织清楚。

常见考点：

- Prompt 基本结构：角色、任务、背景、约束、步骤、输出格式
- Few-shot 示例：通过样例稳定模型输出
- Chain of Thought 与分步推理：让模型先分析再回答
- 系统提示词与用户提示词的职责划分
- 输出格式控制：Markdown、JSON、表格、代码块
- 提示词注入风险：用户输入覆盖系统规则、恶意指令绕过
- Prompt 版本管理：不同场景下的提示词迭代、A/B 测试

常见追问：

- 一个好的 Prompt 一般包含哪些部分？
- 为什么同一个 Prompt 有时输出不稳定？
- 如何处理用户输入中包含“忽略以上规则”这类攻击？
- Prompt Engineering 和传统规则工程有什么区别？

---
