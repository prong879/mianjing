---
title: 一、SQL 与数据库习题
date: 2026-04-26 18:12:01
description: 数分/商分向 SQL 真题与习作合集：分组聚合、留存与漏斗、窗口函数与 TopN、连续活跃、长宽表与 Hive 拆分、DAU/GMV/复购等业务场景；题面已从口语整理为标准笔试表述并附参考 SQL，表字段可按实际替换。可先对照知识库 SQL 总览系统复习。
outline: deep
---
> 维护说明：请直接在 docs/ 目录维护本页内容。

### 一、SQL 与数据库习题

以下 SQL 题目里，原始表述有些比较口语化，我这里按常见笔试风格补全成更标准的题面，并给出参考写法。实际做题时，字段名和表名可以替换。

补充入口：

- 若你希望先搭建知识框架，再刷题，先看 [`SQL 与数据库基础总览`](/knowledge/01-data-infrastructure/sql/overview) 及其下的各个模块化讲义。

### 按分类筛选并计算数量

**题目（推断补全版）**：

现有商品表 `products`，字段包括：

- `product_id`
- `product_name`
- `category`

请查询 `category` 为 `'数码'` 和 `'家电'` 的商品数量，并按分类汇总。

**参考 SQL**：

```sql
select
    category,
    count(*) as product_cnt
from products
where category in ('数码', '家电')
group by category;
```

**考点**：

- `where` 条件筛选
- `group by` 分组聚合
- `count(*)` 计数

- **多表关联后分组求金额总和并排序**

**题目（推断补全版）**：

现有订单表 `orders`：

- `order_id`
- `user_id`
- `amount`
- `order_date`

现有用户表 `users`：

- `user_id`
- `city`

请统计各城市用户的订单总金额，并按总金额从高到低排序。

**参考 SQL**：

```sql
select
    u.city,
    sum(o.amount) as total_amount
from orders o
join users u
    on o.user_id = u.user_id
group by u.city
order by total_amount desc;
```

**考点**：

- `join` 多表关联
- `sum()` 聚合
- 分组后排序

> **参考回答**：本题已在上方通过 SQL 代码块和关键考点说明提供完整解答。

- **计算次日留存率**

**题目（标准高频版）**：

现有登录表 `user_login`：

- `user_id`
- `login_date`

请按日期统计用户次日留存率。

**参考 SQL**：

```sql
with d1 as (
    select distinct
        user_id,
        login_date
    from user_login
),
d2 as (
    select
        a.login_date,
        count(distinct a.user_id) as active_users,
        count(distinct b.user_id) as retained_users
    from d1 a
    left join d1 b
        on a.user_id = b.user_id
       and datediff(b.login_date, a.login_date) = 1
    group by a.login_date
)
select
    login_date,
    active_users,
    retained_users,
    round(retained_users * 1.0 / active_users, 4) as next_day_retention
from d2
order by login_date;
```

**说明**：

- 分母是某天活跃用户数
- 分子是这些用户中第二天又登录的人数
- 要注意先去重，否则同一用户一天多次登录会重复计数

> **参考回答**：本题已在上方通过 SQL 代码块和关键考点说明提供完整解答。

### 处理字段后筛选月份，按用户去重计数并过滤

**题目（推断补全版）**：

现有行为表 `user_action`：

- `user_id`
- `event_time`
- `channel`

请将 `channel` 为空的值记为 `'unknown'`，筛选 `2024-03` 的数据，统计每个渠道的去重用户数，并保留去重用户数大于等于 `100` 的渠道。

**参考 SQL**：

```sql
select
    case
        when channel is null or channel = '' then 'unknown'
        else channel
    end as channel_clean,
    count(distinct user_id) as uv
from user_action
where date_format(event_time, '%Y-%m') = '2024-03'
group by
    case
        when channel is null or channel = '' then 'unknown'
        else channel
    end
having count(distinct user_id) >= 100
order by uv desc;
```

**考点**：

- `case when` 字段清洗
- 月份筛选
- `count(distinct ...)`
- `having` 过滤聚合结果

### SQL 练习时常见追问

- 为什么这里要用 `having`，不能直接用 `where`？
- 为什么留存题要先 `distinct`？
- `left join` 和 `inner join` 会对结果造成什么差异？
- `datediff()`、`date_format()`、`substr()` 各适合什么场景？

- **行转列题：按 `income_type` 展开为多个金额字段**

**题目（根据面经补全）**：

现有收益表 `b`，字段如下：

- `author_id`
- `income_type`
- `amount`

其中 `income_type` 可能取值为 `income_1`、`income_2`、`income_3` 以及其他类型。请将表按作者聚合，输出：

- `author_id`
- `income_1_amount`
- `income_2_amount`
- `income_3_amount`
- `qita_amount`

**参考 SQL**：

```sql
select
    author_id,
    sum(case when income_type = 'income_1' then amount else 0 end) as income_1_amount,
    sum(case when income_type = 'income_2' then amount else 0 end) as income_2_amount,
    sum(case when income_type = 'income_3' then amount else 0 end) as income_3_amount,
    sum(case when income_type not in ('income_1', 'income_2', 'income_3') then amount else 0 end) as qita_amount
from b
group by author_id;
```

**考点**：

- 条件聚合
- “行转列”本质上通常是 `case when + group by`
- 要注意“其他类型”是否包含 `null`

> **参考回答**：本题已在上方通过 SQL 代码块和关键考点说明提供完整解答。

- **窗口函数题：三种排序函数的区别**

**题目**：

请说明 `row_number()`、`rank()`、`dense_rank()` 的区别。

> **参考回答**：
> - `row_number()`：直接连续编号，不会并列。即使值相同，也会给不同名次。
> - `rank()`：允许并列，但并列后会跳名次。例如 `1, 1, 3`。
> - `dense_rank()`：允许并列，并列后不跳名次。例如 `1, 1, 2`。
> **示例**：
>
> 如果分数是 `100, 100, 90`，那么三者结果分别是：
> - `row_number()`：`1, 2, 3`
> - `rank()`：`1, 1, 3`
> - `dense_rank()`：`1, 1, 2`
>
### 面经推断题：短视频行为表三道 SQL

**题目背景（根据截图推断）**：

现有短视频消费表 `table_1`，字段包括：

- `p_date`：日期分区，格式为 `yyyyMMdd`
- `user_id`
- `photo_id`
- `author_id`
- `class_name`：作者所属垂类，如美食、生活、美妆
- `play_duration`：该次曝光带来的播放时长，单位毫秒

下面三题来自面经截图，原题有些模糊，这里按最常见问法补全。

**第 1 题：昨天每个垂类的活跃用户数（用户在该垂类下当天累计观看时长至少 10 分钟）**

