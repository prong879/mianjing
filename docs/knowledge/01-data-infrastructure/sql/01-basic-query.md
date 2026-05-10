---
title: 单表查询基础
date: 2026-04-26 15:38:28
description: 目标：熟悉 SELECT、WHERE、ORDER BY、LIMIT。
outline: deep
---
# 单表查询基础

## 1. 核心语法

目标：熟悉 `SELECT`、`WHERE`、`ORDER BY`、`LIMIT`。

高频语法：

- `SELECT` 用来决定“查哪些列”
- `FROM` 用来决定“从哪张表查”
- `WHERE` 用来过滤原始行
- `ORDER BY` 决定结果顺序
- `LIMIT` 限制返回的行数
- `DISTINCT` 去重

常见写法：

```sql
SELECT user_id, register_date
FROM users
WHERE register_date > '2025-03-01'
ORDER BY register_date DESC
LIMIT 10;
```

## 2. 必会知识点

- **比较运算符**：除了相等 `=`，还有 `>`、`>=`、`<`、`<=`；不等于用 `<>` 或 `!=`。
- **多条件判断**：`AND` 表示同时满足，`OR` 表示满足其一。写复杂条件时，最好加括号，避免逻辑优先级出错。
- **常用过滤语法**：
  - `IN` 适合多个离散值筛选（如 `channel IN ('douyin', 'xiaohongshu')`）。
  - `BETWEEN` 是闭区间（含两端）。
  - `IS NULL` / `IS NOT NULL`：判断空值**必须**用它们，不要写 `= NULL`。
- **模糊匹配**：`LIKE '%xx%'`。`%` 表示任意多个字符，`_` 表示恰好一个字符。
- **排序的坑**：不写 `ORDER BY` 时顺序是随机的，不要依赖默认排序。`LIMIT` 不配 `ORDER BY` 时，“前几条”没有稳定语义。
- **`WHERE` 的限制**：`WHERE` 里不能直接写聚合函数（如 `COUNT`、`SUM`），它是在分组聚合前执行的。

---

## 3. 基础练习题

做题建议：先独立写 SQL，不要立刻看提示。参考答案为 MySQL 写法，做题前请先明确练习库的表结构（见环境说明）。

1. 查询 `users` 表中的所有字段。
2. 查询 2025-03-01 之后注册的用户 `user_id` 和 `register_date`。
3. 查询来自上海的用户 `user_id`、`city`、`channel`。
4. 查询渠道是 `douyin` 或 `xiaohongshu` 的用户。
5. 查询 `orders` 表中金额大于 200 的已支付订单。
6. 查询 `products` 表中类目为 `beauty` 的商品名称和价格，按价格降序排列。
7. 查询最近 10 条访问记录，返回 `user_id`、`visit_date`、`page_name`。
8. 查询价格在 50 到 100 之间的商品。

---

## 4. 进阶练习题

9. 查询订单金额最高的 5 笔已支付订单。
10. 查询页面名包含 `detail` 的访问记录。
11. 查询渠道不为空的用户。
12. 查询状态不是 `cancelled` 的订单，按下单日期升序、金额降序排列。

---

## 5. 自查点

做完后复盘：
- 你是否熟练使用了 `IN`、`BETWEEN`、`LIKE`（含 `%` 通配符）、`IS NOT NULL`？
- 你是否能写出“不等于”：`status <> 'cancelled'` 或 `status != 'cancelled'`？
- 你是否会用 `LIMIT n`，并理解为什么要配合 `ORDER BY` 才能得到稳定的“Top N / 最近几条”？
- 你是否知道 `WHERE` 不能放聚合函数？

---

## 6. 参考答案

### 基础题参考答案

**1.**
```sql
SELECT *
FROM users;
```

**2.**
```sql
SELECT user_id, register_date
FROM users
WHERE register_date > '2025-03-01';
```

**3.**
```sql
SELECT user_id, city, channel
FROM users
WHERE city = '上海';
```

**4.**
```sql
SELECT user_id, channel
FROM users
WHERE channel IN ('douyin', 'xiaohongshu');
```

**5.**
```sql
SELECT order_id, user_id, order_amount, status
FROM orders
WHERE order_amount > 200
  AND status = 'paid';
```

**6.**
```sql
SELECT product_name, price
FROM products
WHERE category = 'beauty'
ORDER BY price DESC;
```

**7.**
```sql
SELECT user_id, visit_date, page_name
FROM visits
ORDER BY visit_date DESC, visit_id DESC
LIMIT 10;
```

**8.**
```sql
SELECT product_id, product_name, price
FROM products
WHERE price BETWEEN 50 AND 100;
```

### 进阶题参考答案

**9.**
```sql
SELECT order_id, user_id, order_amount
FROM orders
WHERE status = 'paid'
ORDER BY order_amount DESC, order_id
LIMIT 5;
```

**10.**
```sql
SELECT visit_id, user_id, visit_date, page_name
FROM visits
WHERE page_name LIKE '%detail%';
```

**11.**
```sql
SELECT user_id, channel
FROM users
WHERE channel IS NOT NULL;
```

**12.**
```sql
SELECT order_id, user_id, order_date, order_amount, status
FROM orders
WHERE status <> 'cancelled'
ORDER BY order_date ASC, order_amount DESC;
```
