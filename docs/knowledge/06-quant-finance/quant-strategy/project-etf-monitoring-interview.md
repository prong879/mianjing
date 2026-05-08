---
title: "项目复盘：行业 ETF 成分股监控 — 面试知识提炼"
outline: deep
---

> 对应仓库：**行业 ETF 成分股行情智能监控系统**（Python 本地流水线 + LangGraph 编排 + 双 LLM Agent）。  
> 本文按**技术栈速览（一）→ 技术栈原理（二）→ 模块面试要点（三）→ 追问与清单（四～六）**整理，便于与通用笔记对照复习。

## 一、技术栈速览（面试可先说这张表）

| 层级 | 选型 | 你在项目里具体做了什么 |
|------|------|------------------------|
| 语言与环境 | Python 3.10+ | 端到端脚本、类型注解（如 `TypedDict` 状态）、配置驱动 |
| 数据获取 | akshare | ETF 池、成分、行情/指数；**重试+指数退避+请求间休眠**；全市场快照**单次缓存**降请求量 |
| 数据处理 | pandas、numpy | 按 `(etf_code, stock_code)` 分组滚动特征；截面合并去重 |
| 异常检测 | scikit-learn `IsolationForest` | 截面拟合 + `contamination`；与加权 `local_score` 并存 |
| 特征 | 自研 `FeatureEngine` | 收益 Z-score、量比、超额收益、波动率 Z-score；注意 `shift` 减轻前视 |
| 编排 | LangGraph `StateGraph` | 多节点状态传递；**导入失败则顺序 `fallback`** |
| LLM | aiohttp + OpenAI 兼容 API | Explain / Debate 两阶段；无 Key 时结构化降级 |
| 存储 | PyArrow Parquet + SQLite | 分区快照、去重键；Checkpoint 断点与增量重跑 |
| 调度与工程 | APScheduler、PyYAML、python-dotenv | Cron；限流/重试/退避；Docker 可选 |

**一句话项目叙事（30 秒）：**  
在成分股 `(ETF, 股票)` 粒度上做滚动特征与本地打分，**信号与告警等级完全本地裁决**；大模型只在 ETF 聚合维度做解释与「反方复核」，并可通过 LangGraph 编排成可控工作流，同时兼顾无依赖降级与离线存储。

---

## 二、技术栈原理与项目用法（面试讲解版）

下面按「**是什么 → 为何适合本项目 → 结合代码怎么说**」组织，便于你对外行 HR 能讲清价值、对工程师能接住深挖。

### 2.1 Parquet 与 PyArrow

**是什么**  
Parquet 是 **Apache 列式存储** 格式，文件里按列编码与压缩；Python 生态里常用 **PyArrow** 作为读写引擎（`pandas.read_parquet` / `to_parquet` 底层常走 Arrow）。

**为何常用在数仓 / 离线分析**  
- **按列读**：特征工程往往只用到部分列，列式格式可减少 IO（大数据场景下配合谓词下推更明显）。  
- **压缩比高**：同类数值在一列，压缩效果好于宽 CSV。  
- **带 schema**：列类型明确，利于长期演进与校验。

**在本项目中**（`ParquetStore`）  
- 路径采用类 Hive 分区：`market/year_month=YYYY-MM/snapshot.parquet`，**把同一自然月的行情落在单文件**，减轻「一日一小文件」的目录爆炸。  
- **写入**：同日/同月多次写入会先读旧表 `concat` 再 `drop_duplicates(trade_date, etf_code, stock_code, keep="last")`，等价于 **幂等追加**。  
- **读取单日**：读当月文件后按 `trade_date` 过滤；读近 60 日则枚举分区目录纵向拼接再截断。

**易追问**  
- **和 CSV 比？** 体量、类型、压缩、列裁剪；调试期 CSV 更直观，生产落地 Parquet 更常见。  
- **分区键为何用年月而不是日？** 控制小文件数量与 listing 成本；代价是读单日也要读整月文件，数据量极大时可再细分策略。

