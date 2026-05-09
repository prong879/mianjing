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