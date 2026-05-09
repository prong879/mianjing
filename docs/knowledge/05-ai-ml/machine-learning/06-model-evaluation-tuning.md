---
title: "模型评估与超参数调优 (Evaluation & Tuning)"
outline: deep
---

# 模型评估与超参数调优 (Evaluation & Tuning)

训练出模型只是第一步。如何科学地评估模型的真实能力？如何找到让模型表现最好的参数？这是本节要解决的问题。

---

## 1. 交叉验证 (Cross-Validation)

### 1.1 知识与内容
如果我们仅仅把数据分为“训练集”和“测试集”一次，模型在测试集上的表现可能具有偶然性（比如恰好测试集里的数据都很简单）。
- **K折交叉验证 (K-Fold Cross Validation)**：将数据集等分为 $K$ 份。每次用其中 1 份作为验证集，剩余 $K-1$ 份作为训练集。重复 $K$ 次，取 $K$ 次评估结果的平均值作为最终得分。
- **作用**：充分利用有限的数据，得到对模型泛化能力更稳定、更可靠的评估。

### 1.2 Python 代码案例

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, KFold

# 1. 模拟生成分类数据
X, y = make_classification(n_samples=1000, n_features=20, random_state=42)

# 2. 定义模型
model = RandomForestClassifier(random_state=42)

# 3. 定义 5 折交叉验证
kf = KFold(n_splits=5, shuffle=True, random_state=42)

# 4. 执行交叉验证
# scoring='accuracy' 表示使用准确率作为评估指标
scores = cross_val_score(model, X, y, cv=kf, scoring='accuracy')

print("--- K折交叉验证结果 ---")
print(f"每一次的准确率: {scores}")
print(f"平均准确率: {np.mean(scores):.4f}")
print(f"准确率标准差: {np.std(scores):.4f}")
```

---

## 2. 超参数调优 (Hyperparameter Tuning)

### 2.1 知识与内容
**参数 (Parameters)** 是模型在训练过程中自己学到的（如线性回归的权重 $w$）。
**超参数 (Hyperparameters)** 是我们在训练前人为设定的（如随机森林的树的数量 `n_estimators`，树的深度 `max_depth`）。
- **网格搜索 (Grid Search)**：穷举所有可能的超参数组合，结合交叉验证，找出最好的一组。适合参数空间较小的情况。
- **随机搜索 (Random Search)**：在超参数空间中随机采样。适合参数空间极大的情况，通常比网格搜索更高效。

### 2.2 Python 代码案例

```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

# 1. 模拟数据
X, y = make_classification(n_samples=500, n_features=10, random_state=42)

# 2. 定义模型和要搜索的超参数网格
model = RandomForestClassifier(random_state=42)
param_grid = {
    'n_estimators': [50, 100, 200],      # 树的数量
    'max_depth': [None, 5, 10],          # 最大深度
    'min_samples_split': [2, 5]          # 分裂所需的最小样本数
}

# 3. 实例化 GridSearchCV (结合了 3折交叉验证)
# 总共会训练 3 * 3 * 2 * 3(cv) = 54 次模型
grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=3, scoring='accuracy', n_jobs=-1)

# 4. 执行搜索
print("开始网格搜索，请稍候...")
grid_search.fit(X, y)

print("--- 网格搜索结果 ---")
print(f"最佳超参数组合: {grid_search.best_params_}")
print(f"最佳交叉验证得分: {grid_search.best_score_:.4f}")

# 可以直接使用最佳模型进行预测
best_model = grid_search.best_estimator_
```

---

## 3. 类别不平衡与 ROC/AUC (Imbalanced Data & ROC/AUC)

### 3.1 知识与内容
在实际业务中（如欺诈检测、疾病诊断），正样本（坏人/病人）往往极少，负样本极多。这就是**类别不平衡**。
- 此时**准确率 (Accuracy) 会失效**。假设 100 个人里有 1 个骗子，模型只要无脑预测所有人都是好人，准确率就有 99%，但这毫无意义。
- **ROC 曲线**：横轴是假阳率 (FPR)，纵轴是真阳率 (TPR/Recall)。曲线越靠近左上角，模型越好。
- **AUC (Area Under Curve)**：ROC 曲线下的面积。取值在 0.5 到 1 之间。**AUC 的物理意义**：随机抽取一个正样本和一个负样本，模型给正样本打分高于负样本打分的概率。AUC 对类别不平衡非常鲁棒。

### 3.2 Python 代码案例

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve, auc, classification_report

# 1. 模拟极度不平衡的数据 (90% 负类，10% 正类)
X, y = make_classification(n_samples=1000, n_features=10, weights=[0.9, 0.1], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 2. 训练模型 (注意 class_weight='balanced' 是处理不平衡数据的利器)
# 它会自动给数量少的正类赋予更高的权重
model = LogisticRegression(class_weight='balanced', random_state=42)
model.fit(X_train, y_train)

# 3. 预测概率 (注意：画 ROC 曲线需要的是概率，不是最终的 0/1 类别)
y_prob = model.predict_proba(X_test)[:, 1]
y_pred = model.predict(X_test)

# 4. 打印分类报告 (查看 Precision, Recall, F1)
print("--- 类别不平衡下的分类报告 ---")
print(classification_report(y_test, y_pred))

# 5. 计算 ROC 曲线和 AUC 值
fpr, tpr, thresholds = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)

# 6. 可视化 ROC 曲线
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--') # 随机猜测的对角线
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate (FPR)')
plt.ylabel('True Positive Rate (TPR / Recall)')
plt.title('Receiver Operating Characteristic (ROC)')
plt.legend(loc="lower right")
plt.show()
```