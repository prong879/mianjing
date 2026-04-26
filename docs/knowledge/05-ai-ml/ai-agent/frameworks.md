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

## OpenClaw 是什么？为什么它这么火？

---

### 本课目标

学完这一课，你将能够：
- 清楚地说出 OpenClaw 的定位和核心价值
- 理解 OpenClaw 为什么能获得 33 万+ Star
- 说出 OpenClaw 的五大核心组件及其作用
- 对比 OpenClaw 与其他 AI 工具的区别
- 在面试中展示你对 OpenClaw 的深度理解

---

### 一、OpenClaw 的定位：不只是聊天机器人

#### 1.1 一句话定义

**OpenClaw 是一个开源的个人 AI 助手平台，让你可以用自然语言控制一切——聊天、搜索、写代码、操作文件、管理日程、发消息……全部通过一个统一的 Agent 来完成。**

#### 1.2 "大脑+小脑+手" vs "只有大脑"

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│        ChatGPT / Claude                    OpenClaw          │
│       （只有大脑）                       （大脑+小脑+手）       │
│                                                              │
│    ┌────────────────┐              ┌────────────────┐        │
│    │     🧠 大脑     │              │     🧠 大脑     │        │
│    │   （LLM 能力）  │              │   （LLM 能力）  │        │
│    │                │              │   理解+推理+决策 │        │
│    │   能聊天       │              ├────────────────┤        │
│    │   能回答问题    │              │     🧩 小脑     │        │
│    │   能写东西     │              │  （Agent 框架）  │        │
│    │                │              │   规划+调度+记忆 │        │
│    │   但是...      │              ├────────────────┤        │
│    │   不能上网     │              │     🤲 双手     │        │
│    │   不能操作电脑  │              │   （Tools/Skills）│       │
│    │   不能发消息    │              │   搜索+文件+API │        │
│    │   不能存东西    │              │   消息+代码+一切 │        │
│    └────────────────┘              ├────────────────┤        │
│                                    │     📡 接口     │        │
│    你说什么                         │  （多渠道接入）  │        │
│    它答什么                         │  WhatsApp/飞书  │        │
│    到此结束                         │  Telegram/Slack │        │
│                                    └────────────────┘        │
│                                                              │
│                                    收到指令 → 思考 →          │
│                                    行动 → 反馈 → 记住         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

打个比方：
- **ChatGPT** 像一个坐在柜台后面的**客服**——你问什么它答什么，但它不能离开柜台帮你做事。
- **OpenClaw** 像一个**私人管家**——他不仅能听懂你说的话，还能帮你跑腿、打电话、写信、整理房间，而且记得你所有的偏好。

---

### 二、关键数据：为什么说它是"现象级"项目？

#### 2.1 增长速度

```
┌──────────────────────────────────────────────────────────────┐
│                  GitHub Star 增长对比                          │
│                                                              │
│  Star数                                                      │
│  (万)                                          ★ OpenClaw    │
│  35 ┤                                        ╱  33万+        │
│  30 ┤                                      ╱                 │
│  25 ┤                                    ╱                   │
│  20 ┤                    ──────────── React  22.9万           │
│  15 ┤                  ╱                                     │
│  10 ┤                ╱   ──────────── Linux  19.5万           │
│   5 ┤              ╱                                         │
│   0 ┤────────────╱─────────────────────────────── 时间        │
│     项目        84天达到                                      │
│     发布        20万Star!                                     │
│                                                              │
│  对比：React 用了 11 年，Linux 用了 33 年                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 2.2 核心数据一览

| 指标 | 数据 | 说明 |
|------|------|------|
| GitHub Star | 33 万+ | 全球增速最快的开源项目之一 |
| 84 天里程碑 | 20 万 Star | 比 React、Linux 都快 |
| 贡献者 | 2000+ | 全球开发者参与 |
| 支持渠道 | 10+ | WhatsApp/Telegram/Slack/Discord/飞书等 |
| 支持 LLM | 20+ | 几乎所有主流模型 |
| 插件生态 | 500+ Skills | 社区贡献的技能包 |

#### 2.3 黄仁勋的评价

NVIDIA CEO 黄仁勋在 2025 年的 GTC 大会上提到：

> "OpenClaw 就像 AI 界的 Windows——它让每个人都能拥有自己的 AI 助手，就像 Windows 让每个人都能使用个人电脑一样。"

这个类比非常到位：
- **Windows 之前**：用电脑需要懂命令行，门槛极高
- **Windows 之后**：点点鼠标就能用，人人都能用电脑
- **OpenClaw 之前**：用 AI Agent 需要会编程，要配各种框架
- **OpenClaw 之后**：一条命令安装，自然语言交互，人人都能有 AI 助手

---

### 三、OpenClaw 的核心能力

#### 3.1 多渠道接入

OpenClaw 不只是一个命令行工具，它可以通过**多种渠道**和你交互：

```
┌──────────────────────────────────────────────────────┐
│                OpenClaw 多渠道架构                     │
│                                                      │
│  ┌──────────┐                                        │
│  │ WhatsApp │──┐                                     │
│  └──────────┘  │                                     │
│  ┌──────────┐  │     ┌──────────────────┐            │
│  │ Telegram │──┤     │                  │            │
│  └──────────┘  │     │    OpenClaw      │            │
│  ┌──────────┐  ├────>│    Gateway       │            │
│  │  Slack   │──┤     │    (统一网关)     │            │
│  └──────────┘  │     │                  │            │
│  ┌──────────┐  │     └────────┬─────────┘            │
│  │ Discord  │──┤              │                      │
│  └──────────┘  │              ▼                      │
│  ┌──────────┐  │     ┌──────────────────┐            │
│  │   飞书    │──┤     │   Agent Runner   │            │
│  └──────────┘  │     │   (执行引擎)      │            │
│  ┌──────────┐  │     └──────────────────┘            │
│  │   CLI    │──┤                                     │
│  └──────────┘  │                                     │
│  ┌──────────┐  │                                     │
│  │ Web UI   │──┘                                     │
│  └──────────┘                                        │
│                                                      │
│  一个 Agent，N 个入口，无缝切换                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 3.2 语音能力

OpenClaw 内置了语音识别和语音合成能力：
- **语音输入**：说话就能下指令
- **语音输出**：Agent 的回复可以用语音播放
- 支持多种语言和口音

#### 3.3 Canvas 可视化

OpenClaw 的 Canvas 功能让你可以：
- 在可视化画布上与 AI 协作
- 拖拽式构建工作流
- 实时预览 Agent 的执行过程

---

### 四、OpenClaw 的五大核心组件

```
┌──────────────────────────────────────────────────────────────┐
│                  OpenClaw 五大核心组件                         │
│                                                              │
│                   ┌──────────────────┐                       │
│                   │   Control UI     │                       │
│                   │   (控制面板)      │                       │
│                   │   管理和监控一切   │                       │
│                   └────────┬─────────┘                       │
│                            │                                 │
│  ┌──────────────┐  ┌──────▼──────────┐  ┌──────────────┐    │
│  │   Gateway    │  │     Nodes       │  │   Skills     │    │
│  │   (网关)     │──│    (节点引擎)    │──│   (技能)     │    │
│  │  消息收发     │  │  Agent 编排执行  │  │  能力扩展     │    │
│  └──────────────┘  └──────┬──────────┘  └──────────────┘    │
│                           │                                  │
│                   ┌───────▼──────────┐                       │
│                   │     Memory       │                       │
│                   │     (记忆)       │                       │
│                   │   上下文+长期存储  │                       │
│                   └──────────────────┘                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 4.1 Gateway（网关）

**比喻：酒店前台**

Gateway 是 OpenClaw 的"前台"，负责接收来自各个渠道的消息，统一格式后转发给内部处理。

| 职责 | 说明 |
|------|------|
| 接收消息 | 从 WhatsApp、Telegram、Slack、CLI 等渠道接收用户消息 |
| 协议转换 | 把不同格式的消息统一成 OpenClaw 内部格式 |
| 身份验证 | 验证用户身份和权限 |
| 消息路由 | 把消息分发到正确的 Agent 节点 |
| 回复推送 | 把 Agent 的回复推回对应渠道 |

#### 4.2 Control UI（控制面板）

**比喻：汽车的仪表盘**

Control UI 是 OpenClaw 的 Web 管理界面（Dashboard），让你可以：
- 查看所有对话历史
- 管理 Agent 配置
- 安装和管理 Skills
- 监控 Agent 运行状态
- 设置 LLM Provider 和 API Key

#### 4.3 Nodes（节点引擎）

**比喻：工厂的流水线**

Nodes 是 Agent 的编排执行引擎，负责：
- 接收 Gateway 转发的消息
- 运行 ReAct 循环
- 调度 LLM 和工具
- 管理对话上下文
- 编排多步骤任务

#### 4.4 Skills（技能）

**比喻：手机上的 App**

Skills 是 OpenClaw 的插件系统，每个 Skill 就是 Agent 的一项能力：

```
┌──────────────────────────────────────────────────────┐
│                  Skills 示例                          │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │ Web Search │  │ File Ops   │  │   Gmail    │     │
│  │ 网页搜索    │  │ 文件操作    │  │ 邮件收发    │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │  Calendar  │  │   GitHub   │  │  Database  │     │
│  │  日程管理   │  │ 代码管理    │  │ 数据库操作  │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │  Browser   │  │   Notion   │  │   Slack    │     │
│  │  浏览器操作  │  │ 笔记管理    │  │ 消息推送   │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│                                                      │
│  社区已有 500+ Skills，还在持续增长                     │
│  你也可以自己开发 Skill！                              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 4.5 Memory（记忆）

**比喻：笔记本+档案柜**

Memory 管理 Agent 的所有记忆：

```
┌──────────────────────────────────────────────────────┐
│                   Memory 架构                         │
│                                                      │
│  ┌──────────────────────────────────────────┐        │
│  │          短期记忆 (Short-term)            │        │
│  │   当前对话的上下文                         │        │
│  │   存在 Context Window 里                  │        │
│  │   对话结束后自动清理                       │        │
│  └──────────────────────────────────────────┘        │
│                       │                              │
│                       ▼                              │
│  ┌──────────────────────────────────────────┐        │
│  │          长期记忆 (Long-term)             │        │
│  │   用户偏好："我喜欢简洁的回复风格"          │        │
│  │   历史事实："用户的公司是 XXX"              │        │
│  │   任务记录："上次帮用户订了去上海的机票"     │        │
│  │   存在向量数据库中，按需检索                │        │
│  └──────────────────────────────────────────┘        │
│                                                      │
│  效果：OpenClaw 能记住你的习惯和偏好，越用越懂你       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

> **面试考点：** OpenClaw 的五大核心组件分别是什么？各自的作用？
> 答：(1) **Gateway**（网关）——统一接收和分发各渠道消息；(2) **Control UI**（控制面板）——Web 管理界面，配置和监控；(3) **Nodes**（节点引擎）——Agent 的核心执行引擎，运行 ReAct 循环；(4) **Skills**（技能）——插件系统，扩展 Agent 能力；(5) **Memory**（记忆）——管理短期和长期记忆，让 Agent 越用越懂你。

---

### 五、OpenClaw vs 其他 AI 工具对比

#### 5.1 综合对比表

| 特性 | OpenClaw | ChatGPT | Langchain | AutoGPT | Coze |
|------|---------|---------|-----------|---------|------|
| **类型** | Agent 平台 | 聊天机器人 | 开发框架 | 自主 Agent | 低代码平台 |
| **开源** | 是 | 否 | 是 | 是 | 否 |
| **多渠道** | 10+ 渠道 | Web/App | 需自己实现 | 无 | 有限 |
| **工具调用** | 500+ Skills | 有限插件 | 需编码 | 有限 | 拖拽配置 |
| **记忆系统** | 短期+长期 | 仅对话内 | 需编码 | 基础 | 基础 |
| **部署方式** | 自托管/云 | 仅云 | 自托管 | 自托管 | 仅云 |
| **上手难度** | 低（CLI） | 极低 | 高（编程） | 中 | 低 |
| **可定制性** | 极高 | 低 | 极高 | 中 | 中 |
| **数据隐私** | 完全可控 | 数据在OpenAI | 可控 | 可控 | 数据在字节 |
| **社区活跃度** | 极高(33万Star) | 不开源 | 高(10万Star) | 中(16万Star) | 不开源 |

#### 5.2 什么场景该选 OpenClaw？

```
┌──────────────────────────────────────────────────────────────┐
│                    选型决策树                                  │
│                                                              │
│  你的需求是什么？                                              │
│       │                                                      │
│       ├── 只想聊天？ → ChatGPT / Claude                      │
│       │                                                      │
│       ├── 想开发 Agent 应用？                                 │
│       │    ├── 需要高度自定义？ → LangChain / LangGraph       │
│       │    └── 想快速部署？ → OpenClaw                        │
│       │                                                      │
│       ├── 想要个人 AI 助手？                                   │
│       │    ├── 在意数据隐私？ → OpenClaw（自托管）              │
│       │    └── 图方便？ → Coze / GPTs                         │
│       │                                                      │
│       └── 企业级多渠道 Agent？ → OpenClaw                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 六、为什么面试官爱问 OpenClaw？

