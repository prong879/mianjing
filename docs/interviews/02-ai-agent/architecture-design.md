---
title: "Agent 架构设计题"
outline: deep
---

# Agent 架构设计题

## 一、Agent 基础概念与架构认知

### 概念与架构

- **1 分钟自我介绍。面试官重点听你掌握的技术、与 Agent 开发相关的基础。**

> **参考回答**：我是 [姓名]，具有 [专业/背景]，过去主要参与了 [具体项目，例如基于大模型的智能问答、多智能体协同系统]。在技术栈上，熟练掌握 Python，熟悉 LangChain / LangGraph 等 Agent 开发框架，并在实际业务中落地过 RAG 系统和 Tool Calling 机制。我的优势在于能够将业务需求抽象为 Agent 工作流，处理过上下文截断、大模型幻觉以及并发调用等工程问题。

- **你理解的 Agent 开发，核心要做哪些工作？**

> **参考回答**：Agent 开发的核心是让大模型具备**自主规划、工具调用和记忆管理**的能力。主要工作包括：1) **Prompt 工程**与任务规划设计（如何让模型拆解任务）；2) **工具（Tools/MCP）的定义与接入**（让模型能查数据库、调 API）；3) **上下文与记忆管理**（短期记忆截断、长期记忆向量化存储）；4) **工作流编排**（多 Agent 路由、ReAct 循环、人工介入机制）；5) **系统工程与评测**（并发处理、容错重试、效果评估）。

- **用技术语言说明，Agent 的核心架构模块有哪些？每个模块的作用是什么？**

> **参考回答**：核心模块包括：
> 1. **Profile/Persona（人设）**：定义 Agent 的角色、目标和行为边界。
> 2. **Planning（规划模块）**：负责任务拆解（Task Decomposition）和自我反思（Reflection），例如通过 CoT 或 ReAct。
> 3. **Memory（记忆模块）**：分短期记忆（Context Window）和长期记忆（外部数据库/向量库），用于维持会话状态。
> 4. **Tools/Action（工具/执行模块）**：执行具体的外部动作，如 Web Search、Code Execution、API 调用等。

- **如果把普通问答项目升级成虚拟对话系统（Agent），架构上要改哪些东西？**

> **参考回答**：普通问答通常是单轮的 `User -> LLM -> Response` 或带检索的 RAG。升级为 Agent 需要增加：
> 1. **路由与意图识别**：不再是直接回答，而是先判断需要调什么工具。
> 2. **循环执行机制（Agent Loop）**：引入 `Thought -> Action -> Observation -> Thought` 闭环。
> 3. **工具执行层**：增加安全沙箱或 API 网关，执行 LLM 输出的指令并把结果返回给大模型。
> 4. **状态机/流程编排**：从单次请求升级为有状态的工作流（如用 LangGraph 管理状态）。

- **如何说明一个系统具备 Agent 特征，而不是普通 Chatbot？**

> **参考回答**：核心区别在于**环境感知能力**和**自主决策执行能力**。普通 Chatbot 是“被动响应、静态生成”，而 Agent 能够：1) 根据当前目标主动拆解子任务；2) 自主决定是否调用、调用哪些外部工具获取最新信息或执行操作；3) 根据工具返回的观察结果（Observation）动态调整后续计划。

- **ReAct 框架在 Agent 开发中的作用是什么？用伪代码简单表示 ReAct 的核心流程。**

> **参考回答**：ReAct (Reason + Act) 的作用是让模型在执行动作前先输出推理过程，从而提高决策准确性，并能根据反馈调整。伪代码：
> ```Python
> def react_loop(task):
>     context = f"Task: {task}"
>     while True:
>         thought = llm.generate(context + "\nThought:")
>         action, args = llm.parse_action(thought)
>         if action == "Finish":
>             return args
>         observation = execute_tool(action, args)
>         context += f"\nThought: {thought}\nAction: {action}({args})\nObservation: {observation}"
> ```

- **ReAct 和 Agent Loop 的区别是什么？ReAct 中 Thought、Action、Observation 分别对应工程实现里的哪些结构？**

> **参考回答**：ReAct 是一种特定的 Prompting 与推理范式，而 Agent Loop 是工程上的循环控制结构。在 ReAct 中：`Thought` 对应 LLM 的文本生成（通常通过正则或 JSON 提取）；`Action` 对应提取出的函数名和参数；`Observation` 对应外部工具执行后的返回结果，并追加到历史 Message 列表中。

- **ReAct 机制在生产环境里怎么设计？为什么不能只靠 Prompt 写几句 Thought/Action？**

> **参考回答**：在生产环境，单靠 Prompt 会导致输出格式不稳定、无限循环或幻觉调用。生产级设计需要：
> 1. **强类型约束**：使用 Function Calling / Structured Output 强制返回 JSON。
> 2. **最大步数限制（Max Steps）**：防止无限死循环。
> 3. **异常处理捕获**：如果工具报错，将 Error Message 作为 Observation 传回让 LLM 修正。
> 4. **降级机制**：超时或屡次失败时，直接熔断并转交人工（Human-in-the-loop）。
>
### 框架与前沿技术

