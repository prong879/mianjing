---
title: "距离与概率模型 (Distance & Probabilistic Models)"
outline: deep
---

# 距离与概率模型 (Distance & Probabilistic Models)

这类模型通过计算样本之间的距离（KNN、SVM）或基于概率统计（朴素贝叶斯）来进行分类或回归。

---

## 1. K 近邻算法 (K-Nearest Neighbors, KNN)

### 1.1 知识与内容
KNN 是一种最简单的机器学习算法，属于**懒惰学习（Lazy Learning）**。它没有显式的训练过程。
- **核心思想**：“近朱者赤，近墨者黑”。给定一个新样本，在训练集中找到与它距离最近的 $K$ 个样本。
  - **分类**：这 $K$ 个样本中哪种类别最多，新样本就属于哪一类（多数表决）。
  - **回归**：取这 $K$ 个样本的目标变量的平均值作为预测值。
- **距离度量**：常用欧氏距离（Euclidean Distance）或曼哈顿距离（Manhattan Distance）。

### 1.2 作用与用法
- **作用**：基础分类与回归，推荐系统中的协同过滤基础。
- **优点**：思想简单，无需训练模型，对异常值不敏感（当 $K$ 较大时）。
- **缺点**：计算量大（预测时需要计算与所有训练样本的距离），内存消耗大，对数据不平衡敏感，**必须进行特征归一化/标准化**。

### 1.3 面试核心考点
- $K$ 值如何选择？（$K$ 太小容易过拟合，受噪声影响大；$K$ 太大容易欠拟合，类别不平衡时会被大类主导。通常通过交叉验证选择）。
- 为什么 KNN 使用前必须对数据进行标准化？（因为距离计算对量纲敏感，数值范围大的特征会主导距离的计算）。

### 1.4 可执行 Python 代码
下面代码模拟了根据“身高”和“体重”预测“性别”的任务。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

# 1. 模拟数据生成
np.random.seed(42)
# 女性数据 (类别 0): 身高 150-170, 体重 45-65
height_f = np.random.normal(160, 5, 50)
weight_f = np.random.normal(55, 5, 50)
y_f = np.zeros(50)

# 男性数据 (类别 1): 身高 165-185, 体重 60-85
height_m = np.random.normal(175, 5, 50)
weight_m = np.random.normal(75, 5, 50)
y_m = np.ones(50)

X = np.vstack((np.column_stack((height_f, weight_f)), np.column_stack((height_m, weight_m))))
y = np.concatenate((y_f, y_m))

# 2. 数据标准化 (KNN 必须步骤！)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. 模型训练与预测
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_scaled, y)

# 预测一个新样本: 身高 168, 体重 62
new_sample = np.array([[168, 62]])
new_sample_scaled = scaler.transform(new_sample)
prediction = knn.predict(new_sample_scaled)

print(f"新样本预测类别: {'男性' if prediction[0] == 1 else '女性'}")