#### 6.1 考察维度

面试官问 OpenClaw，其实是在考察你的**多个能力维度**：

```
┌──────────────────────────────────────────────────────┐
│              面试官问 OpenClaw 的真实意图               │
│                                                      │
│  ┌────────────────────────────────────────────┐      │
│  │ 表面问题: "你了解 OpenClaw 吗？"             │      │
│  └────────────────────────────────────────────┘      │
│                    │                                 │
│                    ▼                                 │
│  ┌────────────────────────────────────────────┐      │
│  │ 实际考察:                                   │      │
│  │                                            │      │
│  │ 1. 技术敏感度                               │      │
│  │    → 你关注行业动态吗？                      │      │
│  │                                            │      │
│  │ 2. Agent 理解深度                           │      │
│  │    → 你懂 Agent 架构吗？                     │      │
│  │                                            │      │
│  │ 3. 系统设计能力                              │      │
│  │    → 你能分析它的架构吗？                    │      │
│  │                                            │      │
│  │ 4. 动手能力                                 │      │
│  │    → 你自己搭建过吗？                        │      │
│  │                                            │      │
│  │ 5. 开源社区参与                              │      │
│  │    → 你有贡献开源的意识吗？                   │      │
│  └────────────────────────────────────────────┘      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 6.2 常见面试问题

1. **"OpenClaw 和直接用 ChatGPT API 有什么区别？"**
   - OpenClaw 在 LLM 之上提供了完整的 Agent 框架：工具调用、多渠道、记忆、编排
   - ChatGPT API 只是一个"大脑"，你得自己搭建其他部分

2. **"OpenClaw 是怎么支持多渠道的？"**
   - 通过 Gateway 组件统一协议，每个渠道有独立的适配器
   - 所有渠道最终转换为统一的内部消息格式

3. **"如果让你为公司选型，为什么选 OpenClaw？"**
   - 开源：可审计代码，不担心供应商锁定
   - 自托管：数据完全可控，满足合规要求
   - 多渠道：一套配置覆盖所有沟通渠道
   - 生态：500+ Skills，社区活跃

> **面试考点：** OpenClaw 相比其他 Agent 框架的核心优势是什么？
> 答：三个核心优势——(1) **开箱即用**：一条命令安装，自带多渠道支持、UI 和记忆系统，不需要从零搭建；(2) **生态丰富**：500+ Skills 插件，社区 2000+ 贡献者，快速迭代；(3) **数据可控**：完全开源可自托管，企业可以在自己的基础设施上运行，数据不出内网。

---

### 七、本课要点回顾

```
┌──────────────────────────────────────────────────────┐
│                    知识点总结                          │
│                                                      │
│  1. OpenClaw = 开源个人 AI 助手平台                    │
│     不只是聊天机器人，是"大脑+小脑+手"                  │
│                                                      │
│  2. 关键数据                                          │
│     33万+ Star，84天20万Star                          │
│     黄仁勋称之为"AI界的Windows"                        │
│                                                      │
│  3. 核心能力                                          │
│     多渠道接入、语音、Canvas 可视化                      │
│                                                      │
│  4. 五大组件                                          │
│     Gateway / Control UI / Nodes / Skills / Memory   │
│                                                      │
│  5. 核心优势                                          │
│     开箱即用 + 生态丰富 + 数据可控                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 八、课后练习

#### 练习 1：概念理解（选择题）

OpenClaw 的 Gateway 组件主要负责什么？

A. 运行 LLM 推理
B. 存储用户的长期记忆
C. 接收和分发各渠道消息，统一协议格式
D. 管理 Skills 插件

<details>
<summary>点击查看答案</summary>

**答案：C**

解析：Gateway 是 OpenClaw 的"前台"，负责接收来自 WhatsApp、Telegram、Slack、CLI 等不同渠道的消息，将它们转换为统一的内部格式，然后分发到对应的 Agent 节点。A 是 Nodes 的职责，B 是 Memory 的职责，D 也属于 Nodes/Control UI 的管理范畴。

</details>

#### 练习 2：对比分析（简答题）

你的老板问你："我们现在用 ChatGPT Plus，有必要换成 OpenClaw 吗？"请列出 3 个说服老板的理由和 2 个可能的顾虑。

<details>
<summary>点击查看参考答案</summary>

**3 个说服理由：**

1. **数据隐私**：ChatGPT Plus 的数据全部经过 OpenAI 服务器，对于有保密要求的企业存在合规风险。OpenClaw 可以自托管，数据完全在自己的服务器上。

2. **多渠道集成**：ChatGPT Plus 只能在 Web/App 上使用。OpenClaw 可以接入飞书、Slack、企业微信等内部沟通工具，员工无需切换软件。

3. **可定制性**：ChatGPT Plus 的能力是固定的。OpenClaw 可以通过 Skills 扩展任意能力，比如接入内部数据库、CRM、工单系统等，打造真正的企业专属助手。

**2 个可能的顾虑：**

1. **运维成本**：自托管需要服务器和运维人员，有一定的基础设施成本。
2. **上手门槛**：虽然比 LangChain 简单，但相比直接用 ChatGPT Plus 仍需要一定的配置和学习成本。

</details>

#### 练习 3：面试模拟（开放题）

面试官问："请用 2 分钟介绍一下 OpenClaw 这个项目，以及你为什么关注它？"

<details>
<summary>点击查看参考答案</summary>

**参考答案要点：**

"OpenClaw 是 2025 年最火的开源 AI Agent 项目，GitHub 上获得了 33 万+ Star，84 天就突破了 20 万 Star，增速超过了 React 和 Linux。黄仁勋在 GTC 大会上称它为'AI 界的 Windows'。

它的定位是开源个人 AI 助手平台，和 ChatGPT 最大的区别在于——ChatGPT 只是一个聊天机器人，而 OpenClaw 是一个完整的 Agent 平台。它有五大核心组件：Gateway 负责多渠道消息接入；Control UI 提供 Web 管理界面；Nodes 是 Agent 执行引擎；Skills 是插件系统，提供 500 多个扩展能力；Memory 管理短期和长期记忆。

我关注它有三个原因：第一，它代表了 AI 应用从'聊天'到'执行'的范式转变，这是行业大趋势。第二，它的架构设计非常优雅，Gateway 模式、Skills 插件化、多 LLM 支持这些设计思想，对我理解系统设计有很大帮助。第三，作为开源项目，我可以直接阅读源码学习，也有机会参与贡献。"

</details>

---

 | [下一课：安装 OpenClaw →](./04-install-openclaw.md)

---

## 动手安装 OpenClaw

---

### 本课目标

学完这一课，你将能够：
- 在自己的电脑上成功安装 OpenClaw
- 完成初始配置（选择 LLM Provider、设置 API Key）
- 理解 `openclaw.json` 配置文件的结构
- 排查常见安装问题
- 面试中展示你有实际动手经验

---

### 一、环境要求

#### 1.1 硬件要求

OpenClaw 本身是一个轻量级的 Node.js 应用，对硬件要求不高：

| 资源 | 最低要求 | 推荐配置 |
|------|---------|---------|
| CPU | 双核 | 四核及以上 |
| 内存 | 2GB 可用 | 4GB+ 可用 |
| 硬盘 | 500MB | 1GB+ |
| 网络 | 能访问 LLM API | 稳定的网络连接 |

#### 1.2 软件要求

```
┌──────────────────────────────────────────────────────┐
│                    软件依赖                            │
│                                                      │
│  必须安装:                                            │
│  ┌────────────────────────────────────────┐           │
│  │  Node.js 24（推荐）或 22.16+            │           │
│  │  npm（随 Node.js 一起安装）              │           │
│  └────────────────────────────────────────┘           │
│                                                      │
│  可选安装:                                            │
│  ┌────────────────────────────────────────┐           │
│  │  Git（用于从源码安装）                    │           │
│  │  Docker（用于容器化部署）                 │           │
│  └────────────────────────────────────────┘           │
│                                                      │
│  支持的操作系统:                                       │
│  ┌────────────────────────────────────────┐           │
│  │  macOS 13+ (Ventura 及以上)             │           │
│  │  Windows 10/11                         │           │
│  │  Ubuntu 20.04+ / Debian 11+            │           │
│  │  其他主流 Linux 发行版                   │           │
│  └────────────────────────────────────────┘           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 二、安装 Node.js

#### 2.1 macOS 安装（使用 Homebrew）

**第一步：安装 Homebrew（如果没有的话）**

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**第二步：安装 Node.js 24**

```bash
brew install node@24
```

**第三步：验证安装**

```bash
node --version
## 期望输出: v24.x.x

npm --version
## 期望输出: 10.x.x 或更高
```

**如果你已经有旧版本的 Node.js：**

```bash
brew upgrade node
```

> **小贴士：** 推荐使用 **nvm**（Node Version Manager）管理多版本 Node.js：
> ```bash
> # 安装 nvm
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
>
> # 安装 Node.js 24
> nvm install 24
> nvm use 24
>
> # 验证
> node --version
> ```

#### 2.2 Windows 安装

**方式一：官网下载安装包（推荐新手）**

```
┌──────────────────────────────────────────────────────┐
│                  Windows 安装步骤                      │
│                                                      │
│  1. 打开浏览器，访问 https://nodejs.org               │
│                                                      │
│  2. 下载 LTS 版本（24.x.x）                          │
│     ┌────────────────────────────┐                   │
│     │  [Download Node.js 24 LTS] │ ← 点这个按钮     │
│     └────────────────────────────┘                   │
│                                                      │
│  3. 双击 .msi 安装包                                  │
│     → Next → 勾选 "Add to PATH" → Next → Install    │
│                                                      │
│  4. 打开 PowerShell 或 CMD，验证：                    │
│     > node --version                                 │
│     > npm --version                                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**方式二：使用 winget（Windows 包管理器）**

```powershell
winget install OpenJS.NodeJS.LTS
```

**方式三：使用 nvm-windows**

```powershell
## 先从 https://github.com/coreybutler/nvm-windows 下载安装 nvm-windows
## 然后：
nvm install 24
nvm use 24
```

#### 2.3 Linux 安装（Ubuntu/Debian）

**方式一：使用 NodeSource 仓库（推荐）**

```bash
## 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

## 安装 Node.js
sudo apt-get install -y nodejs

## 验证
node --version
npm --version
```

**方式二：使用 nvm**

```bash
## 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

## 重新加载 shell 配置
source ~/.bashrc

## 安装 Node.js 24
nvm install 24
nvm use 24
```

---

### 三、安装 OpenClaw

#### 3.1 npm 全局安装（推荐）

这是最简单的安装方式，一行命令搞定：

```bash
npm install -g openclaw
```

安装完成后验证：

```bash
openclaw --version
## 期望输出: openclaw vX.X.X
```

```
┌──────────────────────────────────────────────────────┐
│                    安装过程示意                        │
│                                                      │
│  $ npm install -g openclaw                           │
│                                                      │
│  ⠋ Downloading openclaw...                           │
│  ⠙ Installing dependencies...                        │
│  ⠹ Building native modules...                        │
│  ✔ openclaw@X.X.X installed successfully!            │
│                                                      │
│  $ openclaw --version                                │
│  openclaw vX.X.X                                     │
│                                                      │
│  ✅ 安装成功！                                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 3.2 其他安装方式

**使用 npx（不全局安装，临时使用）：**

```bash
npx openclaw
```

**从源码安装（适合想贡献代码的开发者）：**

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
npm install
npm run build
npm link
```

