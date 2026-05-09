---
title: "树模型与集成学习 (Tree Models & Ensemble Learning)"
outline: deep
---

# 树模型与集成学习 (Tree Models & Ensemble Learning)

树模型及其集成算法（尤其是 XGBoost 和 LightGBM）是工业界和数据科学竞赛（如 Kaggle）中处理表格型数据（Tabular Data）的绝对主力。

---

## 1. 决策树 (Decision Tree)

### 1.1 知识与内容
决策树是一种模拟人类决策过程的树状结构模型，既可以用于分类（Classification Tree），也可以用于回归（Regression Tree）。
- **核心思想**：每次选择一个特征进行分裂，使得分裂后的子节点纯度最高。
- **分裂标准**：
  - **分类树**：信息增益（ID3）、信息增益率（C4.5）、基尼系数（CART, Gini Impurity）。
  - **回归树**：均方误差（MSE）。
- **剪枝（Pruning）**：为了防止过拟合，需要限制树的深度、叶子节点的最少样本数，或者在树长成后进行后剪枝。

### 1.2 作用与用法
- **作用**：分类与回归任务。
- **优点**：可解释性极强（可以直接画出树结构），不需要对数据进行标准化/归一化，能自动处理缺失值和非线性特征。
- **缺点**：极易过拟合，对数据中的微小变化非常敏感（方差大）。

### 1.3 面试核心考点
- 信息熵和基尼系数的公式是什么？（熵：$H(X) = -\sum p_i \log p_i$，基尼：$Gini = 1 - \sum p_i^2$）。
- 决策树如何处理连续型变量？（将连续值排序，取相邻值的均值作为候选分裂点，计算纯度增益最大的点）。
- 为什么决策树容易过拟合？如何解决？（因为树可以无限生长直到每个叶子节点只有一个样本；解决办法是剪枝、限制深度、或者使用集成学习）。

### 1.4 可执行 Python 代码
下面代码模拟了根据“年龄”和“收入”预测是否会“购买理财产品”的决策树分类。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# 1. 模拟数据生成
np.random.seed(42)
n_samples = 150

# 特征: 年龄 (20-70) 和 收入 (3k-50k)
age = np.random.uniform(20, 70, n_samples)
income = np.random.uniform(3, 50, n_samples)

# 目标: 是否购买理财产品。规则：年龄>40且收入>15，或者 年龄<=40且收入>30 容易购买
y = np.zeros(n_samples)
for i in range(n_samples):
    if (age[i] > 40 and income[i] > 15) or (age[i] <= 40 and income[i] > 30):
        y[i] = 1
        
# 增加一些噪声
flip_indices = np.random.choice(n_samples, int(0.1 * n_samples), replace=False)
y[flip_indices] = 1 - y[flip_indices]

X = np.column_stack((age, income))
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 2. 模型训练
# 限制深度防止过拟合
dt_model = DecisionTreeClassifier(max_depth=3, random_state=42)
dt_model.fit(X_train, y_train)

# 3. 模型预测与评估
y_pred = dt_model.predict(X_test)
print(f"决策树准确率: {accuracy_score(y_test, y_pred):.2f}")

# 4. 决策树可视化
plt.figure(figsize=(12, 8))
plot_tree(dt_model, feature_names=['Age', 'Income'], class_names=['No', 'Yes'], filled=True, rounded=True)
plt.title("Decision Tree Visualization")
plt.show()
```

---

## 2. 随机森林 (Random Forest)

### 2.1 知识与内容
随机森林是基于 **Bagging（装袋法）** 的集成学习算法。它由多棵决策树组成，最终结果由所有树投票（分类）或取平均（回归）决定。
- **两个“随机”**：
  1. **样本随机（Bootstrap）**：每棵树的训练数据是有放回抽样得到的。
  2. **特征随机**：在每个节点分裂时，随机选择一部分特征（如 $\sqrt{d}$ 个）作为候选特征。

### 2.2 作用与用法
- **作用**：分类、回归、特征重要性评估。
- **优点**：准确率高，极难过拟合，对噪声和异常值容忍度高，能处理高维数据，且无需特征缩放。
- **缺点**：模型体积大，预测速度比单棵树慢，失去了单棵树的强可解释性。

### 2.3 面试核心考点
- 随机森林的“随机”体现在哪里？（样本抽样随机，特征选择随机）。
- 为什么随机森林能降低过拟合？（Bagging 的核心是降低方差，多棵差异化的树平均后，方差显著减小）。
- OOB (Out-of-Bag) 误差是什么？（由于有放回抽样，约有 36.8% 的数据未被抽中，这些数据可以直接用来作为验证集评估模型性能）。

### 2.4 可执行 Python 代码

```python
from sklearn.ensemble import RandomForestClassifier