---

### 2.2 SQLite

**是什么**  
嵌入式关系库，单文件、无独立服务进程，支持 SQL 事务与索引。

**在本项目中**  
- 存 **运行时 Checkpoint**（`run_id`、阶段 `stage`、成功/失败、错误信息等），偏**任务元数据**，不是主行情事实表。  
- 适合单机脚本：**零运维**、随仓库走；若多机写入同一库则不适合（锁与并发上限明显）。

**易追问**  
- **和 PostgreSQL？** 多用户并发、网络服务、复杂查询选 PG；本地工具型状态机 SQLite 足够。  
- **WAL 模式？** 可提一句「高并发读写可调 journal_mode」，本项目写入频率通常不高。

---

### 2.3 pandas 与 numpy

**是什么**  
`numpy` 提供连续内存上的向量化数值运算；`pandas` 在之上提供 **带索引的表（DataFrame）**、对齐、分组、时间序列与 IO 胶合。

**在本项目中**  
- 特征：`groupby(["etf_code","stock_code"])` + `rolling` 做 Z-score、均量等。  
- 流水线：多处 `merge`、去重、`concat` 分区结果。

**易追问**  
- **性能瓶颈？** 大表应避免 Python 层逐行；能用向量化就用向量化；超大规模可过渡到 Polars/DuckDB/Spark（按数据量答）。

---

### 2.4 scikit-learn（IsolationForest）

**是什么**  
经典机器学习库；本仓库用到 **`IsolationForest`** 做无监督异常检测。

**要点**  
- 通过随机切分把**孤立点**更快分离；`fit_predict` 返回 `1`/`-1`；`contamination` 为先验异常比例。  
- 与加权 `local_score` 并存：**森林给「多维离群标签」**，**加权分给可解释、可配阈值的分数**。

（与业务结合的追问仍见下文 **三 · 2**。）

---

### 2.5 并发模型：采集侧「慢而稳」vs LLM 侧「异步限流」

**先分清两条链路**

| 链路 | 同步/异步 | 并发手段 | 原因 |
|------|-----------|----------|------|
| **akshare 行情采集** | 以 **同步** 为主 | 顺序请求 + `time.sleep`、重试退避 | 第三方接口偏同步封装；核心是 **降低 QPS、避免封禁**，不是抢满带宽 |
| **Explain / Debate 调 LLM** | **asyncio + aiohttp** | `Semaphore(N)` + `gather` | 典型 **I/O 等待**（网络 RTT），异步用少量线程撑住大量挂起请求更划算 |

**LLM 侧实现要点（口述用）**  
- 每张「可疑 ETF」一个异步任务，`asyncio.gather` 聚合结果。  
- `async with Semaphore(self.concurrency)` 包裹真正的 `session.post`：**全时刻最多 N 个在飞**，其余协程排队 —— 既是保护对方 API 配额，也稳定本机文件描述符。  
- 共用一个 `aiohttp.ClientSession`：**TCP 连接复用**，减少握手开销。  
- 同步方法里 `asyncio.run(...)`：在**嵌套事件循环环境**（如部分 Notebook）可能踩坑，脚本入口则常见。

**易追问**  
- **为什么采集不用多线程池狂并发？** 容易触发源站**频控/封 IP**；项目策略是「可重试 + 节流 + 本地缓存」而非抢跑。  
- **Semaphore 和 Lock？** Lock 互斥一进一出；Semaphore 允许 **最多 N 个**同时进入临界区，适合限并发 HTTP。  
- **GIL？** `sklearn`/`pandas` 数值密集仍在单进程内受 GIL 影响；本项目的 CPU 段相对一批 HTTP 等待通常不是第一瓶颈，但若特征极大可考虑 `polars` 或进程池，需结合 profiling。

---

### 2.6 LangGraph

**一句话**  
有状态的 **有向图编排**：节点更新共享 state，边表示执行顺序；适合「Agent / 流水线步骤清晰、未来可扩分支」的场景。

