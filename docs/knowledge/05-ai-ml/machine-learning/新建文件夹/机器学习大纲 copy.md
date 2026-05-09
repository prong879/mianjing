# 机器学习系统知识大纲

## 模块一：机器学习基石 (Foundations)
*这一模块用于建立大局观，让读者知道机器学习是什么，有哪些分类，以及与深度学习的演进关系。*

1. **机器学习概论**
   - AI ⊃ ML ⊃ DL 关系与学科地图
   - 什么是机器学习？（与传统编程的区别）
   - 算法 vs 模型的概念辨析（算法是过程，模型是结果）
   - 传统 ML 适用场景（表格、风控、推荐等）与深度学习的演进前提（海量数据+算力）
   - 机器学习的基本工作流程（定义问题 -> 收集数据 -> 训练模型 -> 评估部署）

2. **机器学习类型**
   - 监督学习 (Supervised Learning)：回归问题 vs 分类问题
   - 无监督学习 (Unsupervised Learning)：包含聚类、降维与生成式 AIGC
   - 半监督学习与强化学习 (Reinforcement Learning)：提及 Q-learning 以及 RLHF 与大模型的结合

## 模块二：数据先行 (Data Preparation)
*“Garbage in, garbage out”，在引入算法前，必须先讲探索性分析和数据预处理，这是工业界最耗时的部分。*

3. **探索性数据分析 (EDA)**
   - `describe` 统计：均值、分位数
   - 偏态与长尾分布分析
   - 特征相关性：相关性热力图与分布散点图

4. **数据预处理与特征工程**
   - 数据集划分：先划分再预处理（防止数据泄露），`stratify` 分层抽样
   - 数据清洗策略：缺失值处理（删列阈值、均值/中位数/众数/unknown 类别填充）、异常值检测与截断（箱线图、IQR 分位数截断、对数变换）
   - 特征缩放：标准化 (StandardScaler) 与归一化 (MinMaxScaler)
   - 特征编码选型：序数编码、独热编码 (One-Hot)、标签编码的适用边界（树模型 vs 线性模型、高基数特征问题）
   - 特征工程初探：业务衍生特征构造与无用特征删除
   - 工业实践：使用 sklearn 流水线 (Pipeline / ColumnTransformer) 避免忙中出错

## 模块三：回归问题与模型优化基础 (Regression & Optimization)
*从最简单的线性模型入手，顺理成章地引出机器学习最重要的优化算法和评估概念。*

5. **线性回归 (Linear Regression)**
   - 线性模型的数学定义（可加性与齐次性）、“回归”词源（回归均值）
   - 最小二乘法 (OLS) 解析解
   - 多项式回归延伸：对参数线性 vs 对特征非线性

6. **梯度下降 (Gradient Descent)**
   - 为什么需要梯度下降？损失函数为什么选 MSE（放大误差、符号处理）
   - 导数、偏导与链式法则（反向传播的数学基础）
   - 学习率 (Learning Rate) 的影响与梯度消失/爆炸现象
   - 变体：批量 (BGD)、随机 (SGD)、小批量梯度下降 (MBGD)
   - 优化器演进：从 BGD 到 Momentum、RMSprop、Adam 的工业应用

7. **模型评估与诊断 (Evaluation & Diagnostics)**
   - 基线模型 (Baseline) 的意义
   - 线性评估指标：MSE, RMSE, MAE, R² 决定系数
   - 模型诊断工具：残差分析（预测值散点、残差偏态诊断）、K折交叉验证 (K-Fold CV) 结合学习曲线
   - **欠拟合和过拟合诊断与解决：**
     - 概念：偏差与方差权衡 (Bias-Variance Tradeoff)
     - 解决过拟合：正则化 (L1 Lasso, L2 Ridge)、增加数据量、早停法 (Early Stopping)、Dropout（深度学习引申）
     - 解决欠拟合：特征交叉扩维、增加训练轮数、提升模型复杂度、减小正则化惩罚

## 模块四：分类问题与树模型 (Classification & Tree Models)
*从回归过渡到分类，再从线性模型跨越到非线性（树）模型。*