```sql
with user_class_play as (
    select
        p_date,
        class_name,
        user_id,
        sum(play_duration) as total_play_duration
    from table_1
    where p_date = date_format(date_sub(current_date, 1), 'yyyyMMdd')
    group by p_date, class_name, user_id
)
select
    class_name,
    count(*) as active_user_cnt
from user_class_play
where total_play_duration >= 10 * 60 * 1000
group by class_name;
```

**第 2 题：昨天每个垂类中，按用户总播放时长排序的前 100 个作者**

这里常见有两种理解，一种是“作者被看总时长前 100”，一种是“每个用户看得最多的前 100 个作者”。面经里更常见的是前者。

```sql
with author_play as (
    select
        class_name,
        author_id,
        sum(play_duration) as total_play_duration
    from table_1
    where p_date = date_format(date_sub(current_date, 1), 'yyyyMMdd')
    group by class_name, author_id
),
ranked_author as (
    select
        class_name,
        author_id,
        total_play_duration,
        row_number() over (
            partition by class_name
            order by total_play_duration desc
        ) as rn
    from author_play
)
select
    class_name,
    author_id,
    total_play_duration
from ranked_author
where rn <= 100;
```

**第 3 题：上月每个垂类中连续活跃 7 天的用户数**

这里“活跃”仍按“当天该垂类累计观看至少 10 分钟”理解。

```sql
with daily_active as (
    select
        p_date,
        class_name,
        user_id
    from table_1
    where substr(p_date, 1, 6) = date_format(add_months(current_date, -1), 'yyyyMM')
    group by p_date, class_name, user_id
    having sum(play_duration) >= 10 * 60 * 1000
),
tagged as (
    select
        p_date,
        class_name,
        user_id,
        date_sub(to_date(from_unixtime(unix_timestamp(p_date, 'yyyyMMdd'))), row_number() over (
            partition by class_name, user_id
            order by p_date
        )) as grp
    from daily_active
),
streak as (
    select
        class_name,
        user_id,
        count(*) as continuous_days
    from tagged
    group by class_name, user_id, grp
)
select
    class_name,
    count(distinct user_id) as user_cnt
from streak
where continuous_days >= 7
group by class_name;
```

**说明**：

- 这类题的关键是先把“活跃”的业务口径转成天级别用户标签
- 连续天数问题通常用“日期减行号”分组法
- 真正面试时如果 SQL 方言不同，可以把日期函数替换成对应数据库版本

### 电商 SQL 题：计算 `2023` 年 `618` 期间每个品类 `GMV` 同比增长率，取 `Top3`

**题目（补全版）**：

现有订单表 `orders`，字段包括：

- `order_id`
- `category_id`
- `pay_amount`
- `pay_date`

请计算 `2023` 年 `618` 大促期间每个品类的 `GMV` 同比增长率，并取增长率最高的 `Top3` 品类。

这里可先约定 `618` 周期为每年 `06-01` 到 `06-18`。

**参考 SQL**：

```sql
with gmv_2023 as (
    select
        category_id,
        sum(pay_amount) as gmv_2023
    from orders
    where pay_date between '2023-06-01' and '2023-06-18'
    group by category_id
),
gmv_2022 as (
    select
        category_id,
        sum(pay_amount) as gmv_2022
    from orders
    where pay_date between '2022-06-01' and '2022-06-18'
    group by category_id
)
select
    a.category_id,
    a.gmv_2023,
    b.gmv_2022,
    round((a.gmv_2023 - b.gmv_2022) * 1.0 / nullif(b.gmv_2022, 0), 4) as yoy_growth
from gmv_2023 a
join gmv_2022 b
    on a.category_id = b.category_id
order by yoy_growth desc
limit 3;
```

**考点**：

- 同比口径对齐
- 聚合后再做增长率计算
- `nullif()` 防止除零错误

### 电商 SQL 题：找出连续 `3` 天下单且日均消费超过 `100` 元的用户

**题目（补全版）**：

现有订单表 `orders`，字段包括：

- `user_id`
- `order_date`
- `pay_amount`

请找出满足以下条件的用户：

- 连续 `3` 天都有下单
- 这连续 `3` 天的日均消费金额大于 `100` 元

**参考 SQL**：

```sql
with daily_order as (
    select
        user_id,
        order_date,
        sum(pay_amount) as daily_amount
    from orders
    group by user_id, order_date
),
tagged as (
    select
        user_id,
        order_date,
        daily_amount,
        date_sub(order_date, row_number() over (
            partition by user_id
            order by order_date
        )) as grp
    from daily_order
),
streak as (
    select
        user_id,
        grp,
        count(*) as continuous_days,
        avg(daily_amount) as avg_daily_amount
    from tagged
    group by user_id, grp
)
select distinct
    user_id
from streak
where continuous_days >= 3
  and avg_daily_amount > 100;
```

**说明**：

- 先按天汇总，否则一天多笔订单会干扰连续天数判断
- 连续天数问题还是经典的“日期减行号”思路
- 如果题目要求“恰好连续 3 天”，需要再改过滤条件

### 电商 SQL 题常见追问

- `GMV` 同比时，如果去年该品类 `GMV = 0` 怎么处理？
- 连续下单题里，一天多笔订单应该先聚合还是直接算？
- 如果题目要求按自然日而不是支付日，口径会怎么变？

### 基础 SQL 题：学生成绩表综合练习

**题目（根据面经补全）**：

现有两张表：

`score_table`

- `name`
- `subject`
- `score`

`class_table`

- `class`
- `name`

请写 SQL 完成以下统计：

1. 统计出每个人的最高分数
2. 统计有多少人三科成绩都大于 `80`
3. 统计每个学科第二名是谁（没有并列）
4. 统计每个班级的每门课平均分

**1）每个人的最高分数**

```sql
select
    name,
    max(score) as max_score
from score_table
group by name;
```

**2）有多少人三科成绩都大于 `80`**

```sql
select
    count(*) as user_cnt
from (
    select
        name
    from score_table
    group by name
    having min(score) > 80
) t;
```

**3）每个学科第二名是谁**

```sql
with ranked_score as (
    select
        subject,
        name,
        score,
        row_number() over (
            partition by subject
            order by score desc
        ) as rn
    from score_table
)
select
    subject,
    name,
    score
from ranked_score
where rn = 2;
```

**4）每个班级的每门课平均分**

```sql
select
    c.class,
    s.subject,
    avg(s.score) as avg_score
from score_table s
join class_table c
    on s.name = c.name
group by c.class, s.subject;
```

### 留存 SQL 题：每日新注册用户的次留、三留、七留

**题目（补全版）**：

现有登录表 `login_table`：

- `user_id`
- `log_time`

现有注册表 `user_table`：

- `user_id`
- `register_date`

请统计每日新注册用户的次留、三留、七留。

**参考 SQL**：

