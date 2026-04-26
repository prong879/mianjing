---
title: "高频业务指标与场景题"
outline: deep
---

# 高频业务指标与场景专项

目标：贴近数据分析实习、产品经理实习的真实工作场景，从“会做题”进阶到“理解指标体系”。

## 1. 高频业务指标定义

### 1.1 DAU (日活跃用户数)
定义：当日至少访问 1 次的去重用户数。

```sql
SELECT
  visit_date,
  COUNT(DISTINCT user_id) AS dau
FROM visits
GROUP BY visit_date
ORDER BY visit_date;
```

### 1.2 GMV (商品交易总额)
定义：支付订单金额总和，一般只统计 `paid` 状态。

```sql
SELECT
  order_date,
  SUM(order_amount) AS paid_gmv
FROM orders
WHERE status = 'paid'
GROUP BY order_date;
```

### 1.3 支付转化率
定义前一定先说清：分子和分母。
- 分母：访问用户数
- 分子：支付用户数

```sql
WITH visit_user AS (
  SELECT visit_date AS dt, COUNT(DISTINCT user_id) AS visit_user_cnt
  FROM visits
  GROUP BY visit_date
),
paid_user AS (
  SELECT order_date AS dt, COUNT(DISTINCT user_id) AS paid_user_cnt
  FROM orders
  WHERE status = 'paid'
  GROUP BY order_date
)
SELECT
  v.dt,
  v.visit_user_cnt,
  COALESCE(p.paid_user_cnt, 0) AS paid_user_cnt,
  ROUND(COALESCE(p.paid_user_cnt, 0) / v.visit_user_cnt, 4) AS pay_conversion_rate
FROM visit_user v
LEFT JOIN paid_user p
  ON v.dt = p.dt
ORDER BY v.dt;
```

### 1.4 次日留存
定义：某天注册的用户里，第二天还有访问的比例。

```sql
WITH cohort AS (
  SELECT user_id, register_date
  FROM users
  WHERE register_date = '2025-03-01'
)
SELECT
  COUNT(DISTINCT c.user_id) AS cohort_user_cnt,
  COUNT(DISTINCT v.user_id) AS retained_user_cnt,
  ROUND(COUNT(DISTINCT v.user_id) / COUNT(DISTINCT c.user_id), 4) AS next_day_retention_rate
FROM cohort c
LEFT JOIN visits v
  ON c.user_id = v.user_id
 AND v.visit_date = DATE_ADD(c.register_date, INTERVAL 1 DAY);
```

### 1.5 复购
定义：支付订单数大于等于 2 的用户。

```sql
SELECT COUNT(*) AS repurchase_user_cnt
FROM (
  SELECT user_id
  FROM orders
  WHERE status = 'paid'
  GROUP BY user_id
  HAVING COUNT(*) >= 2
) t;
```

### 1.6 漏斗转化
常见链路：`register` -> `view_detail` -> `add_cart` -> `pay_success`。

```sql
SELECT
  COUNT(DISTINCT CASE WHEN event_name = 'register' THEN user_id END) AS register_user_cnt,
  COUNT(DISTINCT CASE WHEN event_name = 'view_detail' THEN user_id END) AS view_detail_user_cnt,
  COUNT(DISTINCT CASE WHEN event_name = 'add_cart' THEN user_id END) AS add_cart_user_cnt,
  COUNT(DISTINCT CASE WHEN event_name = 'pay_success' THEN user_id END) AS pay_success_user_cnt
FROM events;
```

---

## 2. 必会知识点

- **日期偏移**：留存题经常要把“今天的用户”和“明天还来的用户”对应起来，因此常用日期加减来判断是否回访。`DATE_ADD(日期, INTERVAL n DAY)` 表示加 `n` 天。
- **`DATEDIFF` 函数**：`DATEDIFF(A, B)` 是 A 的日期减 B 的日期（天数）。
- **`COALESCE` 处理空值**：`COALESCE(表达式, 0)` 可避免“某天没有支付用户”时的 `NULL` 导致除法或展示出错。
- **转化率与保留小数**：`ROUND(数值, 4)` 经常用来保留 4 位小数率值。

---

## 3. 练习题：数据分析方向

1. 统计每天的 DAU，定义为当日至少访问 1 次的去重用户数。
2. 统计每天的支付转化率。
   - 分母：当日访问用户数
   - 分子：当日支付用户数
3. 统计每个渠道的用户首单转化人数。
4. 统计每个类目的支付金额、支付订单数、支付用户数。
5. 统计 2025-03-01 注册用户的次日留存率。
6. 统计复购用户数，定义为支付订单数大于等于 2 的用户数。

---

## 4. 练习题：产品经理方向

7. 统计注册到支付成功的转化漏斗人数：`register`, `view_detail`, `add_cart`, `pay_success`。
8. 统计每个页面的访问 UV，并找出 UV 最高的页面。
9. 统计新用户和老用户的支付转化率差异。
   - 新用户：注册 7 天内（访问日距注册日 ≤ 6）
   - 老用户：注册超过 7 天
