---
title: "无监督学习 (Unsupervised Learning)"
outline: deep
---

# 无监督学习 (Unsupervised Learning)

无监督学习的特点是**数据没有标签（Label）**。算法的目标是发现数据内部的隐藏结构、模式或特征。最常见的两大类任务是**聚类（Clustering）**和**降维（Dimensionality Reduction）**。

---

## 1. K-Means 聚类 (K-Means Clustering)

### 1.1 知识与内容
K-Means 是一种划分聚类算法，旨在将数据划分为 $K$ 个簇（Cluster），使得簇内的数据点尽可能紧密，而簇间的数据点尽可能远离。
- **算法步骤**：
  1. 随机初始化 $K$ 个簇中心（Centroids）。
  2. 将每个数据点分配给距离它最近的簇中心。
  3. 重新计算每个簇的中心（即该簇所有点的均值）。
  4. 重复步骤 2 和 3，直到簇中心不再发生变化或达到最大迭代次数。

### 1.2 作用与用法
- **作用**：客户分群（用户画像）、图像压缩、异常检测预处理。
- **优点**：原理简单，计算速度快，适合大规模数据集。
- **缺点**：必须事先指定 $K$ 值；对初始簇中心敏感（容易陷入局部最优，通常用 K-Means++ 解决）；对异常值敏感；只能发现球形簇，无法处理复杂形状的聚类。

### 1.3 面试核心考点
- K-Means 的 $K$ 值如何选择？（肘部法则 Elbow Method，轮廓系数 Silhouette Coefficient）。
- K-Means 对异常值敏感吗？为什么？（敏感，因为计算簇中心用的是均值，异常值会严重拉偏均值。可以使用 K-Medians 缓解）。
- K-Means++ 是什么？（一种改进的初始化方法，使得初始的 $K$ 个中心点相互之间尽可能远，加速收敛并避免局部最优）。

### 1.4 可执行 Python 代码
下面代码模拟了一组二维数据，并使用 K-Means 进行聚类。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

# 1. 模拟生成 3 个簇的数据
# n_samples: 样本数, centers: 簇的数量, cluster_std: 簇的离散程度
X, y_true = make_blobs(n_samples=300, centers=3, cluster_std=1.0, random_state=42)

# 2. 模型训练
# n_clusters=3 指定 K=3
kmeans = KMeans(n_clusters=3, random_state=42, n_init='auto')
kmeans.fit(X)

# 获取预测的簇标签和簇中心
y_kmeans = kmeans.predict(X)
centers = kmeans.cluster_centers_

# 3. 可视化
plt.figure(figsize=(8, 6))
# 画出数据点，按预测的簇上色
plt.scatter(X[:, 0], X[:, 1], c=y_kmeans, s=50, cmap='viridis', alpha=0.6)
# 画出簇中心 (红色五角星)
plt.scatter(centers[:, 0], centers[:, 1], c='red', s=200, marker='*', label='Centroids')

plt.title("K-Means Clustering (K=3)")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.legend()
plt.show()
```

---

## 2. 主成分分析 (Principal Component Analysis, PCA)

### 2.1 知识与内容
PCA 是一种最常用的**线性降维**算法。它通过正交变换，将可能存在相关性的高维变量投影为一组线性不相关的低维变量，这些新的变量被称为**主成分**。
- **核心思想**：寻找数据方差最大的方向作为第一个主成分，然后在与第一个主成分正交的子空间中寻找方差最大的方向作为第二个主成分，依此类推。
- **数学本质**：计算数据的协方差矩阵，然后对该矩阵进行特征值分解。特征值最大的特征向量就是第一主成分。

### 2.2 作用与用法
- **作用**：数据降维（减少特征数量）、数据可视化（降到 2D 或 3D）、去噪、加速后续机器学习模型的训练。
- **优点**：无参数限制，计算简单，能最大程度保留数据的主要信息。
- **缺点**：降维后的特征（主成分）失去了原有的物理意义，可解释性差；它是线性降维，无法捕捉非线性流形结构（非线性降维需用 t-SNE 或 UMAP）。

### 2.3 面试核心考点
- PCA 的降维原理是什么？（最大化投影后的方差，或者最小化投影误差）。
- PCA 降维前需要做标准化吗？（必须做！如果特征的量纲不同，方差会被数值范围大的特征主导）。
- 如何选择降维后的维度数？（通常看“累积方差贡献率”，比如选择能保留 90% 或 95% 原始方差的维度数）。

### 2.4 可执行 Python 代码
下面代码模拟了一个三维数据（其中两个维度高度相关），并使用 PCA 降维到二维。

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# 1. 模拟生成三维数据
np.random.seed(42)
n_samples = 200
# x1 和 x2 高度相关
x1 = np.random.normal(0, 10, n_samples)
x2 = x1 * 0.8 + np.random.normal(0, 2, n_samples)
# x3 是独立的噪声
x3 = np.random.normal(0, 5, n_samples)

X = np.column_stack((x1, x2, x3))

# 2. 数据标准化 (PCA 必须步骤)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. PCA 模型训练与降维
# 降到 2 维
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# 4. 查看方差贡献率
print("--- PCA 降维结果 ---")
print(f"各主成分的方差贡献率: {pca.explained_variance_ratio_}")
print(f"累积方差贡献率: {np.sum(pca.explained_variance_ratio_):.2f}")

# 5. 可视化降维后的二维数据
plt.figure(figsize=(8, 6))
plt.scatter(X_pca[:, 0], X_pca[:, 1], alpha=0.7, color='purple')
plt.title("PCA: 3D Data Reduced to 2D")
plt.xlabel(f"Principal Component 1 ({pca.explained_variance_ratio_[0]*100:.1f}%)")
plt.ylabel(f"Principal Component 2 ({pca.explained_variance_ratio_[1]*100:.1f}%)")
plt.grid(True, alpha=0.3)
plt.show()
```