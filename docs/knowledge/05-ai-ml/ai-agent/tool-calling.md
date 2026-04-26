---
title: "Tool Calling 与函数调用"
outline: deep
---

> 维护说明：请直接在 docs/ 目录维护本页内容。


### 四、Tool Calling 与函数调用

Agent 和普通 Chatbot 的重要区别，是 Agent 可以调用外部工具完成动作，例如查数据库、调用 API、读写文件、搜索网页、发起审批等。

常见考点：

- 工具调用基本流程：模型理解意图、选择工具、生成参数、执行工具、整合结果
- Function Calling：函数描述、参数 Schema、返回值设计
- 工具粒度设计：一个工具做一件事，避免工具过大或过碎
- 参数校验：必填字段、类型约束、枚举值、默认值
- 工具执行安全：权限控制、危险操作确认、只读与写入隔离
- 工具结果处理：结构化返回、错误信息、重试、结果摘要
- 多工具协作：查询、计算、写入、通知等工具链路组合

常见追问：

- Tool Calling 和普通 API 调用有什么区别？
- 如何让模型在多个工具中选对工具？
- 如果模型生成了错误参数，系统应该怎么处理？
- 哪些工具应该禁止 Agent 自动调用？

---


## 第11课：Skills 系统与 ClawHub 生态

> **第三阶段：进阶实战** | 

---

### 本课目标

理解 OpenClaw 三层能力体系（Tools → Skills → Plugins）的设计哲学，掌握 Skills 的编写方式和 ClawHub 生态的使用方法。

---



### 一、三层能力体系全景

想象你在组装一台电脑：

- **Tools** = 各个零件（CPU、内存、硬盘）—— 最基础的功能单元
- **Skills** = 驱动程序 —— 告诉系统如何使用这些零件
- **Plugins** = 整套解决方案 —— 打包好的功能包，开箱即用

```
┌─────────────────────────────────────────────────┐
│                  OpenClaw Agent                  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │            Plugins（功能包）                │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │         Skills（Markdown 指令）      │  │  │
│  │  │  ┌───────────────────────────────┐  │  │  │
│  │  │  │      Tools（类型化函数）        │  │  │  │
│  │  │  │                               │  │  │  │
│  │  │  │  file_read()  shell_exec()    │  │  │  │
│  │  │  │  web_fetch()  send_msg()      │  │  │  │
│  │  │  │  ...约20个内置工具...           │  │  │  │
│  │  │  └───────────────────────────────┘  │  │  │
│  │  │                                     │  │  │
│  │  │  SKILL.md → 注入 system prompt      │  │  │
│  │  │  教会 Agent 如何组合使用 Tools       │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  channels + model providers + hooks + ... │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

### 二、Tools：基础能力层

Tools 是 Agent 可以调用的**类型化函数**，每个 Tool 有明确的输入参数和输出格式。

#### 内置 Tools（约20个）

| 类别 | 工具名 | 功能 |
|------|--------|------|
| 文件操作 | `file_read`, `file_write`, `file_edit` | 读写编辑文件 |
| 系统执行 | `shell_exec` | 执行 Shell 命令 |
| 网络请求 | `web_fetch` | 抓取网页内容 |
| 搜索 | `web_search`, `grep`, `glob` | 搜索网络和文件 |
| 消息 | `send_message` | 发送消息 |
| 图像 | `generate_image` | 生成图片 |
| 其他 | `read_lints`, `todo_write` 等 | 辅助功能 |

#### Tool 的定义格式

```json
{
  "name": "web_fetch",
  "description": "Fetch content from a URL and return readable text",
  "parameters": {
    "type": "object",
    "properties": {
      "url": {
        "type": "string",
        "description": "The URL to fetch"
      }
    },
    "required": ["url"]
  }
}
```

> **面试考点**：Tools 和普通 API 的区别是什么？
> - Tools 是**面向 Agent 设计**的，有自然语言描述帮助 Agent 理解何时使用
> - Tools 的参数是**类型化**的（JSON Schema），Agent 可以自动构造调用参数
> - Tools 通过统一接口暴露，Agent 不需要知道底层实现

---

### 三、Skills：知识注入层

Skills 是 OpenClaw 最有特色的设计。一个 Skill 就是一个 **SKILL.md** 文件，它被注入到 Agent 的 system prompt 中，教会 Agent 一项新能力。

#### 为什么用 Markdown？

把 Agent 想象成一个新入职的实习生：
- **Tools** 是办公桌上的工具（电脑、打印机、电话）
- **Skills** 是操作手册 —— 用自然语言写的指南，告诉实习生如何用这些工具完成具体任务

Markdown 的优势：
1. **人类可读可写** —— 不需要编程知识就能创建
2. **LLM 原生友好** —— 大模型对自然语言指令的理解最好
3. **版本管理方便** —— 纯文本文件，Git 友好

#### SKILL.md 完整示例

以下是一个 "代码审查" Skill 的完整示例：

```markdown
## Code Review Skill