**在本项目中**  
`local → merge → validate → explain → debate → judge`；导入失败则顺序 `fallback`。细节见 **三 · 4.5**。

---

### 2.7 aiohttp

**是什么**  
异步 HTTP 客户端/服务端库；配合 `async/await` 非阻塞收发。

**在本项目中**  
调用 OpenAI 兼容 `chat/completions`；`timeout=` 防止永久挂死；`response_format`（若服务端支持）约束 JSON。

---

### 2.8 APScheduler、PyYAML、python-dotenv、Docker

- **APScheduler**：进程内 **Cron 风格定时**，适合单机守护；分布式调度再上专用编排。  
- **PyYAML**：`etf_pool`、`thresholds`、`rate_limit` 等与代码解耦。  
- **python-dotenv**：本地密钥不入库（`.env`）。  
- **Docker**：镜像与 `docker-compose` 把运行环境固化，挂载 `data/`、`output/` 与本地一致。

---

### 2.9 akshare

**是什么**  
封装多家**公开财经接口**的 Python 工具，本项目主要经其访问东财等源。

**在本项目中**  
成分、现货快照、个股日线、指数序列等；具体防频控见 **三 · 7**。

---

## 三、按模块准备的面试知识（对应站内延伸阅读）

### 1. pandas / 量化数据处理

> **原理层**：见 **二 · 2.3**；本节侧重面试话术与业务坑点。

**必会点**

- **分组键为什么是 `(etf_code, stock_code)`？** 同一标的可出现在多只 ETF 成分里，混在一起分组会把不同「所属篮子」的序列拧成一条，Z-score/均量会错。
- **滚动窗口与「前视偏差」**：量比等用过去窗口均值时，当日是否参与分母要想清楚（常见做法是对均值用 `shift(1)`，避免无意用未来信息）。
- **截面合并**：`merge` 后对 `(etf_code, stock_code)` `drop_duplicates`，防止重复键导致分数串台。
- **与 SQL 思维对照**：分组聚合 ≈ `GROUP BY` + 窗口函数；去重键 ≈ 明细表主键设计。

**延伸阅读**：[编程与数据处理（量化）](/knowledge/06-quant-finance/quant-strategy/programming-and-data)、[Python 数据处理总览](/knowledge/02-python-data/python-core/overview)。

---

### 2. 异常检测：孤立森林 + 加权分

> **原理层**：`IsolationForest` 与加权分分工见 **二 · 2.4**。

**必会点**

- **IsolationForest 在截面上的含义**：对**当日（或当前批次）所有成分股行**拟合一棵森林，识别多维特征下的离群点；`contamination` 表示预期异常比例先验，调大会更「宽进」。
- **与 `local_score` 的关系**：森林给的是无监督标签/离群倾向；加权分是可解释的规则组合（各特征权重来自配置），利于**阈值裁决**与业务方对齐。
- **常见追问**：为什么不用监督分类？（缺稳定标签、概念漂移、冷启动；无监督 + 规则更可控。）

**延伸阅读**：[机器学习（量化）](/knowledge/06-quant-finance/quant-strategy/machine-learning)、[机器学习基础（通用）](/knowledge/05-ai-ml/machine-learning/overview)。

---

### 3. 数据存储：Parquet + SQLite

> **原理层**：Parquet/SQLite 逐项讲解见 **二 · 2.1、二 · 2.2**。

**必会点**

- **Parquet**：列式、压缩好、与 pandas/pyarrow 生态一致；**按 `year_month` 等分区**利于按时间范围裁剪 IO。
- **去重策略**：按 `(trade_date, etf_code, stock_code)` 保留最新，等价于「慢变或重复拉取下的幂等」。
- **SQLite Checkpoint**：任务断点、失败重跑状态；与「数据湖/仓」里的 **job metadata** 同一类问题。

**延伸阅读**：[数据仓库与数据产品](/knowledge/01-data-infrastructure/data-warehouse/overview)。