**使用 Docker：**

```bash
docker run -d --name openclaw \
  -p 3000:3000 \
  -v openclaw-data:/data \
  openclaw/openclaw:latest
```

---

### 四、初始配置：openclaw onboard

#### 4.1 运行引导配置

安装完成后，运行引导命令进行首次配置：

```bash
openclaw onboard
```

这个命令会启动一个**交互式引导**，一步步带你完成配置：

```
┌──────────────────────────────────────────────────────────────┐
│                  openclaw onboard 引导流程                     │
│                                                              │
│  $ openclaw onboard                                          │
│                                                              │
│  🐾 Welcome to OpenClaw!                                     │
│  Let's set up your personal AI assistant.                    │
│                                                              │
│  ┌─ Step 1/4: Choose LLM Provider ────────────────────┐      │
│  │                                                    │      │
│  │  Which LLM would you like to use?                  │      │
│  │                                                    │      │
│  │  > OpenAI (GPT-4o, GPT-4.5)                       │      │
│  │    Anthropic (Claude 4)                            │      │
│  │    Google (Gemini 2.5)                             │      │
│  │    DeepSeek (DeepSeek R2)                          │      │
│  │    Ollama (Local models)                           │      │
│  │    Custom endpoint                                 │      │
│  │                                                    │      │
│  └────────────────────────────────────────────────────┘      │
│                          ↓                                   │
│  ┌─ Step 2/4: Enter API Key ──────────────────────────┐      │
│  │                                                    │      │
│  │  Enter your OpenAI API key:                        │      │
│  │  > sk-proj-xxxxxxxxxxxxxxxxxxxx                    │      │
│  │                                                    │      │
│  │  ✔ API key verified successfully!                  │      │
│  │                                                    │      │
│  └────────────────────────────────────────────────────┘      │
│                          ↓                                   │
│  ┌─ Step 3/4: Choose Default Model ───────────────────┐      │
│  │                                                    │      │
│  │  Select default model:                             │      │
│  │                                                    │      │
│  │  > gpt-4o (recommended)                            │      │
│  │    gpt-4.5-preview                                 │      │
│  │    gpt-4o-mini (cheaper)                           │      │
│  │                                                    │      │
│  └────────────────────────────────────────────────────┘      │
│                          ↓                                   │
│  ┌─ Step 4/4: Basic Settings ─────────────────────────┐      │
│  │                                                    │      │
│  │  Assistant name: OpenClaw                          │      │
│  │  Language: zh-CN                                   │      │
│  │  Enable memory: Yes                                │      │
│  │                                                    │      │
│  └────────────────────────────────────────────────────┘      │
│                          ↓                                   │
│  ✅ Configuration saved to ~/.openclaw/openclaw.json         │
│  🚀 Run 'openclaw' to start chatting!                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 4.2 LLM Provider 选择指南

| Provider | 模型 | 价格 | 适合谁 |
|----------|------|------|--------|
| **OpenAI** | GPT-4o, GPT-4.5 | 中等 | 大多数用户，综合能力强 |
| **Anthropic** | Claude 4 Sonnet/Opus | 中等 | 喜欢长文本处理和编程 |
| **Google** | Gemini 2.5 Pro | 低 | 有 Google Cloud 账号 |
| **DeepSeek** | DeepSeek R2/V3 | 极低 | 预算有限，性价比最高 |
| **Ollama** | Llama 4, Qwen 3... | 免费 | 想本地运行，数据不出电脑 |

> **零基础推荐：** 如果你不知道选什么，选 **OpenAI + GPT-4o** 或 **DeepSeek + DeepSeek R2**（性价比最高）。

#### 4.3 如何获取 API Key？

**以 OpenAI 为例：**

```
┌──────────────────────────────────────────────────────┐
│              获取 OpenAI API Key 步骤                  │
│                                                      │
│  1. 访问 https://platform.openai.com                 │
│                                                      │
│  2. 注册/登录账号                                     │
│                                                      │
│  3. 点击左侧 "API Keys"                              │
│                                                      │
│  4. 点击 "Create new secret key"                     │
│     ┌────────────────────────────────────┐           │
│     │ Name: my-openclaw-key              │           │
│     │ [Create secret key]                │           │
│     └────────────────────────────────────┘           │
│                                                      │
│  5. 复制 key（以 sk-proj- 开头）                      │
│     ⚠️ 这个 key 只显示一次！请妥善保管！               │
│                                                      │
│  6. 充值余额（最低 $5）                               │
│     Settings → Billing → Add payment method          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**以 DeepSeek 为例：**

```
┌──────────────────────────────────────────────────────┐
│              获取 DeepSeek API Key 步骤               │
│                                                      │
│  1. 访问 https://platform.deepseek.com               │
│                                                      │
│  2. 注册/登录（支持手机号注册）                        │
│                                                      │
│  3. 点击 "API Keys" → "Create API Key"               │
│                                                      │
│  4. 复制生成的 key                                    │
│                                                      │
│  5. 充值（新用户通常有免费额度）                       │
│                                                      │
│  💡 DeepSeek 的价格只有 OpenAI 的 1/10 左右           │
│     非常适合学习和实验                                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 五、配置文件详解：openclaw.json

#### 5.1 配置文件位置

`openclaw onboard` 完成后，配置文件保存在：

```
~/.openclaw/openclaw.json

macOS:   /Users/你的用户名/.openclaw/openclaw.json
Windows: C:\Users\你的用户名\.openclaw\openclaw.json
Linux:   /home/你的用户名/.openclaw/openclaw.json
```

#### 5.2 配置文件结构

```json
{
  "version": "1.0",
  "assistant": {
    "name": "OpenClaw",
    "language": "zh-CN",
    "personality": "helpful, concise"
  },
  "llm": {
    "provider": "openai",
    "model": "gpt-4o",
    "apiKey": "sk-proj-xxxxxxxxxxxxxxxx",
    "temperature": 0.7,
    "maxTokens": 4096
  },
  "memory": {
    "enabled": true,
    "shortTerm": {
      "maxMessages": 50
    },
    "longTerm": {
      "enabled": true,
      "storage": "local"
    }
  },
  "skills": [],
  "channels": {
    "cli": { "enabled": true },
    "dashboard": { "enabled": true, "port": 3000 }
  }
}
```

#### 5.3 重要配置项说明

```
┌──────────────────────────────────────────────────────────────┐
│                    配置项速查表                                │
│                                                              │
│  配置路径                      │ 说明             │ 建议值    │
│  ─────────────────────────────┼──────────────────┼──────────│
│  assistant.name               │ 助手名称          │ 自定义    │
│  assistant.language           │ 默认语言          │ zh-CN    │
│  llm.provider                 │ LLM 供应商        │ openai   │
│  llm.model                    │ 默认模型          │ gpt-4o   │
│  llm.apiKey                   │ API 密钥          │ 你的 key │
│  llm.temperature              │ 创造力(0-1)       │ 0.7      │
│  llm.maxTokens                │ 最大输出长度       │ 4096     │
│  memory.enabled               │ 启用记忆          │ true     │
│  memory.longTerm.enabled      │ 启用长期记忆       │ true     │
│  channels.dashboard.port      │ Dashboard 端口    │ 3000     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**temperature 参数详解：**

```
temperature = 0.0          temperature = 0.7          temperature = 1.0
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  确定性回答    │          │  平衡模式     │          │  创造性模式    │
│  每次回答相同  │          │  有变化但可控  │          │  高度随机     │
│  适合：       │          │  适合：       │          │  适合：       │
│  - 事实查询   │          │  - 日常对话    │          │  - 创意写作   │
│  - 代码生成   │          │  - 通用助手    │          │  - 头脑风暴   │
└──────────────┘          └──────────────┘          └──────────────┘
```

> **面试考点：** temperature 参数的作用是什么？
> 答：temperature 控制 LLM 输出的**随机性/创造性**。值为 0 时输出最确定（适合代码、事实回答），值越高越随机有创意（适合写作、头脑风暴）。通常默认 0.7 是比较好的平衡值。

---

### 六、常见安装问题排查

#### 6.1 问题排查速查表

```
┌──────────────────────────────────────────────────────────────┐
│                    常见问题排查                                │
│                                                              │
│  问题                          │ 解决方案                     │
│  ─────────────────────────────┼────────────────────────────  │
│  "command not found: node"    │ Node.js 未安装或未加入 PATH   │
│                               │ → 重新安装或 source ~/.zshrc │
│  ─────────────────────────────┼────────────────────────────  │
│  "command not found: openclaw"│ 全局安装失败或 PATH 问题      │
│                               │ → npm install -g openclaw    │
│                               │ → 或检查 npm bin -g 路径     │
│  ─────────────────────────────┼────────────────────────────  │
│  npm WARN EBADENGINE          │ Node.js 版本太低             │
│                               │ → 升级到 22.16+ 或 24        │
│  ─────────────────────────────┼────────────────────────────  │
│  EACCES permission denied     │ npm 全局安装权限不足          │
│                               │ → 见 6.2 解决方案            │
│  ─────────────────────────────┼────────────────────────────  │
│  API key verification failed  │ API Key 无效或已过期         │
│                               │ → 检查 Key 和账户余额        │
│  ─────────────────────────────┼────────────────────────────  │
│  网络连接超时                  │ 无法访问 LLM API             │
│                               │ → 检查网络/代理设置          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 6.2 npm 权限问题解决

**macOS/Linux 上遇到 `EACCES` 错误：**

```bash
## 方案一：修改 npm 全局目录（推荐）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'

## 添加到 PATH（macOS/zsh 用户）
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

## 添加到 PATH（Linux/bash 用户）
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

## 重新安装 OpenClaw
npm install -g openclaw

## 方案二：使用 sudo（不太推荐但简单）
sudo npm install -g openclaw
```

#### 6.3 Node.js 版本检查

```bash
## 检查当前版本
node --version

## 如果版本低于 22.16，需要升级
## macOS:
brew upgrade node

## 使用 nvm:
nvm install 24
nvm use 24
nvm alias default 24
```

#### 6.4 网络问题（中国大陆用户）

```bash
## 设置 npm 镜像源
npm config set registry https://registry.npmmirror.com

## 重新安装
npm install -g openclaw

## 如果 LLM API 访问有问题，可以在配置文件中设置代理
## 或者使用国内的 LLM（如 DeepSeek、Qwen）
```

---

### 七、验证安装成功

完成安装和配置后，运行以下命令验证一切正常：

```bash
## 1. 检查版本
openclaw --version

## 2. 检查配置
openclaw config show

## 3. 测试连接
openclaw ping
```

期望看到的输出：

```
┌──────────────────────────────────────────────────────┐
│                  验证安装成功                          │
│                                                      │
│  $ openclaw --version                                │
│  openclaw v1.x.x                                     │
│  ✅ 版本正确                                          │
│                                                      │
│  $ openclaw config show                              │
│  Provider: openai                                    │
│  Model: gpt-4o                                       │
│  Memory: enabled                                     │
│  ✅ 配置正确                                          │
│                                                      │
│  $ openclaw ping                                     │
│  🏓 Pong! LLM connection successful (234ms)          │
│  ✅ 连接正常                                          │
│                                                      │
│  一切就绪！进入下一课开始对话吧！                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

> **面试考点：** 安装 OpenClaw 需要哪些环境依赖？
> 答：OpenClaw 基于 Node.js 运行，需要 **Node.js 24（推荐）或 22.16 以上版本**。安装方式是 `npm install -g openclaw`，然后通过 `openclaw onboard` 进行引导配置，包括选择 LLM Provider、配置 API Key、选择默认模型等。配置信息保存在 `~/.openclaw/openclaw.json` 中。

---

### 八、本课要点回顾

