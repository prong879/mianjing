# 机器学习系统知识大纲

## 模块一：机器学习基石 (Foundations)
*这一模块用于建立大局观，让读者知道机器学习是什么，有哪些分类。*

1. **机器学习概论**
   - 什么是机器学习？（与传统编程的区别）
   - 机器学习的应用场景
   - 机器学习的基本工作流程（定义问题 -> 收集数据 -> 训练模型 -> 评估部署）

2. **机器学习类型**
   - 监督学习 (Supervised Learning)
   - 无监督学习 (Unsupervised Learning)
   - 半监督学习与强化学习 (Semi-supervised & Reinforcement Learning) [简略提及]

## 模块二：数据先行 (Data Preparation)
*“Garbage in, garbage out”，在引入算法前，必须先讲数据预处理。*

3. **数据预处理**
   - 数据清洗（处理缺失值、异常值）
   - 特征缩放（标准化 StandardScaler、归一化 MinMaxScaler）
   - 类别数据编码（独热编码 One-Hot、标签编码 Label Encoding）
   - 数据集划分（训练集、验证集、测试集的拆分）*

## 模块三：回归问题与模型优化基础 (Regression & Optimization)
*从最简单的线性模型入手，顺理成章地引出机器学习最重要的优化算法和评估概念。*

4. **线性回归 (Linear Regression)**
   - 模型基本原理与数学表达
   - 最小二乘法 (OLS) 解析解

5. **梯度下降 (Gradient Descent)**
   - 为什么需要梯度下降？（损失函数/代价函数的概念）
   - 梯度下降的推导与直观理解
   - 学习率 (Learning Rate) 的影响
   - 变体：批量梯度下降(BGD)、随机梯度下降(SGD)、小批量梯度下降(MBGD) *

6. **模型评估与诊断 (Evaluation & Diagnostics)**
   - 线性回归模型评估：MSE, RMSE, MAE, R² 决定系数
   - **欠拟合和过拟合诊断和解决：**
     - 概念：偏差与方差权衡 (Bias-Variance Tradeoff) *
     - 诊断：学习曲线分析
     - 解决过拟合：正则化 (L1 Lasso, L2 Ridge)、增加数据、早停法 *
     - 解决欠拟合：增加特征复杂度、减小正则化惩罚

## 模块四：分类问题与树模型 (Classification & Tree Models)
*从回归过渡到分类，再从线性模型跨越到非线性（树）模型。*

7. **逻辑回归 (Logistic Regression)**
   - Sigmoid 函数与概率映射（逻辑回归为什么是分类模型？）
   - 对数损失函数 (Log Loss / Cross Entropy)
   - **分类模型评估指标补充**：准确率 (Accuracy)、精确率 (Precision)、召回率 (Recall)、F1-Score、ROC曲线与AUC面积 （注：有了分类模型，必须要有分类评估指标，强烈建议补充）

8. **决策树 (Decision Trees)**
   - 决策树的直观概念与分裂条件
   - 节点划分准则（信息增益、基尼系数 Gini、信息增益率）*
   - 决策树的剪枝（防止过拟合：预剪枝、后剪枝）

## 模块五：进阶与霸榜模型 (Ensemble Learning)
*介绍工业界和Kaggle竞赛中最常用的“大杀器”——集成学习。*

9. **集成学习与随机森林 (Random Forest)**
   - 集成学习思想：Bagging 与 Boosting 的区别 *
   - 随机森林原理（Bagging + 决策树 + 特征随机选取）
   - 随机森林的优缺点与特征重要性评估

10. **强大的 Boosting 模型族**
    - *注：你提到的 LightBoost 应更正为 LightGBM。*
    - Boosting 核心思想简介（如 AdaBoost, GBDT 概念铺垫）*
    - **XGBoost**：极致梯度提升树（二阶导数、正则化项、特征并行）
    - **LightGBM**：轻量级梯度提升（直方图算法、Leaf-wise生长策略）
    - **CatBoost**：分类特征处理神器（对称树、处理类别特征的优势）
    - 三者对比与选型指南 *

## 模块六：无监督学习 (Unsupervised Learning)
*跳出标签的限制，讲解如何发现数据的内在结构。*

11. **K-Means 聚类 (Clustering)**
    - 聚类思想与 K-Means 算法流程
    - K 值的选择（肘部法则 Elbow Method、轮廓系数 Silhouette Coefficient）*
    - K-Means 的局限性与 K-Means++ 改进 *

12. **PCA 主成分分析 (Dimensionality Reduction)**
    - 维度灾难的概念 *
    - PCA 的核心思想（最大投影方差/最小重构代价）
    - 特征值分解与降维过程
    - PCA在数据压缩、可视化和加速模型训练中的应用
