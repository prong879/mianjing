---
title: "条件统计与业务表达"
outline: deep
---

# 条件统计与业务表达

## 1. 核心语法

目标：会用 `CASE WHEN` 表达业务口径。

高频语法：

- `CASE WHEN ... THEN ... ELSE ... END`
- `SUM(CASE WHEN ...)`
- `COUNT(DISTINCT CASE WHEN ... THEN user_id END)`

`CASE WHEN` 本质上是 SQL 里的“条件判断表达式”，类似编程里的 `if ... else`，会根据不同条件返回不同结果。

常见有两种写法：

第一种：按条件判断，最常用

```sql
CASE
  WHEN 条件1 THEN 结果1
  WHEN 条件2 THEN 结果2
  ELSE 其他结果
END
```

第二种：按某个字段的不同取值判断

```sql
CASE 字段
  WHEN 值1 THEN 结果1
  WHEN 值2 THEN 结果2
  ELSE 其他结果
END
```

## 2. 必会知识点

- **条件分类**：把原始数据转换成业务标签，如“未成年/成年”、“轻度付费/重度付费”。如果不写 `ELSE`，默认返回 `NULL`。
- **条件计数**：只统计满足条件的。`SUM(CASE WHEN 条件 THEN 1 ELSE 0 END)`。
- **条件求和**：只把满足条件的金额加起来。`SUM(CASE WHEN 条件 THEN order_amount ELSE 0 END)`。
- **条件去重计数（最高频）**：`COUNT(DISTINCT CASE WHEN 条件 THEN user_id END)`。表示**只对满足条件的用户去重计数**。因为 `CASE` 没有匹配到 `THEN` 时，分支结果是 `NULL`，而 `COUNT(DISTINCT)` 会忽略 `NULL`。
- **同日多行为对齐**：当判断“某一天既发生 A 又发生 B”时，除了在 `WHERE` 里写条件，也常把“同一天”写在 `JOIN` 条件里，如 `ON v.user_id = o.user_id AND v.visit_date = o.order_date`，避免把别的日期的订单算进来。
- **MySQL 日期差**：`DATEDIFF(A, B)` 返回 **A 的日期减去 B 的日期**的天数。

---

## 3. 基础练习题

做题建议：先独立写 SQL，不要立刻看提示。

1. 统计每天的总用户数和付费用户数。
2. 按城市统计用户数，其中城市为空的统一记为 `unknown`。
3. 统计每个用户的订单类型：
   - 支付订单数为 0，记为 `未付费`
   - 支付订单数为 1 到 2，记为 `轻度付费`
   - 支付订单数大于等于 3，记为 `重度付费`
4. 统计每个渠道带来的男性用户数和女性用户数。

---

## 4. 进阶练习题

5. 按天统计订单金额分层人数：
   - 小于 100
   - 100 到 299
   - 大于等于 300
6. 统计每个城市的下单用户数、未下单用户数。
7. 统计每天访问过 `cart` 页面并支付成功的用户数。
8. 给用户打标签：
   - 注册 7 天内有支付，记为 `快速转化`
   - 注册 7 天内无支付，记为 `待转化`

---

## 5. 自查点

做完后复盘：
- 你是否能把一句业务话翻译成 SQL 条件？
- 你是否能在聚合函数里嵌入 `CASE WHEN`？

---

## 6. 参考答案

### 基础题参考答案

**1.**
```sql
SELECT
  u.register_date AS dt,
  COUNT(DISTINCT u.user_id) AS total_user_cnt,
  COUNT(DISTINCT CASE WHEN o.status = 'paid' THEN u.user_id END) AS paid_user_cnt
FROM users u
LEFT JOIN orders o
  ON u.user_id = o.user_id
GROUP BY u.register_date
ORDER BY dt;
```

**2.**
```sql
SELECT
  CASE
    WHEN city IS NULL THEN 'unknown'
    ELSE city
  END AS city_group,
  COUNT(*) AS user_cnt
FROM users
GROUP BY
  CASE
    WHEN city IS NULL THEN 'unknown'
    ELSE city
  END;
```

**3.**
```sql
SELECT
  u.user_id,
  CASE
    WHEN COUNT(o.order_id) = 0 THEN '未付费'
    WHEN COUNT(o.order_id) BETWEEN 1 AND 2 THEN '轻度付费'
    ELSE '重度付费'
  END AS order_type
FROM users u
LEFT JOIN orders o
  ON u.user_id = o.user_id
 AND o.status = 'paid'
GROUP BY u.user_id
ORDER BY u.user_id;
```

**4.**
```sql
SELECT
  channel,
  SUM(CASE WHEN gender = '男' THEN 1 ELSE 0 END) AS male_user_cnt,
  SUM(CASE WHEN gender = '女' THEN 1 ELSE 0 END) AS female_user_cnt
FROM users
GROUP BY channel;
```

### 进阶题参考答案

**5.**
```sql
SELECT
  order_date,
  COUNT(DISTINCT CASE WHEN order_amount < 100 THEN user_id END) AS lt_100_user_cnt,
  COUNT(DISTINCT CASE WHEN order_amount BETWEEN 100 AND 299 THEN user_id END) AS between_100_299_user_cnt,
  COUNT(DISTINCT CASE WHEN order_amount >= 300 THEN user_id END) AS ge_300_user_cnt
FROM orders
WHERE status = 'paid'
GROUP BY order_date
ORDER BY order_date;
```

**6.**
```sql
SELECT
  u.city,
  COUNT(DISTINCT CASE WHEN o.order_id IS NOT NULL THEN u.user_id END) AS ordered_user_cnt,
  COUNT(DISTINCT CASE WHEN o.order_id IS NULL THEN u.user_id END) AS not_ordered_user_cnt
FROM users u
LEFT JOIN orders o
  ON u.user_id = o.user_id
 AND o.status = 'paid'
GROUP BY u.city;
```

**7.**
```sql
SELECT
  v.visit_date,
  COUNT(DISTINCT v.user_id) AS cart_and_paid_user_cnt
FROM visits v
JOIN orders o
  ON v.user_id = o.user_id
 AND v.visit_date = o.order_date
WHERE v.page_name = 'cart'
  AND o.status = 'paid'
GROUP BY v.visit_date
ORDER BY v.visit_date;
```

**8.**
```sql
SELECT
  u.user_id,
  CASE
    WHEN MIN(CASE WHEN o.status = 'paid' THEN o.order_date END) IS NOT NULL
         AND DATEDIFF(MIN(CASE WHEN o.status = 'paid' THEN o.order_date END), u.register_date) <= 7
      THEN '快速转化'
    ELSE '待转化'
  END AS user_tag
FROM users u
LEFT JOIN orders o
  ON u.user_id = o.user_id
GROUP BY u.user_id, u.register_date
ORDER BY u.user_id;
```