You are a senior code reviewer. When the user asks you to review code,
follow these steps:

### Tools Available
- `file_read`: Read source files
- `grep`: Search for patterns in code
- `shell_exec`: Run linters or tests

### Review Process

1. **Read the file** using `file_read` to understand the full context
2. **Check for common issues**:
   - Unused imports
   - Missing error handling
   - Security vulnerabilities (SQL injection, XSS, etc.)
   - Performance anti-patterns
3. **Run the linter** using `shell_exec` with the appropriate command
4. **Provide feedback** in this format:

#### Feedback Format
- 🔴 Critical: Must fix before merge
- 🟡 Warning: Should fix but not blocking
- 🟢 Suggestion: Nice to have improvement

### Important Rules
- Always explain WHY something is a problem, not just WHAT
- Provide a corrected code snippet for each issue
- Be constructive and respectful in tone
```

#### SKILL.md 解析

```
┌──────────────── SKILL.md 结构 ────────────────┐
│                                                │
│  # 标题                                        │
│  ├── 角色设定（你是谁，做什么）                   │
│  │                                              │
│  ## 可用工具                                    │
│  ├── 列出该 Skill 会用到的 Tools                 │
│  │                                              │
│  ## 执行流程                                    │
│  ├── 分步骤的详细指令                            │
│  │                                              │
│  ## 输出格式                                    │
│  ├── 定义输出的结构和样式                        │
│  │                                              │
│  ## 重要规则                                    │
│  └── 边界条件和约束                              │
│                                                │
└────────────────────────────────────────────────┘
```

关键要素：
- **角色定义**：让 Agent 知道自己在扮演什么角色
- **工具声明**：明确该 Skill 需要哪些 Tools
- **流程指令**：Step-by-step 的执行步骤
- **输出格式**：标准化输出，保证一致性
- **约束规则**：防止 Agent 偏离预期行为

> **面试考点**：SKILL.md 注入 system prompt 的机制是什么？
> - Agent 启动时，系统读取配置中注册的所有 SKILL.md 文件
> - 文件内容被**拼接**到 system prompt 中
> - Agent 在每次对话时都能"看到"这些指令
> - 这就是为什么 Skills 本质上是**提示工程（Prompt Engineering）的文件化**

---

### 四、ClawHub 技能市场

ClawHub 是 OpenClaw 的技能市场，拥有 **5700+ MCP Skills**，类似于 npm 或 pip 的包管理生态。

#### 安装 Skill

```bash
/skills install @anthropic/web-search
/skills install @openai/code-interpreter
/skills install @community/weather-tool
```

#### 在 openclaw.json 中注册

```json
{
  "name": "my-agent",
  "skills": [
    {
      "name": "@anthropic/web-search",
      "version": "^2.1.0",
      "config": {
        "maxResults": 10,
        "safeSearch": true
      }
    },
    {
      "name": "@community/weather-tool",
      "version": "^1.0.0"
    }
  ]
}
```

#### 热门 Skills 分类

```
┌─────────────────────────────────────────────┐
│          ClawHub 热门分类 (5700+)            │
├──────────────┬──────────────────────────────┤
│ 🔍 Web Search │ 搜索引擎集成、实时信息检索    │
├──────────────┼──────────────────────────────┤
│ 💻 Coding     │ 代码生成、审查、调试、测试     │
├──────────────┼──────────────────────────────┤
│ 📁 Files      │ 文件处理、格式转换、批量操作   │
├──────────────┼──────────────────────────────┤
│ 📊 Productivity│ 日历、邮件、任务管理         │
├──────────────┼──────────────────────────────┤
│ ⚙️ Automation │ 工作流编排、定时任务、监控     │
├──────────────┼──────────────────────────────┤
│ 🎨 Image Gen  │ 图片生成、编辑、风格迁移      │
├──────────────┼──────────────────────────────┤
│ 📝 Writing    │ 文章撰写、翻译、摘要          │
├──────────────┼──────────────────────────────┤
│ 🗄️ Database   │ SQL查询、数据分析、可视化     │
└──────────────┴──────────────────────────────┘
```

#### 如何选择和评估一个 Skill

评估一个 Skill 时，关注以下指标：

```
评估维度                 权重    检查项
─────────────────────────────────────────
1. 功能匹配度            ★★★★★  是否解决你的实际需求
2. 下载量/Star数         ★★★★   社区认可度
3. 维护活跃度            ★★★★   最近更新时间、issue响应
4. 文档质量              ★★★    README是否清晰完整
5. 安全审计              ★★★    是否有恶意代码风险
6. 依赖复杂度            ★★     是否引入过多外部依赖
7. 版本兼容性            ★★     是否兼容你的OpenClaw版本
```

> **面试考点**：如何设计一个 Skill 市场的搜索和推荐系统？
> 这是系统设计题的常见变种。需要考虑：
> - 基于关键词的全文搜索
> - 基于使用场景的语义搜索
> - 协同过滤推荐（安装了A的用户也安装了B）
> - 质量排名算法（下载量、评分、活跃度加权）

---

### 五、自定义 Skill 开发

#### 创建你自己的 Skill

```bash
mkdir my-skill
cd my-skill
touch SKILL.md
```

在 SKILL.md 中编写你的 Skill 内容，然后在 `openclaw.json` 中本地注册：

```json
{
  "skills": [
    {
      "name": "my-custom-skill",
      "path": "./skills/my-skill/SKILL.md"
    }
  ]
}
```

#### 发布到 ClawHub

```bash
/skills publish my-skill
```

发布前的检查清单：
- [ ] SKILL.md 内容完整，角色、流程、格式都定义清楚
- [ ] 包含 README.md 说明用途和用法
- [ ] 测试过 Agent 能正确理解和执行指令
- [ ] 没有硬编码的密钥或敏感信息

---

### 六、Skills 与 Prompt Engineering 的关系

```
传统 Prompt Engineering          OpenClaw Skills
─────────────────────           ─────────────────
手动拼接 prompt                  文件化管理
每次对话重新写                   一次编写，持续复用
难以版本控制                     Git 管理，可回溯
个人知识难以共享                  ClawHub 市场分享
无标准格式                       SKILL.md 规范
```

Skills 本质上是**结构化的、可复用的、可分享的 Prompt Engineering**。

> **面试考点**：Skills 系统相比硬编码能力有什么优势？
> 1. **灵活性**：修改 Markdown 文件即可更新能力，无需重新部署
> 2. **可组合性**：多个 Skills 可以组合使用
> 3. **民主化**：非程序员也能编写 Skills 扩展 Agent 能力
> 4. **生态效应**：ClawHub 市场让能力可以复用和共享

---

### 本课小结

```
┌────────────────────────────────────────────┐
│              核心知识点回顾                  │
├────────────────────────────────────────────┤
│                                            │
│  Tools   = 基础函数（约20个内置）            │
│  Skills  = Markdown指令（注入system prompt） │
│  Plugins = 功能包（打包分发）               │
│                                            │
│  SKILL.md = 角色 + 工具 + 流程 + 格式 + 规则│
│  ClawHub  = 5700+ Skills 的市场             │
│  安装命令 = /skills install @author/name    │
│                                            │
└────────────────────────────────────────────┘
```

---

### 课后练习

#### 练习1：概念辨析
请用自己的话解释 Tools、Skills、Plugins 三者的关系，并各举一个实际例子说明它们的区别。

#### 练习2：编写 SKILL.md
编写一个 "周报生成器" 的 SKILL.md，要求：
- 定义角色为周报撰写助手
- 使用 `file_read` 读取本周工作日志
- 使用 `web_fetch` 获取项目管理平台的任务状态
- 输出格式化的周报内容
- 至少包含3条约束规则

#### 练习3：设计题
如果你要设计一个 Skill 的**热更新机制**（修改 SKILL.md 后 Agent 立即感知变化），你会如何实现？请考虑：
- 文件变更检测方案
- 如何在不中断对话的情况下更新 system prompt
- 版本回滚策略

---

>

---

## 第12课：MCP 协议：Agent 的通用语言

> **第三阶段：进阶实战** | 

---

### 本课目标

理解 MCP（Model Context Protocol）协议的设计理念和技术架构，掌握 OpenClaw 中 MCP 的集成方式，能够分析 MCP 工具定义并对比直接 API 调用的优劣。

---



### 一、什么是 MCP（Model Context Protocol）

MCP 是由 **Anthropic** 创建的**开放标准协议**，定义了 AI Agent 与外部工具/服务之间的通信规范。

#### USB 接口的比喻

```
没有 MCP 的世界（混乱）：
┌────────┐    专用接口A    ┌──────────┐
│ Agent  │────────────────│ 搜索服务  │
│        │    专用接口B    ├──────────┤
│        │────────────────│ 数据库    │
│        │    专用接口C    ├──────────┤
│        │────────────────│ 文件系统  │
│        │    专用接口D    ├──────────┤
│        │────────────────│ 邮件服务  │
└────────┘                └──────────┘
  每个服务都需要定制开发适配器，N个服务 = N种接口