```sql
with reg as (
    select
        user_id,
        register_date
    from user_table
),
login_d as (
    select distinct
        user_id,
        date(log_time) as log_date
    from login_table
),
retention as (
    select
        r.register_date,
        count(distinct r.user_id) as new_users,
        count(distinct case when datediff(l.log_date, r.register_date) = 1 then r.user_id end) as d1_users,
        count(distinct case when datediff(l.log_date, r.register_date) = 3 then r.user_id end) as d3_users,
        count(distinct case when datediff(l.log_date, r.register_date) = 7 then r.user_id end) as d7_users
    from reg r
    left join login_d l
        on r.user_id = l.user_id
    group by r.register_date
)
select
    register_date,
    new_users,
    round(d1_users * 1.0 / new_users, 4) as d1_retention,
    round(d3_users * 1.0 / new_users, 4) as d3_retention,
    round(d7_users * 1.0 / new_users, 4) as d7_retention
from retention
order by register_date;
```

### 留存 SQL 题：每个用户最大连续登录时长

**题目**：

现有登录表 `login_table`，字段包括：

- `user_id`
- `log_time`

请统计每个用户的最大连续登录天数。

**参考 SQL**：

```sql
with login_d as (
    select distinct
        user_id,
        date(log_time) as log_date
    from login_table
),
tagged as (
    select
        user_id,
        log_date,
        date_sub(log_date, row_number() over (
            partition by user_id
            order by log_date
        )) as grp
    from login_d
),
streak as (
    select
        user_id,
        count(*) as continuous_days
    from tagged
    group by user_id, grp
)
select
    user_id,
    max(continuous_days) as max_continuous_days
from streak
group by user_id;
```

- **海外区域运营 SQL 题：每天每个国家收入前十的司机及其工作时长**

**题目（补全版）**：

现有司机工作表 `driver_table`：

- `date`
- `country`
- `driver_id`
- `working_hour`

现有收入表 `income_table`：

- `date`
- `country`
- `driver_id`
- `order_id`
- `income`

请统计每天每个国家收入前十的司机，以及他们当天的工作时长。

**参考 SQL**：

```sql
with driver_income as (
    select
        date,
        country,
        driver_id,
        sum(income) as total_income
    from income_table
    group by date, country, driver_id
),
ranked_driver as (
    select
        date,
        country,
        driver_id,
        total_income,
        row_number() over (
            partition by date, country
            order by total_income desc
        ) as rn
    from driver_income
)
select
    r.date,
    r.country,
    r.driver_id,
    r.total_income,
    d.working_hour
from ranked_driver r
left join driver_table d
    on r.date = d.date
   and r.country = d.country
   and r.driver_id = d.driver_id
where r.rn <= 10;
```

> **参考回答**：本题已在上方通过 SQL 代码块和关键考点说明提供完整解答。

- **SQL 基础追问：`left join` 和 `inner join` 的区别是什么？如何找重复值？**

> **参考回答**：
>
> `left join` 和 `inner join` 的核心区别在于保留哪部分数据：
> - `inner join` 只保留两张表都能匹配上的记录
> - `left join` 会保留左表全部记录，右表匹配不到的字段补 `null`
>
> **找重复值的常见写法**：
>
> ```sql
> select
>     user_id,
>     count(*) as cnt
> from user_table
> group by user_id
> having count(*) > 1;
> ```
>
> 如果要看完整重复明细，可以先找出重复键，再回表：
>
> ```sql
> with dup as (
>     select user_id
>     from user_table
>     group by user_id
>     having count(*) > 1
> )
> select t.*
> from user_table t
> inner join dup d
>     on t.user_id = d.user_id;
> ```
>
> 连接题要先讲清楚保留范围，重复值题要先用 `group by` 和 `having count(*) > 1` 找重复键，再根据需要回表看明细。
>
### 内容平台 SQL 题：计算连续三天发布且播放量破万的创作者数量

**题目（快手场景整理版）**：

现有短视频发布表 `video_publish`：

- `creator_id`
- `video_id`
- `publish_date`
- `play_cnt`

请计算连续 `3` 天都有发布视频、且每天总播放量都超过 `10000` 的创作者数量。

**参考 SQL**：

```sql
with daily_creator as (
    select
        creator_id,
        publish_date,
        sum(play_cnt) as daily_play_cnt
    from video_publish
    group by creator_id, publish_date
),
qualified_day as (
    select
        creator_id,
        publish_date
    from daily_creator
    where daily_play_cnt > 10000
),
tagged as (
    select
        creator_id,
        publish_date,
        date_sub(publish_date, row_number() over (
            partition by creator_id
            order by publish_date
        )) as grp
    from qualified_day
),
streak as (
    select
        creator_id,
        grp,
        count(*) as continuous_days
    from tagged
    group by creator_id, grp
)
select
    count(distinct creator_id) as creator_cnt
from streak
where continuous_days >= 3;
```

**说明**：

- 先按创作者和日期聚合，避免一天多条视频导致连续天数判断错误
- 再筛出单日播放量破万的日期
- 最后用“日期减行号”识别连续日期段

### 旅游平台 SQL 题：统计 2025 年第一季度各目的地预订表现

**题目（携程笔试整理版）**：

某旅游平台需要分析 `2025` 年第一季度的线路预订情况，有两张表：

`tours`（旅游线路表）：

- `tour_id`：线路 ID
- `name`：线路名称
- `destination`：目的地
- `category`：线路分类
- `duration`：行程天数
- `base_price`：基础价格（每人）

`bookings`（用户预订表）：

- `booking_id`：预订 ID
- `tour_id`：线路 ID
- `user_id`：用户 ID
- `booking_date`：预订日期
- `travel_date`：出发日期
- `num_persons`：出行人数
- `discount`：折扣率，`0.1` 表示 `9` 折

查询 `2025-01-01` 至 `2025-03-31` 期间，满足以下条件的目的地：

- 至少有 `2` 条预订记录
- 总预订金额大于等于 `10000`

返回字段：

- `destination`
- `total_bookings`
- `total_revenue`
- `avg_discount`

排序规则：先按 `total_revenue` 降序，再按 `avg_discount` 降序，仍相同则按 `destination` 升序。

**参考 SQL**：

```sql
select
    t.destination,
    count(b.booking_id) as total_bookings,
    round(sum(t.base_price * b.num_persons * (1 - b.discount)), 2) as total_revenue,
    round(avg(b.discount), 2) as avg_discount
from bookings b
inner join tours t
    on b.tour_id = t.tour_id
where b.booking_date between '2025-01-01' and '2025-03-31'
group by t.destination
having count(b.booking_id) >= 2
   and sum(t.base_price * b.num_persons * (1 - b.discount)) >= 10000
order by total_revenue desc, avg_discount desc, t.destination asc;
```

**考点**：

- 先 `join` 明细表和维表
- 按目的地聚合
- `having` 过滤聚合结果
- 金额计算要注意折扣和人数

### 电商 SQL 题：统计各品类销量前三商品并打标签

**题目（携程笔试整理版）**：

