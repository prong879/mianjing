---
title: 综合与面试题
date: 2026-04-26 15:38:28
description: SQL 综合收尾：常见写法与口径错误（WHERE/HAVING、JOIN 去重、漏斗口径等）、综合练习题（TopN、转化、复购、连续活跃、DAU 等）、面试口头追问及参考答案；侧重从会做题到能解释与复盘。
outline: deep
---
# 综合与面试题

目标：从“会做题”进阶到“能解释、能复盘、能面试”。

## 1. 最常见的错误

1. **`WHERE` 和 `HAVING` 混淆**
   - `WHERE`：筛原始数据
   - `HAVING`：筛聚合结果
2. **`COUNT(*)`、`COUNT(1)`、`COUNT(col)` 混淆**
   - `COUNT(*)`：统计总行数
   - `COUNT(1)`：通常与 `COUNT(*)` 等价
   - `COUNT(col)`：只统计该列非空行数
3. **连接后重复计数**
   - 一个用户多笔订单时，连接后会展开成多行，统计用户数时经常要写 `COUNT(DISTINCT user_id)`。
4. **`LEFT JOIN` 误写成 `INNER JOIN`**
   - 若想保留左表全集，右表过滤条件优先放 `ON` 中，而不是放 `WHERE`。
5. **漏斗和转化率口径不清**
   - 真正容易错的往往不是语法，而是口径。一定要先说清：起点是谁、终点是谁、按天算还是按生命周期算、是否去重。

---

## 2. 综合 SQL 练习题

1. 查询每个城市近 30 天支付金额最高的 3 个用户，返回城市、用户 ID、总支付金额、排名。
2. 查询每个渠道注册用户中，7 天内完成支付的转化率。
3. 查询每个类目下复购用户的平均支付金额。
4. 查询连续 3 天都有访问记录的用户 ID。（提示：高级技巧 `DATE_SUB` - `ROW_NUMBER` 构造连续分组键）
5. 查询每天的新增注册用户数、活跃用户数、支付用户数。
6. 查询首单发生在注册 3 天内的用户数，以及占总注册用户数的比例。

---

## 3. 面试高频口头题

请尝试不用看资料，直接口头回答下面的问题：

1. `WHERE` 和 `HAVING` 有什么区别？
2. `INNER JOIN` 和 `LEFT JOIN` 有什么区别？
3. 为什么连接后数据量可能变大？
4. `COUNT(*)`、`COUNT(1)`、`COUNT(col)` 有什么区别？
5. 为什么 `GROUP BY` 后不能随便 `SELECT` 其他未分组、未聚合字段？
6. `ROW_NUMBER()` 和 `RANK()` 的区别是什么？
7. 什么是 DAU？什么是转化率？什么是留存率？
8. 你会如何用 SQL 分析一个页面转化差的问题？

---

## 4. 综合题参考答案

**1.**
```sql
WITH recent_paid AS (
  SELECT
    u.city,
    o.user_id,
    SUM(o.order_amount) AS total_paid_amount
  FROM orders o
  JOIN users u
    ON o.user_id = u.user_id
  WHERE o.status = 'paid'
    AND o.order_date >= DATE_SUB((SELECT MAX(order_date) FROM orders), INTERVAL 29 DAY)
  GROUP BY u.city, o.user_id
),
ranked AS (
  SELECT
    city,
    user_id,
    total_paid_amount,
    ROW_NUMBER() OVER (
      PARTITION BY city
      ORDER BY total_paid_amount DESC, user_id ASC
    ) AS rn
  FROM recent_paid
)
SELECT city, user_id, total_paid_amount, rn AS city_rank
FROM ranked
WHERE rn <= 3
ORDER BY city, city_rank;
```

**2.**
```sql
SELECT
  u.channel,
  COUNT(DISTINCT u.user_id) AS register_user_cnt,
  COUNT(DISTINCT CASE
    WHEN o.order_id IS NOT NULL
     AND o.order_date BETWEEN u.register_date AND DATE_ADD(u.register_date, INTERVAL 7 DAY)
    THEN u.user_id
  END) AS pay_in_7d_user_cnt,
  ROUND(
    COUNT(DISTINCT CASE
      WHEN o.order_id IS NOT NULL
       AND o.order_date BETWEEN u.register_date AND DATE_ADD(u.register_date, INTERVAL 7 DAY)
      THEN u.user_id
    END) / COUNT(DISTINCT u.user_id),
    4
  ) AS pay_in_7d_rate
FROM users u
LEFT JOIN orders o
  ON u.user_id = o.user_id
 AND o.status = 'paid'
GROUP BY u.channel;
```