# 继续使用上述的 X_train, X_test, y_train, y_test 数据

# 1. 模型训练
# n_estimators=100 表示使用 100 棵树
rf_model = RandomForestClassifier(n_estimators=100, max_depth=3, random_state=42)
rf_model.fit(X_train, y_train)

# 2. 模型预测与评估
rf_pred = rf_model.predict(X_test)
print(f"随机森林准确率: {accuracy_score(y_test, rf_pred):.2f}")

# 3. 特征重要性
importances = rf_model.feature_importances_
print(f"特征重要性 - 年龄: {importances[0]:.2f}, 收入: {importances[1]:.2f}")
```

---

## 3. 梯度提升树 (GBDT & XGBoost)

### 3.1 知识与内容
GBDT（Gradient Boosting Decision Tree）是基于 **Boosting（提升法）** 的集成学习算法。
- **核心思想**：多棵树串行训练，每一棵新树都在拟合**上一棵树的残差**（或者说是损失函数的负梯度）。
- **XGBoost**：是 GBDT 的工程优化极强版本。它在目标函数中加入了正则化项（控制树的复杂度），并且使用二阶泰勒展开（利用了一阶导数和二阶导数）来加速收敛。

### 3.2 作用与用法
- **作用**：分类、回归、排序（Learning to Rank）。
- **优点**：精度极高，常常是数据竞赛的霸榜算法。
- **缺点**：串行训练速度较慢（尽管 XGBoost 在特征层面做了并行优化），参数较多，调参困难。

### 3.3 面试核心考点
- Bagging 和 Boosting 的区别？（Bagging 并行训练，降方差；Boosting 串行训练，降偏差）。
- XGBoost 相比传统 GBDT 做了哪些改进？（1. 引入正则化项防过拟合；2. 泰勒二阶展开，精度更高；3. 支持列抽样；4. 缺失值自动处理；5. 特征分裂并行化计算）。

### 3.4 可执行 Python 代码
下面代码展示了如何使用 XGBoost 进行分类预测。

```python
# 需要先安装 xgboost: pip install xgboost
import xgboost as xgb
from sklearn.metrics import accuracy_score

# 继续使用上述的 X_train, X_test, y_train, y_test 数据

# 1. 转换为 XGBoost 的 DMatrix 格式 (可选，但推荐)
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# 2. 设置参数
params = {
    'max_depth': 3,          # 树的最大深度
    'eta': 0.1,              # 学习率 (learning rate)
    'objective': 'binary:logistic', # 二分类逻辑回归
    'eval_metric': 'logloss' # 评估指标
}
num_round = 50 # 迭代次数（树的个数）

# 3. 模型训练
xgb_model = xgb.train(params, dtrain, num_round)

# 4. 模型预测
# 注意：XGBoost 输出的是概率值，需要手动设置阈值转换为类别
xgb_prob = xgb_model.predict(dtest)
xgb_pred = (xgb_prob > 0.5).astype(int)

print(f"XGBoost 准确率: {accuracy_score(y_test, xgb_pred):.2f}")

