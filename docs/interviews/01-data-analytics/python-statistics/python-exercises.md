---
title: 三、Python 与数据处理习题
date: 2026-04-26 18:12:01
description: Python 与数据处理面试习题：工具栈与学习路径、pandas 清洗与分析、编码小题及可视化协作场景等，附参考答法。
outline: deep
---
> 维护说明：请直接在 docs/ 目录维护本页内容。

### 三、Python 与数据处理习题

- **你最近在学习什么数据分析工具或算法？**

> **参考回答**：
>
> 最近我主要在补三类能力：
>
> 1. **数据处理与分析效率工具**：例如 `pandas`、`plotly`、`jupyter`、`Cursor` 这类工具，重点是提升数据清洗、分析和可视化表达效率。
> 2. **SQL 与数仓分析能力**：包括窗口函数、留存分析、漏斗分析、指标拆解等，更贴近真实业务分析场景。
> 3. **基础算法与建模方法**：如逻辑回归、树模型、聚类、A/B 测试分析方法，重点不是堆模型，而是理解什么时候该用什么方法。
>
> 如果想让回答更像“真实在持续学习”，可以补一句：
>
> 我最近会刻意把工具学习和业务场景结合起来，比如先用 SQL 拉数，再用 Python 做清洗和可视化，最后再尝试把分析过程沉淀成可复用脚本。

- **会用 Python 哪些库做电商分析？可以举例子吗？**

> **参考回答**：
>
> 我会按分析流程来回答，而不是只罗列库名。
>
> 常用库包括：
> - `pandas`：订单数据清洗、去重、缺失值处理、分组聚合
> - `numpy`：数值计算、分位数、异常值处理
> - `matplotlib` / `seaborn`：销售趋势、品类对比、转化漏斗可视化
> - `sklearn`：用户聚类、特征标准化、模型训练和评估
> - `scipy`：统计检验、相关性分析
> **举例**：
>
> 如果做电商用户分层，我会先用 `pandas` 聚合用户近 `30` 天的购买次数、消费金额、最近一次购买时间、浏览和加购次数，再用 `sklearn` 做标准化和 `KMeans` 聚类，把用户分成高价值用户、价格敏感用户、低活跃用户等群体。最后结合每类用户的复购率和客单价，给运营策略建议。
>
> 如果做订单分析，可以用 `pandas`：
> - 清洗取消订单、退款订单
> - 按日期、品类、渠道聚合 `GMV`
> - 计算客单价、转化率、复购率
> - 找出异常下降的品类或渠道
>
> Python 在电商分析里主要用于数据清洗、指标计算、可视化和用户分层，关键是要把工具和业务问题结合起来。

- **你通过什么渠道练习 SQL？**

> **参考回答**：
>
> 我练 SQL 主要用三种方式：
>
> 1. **题库平台**：比如 `LeetCode`、`牛客`、`SQLZoo`，适合练基础语法和窗口函数。
> 2. **业务化题目**：重点练留存、复购、漏斗、分组汇总、多表关联这类题，因为更接近数据分析岗位真实笔试。
> 3. **自己造数实操**：我会自己搭简单表结构，模拟用户行为表、订单表、商品表，再自己写查询，这样比单纯刷题更容易理解数据粒度和口径问题。

- **你是否掌握 JSON 解析？**

> **参考回答**：
>
> 掌握基础 JSON 解析。
> - 在 Python 里，我会用 `json.loads()` 把 JSON 字符串转成字典，或用 `json.load()` 直接读取文件。
> - 如果是嵌套 JSON，我会逐层取字段，或者配合 `pandas.json_normalize()` 拉平成表。
> - 如果是在 SQL 场景里，我也了解常见 JSON 提取函数，例如部分数据库里的 `json_extract()`、`get_json_object()` 之类的写法。
> **Python 示例**：
>
> ```Python
> import json
> 
> text = '{"user_id": 1001, "device": {"os": "ios", "version": "17.0"}}'
> data = json.loads(text)
> 
> user_id = data["user_id"]
> os_name = data["device"]["os"]
> 
> print(user_id, os_name)
> ```

- **如果问到自动化脚本、批量任务、命令行环境，应该怎么答？**