某电商平台需要分析 `2025` 年第二季度商品销售情况，有三张表：

`product_info`（商品信息表）：

- `product_id`
- `product_name`
- `category`
- `shop_id`
- `price`

`shop_info`（店铺信息表）：

- `shop_id`
- `shop_name`
- `shop_level`
- `open_date`

`order_detail`（订单明细表）：

- `detail_id`
- `product_id`
- `quantity`
- `pay_amount`
- `order_time`
- `order_status`：`0` 已取消，`1` 已完成，`2` 已退款

查询 `2025-04-01` 至 `2025-06-30` 期间各品类下商品的销售表现，要求：

- 只统计已完成订单，即 `order_status = 1`
- 只统计店铺等级大于等于 `3` 星的店铺商品
- 只保留销售总数量大于等于 `10` 件的商品
- 每个品类取销量排名前三的商品
- 给前三名打标签：第 `1` 名为“爆款”，第 `2` 名为“热销”，第 `3` 名为“畅销”

**参考 SQL**：

```sql
with product_sales as (
    select
        p.category,
        p.product_id,
        p.product_name,
        sum(od.quantity) as total_quantity,
        sum(od.pay_amount) as total_amount
    from order_detail od
    inner join product_info p
        on od.product_id = p.product_id
    inner join shop_info s
        on p.shop_id = s.shop_id
    where od.order_status = 1
      and s.shop_level >= 3
      and od.order_time >= '2025-04-01'
      and od.order_time < '2025-07-01'
    group by p.category, p.product_id, p.product_name
    having sum(od.quantity) >= 10
),
ranked_product as (
    select
        category,
        product_id,
        product_name,
        total_quantity,
        total_amount,
        row_number() over (
            partition by category
            order by total_quantity desc, total_amount desc, product_id asc
        ) as rn
    from product_sales
)
select
    category,
    product_id,
    product_name,
    total_quantity,
    total_amount,
    case rn
        when 1 then '爆款'
        when 2 then '热销'
        when 3 then '畅销'
    end as product_tag
from ranked_product
where rn <= 3
order by category asc, rn asc;
```

**考点**：

- 多表关联：订单明细、商品维表、店铺维表
- 明细过滤：订单状态、时间范围、店铺等级
- 聚合过滤：销量门槛用 `having`
- 组内排名：按品类 `partition by category`

### 汽车换电 SQL 题：找出每个月换电次数排名前十的用户

**题目（蔚来换电场景整理版）**：

现有换电订单表 `swap_order`，字段包括：

- `car_id`：车辆 ID
- `user_id`：用户 ID
- `swap_order_time`：换电下单时间，格式为年月日时分秒

请找出每个月换电次数排名前十的用户 ID。

**参考 SQL**：

```sql
with monthly_user as (
    select
        date_format(swap_order_time, '%Y-%m') as month_id,
        user_id,
        count(*) as swap_cnt
    from swap_order
    group by date_format(swap_order_time, '%Y-%m'), user_id
),
ranked_user as (
    select
        month_id,
        user_id,
        swap_cnt,
        row_number() over (
            partition by month_id
            order by swap_cnt desc, user_id asc
        ) as rn
    from monthly_user
)
select
    month_id,
    user_id,
    swap_cnt
from ranked_user
where rn <= 10
order by month_id asc, rn asc;
```

**口述思路**：

1. 先从换电下单时间里提取月份
2. 按月份和用户聚合，计算每个用户每月换电次数
3. 用窗口函数按月份分组排名
4. 取每个月排名前十的用户

如果面试官追问 `rank()` 和 `row_number()` 的区别，可以说：

> 如果要求严格返回 10 个用户，用 `row_number()`；如果允许并列第十导致返回超过 10 个用户，可以用 `rank()` 或 `dense_rank()`。

### 内容平台 SQL 题：每个月每个城市登录天数 Top3 用户

**题目（字节面经整理版）**：

现有用户登录表 `user_login`，字段包括：

- `user_id`
- `city`
- `login_time`

请统计每个月每个城市登录天数排名前三的用户。

**参考 SQL**：

```sql
with user_login_day as (
    select distinct
        user_id,
        city,
        date_format(login_time, '%Y-%m') as month_id,
        date(login_time) as login_date
    from user_login
),
monthly_user as (
    select
        month_id,
        city,
        user_id,
        count(login_date) as login_days
    from user_login_day
    group by month_id, city, user_id
),
ranked_user as (
    select
        month_id,
        city,
        user_id,
        login_days,
        row_number() over (
            partition by month_id, city
            order by login_days desc, user_id asc
        ) as rn
    from monthly_user
)
select
    month_id,
    city,
    user_id,
    login_days
from ranked_user
where rn <= 3
order by month_id, city, rn;
```

**口述思路**：

- 先把登录时间转成“月份”和“日期”
- 同一天多次登录只算 `1` 个登录天，所以要先 `distinct`
- 按月、城市、用户聚合登录天数
- 用窗口函数在每个月每个城市内排名，取前三

如果允许并列第三返回超过 `3` 个用户，可以把 `row_number()` 换成 `rank()`。

### 游戏业务 SQL 题：近一个月每周至少登录三次且每次游戏时长超过 60 分钟的活跃用户数

**题目（腾讯游戏场景整理版）**：

现有游戏登录行为表 `game_login`，字段包括：

- `user_id`
- `login_time`
- `duration_min`：本次游戏时长，单位分钟

请计算近一个月内，每周至少登录 `3` 次游戏，且每次游戏时长都超过 `60` 分钟的活跃用户数量。

**参考 SQL**：

```sql
with valid_login as (
    select
        user_id,
        yearweek(login_time, 1) as week_id,
        date(login_time) as login_date,
        login_time
    from game_login
    where login_time >= date_sub(current_date, interval 1 month)
      and duration_min > 60
),
weekly_user as (
    select
        user_id,
        week_id,
        count(*) as login_cnt
    from valid_login
    group by user_id, week_id
),
active_user as (
    select distinct
        user_id
    from weekly_user
    where login_cnt >= 3
)
select
    count(distinct user_id) as active_user_cnt
from active_user;
```

**口述思路**：

1. 先筛选近一个月数据，并保留单次游戏时长大于 `60` 分钟的登录记录
2. 把登录时间转成周维度
3. 按用户和周聚合，统计每周有效登录次数
4. 找出任意一周满足至少 `3` 次有效登录的用户
5. 对用户去重计数

如果面试官追问“每周都至少登录三次”而不是“任意一周满足”，可以在 `weekly_user` 后继续统计用户满足条件的周数，并和近一个月覆盖的周数做比较。

### SQL 基础题：用 `user_id` 和日期两个条件关联两张表

**题目（美团商分面经整理版）**：

有两张表：

`user_action`：

- `user_id`
- `dt`
- `action_cnt`

`user_profile_daily`：

- `user_id`
- `dt`
- `city`
- `user_level`