```
┌──────────────────────────────────────────────────────┐
│                    知识点总结                          │
│                                                      │
│  1. 环境要求                                          │
│     Node.js 24（推荐）或 22.16+                       │
│                                                      │
│  2. 安装命令                                          │
│     npm install -g openclaw                          │
│                                                      │
│  3. 初始配置                                          │
│     openclaw onboard → 选 Provider → 填 API Key      │
│                                                      │
│  4. 配置文件                                          │
│     ~/.openclaw/openclaw.json                        │
│     包含 LLM 设置、记忆设置、渠道设置                   │
│                                                      │
│  5. 常见问题                                          │
│     权限问题用 ~/.npm-global 解决                     │
│     版本问题用 nvm 管理                               │
│     网络问题用镜像源或国内 LLM                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 九、课后练习

#### 练习 1：动手实操（实践题）

在你的电脑上完成 OpenClaw 的安装，并截图证明：
1. `node --version` 的输出
2. `openclaw --version` 的输出
3. `openclaw config show` 的输出

#### 练习 2：配置理解（选择题）

`openclaw.json` 中的 `temperature` 设置为 0.2，最可能的使用场景是？

A. 创意写作助手
B. 代码生成助手
C. 故事创作助手
D. 头脑风暴助手

<details>
<summary>点击查看答案</summary>

**答案：B**

解析：temperature = 0.2 表示较低的随机性，输出更确定、更精准。这种设置适合需要准确性的场景，如代码生成、事实查询、数据分析等。创意写作和头脑风暴需要更高的 temperature（0.8-1.0）来增加多样性。

</details>

#### 练习 3：问题排查（情景题）

你的同事在 macOS 上运行 `npm install -g openclaw` 时遇到了以下错误：

```
npm ERR! Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/openclaw'
```

请给出至少两种解决方案。

<details>
<summary>点击查看参考答案</summary>

**方案一：修改 npm 全局安装目录（推荐）**

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g openclaw
```

**方案二：使用 sudo**

```bash
sudo npm install -g openclaw
```

**方案三：使用 nvm 管理 Node.js（根本解决）**

使用 nvm 安装的 Node.js 不会有权限问题，因为 nvm 将 Node.js 安装在用户目录下。

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.zshrc
nvm install 24
npm install -g openclaw
```

**方案四：修改目录权限（不太推荐）**

```bash
sudo chown -R $(whoami) /usr/local/lib/node_modules
npm install -g openclaw
```

</details>

---

 | [下一课：第一次对话 →](./05-first-conversation.md)

---

## 第一次对话——Hello OpenClaw！

---

### 本课目标

学完这一课，你将能够：
- 使用 CLI 模式与 OpenClaw 进行对话
- 使用 Dashboard 进行可视化管理
- 理解 OpenClaw 的返回结果结构
- 安装第一个 Skill 并使用它
- 用 OpenClaw 完成一个实际任务
- 在面试中展示你有真实的 OpenClaw 使用经验

---

### 一、CLI 模式：命令行交互

#### 1.1 启动 OpenClaw

打开终端，输入：

```bash
openclaw
```

你会看到欢迎界面：

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   $ openclaw                                         │
│                                                      │
│   🐾 OpenClaw v1.x.x                                │
│   ──────────────────────────────────                 │
│   Provider: openai | Model: gpt-4o                   │
│   Memory: enabled | Skills: 0 loaded                 │
│                                                      │
│   Type your message, or /help for commands.          │
│   Type /exit to quit.                                │
│                                                      │
│   You >                                              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 1.2 发送第一条消息

试试输入：

```
You > 你好，请做一下自我介绍
```

OpenClaw 的回复可能是这样的：

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  You > 你好，请做一下自我介绍                          │
│                                                      │
│  🐾 OpenClaw >                                       │
│                                                      │
│  你好！我是 OpenClaw，你的个人 AI 助手。               │
│                                                      │
│  我可以帮你做很多事情：                                │
│  - 🔍 搜索互联网信息                                  │
│  - 📁 读写本地文件                                    │
│  - 💻 执行代码                                        │
│  - 📧 发送邮件和消息                                   │
│  - 📅 管理日程                                        │
│  - ... 以及更多（取决于安装的 Skills）                  │
│                                                      │
│  有什么我可以帮你的吗？                                │
│                                                      │
│  ─────────────────────────────────────────            │
│  tokens: 156 | latency: 823ms | model: gpt-4o       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 1.3 理解返回结果

注意回复底部的信息栏：

```
tokens: 156 | latency: 823ms | model: gpt-4o
```

| 字段 | 含义 | 为什么重要 |
|------|------|-----------|
| **tokens** | 这次回复消耗的 token 数量 | 直接影响费用 |
| **latency** | 响应延迟（毫秒） | 体现 Agent 的响应速度 |
| **model** | 使用的 LLM 模型 | 不同模型能力和价格不同 |

当 Agent 调用了工具时，你会看到更详细的信息：

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  You > 今天北京天气怎么样？                            │
│                                                      │
│  🔧 [Tool Call] web_search("北京 今天 天气")          │
│  ✅ [Tool Result] 搜索返回 5 条结果 (342ms)           │
│                                                      │
│  🐾 OpenClaw >                                       │
│                                                      │
│  今天北京天气晴朗，气温 12°C ~ 26°C，西北风 2 级。     │
│  空气质量良好，PM2.5 指数 45。                         │
│  适合户外活动，建议穿轻薄外套。                        │
│                                                      │
│  ─────────────────────────────────────────            │
│  tokens: 289 | latency: 1.2s | model: gpt-4o        │
│  tools: web_search x1                                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

可以看到，Agent 先调用了 `web_search` 工具，拿到搜索结果后再组织回答——这就是上一课学的 **ReAct 循环** 在实际运行！

---

### 二、Dashboard 模式：可视化管理

#### 2.1 启动 Dashboard

```bash
openclaw dashboard
```

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  $ openclaw dashboard                                │
│                                                      │
│  🐾 OpenClaw Dashboard starting...                   │
│  ✅ Server running at http://localhost:3000           │
│                                                      │
│  Open your browser and navigate to:                  │
│  👉 http://localhost:3000                             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 2.2 Dashboard 界面概览

打开浏览器访问 `http://localhost:3000`：

```
┌──────────────────────────────────────────────────────────────┐
│  🐾 OpenClaw Dashboard                              [设置]   │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│  对话列表  │              对话区域                              │
│          │                                                   │
│ ┌──────┐ │  ┌─────────────────────────────────────────┐     │
│ │ 新对话 │ │  │  🐾 你好！有什么可以帮你的？              │     │
│ ├──────┤ │  └─────────────────────────────────────────┘     │
│ │ 对话1 │ │                                                   │
│ │ 对话2 │ │                                                   │
│ │ 对话3 │ │                                                   │
│ │ ...  │ │                                                   │
│ │      │ │                                                   │
│ │      │ │                                                   │
│ ├──────┤ │  ┌─────────────────────────────────────────┐     │
│ │Skills│ │  │  输入消息...                      [发送] │     │
│ │Memory│ │  └─────────────────────────────────────────┘     │
│ │设置   │ │                                                   │
│ └──────┘ │                                                   │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

Dashboard 的主要功能：

| 功能区 | 说明 |
|--------|------|
| **对话列表** | 查看和管理所有历史对话 |
| **对话区域** | 和 Agent 实时交互 |
| **Skills 管理** | 浏览、安装、卸载 Skills |
| **Memory 查看** | 查看 Agent 记住了什么 |
| **设置** | 修改 LLM、模型、渠道等配置 |

> **CLI vs Dashboard 怎么选？**
> - **CLI**：适合快速提问和脚本自动化，开发者首选
> - **Dashboard**：适合日常使用和管理，可视化操作更直观

---

### 三、基础命令一览表

#### 3.1 CLI 内置命令

在 CLI 模式下，以 `/` 开头的是内置命令：

```
┌──────────────────────────────────────────────────────────────┐
│                    CLI 命令速查表                              │
│                                                              │
│  命令              │ 说明                    │ 示例           │
│  ─────────────────┼─────────────────────────┼──────────────  │
│  /help            │ 显示帮助信息             │ /help          │
│  /exit            │ 退出 OpenClaw            │ /exit          │
│  /clear           │ 清空当前对话             │ /clear         │
│  /model           │ 切换 LLM 模型           │ /model gpt-4.5 │
│  /skills          │ 列出已安装的 Skills      │ /skills        │
│  /skill install   │ 安装一个 Skill          │ /skill install  │
│                   │                         │ web-search     │
│  /skill remove    │ 卸载一个 Skill          │ /skill remove   │
│                   │                         │ web-search     │
│  /memory          │ 查看记忆状态             │ /memory        │
│  /memory clear    │ 清除所有记忆             │ /memory clear  │
│  /config          │ 查看当前配置             │ /config        │
│  /export          │ 导出当前对话             │ /export chat   │
│  /verbose         │ 开启详细模式(显示推理)    │ /verbose on    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 3.2 终端命令（在终端中直接使用）

```bash
## 启动交互式对话
openclaw

## 启动 Dashboard
openclaw dashboard

## 直接提问（不进入交互模式）
openclaw ask "今天天气怎么样？"

## 查看版本
openclaw --version

## 查看帮助
openclaw --help

## 查看配置
openclaw config show

## 修改配置
openclaw config set llm.model gpt-4.5

## 测试 LLM 连接
openclaw ping

## 引导配置
openclaw onboard

## 安装 Skill
openclaw skill install <skill-name>

## 列出可用 Skills
openclaw skill list

## 搜索 Skills
openclaw skill search <keyword>
```

---

### 四、Skills 初体验：安装第一个技能

#### 4.1 什么是 Skills？

上一课说过，Skills 就像手机上的 App——每安装一个 Skill，Agent 就多一项能力。

#### 4.2 浏览可用的 Skills

```bash
openclaw skill search web
```

```
┌──────────────────────────────────────────────────────┐
│                  搜索结果: "web"                       │
│                                                      │
│  1. web-search         ★★★★★  (12.3k installs)      │
│     搜索互联网内容，获取实时信息                        │
│                                                      │
│  2. web-browse         ★★★★☆  (8.7k installs)       │
│     浏览和抓取网页内容                                 │
│                                                      │
│  3. web-screenshot     ★★★★☆  (5.2k installs)       │
│     对网页截图                                        │
│                                                      │
│  4. web-monitor        ★★★☆☆  (2.1k installs)       │
│     监控网页变化并通知                                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 4.3 安装 web-search Skill

```bash
openclaw skill install web-search
```

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  $ openclaw skill install web-search                 │
│                                                      │
│  📦 Installing web-search...                         │
│  ✅ web-search@1.2.0 installed successfully!         │
│                                                      │
│  New tools available:                                │
│  - web_search: 搜索互联网内容                         │
│  - web_news: 搜索最新新闻                             │
│                                                      │
│  Try it: "帮我搜索一下最近的 AI 新闻"                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 4.4 安装更多 Skills

```bash
## 安装文件操作技能
openclaw skill install file-ops

## 安装代码执行技能
openclaw skill install code-runner

## 查看已安装的 Skills
openclaw skill list
```

```
┌──────────────────────────────────────────────────────┐
│                  已安装的 Skills                       │
│                                                      │
│  ┌─────────────┬────────┬──────────────────────┐     │
│  │ Skill       │ 版本   │ 提供的工具             │     │
│  ├─────────────┼────────┼──────────────────────┤     │
│  │ web-search  │ 1.2.0  │ web_search, web_news │     │
│  │ file-ops    │ 2.0.1  │ file_read, file_write│     │
│  │             │        │ file_list, file_delete│     │
│  │ code-runner │ 1.5.0  │ run_python, run_js   │     │
│  │             │        │ run_shell             │     │
│  └─────────────┴────────┴──────────────────────┘     │
│                                                      │
│  共 3 个 Skills, 8 个工具可用                          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 五、实战：用 OpenClaw 完成一个任务

