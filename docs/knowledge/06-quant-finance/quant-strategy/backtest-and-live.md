---
title: "回测与实盘框架"
outline: deep
---

> 维护说明：请直接在 docs/ 目录维护本页内容。


### 四、 回测与实盘框架

在量化研究里，**回测**就是用历史数据模拟“如果当时按这套规则交易，会得到什么结果”。它的目标不是证明策略“稳赚”，而是验证策略在**收益、回撤、稳定性、换手和成本后表现**上是否具备研究价值。

- **回测最核心的几个要点**：
  - 信号与收益必须严格错开，避免未来函数。
  - 必须明确交易时点，例如“收盘生成信号，下一根 Bar 开盘成交”。
  - 必须纳入手续费、滑点、换手和资金约束，否则结果会虚高。
  - 不能只看总收益，还要看夏普、最大回撤、胜率、稳定性和样本外表现。

```text
回测流程伪代码

输入：
  清洗后的历史数据 clean_data
  策略参数 params
  初始资金 initial_cash
  手续费 commission
  滑点 slippage

初始化：
  cash = initial_cash
  position = 0 或 各标的持仓向量
  nav[0] = initial_cash

对于每一个时间点 t：
  使用 t 时点可见数据计算信号 signal[t]

  根据回测规则生成目标仓位 target_position[t]
    例如：
      如果买入信号出现，则目标仓位提高
      如果卖出信号出现，则目标仓位降低或平仓

  在约定成交时点执行交易
    trade = target_position[t] - current_position
    transaction_cost = 手续费 + 滑点 + 其他交易成本

  更新持仓和现金：
    current_position = target_position[t]
    cash = cash - 交易金额 - transaction_cost

  计算当期组合收益：
    pnl[t] = 持仓收益 + 已实现收益 - transaction_cost
    nav[t] = nav[t-1] + pnl[t]

回测结束后：
  计算绩效指标：
    年化收益、年化波动、Sharpe、最大回撤、换手率、胜率
  做样本内/样本外或滚动窗口稳定性分析

输出：
  净值曲线
  交易记录
  绩效指标
```

### 1. 核心架构认知

- **Cerebro（大脑）**：整个回测系统的控制中心，负责收集数据、策略、分析器，并驱动时间轴运行。
- **Data Feed（数据源）**：将 Pandas DataFrame 等数据转化为 Backtrader 能识别的格式（包含 open, high, low, close, volume 等 line）。
- **Strategy（策略）**：你的交易逻辑写在这里，核心是 `__init__`（初始化指标）和 `next`（每根K线触发一次的逻辑）。

### 2. 经典双均线策略代码实战

面试官如果让你手写 Backtrader，写出这个结构就足够证明你“熟悉”了：

双均线策略就是用短期均线和长期均线的相对位置生成交易信号：短均线上穿长均线常视为买入信号，下穿长均线常视为卖出信号，是最基础的趋势跟踪策略之一。

```python
import backtrader as bt
import pandas as pd
import datetime

# 1. 定义策略类
class DualMovingAverageStrategy(bt.Strategy):
    # 策略参数，可以在 Cerebro 中优化
    params = (
        ('short_period', 10),
        ('long_period', 30),
    )

    def __init__(self):
        # 引用收盘价数据线
        self.dataclose = self.datas[0].close
        
        # 记录订单状态
        self.order = None
        
        # 初始化指标：短均线和长均线
        self.sma_short = bt.indicators.SimpleMovingAverage(
            self.datas[0], period=self.params.short_period)
        self.sma_long = bt.indicators.SimpleMovingAverage(
            self.datas[0], period=self.params.long_period)
            
        # 交叉信号：1表示金叉（短上穿长），-1表示死叉
        self.crossover = bt.indicators.CrossOver(self.sma_short, self.sma_long)

    def next(self):
        # 如果有未完成的订单，等待
        if self.order:
            return

        # 检查是否在市场中（是否有持仓）
        if not self.position:
            # 没有持仓，且发生金叉，买入
            if self.crossover > 0:
                self.order = self.buy() # 默认买入1手
        else:
            # 有持仓，且发生死叉，平仓
            if self.crossover < 0:
                self.order = self.sell() # 平掉多头仓位

# 2. 运行回测的样板代码
if __name__ == '__main__':
    cerebro = bt.Cerebro() # 实例化大脑
    
    # 假设 df 是你用 Pandas 准备好的数据
    # data = bt.feeds.PandasData(dataname=df)
    # cerebro.adddata(data)
    
    cerebro.addstrategy(DualMovingAverageStrategy) # 添加策略
    cerebro.broker.setcash(100000.0) # 设置初始资金
    cerebro.broker.setcommission(commission=0.001) # 设置手续费千分之一
    
    print('初始资金: %.2f' % cerebro.broker.getvalue())
    cerebro.run() # 启动回测
    print('期末资金: %.2f' % cerebro.broker.getvalue())
    # cerebro.plot() # 画图
```