请按 `user_id` 和日期 `dt` 两个条件关联，返回用户当天行为和画像信息。要求写两种方法：一种直接 `join`，一种用子查询。

**写法一：直接 join**

```sql
select
    a.user_id,
    a.dt,
    a.action_cnt,
    p.city,
    p.user_level
from user_action a
left join user_profile_daily p
    on a.user_id = p.user_id
   and a.dt = p.dt;
```

**写法二：先子查询过滤再 join**

```sql
select
    a.user_id,
    a.dt,
    a.action_cnt,
    p.city,
    p.user_level
from (
    select
        user_id,
        dt,
        action_cnt
    from user_action
    where dt between '2025-01-01' and '2025-01-31'
) a
left join (
    select
        user_id,
        dt,
        city,
        user_level
    from user_profile_daily
    where dt between '2025-01-01' and '2025-01-31'
) p
    on a.user_id = p.user_id
   and a.dt = p.dt;
```

**常见追问：日期函数**

- `date(ts)`：从时间戳中取日期
- `date_format(ts, 'yyyy-MM-dd')`：把日期时间格式化成字符串
- `substr(dt, 1, 7)`：从字符串日期中取年月
- `to_date(ts)`：在 Hive 中常用于从时间戳取日期

一句话总结：

> 多条件关联时要把数据粒度讲清楚，如果画像表是用户日粒度，就必须同时用 `user_id` 和日期关联，否则容易把不同时点的画像错配。

### SQL 长宽表转换题：使用 `lateral view explode(split())` 拆分字符串

**题目（美团商分面经整理版）**：

现有宽表 `user_tag_wide`：

- `user_id`
- `tag_list`：用户标签字符串，例如 `'美食,外卖,酒店'`

请把标签拆成一行一个标签的长表，再和标签字典表关联。

**参考 SQL（Hive 写法）**：

```sql
with user_tag_long as (
    select
        user_id,
        tag
    from user_tag_wide
    lateral view explode(split(tag_list, ',')) t as tag
)
select
    l.user_id,
    l.tag,
    d.tag_name,
    d.tag_type
from user_tag_long l
left join tag_dict d
    on l.tag = d.tag_code;
```

**口述思路**：

- `split(tag_list, ',')`：把字符串按分隔符拆成数组
- `explode()`：把数组里的每个元素展开成多行
- `lateral view`：让原表字段和展开后的字段一起保留
- 拆成长表后，再按标签编码关联字典表

这类题本质是在考：你能不能把嵌套或拼接字段转换成标准明细表，方便后续聚合和关联。

- **SQL 基础概念题：Map、JSON、临时表、Hive、`union` 和 `union all`**

**1. 什么是 `map` 数据类型？**

`map` 是键值对结构，例如：

```text
{"city": "北京", "device": "ios"}
```

在 Hive 里可以通过 key 取值，例如 `user_info['city']`。

**2. 什么是 `json` 数据类型？**

`json` 是一种半结构化数据格式，可以表达对象、数组和嵌套结构。SQL 中常用 `get_json_object()`、`json_extract()` 等函数提取字段。

**3. 临时表的优点是什么？**

- 拆解复杂 SQL，提升可读性
- 复用中间结果
- 方便排查每一步数据是否正确
- 在部分场景下减少重复计算

**4. Hive 和传统数据库有什么区别？**

- Hive 更偏离线数仓，适合大规模批处理分析
- 传统数据库更偏在线事务或低延迟查询
- Hive 通常基于分布式存储，查询延迟较高但能处理大数据量
- 数据库更强调事务、索引和实时读写能力

**5. `union` 和 `union all` 的区别是什么？**

- `union` 会去重
- `union all` 不去重，直接合并
- 如果确认上下两部分没有重复，或业务允许重复，优先用 `union all`，性能通常更好

**6. SQL 语句执行顺序是什么？**

常见逻辑执行顺序可以理解为：

> `from` / `join` -> `where` -> `group by` -> `having` -> `select` -> `order by` -> `limit`

注意：

- `where` 发生在聚合前，不能直接筛选聚合结果
- `having` 发生在聚合后，适合筛选 `count()`、`sum()` 等聚合结果
- `select` 中定义的别名，在部分数据库中不能直接被 `where` 使用

一句话总结：

> SQL 概念题不要只背定义，最好能补一句“适用场景”和“性能影响”，这样更像实际写过数仓 SQL。

> **参考回答**：本题已在上方通过 SQL 代码块和关键考点说明提供完整解答。

- **登录 SQL 题：用户登录次数前五；多天多表如何每天取前五？**

**题目**：

有一张登录表 `activate_table`，字段包括：

- `user_id`
- `login_time`

请计算登录次数前五的用户。如果每天都有一张登录表，如何计算每天登录次数前五的用户？

**单表 Top5 写法**：

```sql
select
    user_id,
    count(*) as login_cnt
from activate_table
group by user_id
order by login_cnt desc, user_id asc
limit 5;
```

**多天数据在同一张表时，每天 Top5 写法**：

```sql
with daily_user as (
    select
        date(login_time) as dt,
        user_id,
        count(*) as login_cnt
    from activate_table
    group by date(login_time), user_id
),
ranked_user as (
    select
        dt,
        user_id,
        login_cnt,
        row_number() over (
            partition by dt
            order by login_cnt desc, user_id asc
        ) as rn
    from daily_user
)
select
    dt,
    user_id,
    login_cnt
from ranked_user
where rn <= 5
order by dt, rn;
```

**如果是每天一张表**：

实际工作中更推荐把多天表先通过分区表或 `union all` 合成统一明细，再按上面逻辑计算：

```sql
with all_login as (
    select '2025-04-01' as dt, user_id, login_time from activate_table_20250401
    union all
    select '2025-04-02' as dt, user_id, login_time from activate_table_20250402
),
daily_user as (
    select
        dt,
        user_id,
        count(*) as login_cnt
    from all_login
    group by dt, user_id
),
ranked_user as (
    select
        dt,
        user_id,
        login_cnt,
        row_number() over (
            partition by dt
            order by login_cnt desc, user_id asc
        ) as rn
    from daily_user
)
select
    dt,
    user_id,
    login_cnt
from ranked_user
where rn <= 5;
```

> **参考回答**：本题已在上方通过 SQL 代码块和关键考点说明提供完整解答。

### 留存 SQL 题：七日留存率怎么算？多天每天的留存怎么算？

**题目**：

有用户激活表 `activate_table` 和登录表 `login_table`：

- `activate_table`：`user_id`、`activate_date`
- `login_table`：`user_id`、`login_date`

请计算七日留存率。如果有多天激活用户，如何计算每天的七日留存？

**单日七日留存**：