- **开发 Agent 时，你会用哪些 Python 库？说说它们在 Agent 开发中的具体用途。**

> **参考回答**：
> - **大模型交互**：`openai`、`anthropic` 或开源的 `vllm` 客户端。
> - **编排与状态管理**：`langgraph`（图状态流转）、`langchain`（基础组件）、`autogen`（多智能体）。
> - **向量检索**：`chromadb`、`faiss-cpu`、`pymilvus`。
> - **数据与解析**：`pydantic`（数据验证和 Schema 定义）、`beautifulsoup4`（网页抓取）。

- **你了解 LangChain / LlamaIndex / LangGraph 吗？说说它们在 Agent 开发中的优势和使用场景。**

> **参考回答**：
> - **LangChain**：组件丰富，适合快速搭建原型，但封装过深，定制化较难。
> - **LlamaIndex**：在 RAG 数据接入、索引构建和文档解析上非常强大，适合以检索为核心的 Agent。
> - **LangGraph**：把 Agent 建模为状态机（图结构），支持循环（Cycles）、持久化状态和人工介入，适合复杂的生产级 Agent 开发。

- **多智能体框架你了解哪几个？LangGraph 和 LangChain 有什么区别？**

> **参考回答**：多智能体框架包括 AutoGen, CrewAI, LangGraph。LangChain 主要是链式（Chain）的线性组合（DAG），处理循环比较麻烦。LangGraph 是在 LangChain 基础上的扩展，将工作流定义为图（Graph），原生支持节点间的循环依赖（Cycles），非常适合实现复杂的 Agent Loop。

- **多智能体可以分为哪几种架构？层级 Agent 和递交 Agent 的使用场景有什么区别？**

> **参考回答**：
> - **架构类型**：包括集中式（Supervisor 管理子 Agent）、协作式（Agent 自由对话）和层级式（树状结构）。
> - **层级 Agent (Hierarchical)**：有一个主 Agent 拆解任务，分发给下方特定领域的子 Agent，最后汇总。适合明确可解耦的复杂任务。
> - **递交 Agent (Handoff / Network)**：Agent 之间互相转移控制权，类似客服转接。适合流程式的业务，比如从“接单 Agent”递交给“售后 Agent”。

- **了解 Harness 架构吗？它是做什么的？**

> **参考回答**：Harness 通常指在评测或复杂任务执行中的“测试台/支架”系统。在 Code Agent（如 SWE-agent）中，Harness 负责提供一个隔离的执行环境（Docker 沙箱），准备代码库、应用 Patch，并运行单元测试以验证 Agent 的修改是否正确，从而评估 Agent 的能力。
>
### 多智能体协同 (Multi-Agent)

- **详细介绍一下多智能体协同策略（如主 Agent、子 Agent、工具 Agent 的分工），它们是怎么互相配合流转的？**

> **参考回答**：常见的是 **Supervisor 模式**：
> 1. 用户输入到达 `Supervisor Agent`（主管）。
> 2. 主管解析意图，将任务分发给特定的 `Worker Agent`（如代码编写 Agent、数据查询 Agent）。
> 3. `Worker Agent` 可调用专门的 `Tool Node` 执行动作。
> 4. `Worker Agent` 完成后将结果返回给主管。主管评估结果，若满足目标则输出给用户，若不够则继续分发给下一个 Worker。

- **如果用户问题同时命中多个子 Agent，系统怎么处理？**

> **参考回答**：有两种处理方式：
> 1. **拆解并行**：主 Agent 将问题拆分为互不依赖的子任务，并行分发给多个子 Agent，最后由主 Agent 合并（Map-Reduce 模式）。
> 2. **串行传递**：主 Agent 判断逻辑顺序，先让 Agent A 处理前置部分，将其输出作为上下文再传给 Agent B。

- **多 Agent 之间如何分工？如果主 Agent 决定越过第二层直接调底层的子 Agent，上下文信息是怎么跨层传过去的？**

> **参考回答**：通过共享状态（Shared State）或消息板（Message Blackboard）。在 LangGraph 等框架中，所有 Agent 可以读写一个全局的 `State` 字典（包含 `messages` 列表）。主 Agent 调用底层 Agent 时，把相关的历史对话截取或摘要后附加到 `State` 中，底层 Agent 直接读取即可获取上下文。

- **多 Agent 协同时，如何避免职责重叠、重复调用工具或互相冲突？**

> **参考回答**：
> 1. **清晰的系统提示（System Prompt）**：为每个 Agent 设定严格的边界和专注领域。
> 2. **能力隔离**：不同的 Agent 只赋予特定的工具，避免工具滥用。
> 3. **全局防重机制**：在共享状态中记录“已调用的工具及参数”和“已获得的结论”，Agent 执行前先检查状态。
> 4. **引入 Reviewer Agent**：专门设置一个审核 Agent，检查输出是否存在冲突或重复工作。