# 5. 可视化特征重要性
xgb.plot_importance(xgb_model)
plt.title("XGBoost Feature Importance")
plt.show()
```

---

## 4. LightGBM (LGB) 与 CatBoost

### 4.1 知识与内容
LightGBM（LGB）和 CatBoost 与 XGBoost 一样，都属于 **GBDT（梯度提升树）** 家族的工程优化版本。它们三个常被称为“数据竞赛三剑客”。
- **LightGBM**：由微软开源。它的核心改进是为了**解决 XGBoost 训练慢、内存消耗大**的问题。
  - **直方图算法 (Histogram-based)**：将连续特征离散化为多个分箱（Bins），大大减少了分裂点的计算量和内存消耗。
  - **Leaf-wise 生长策略**：不同于 XGBoost 的 Level-wise（按层生长），LGB 每次选择增益最大的叶子节点进行分裂，精度更高，但容易过拟合（需要限制 `max_depth`）。
  - **GOSS (单边梯度采样)** 和 **EFB (互斥特征捆绑)**：进一步减少样本数和特征数，加速训练。
- **CatBoost**：由 Yandex 开源。它的最大特点是**极其擅长处理类别型特征（Categorical Features）**，无需手动进行 One-Hot 编码，并且有效解决了预测偏移（Prediction Shift）问题。

### 4.2 作用与用法
- **作用**：处理大规模表格数据的分类、回归、排序任务。
- **优点**：
  - **LGB**：训练速度极快，内存占用极低，精度与 XGBoost 相当甚至略优，非常适合海量数据。
  - **CatBoost**：对类别特征极其友好，默认参数下效果就非常好（调参压力小）。
- **缺点**：LGB 的 Leaf-wise 容易在小数据集上过拟合；CatBoost 训练速度相对 LGB 较慢。

### 4.3 面试核心考点
- LightGBM 相比 XGBoost 为什么快？（直方图算法减少了分裂点遍历次数，GOSS 减少了样本量，EFB 减少了特征数）。
- Level-wise 和 Leaf-wise 生长策略的区别？（Level-wise 按层生长，容易并行，不易过拟合；Leaf-wise 每次挑全局增益最大的叶子分裂，精度高，但容易长出极深的树导致过拟合）。
- 遇到大量类别特征时，首选什么模型？（CatBoost 或 LightGBM 的 categorical_feature 支持）。

### 4.4 可执行 Python 代码
下面代码展示了如何使用 LightGBM 进行分类预测。

```python
# 需要先安装 lightgbm: pip install lightgbm
import lightgbm as lgb
from sklearn.metrics import accuracy_score

# 继续使用上述的 X_train, X_test, y_train, y_test 数据

# 1. 转换为 LightGBM 的 Dataset 格式
lgb_train = lgb.Dataset(X_train, y_train)
lgb_eval = lgb.Dataset(X_test, y_test, reference=lgb_train)

# 2. 设置参数
params = {
    'boosting_type': 'gbdt',
    'objective': 'binary',
    'metric': 'binary_logloss',
    'num_leaves': 31,        # Leaf-wise 核心参数，控制树的复杂度
    'learning_rate': 0.05,
    'feature_fraction': 0.9,
    'verbose': -1            # 关闭打印信息
}

# 3. 模型训练
# callbacks=[lgb.early_stopping(stopping_rounds=10)] 可以用来防止过拟合
gbm = lgb.train(params,
                lgb_train,
                num_boost_round=100,
                valid_sets=[lgb_train, lgb_eval])

# 4. 模型预测
# LightGBM 输出的也是概率值
lgb_prob = gbm.predict(X_test, num_iteration=gbm.best_iteration)
lgb_pred = (lgb_prob > 0.5).astype(int)