```sql
select
    count(distinct a.user_id) as activate_users,
    count(distinct l.user_id) as retained_users,
    count(distinct l.user_id) * 1.0 / count(distinct a.user_id) as retention_7d
from activate_table a
left join login_table l
    on a.user_id = l.user_id
   and datediff(l.login_date, a.activate_date) = 7
where a.activate_date = '2025-04-01';
```

**每天的七日留存**：

```sql
select
    a.activate_date,
    count(distinct a.user_id) as activate_users,
    count(distinct l.user_id) as retained_users,
    count(distinct l.user_id) * 1.0 / count(distinct a.user_id) as retention_7d
from activate_table a
left join login_table l
    on a.user_id = l.user_id
   and datediff(l.login_date, a.activate_date) = 7
group by a.activate_date
order by a.activate_date;
```

**口述要点**：

- 留存分母是某天激活或新增用户
- 七日留存分子是这批用户在第 `7` 天又登录的人数
- 如果登录表一天多条记录，需要用 `count(distinct user_id)` 去重
- 多天留存就是按激活日期分组计算

### 内容创作者 SQL 题：连续 10 天发布指定类型视频的创作者

**题目（字节国际化笔试整理版）**：

现有创作者视频发布表 `creator_video`：

- `creator_id`
- `video_id`
- `publish_date`
- `video_type`

请找出连续 `10` 天发布视频，且视频类型 `video_type >= 2` 的创作者。

**参考 SQL**：

```sql
with publish_day as (
    select distinct
        creator_id,
        publish_date
    from creator_video
    where video_type >= 2
),
tagged as (
    select
        creator_id,
        publish_date,
        date_sub(publish_date, row_number() over (
            partition by creator_id
            order by publish_date
        )) as grp
    from publish_day
),
streak as (
    select
        creator_id,
        grp,
        count(*) as continuous_days
    from tagged
    group by creator_id, grp
)
select distinct
    creator_id
from streak
where continuous_days >= 10;
```

**口述思路**：

- 先筛出 `video_type >= 2` 的发布记录
- 同一创作者同一天发多条视频只算一天，所以先 `distinct`
- 用“日期减行号”把连续日期归到同一组
- 聚合后筛出连续天数大于等于 `10` 的创作者

### SQL 行转列题：按收入类型展开作者收入

**题目（快手面经整理版）**：

有一张收入表 `b`：

- `author_id`
- `income_type`：收入类型，可能为 `income_1`、`income_2`、`income_3` 等
- `amount`：收入金额

要求输出：

- `author_id`
- `income_1_amount`
- `income_2_amount`
- `income_3_amount`
- `qita_amount`

其中 `qita_amount` 表示其他收入类型金额。

**参考 SQL**：

```sql
select
    author_id,
    sum(case when income_type = 'income_1' then amount else 0 end) as income_1_amount,
    sum(case when income_type = 'income_2' then amount else 0 end) as income_2_amount,
    sum(case when income_type = 'income_3' then amount else 0 end) as income_3_amount,
    sum(case
            when income_type not in ('income_1', 'income_2', 'income_3')
            then amount
            else 0
        end) as qita_amount
from b
group by author_id;
```

**口述思路**：

- 这题表述里可能说“列转行”，但按输出看实际是“行转列”或透视
- 核心写法是 `sum(case when ... then amount else 0 end)`
- 如果收入类型很多且动态变化，真实工作中可以用数据开发任务或 BI 透视能力处理

### 内容消费 SQL 题：快手垂类活跃、作者播放时长 Top100、连续活跃 7 天

**题目（快手二面整理版）**：

有表 `table_1`：

- `p_date`：日期分区，字符串格式 `yyyyMMdd`
- `user_id`：用户 `ID`
- `photo_id`：视频 `ID`
- `author_id`：作者 `ID`
- `class_name`：作者垂类名称，例如美食、生活、美妆作者
- `play_duration`：曝光带来的播放时长，单位为毫秒

**问题 1：求昨天每个垂类的活跃用户数，活跃定义为该用户昨天消费该垂类视频总时长大于等于 1 分钟。**

```sql
with user_class_day as (
    select
        class_name,
        user_id,
        sum(play_duration) as play_duration_ms
    from table_1
    where p_date = date_format(date_sub(current_date, 1), 'yyyyMMdd')
    group by class_name, user_id
)
select
    class_name,
    count(distinct user_id) as active_user_cnt
from user_class_day
where play_duration_ms >= 60 * 1000
group by class_name;
```

**问题 2：求昨天每个垂类中，总播放时长最长的前 100 个作者。**

```sql
with author_play as (
    select
        class_name,
        author_id,
        sum(play_duration) as total_play_duration_ms
    from table_1
    where p_date = date_format(date_sub(current_date, 1), 'yyyyMMdd')
    group by class_name, author_id
),
ranked as (
    select
        class_name,
        author_id,
        total_play_duration_ms,
        row_number() over (
            partition by class_name
            order by total_play_duration_ms desc
        ) as rn
    from author_play
)
select
    class_name,
    author_id,
    total_play_duration_ms
from ranked
where rn <= 100;
```

**问题 3：求上月每个垂类连续活跃 7 天的用户，活跃定义仍为当天消费该垂类视频总时长大于等于 1 分钟。**

```sql
with user_class_day as (
    select
        class_name,
        user_id,
        to_date(from_unixtime(unix_timestamp(p_date, 'yyyyMMdd'))) as dt,
        sum(play_duration) as play_duration_ms
    from table_1
    where p_date >= date_format(add_months(trunc(current_date, 'MM'), -1), 'yyyyMMdd')
      and p_date < date_format(trunc(current_date, 'MM'), 'yyyyMMdd')
    group by class_name, user_id, to_date(from_unixtime(unix_timestamp(p_date, 'yyyyMMdd')))
),
active_day as (
    select
        class_name,
        user_id,
        dt
    from user_class_day
    where play_duration_ms >= 60 * 1000
),
tagged as (
    select
        class_name,
        user_id,
        dt,
        date_sub(dt, row_number() over (
            partition by class_name, user_id
            order by dt
        )) as grp
    from active_day
),
streak as (
    select
        class_name,
        user_id,
        grp,
        count(*) as continuous_days
    from tagged
    group by class_name, user_id, grp
)
select distinct
    class_name,
    user_id
from streak
where continuous_days >= 7;
```

**口述思路**：

- 垂类活跃题先按 `class_name + user_id + 日期` 聚合播放时长，再判断是否超过 1 分钟
- 作者 TopN 题先聚合作者播放时长，再用 `row_number()` 按垂类分组排序
- 连续活跃题仍然用“日期减行号”构造连续日期组

### DAU SQL 题：累计活跃十天以上和连续活跃十天以上用户

**题目（面经整理版）**：

有一张 `dau_table`，字段包括：

- `p_date`：日期
- `uid`：用户 `ID`

请回答：

1. 哪些用户累计活跃了 `10` 天以上？
2. 哪些用户连续活跃天数大于 `10`？

**问题 1：累计活跃 `10` 天以上用户**

