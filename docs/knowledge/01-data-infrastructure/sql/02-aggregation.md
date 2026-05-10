---
title: 聚合与分组统计
date: 2026-04-26 15:38:28
description: 目标：熟悉 COUNT、SUM、AVG、MAX、MIN、GROUP BY、HAVING、AS。
outline: deep
---
# 聚合与分组统计

## 1. 核心语法

目标：熟悉 `COUNT`、`SUM`、`AVG`、`MAX`、`MIN`、`GROUP BY`、`HAVING`、`AS`。

高频语法：

- `COUNT` 计数
- `SUM` 求和
- `AVG` 求平均
- `MAX` 和 `MIN` 求最大最小值
- `GROUP BY` 是按维度拆开统计
- `HAVING` 用来过滤分组后的结果

常见写法：

```sql
SELECT
  visit_date,
  COUNT(DISTINCT user_id) AS dau
FROM visits
GROUP BY visit_date
ORDER BY visit_date;
```

## 2. 必会知识点

- **列别名 `AS`**：在 `SELECT` 里可以给表达式或聚合结果起结果列名。`AS` 可省略，但写上更清晰。
- **去重统计**：`COUNT(DISTINCT col)` 常用于统计去重用户数。比如 DAU 统计的是活跃用户数，不是访问次数。
- **分组口径**：`GROUP BY` 的作用是“按某个维度拆开统计”，例如按城市统计用户数、按渠道统计注册数。不能随便查未分组、未聚合字段。
- **过滤时机（核心坑点）**：
  - `WHERE`：在聚合前执行，筛原始行。里面不能写聚合函数。
  - `HAVING`：在聚合后执行，用来过滤分组后的结果。

---

## 3. 基础练习题

做题建议：先独立写 SQL，不要立刻看提示。

1. 统计 `users` 表中的总用户数。
2. 统计每个城市的注册用户数。
3. 统计每个渠道的注册用户数，并按用户数降序排序。
4. 统计每天的访问次数。
5. 统计每天的活跃用户数，活跃定义为当日至少访问 1 次。
6. 统计 `orders` 表中每天的支付订单数和支付总金额，只统计 `paid` 订单。

---

## 4. 进阶练习题

7. 统计每个类目的商品数和平均价格。
8. 统计每个用户的支付订单数。
9. 查询支付订单数大于等于 3 的用户及其订单数。
10. 统计每个城市用户的平均订单金额。（提示：需用到多表关联，不熟练可先跳过）
11. 查询总支付金额大于 1000 的用户。
12. 统计每个渠道带来的注册用户数，并筛选用户数大于 2 的渠道。

---

## 5. 自查点

做完后复盘：
- 你是否分清了 `COUNT(*)` 和 `COUNT(DISTINCT user_id)`？
- 你是否能解释 `WHERE` 与 `HAVING` 的区别？
- 聚合前筛选用哪个？聚合后筛选用哪个？

---

## 6. 参考答案

### 基础题参考答案

**1.**
```sql
SELECT COUNT(*) AS user_cnt
FROM users;
```

**2.**
```sql
SELECT city, COUNT(*) AS register_user_cnt
FROM users
GROUP BY city;
```

**3.**
```sql
SELECT channel, COUNT(*) AS register_user_cnt
FROM users
GROUP BY channel
ORDER BY register_user_cnt DESC;
```

**4.**
```sql
SELECT visit_date, COUNT(*) AS visit_cnt
FROM visits
GROUP BY visit_date
ORDER BY visit_date;
```

**5.**
```sql
SELECT visit_date, COUNT(DISTINCT user_id) AS dau
FROM visits
GROUP BY visit_date
ORDER BY visit_date;
```

**6.**
```sql
SELECT
  order_date,
  COUNT(*) AS paid_order_cnt,
  SUM(order_amount) AS paid_gmv
FROM orders
WHERE status = 'paid'
GROUP BY order_date
ORDER BY order_date;
```

### 进阶题参考答案

**7.**
```sql
SELECT
  category,
  COUNT(*) AS product_cnt,
  AVG(price) AS avg_price
FROM products
GROUP BY category;
```

**8.**
```sql
SELECT
  user_id,
  COUNT(*) AS paid_order_cnt
FROM orders
WHERE status = 'paid'
GROUP BY user_id;
```

**9.**
```sql
SELECT
  user_id,
  COUNT(*) AS paid_order_cnt
FROM orders
WHERE status = 'paid'
GROUP BY user_id
HAVING COUNT(*) >= 3;
```

**10.**
```sql
SELECT
  u.city,
  AVG(o.order_amount) AS avg_paid_order_amount
FROM users u
JOIN orders o
  ON u.user_id = o.user_id
WHERE o.status = 'paid'
GROUP BY u.city;
```

**11.**
```sql
SELECT
  user_id,
  SUM(order_amount) AS total_paid_amount
FROM orders
WHERE status = 'paid'
GROUP BY user_id
HAVING SUM(order_amount) > 1000;
```

**12.**
```sql
SELECT
  channel,
  COUNT(*) AS register_user_cnt
FROM users
GROUP BY channel
HAVING COUNT(*) > 2;
```