对应的算法逻辑也可以用伪代码表述，面试时这样讲会更清楚：

```text
输入：
  价格序列 close[1...T]
  短周期 short_period
  长周期 long_period

初始化：
  position = 0            # 0 表示空仓，1 表示持有多头
  order_pending = False

对于每一个时间点 t 从 long_period 到 T：
  short_ma = 最近 short_period 个收盘价的平均值
  long_ma  = 最近 long_period 个收盘价的平均值

  prev_short_ma = 上一个时间点的短均线
  prev_long_ma  = 上一个时间点的长均线

  如果 order_pending == True：
    跳过本轮，等待订单完成

  如果 position == 0：
    如果 prev_short_ma <= prev_long_ma 且 short_ma > long_ma：
      发出买入信号
      position = 1

  否则如果 position == 1：
    如果 prev_short_ma >= prev_long_ma 且 short_ma < long_ma：
      发出卖出/平仓信号
      position = 0

输出：
  每个时点的交易信号、持仓状态、策略收益
```

### 3. 其他常见策略：介绍与伪代码

#### （1）MACD 策略

- **核心思想**：`MACD` 用快慢均线的差值来衡量趋势强弱，再结合信号线判断买卖点。常见理解是：`DIF` 上穿 `DEA` 视为偏多信号，下穿视为偏空信号。
- **常见用途**：适合用于捕捉趋势启动和趋势延续，属于典型的技术指标趋势跟踪方法。

```text
输入：
  价格序列 close[1...T]
  fast_period, slow_period, signal_period

初始化：
  position = 0

对于每一个时间点 t：
  ema_fast = close 的 fast_period 指数移动平均
  ema_slow = close 的 slow_period 指数移动平均
  DIF = ema_fast - ema_slow
  DEA = DIF 的 signal_period 指数移动平均

  prev_DIF = 上一个时间点的 DIF
  prev_DEA = 上一个时间点的 DEA

  如果 position == 0：
    如果 prev_DIF <= prev_DEA 且 DIF > DEA：
      发出买入信号
      position = 1

  否则如果 position == 1：
    如果 prev_DIF >= prev_DEA 且 DIF < DEA：
      发出卖出/平仓信号
      position = 0

输出：
  MACD 指标值、交易信号、持仓状态
```

#### （2）布林带突破策略

- **核心思想**：布林带由中轨、上轨、下轨组成，本质是“均值 + 波动区间”。价格向上突破上轨，常被理解为强势突破；向下跌破下轨，常被理解为空头突破。
- **常见用途**：既可做趋势突破，也可结合回归逻辑做反转策略；在 CTA 里更常见的是突破型用法。

```text
输入：
  价格序列 close[1...T]
  窗口长度 n
  波动倍数 k

初始化：
  position = 0

对于每一个时间点 t 从 n 到 T：
  middle_band = 最近 n 个收盘价的平均值
  std = 最近 n 个收盘价的标准差
  upper_band = middle_band + k * std
  lower_band = middle_band - k * std

  如果 position == 0：
    如果 close[t] > upper_band：
      发出买入信号
      position = 1
    如果 close[t] < lower_band：
      发出做空信号
      position = -1

  如果 position == 1：
    如果 close[t] < middle_band：
      发出平多信号
      position = 0

  如果 position == -1：
    如果 close[t] > middle_band：
      发出平空信号
      position = 0

输出：
  布林带上下轨、突破信号、持仓状态
```

#### （3）时序动量策略（Time-Series Momentum）

- **核心思想**：对单个品种自身历史收益做判断。如果该品种过去一段时间涨得多，未来短中期继续上涨的概率可能更高；反之亦然。
- **常见用途**：CTA 里非常经典，通常逐个品种独立决定多空方向，本质是“看自己过去的趋势来交易自己”。

```text
输入：
  每个品种 i 的价格序列 price_i[1...T]
  回看窗口 lookback
  持有期 holding

对于每一个时间点 t 从 lookback 到 T：
  对每一个品种 i：
    momentum_i = price_i[t] / price_i[t - lookback] - 1

    如果 momentum_i > 0：
      给品种 i 多头信号

    如果 momentum_i < 0：
      给品种 i 空头信号

    如果 momentum_i 约等于 0：
      不持仓或维持原仓位

  按照预设权重分配资金
  持有 holding 个周期后再更新信号

输出：
  各品种的多空方向、组合持仓、策略收益
```

#### （4）横截面动量策略（Cross-Sectional Momentum）

- **核心思想**：在同一时点比较多个品种过去一段时间的表现，买入过去表现强的，卖出过去表现弱的。
- **常见用途**：更强调“不同资产之间谁更强、谁更弱”，常见于股票多空、期货多品种配置、行业轮动等场景。