#### 5.1 任务一：搜索网页信息

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  You > 帮我搜索一下 2026 年最受欢迎的编程语言排行             │
│                                                              │
│  🔧 [Tool Call] web_search("2026 最受欢迎编程语言排行")       │
│  ✅ [Tool Result] 返回 8 条结果 (456ms)                      │
│                                                              │
│  🐾 OpenClaw >                                               │
│                                                              │
│  根据 TIOBE 2026 年 3 月的编程语言排行榜：                    │
│                                                              │
│  | 排名 | 语言       | 份额   | 趋势  |                     │
│  |------|-----------|--------|-------|                     │
│  | 1    | Python    | 28.3%  | ↑     |                     │
│  | 2    | JavaScript| 15.7%  | →     |                     │
│  | 3    | Java      | 12.1%  | ↓     |                     │
│  | 4    | TypeScript| 8.9%   | ↑     |                     │
│  | 5    | Rust      | 6.2%   | ↑↑    |                     │
│                                                              │
│  Python 连续三年蝉联第一，主要得益于 AI/ML 领域的爆发。       │
│  Rust 增长最快，在系统编程领域越来越受欢迎。                   │
│                                                              │
│  ─────────────────────────────────────────────               │
│  tokens: 412 | latency: 2.1s | tools: web_search x1        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 5.2 任务二：操作本地文件

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  You > 帮我在桌面创建一个 notes.md 文件，写入今天的学习笔记    │
│                                                              │
│  🔧 [Tool Call] file_write(                                  │
│       path: "~/Desktop/notes.md",                            │
│       content: "# 学习笔记 - 2026-03-27\n\n..."             │
│     )                                                        │
│  ✅ [Tool Result] 文件创建成功 (12ms)                         │
│                                                              │
│  🐾 OpenClaw >                                               │
│                                                              │
│  已在桌面创建 notes.md 文件，内容如下：                        │
│                                                              │
│  ```markdown                                                 │
│  # 学习笔记 - 2026-03-27                                     │
│                                                              │
│  ## 今日学习内容                                              │
│  - OpenClaw 安装和基础使用                                    │
│  - CLI 模式和 Dashboard 模式                                  │
│  - Skills 系统初体验                                          │
│                                                              │
│  ## 待办事项                                                  │
│  - [ ] 阅读 OpenClaw 源码                                    │
│  - [ ] 尝试开发自定义 Skill                                   │
│  ```                                                         │
│                                                              │
│  ─────────────────────────────────────────────               │
│  tokens: 198 | latency: 1.8s | tools: file_write x1        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 5.3 任务三：多步骤复合任务