> **参考回答**：
>
> 可以回答自己有以下经验：
> - 用 Python 批量读取多份 `Excel/CSV`，统一清洗后输出汇总结果
> - 写定时脚本完成日报、周报或指标监控
> - 在 `WSL` 或命令行环境下跑脚本、管理文件、执行批处理任务
> - 把重复性分析步骤封装成函数，提高复用性和稳定性
>
> 重点不是把工具名堆满，而是让面试官感觉你能把分析工作流程化、自动化。

- **你会如何用 AI 提效？**

> **参考回答**：
>
> 1. **SQL 和 Python 初稿生成**
>    - 用 AI 快速搭查询框架、清洗脚本和可视化样例
> 2. **分析思路整理**
>    - 在做专题分析前，让 AI 帮我先列指标拆解框架和可能原因
> 3. **重复性文档工作**
>    - 帮助整理周报、复盘大纲、字段说明、需求文档初稿
> 4. **代码排错和重构**
>    - 辅助定位 bug、优化函数结构、提升代码可读性
> 5. **知识补充**
>    - 快速查某个函数、统计概念、SQL 写法或可视化方案
>
> 更稳的结尾是：
>
> 我把 AI 主要当成效率工具和思路辅助工具，用它提高初稿产出速度、减少重复劳动，但关键的业务口径、结论判断和结果校验，还是需要自己负责。
>
### 编程题：把 `2n` 拆成两个合数之和

**题目（携程笔试整理版）**：

给定一个正整数 `n`，请找到两个正整数 `x`、`y`，使得：

- `x + y = 2n`
- `x` 和 `y` 都是合数
- `x` 和 `y` 可以相等

如果不存在，输出 `-1`。

**核心思路**：

合数是大于 `1` 且不是质数的正整数，`0` 和 `1` 不是合数。

这题有一个很简单的构造：

- 如果 `n < 4`，则 `2n < 8`，无法拆成两个合数，输出 `-1`
- 如果 `n >= 4`，固定取 `x = 4`
- 另一个数 `y = 2n - 4 = 2(n - 2)`，当 `n >= 4` 时，`y >= 4` 且为偶数，所以一定是合数

**Python 写法**：

```python
t = int(input())

for _ in range(t):
    n = int(input())
    if n < 4:
        print(-1)
    else:
        print(4, 2 * n - 4)
```

**考点**：

- 不需要枚举和判质数
- 找到稳定构造即可
- 数据量大时，`O(1)` 处理每组数据

### 编程题：灯带翻转后相融度最大值

**题目（携程笔试整理版）**：

有一条由 `n` 个灯珠组成的灯带，每个灯珠状态为 `0` 或 `1`。相邻灯珠之间有焊点权重 `w_i`，对应第 `i` 个灯珠和第 `i + 1` 个灯珠之间的权重。

相融度定义为：所有相邻灯珠状态相同的焊点权重之和。

可以进行至多一次翻转操作：选择一个连续段 `[l, r]`，将该段内所有灯珠状态 `0` 和 `1` 互换。也可以不操作。求操作后相融度最大值。

**核心思路**：

先算原始相融度 `base`。

翻转一个连续段时，段内相邻灯珠会一起翻转，因此段内相对关系不变；真正受影响的只有边界：

- 左边界：`l - 1` 和 `l`
- 右边界：`r` 和 `r + 1`

对每条相邻边单独计算“如果它被翻转边界切到，能带来的收益”：

- 如果原来两端状态相同，原本贡献 `w_i`，切到后变成不同，收益为 `-w_i`
- 如果原来两端状态不同，原本不贡献，切到后变成相同，收益为 `+w_i`

然后问题就变成：选一个翻转段，最多会切到两条边界，取能带来的最大正收益。

**参考 Python 思路**：

```python
def max_harmony(s, w):
    n = len(s)
    base = 0
    delta = []

    for i in range(n - 1):
        if s[i] == s[i + 1]:
            base += w[i]
            delta.append(-w[i])
        else:
            delta.append(w[i])

    # 不翻转也是合法选择
    best_gain = 0

    # 翻转段贴着左端或右端时，只影响一条边界
    if delta:
        best_gain = max(best_gain, max(delta))

    # 翻转内部连续段时，会影响两条不同边界
    if len(delta) >= 2:
        first = second = float("-inf")
        for value in delta:
            if value > first:
                second = first
                first = value
            elif value > second:
                second = value
        best_gain = max(best_gain, first + second)

    return base + best_gain
```