8. **逻辑回归 (Logistic Regression)**
   - 为什么不能用线性回归做分类？（MSE+Sigmoid 导致非凸函数且输出失控）
   - Sigmoid 函数与概率映射
   - 交叉熵损失函数 (Cross Entropy) 的推导（最大似然估计 MLE 切入）
   - Softmax 函数与多分类逻辑回归（神经网络输出层基础）

9. **分类模型评估指标**
   - 漏报 (FN) 与误报 (FP) 在业务场景中的不同代价
   - 混淆矩阵 (Confusion Matrix)
   - 准确率 (Accuracy)、精确率 (Precision)、召回率 (Recall)、F1-Score
   - 阈值选择工具：ROC曲线与AUC面积

10. **决策树 (Decision Trees)**
    - 决策树的直观概念与分裂条件
    - 节点划分准则：基尼系数 (Gini 计算快，sklearn 默认) vs 信息增益偏向大取值特征的问题
    - 决策树的剪枝：工业界偏好的预剪枝 vs 后剪枝的高成本
    - 决策树的致命缺陷：对数据顺序/分布极其敏感、模型不稳定且极易过拟合

## 模块五：进阶与霸榜模型 (Ensemble Learning)
*介绍工业界和 Kaggle 竞赛中最常用的“大杀器”——集成学习。*

11. **集成学习与随机森林 (Random Forest)**
    - 集成学习核心思想：Bagging 降方差 vs Boosting 降偏差
    - 随机森林双重随机性（样本随机 Bootstrap + 特征随机）与 OOB (Out-of-Bag) 免费验证集
    - 特征重要性评估：不纯度重要性 (MDI) vs 排列重要性 (Permutation Importance) 的对比与高基数问题

12. **强大的 Boosting 模型族**
    - Boosting 串行纠错原理：通过拟合负梯度逐步增强（MSE 下负梯度即为残差）
    - **XGBoost**：极致梯度提升（二阶导数泰勒展开、叶子数/权重正则项防止过拟合、早停机制）
    - **LightGBM**：轻量级梯度提升（基于直方图加速、Leaf-wise 生长策略，适合大规模数据）
    - **CatBoost**：分类特征原生支持神器（对称树加速推理、防止预测偏移）
    - 三者工业应用对比与选型指南

## 模块六：无监督学习 (Unsupervised Learning)
*跳出标签的限制，讲解如何发现数据的内在结构。*

13. **K-Means 聚类 (Clustering)**
    - 聚类目标函数 (SSE 簇内平方和) 与欧式距离
    - K 值的选择：肘部法则 (Elbow Method)
    - 局限性与改进：球形簇假设、尺度与异常值敏感；K-Means++ 改进、多次初始化 (n_init) 寻优；Mini-batch K-Means 加速
    - 典型应用：用户画像预分群、图像颜色量化压缩
    - （选修扩展：中心点聚类 K-medoids、密度聚类 DBSCAN、层次聚类）

14. **PCA 主成分分析 (Dimensionality Reduction)**
    - 维度灾难概念：距离度量失效、数据稀疏与多重共线性
    - 特征选择 vs 特征提取：PCA 的线性组合降维思想
    - 计算核心：去中心化、协方差矩阵（Bessel 修正）、特征值分解
    - 超参数选取：解释方差率累计阈值（如 95%）
    - 实战组合：先用随机森林筛选有效特征，再用 PCA 降维消除共线性
    - 局限性：线性假设、可解释性下降、极度受异常值干扰

## 模块七：工业化机器学习工程 (AutoML & Production)
*结课总结：在真实的竞赛和企业生产中，除了调包，我们还需要高效的工具链。*

15. **自动化探索与 AutoML 工具链**
    - 自动化数据探索 EDA 报告 (如 ydata-profiling 等工具理念)
    - 自动化基线构建 (AutoML，如 AutoGluon 自动训练组合) 与自动超参搜索
    - 模型版本迭代与实验追踪 (MLflow 等概念)
    - 数据质量清洗：类别不平衡处理与标签噪声洗筛 (Cleanlab 理念)
    - 总结：从人工特征工程 (ML) 到模型自主表征 (DL) 的自然过渡
