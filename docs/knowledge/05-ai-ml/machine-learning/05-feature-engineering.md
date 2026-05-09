---
title: "特征工程与数据预处理 (Feature Engineering & Preprocessing)"
outline: deep
---

# 特征工程与数据预处理 (Feature Engineering & Preprocessing)

在机器学习界有一句名言：“**数据和特征决定了机器学习的上限，而模型和算法只是逼近这个上限而已**。” (Data and features dictate the upper bound of machine learning, while models and algorithms just approach this bound).

要完整学习机器学习，绝不能只学算法。本节将通过代码案例，带你学习如何处理“脏数据”，将其转化为模型能理解的特征。

---

## 1. 缺失值处理 (Handling Missing Values)

### 1.1 知识与内容
现实中的数据往往是不完整的。常见的缺失值处理方法：
- **删除**：如果某列缺失率极高（如 > 80%），或者某行缺失关键目标值，直接删除。
- **填充 (Imputation)**：
  - **连续型数值**：用均值（Mean）、中位数（Median）填充。如果有明显的长尾分布（如收入），中位数比均值更好。
  - **离散型类别**：用众数（Mode）填充，或者单独作为一个新类别（如 "Unknown"）。
  - **高级填充**：使用 KNN 算法寻找相似样本进行填充，或使用随机森林预测缺失值。

### 1.2 Python 代码案例
模拟一份包含缺失值的用户数据，并使用 `sklearn.impute.SimpleImputer` 进行填充。

```python
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer

# 1. 模拟带有缺失值的数据
data = {
    'Age': [25, 30, np.nan, 45, 35, np.nan],
    'Salary': [5000, 6000, 5500, np.nan, 8000, 7500],
    'City': ['Beijing', 'Shanghai', 'Guangzhou', np.nan, 'Beijing', 'Shanghai']
}
df = pd.DataFrame(data)
print("--- 原始包含缺失值的数据 ---")
print(df)
print("\n")

# 2. 连续型特征填充 (Age 用中位数, Salary 用均值)
age_imputer = SimpleImputer(strategy='median')
df['Age_filled'] = age_imputer.fit_transform(df[['Age']])

salary_imputer = SimpleImputer(strategy='mean')
df['Salary_filled'] = salary_imputer.fit_transform(df[['Salary']])

# 3. 类别型特征填充 (City 用众数)
city_imputer = SimpleImputer(strategy='most_frequent')
df['City_filled'] = city_imputer.fit_transform(df[['City']])

print("--- 填充后的数据 ---")
print(df[['Age_filled', 'Salary_filled', 'City_filled']])
```

---

## 2. 类别特征编码 (Categorical Encoding)

### 2.1 知识与内容
大多数机器学习模型（如逻辑回归、SVM、神经网络）只能处理数值型数据，无法直接理解 "Beijing"、"Male" 这样的字符串。
- **标签编码 (Label Encoding / Ordinal Encoding)**：将类别映射为整数（如 0, 1, 2）。**适用场景**：类别之间有大小/顺序关系（如：低=0, 中=1, 高=2），或者用于树模型（如 XGBoost、Random Forest，树模型能处理数值大小关系）。
- **独热编码 (One-Hot Encoding)**：将 $N$ 个类别扩展为 $N$ 维的 0/1 向量。**适用场景**：类别之间没有大小关系（如：北京、上海、广州）。**缺点**：如果类别极多（高基数），会导致维度爆炸（维度灾难）。

### 2.2 Python 代码案例

```python
import pandas as pd
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# 模拟数据
df = pd.DataFrame({
    'Education': ['High School', 'Bachelor', 'Master', 'PhD', 'Bachelor'], # 有顺序
    'Color': ['Red', 'Blue', 'Green', 'Red', 'Blue'] # 无顺序
})

# 1. 标签编码 (Ordinal) - 适用于有顺序的 Education
# 注意：LabelEncoder 默认按字母排序赋值，如果需要自定义顺序，通常用 pandas 的 map
edu_mapping = {'High School': 0, 'Bachelor': 1, 'Master': 2, 'PhD': 3}
df['Education_Encoded'] = df['Education'].map(edu_mapping)

# 2. 独热编码 (One-Hot) - 适用于无顺序的 Color
# 使用 pandas 的 get_dummies 是最方便的做法
df_onehot = pd.get_dummies(df, columns=['Color'], prefix='Color')

print("--- 编码后的数据 ---")
print(df_onehot)
```

---

## 3. 特征缩放 (Feature Scaling)

### 3.1 知识与内容
如果特征的量纲（数值范围）差异巨大（例如：年龄是 20-60，收入是 5000-100000），会导致基于距离的模型（KNN、SVM、K-Means）和基于梯度下降的模型（线性回归、逻辑回归、神经网络）表现极差或收敛极慢。
- **标准化 (Standardization / Z-score)**：将数据转化为均值为 0，标准差为 1 的分布。公式：$x' = \frac{x - \mu}{\sigma}$。**最常用**，不受极端异常值严重影响。
- **归一化 (Min-Max Scaling)**：将数据缩放到 $[0, 1]$ 区间。公式：$x' = \frac{x - min}{max - min}$。适用于图像像素（0-255）或明确知道边界的场景。

> **面试常考**：树模型（决策树、随机森林、XGBoost）需要特征缩放吗？
> **答**：不需要。树模型是基于特征的相对大小（排序）来寻找分裂点的，数值的绝对大小不影响分裂结果。

### 3.2 Python 代码案例

```python
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# 模拟数据：年龄范围小，收入范围大
df = pd.DataFrame({
    'Age': [25, 30, 35, 40, 45],
    'Income': [50000, 60000, 150000, 80000, 90000] # 150000 是个相对较大的值
})

# 1. 标准化 (StandardScaler)
std_scaler = StandardScaler()
df_std = pd.DataFrame(std_scaler.fit_transform(df), columns=['Age_Std', 'Income_Std'])

# 2. 归一化 (MinMaxScaler)
minmax_scaler = MinMaxScaler()
df_minmax = pd.DataFrame(minmax_scaler.fit_transform(df), columns=['Age_MinMax', 'Income_MinMax'])

print("--- 原始数据 ---")
print(df)
print("\n--- 标准化 (均值0, 方差1) ---")
print(df_std)
print("\n--- 归一化 (范围 0-1) ---")
print(df_minmax)
```