---

### 4. 工程化：重试、限流、调度、降级

**必会点**

- **指数退避 + jitter**：避免惊群与重试风暴（retry storm）。
- **APScheduler**：单机定时；若面试问分布式调度可对比 Airflow / cron on k8s（本项目是轻量场景）。
- **LangGraph 不可用时的 `fallback`**：用同样业务顺序的函数调用保证**行为等价**，体现防御性工程。

---

### 4.5 LangGraph 面试高频（易问清单，结合本项目）

**定位和 LangChain 的关系（常考）**

- **LangGraph** 强调**有状态、有环路的图**：节点是函数，边是控制流；适合「多步流水线 + 每步读写同一块 state」的 Agent / 工作流。
- **LangChain Expression Language（LCEL）** 更偏**链式、DAG 式**组合 runnable；简单线性链不必上图。
- **面试话术**：本项目是**固定顺序的 DAG**（无环），用 `StateGraph` 主要是为了**节点边界清晰、和 LangChain 生态一致、后续加条件分支或人机中断时不用推翻重写**。

**核心对象（背名字 + 职责）**

- **`StateGraph(StateSchema)`**：图容器；`StateSchema` 多为 `TypedDict`，描述每一步之间传递的状态结构。
- **`add_node(name, fn)`**：节点函数签名一般是「整包 state 进 → 返回**部分更新** dict」；运行时会把返回值**合并**进当前 state（默认对同 key 多为后者覆盖，具体以版本/是否配置 reducer 为准——面试可说「我们依赖返回片段更新，避免手写全局 mutable 传递」）。
- **`add_edge(a, b)`**：有向边；**`START` / `END`** 是虚拟起点/终点。
- **`compile()`**：得到可执行对象（可 `invoke` / `ainvoke` / `stream` 等，与 LangChain Runnable 习惯一致）。
- **`invoke(initial_state)`**：同步跑完一整趟图，适合批处理/脚本（本项目单次 `feature_df` 研判）。

**状态设计（结合 `PipelineState`）**

- **`TypedDict` + `NotRequired`**：`raw_data` 必填；`local_data` / `data` 在中间步骤才出现，用 `NotRequired` 表意准确。
- **为什么要单独 `merge` 节点？** LangGraph 路径里检测产出在 `local_data`，业务主表在 `raw_data`；`merge` 把 `local_score` 等列**左连接**回全表，和 fallback 路径里「检测直接在整张表上增列」在**语义上对齐**，避免重复逻辑漂移。
- **追问：节点返回 `{"data": df}` 会不会丢别的键？** 只提交片段更新；未被提到的 key 保留上一轮 state（需能说清「这是我们依赖的合并语义」）。

**条件边、循环与人机协同（扩展题）**

- **`add_conditional_edges`**：根据 state 或节点返回值走不同分支（例如：校验失败直接 END、跳过大模型省钱）。
- **环（loop）**：LangGraph 相对「纯 DAG 编排器」的优势之一，适合做 **ReAct / 反思重试**；本项目当前无环，可答「若要在 Debate 不通过时打回重取特征，可以加分支或子图」。
- **`interrupt_before` / `interrupt_after` + checkpointer**：人在关键节点前暂停、恢复执行——偏**合规审核、高敏工单**；可对比：你项目里 SQLite checkpoint 是**采集/报告任务级**，不是 LangGraph 自带的 thread checkpoint。

**持久化与检查点（高频对比题）**

- **LangGraph Checkpointer**（如 memory / SQLite）：按 **thread_id** 存**图执行轨迹**，支持多轮对话式 Agent、从中断点恢复。
- **本仓库 SQLite**：管的是**业务流水线断点**（拉数、落盘进度等），两者**层次不同**；面试时分开说不会混淆。

**调试与观测**