# 4. 可视化
plt.scatter(X[y==0, 0], X[y==0, 1], color='red', label='Female')
plt.scatter(X[y==1, 0], X[y==1, 1], color='blue', label='Male')
plt.scatter(new_sample[:, 0], new_sample[:, 1], color='green', marker='*', s=200, label='New Sample')
plt.xlabel('Height (cm)')
plt.ylabel('Weight (kg)')
plt.title('KNN: Height & Weight vs Gender')
plt.legend()
plt.show()
```

---

## 2. 支持向量机 (Support Vector Machine, SVM)

### 2.1 知识与内容
SVM 是一种强大的分类算法。
- **核心思想**：在特征空间中寻找一个**超平面**，将不同类别的样本分开，并且使得离超平面最近的样本点（即**支持向量**）到超平面的距离最大化（最大化间隔 Margin）。
- **核技巧（Kernel Trick）**：当数据在低维空间线性不可分时，SVM 通过核函数（如多项式核、RBF 高斯核）将数据映射到高维空间，使其在高维空间线性可分。

### 2.2 作用与用法
- **作用**：图像分类、文本分类、生物信息学等复杂分类问题。
- **优点**：在小样本、非线性、高维模式识别中表现出色；理论基础完善（凸优化问题，能找到全局最优解）。
- **缺点**：对大规模数据训练非常慢；对缺失值敏感；核函数和超参数（$C$ 和 $\gamma$）的选择较难。

### 2.3 面试核心考点
- 什么是支持向量？（距离决策边界最近的那些样本点，它们决定了最终的超平面，其他样本点对模型没有影响）。
- 什么是核函数？常见的核函数有哪些？（核函数用于计算高维空间中的内积，避免了显式的高维映射计算。常见有：线性核、多项式核、高斯核 RBF）。
- SVM 中的参数 $C$ 代表什么？（$C$ 是惩罚系数。$C$ 越大，对误分类的惩罚越大，容易过拟合；$C$ 越小，允许更多的误分类，间隔更大，容易欠拟合）。

### 2.4 可执行 Python 代码
下面代码展示了使用非线性（RBF核）SVM 解决环形数据的分类问题。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.svm import SVC
from sklearn.datasets import make_circles

# 1. 生成非线性可分的环形数据
X, y = make_circles(n_samples=300, factor=0.3, noise=0.1, random_state=42)

# 2. 模型训练 (使用 RBF 高斯核)
# C=1.0 是惩罚系数, kernel='rbf' 表示高斯核
svm_model = SVC(kernel='rbf', C=1.0, gamma='auto')
svm_model.fit(X, y)

# 3. 决策边界可视化
plt.figure(figsize=(8, 6))
plt.scatter(X[y==0, 0], X[y==0, 1], color='red', label='Class 0')
plt.scatter(X[y==1, 0], X[y==1, 1], color='blue', label='Class 1')

# 绘制网格以显示决策边界
ax = plt.gca()
xlim = ax.get_xlim()
ylim = ax.get_ylim()

xx = np.linspace(xlim[0], xlim[1], 100)
yy = np.linspace(ylim[0], ylim[1], 100)
YY, XX = np.meshgrid(yy, xx)
xy = np.vstack([XX.ravel(), YY.ravel()]).T
Z = svm_model.decision_function(xy).reshape(XX.shape)

# 绘制等高线，Z=0 为决策边界
ax.contour(XX, YY, Z, colors='k', levels=[-1, 0, 1], alpha=0.5, linestyles=['--', '-', '--'])
plt.title("SVM with RBF Kernel on Non-linear Data")
plt.legend()
plt.show()
```

---

## 3. 朴素贝叶斯 (Naive Bayes)

### 3.1 知识与内容
朴素贝叶斯是基于贝叶斯定理的生成式概率模型。
- **贝叶斯定理**：$P(Y|X) = \frac{P(X|Y)P(Y)}{P(X)}$
- **“朴素”的含义**：算法假设特征之间是**相互独立**的。即 $P(X|Y) = P(x_1|Y) \times P(x_2|Y) \times ... \times P(x_n|Y)$。

### 3.2 作用与用法
- **作用**：文本分类（如垃圾邮件过滤、情感分析）。
- **优点**：逻辑简单，训练速度极快，对小规模数据表现良好，能处理多分类任务。
- **缺点**：特征独立性假设在现实中往往不成立，这会影响其准确率。

### 3.3 面试核心考点
- 为什么叫“朴素”贝叶斯？（假设特征之间相互独立）。
- 如果某个特征词在测试集中出现了，但在训练集中没出现过，概率变为 0 怎么办？（拉普拉斯平滑 / Laplace Smoothing，即在分子分母加上一个常数，避免概率为 0）。

### 3.4 可执行 Python 代码
下面代码模拟了基于词频的文本分类（垃圾邮件识别）。

```python
import numpy as np
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer

# 1. 模拟文本数据
texts = [
    "free money win lottery",      # 垃圾邮件
    "claim your free prize now",   # 垃圾邮件
    "meeting at 10 am tomorrow",   # 正常邮件
    "project report attached",     # 正常邮件
    "win free tickets",            # 垃圾邮件
    "lunch tomorrow?"              # 正常邮件
]
# 1 表示垃圾邮件 (Spam), 0 表示正常邮件 (Ham)
labels = np.array([1, 1, 0, 0, 1, 0])

# 2. 文本特征提取 (词频统计)
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

# 3. 模型训练
nb_model = MultinomialNB()
nb_model.fit(X, labels)

# 4. 预测新邮件
new_texts = ["free money now", "meeting tomorrow"]
X_new = vectorizer.transform(new_texts)
predictions = nb_model.predict(X_new)

print("--- 朴素贝叶斯文本分类 ---")
for text, pred in zip(new_texts, predictions):
    print(f"邮件内容: '{text}' -> 预测类别: {'垃圾邮件' if pred == 1 else '正常邮件'}")
```