有 MCP 的世界（统一）：
┌────────┐                ┌──────────┐
│ Agent  │    ┌───────┐   │ 搜索服务  │
│        │────│  MCP  │───│ 数据库    │
│        │    │ 协议  │   │ 文件系统  │
│        │    └───────┘   │ 邮件服务  │
└────────┘     统一接口    └──────────┘
  一个协议连接所有服务，就像 USB 连接所有设备
```

就像 USB 让你不用关心插的是鼠标、键盘还是U盘一样，MCP 让 Agent 不用关心对接的是搜索引擎、数据库还是文件系统 —— **统一的协议，统一的调用方式**。

> **面试考点**：为什么需要 MCP 这样的标准化协议？
> 1. **降低集成成本**：新服务只需实现 MCP 接口，所有兼容 Agent 都能使用
> 2. **生态互通**：不同厂商的 Agent 可以共享同一个工具市场
> 3. **质量保障**：标准化的工具定义让 Agent 更准确地理解和调用工具
> 4. **可发现性**：Agent 可以动态发现和加载新工具

---

### 二、MCP 的 Server/Client 架构

```
┌─────────────────────────────────────────────────────┐
│                    MCP 架构全景                       │
│                                                     │
│  ┌──────────────┐         ┌──────────────────────┐  │
│  │  MCP Client  │         │    MCP Server         │  │
│  │  (Agent侧)   │         │    (工具/服务侧)       │  │
│  │              │         │                      │  │
│  │  ┌────────┐ │  JSON-  │  ┌────────────────┐  │  │
│  │  │ 发现   │──────────────│ 工具注册表      │  │  │
│  │  │ 模块   │ │  RPC    │  │ (tools/list)   │  │  │
│  │  └────────┘ │         │  └────────────────┘  │  │
│  │              │         │                      │  │
│  │  ┌────────┐ │  请求/  │  ┌────────────────┐  │  │
│  │  │ 调用   │──────────────│ 工具执行器      │  │  │
│  │  │ 模块   │ │  响应   │  │ (tools/call)   │  │  │
│  │  └────────┘ │         │  └────────────────┘  │  │
│  │              │         │                      │  │
│  │  ┌────────┐ │         │  ┌────────────────┐  │  │
│  │  │ 上下文 │──────────────│ 资源提供器      │  │  │
│  │  │ 管理   │ │         │  │ (resources)    │  │  │
│  │  └────────┘ │         │  └────────────────┘  │  │
│  └──────────────┘         └──────────────────────┘  │
│                                                     │
│         传输层：stdio / HTTP+SSE / WebSocket         │
└─────────────────────────────────────────────────────┘
```

#### 核心概念

| 概念 | 角色 | 说明 |
|------|------|------|
| **MCP Client** | 消费方 | Agent 侧，发起工具发现和调用请求 |
| **MCP Server** | 提供方 | 工具/服务侧，注册并执行工具 |
| **Tools** | 能力 | Server 暴露的可调用函数 |
| **Resources** | 数据 | Server 提供的上下文数据（文件、数据库记录等） |
| **Prompts** | 模板 | Server 提供的提示模板 |

#### 通信流程

```
Agent (Client)                    MCP Server
    │                                 │
    │──── 1. initialize ─────────────>│  建立连接
    │<─── 1a. capabilities ──────────│  返回能力列表
    │                                 │
    │──── 2. tools/list ─────────────>│  发现可用工具
    │<─── 2a. tool definitions ──────│  返回工具定义
    │                                 │
    │──── 3. tools/call ─────────────>│  调用具体工具
    │     {name, arguments}           │
    │<─── 3a. result ────────────────│  返回执行结果
    │     {content}                   │
    │                                 │
    │──── 4. tools/call ─────────────>│  可以多次调用
    │<─── 4a. result ────────────────│
    │                                 │