```text
输入：
  N 个品种在时间 t 的历史价格
  回看窗口 lookback
  做多数量 top_k
  做空数量 bottom_k

对于每一个时间点 t 从 lookback 到 T：
  对每一个品种 i：
    score_i = price_i[t] / price_i[t - lookback] - 1

  按 score_i 从大到小排序

  选择前 top_k 个品种：
    给多头仓位

  选择后 bottom_k 个品种：
    给空头仓位

  其余品种不持仓
  按等权、波动率倒数或风险平价方式分配仓位

输出：
  多头组合、空头组合、净值曲线、超额收益
```

*面试区分建议*：
- **时序动量**：看“一个品种自己的过去涨跌”，决定它做多还是做空。
- **横截面动量**：看“多个品种之间谁强谁弱”，做多强者、做空弱者。

---

### 1. 核心架构认知

- **底层接口（Gateway）**：对接真实的交易所，比如 CTP（国内期货）、Binance（数字货币）。
- **事件引擎（EventEngine）**：vn.py 的心脏。当底层收到新的行情（Tick）或成交回报时，会推送到事件引擎，引擎再分发给订阅了该事件的策略。
- **CTA 策略模块（CtaStrategy）**：研究员日常工作的地方。你只需要继承 `CtaTemplate`，并实现几个关键的回调函数。

### 2. CTA 策略核心回调函数

在 vn.py 中写策略，本质上就是“填空题”，把逻辑填入以下几个生命周期函数中：

- `on_init(self)`: 策略初始化时调用，通常用于加载历史数据（`self.load_bar(10)`）来预热指标。
- `on_start(self)`: 策略启动时调用，开始接收实时行情。
- `on_tick(self, tick: TickData)`: **每次收到一笔最新快照行情（Tick，国内期货通常1秒2笔）时触发**。高频策略在这里写。
- `on_bar(self, bar: BarData)`: **每次合成完一根K线（Bar，如1分钟K线）时触发**。CTA 趋势策略通常在这里写。
- `on_order(self, order: OrderData)`: 订单状态更新时触发（如已提交、全部成交、已撤销）。

### 3. vn.py 策略实战代码示例

写一个基于 1 分钟 Bar 的简单突破策略：

```python
from vnpy_ctastrategy import (
    CtaTemplate,
    StopOrder,
    TickData,
    BarData,
    TradeData,
    OrderData,
    BarGenerator,
    ArrayManager,
)

class SimpleBreakoutStrategy(CtaTemplate):
    # 定义策略作者
    author = "Your Name"

    # 定义策略参数（可以在UI界面上直接修改）
    boll_window = 20
    boll_dev = 2.0

    # 定义策略变量（状态）
    boll_up = 0.0
    boll_down = 0.0

    # 注册参数和变量，方便在GUI中监控
    parameters = ["boll_window", "boll_dev"]
    variables = ["boll_up", "boll_down"]

    def __init__(self, cta_engine, strategy_name, vt_symbol, setting):
        super().__init__(cta_engine, strategy_name, vt_symbol, setting)
        
        # K线生成器：把 Tick 合成 1分钟 Bar
        self.bg = BarGenerator(self.on_bar)
        # 数组管理器：缓存最近的100根K线，方便计算技术指标（如布林带）
        self.am = ArrayManager(size=100)

    def on_init(self):
        self.write_log("策略初始化")
        self.load_bar(10) # 加载10天的历史数据预热指标

    def on_start(self):
        self.write_log("策略启动")

    def on_tick(self, tick: TickData):
        # 收到 Tick 数据，推给 BarGenerator 合成 Bar
        self.bg.update_tick(tick)

    def on_bar(self, bar: BarData):
        # 收到 1分钟 Bar 数据，推给 ArrayManager 缓存
        am = self.am
        am.update_bar(bar)
        
        # 如果缓存的数据还不够计算指标，直接返回
        if not am.inited:
            return

        # 计算布林带上下轨
        self.boll_up, self.boll_down = am.boll(self.boll_window, self.boll_dev)

        # 交易逻辑
        if self.pos == 0: # 如果没有持仓
            # 价格突破上轨，买入开仓（做多）
            if bar.close_price > self.boll_up:
                self.buy(bar.close_price + 5, 1) # 挂限价单，价格加5个跳动点保证成交，数量1手
            # 价格跌破下轨，卖出开仓（做空）
            elif bar.close_price < self.boll_down:
                self.short(bar.close_price - 5, 1)

        elif self.pos > 0: # 如果持有多单
            # 价格跌破下轨，卖出平仓（平多）
            if bar.close_price < self.boll_down:
                self.sell(bar.close_price - 5, abs(self.pos))

        elif self.pos < 0: # 如果持有空单
            # 价格突破上轨，买入平仓（平空）
            if bar.close_price > self.boll_up:
                self.cover(bar.close_price + 5, abs(self.pos))

        # 推送UI更新
        self.put_event()
```

*面试建议*：如果你能向面试官解释清楚 `BarGenerator`（合成K线）和 `ArrayManager`（计算指标）的作用，以及 `on_tick` 和 `on_bar` 的区别，就能证明你确实“熟悉” vn.py 的运作机制。

---