10. 统计访问过 `detail` 页面后 3 天内支付成功的用户数。
11. 统计每个渠道的首周留存用户数（第 1 到 7 天的回访）。
12. 分析 `cart` 页面是否可能存在问题：
   - 先统计访问 `cart` 页面用户数
   - 再统计访问 `cart` 后当天支付成功用户数
   - 计算转化率

---

## 5. 自查点

做完后复盘：
- 你是否先写清了指标定义（分子和分母分别是谁），再开始写 SQL？
- 你是否知道留存题里通常需要自连接或日期偏移？

---

## 6. 参考答案

### 数据分析方向

**1.** (见 1.1 DAU 模板)

**2.** (见 1.3 支付转化率模板)

**3.**
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
  u.channel,
  COUNT(fp.user_id) AS first_order_user_cnt
FROM users u
JOIN first_paid fp
  ON u.user_id = fp.user_id
GROUP BY u.channel
ORDER BY first_order_user_cnt DESC;
```

**4.**
```sql
SELECT
  p.category,
  SUM(o.order_amount) AS paid_gmv,
  COUNT(o.order_id) AS paid_order_cnt,
  COUNT(DISTINCT o.user_id) AS paid_user_cnt
FROM orders o
JOIN products p
  ON o.product_id = p.product_id
WHERE o.status = 'paid'
GROUP BY p.category
ORDER BY paid_gmv DESC;
```

**5.** (见 1.4 次日留存模板)

**6.** (见 1.5 复购模板)

### 产品经理方向

**7.** (见 1.6 漏斗转化模板)

**8.**
```sql
SELECT
  page_name,
  COUNT(DISTINCT user_id) AS uv
FROM visits
GROUP BY page_name
ORDER BY uv DESC, page_name;
```

**9.**
```sql
WITH visit_tag AS (
  SELECT DISTINCT
    v.visit_date,
    v.user_id,
    CASE
      WHEN DATEDIFF(v.visit_date, u.register_date) <= 6 THEN '新用户'
      ELSE '老用户'
    END AS user_group
  FROM visits v
  JOIN users u
    ON v.user_id = u.user_id
),
paid_tag AS (
  SELECT DISTINCT
    order_date,
    user_id
  FROM orders
  WHERE status = 'paid'
)
SELECT
  vt.user_group,
  COUNT(DISTINCT vt.user_id) AS visit_user_cnt,
  COUNT(DISTINCT CASE WHEN pt.user_id IS NOT NULL THEN vt.user_id END) AS paid_user_cnt,
  ROUND(
    COUNT(DISTINCT CASE WHEN pt.user_id IS NOT NULL THEN vt.user_id END) /
    COUNT(DISTINCT vt.user_id),
    4
  ) AS pay_conversion_rate
FROM visit_tag vt
LEFT JOIN paid_tag pt
  ON vt.user_id = pt.user_id
 AND vt.visit_date = pt.order_date
GROUP BY vt.user_group;
```

**10.**
```sql
SELECT COUNT(DISTINCT v.user_id) AS detail_to_pay_user_cnt
FROM visits v
JOIN orders o
  ON v.user_id = o.user_id
WHERE v.page_name = 'detail'
  AND o.status = 'paid'
  AND o.order_date BETWEEN v.visit_date AND DATE_ADD(v.visit_date, INTERVAL 3 DAY);
```

**11.**
```sql
SELECT
  u.channel,
  COUNT(DISTINCT CASE WHEN v.user_id IS NOT NULL THEN u.user_id END) AS week1_retained_user_cnt
FROM users u
LEFT JOIN visits v
  ON u.user_id = v.user_id
 AND v.visit_date BETWEEN DATE_ADD(u.register_date, INTERVAL 1 DAY)
                      AND DATE_ADD(u.register_date, INTERVAL 7 DAY)
GROUP BY u.channel;
```

**12.**
```sql
WITH cart_user AS (
  SELECT DISTINCT visit_date, user_id
  FROM visits
  WHERE page_name = 'cart'
),
paid_user AS (
  SELECT DISTINCT order_date, user_id
  FROM orders
  WHERE status = 'paid'
)
SELECT
  c.visit_date,
  COUNT(DISTINCT c.user_id) AS cart_user_cnt,
  COUNT(DISTINCT CASE WHEN p.user_id IS NOT NULL THEN c.user_id END) AS paid_user_cnt,
  ROUND(
    COUNT(DISTINCT CASE WHEN p.user_id IS NOT NULL THEN c.user_id END) /
    COUNT(DISTINCT c.user_id),
    4
  ) AS cart_pay_conversion_rate
FROM cart_user c
LEFT JOIN paid_user p
  ON c.user_id = p.user_id
 AND c.visit_date = p.order_date
GROUP BY c.visit_date
ORDER BY c.visit_date;
```