- **每个节点单一职责**：日志/`print` 可挂在节点边界，比「一千行顺序脚本」好定位。
- **`stream` / `stream_events`**（若用过）：适合看中间 state、做 UI 进度条；没用过可说「invoke 足够，线上再视需要加流式」。

**和备选方案对比（简答）**

| 方案 | 适用 |
|------|------|
| 纯函数顺序调用 | 步骤少、无分支、团队不熟图框架时最省事（你项目的 `_fallback`） |
| `StateGraph` | 步骤多、要讲清楚边界、未来要加分支/持久化/人机 |
| Airflow / Prefect | 日批、依赖外部任务队列、跨机器，而不是单进程内 DataFrame 管道 |
| Temporal | 长事务、跨服务可恢复工作流，复杂度和运维成本更高 |

**延伸阅读**：[AI Agent 框架生态](/knowledge/05-ai-ml/ai-agent/frameworks)、[Agent 架构](/knowledge/05-ai-ml/ai-agent/agent-architecture)。

---

### 5. LLM 与 Agent 编排（偏 AI 工程岗）

> **并发与 HTTP**：`asyncio` / `Semaphore` / `aiohttp` 见 **二 · 2.5、二 · 2.7**。

**必会点**

- **为何 LLM 不参与逐行判定？** 成本高、延迟大、难审计；金融场景需要**可复现、可配置阈值**的本地裁决。
- **Explain + Debate 双节点**：解释负责可读叙事；复核负责**挑错、证据缺口、过度推断**——接近「critic / 第二意见」而不是再训练一个判别器。
- **Structured JSON 输出**：便于下游写报告与监控字段；要准备「解析失败、schema 不守约」时的降级文案。
- **StateGraph**：状态 `TypedDict` 在各节点间传递；多节点 = **显式工作流**，优于让模型自由多步 tool（本项目以本地节点为主）。更细的 LangGraph 考点见**三 · 4.5**。

**延伸阅读**：[Agent 架构](/knowledge/05-ai-ml/ai-agent/agent-architecture)、[工程基础](/knowledge/05-ai-ml/ai-agent/engineering-basics)、[Prompt 与上下文](/knowledge/05-ai-ml/ai-agent/prompt-engineering)、[框架生态](/knowledge/05-ai-ml/ai-agent/frameworks)。

---

### 6. 数据源与业务语境（akshare / ETF）

**必会点**

- **行业 ETF 监控与宽基的区别**：行业主题对产业链情绪更敏感，异常解读更聚焦板块逻辑。
- **数据源风险**：免费接口不稳定、字段变更、限流；工程上要有重试、缓存与本地落地。
- **沪深300 超额**：基准收益构造与对齐交易日；缺失指数序列时的处理策略（可简述你代码里的 defensive 逻辑）。

**延伸阅读**：[金融与衍生品基础](/knowledge/06-quant-finance/quant-basics/finance-and-derivatives)。

---

### 7. 反爬、频控与稳定性（数据源侧面试常问）

**先说结论**：公开财经接口常见限制是 **QPS、并发、异常 IP、临时 429/5xx**，工程上不靠「硬刚」而靠 **少请求、慢节奏、可重试、可恢复**。本仓库通过 akshare 访问东方财富等渠道，代码里是**守规矩的采集节奏**，不是绕过验证码或破解前端混淆。

**本项目中已落地的手段（可对照 `MarketCollector` / `runtime` / `configs/rate_limit.yaml`）**

| 手段 | 作用 | 在你仓库中的体现 |
|------|------|------------------|
| **指数退避 + 抖动** | 失败重试时拉大间隔，多客户端不同时暴增重试 | `_execute_with_retry`：`backoff_base * 2^i + random * jitter`；逐股历史拉取内层循环同样逻辑 |
| **成功后的主动休眠** | 降低匀速 QPS，减少被频控、封 IP 的概率 | 每只股票日线拉取成功后 `sleep(backoff_base * 0.5)`，注释写明防范东财接口频控 |
| **ETF 级间隔** | 批量任务不在短时间打满同一源站 | 历史补齐、指数拉取后 `runtime` 里对单只 `sleep(backoff_base_sec)` |
| **全市场快照缓存** | 同一天内多次历史/映射只请求一次 spot | `_cached_spot` / `_spot_name_map()`，少打全市场接口 |
| **本地 Parquet + 缺数再拉** | 已有分区则跳过网络，冷启动后才密集请求 | `run_once` 中检测历史是否够窗、当日快照是否已齐 |
| **SQLite 断点** | 单 ETF 失败可记录，便于排查与增量重跑 | `CheckpointRecord` 等，偏**可运维**而非绕过反爬 |

