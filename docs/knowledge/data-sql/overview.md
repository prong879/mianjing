---
title: "SQL 与数据库基础"
outline: deep
---

> 维护说明：请直接在 docs/ 目录维护本页内容。

<!-- cross-links -->

## 与量化笔记的衔接

- 截面与窗口函数在量化数据中的用法：[量化 · 编程与数据处理](/knowledge/quant-research/programming-and-data)

### 一、SQL 与数据库基础

这是数据分析岗位里最核心、最高频的模块之一，很多笔试都会直接考 SQL 手写。

常见考点：

- 基础查询：`select`、`where`、`case when`、`distinct`、`order by`、`limit`
- 聚合统计：`group by`、`having`、`count`、`sum`、`avg`、去重统计
- 多表连接：`left join`、`inner join`、`union`、表连接顺序与数据重复问题
- 子查询与 `CTE`
- 窗口函数：`row_number()`、`rank()`、`dense_rank()`、`sum() over()`、`lag()`、`lead()`
- 业务分析题型：留存、复购、转化率、漏斗、活跃、用户分层
- 表结构理解：主键、外键、字段含义、数据粒度
- 基础性能意识：索引、避免重复扫描、减少无效连接

常见追问：

- 为什么会出现重复行？
- `where` 和 `having` 的区别是什么？
- 窗口函数和 `group by` 的区别是什么？
- 如何计算次日留存、7 日留存、漏斗转化率？

---

### 二、系统化学习入口

- 知识点模块化练习：请从左侧侧边栏按模块（如单表查询、多表连接、窗口函数等）循序渐进复习。
- 7 天训练营：[`SQL 7 天专项训练`](/interviews/data-analytics/sql-7day-camp)
- 题库刷题页：[`SQL 与数据库习题`](/interviews/data-analytics/sql-exercises)

建议顺序：先看讲义建立语法与指标框架，再按 7 天训练做题，最后用题库页做补充强化。
