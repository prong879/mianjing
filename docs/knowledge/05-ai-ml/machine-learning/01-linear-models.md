---
title: "线性模型 (Linear Models)"
outline: deep
---

# 线性模型 (Linear Models)

线性模型是机器学习中最基础、最易解释的一类算法。无论是回归还是分类问题，线性模型通常是面试中最常被问到、也是实际业务中作为 Baseline 的首选模型。

---

## 1. 线性回归 (Linear Regression)

### 1.1 知识与内容
线性回归用于处理**回归问题**（预测连续型数值）。它假设特征（自变量 $X$）和目标值（因变量 $y$）之间存在线性关系。
- **数学表达式**：$y = w_1x_1 + w_2x_2 + ... + w_nx_n + b = W^TX + b$
- **损失函数**：均方误差（MSE, Mean Squared Error），即 $J(w, b) = \frac{1}{2m} \sum_{i=1}^m (y^{(i)} - \hat{y}^{(i)})^2$
- **求解方法**：最小二乘法（解析解）或 梯度下降法（数值解）。

### 1.2 作用与用法
- **作用**：预测连续数值，如预测房价、股票价格、销量预测等。
- **优点**：模型简单，解释性极强（权重 $w$ 直接反映了特征的重要性），训练速度快。
- **缺点**：只能拟合线性关系，对异常值（Outliers）敏感，容易欠拟合。

### 1.3 面试核心考点
- 线性回归的假设条件是什么？（线性关系、独立性、同方差性、正态性）。
- 什么是 L1 正则化（Lasso）和 L2 正则化（Ridge）？它们有什么区别？（Lasso 产生稀疏解可用于特征选择，Ridge 防止过拟合且计算方便）。

### 1.4 可执行 Python 代码
下面代码模拟了房价与面积、房龄的关系，并使用线性回归进行预测。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 1. 模拟数据生成
np.random.seed(42)
n_samples = 100
# 特征1: 房屋面积 (平方米)，范围 50-200
area = np.random.uniform(50, 200, n_samples)
# 特征2: 房龄 (年)，范围 1-30
age = np.random.uniform(1, 30, n_samples)

# 目标值: 房价 (万元)。假设真实关系: 价格 = 3 * 面积 - 1.5 * 房龄 + 50 + 噪声
noise = np.random.normal(0, 20, n_samples) # 增加一些随机噪声
price = 3 * area - 1.5 * age + 50 + noise

# 组合特征矩阵 X
X = np.column_stack((area, age))
y = price

# 2. 模型训练
model = LinearRegression()
model.fit(X, y)

# 3. 模型预测与评估
y_pred = model.predict(X)
mse = mean_squared_error(y, y_pred)
r2 = r2_score(y, y_pred)

print("--- 线性回归模型结果 ---")
print(f"截距 (b): {model.intercept_:.2f}")
print(f"权重 (w1-面积, w2-房龄): {model.coef_[0]:.2f}, {model.coef_[1]:.2f}")
print(f"均方误差 (MSE): {mse:.2f}")
print(f"R平方值 (R2): {r2:.2f}")

# 4. 可视化 (仅展示面积与价格的关系)
plt.scatter(area, y, color='blue', label='Actual Price', alpha=0.5)
# 固定房龄为平均值来画预测线
mean_age = np.mean(age)
area_line = np.linspace(50, 200, 100)
price_line = model.intercept_ + model.coef_[0] * area_line + model.coef_[1] * mean_age
plt.plot(area_line, price_line, color='red', label='Predicted Line (Mean Age)')
plt.xlabel('Area (sqm)')
plt.ylabel('Price (10k RMB)')
plt.title('Linear Regression: Area vs Price')
plt.legend()
plt.show()
```

---

## 2. 逻辑回归 (Logistic Regression)

### 2.1 知识与内容
尽管名字里带有“回归”，逻辑回归实际上是一个**分类算法**（通常用于二分类）。它在线性回归的基础上，套用了一个 Sigmoid 函数，将连续的输出映射到 $(0, 1)$ 区间，从而表示概率。
- **数学表达式**：$\hat{y} = \sigma(W^TX + b) = \frac{1}{1 + e^{-(W^TX + b)}}$
- **损失函数**：对数损失（Log Loss / Cross-Entropy Loss），即 $J(w, b) = -\frac{1}{m} \sum_{i=1}^m [y^{(i)}\log(\hat{y}^{(i)}) + (1-y^{(i)})\log(1-\hat{y}^{(i)})]$
- **求解方法**：梯度下降法、牛顿法等。

### 2.2 作用与用法
- **作用**：二分类问题，如判断邮件是否为垃圾邮件、用户是否会点击广告（CTR预估）、患者是否患病等。
- **优点**：计算代价低，速度快，输出结果具有概率意义，解释性强。
- **缺点**：本质上还是线性分类器，无法解决非线性问题（除非进行复杂的特征工程）。

### 2.3 面试核心考点
- 逻辑回归为什么要用 Sigmoid 函数？（将输出映射到概率空间，且导数计算方便 $\sigma'(x) = \sigma(x)(1-\sigma(x))$）。
- 逻辑回归的损失函数为什么不用 MSE？（使用 MSE 会导致损失函数非凸，存在多个局部极小值；而交叉熵损失是严格的凸函数，能保证梯度下降找到全局最优解）。

### 2.4 可执行 Python 代码
下面代码模拟了用户在网站上的停留时间和点击次数，以预测用户是否会购买商品。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.model_selection import train_test_split

# 1. 模拟数据生成
np.random.seed(42)
n_samples = 200

# 类别 0: 未购买 (停留时间较短，点击次数较少)
time_0 = np.random.normal(5, 2, 100)
clicks_0 = np.random.normal(2, 1, 100)
y_0 = np.zeros(100)

# 类别 1: 购买 (停留时间较长，点击次数较多)
time_1 = np.random.normal(12, 3, 100)
clicks_1 = np.random.normal(6, 2, 100)
y_1 = np.ones(100)

# 合并数据
X = np.vstack((np.column_stack((time_0, clicks_0)), np.column_stack((time_1, clicks_1))))
y = np.concatenate((y_0, y_1))

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. 模型训练
model = LogisticRegression()
model.fit(X_train, y_train)

# 3. 模型预测与评估
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1] # 获取预测为正类的概率

print("--- 逻辑回归模型结果 ---")
print(f"准确率 (Accuracy): {accuracy_score(y_test, y_pred):.2f}")
print("混淆矩阵:\n", confusion_matrix(y_test, y_pred))
print("分类报告:\n", classification_report(y_test, y_pred))

# 4. 决策边界可视化
x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1),
                     np.arange(y_min, y_max, 0.1))

Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)

plt.contourf(xx, yy, Z, alpha=0.3, cmap='RdBu')
plt.scatter(X[y==0, 0], X[y==0, 1], label='Not Purchased (0)', color='blue', edgecolors='k')
plt.scatter(X[y==1, 0], X[y==1, 1], label='Purchased (1)', color='red', edgecolors='k')
plt.xlabel('Time Spent (mins)')
plt.ylabel('Number of Clicks')
plt.title('Logistic Regression Decision Boundary')
plt.legend()
plt.show()
```
