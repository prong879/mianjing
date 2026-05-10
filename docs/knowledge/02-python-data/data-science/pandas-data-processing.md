---
title: Pandas 数据处理与可视化
date: 2026-04-26 19:00:05
description: 本章节涵盖 pandas 基础操作、数据清洗、分组聚合、数据可视化以及综合分析项目的核心知识点与配套练习。
outline: deep
tags:
- Pandas
- 数据清洗
- 数据可视化
- 数据分析
---
# Pandas 数据处理与可视化

本章节涵盖 `pandas` 基础操作、数据清洗、分组聚合、数据可视化以及综合分析项目的核心知识点与配套练习。

## 1. `pandas` 入门

### 知识讲解

#### 1.1 什么是 `DataFrame`
`DataFrame` 可以理解成一张表，和 Excel 表格很像。
```python
import pandas as pd

df = pd.read_csv("users.csv")
print(df.head())
```

#### 1.2 选列
```python
print(df["city"])
print(df[["user_id", "city"]])
```

#### 1.3 条件筛选
```python
sh_users = df[df["city"] == "Shanghai"]
print(sh_users)
```

#### 1.4 排序
```python
df = df.sort_values("register_date", ascending=False)
```

#### 1.5 新增列
```python
df["is_shanghai"] = df["city"] == "Shanghai"
```

### 练习题

假设 `orders.csv` 含有字段：`order_id`、`user_id`、`order_amount`、`status`。

- **读取 `orders.csv` 并查看前 5 行。**

> 🏷️ 标签：pandas基础，读取数据

> **参考回答**：
> ```python
> import pandas as pd
> 
> df = pd.read_csv("orders.csv")
> print(df.head())
> ```

- **选出 `order_id` 和 `order_amount` 两列。**

> 🏷️ 标签：pandas基础，选列

> **参考回答**：
> ```python
> print(df[["order_id", "order_amount"]])
> ```

- **筛选出已支付订单。**

> 🏷️ 标签：pandas基础，条件筛选

> **参考回答**：
> ```python
> paid_df = df[df["status"] == "paid"]
> print(paid_df)
> ```

- **按 `order_amount` 从高到低排序。**

> 🏷️ 标签：pandas基础，排序

> **参考回答**：
> ```python
> sorted_df = df.sort_values("order_amount", ascending=False)
> print(sorted_df)
> ```

- **新增一列 `is_paid`，已支付为 `True`，否则为 `False`。**

> 🏷️ 标签：pandas基础，新增列

> **参考回答**：
> ```python
> df["is_paid"] = df["status"] == "paid"
> print(df.head())
> ```

## 2. `pandas` 数据清洗

### 知识讲解

#### 2.1 查看缺失值
```python
print(df.isna().sum())
```

#### 2.2 删除缺失值
```python
df = df.dropna()
```

#### 2.3 填充缺失值
```python
df["city"] = df["city"].fillna("unknown")
```

#### 2.4 去重
```python
df = df.drop_duplicates()
```

#### 2.5 类型转换
```python
df["order_amount"] = df["order_amount"].astype(float)
```

#### 2.6 日期处理
```python
df["order_date"] = pd.to_datetime(df["order_date"])
df["month"] = df["order_date"].dt.month
```

### 练习题

- **查看每列缺失值数量。**

> 🏷️ 标签：数据清洗，缺失值

> **参考回答**：
> ```python
> print(df.isna().sum())
> ```

- **把 `city` 的空值填成 `unknown`。**

> 🏷️ 标签：数据清洗，缺失值填充

> **参考回答**：
> ```python
> if "city" in df.columns:
>     df["city"] = df["city"].fillna("unknown")
> ```

- **删除重复行。**

> 🏷️ 标签：数据清洗，去重

> **参考回答**：
> ```python
> df = df.drop_duplicates()
> ```

- **把 `order_date` 转成日期格式。**

> 🏷️ 标签：数据清洗，日期处理

> **参考回答**：
> ```python
> if "order_date" in df.columns:
>     df["order_date"] = pd.to_datetime(df["order_date"])
> ```

- **新增 `month` 列，表示月份。**

> 🏷️ 标签：数据清洗，日期处理

> **参考回答**：
> ```python
> if "order_date" in df.columns:
>     df["month"] = df["order_date"].dt.month
> ```