**配置文件里的「预案」与实现边界（面试 honesty）**

- `rate_limit.yaml` 中还写了 **`max_rps_global`、`max_concurrency`、`batch_size_*`、`circuit_breaker`、`cache.ttl_sec`** 等，表达的是**限流、熔断、缓存**的设计方向；当前 `MonitorRuntime` 注入采集器的 **`FetchConfig` 主要消费 `retry` 块**（次数与退避参数），其余项可作为「若接入统一限流器/熔断器可继续扩展」的谈资。
- `retry_on` 列举 `timeout` / `429` / `5xx` 是**语义化配置**；采集封装里对异常是**统一捕获重试**（未在中间层解析 HTTP 状态码时再分支）。面试可答：**生产上会按状态码细分**（例如 429 尊重 `Retry-After`、4xx 业务错不重试）。

**通用知识体系（面试官扩展时常考）**

- **频控类型**：令牌桶 / 漏桶；全局 RPS vs 每主机并发；**jitter** 避免雪崩重试。
- **HTTP 层**：`429` Too Many Requests、`503` + `Retry-After`；超时与连接池；**幂等**（同一自然日数据重复拉取可去重落盘）。
- **「反爬」与合规**：验证码、设备指纹、JS 挑战——正规项目优先考虑 **授权数据、付费 API、交易所/资讯商接口**，或把抓取强度控制在对方可接受范围；回答时强调 **ToS、robots、版权与合规**。
- **降级**：源站不可用时的日历降级（你项目里交易日历失败用自然日/BDay）、拉取失败跳过单票/单 ETF 并打日志，避免整批任务静默失败。
- **与 LLM 侧区分**：Explain/Debate 使用 **`asyncio.Semaphore` + `timeout`**，限制的是 **推理 API 并发**，与 akshare 数据源限流是两条线，面试分开说更专业。

**延伸阅读**：[编程与数据处理](/knowledge/06-quant-finance/quant-strategy/programming-and-data)（工程习惯）、[工程基础（Agent）](/knowledge/05-ai-ml/ai-agent/engineering-basics)（超时、重试、熔断的一般讨论）。

---

## 四、高频追问与参考答案要点

1. **「你们的 anomaly 算 alpha 吗？」**  
   更偏**风险监控/异动检测**，不是严格意义的多空 alpha；若延展可讨论标签构造与回测评估的差异。

2. **「如何避免未来函数？」**  
   特征只用截至当日的历史窗；关键聚合对当日敏感处用 `shift`；严格训练/回测时还要对齐公告日、复权等（可按岗位深度展开）。

3. **「孤立森林假设数据分布 i.i.d.，股价不平稳怎么办？」**  
   承认假设；实务上靠**短窗滚动、截面内相对比较、与规则分结合、定期重配**；更重线上稳定性时可换更稳健的稳健统计或分位数方法。

4. **「为什么用 LangGraph 而不是 Airflow？」**  
   单机异步步骤少、状态在内存 DataFrame；图编排主要解决**可读性与节点边界**；数据量级变大再演进到工作流平台。

5. **「LLM 输出错了怎么办？」**  
   不影响 `final_alert`（由本地规则决定）；复核节点降低误导信度；产物中保留结构化字段便于人工 spot-check。