```

---

### 三、OpenClaw 中的 MCP 集成

OpenClaw 是目前**最大的 MCP 兼容平台**。在 OpenClaw 的生态中：

**每一个 ClawHub Skill 就是一个 MCP Server。**

```
┌─────────────────────────────────────────────┐
│              OpenClaw Agent                  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         MCP Client（内置）           │    │
│  │                                     │    │
│  │  自动连接所有已安装的 Skills         │    │
│  └──────┬──────────┬──────────┬────────┘    │
│         │          │          │              │
│    ┌────▼───┐ ┌────▼───┐ ┌───▼────┐        │
│    │ Skill  │ │ Skill  │ │ Skill  │        │
│    │  A     │ │  B     │ │  C     │  ...   │
│    │(MCP    │ │(MCP    │ │(MCP    │        │
│    │Server) │ │Server) │ │Server) │        │
│    └────────┘ └────────┘ └────────┘        │
│                                             │
│    ClawHub 5700+ Skills = 5700+ MCP Servers │
└─────────────────────────────────────────────┘
```

当你执行 `/skills install @author/skill-name` 时，实际上是：
1. 从 ClawHub 下载 Skill 包
2. 注册为一个 MCP Server
3. Agent 的 MCP Client 自动发现并连接该 Server
4. Server 暴露的 Tools 自动变成 Agent 可用的工具

---

### 四、MCP 工具定义的格式和规范

#### 标准 MCP 工具定义

```json
{
  "name": "web_search",
  "description": "Search the web for real-time information about any topic. Returns summarized results and relevant URLs.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The search query to look up"
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum number of results to return",
        "default": 5
      },
      "language": {
        "type": "string",
        "description": "Preferred language for results (ISO 639-1 code)",
        "default": "en"
      }
    },
    "required": ["query"]
  }
}
```

#### 定义规范要点

```
MCP 工具定义的三要素：
┌──────────────────────────────────────────┐
│                                          │
│  1. name        工具唯一标识符            │
│     └── 小写，下划线分隔，语义明确        │
│                                          │
│  2. description 自然语言描述              │
│     └── 告诉 Agent 何时、为何使用此工具   │
│     └── 这是 Agent 决策的关键依据！       │
│                                          │
│  3. inputSchema JSON Schema 参数定义      │
│     └── 类型、描述、默认值、必填项        │
│     └── Agent 据此自动构造调用参数        │
│                                          │
└──────────────────────────────────────────┘
```

> **面试考点**：`description` 字段为什么如此重要？
> Agent 在决定使用哪个工具时，主要依据就是 `description`。一个模糊的描述会导致 Agent 误用工具或完全忽略它。好的 description 应该回答三个问题：
> 1. 这个工具**做什么**？
> 2. **什么时候**应该使用它？
> 3. 调用后会**返回什么**？

---

### 五、MCP vs 直接 API 调用

| 对比维度 | MCP 协议 | 直接 API 调用 |
|----------|----------|--------------|
| **集成成本** | 低 —— 统一协议 | 高 —— 每个API都不同 |
| **工具发现** | 自动 —— `tools/list` | 手动 —— 查文档写代码 |
| **参数校验** | 内置 —— JSON Schema | 自行实现 |
| **生态复用** | 强 —— ClawHub共享 | 弱 —— 各自实现 |
| **灵活性** | 受协议约束 | 完全自由 |
| **性能** | 有协议开销 | 直接调用更快 |
| **错误处理** | 标准化错误格式 | 各API自定义 |
| **安全模型** | 协议层权限控制 | 各自实现 |

#### 什么时候该用 MCP？

```
应该用 MCP：                    可以直接 API：
─────────────                  ──────────────
✓ 需要 Agent 动态使用          ✗ 固定的后端调用
✓ 希望社区能复用               ✗ 内部系统专用
✓ 需要多个 Agent 共享          ✗ 单一应用使用
✓ 工具可能被替换               ✗ 紧耦合不可替换
```

---

### 六、实例：web-search Skill 的 MCP 实现

以 `@anthropic/web-search` Skill 为例，看看一个完整的 MCP 工具链路：

#### 1. SKILL.md（提示层）

```markdown
## Web Search Skill