这个例子展示了 Agent 的 ReAct 多轮循环：

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  You > 帮我搜索 OpenClaw 最新版本的更新内容，                  │
│        总结成中文，保存到 ~/Desktop/openclaw-updates.md       │
│                                                              │
│  🔧 [Tool Call #1] web_search("OpenClaw latest release      │
│     changelog 2026")                                         │
│  ✅ [Tool Result #1] 返回 6 条结果 (521ms)                   │
│                                                              │
│  🔧 [Tool Call #2] web_search("OpenClaw GitHub releases")   │
│  ✅ [Tool Result #2] 返回 4 条结果 (398ms)                   │
│                                                              │
│  🔧 [Tool Call #3] file_write(                               │
│       path: "~/Desktop/openclaw-updates.md",                 │
│       content: "# OpenClaw 最新版本更新摘要\n\n..."          │
│     )                                                        │
│  ✅ [Tool Result #3] 文件创建成功 (15ms)                      │
│                                                              │
│  🐾 OpenClaw >                                               │
│                                                              │
│  已完成！做了以下三件事：                                      │
│                                                              │
│  1. 搜索了 OpenClaw 最新版本信息                              │
│  2. 将更新内容翻译总结为中文                                   │
│  3. 保存到 ~/Desktop/openclaw-updates.md                     │
│                                                              │
│  主要更新包括：                                               │
│  - 新增 Canvas 协作模式                                       │
│  - 支持 Claude 4 和 Gemini 2.5 Pro                           │
│  - Memory 系统性能提升 40%                                    │
│  - 新增 15 个官方 Skills                                      │
│                                                              │
│  ─────────────────────────────────────────────               │
│  tokens: 687 | latency: 4.3s                                │
│  tools: web_search x2, file_write x1                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

注意这次 Agent 自主执行了**三步操作**——两次搜索和一次文件写入，这就是 ReAct 循环的真实体现。

---

### 六、开启详细模式：观察 Agent 的思考过程

#### 6.1 用 /verbose 命令

在 CLI 中输入 `/verbose on` 可以看到 Agent 的完整推理过程：

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  You > /verbose on                                           │
│  ✅ Verbose mode enabled. You can see the agent's thinking.  │
│                                                              │
│  You > 3 的 15 次方是多少？                                   │
│                                                              │
│  💭 [Thought] 用户问 3^15 的值。这是一个数学计算，           │
│     我可以直接计算，也可以用 code-runner 确保精确。            │
│     为了保证准确，我用 code-runner 执行计算。                  │
│                                                              │
│  🔧 [Action] run_python("print(3 ** 15)")                   │
│                                                              │
│  👀 [Observation] 输出: 14348907                             │
│                                                              │
│  💭 [Thought] 计算结果是 14348907，任务完成。                 │
│                                                              │
│  🐾 OpenClaw >                                               │
│                                                              │
│  3 的 15 次方 = **14,348,907**                               │
│                                                              │
│  ─────────────────────────────────────────────               │
│  tokens: 203 | latency: 1.5s | tools: run_python x1        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

在详细模式下，你能清楚地看到：
- **Thought**：Agent 在想什么
- **Action**：Agent 决定做什么
- **Observation**：Agent 看到了什么结果

这对于**理解 Agent 原理**和**调试问题**非常有帮助。

> **面试考点：** OpenClaw 的 verbose 模式有什么用？
> 答：verbose 模式会展示 Agent 完整的 **ReAct 推理过程**——包括 Thought（思考）、Action（行动）和 Observation（观察）三个阶段。这对于调试 Agent 行为、理解它为什么做出某个决策、以及排查工具调用错误非常有帮助。

---

### 七、本课要点回顾

```
┌──────────────────────────────────────────────────────┐
│                    知识点总结                          │
│                                                      │
│  1. 两种交互模式                                      │
│     CLI: openclaw（快速交互）                         │
│     Dashboard: openclaw dashboard（可视化管理）       │
│                                                      │
│  2. 返回结果结构                                      │
│     tokens / latency / model / tools                 │
│                                                      │
│  3. 基础命令                                          │
│     /help /clear /model /skills /memory /verbose     │
│                                                      │
│  4. Skills 系统                                       │
│     search → install → use                           │
│     每个 Skill 提供一组工具                            │
│                                                      │
│  5. 实战能力                                          │
│     搜索网页 / 操作文件 / 多步骤复合任务               │
│     Agent 自主运行 ReAct 循环完成任务                  │
│                                                      │
│  6. Verbose 模式                                     │
│     观察 Thought → Action → Observation 完整流程     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### 八、课后练习

#### 练习 1：动手实操（实践题）

启动 OpenClaw，完成以下任务（每个任务截图你和 Agent 的对话）：

1. 让 OpenClaw 做一下自我介绍
2. 安装 `web-search` Skill，然后让 OpenClaw 搜索一条新闻
3. 开启 `/verbose on`，让 OpenClaw 做一道数学题，观察它的思考过程

#### 练习 2：概念理解（选择题）

当 OpenClaw 处理"帮我搜索最新新闻并保存到文件"这个请求时，它至少需要安装哪些 Skills？

A. 只需要 web-search
B. 只需要 file-ops
C. 需要 web-search 和 file-ops
D. 不需要任何 Skills，OpenClaw 自带这些能力

<details>
<summary>点击查看答案</summary>

**答案：C**

解析：这个任务需要两个操作——搜索网页和写入文件。`web-search` Skill 提供搜索互联网的能力（`web_search` 工具），`file-ops` Skill 提供文件操作的能力（`file_write` 工具）。缺少任何一个，Agent 都无法完成完整的任务。Agent 的能力完全取决于它安装了哪些 Skills——这就是 Skills 插件化设计的精髓。

</details>

#### 练习 3：面试模拟（开放题）

面试官问："你实际使用过 OpenClaw 吗？能说说你的使用体验吗？"

请基于本课学到的内容，组织一段有说服力的回答。

<details>
<summary>点击查看参考答案</summary>

**参考答案要点：**

"是的，我在本地安装并使用过 OpenClaw。

安装过程很简单，`npm install -g openclaw` 一行命令就搞定了。通过 `openclaw onboard` 引导配置了 LLM Provider 和 API Key。

OpenClaw 支持两种交互模式——CLI 模式适合快速提问和脚本自动化，Dashboard 模式提供了 Web 界面方便日常管理。

我觉得最有意思的是它的 **Skills 系统**。Skills 就像手机上的 App，每安装一个 Skill，Agent 就多一项能力。比如我安装了 `web-search` 和 `file-ops` 两个 Skills 后，就可以让 Agent 帮我搜索网上的资料并自动保存到本地文件——整个过程 Agent 会自主进行多轮 ReAct 循环，先搜索、再整理、最后写入文件。

我还使用了 `/verbose` 模式观察 Agent 的推理过程，能清楚地看到每一步的 Thought、Action 和 Observation，这对理解 Agent 的工作原理非常有帮助。

总体来说，OpenClaw 的上手体验比 LangChain 这类开发框架简单得多，但又比直接用 ChatGPT 灵活得多。它真正实现了从'聊天'到'执行'的跨越——不只是回答你的问题，而是帮你把事情做了。"

</details>

---

### 恭喜你！

你已经完成了 OpenClaw 入门的前五课！现在你已经：
- 理解了 AI、大模型和 Agent 的基础概念
- 掌握了 Tool Calling 和 ReAct 的核心原理
- 了解了 OpenClaw 的定位和架构
- 在本地安装并运行了 OpenClaw
- 完成了第一次实际对话

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              🎉 入门阶段完成！                         │
│                                                      │
│   ┌─────────┐                                        │
│   │ 第一课   │ ✅ AI / LLM / Agent 基础概念           │
│   ├─────────┤                                        │
│   │ 第二课   │ ✅ Tool Calling 与 ReAct               │
│   ├─────────┤                                        │
│   │ 第三课   │ ✅ OpenClaw 介绍                       │
│   ├─────────┤                                        │
│   │ 第四课   │ ✅ 安装 OpenClaw                       │
│   ├─────────┤                                        │
│   │ 第五课   │ ✅ 第一次对话（当前）                    │
│   └─────────┘                                        │
│                                                      │
│   接下来进入进阶阶段：                                 │
│   第六课：Gateway 架构深入分析                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

 | [下一课：Gateway 架构 →](./06-gateway-architecture.md)

---

## 插件开发：写你的第一个 Plugin

> **第三阶段：进阶实战** | 

---

### 本课目标

理解 OpenClaw 的 Plugin 架构和四种插件类型，掌握 Plugin 的开发流程和生命周期，能够独立开发一个包含工具注册和 Hook 扩展的完整插件。

---

### 一、Plugin 架构概述

如果说 Skills 是"操作手册"，那 Plugin 就是"功能模块"。Plugin 是 OpenClaw 最强大的扩展机制，它可以注册新能力、拦截处理流程、接入外部服务。

#### 四种 Plugin 类型

```
┌────────────────────────────────────────────────────────────┐
│                   Plugin 四种类型                            │
├────────────────┬───────────────────────────────────────────┤
│                │                                           │
│  Plain-        │  纯能力型：只提供新能力（工具、渠道等）       │
│  capability    │  例：天气查询工具、图片生成服务               │
│                │  特点：不干预处理流程，只提供可调用的能力      │
│                │                                           │
├────────────────┼───────────────────────────────────────────┤
│                │                                           │
│  Hybrid-       │  混合型：既提供能力，又通过 Hook 扩展流程    │
│  capability    │  例：数据库Plugin（提供查询工具 + 记录审计）  │
│                │  特点：最灵活，能力 + 流程扩展兼备           │
│                │                                           │
├────────────────┼───────────────────────────────────────────┤
│                │                                           │
│  Hook-only     │  仅钩子型：只通过 Hook 扩展处理流程         │
│                │  例：消息过滤器、日志记录器、权限检查器       │
│                │  特点：不提供新工具，只拦截和修改现有流程     │
│                │                                           │
├────────────────┼───────────────────────────────────────────┤
│                │                                           │
│  Non-          │  无能力型：不直接提供功能                    │
│  capability    │  例：配置加载器、环境变量注入器               │
│                │  特点：辅助性插件，为其他组件提供支持         │
│                │                                           │
└────────────────┴───────────────────────────────────────────┘
```

#### Plugin 类型决策树

```
你的 Plugin 需要提供新工具吗？
├── 是 → 需要拦截处理流程吗？
│        ├── 是 → Hybrid-capability
│        └── 否 → Plain-capability
└── 否 → 需要拦截处理流程吗？
         ├── 是 → Hook-only
         └── 否 → Non-capability
```

---

### 二、Plugin 可以注册的能力类型

```
┌──────────────────────────────────────────────┐
│         Plugin 可注册的能力类型                │
├──────────────┬───────────────────────────────┤
│ channels     │ 新的消息渠道                    │
│              │ 例：接入微信、LINE等            │
├──────────────┼───────────────────────────────┤
│ model        │ 新的 LLM 提供商                │
│ providers    │ 例：接入本地Ollama、自托管模型   │
├──────────────┼───────────────────────────────┤
│ tools        │ Agent可调用的新工具             │
│              │ 例：天气API、数据库查询          │
├──────────────┼───────────────────────────────┤
│ skills       │ 打包的SKILL.md文件             │
│              │ 例：附带使用指南的工具包         │
├──────────────┼───────────────────────────────┤
│ speech       │ 语音识别/合成能力              │
│              │ 例：接入Whisper、TTS服务        │
├──────────────┼───────────────────────────────┤
│ image        │ 图像生成/处理能力              │
│ generation   │ 例：接入DALL-E、Stable Diffusion│
└──────────────┴───────────────────────────────┘
```

> **面试考点**：Plugin 的能力注册机制是如何实现的？
>
> 核心思想是**注册表模式（Registry Pattern）**：
> 1. OpenClaw 核心维护一个全局注册表
> 2. Plugin 启动时将自己的能力注册到对应类别
> 3. Agent 运行时从注册表查询可用能力
> 4. 这实现了 Plugin 和核心的**松耦合**

---

### 三、Plugin 开发全流程

以一个 **"随机笑话生成器"** Plugin 为例，演示完整开发流程。

#### 步骤1：创建 Plugin 目录结构

```
my-joke-plugin/
├── index.ts          # 入口文件
├── package.json      # 包配置
├── tools/
│   └── get-joke.ts   # 工具实现
└── SKILL.md          # 使用指南（可选）
```

#### 步骤2：定义 Plugin 入口

```typescript
// index.ts
import { Plugin, PluginContext } from '@openclaw/sdk';
import { getJokeTool } from './tools/get-joke';

export default class JokePlugin implements Plugin {
  name = 'joke-plugin';
  version = '1.0.0';
  type = 'plain-capability';

  async onLoad(ctx: PluginContext): Promise<void> {
    // 注册工具
    ctx.registerTool(getJokeTool);

    console.log('Joke Plugin loaded!');
  }

  async onUnload(): Promise<void> {
    console.log('Joke Plugin unloaded.');
  }
}
```

#### 步骤3：实现工具

```typescript
// tools/get-joke.ts
import { Tool, ToolResult } from '@openclaw/sdk';

export const getJokeTool: Tool = {
  name: 'get_joke',
  description: 'Get a random joke. Use when the user asks for a joke or needs cheering up.',
  parameters: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Joke category: programming, dad, general',
        enum: ['programming', 'dad', 'general'],
        default: 'general'
      },
      language: {
        type: 'string',
        description: 'Language for the joke',
        default: 'en'
      }
    }
  },

  async execute(params: { category: string; language: string }): Promise<ToolResult> {
    const response = await fetch(
      `https://joke-api.example.com/random?category=${params.category}&lang=${params.language}`
    );
    const joke = await response.json();

    return {
      success: true,
      content: `${joke.setup}\n\n${joke.punchline}`
    };
  }
};
```

#### 步骤4：配置 package.json

```json
{
  "name": "@myname/joke-plugin",
  "version": "1.0.0",
  "description": "A plugin that tells random jokes",
  "main": "index.ts",
  "openclaw": {
    "type": "plugin",
    "pluginType": "plain-capability",
    "capabilities": ["tools"]
  }
}
```

#### 步骤5：注册到 openclaw.json

```json
{
  "plugins": [
    {
      "name": "@myname/joke-plugin",
      "enabled": true,
      "config": {
        "defaultCategory": "programming"
      }
    }
  ]
}
```

---

### 四、Plugin 的注册和生命周期

```
┌─────────────────────────────────────────────────────┐
│              Plugin 生命周期                          │
│                                                     │
│   ┌──────────┐                                      │
│   │ 发现     │  系统扫描 openclaw.json 中的插件配置    │
│   └────┬─────┘                                      │
│        │                                            │
│        ▼                                            │
│   ┌──────────┐                                      │
│   │ 加载     │  导入插件代码，校验接口合规              │
│   └────┬─────┘                                      │
│        │                                            │
│        ▼                                            │
│   ┌──────────┐                                      │
│   │ 初始化   │  调用 onLoad()，注册能力和 Hook        │
│   └────┬─────┘                                      │
│        │                                            │
│        ▼                                            │
│   ┌──────────┐                                      │
│   │ 运行中   │  插件正常工作，响应调用和事件           │
│   └────┬─────┘                                      │
│        │                                            │
│        ▼                                            │
│   ┌──────────┐                                      │
│   │ 卸载     │  调用 onUnload()，清理资源             │
│   └──────────┘                                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 生命周期钩子

```typescript
interface Plugin {
  name: string;
  version: string;

  // 插件加载时调用 - 注册能力、初始化资源
  onLoad(ctx: PluginContext): Promise<void>;

  // 插件卸载时调用 - 清理资源、关闭连接
  onUnload(): Promise<void>;

  // 配置更新时调用（可选）
  onConfigChange?(newConfig: Record<string, any>): Promise<void>;

  // 健康检查（可选）
  healthCheck?(): Promise<HealthStatus>;
}
```

> **面试考点**：Plugin 加载顺序如何控制？依赖冲突如何解决？
>
> 1. **加载顺序**：通过 `openclaw.json` 中的 `priority` 字段或声明式依赖
> 2. **依赖解析**：类似 npm 的依赖树解析，Plugin 可声明依赖其他 Plugin
> 3. **冲突检测**：如果两个 Plugin 注册同名工具，后加载的覆盖先加载的
> 4. **循环依赖**：系统检测并报错，要求开发者解除循环

---

### 五、Hook 系统详解

Hook 是 Plugin 扩展 OpenClaw 处理流程的核心机制，类似于 Web 框架中的**中间件（Middleware）**。

#### Hook 的执行模型

```
用户消息到达
      │
      ▼
┌─────────────────────────────────────────┐
│          Hook 管道 (Pipeline)            │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Hook 1  │→ │ Hook 2  │→ │ Hook 3  │ │
│  │ 日志    │  │ 权限    │  │ 过滤    │ │
│  └─────────┘  └─────────┘  └─────────┘ │
│                                         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
            Agent 核心处理
                   │
                   ▼
┌─────────────────────────────────────────┐
│        Hook 管道 (Response)              │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Hook 3  │→ │ Hook 2  │→ │ Hook 1  │ │
│  │ 格式化  │  │ 审计    │  │ 日志    │ │
│  └─────────┘  └─────────┘  └─────────┘ │
│                                         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
             回复发送给用户
```

#### 可用的 Hook 点

```
Hook 名称                   触发时机                   典型用途
─────────────────────────────────────────────────────────────
beforeMessageReceive       消息被 Agent 处理之前        过滤、鉴权、日志
afterMessageReceive        消息被 Agent 处理之后        审计、统计
beforeToolCall             工具被调用之前               权限检查、参数校验
afterToolCall              工具调用完成之后             结果缓存、日志
beforeResponse             Agent 回复发送之前           内容审核、格式化
afterResponse              Agent 回复发送之后           日志、触发后续动作
onError                    处理过程中出错               错误报告、降级
onSessionStart             新会话开始                   初始化用户上下文
onSessionEnd               会话结束                     清理资源、保存摘要
```

#### Hook 注册示例

```typescript
// 一个内容审核 Hook
export default class ContentFilterPlugin implements Plugin {
  name = 'content-filter';
  type = 'hook-only';

  async onLoad(ctx: PluginContext): Promise<void> {
    // 在 Agent 回复发送之前进行内容审核
    ctx.registerHook('beforeResponse', async (context, next) => {
      const response = context.response;

      // 检查是否包含敏感内容
      if (containsSensitiveContent(response.text)) {
        // 替换敏感内容
        context.response.text = sanitize(response.text);
        console.log('Sensitive content filtered');
      }

      // 调用下一个 Hook（中间件模式）
      await next();
    });

    // 在工具调用之前检查权限
    ctx.registerHook('beforeToolCall', async (context, next) => {
      const { toolName, userId } = context;

      if (!hasPermission(userId, toolName)) {
        throw new Error(`User ${userId} not authorized to use ${toolName}`);
      }

      await next();
    });
  }
}
```

> **面试考点**：Hook/中间件模式相比硬编码逻辑有什么优势？
>
> 1. **可插拔**：新增/移除功能不需要修改核心代码
> 2. **可排序**：通过优先级控制执行顺序
> 3. **可组合**：多个 Hook 组合实现复杂逻辑
> 4. **关注点分离**：日志、鉴权、过滤各自独立
> 5. **开闭原则**：对扩展开放，对修改关闭

---

### 六、工具的权限控制：策略管道分层设计

OpenClaw 的权限控制不是简单的"允许/拒绝"，而是一个**分层策略管道**：

```
工具调用请求
      │
      ▼
┌─────────────────────────────────┐
│  Layer 1: 全局策略               │
│  "这个工具是否被全局禁用?"        │
│  例：shell_exec 在生产环境禁用    │
└──────────────┬──────────────────┘
               │ 通过
               ▼
┌─────────────────────────────────┐
│  Layer 2: 用户/角色策略          │
│  "该用户是否有权使用此工具?"      │
│  例：只有管理员可以用 file_write  │
└──────────────┬──────────────────┘
               │ 通过
               ▼
┌─────────────────────────────────┐
│  Layer 3: 渠道策略               │
│  "此渠道是否允许使用此工具?"      │
│  例：公共Slack频道不允许 shell    │
└──────────────┬──────────────────┘
               │ 通过
               ▼
┌─────────────────────────────────┐
│  Layer 4: 参数策略               │
│  "工具参数是否在允许范围内?"      │
│  例：file_read 只能读 /safe/ 目录│
└──────────────┬──────────────────┘
               │ 通过
               ▼
          执行工具调用
```

#### 策略配置示例

```json
{
  "toolPolicies": {
    "global": {
      "shell_exec": {
        "enabled": true,
        "allowedCommands": ["ls", "cat", "grep", "find"],
        "blockedCommands": ["rm -rf", "sudo", "chmod"]
      }
    },
    "roles": {
      "admin": {
        "shell_exec": { "enabled": true, "allowedCommands": ["*"] }
      },
      "user": {
        "shell_exec": { "enabled": false }
      }
    },
    "channels": {
      "slack:C_public": {
        "shell_exec": { "enabled": false },
        "file_write": { "enabled": false }
      }
    }
  }
}
```

> **面试考点**：为什么要分层设计权限策略？
>
> 1. **层级覆盖**：细粒度策略覆盖粗粒度策略（参数级 > 渠道级 > 用户级 > 全局）
> 2. **默认安全**：全局默认最严格，逐层放宽
> 3. **可审计**：每层策略独立记录，方便排查权限问题
> 4. **关注点分离**：安全团队管全局策略，业务团队管用户策略

---

### 七、实战：开发一个天气查询 Plugin

#### 完整代码

```typescript
// weather-plugin/index.ts
import { Plugin, PluginContext, Tool, ToolResult } from '@openclaw/sdk';

export default class WeatherPlugin implements Plugin {
  name = 'weather-plugin';
  version = '1.0.0';
  type = 'hybrid-capability';

  private apiKey: string = '';

  async onLoad(ctx: PluginContext): Promise<void> {
    this.apiKey = ctx.config.apiKey;

    // 注册天气查询工具
    ctx.registerTool({
      name: 'get_weather',
      description: 'Get current weather and forecast for a city. Use when user asks about weather conditions.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'City name, e.g. "Beijing", "New York"'
          },
          units: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            default: 'celsius',
            description: 'Temperature unit'
          },
          days: {
            type: 'integer',
            default: 1,
            description: 'Number of forecast days (1-7)'
          }
        },
        required: ['city']
      },
      execute: this.getWeather.bind(this)
    });

    // 注册 Hook：记录天气查询日志
    ctx.registerHook('afterToolCall', async (context, next) => {
      if (context.toolName === 'get_weather') {
        console.log(`Weather queried: ${context.params.city} by ${context.userId}`);
      }
      await next();
    });
  }

  private async getWeather(params: {
    city: string;
    units: string;
    days: number;
  }): Promise<ToolResult> {
    try {
      const url = `https://api.weather.example.com/v1/forecast?city=${encodeURIComponent(params.city)}&units=${params.units}&days=${params.days}&key=${this.apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        return {
          success: false,
          error: `Weather API error: ${response.status}`
        };
      }

      const data = await response.json();

      const result = {
        city: data.city,
        current: {
          temperature: data.current.temp,
          condition: data.current.condition,
          humidity: data.current.humidity,
          wind: data.current.wind
        },
        forecast: data.forecast.map((day: any) => ({
          date: day.date,
          high: day.high,
          low: day.low,
          condition: day.condition
        }))
      };

      return {
        success: true,
        content: JSON.stringify(result, null, 2)
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch weather: ${error}`
      };
    }
  }

  async onUnload(): Promise<void> {
    // 清理工作
  }
}
```

#### 配套 SKILL.md

```markdown
## Weather Query Skill

When the user asks about weather, use the `get_weather` tool.

### Guidelines
- Always ask for the city name if not specified
- Default to celsius for Chinese users, fahrenheit for US users
- Present weather in a friendly, readable format
- Include suggestions based on weather (e.g., "bring an umbrella")
```

#### 安装和配置

```json
{
  "plugins": [
    {
      "name": "@myname/weather-plugin",
      "enabled": true,
      "config": {
        "apiKey": "${WEATHER_API_KEY}"
      }
    }
  ]
}
```

---

### 八、Plugin 开发最佳实践

```
┌────────────────────────────────────────────────────┐
│            Plugin 开发最佳实践                      │
├────────────────────────────────────────────────────┤
│                                                    │
│  1. 单一职责：一个 Plugin 只做一件事               │
│                                                    │
│  2. 错误隔离：Plugin 的错误不应该影响 Agent 核心    │
│     → try/catch 包裹所有外部调用                   │
│                                                    │
│  3. 配置外部化：API Key 等敏感信息通过环境变量传入  │
│     → 永远不要硬编码密钥                           │
│                                                    │
│  4. 优雅降级：外部服务不可用时返回有意义的错误信息  │
│     → 而不是让整个 Agent 崩溃                      │
│                                                    │
│  5. 资源清理：onUnload 中关闭连接、清理定时器       │
│     → 防止内存泄漏                                 │
│                                                    │
│  6. 日志规范：使用结构化日志，包含 Plugin 名称       │
│     → 方便排查问题                                 │
│                                                    │
│  7. 版本兼容：明确声明兼容的 OpenClaw 版本          │
│     → 避免 API 变更导致的问题                      │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

### 本课小结

```
┌──────────────────────────────────────────────────┐
│              核心知识点回顾                        │
├──────────────────────────────────────────────────┤
│                                                  │
│  四种 Plugin 类型：                               │
│    Plain-capability  纯能力型                     │
│    Hybrid-capability 混合型                       │
│    Hook-only         仅钩子型                     │
│    Non-capability    无能力型                     │
│                                                  │
│  可注册能力：channels, model providers,           │
│    tools, skills, speech, image generation        │
│                                                  │
│  生命周期：发现 → 加载 → 初始化 → 运行 → 卸载     │
│                                                  │
│  Hook = 中间件模式                                │
│    before/after + MessageReceive/ToolCall/        │
│    Response + onError/onSessionStart/End          │
│                                                  │
│  权限控制 = 分层策略管道                           │
│    全局 → 用户/角色 → 渠道 → 参数                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

### 课后练习

#### 练习1：类型判断
以下场景分别应该使用哪种类型的 Plugin？请说明理由：
1. 一个将所有 Agent 回复翻译成用户首选语言的插件
2. 一个提供 GitHub API 操作的插件
3. 一个检测并拦截垃圾消息的插件
4. 一个从 Vault 加载密钥到环境变量的插件

#### 练习2：Hook 设计
设计一个 "对话速率限制" Plugin（Hook-only 类型），要求：
- 限制每个用户每分钟最多发送 20 条消息
- 超限时返回友好提示，而不是硬拒绝
- 管理员用户不受限制
- 写出核心 Hook 注册代码

#### 练习3：完整 Plugin 开发
开发一个 "GitHub Issue 管理" Plugin（Hybrid-capability），要求：
- 提供 `create_issue`、`list_issues`、`close_issue` 三个工具
- 使用 `beforeToolCall` Hook 检查用户是否有 GitHub 权限
- 使用 `afterToolCall` Hook 在 Slack 频道发送通知
- 写出完整的目录结构和核心代码

---

>

---

## 源码导读：关键模块逐行分析

> **第四阶段 · 面试冲刺** 

**导航**：

---

### 本课目标

- 掌握 OpenClaw 项目的整体代码结构
- 逐行理解两个核心文件的关键逻辑
- 学会阅读开源项目源码的方法论
- 在面试中展示源码级别的理解深度

---

### 一、项目整体代码结构

OpenClaw 使用 **TypeScript（占比 89.0%）** 编写，采用 **MIT 协议** 开源。

#### 1.1 目录结构总览

```
openclaw/
├── src/
│   ├── gateway/                    # 网关层：接入和路由
│   │   ├── server.impl.ts          # ⭐ Gateway 核心实现
│   │   ├── server.types.ts         # Gateway 类型定义
│   │   ├── websocket/              # WebSocket 连接管理
│   │   └── channels/               # 多渠道适配器
│   │       ├── channel.interface.ts # Channel Plugin 接口
│   │       ├── wechat/             # 微信渠道
│   │       ├── slack/              # Slack 渠道
│   │       └── web/                # Web 渠道
│   │
│   ├── auto-reply/                 # 自动回复：Agent 核心
│   │   ├── reply/
│   │   │   ├── agent-runner-execution.ts  # ⭐ Agent 执行核心
│   │   │   ├── agent-runner.ts            # Agent Runner 入口
│   │   │   └── agent-runner.types.ts      # Agent Runner 类型
│   │   ├── context/                # 上下文引擎
│   │   │   ├── context-engine.ts   # Context Engine 核心
│   │   │   ├── compaction.ts       # 上下文压缩策略
│   │   │   └── context.types.ts    # 上下文类型定义
│   │   └── skills/                 # 技能/工具
│   │       ├── skill-registry.ts   # Skill 注册中心
│   │       ├── skill-executor.ts   # Skill 执行器
│   │       └── built-in/           # 内置 Skill
│   │
│   ├── memory/                     # 记忆系统
│   │   ├── short-term.ts           # 短期记忆（会话内）
│   │   ├── long-term.ts            # 长期记忆（跨会话）
│   │   └── memory.types.ts         # 记忆类型定义
│   │
│   ├── hooks/                      # Hook 系统
│   │   ├── hook-manager.ts         # Hook 管理器
│   │   └── hook.types.ts           # Hook 类型定义
│   │
│   └── shared/                     # 共享工具
│       ├── types/                  # 全局类型
│       ├── utils/                  # 工具函数
│       └── config/                 # 配置管理
│
├── tests/                          # 测试
├── docs/                           # 文档
├── package.json
├── tsconfig.json
└── LICENSE                         # MIT 协议
```

#### 1.2 TypeScript 代码组织方式

OpenClaw 的 TypeScript 代码遵循以下组织原则：

```typescript
// 1. 类型优先：每个模块都有对应的 .types.ts 文件
//    实现和类型分离，方便理解接口契约

// 2. 接口驱动：核心组件通过 interface 定义契约
//    如 channel.interface.ts 定义了渠道插件的标准接口

// 3. 依赖注入风格：组件间通过构造函数或工厂方法连接
//    而非直接 import 具体实现

// 4. 单一职责：每个文件聚焦一个明确的职责
//    如 compaction.ts 只负责上下文压缩
```

> **面试考点**：面试官问"你看过 OpenClaw 的源码吗？"时，先描述目录结构和代码组织方式，展示你对项目全貌的理解，再深入具体文件。切忌直接说某个函数的细节而不交代整体。

---

### 二、核心文件一：server.impl.ts — Gateway 启动与 WebSocket 绑定

**文件位置**：`src/gateway/server.impl.ts`

这是 Gateway 层的核心实现文件，负责服务启动、WebSocket 连接管理和消息路由。

#### 2.1 Gateway 启动 7 阶段

```typescript
// ========================================
// 阶段 1：配置加载
// ========================================
// Gateway 启动时首先加载配置，包括端口、认证信息、
// 渠道配置等。配置来源可以是环境变量、配置文件或远程配置中心。

async function initializeGateway(config: GatewayConfig): Promise<Gateway> {
  // 加载和验证配置
  const validatedConfig = validateConfig(config);
  // ...
}

// ========================================
// 阶段 2：中间件初始化
// ========================================
// 初始化认证、限流、日志等中间件。
// 这些中间件会在每个请求到达时按顺序执行。

function setupMiddlewares(app: Application): void {
  app.use(authMiddleware);       // 认证
  app.use(rateLimitMiddleware);  // 限流
  app.use(loggingMiddleware);    // 日志
  app.use(corsMiddleware);       // CORS
}

// ========================================
// 阶段 3：Channel Plugin 注册
// ========================================
// 加载并注册所有渠道插件。
// 每个插件实现 ChannelPlugin 接口。

function registerChannels(registry: ChannelRegistry): void {
  registry.register('wechat', new WechatChannel());
  registry.register('slack', new SlackChannel());
  registry.register('web', new WebChannel());
  // 可通过配置动态加载第三方渠道插件
}

// ========================================
// 阶段 4：WebSocket 服务绑定
// ========================================
// 这是最关键的阶段之一：建立 WebSocket 连接，
// 实现与客户端的双向实时通信。

function bindWebSocket(server: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    // 1. 提取连接信息（用户ID、会话ID等）
    const connectionInfo = extractConnectionInfo(req);

    // 2. 认证验证
    if (!authenticate(connectionInfo)) {
      ws.close(4001, 'Unauthorized');
      return;
    }

    // 3. 注册消息处理器
    ws.on('message', (data: Buffer) => {
      handleIncomingMessage(connectionInfo, data);
    });

    // 4. 注册断开处理器
    ws.on('close', () => {
      handleDisconnection(connectionInfo);
    });
  });

  return wss;
}

// ========================================
// 阶段 5：Lane 队列初始化
// ========================================
// Lane 是 OpenClaw 独特的消息队列设计，
// 每个会话有独立的 Lane，保证消息按序处理。

function initializeLaneManager(): LaneManager {
  return new LaneManager({
    maxConcurrentLanes: 100,
    laneTimeout: 30000,       // 单个 Lane 超时时间
    overflowStrategy: 'queue', // 溢出策略
  });
}

// ========================================
// 阶段 6：健康检查端点
// ========================================

function setupHealthCheck(app: Application): void {
  app.get('/health', (req, res) => {
    const status = {
      uptime: process.uptime(),
      activeLanes: laneManager.getActiveLaneCount(),
      activeConnections: wss.clients.size,
      memoryUsage: process.memoryUsage(),
    };
    res.json({ status: 'healthy', ...status });
  });
}

// ========================================
// 阶段 7：启动监听
// ========================================

async function startGateway(): Promise<void> {
  const config = await loadConfig();                    // 阶段1
  const app = createApplication();
  setupMiddlewares(app);                                // 阶段2
  registerChannels(channelRegistry);                    // 阶段3
  const server = app.listen(config.port);
  const wss = bindWebSocket(server);                    // 阶段4
  const laneManager = initializeLaneManager();          // 阶段5
  setupHealthCheck(app);                                // 阶段6
  console.log(`Gateway started on port ${config.port}`); // 阶段7
}
```

#### 2.2 消息处理核心流程

```typescript
// 当 WebSocket 收到消息时的处理链路
async function handleIncomingMessage(
  connectionInfo: ConnectionInfo,
  rawData: Buffer
): Promise<void> {
  // 1. 消息解析和验证
  const message = parseMessage(rawData);
  if (!validateMessage(message)) {
    sendError(connectionInfo.ws, 'Invalid message format');
    return;
  }

  // 2. 渠道适配：将不同渠道的消息格式统一化
  const normalizedMessage = await channelRegistry
    .getChannel(connectionInfo.channel)
    .normalize(message);

  // 3. 投递到 Lane 队列
  // 每个会话有独立的 Lane，保证同一会话的消息按序处理
  await laneManager.enqueue(
    connectionInfo.sessionId,
    normalizedMessage
  );

  // 4. Lane 处理器会依次取出消息，交给 Agent Runner
  // （这个过程在 agent-runner-execution.ts 中实现）
}
```

> **面试考点**：Gateway 启动 7 阶段是面试中"一条消息从收到到响应经历了什么"这类问题的前半部分。记住关键词：配置加载 → 中间件 → 渠道注册 → WebSocket 绑定 → Lane 初始化 → 健康检查 → 启动监听。

---

### 三、核心文件二：agent-runner-execution.ts — Agent 执行核心

**文件位置**：`src/auto-reply/reply/agent-runner-execution.ts`

这是整个 OpenClaw 最核心的文件，实现了 Agent 的执行循环逻辑。

#### 3.1 AgentRunLoopResult 类型定义

```typescript
// Agent 执行循环的结果类型
// 这个类型定义揭示了 Agent 执行的所有可能结局

type AgentRunLoopResult =
  | { type: 'success'; response: AgentResponse }
  // Agent 成功生成了回复

  | { type: 'tool_call'; toolCalls: ToolCall[] }
  // Agent 决定调用工具，需要继续循环

  | { type: 'context_overflow'; strategy: OverflowStrategy }
  // 上下文溢出，需要压缩或截断

  | { type: 'max_iterations'; partialResponse?: AgentResponse }
  // 达到最大循环次数，可能有部分结果

  | { type: 'error'; error: AgentError }
  // 执行出错

  | { type: 'fallback'; reason: string; fallbackResponse: AgentResponse }
  // 主路径失败，使用降级策略

  | { type: 'human_handoff'; reason: string }
  // 需要转人工处理
```

#### 3.2 runAgentTurnWithFallback() 逐行解析

这是 Agent 执行的入口函数，包含了降级（fallback）机制。

```typescript
async function runAgentTurnWithFallback(
  context: AgentContext,
  message: NormalizedMessage,
  options: AgentRunOptions
): Promise<AgentRunLoopResult> {

  // ─── 第一步：构建上下文 ───
  // 从 Context Engine 获取当前会话的完整上下文
  // 包括：System Prompt + 历史消息 + 短期记忆 + 长期记忆片段
  const fullContext = await context.contextEngine.buildContext({
    sessionId: context.sessionId,
    currentMessage: message,
    maxTokens: options.contextWindowSize,
  });

  // ─── 第二步：上下文溢出预检 ───
  // 在调用 LLM 之前，先检查上下文是否已经接近或超过窗口限制
  // 这是 Context Overflow 双路径检测的第一条路径：预检
  const preCheckResult = checkContextOverflow(fullContext, options);

  if (preCheckResult.isOverflow) {
    // 预检发现溢出，执行压缩策略
    const compactedContext = await context.contextEngine.compact(
      fullContext,
      preCheckResult.overflowAmount
    );

    // 如果压缩后仍然溢出，返回溢出结果
    if (isStillOverflow(compactedContext, options)) {
      return {
        type: 'context_overflow',
        strategy: {
          applied: 'compaction',
          success: false,
          recommendation: 'start_new_session',
        },
      };
    }

    // 用压缩后的上下文继续
    fullContext = compactedContext;
  }

  // ─── 第三步：执行 Agent 循环（带重试） ───
  try {
    const result = await runAgentLoop(fullContext, message, options);
    return result;

  } catch (error) {
    // ─── 第四步：降级处理 ───
    // 主路径失败时的 fallback 策略

    if (error instanceof ModelTimeoutError) {
      // 模型超时：尝试使用更快的小模型
      return await retryWithFallbackModel(fullContext, message, options);
    }

    if (error instanceof RateLimitError) {
      // 限流：排队等待后重试
      await delay(error.retryAfterMs);
      return await runAgentLoop(fullContext, message, options);
    }

    // 其他错误：返回安全的降级响应
    return {
      type: 'fallback',
      reason: error.message,
      fallbackResponse: generateSafeFallbackResponse(error),
    };
  }
}
```

#### 3.3 Agent 核心循环：runAgentLoop()

```typescript
async function runAgentLoop(
  context: BuiltContext,
  message: NormalizedMessage,
  options: AgentRunOptions
): Promise<AgentRunLoopResult> {

  let currentContext = context;
  let iteration = 0;

  // ─── 核心循环：最多执行 maxIterations 次 ───
  while (iteration < options.maxIterations) {
    iteration++;

    // 1. 调用 LLM
    const llmResponse = await callLLM({
      messages: currentContext.messages,
      tools: currentContext.availableTools,
      temperature: options.temperature,
    });

    // 2. 判断 LLM 响应类型
    if (llmResponse.type === 'text') {
      // LLM 直接返回了文本回复，循环结束
      return { type: 'success', response: llmResponse.content };
    }

    if (llmResponse.type === 'tool_calls') {
      // LLM 决定调用工具
      const toolResults: ToolResult[] = [];

      for (const toolCall of llmResponse.toolCalls) {
        // 3. 执行 Hook：before-tool-call
        const hookResult = await hookManager.execute(
          'before-tool-call',
          { toolCall, context: currentContext }
        );

        if (hookResult.blocked) {
          toolResults.push({
            toolCallId: toolCall.id,
            result: { error: 'Blocked by policy' },
          });
          continue;
        }

        // 4. 执行工具
        const result = await skillExecutor.execute(
          toolCall.name,
          toolCall.parameters
        );

        // 5. 处理超大结果
        const processedResult = processToolResult(result, options);
        toolResults.push({
          toolCallId: toolCall.id,
          result: processedResult,
        });
      }

      // 6. 将工具结果追加到上下文
      currentContext = appendToolResults(currentContext, toolResults);

      // 7. Context Overflow 双路径检测的第二条路径：循环内检测
      const postToolCheck = checkContextOverflow(currentContext, options);
      if (postToolCheck.isOverflow) {
        currentContext = await compactContext(currentContext, options);
      }

      // 继续循环，让 LLM 根据工具结果生成下一步
      continue;
    }
  }

  // 达到最大循环次数
  return {
    type: 'max_iterations',
    partialResponse: generatePartialResponse(currentContext),
  };
}
```

#### 3.4 Context Overflow 双路径检测

```typescript
// 路径一：循环开始前的预检
// 检查历史上下文 + 新消息是否已经接近窗口限制
function checkContextOverflow(
  context: BuiltContext,
  options: AgentRunOptions
): OverflowCheckResult {
  const currentTokens = countTokens(context.messages);
  const windowSize = options.contextWindowSize;

  // 预留 20% 给模型回复
  const safeThreshold = windowSize * 0.8;

  return {
    isOverflow: currentTokens > safeThreshold,
    currentTokens,
    maxTokens: windowSize,
    overflowAmount: Math.max(0, currentTokens - safeThreshold),
  };
}

// 路径二：工具调用后的即时检测
// 工具返回结果可能很大，追加后可能导致溢出
// 这条路径在 runAgentLoop 的每次工具调用后执行
// （见上方代码第 7 步）
```

#### 3.5 Lane 队列实现

```typescript
// Lane 是 OpenClaw 独特的消息队列设计
// 每个会话（session）有独立的 Lane

class LaneManager {
  private lanes: Map<string, Lane> = new Map();

  async enqueue(sessionId: string, message: NormalizedMessage): Promise<void> {
    // 获取或创建该会话的 Lane
    let lane = this.lanes.get(sessionId);
    if (!lane) {
      lane = new Lane(sessionId, this.config);
      this.lanes.set(sessionId, lane);
    }

    // 消息入队
    await lane.push(message);

    // 如果 Lane 当前空闲，启动处理
    if (!lane.isProcessing) {
      this.processLane(lane);
    }
  }

  private async processLane(lane: Lane): Promise<void> {
    lane.isProcessing = true;

    while (!lane.isEmpty()) {
      const message = await lane.shift();

      try {
        // 将消息交给 Agent Runner 处理
        const result = await runAgentTurnWithFallback(
          lane.context,
          message,
          this.agentOptions
        );

        // 将结果通过 WebSocket 发回客户端
        await sendResponse(lane.sessionId, result);

      } catch (error) {
        await sendError(lane.sessionId, error);
      }
    }

    lane.isProcessing = false;
  }
}

// Lane vs 普通消息队列的区别：
// 1. 会话隔离：每个会话独立的队列，互不干扰
// 2. 顺序保证：同一会话内消息严格按序处理
// 3. 上下文关联：Lane 持有该会话的 Context 引用
// 4. 背压控制：单个 Lane 阻塞不影响其他会话
```

> **面试考点**：`runAgentTurnWithFallback` 是面试中"一条消息完整链路"问题的后半部分。关键要说清楚：构建上下文 → 溢出预检 → Agent 循环（LLM调用 → 工具执行 → 结果追加 → 溢出再检） → 降级处理。双路径检测是加分点。

---

### 四、如何阅读开源项目源码：方法论

#### 4.1 五步法

```
Step 1：宏观结构
  ├── 读 README.md 和 CONTRIBUTING.md
  ├── 看目录结构，理解模块划分
  └── 看 package.json 了解依赖和脚本

Step 2：入口追踪
  ├── 找到 main 入口文件
  ├── 沿着启动流程一路追下去
  └── 画出启动序列图

Step 3：核心链路
  ├── 找到最重要的用户场景（如"发一条消息"）
  ├── 从入口追踪到出口
  └── 标记每个关键函数

Step 4：类型系统
  ├── 阅读 .types.ts 文件
  ├── 理解核心数据结构
  └── 类型定义往往比实现更能揭示设计意图

Step 5：测试用例
  ├── 阅读测试文件理解预期行为
  ├── 运行测试验证你的理解
  └── 修改测试观察效果
```

#### 4.2 实用技巧

```
技巧 1：从类型定义入手
  TypeScript 项目的 .types.ts 文件是最好的文档
  AgentRunLoopResult 类型定义直接告诉你 Agent 执行的所有可能结局

技巧 2：关注 interface 而非 class
  接口定义了"做什么"，类实现了"怎么做"
  先理解"做什么"，再深入"怎么做"

技巧 3：搜索关键字
  "TODO" — 开发者知道的未完成项
  "HACK" — 临时方案，揭示设计取舍
  "FIXME" — 已知问题

技巧 4：Git Blame 看历史
  关键函数的演变历史往往比当前实现更有信息量
  看 PR 描述和 commit message 理解设计决策

技巧 5：画图辅助理解
  调用关系图、数据流图、状态机图
  看不懂的代码画一画就清楚了
```

> **面试考点**：面试官问"你是怎么学习 OpenClaw 的？"或"你平时怎么阅读源码？"时，展示系统性的方法论比罗列技术细节更加分。说明你从宏观到微观、从类型到实现的阅读路径。

---

### 课后练习

#### 练习 1：代码追踪
从 `startGateway()` 函数开始，画出完整的调用链路图，直到 Agent 返回响应给用户。标注每个函数所在的文件。

#### 练习 2：类型分析
分析 `AgentRunLoopResult` 的 7 种结果类型，为每种类型设计一个具体的触发场景，并说明在该场景下系统应该如何处理。

#### 练习 3：源码改进
阅读 `runAgentLoop` 的代码，找出至少 3 个可以优化的点（如并行工具调用、缓存策略、错误恢复等），并写出你的改进方案。

---

**导航**：
