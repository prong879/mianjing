---
title: 多表连接
date: 2026-04-26 15:38:28
description: 目标：学会把用户、访问、订单、商品表关联起来。
outline: deep
---
# 多表连接

## 1. 核心语法

目标：学会把用户、访问、订单、商品表关联起来。

高频语法：

- `JOIN` / `INNER JOIN`：只保留两边都匹配上的记录（交集）
- `LEFT JOIN`：保留左表全部记录，右表匹配不到补 `NULL`
- `ON`：指定两张表如何匹配

常见写法：

```sql
SELECT
  o.order_id,
  o.user_id,
  u.channel
FROM orders o
JOIN users u
  ON o.user_id = u.user_id;
```

## 2. 必会知识点

- **明确主表**：分析题里经常先选“主表/基准对象”，再决定是否需要保留全集，从而确定选 `LEFT JOIN` 还是 `INNER JOIN`。
- **保留左表全集的坑**：如果用 `LEFT JOIN` 且想保留左表所有记录，右表的过滤条件应尽量放在 `ON` 里面，否则如果放在 `WHERE` 里面，很可能会把未匹配行（也就是 `NULL` 的行）过滤掉，结果变成了类似“内连接”的效果。
  ```sql
  -- 更稳的写法
  SELECT
    u.user_id,
    COUNT(o.order_id) AS paid_order_cnt
  FROM users u
  LEFT JOIN orders o
    ON u.user_id = o.user_id
   AND o.status = 'paid'
  GROUP BY u.user_id;
  ```
- **连接后可能导致数据膨胀**：一对多连接会让行数变多。连接后如果直接 `COUNT(*)`，会重复计数，所以计算用户数时经常需要 `COUNT(DISTINCT user_id)`。
- **找“有 A 没有 B”**：`LEFT JOIN` + 筛右表为空。
  ```sql
  SELECT a.user_id
  FROM A a
  LEFT JOIN B b
    ON a.user_id = b.user_id
  WHERE b.user_id IS NULL;
  ```

---

## 3. 基础练习题

做题建议：先独立写 SQL，不要立刻看提示。

1. 查询每笔订单对应的用户注册渠道，返回 `order_id`、`user_id`、`channel`。
2. 查询每笔订单对应的商品名称和类目。
3. 查询每个用户的注册城市和累计访问次数。
4. 查询每个用户的注册日期和支付订单数。
5. 查询有过访问但从未下单的用户 ID。

---

## 4. 进阶练习题

6. 查询每个渠道的支付订单数。
7. 查询每个类目的支付金额总和。
8. 查询每个城市的支付用户数。
9. 查询浏览过 `detail` 页面且有支付订单的用户 ID。
10. 查询没有访问记录的注册用户数。

---

## 5. 自查点

做完后复盘：
- 你是否明确了主表是谁、被关联表是谁？
- 你是否知道什么时候优先用 `LEFT JOIN`？
- 你是否注意到了重复行导致的重复计数问题，使用了 `DISTINCT`？

---

## 6. 参考答案

### 基础题参考答案

**1.**
```sql
SELECT
  o.order_id,
  o.user_id,
  u.channel
FROM orders o
JOIN users u
  ON o.user_id = u.user_id;
```

**2.**
```sql
SELECT
  o.order_id,
  p.product_name,
  p.category
FROM orders o
JOIN products p
  ON o.product_id = p.product_id;
```

**3.**
```sql
SELECT
  u.user_id,
  u.city,
  COUNT(v.visit_id) AS visit_cnt
FROM users u
LEFT JOIN visits v
  ON u.user_id = v.user_id
GROUP BY u.user_id, u.city
ORDER BY u.user_id;
```

**4.**
```sql
SELECT
  u.user_id,
  u.register_date,
  COUNT(o.order_id) AS paid_order_cnt
FROM users u
LEFT JOIN orders o
  ON u.user_id = o.user_id
 AND o.status = 'paid'
GROUP BY u.user_id, u.register_date
ORDER BY u.user_id;
```

**5.**
```sql
SELECT DISTINCT v.user_id
FROM visits v
LEFT JOIN orders o
  ON v.user_id = o.user_id
WHERE o.user_id IS NULL;
```

### 进阶题参考答案

**6.**
```sql
SELECT
  u.channel,
  COUNT(o.order_id) AS paid_order_cnt
FROM users u
JOIN orders o
  ON u.user_id = o.user_id
WHERE o.status = 'paid'
GROUP BY u.channel
ORDER BY paid_order_cnt DESC;
```

**7.**
```sql
SELECT
  p.category,
  SUM(o.order_amount) AS paid_gmv
FROM orders o
JOIN products p
  ON o.product_id = p.product_id
WHERE o.status = 'paid'
GROUP BY p.category
ORDER BY paid_gmv DESC;
```

**8.**
```sql
SELECT
  u.city,
  COUNT(DISTINCT o.user_id) AS paid_user_cnt
FROM users u
JOIN orders o
  ON u.user_id = o.user_id
WHERE o.status = 'paid'
GROUP BY u.city;
```

**9.**
```sql
SELECT DISTINCT v.user_id
FROM visits v
JOIN orders o
  ON v.user_id = o.user_id
WHERE v.page_name = 'detail'
  AND o.status = 'paid';
```

**10.**
```sql
SELECT COUNT(*) AS no_visit_user_cnt
FROM users u
LEFT JOIN visits v
  ON u.user_id = v.user_id
WHERE v.user_id IS NULL;
```