**3.**
```sql
WITH repurchase_user AS (
  SELECT user_id
  FROM orders
  WHERE status = 'paid'
  GROUP BY user_id
  HAVING COUNT(*) >= 2
)
SELECT
  p.category,
  AVG(o.order_amount) AS avg_paid_order_amount
FROM orders o
JOIN products p
  ON o.product_id = p.product_id
JOIN repurchase_user r
  ON o.user_id = r.user_id
WHERE o.status = 'paid'
GROUP BY p.category;
```

**4.**
```sql
WITH distinct_visit AS (
  SELECT DISTINCT user_id, visit_date
  FROM visits
),
flagged AS (
  SELECT
    user_id,
    visit_date,
    DATE_SUB(
      visit_date,
      INTERVAL ROW_NUMBER() OVER (
        PARTITION BY user_id
        ORDER BY visit_date
      ) DAY
    ) AS grp_key
  FROM distinct_visit
)
SELECT DISTINCT user_id
FROM (
  SELECT
    user_id,
    grp_key,
    COUNT(*) AS consecutive_days
  FROM flagged
  GROUP BY user_id, grp_key
  HAVING COUNT(*) >= 3
) t;
```

**5.**
```sql
WITH reg AS (
  SELECT register_date AS dt, COUNT(*) AS new_register_user_cnt
  FROM users
  GROUP BY register_date
),
active AS (
  SELECT visit_date AS dt, COUNT(DISTINCT user_id) AS active_user_cnt
  FROM visits
  GROUP BY visit_date
),
pay AS (
  SELECT order_date AS dt, COUNT(DISTINCT user_id) AS paid_user_cnt
  FROM orders
  WHERE status = 'paid'
  GROUP BY order_date
),
all_dt AS (
  SELECT register_date AS dt FROM users
  UNION
  SELECT visit_date AS dt FROM visits
  UNION
  SELECT order_date AS dt FROM orders WHERE status = 'paid'
)
SELECT
  d.dt,
  COALESCE(r.new_register_user_cnt, 0) AS new_register_user_cnt,
  COALESCE(a.active_user_cnt, 0) AS active_user_cnt,
  COALESCE(p.paid_user_cnt, 0) AS paid_user_cnt
FROM all_dt d
LEFT JOIN reg r
  ON d.dt = r.dt
LEFT JOIN active a
  ON d.dt = a.dt
LEFT JOIN pay p
  ON d.dt = p.dt
ORDER BY d.dt;
```

**6.**
```sql
WITH first_paid AS (
  SELECT
    user_id,
    MIN(order_date) AS first_paid_date
  FROM orders
  WHERE status = 'paid'
  GROUP BY user_id
)
SELECT
  COUNT(DISTINCT CASE
    WHEN fp.first_paid_date BETWEEN u.register_date AND DATE_ADD(u.register_date, INTERVAL 3 DAY)
    THEN u.user_id
  END) AS pay_in_3d_user_cnt,
  COUNT(DISTINCT u.user_id) AS total_register_user_cnt,
  ROUND(
    COUNT(DISTINCT CASE
      WHEN fp.first_paid_date BETWEEN u.register_date AND DATE_ADD(u.register_date, INTERVAL 3 DAY)
      THEN u.user_id
    END) / COUNT(DISTINCT u.user_id),
    4
  ) AS pay_in_3d_rate
FROM users u
LEFT JOIN first_paid fp
  ON u.user_id = fp.user_id;
```

---

## 5. 面试口头题参考回答

1. `WHERE` 是对原始数据做过滤，发生在分组之前；`HAVING` 是对分组后的结果做过滤，常和聚合函数一起使用。
2. `INNER JOIN` 只保留两边都能匹配上的记录；`LEFT JOIN` 保留左表全部记录，右表匹配不上时补 `NULL`。分析题里为了保留全部用户看分布，常用 `LEFT JOIN`。
3. 因为连接关系可能是一对多，比如一个用户对应多笔订单。连接后原来一行用户数据会被展开成多行。
4. `COUNT(*)` 统计行数，`COUNT(1)` 通常与它等价；`COUNT(col)` 只统计该列非空的行数。
5. 因为 `GROUP BY` 之后，每组应该只返回确定的聚合结果。如果字段未分组、未聚合，在一组里可能有多个取值，数据库不知道该返回哪一个。
6. `ROW_NUMBER()` 不管是否并列，都会给唯一顺序；`RANK()` 遇到并列会给相同名次，并导致后续名次跳号。
7. **DAU** 是日活跃用户数，按天统计访问/活跃的去重用户；**转化率**是完成目标行为的人数除以起始行为人数；**留存率**是某批用户在未来某天或某周期内仍然回来的比例。
8. 分析页面转化差，我会先定义转化链路和分子分母（如访问该页面人数 -> 点击下一步人数 -> 最终转化人数）；然后按页面、渠道、新老用户类型等维度拆分，对比差异，找出流失最严重的环节。