## 3. `pandas` 分组、合并、透视

### 知识讲解

#### 3.1 分组聚合
```python
result = df.groupby("city", as_index=False).agg({
    "user_id": "count"
})
print(result)
```

#### 3.2 多指标聚合
```python
result = df.groupby("channel", as_index=False).agg({
    "user_id": "count",
    "order_amount": "sum"
})
```

#### 3.3 表连接
```python
merged = orders.merge(users, on="user_id", how="left")
```

#### 3.4 透视表
```python
pivot = df.pivot_table(
    index="channel",
    values="order_amount",
    aggfunc="sum"
)
print(pivot)
```

### 练习题

假设：
- `users.csv` 有 `user_id`、`channel`、`city`
- `orders.csv` 有 `order_id`、`user_id`、`order_amount`、`status`

- **统计每个渠道的用户数。**

> 🏷️ 标签：数据处理，分组聚合

> **参考回答**：
> ```python
> import pandas as pd
> 
> users = pd.read_csv("users.csv")
> orders = pd.read_csv("orders.csv")
> 
> channel_user_cnt = users.groupby("channel", as_index=False).agg({
>     "user_id": "count"
> }).rename(columns={"user_id": "user_cnt"})
> print(channel_user_cnt)
> ```

- **统计每个渠道的支付金额总和。**

> 🏷️ 标签：数据处理，分组聚合，表连接

> **参考回答**：
> ```python
> paid_orders = orders[orders["status"] == "paid"]
> channel_paid = paid_orders.merge(users, on="user_id", how="left")
> 
> channel_paid_amount = channel_paid.groupby("channel", as_index=False).agg({
>     "order_amount": "sum"
> }).rename(columns={"order_amount": "paid_gmv"})
> print(channel_paid_amount)
> ```

- **将 `users` 和 `orders` 按 `user_id` 合并。**

> 🏷️ 标签：数据处理，表连接

> **参考回答**：
> ```python
> merged = orders.merge(users, on="user_id", how="left")
> print(merged.head())
> ```

- **统计每个城市的支付订单数。**

> 🏷️ 标签：数据处理，分组聚合，表连接

> **参考回答**：
> ```python
> city_order_cnt = channel_paid.groupby("city", as_index=False).agg({
>     "order_id": "count"
> }).rename(columns={"order_id": "paid_order_cnt"})
> print(city_order_cnt)
> ```

- **做一个透视表：按渠道统计支付金额。**

> 🏷️ 标签：数据处理，透视表

> **参考回答**：
> ```python
> pivot = channel_paid.pivot_table(
>     index="channel",
>     values="order_amount",
>     aggfunc="sum"
> )
> print(pivot)
> ```

## 4. 数据可视化与基础分析

### 知识讲解

#### 4.1 折线图
适合看趋势，例如 DAU、GMV 日趋势。
```python
import matplotlib.pyplot as plt

plt.plot(df["date"], df["dau"])
plt.title("DAU Trend")
plt.show()
```

#### 4.2 柱状图
适合看对比，例如渠道支付金额对比。
```python
plt.bar(df["channel"], df["paid_gmv"])
plt.title("Channel GMV")
plt.show()
```

#### 4.3 基础分析思路
看到一份数据，不要只停留在“算出结果”，还要思考：
1. 整体趋势是上升还是下降？
2. 哪个渠道 / 城市 / 页面表现最好？
3. 是否存在异常点？
4. 结果背后可能的业务原因是什么？

### 练习题

- **画出每天 DAU 的折线图。**

> 🏷️ 标签：数据可视化，折线图

> **参考回答**：
> ```python
> import pandas as pd
> import matplotlib.pyplot as plt
> 
> dau_df = pd.DataFrame({
>     "date": ["2025-03-01", "2025-03-02", "2025-03-03"],
>     "dau": [100, 120, 110]
> })
> 
> plt.plot(dau_df["date"], dau_df["dau"])
> plt.title("DAU Trend")
> plt.xlabel("Date")
> plt.ylabel("DAU")
> plt.show()
> ```

- **画出不同渠道支付金额的柱状图。**

> 🏷️ 标签：数据可视化，柱状图

