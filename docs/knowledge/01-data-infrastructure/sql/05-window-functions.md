---
title: 子查询、CTE、窗口函数
date: 2026-04-26 15:38:28
description: 子查询、CTE 与窗口函数：ROW_NUMBER/RANK、分组 Top N、滚动 SUM/AVG 等；解决排名、累计与 PARTITION BY 分组场景下的高频笔试题。
outline: deep
---
# 子查询、CTE、窗口函数

## 1. 核心语法

目标：解决 Top N、每组第一、排名类问题。

高频语法：

- 子查询
- `WITH` (CTE，公共表达式)
- `ROW_NUMBER() OVER (...)`
- `RANK() OVER (...)`
- `SUM() OVER (...)`

常见写法：

```sql
WITH t AS (
  SELECT
    user_id,
    order_id,
    order_amount,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY order_amount DESC, order_id ASC
    ) AS rn
  FROM orders
  WHERE status = 'paid'
)
SELECT user_id, order_id, order_amount
FROM t
WHERE rn = 1;
```

## 2. 必会知识点

- **子查询基础**：“先查一步，再基于结果继续查”，适合拆分复杂问题。
- **公共表达式（CTE）**：`WITH` 可以把中间结果起个名字，让 SQL 更容易读。可以连续定义多个 CTE（用逗号分隔），后面的 CTE 可以引用前面的 CTE。
- **窗口函数基础**：`OVER()` 的核心价值是“保留明细行，同时做组内计算”。它和 `GROUP BY` 的最大不同是不会把多行合并压成一行。
- **分组与排序**：
  - `PARTITION BY`：按谁分组看
  - `ORDER BY`：组内按什么顺序排
- **排名函数区别**：
  - `ROW_NUMBER()`：不管是否并列，都会给唯一顺序（如 1,2,3,4）。
  - `RANK()`：遇到并列会给相同名次，并导致后续名次跳号（如 1,1,3,4）。
- **常见应用**：每组第一、最近一次、Top N、每天最高订单、第二笔订单等。这些题本质都是“先分组，再组内排序，再过滤指定名次”。

---

## 3. 基础练习题

做题建议：先独立写 SQL，不要立刻看提示。练习题主要用 **CTE + 窗口函数** 完成。

1. 查询每个用户金额最高的一笔支付订单。
2. 查询每个类目价格最高的商品。
3. 查询每个城市注册时间最早的用户。
4. 查询每个用户最近一次访问的页面。

---

## 4. 进阶练习题

5. 查询每个类目支付金额最高的前 3 个商品。
6. 统计每个用户累计支付金额，并计算其在全体用户中的金额排名。
7. 查询每天支付金额最高的订单。
8. 查询每个用户的第二笔支付订单。

---

## 5. 自查点

做完后复盘：
- 你是否知道 `ROW_NUMBER()`、`RANK()` 的区别？
- 你是否能正确写出 `PARTITION BY` 和 `ORDER BY`？

---

## 6. 参考答案

### 基础题参考答案

**1.**
```sql
WITH t AS (
  SELECT
    user_id,
    order_id,
    order_amount,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY order_amount DESC, order_date ASC, order_id ASC
    ) AS rn
  FROM orders
  WHERE status = 'paid'
)
SELECT user_id, order_id, order_amount
FROM t
WHERE rn = 1;
```

**2.**
```sql
WITH t AS (
  SELECT
    category,
    product_id,
    product_name,
    price,
    ROW_NUMBER() OVER (
      PARTITION BY category
      ORDER BY price DESC, product_id ASC
    ) AS rn
  FROM products
)
SELECT category, product_id, product_name, price
FROM t
WHERE rn = 1;
```

**3.**
```sql
WITH t AS (
  SELECT
    city,
    user_id,
    register_date,
    ROW_NUMBER() OVER (
      PARTITION BY city
      ORDER BY register_date ASC, user_id ASC
    ) AS rn
  FROM users
)
SELECT city, user_id, register_date
FROM t
WHERE rn = 1;
```

**4.**
```sql
WITH t AS (
  SELECT
    user_id,
    page_name,
    visit_date,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY visit_date DESC, visit_id DESC
    ) AS rn
  FROM visits
)
SELECT user_id, page_name, visit_date
FROM t
WHERE rn = 1;
```

### 进阶题参考答案

**5.**
```sql
WITH product_gmv AS (
  SELECT
    p.category,
    p.product_id,
    p.product_name,
    SUM(o.order_amount) AS paid_gmv
  FROM products p
  JOIN orders o
    ON p.product_id = o.product_id
  WHERE o.status = 'paid'
  GROUP BY p.category, p.product_id, p.product_name
),
ranked AS (
  SELECT
    category,
    product_id,
    product_name,
    paid_gmv,
    ROW_NUMBER() OVER (
      PARTITION BY category
      ORDER BY paid_gmv DESC, product_id ASC
    ) AS rn
  FROM product_gmv
)
SELECT category, product_id, product_name, paid_gmv, rn
FROM ranked
WHERE rn <= 3
ORDER BY category, rn;
```

**6.**
```sql
WITH user_amount AS (
  SELECT
    user_id,
    SUM(order_amount) AS total_paid_amount
  FROM orders
  WHERE status = 'paid'
  GROUP BY user_id
)
SELECT
  user_id,
  total_paid_amount,
  RANK() OVER (ORDER BY total_paid_amount DESC) AS amount_rank
FROM user_amount
ORDER BY amount_rank, user_id;
```

**7.**
```sql
WITH t AS (
  SELECT
    order_date,
    order_id,
    user_id,
    order_amount,
    ROW_NUMBER() OVER (
      PARTITION BY order_date
      ORDER BY order_amount DESC, order_id ASC
    ) AS rn
  FROM orders
  WHERE status = 'paid'
)
SELECT order_date, order_id, user_id, order_amount
FROM t
WHERE rn = 1
ORDER BY order_date;
```

**8.**
```sql
WITH t AS (
  SELECT
    user_id,
    order_id,
    order_date,
    order_amount,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY order_date ASC, order_id ASC
    ) AS rn
  FROM orders
  WHERE status = 'paid'
)
SELECT user_id, order_id, order_date, order_amount
FROM t
WHERE rn = 2;
```