```sql
select
    uid
from (
    select
        uid,
        count(distinct p_date) as active_days
    from dau_table
    group by uid
) t
where active_days > 10;
```

**问题 2：连续活跃天数大于 `10` 的用户**

```sql
with active_day as (
    select distinct
        uid,
        p_date
    from dau_table
),
tagged as (
    select
        uid,
        p_date,
        date_sub(p_date, row_number() over (
            partition by uid
            order by p_date
        )) as grp
    from active_day
),
streak as (
    select
        uid,
        grp,
        count(*) as continuous_days
    from tagged
    group by uid, grp
)
select distinct
    uid
from streak
where continuous_days > 10;
```

**口述思路**：

- 累计活跃只需要按用户统计去重日期数
- 连续活跃要先按 `uid + p_date` 去重，避免一天多条记录影响连续天数
- 连续日期题用“日期减行号”分组，同一连续区间会得到相同 `grp`
- 面试时要先确认“大于 `10`”是 `> 10` 还是“至少 `10` 天”的 `>= 10`

### 订单 SQL 题：每月超时订单比例大于 0.1 的城市，以及连续 3 个月满足条件的城市

**题目（面经整理版）**：

有订单表 `order_table`：

- `order_id`
- `city`
- `order_time`
- `is_timeout`：是否超时，`1` 表示超时，`0` 表示未超时

请回答：

1. 每个月超时订单比例大于 `0.1` 的城市有哪些？
2. 在上述城市中，连续 `3` 个月都出现超时订单比例大于 `0.1` 的城市有哪些？

**问题 1：每月超时订单比例大于 `0.1` 的城市**

```sql
select
    date_format(order_time, '%Y-%m-01') as month_start,
    city,
    sum(case when is_timeout = 1 then 1 else 0 end) * 1.0 / count(*) as timeout_rate
from order_table
group by date_format(order_time, '%Y-%m-01'), city
having sum(case when is_timeout = 1 then 1 else 0 end) * 1.0 / count(*) > 0.1;
```

**问题 2：连续 `3` 个月超时比例大于 `0.1` 的城市**

```sql
with city_month as (
    select
        date_format(order_time, '%Y-%m-01') as month_start,
        city,
        sum(case when is_timeout = 1 then 1 else 0 end) * 1.0 / count(*) as timeout_rate
    from order_table
    group by date_format(order_time, '%Y-%m-01'), city
),
bad_month as (
    select
        city,
        month_start
    from city_month
    where timeout_rate > 0.1
),
tagged as (
    select
        city,
        month_start,
        date_sub(month_start, interval row_number() over (
            partition by city
            order by month_start
        ) month) as grp
    from bad_month
),
streak as (
    select
        city,
        grp,
        count(*) as continuous_months
    from tagged
    group by city, grp
)
select distinct
    city
from streak
where continuous_months >= 3;
```

**口述思路**：

- 第一问先按“城市 + 月份”聚合，计算 `超时订单数 / 总订单数`
- 第二问把超时率超过阈值的月份筛出来，再用“月份减行号”识别连续月份
- 如果 SQL 方言不支持 `date_sub(... interval rn month)`，可以把年月转成 `year * 12 + month` 的数字后再减 `row_number()`

- **登录 SQL 题：求每个用户登录次数最多的日期**

**题目（腾讯面经整理版）**：

有用户登录表 `login_log`：

- `user_id`
- `login_time`

求每个用户登录次数最多的日期。如果并列，可以都保留，或按题目要求只取一个。

**参考 SQL：并列都保留**

```sql
with user_day as (
    select
        user_id,
        date(login_time) as login_date,
        count(*) as login_cnt
    from login_log
    group by user_id, date(login_time)
),
ranked as (
    select
        user_id,
        login_date,
        login_cnt,
        dense_rank() over (
            partition by user_id
            order by login_cnt desc
        ) as rnk
    from user_day
)
select
    user_id,
    login_date,
    login_cnt
from ranked
where rnk = 1;
```

**参考 SQL：每个用户只取一个日期**

```sql
with user_day as (
    select
        user_id,
        date(login_time) as login_date,
        count(*) as login_cnt
    from login_log
    group by user_id, date(login_time)
),
ranked as (
    select
        user_id,
        login_date,
        login_cnt,
        row_number() over (
            partition by user_id
            order by login_cnt desc, login_date asc
        ) as rn
    from user_day
)
select
    user_id,
    login_date,
    login_cnt
from ranked
where rn = 1;
```

**口述思路**：

- 先按 `user_id + 日期` 聚合登录次数
- 再对每个用户内部按登录次数排序
- 如果并列都要保留，用 `rank` 或 `dense_rank`
- 如果只取一个，用 `row_number` 并补充日期排序规则

> **参考回答**：本题已在上方通过 SQL 代码块和关键考点说明提供完整解答。

- **SQL 追问：`left join` 的条件写在 `on` 和 `where` 里有什么区别？**

> **参考回答**：
>
> `left join` 会保留左表全部记录，右表匹配不到时补 `null`。所以条件写在 `on` 里还是 `where` 里，结果可能完全不同。
> **写在 `on` 里**：
>
> ```sql
> select
>     a.user_id,
>     b.order_id
> from user_table a
> left join order_table b
>     on a.user_id = b.user_id
>    and b.order_status = 'paid';
> ```
>
> 含义是：
> - 左表用户都会保留
> - 右表只匹配已支付订单
> - 没有已支付订单的用户，右表字段为 `null`
> **写在 `where` 里**：
>
> ```sql
> select
>     a.user_id,
>     b.order_id
> from user_table a
> left join order_table b
>     on a.user_id = b.user_id
> where b.order_status = 'paid';
> ```
>
> 含义是：
> - 先做 `left join`
> - 再过滤 `b.order_status = 'paid'`
> - 右表没匹配上的用户 `b.order_status` 是 `null`，会被过滤掉
> - 最终效果接近 `inner join`
> **`on` 里可以写 `=`、`!=`、`<`、`>` 吗？**
>
> 可以。`on` 本质是连接条件，不只能写等值连接，也可以写非等值条件，例如时间区间匹配、金额范围匹配。
>
> 但要注意：
> - 非等值连接更容易导致一行匹配多行
> - 大表非等值连接成本很高
> - 写之前要确认业务粒度和是否会放大数据
>
> `left join` 右表过滤条件写在 `on` 里，是限制右表匹配；写在 `where` 里，可能把右表为空的左表记录过滤掉，导致左连接退化成内连接。
>
### SQL 窗口函数题：从订单表中取最近 7 天都下单过的用户

**题目**：

有订单表 `order_table`：

- `user_id`
- `order_id`
- `order_time`

找出最近 `7` 天每天都下单过的用户。

**参考 SQL**：