print(f"LightGBM 准确率: {accuracy_score(y_test, lgb_pred):.2f}")
```

---

## 5. 综合案例：大宗商品（铁矿石）库存预测 (LightGBM 实战)

本案例改编自真实的量化数据分析面试题，涵盖了时间序列预测中特征工程、周期性处理、节假日处理、数据泄露防范以及模型训练的完整闭环。

### 5.1 业务背景与难点
在真实的大宗商品（如铁矿石）投研场景中，预测下一周的港口库存是核心任务。
- **输入数据**：周度库存、周度进货量、周度出货量、日度价格指数。
- **业务难点与面试考点**：
  1. **非平稳性与目标变换**：树模型（LGBM）无法外推趋势。对于绝对量（库存增减），通常使用**一阶差分**；对于价格指数等具有指数增长或方差随水平放大的序列，通常使用**对数收益率（对数差分）**。
  2. **复合周期性**：受开工旺季、天气影响，具有强烈的年内和月内周期性。除了提取月份、周序号等离散特征外，可通过**傅里叶变换**提取连续的周期特征，或使用 **STL/MSTL 分解**剥离季节项。
  3. **节假日效应**：春节、端午等节假日不能简单做成稀疏的哑变量（样本太少易过拟合）。应抽象为连续的业务过程，如构建**“距离下一个/上一个重要节假日的周数”**，捕捉节前备货和节后恢复的渐进影响。
  4. **时间序列切分与数据泄露**：严禁随机打乱数据。必须使用**简单时间截断（Hold-out）**或**滚动窗口交叉验证（Rolling Window CV）**。要严防“未来函数”（如错误的 `shift`、使用全样本计算 Z-score、使用事后修正的宏观终值数据）。

### 5.2 核心特征工程
树模型的上限由特征工程决定。借助 AI 编程工具，我们通常会批量生成大量候选特征，再通过 LGBM 的特征重要性进行筛选：
- **基础时序特征**：进出货量和库存的滞后项（如滞后1周、4周、12周），以及滚动窗口（近4周、12周）下的均值、极值、波动率。滞后阶数 $n$ 可结合业务先验（月、季、年）和模型自动筛选（Feature Importance / RFE）来确定。
- **业务交叉特征（核心）**：
  - **净进货量**：`进货量 - 出货量`，反映库存变化的物理约束。
  - **库存去化周期**：`当前库存 / 过去N周平均出货量`，反映当前库存压力。
  - **进出货动量**：短期均线 / 长期均线，捕捉产业备货节奏的边际变化。
- **价格与基本面的交叉特征**：
  - **价格动量下的行为特征**：周度价格涨跌幅 $\times$ 进货量，捕捉“买涨不买跌”的投机性备货行为。

### 5.3 可执行 Python 代码
下面代码模拟了铁矿石库存预测的完整流程，包含模拟数据生成、特征构造、严格的时序切分和 LGBM 训练。

```python
import numpy as np
import pandas as pd
import lightgbm as lgb
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings
warnings.filterwarnings('ignore')

# 1. 模拟生成铁矿石周度数据 (约3年, 156周)
np.random.seed(42)
n_weeks = 156
dates = pd.date_range(start='2021-01-01', periods=n_weeks, freq='W')

# 模拟基础数据：带有年内复合周期和噪声
t = np.arange(n_weeks)
# 进货量：基础量 + 年周期 + 半年周期 + 噪声
inbound = 500 + 50 * np.sin(2 * np.pi * t / 52) + 20 * np.cos(2 * np.pi * t / 26) + np.random.normal(0, 20, n_weeks)
# 出货量：基础量 + 年周期 + 噪声 (存在一定的时间差)
outbound = 490 + 60 * np.sin(2 * np.pi * t / 52 - 0.5) + np.random.normal(0, 25, n_weeks)
# 日度价格指数聚合为周度：随机游走带漂移
price_index = 100 + np.cumsum(np.random.normal(0.1, 1.5, n_weeks))

# 模拟库存 (库存 = 上期库存 + 进货 - 出货 + 损耗/噪声)
inventory = np.zeros(n_weeks)
inventory[0] = 5000
for i in range(1, n_weeks):
    inventory[i] = inventory[i-1] + inbound[i] - outbound[i] + np.random.normal(0, 5)

df = pd.DataFrame({
    'date': dates,
    'inventory': inventory,
    'inbound': inbound,
    'outbound': outbound,
    'price_index': price_index
})
df.set_index('date', inplace=True)

# 2. 特征工程 (Feature Engineering)
# 目标变量：预测下一周的库存变化量 (一阶差分，因为树模型难以外推库存绝对值的趋势)
df['target_inv_change'] = df['inventory'].shift(-1) - df['inventory']

# 2.1 业务交叉特征
df['net_inbound'] = df['inbound'] - df['outbound'] # 净进货量
df['depletion_cycle'] = df['inventory'] / (df['outbound'].rolling(window=4, min_periods=1).mean() + 1e-5) # 去化周期