> **参考回答**：
> ```python
> channel_df = pd.DataFrame({
>     "channel": ["douyin", "xiaohongshu", "app_store"],
>     "paid_gmv": [5000, 7200, 4300]
> })
> 
> plt.bar(channel_df["channel"], channel_df["paid_gmv"])
> plt.title("Channel Paid GMV")
> plt.xlabel("Channel")
> plt.ylabel("GMV")
> plt.show()
> ```

- **用一句话描述图表结论，并试着给出一个业务建议。**

> 🏷️ 标签：数据分析，业务洞察

> **参考回答**：
> - **结论**：`2025-03-02` 的 DAU 最高，整体呈先上升后小幅回落；`xiaohongshu` 渠道支付金额最高，说明该渠道的转化质量较好。
> - **建议**：可以继续观察 `xiaohongshu` 渠道的投放策略，并与其他渠道对比用户质量；如果 DAU 在某天异常波动，需要回看是否有活动、版本更新或投放变化。

## 5. 综合项目训练

### 项目题目

假设你拿到一份电商平台数据，包含 `users.csv`、`orders.csv`、`visits.csv`。请完成以下任务：
1. 统计每天的 DAU。
2. 统计每天的支付用户数。
3. 统计每天的支付转化率。
4. 统计各渠道注册用户数、支付用户数、支付金额。
5. 找出支付金额最高的渠道。
6. 画出 DAU 趋势图和渠道支付金额柱状图。
7. 用 3 到 5 句话总结结论，并提出 1 到 2 条建议。

### 参考答案示例

```python
import pandas as pd
import matplotlib.pyplot as plt

users = pd.read_csv("users.csv")
orders = pd.read_csv("orders.csv")
visits = pd.read_csv("visits.csv")

orders["order_date"] = pd.to_datetime(orders["order_date"])
visits["visit_date"] = pd.to_datetime(visits["visit_date"])

# 1. 统计每天的 DAU
dau = visits.groupby("visit_date", as_index=False).agg({
    "user_id": "nunique"
}).rename(columns={"user_id": "dau"})

# 2. 统计每天的支付用户数
paid_orders = orders[orders["status"] == "paid"]
paid_user = paid_orders.groupby("order_date", as_index=False).agg({
    "user_id": "nunique"
}).rename(columns={"user_id": "paid_user_cnt"})

# 3. 统计每天的支付转化率
daily = dau.merge(paid_user, left_on="visit_date", right_on="order_date", how="left")
daily["paid_user_cnt"] = daily["paid_user_cnt"].fillna(0)
daily["pay_rate"] = daily["paid_user_cnt"] / daily["dau"]

# 4. 统计各渠道注册用户数、支付用户数、支付金额
channel_data = paid_orders.merge(users, on="user_id", how="left")
channel_summary = channel_data.groupby("channel", as_index=False).agg({
    "user_id": "nunique",
    "order_amount": "sum"
}).rename(columns={
    "user_id": "paid_user_cnt",
    "order_amount": "paid_gmv"
})

register_user = users.groupby("channel", as_index=False).agg({
    "user_id": "count"
}).rename(columns={"user_id": "register_user_cnt"})

channel_summary = register_user.merge(channel_summary, on="channel", how="left")
channel_summary["paid_user_cnt"] = channel_summary["paid_user_cnt"].fillna(0)
channel_summary["paid_gmv"] = channel_summary["paid_gmv"].fillna(0)

# 5. 找出支付金额最高的渠道
top_channel = channel_summary.sort_values("paid_gmv", ascending=False).head(1)

print(daily)
print(channel_summary)
print(top_channel)

# 6. 画出 DAU 趋势图和渠道支付金额柱状图
plt.figure(figsize=(8, 4))
plt.plot(dau["visit_date"], dau["dau"])
plt.title("DAU Trend")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

plt.figure(figsize=(8, 4))
plt.bar(channel_summary["channel"], channel_summary["paid_gmv"])
plt.title("Channel Paid GMV")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

### 项目复盘模板

做完项目后，请回答：
1. 这份分析里，我的核心指标定义清楚了吗？
2. 我有没有区分“访问用户数”和“支付用户数”？
3. 我有没有处理空值和日期格式？
4. 图表是否真的能支撑我的结论？
5. 如果我是面试官，我会追问这份项目的哪个部分？