**考点**：

- 翻转段内部贡献不变，只看边界变化
- 至多一次翻转可以选择“不翻”
- 本质是从边界收益里选 `0` 条、`1` 条或 `2` 条不同边界

如果面试或笔试里题目确认只能翻转一次且不能不翻，需要把 `best_gain` 初始值从 `0` 改为允许的最小收益。

- **Python 数据处理题：找出每个月换电次数排名前十的用户**

**题目**：

给定一张包含 `car_id`、`user_id`、`swap_order_time` 的数据表，请用 Python 找出每个月换电次数排名前十的用户。

**pandas 写法**：

```python
import pandas as pd

df["swap_order_time"] = pd.to_datetime(df["swap_order_time"])
df["month_id"] = df["swap_order_time"].dt.to_period("M").astype(str)

monthly_user = (
    df.groupby(["month_id", "user_id"])
      .size()
      .reset_index(name="swap_cnt")
)

monthly_user["rn"] = (
    monthly_user
    .sort_values(["month_id", "swap_cnt", "user_id"], ascending=[True, False, True])
    .groupby("month_id")
    .cumcount() + 1
)

top10 = (
    monthly_user[monthly_user["rn"] <= 10]
    .sort_values(["month_id", "rn"])
)
```

**口述关键函数**：

- `pd.to_datetime()`：把字符串时间转成日期时间类型
- `.dt.to_period("M")`：提取月份
- `groupby(["month_id", "user_id"]).size()`：统计每月每个用户换电次数
- `sort_values()`：按月份和换电次数排序
- `groupby("month_id").cumcount()`：生成每个月内部排名

如果面试官追问并列排名，可以补充：

> 如果要处理并列名次，可以不用 `cumcount()`，改用 `rank(method="dense", ascending=False)` 对每个月内的 `swap_cnt` 排名。

> **参考回答**：本题已在上方通过 Python 代码块和关键处理说明提供完整解答。

- **pandas 处理题：两列不同口径字段合并成一列并保留最大值**

**题目**：

给一个 `DataFrame`，其中某个字段因为不同口径记录成两列，例如 `score_a` 和 `score_b`。请把这两列合并成一列，保留每行的最大值。

**参考写法**：

```python
import pandas as pd

df["score"] = df[["score_a", "score_b"]].max(axis=1)
```

如果有缺失值，`max(axis=1)` 默认会跳过 `NaN`。如果两列都缺失，结果仍为 `NaN`。

如果想合并后删除原字段：

```python
df["score"] = df[["score_a", "score_b"]].max(axis=1)
df = df.drop(columns=["score_a", "score_b"])
```

**口述要点**：

- 横向取最大值用 `axis=1`
- 先确认两列是否是数值类型
- 合并后最好说明原始口径差异，避免后续误用

> **参考回答**：本题已在上方通过 Python 代码块和关键处理说明提供完整解答。

- **pandas 处理题：列表列展开成多行**

**题目**：

给一个 `DataFrame`，其中一列是列表形式，例如 `tags = ["美食", "外卖", "酒店"]`，请把列表中的每一项展开成新的一行。

**参考写法**：

```python
df_long = df.explode("tags")
```

如果希望展开后重置索引：

```python
df_long = df.explode("tags").reset_index(drop=True)
```

**示例**：

```python
df = pd.DataFrame({
    "user_id": [1, 2],
    "tags": [["美食", "外卖"], ["酒店"]]
})

df_long = df.explode("tags").reset_index(drop=True)
```

结果会变成：

```text
user_id  tags
1        美食
1        外卖
2        酒店
```

**口述要点**：

- `explode()` 会保留其他列，只把列表列拆成多行
- 如果列表为空，展开后可能出现空值，需要根据业务决定是否过滤
- 如果列表是字符串形式，需先解析成真正的 list

---

> **参考回答**：本题已在上方通过 Python 代码块和关键处理说明提供完整解答。