# 2.2 价格动量 (对数收益率，处理价格的非平稳性)
df['price_return_1w'] = np.log(df['price_index'] / df['price_index'].shift(1))
df['price_return_4w'] = np.log(df['price_index'] / df['price_index'].shift(4))

# 价格动量与进货量的交叉 (买涨不买跌情绪)
df['momentum_x_inbound'] = df['price_return_1w'] * df['inbound']

# 2.3 滞后与滚动特征 (严格使用 shift 避免未来函数泄露)
for col in ['inventory', 'inbound', 'outbound', 'net_inbound']:
    # 滞后 1周(近期), 4周(月度), 12周(季度)
    for lag in [1, 4, 12]:
        df[f'{col}_lag{lag}'] = df[col].shift(lag)
    # 滚动均值与波动率 (注意必须先 shift(1) 再 rolling，否则会泄露当周信息给当周特征)
    df[f'{col}_roll_mean4'] = df[col].shift(1).rolling(window=4).mean()
    df[f'{col}_roll_std4'] = df[col].shift(1).rolling(window=4).std()

# 2.4 周期性与节假日特征
df['month'] = df.index.month
df['weekofyear'] = df.index.isocalendar().week.astype(int)

# 模拟距离春节的周数 (假设每年第6周左右是春节)
# 实际业务中应根据真实日历计算距离下一个/上一个法定长假的真实天数/周数
df['weeks_to_spring_fest'] = (6 - df['weekofyear']) % 52
df['weeks_to_spring_fest'] = df['weeks_to_spring_fest'].apply(lambda x: x if x <= 26 else 52 - x) # 转换为绝对距离

# 剔除因构造滞后和目标变量产生的 NaN
df.dropna(inplace=True)

# 3. 时间序列切分 (Time Series Split)
# 严禁随机打乱！按时间顺序前 80% 训练，后 20% 测试 (Hold-out)
train_size = int(len(df) * 0.8)
train_df = df.iloc[:train_size]
test_df = df.iloc[train_size:]

features = [c for c in df.columns if c not in ['target_inv_change']]
X_train, y_train = train_df[features], train_df['target_inv_change']
X_test, y_test = test_df[features], test_df['target_inv_change']

# 4. LightGBM 模型训练
# 声明类别特征
categorical_features = ['month', 'weekofyear']

lgb_train = lgb.Dataset(X_train, y_train, categorical_feature=categorical_features)
lgb_eval = lgb.Dataset(X_test, y_test, reference=lgb_train, categorical_feature=categorical_features)

params = {
    'boosting_type': 'gbdt',
    'objective': 'regression', # 回归任务
    'metric': 'mae',           # 评估指标：平均绝对误差
    'num_leaves': 15,
    'learning_rate': 0.05,
    'feature_fraction': 0.8,
    'verbose': -1,
    'random_state': 42
}

gbm = lgb.train(params,
                lgb_train,
                num_boost_round=300,
                valid_sets=[lgb_train, lgb_eval],
                callbacks=[lgb.early_stopping(stopping_rounds=30, verbose=False)])

# 5. 模型预测与评估
y_pred = gbm.predict(X_test, num_iteration=gbm.best_iteration)
print(f"测试集 MAE (库存变化量): {mean_absolute_error(y_test, y_pred):.2f} 吨")
print(f"测试集 RMSE (库存变化量): {np.sqrt(mean_squared_error(y_test, y_pred)):.2f} 吨")

# 若要还原为绝对库存预测：
# 预测库存 = 当前期真实库存 + 预测的库存变化量
predicted_inventory = test_df['inventory'] + y_pred
print(f"测试集绝对库存预测 MAPE: {np.mean(np.abs((test_df['inventory'].shift(-1) - predicted_inventory) / test_df['inventory'].shift(-1))):.4%}")

# 6. 特征重要性可视化 (业务解释力)
plt.figure(figsize=(10, 6))
lgb.plot_importance(gbm, max_num_features=15, importance_type='gain', 
                    title='LGBM Feature Importance (Gain)', figsize=(10, 6))
plt.tight_layout()
plt.show()
```