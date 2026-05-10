---
title: 学习目标与练习环境
date: 2026-04-26 15:38:28
description: SQL 学习环境约定与阶段目标：能独立写常见业务分析题（DAU、留存、转化等），并能在面试中信手解释写法与基本概念。
outline: deep
---
# 学习目标与练习环境

## 1. 学习目标

这份讲义基于你当前的 SQL 学习内容整理，目标不是覆盖所有数据库理论，而是帮你快速达到：

- 能独立写出常见分析 SQL
- 能完成 DAU、留存、转化、Top N、复购等业务题
- 能在面试里解释 SQL 思路和常见概念

适用方向：
- 数据分析实习
- 产品经理实习

---

## 2. 练习环境与业务表

下面的题目默认基于这几张表，不要求你真的建库，但做题时要始终明确字段含义。

### 2.1 数据库

- 数据库名：`sql_practice`
- 主要表：`users`、`visits`、`orders`、`products`、`events`

### 2.2 表含义

#### `users`
- `user_id`：用户 ID
- `register_date`：注册日期
- `city`：城市
- `channel`：注册渠道，如 `app_store`、`xiaohongshu`、`douyin`
- `gender`：性别

#### `visits`
- `visit_id`：访问 ID
- `user_id`：用户 ID
- `visit_date`：访问日期
- `page_name`：页面名，如 `home`、`detail`、`cart`
- `device_type`：设备类型，如 `ios`、`android`

#### `orders`
- `order_id`：订单 ID
- `user_id`：用户 ID
- `order_date`：下单日期
- `order_amount`：订单金额
- `status`：订单状态，常见值有 `paid`、`cancelled`
- `product_id`：商品 ID

#### `products`
- `product_id`：商品 ID
- `product_name`：商品名
- `category`：类目
- `price`：商品单价

#### `events`
- `event_id`：事件 ID
- `user_id`：用户 ID
- `event_date`：事件日期
- `event_name`：事件名，如 `register`、`view_detail`、`add_cart`、`pay_success`
- `page_name`：页面名

---

## 3. 做题前先想清楚

看到一道业务或面试分析题，先问自己 4 个问题：

1. **统计对象是谁**：是用户、订单、商品还是事件？
2. **需要哪张表**：是否要多表连接？
3. **分组维度是什么**：是日期、城市、渠道还是类目？
4. **有没有重复计数风险**：是否需要 `DISTINCT`？

---

## 4. SQL 执行顺序

写 SQL 时建议脑中按这个顺序理解：

1. `FROM` / `JOIN`
2. `ON`
3. `WHERE`
4. `GROUP BY`
5. **聚合函数计算**
6. `HAVING`
7. `SELECT`
8. `ORDER BY`
9. `LIMIT`

这能帮助你理解：
- 为什么 `WHERE` 不能筛聚合结果
- 为什么 `HAVING` 能筛 `COUNT`、`SUM`
- 为什么连接写错会让后续统计全部失真