```sql
with user_day as (
    select distinct
        user_id,
        date(order_time) as order_date
    from order_table
    where date(order_time) between date_sub(current_date, interval 6 day) and current_date
)
select
    user_id
from user_day
group by user_id
having count(distinct order_date) = 7;
```

如果题目想考窗口函数，也可以口述：

- 先按 `user_id + 日期` 去重
- 筛选最近 `7` 天
- 对用户聚合，看是否覆盖 `7` 个不同日期
- 如果不是固定最近 `7` 天，而是任意连续 `7` 天下单，则用“日期减行号”分组

- **SQL 大数据追问：非常大的数据集如何去重？有脏数据和数据倾斜怎么办？**

> **参考回答**：
>
> 大数据去重不要只写 `distinct`，要先看去重口径和数据质量。
> **基础去重**：
> - 如果只是全字段去重，可以用 `select distinct`
> - 如果按业务主键去重，可以用 `row_number()` 保留最新或最可信一条
>
> ```sql
> with ranked as (
>     select
>         *,
>         row_number() over (
>             partition by user_id, order_id
>             order by update_time desc
>         ) as rn
>     from order_table
> )
> select *
> from ranked
> where rn = 1;
> ```
> **有脏数据时**：
> - 先清洗主键空值、异常时间、非法状态
> - 对 `null` 主键单独处理，不要把所有 `null` 都聚到一个分区里
> - 统一大小写、空格、时间格式、ID 格式
> - 明确保留规则，例如保留最新、状态最完整、金额非空的一条
> **有数据倾斜时**：
> - 如果某个 `user_id` 数据特别多，窗口函数可能压到单个 reducer
> - 可以先做预聚合，减少数据量
> - 对热点 key 单独拆出来处理
> - 对大表 join 小表，用 map join / broadcast join
> - 对倾斜 key 可以加盐打散，聚合后再二次聚合
> **大表连小表**：
> - 小表可广播到各节点，减少 shuffle
> - 先过滤再 join，减少扫描和传输
> - 确保 join key 类型一致，避免隐式转换
>
> 大数据去重的核心是先定义业务主键和保留规则，再处理脏数据、空值和倾斜；遇到热点 key、大表 join 小表时，要用预聚合、广播 join、加盐或单独处理热点数据。

- **SQL 日期函数题：时间戳如何转为标准日期格式？**

> **参考回答**：
>
> 如果是 Hive / Spark SQL，常见写法是：
>
> ```sql
> select
>     from_unixtime(1730426400, 'yyyy-MM-dd') as dt;
> ```
>
> 输出：
>
> ```text
> 2024-11-01
> ```
>
> 常见变体：
>
> ```sql
> -- 转成日期时间
> select from_unixtime(1730426400, 'yyyy-MM-dd HH:mm:ss');
> -- 毫秒级时间戳要先除以 1000
> select from_unixtime(cast(ts_ms / 1000 as bigint), 'yyyy-MM-dd');
> -- 转成月份
> select date_format(from_unixtime(ts), 'yyyy-MM');
> ```
>
> 时间戳题要先确认单位是秒还是毫秒，再用 `from_unixtime` 转日期，最后按题目要求 `date_format` 到日、月或具体时间。
>
### 电商 SQL 题：如何计算复购率？

**口述思路**：

复购率要先明确口径，常见是：

> 复购率 = 购买次数大于等于 2 次的用户数 / 购买用户数

假设订单表 `orders` 包含：

- `user_id`
- `order_id`
- `pay_time`
- `pay_amount`

**参考 SQL**：

```sql
with user_order as (
    select
        user_id,
        count(distinct order_id) as order_cnt
    from orders
    where pay_time >= '2025-03-01'
      and pay_time < '2025-04-01'
      and pay_amount > 0
    group by user_id
)
select
    count(case when order_cnt >= 2 then user_id end) * 1.0
        / count(user_id) as repurchase_rate
from user_order;
```

如果是按商品、品类或店铺复购，要把分组口径加进去：

```sql
with user_category_order as (
    select
        category_id,
        user_id,
        count(distinct order_id) as order_cnt
    from orders
    where pay_time >= '2025-03-01'
      and pay_time < '2025-04-01'
      and pay_amount > 0
    group by category_id, user_id
)
select
    category_id,
    count(case when order_cnt >= 2 then user_id end) * 1.0
        / count(user_id) as repurchase_rate
from user_category_order
group by category_id;
```

一句话总结：

> 复购率题的关键是先确认“复购”的对象和周期：是平台复购、店铺复购、品类复购，还是同商品复购。

- **电商 SQL 题：三月份有消费行为用户的人均 GMV 及分布分箱**

**题目（面经整理版）**：

有全量订单表 `orders`：

- `user_id`
- `order_id`
- `pay_time`
- `pay_amount`

请计算：

1. 三月份有过消费行为用户的人均 `GMV`
2. 人均 `GMV` 的分布，按 `0-100`、`100-200`、`200-300`、`300-400`、`400-500` 分五档
3. 如果不设置 `500` 上限，如何按每 `100` 元一档动态分箱

**1. 三月份有消费行为用户的人均 GMV**

```sql
with user_gmv as (
    select
        user_id,
        sum(pay_amount) as gmv
    from orders
    where pay_time >= '2025-03-01'
      and pay_time < '2025-04-01'
      and pay_amount > 0
    group by user_id
)
select
    avg(gmv) as avg_user_gmv
from user_gmv;
```

**2. 固定五档分布**

```sql
with user_gmv as (
    select
        user_id,
        sum(pay_amount) as gmv
    from orders
    where pay_time >= '2025-03-01'
      and pay_time < '2025-04-01'
      and pay_amount > 0
    group by user_id
),
bucketed as (
    select
        user_id,
        gmv,
        case
            when gmv >= 0 and gmv < 100 then '0-100'
            when gmv >= 100 and gmv < 200 then '100-200'
            when gmv >= 200 and gmv < 300 then '200-300'
            when gmv >= 300 and gmv < 400 then '300-400'
            when gmv >= 400 and gmv < 500 then '400-500'
            else '500+'
        end as gmv_bucket
    from user_gmv
)
select
    gmv_bucket,
    count(*) as user_cnt
from bucketed
group by gmv_bucket
order by gmv_bucket;
```

**3. 不设置上限，动态每 100 元分箱**

```sql
with user_gmv as (
    select
        user_id,
        sum(pay_amount) as gmv
    from orders
    where pay_time >= '2025-03-01'
      and pay_time < '2025-04-01'
      and pay_amount > 0
    group by user_id
),
bucketed as (
    select
        user_id,
        gmv,
        floor(gmv / 100) * 100 as bucket_start
    from user_gmv
)
select
    concat(cast(bucket_start as string), '-', cast(bucket_start + 100 as string)) as gmv_bucket,
    count(*) as user_cnt
from bucketed
group by bucket_start
order by bucket_start;
```

---

> **参考回答**：本题已在上方通过 SQL 代码块和关键考点说明提供完整解答。