6. **`invoke` 和 `stream` 区别？什么场景用异步 `ainvoke`？**  
   `invoke` 一次跑完返回终态；`stream` 按图事件/节点逐步吐出，适合长链路可观测或前端展示。`ainvoke` 适合节点内有 I/O（如 LLM HTTP）且希望非阻塞并发时（本项目 Explain/Debate 若在库侧已异步，可再评估是否升级到 `ainvoke`）。

7. **「LangGraph 的 checkpoint 和你们 SQLite 是不是一回事？」**  
   不是。前者存**图执行状态/thread**，服务对话式多轮；后者存**业务任务断点**（采数、写报告等）。

8. **「节点返回的部分更新如何合并进 state？」**  
   答「返回 dict 里只包含要改的 key；其余 key 沿用上一轮」；若追问 reducer，补一句「列表类字段可配 reducer 做 append，我们主要是覆盖式更新 DataFrame 引用」。

9. **「怎么应对数据源限流、封 IP、反爬？」**  
   分层答：**减请求**（缓存全市场快照、本地已有则不再拉）、**控节奏**（成功/失败都 sleep + 指数退避 + jitter）、**可恢复**（断点、单票失败跳过）；**合规上**优先用授权数据，不把绕过验证码当简历亮点。结合本项目可具体说 `MarketCollector` 的休眠与重试、`Parquet` 跳过已齐数据。

10. **「为何行情落 Parquet 而不是直接放数据库？」**  
   答 **离线分析/批量特征** 友好、列存压缩、与 pandas 一体；若要高并发点查、强事务多用户再叠加 OLTP（或湖仓分层）。结合本项目：按月分区单文件、主键去重幂等写。

---

## 五、建议你做的「口头演示路径」

1. 画流水线：**采集 → Parquet/SQLite → 特征 → local+IF → validate → LLM×2 → judge → 产物**。  
2. 强调 **单一职责**：`MonitorRuntime` 调度 vs `FeatureEngine` vs `MonitoringPipeline`。  
3. 举一个 **具体特征**（如 `ret_1d_zscore`）说明窗口与分组。  
4. 用 **配置**（阈值、权重、`contamination`）说明可运营、无需改代码调参。  
5. 点一句采集：**反爬/频控**靠缓存、休眠、退避与本地落盘少打源站（见**三 · 7**）。

熟记以上五步，基本可以覆盖「项目介绍 + 深挖」10～20 分钟；技术栈深挖可展开 **二、技术栈原理**。
---

## 六、自荐复习清单（考前勾选）

- [ ] **二、技术栈原理**：能口头说明 Parquet 列式与分区、`asyncio.Semaphore` 限并发、采集同步节流 vs LLM 异步  
- [ ] pandas：`groupby` + `rolling` + `merge` 去重键能脱口讲  
- [ ] IsolationForest：`fit_predict`、`-1` 含义、`contamination`  
- [ ] Parquet 分区与去重主键设计的 trade-off  
- [ ] SQLite checkpoint 场景与失败重跑  
- [ ] LangGraph：`StateGraph`、`add_node`/`add_edge`、`START`/`END`、`compile`/`invoke`、状态**部分更新**合并语义  
- [ ] LangGraph 扩展：`add_conditional_edges`、checkpointer 与业务 SQLite 的区别、`stream` vs `invoke`  
- [ ] 能口头对比：LangGraph vs 纯顺序代码 vs Airflow  
- [ ] LLM：为何聚合到 ETF、JSON 契约、降级策略  
- [ ] 数据源频控：指数退避、抖动、请求间 sleep、快照缓存、本地命中跳过、429/ Retry-After（能说清「本项目做到哪一步、生产可怎样加强」）  
- [ ] 反爬与合规：能区分技术限流 vs 商业授权，不吹灰色手段  


*维护说明：若项目实现变更（流水线顺序、存储 schema、采集限流实现与 `rate_limit.yaml` 对齐情况），请同步更新「一、技术栈表」「二、技术栈原理」「三 · 7 反爬频控」与相关追问答案。*