When the user asks a question that requires up-to-date information,
use the `web_search` tool to find relevant results.

### Guidelines
- Prefer specific, detailed search queries over vague ones
- Always cite sources with URLs in your response
- If first search doesn't find relevant results, refine and retry
- Maximum 3 search attempts per user query
```

#### 2. MCP Server 定义（协议层）

```json
{
  "name": "@anthropic/web-search",
  "version": "2.1.0",
  "tools": [
    {
      "name": "web_search",
      "description": "Search the web for real-time information",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "max_results": { "type": "integer", "default": 5 }
        },
        "required": ["query"]
      }
    }
  ]
}
```

#### 3. 调用链路

```
用户: "今天北京天气怎么样?"
         │
         ▼
┌─────────────────────┐
│ Agent 阅读 SKILL.md │  → 知道遇到时事问题要用 web_search
│ 决定使用 web_search  │
└─────────┬───────────┘
          │
          ▼  MCP tools/call
┌─────────────────────┐
│ MCP Server 执行搜索  │  → web_search({query: "北京今天天气"})
│ 返回搜索结果         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Agent 整理结果       │  → 根据 SKILL.md 的指令，引用来源
│ 回复用户             │
└─────────────────────┘
```

> **面试考点**：如果同时安装了两个都提供 web_search 的 Skill 会怎样？
> 这涉及**工具冲突解决**问题：
> - OpenClaw 使用**优先级机制**：后安装的覆盖先安装的
> - 也可以在配置中显式指定优先级
> - Agent 在工具列表中只会看到最终生效的那一个
> - 类似编程中的"名称遮蔽（name shadowing）"

---

### 七、MCP 的生态和未来发展

#### 当前生态

```
MCP 兼容平台：
├── OpenClaw     ── 最大的 MCP 平台，5700+ Skills
├── Claude       ── Anthropic 官方 AI 助手
├── Cursor       ── AI 编程 IDE
├── Windsurf     ── AI 编程工具
├── VS Code      ── 通过 Copilot 扩展
└── 更多平台持续接入中...
```

#### 发展趋势

1. **协议标准化**：MCP 正在成为 AI Agent 工具调用的事实标准
2. **Server 生态爆发**：越来越多服务商提供 MCP Server
3. **多模态支持**：从文本扩展到图像、音频、视频
4. **安全增强**：更细粒度的权限控制和审计
5. **性能优化**：流式传输、批量调用、缓存策略

> **面试考点**：MCP 的主要挑战是什么？
> 1. **协议版本兼容**：如何平滑升级而不破坏现有生态
> 2. **性能开销**：序列化/反序列化的额外成本
> 3. **安全信任**：如何验证第三方 MCP Server 的安全性
> 4. **标准博弈**：与其他类似协议（如 OpenAI 的 function calling）的竞争

---

### 本课小结

```
┌──────────────────────────────────────────────┐
│              核心知识点回顾                    │
├──────────────────────────────────────────────┤
│                                              │
│  MCP = Model Context Protocol                │
│      = AI Agent 的 "USB 接口"                │
│                                              │
│  架构 = Client (Agent) ←→ Server (工具)       │
│  传输 = stdio / HTTP+SSE / WebSocket         │
│                                              │
│  在 OpenClaw 中：                             │
│    每个 ClawHub Skill = 一个 MCP Server       │
│    安装 Skill = 连接新的 MCP Server           │
│    5700+ Skills = 5700+ MCP Servers          │
│                                              │
│  工具定义 = name + description + inputSchema  │
│  description 是 Agent 决策的关键依据          │
│                                              │
└──────────────────────────────────────────────┘
```

---

### 课后练习

#### 练习1：协议理解
画出一个完整的 MCP 调用时序图，从用户发送消息开始，到最终收到回复为止。标注每一步涉及的协议操作（initialize、tools/list、tools/call 等）。

#### 练习2：工具定义编写
为一个"翻译服务"编写 MCP 工具定义（JSON 格式），要求：
- 支持源语言和目标语言参数
- 支持批量翻译（文本数组）
- 包含清晰的 description
- 定义合理的默认值和必填项

#### 练习3：对比分析
一家公司有50个内部 API 服务，正在考虑是否将它们全部封装为 MCP Server。请从**成本、收益、风险**三个维度分析，给出你的建议。在什么条件下应该迁移，什么条件下应该保持现状？

---

>
