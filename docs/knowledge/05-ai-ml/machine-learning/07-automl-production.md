# 模块七：工业化机器学习工程 (AutoML & Production)

> **Binder 实战**：[打开配套 Notebook](https://mybinder.org/v2/gh/prong879/mianjing/main?urlpath=lab/tree/notebooks/machine-learning/07_automl_production.ipynb) · 首次启动约 1–3 分钟

*结课总结：在真实的竞赛和企业生产中，除了调包，我们还需要高效的工具链。*

## 15. 自动化探索与 AutoML 工具链
在真实的工业生产和 Kaggle 竞赛中，机器学习不仅仅是理解算法原理和调用 `fit/predict`，更是一项系统性的工程。为了提高效率、减少人工试错成本，业界发展出了丰富的自动化工具链。

- **自动化数据探索 (EDA 报告)**
  手动编写代码绘制直方图、散点图和相关性热力图非常繁琐。工业界常使用自动化 EDA 工具（如 **ydata-profiling / pandas-profiling**），只需一行代码即可生成包含缺失值分析、分布偏态、特征相关性等全方位体检报告。若需进行双数据集对比（如训练集 vs 测试集），可考虑使用 **Sweetviz**。
- **快速强基线与 AutoML**
  面对新任务，人工逐一尝试线性回归、随机森林、XGBoost 并手动调参耗时耗力。AutoML 工具（如 **AutoGluon**）能够自动进行特征预处理、自动尝试多种霸榜模型组合，并利用高级的超参数搜索算法寻找最优解，快速构建出一个极具竞争力的 Baseline 模型。如果需要在 Notebook 里逐步交互和对比模型，**PyCaret** 是一个极佳的选择。
- **规范预处理**
  在工业界部署中，**Sklearn Pipeline / ColumnTransformer** 是构建工业链路的基座，它将数据清洗、特征工程和模型训练串联，有效防止数据泄露并简化上线流程。
- **智能超参搜索**
  告别低效的网格搜索，当前最流行的是基于贝叶斯优化的 **Optuna**，它能智能猜测最有潜力的参数组合。在分布式多机多任务场景下，可考虑使用 **Ray Tune**。
- **模型版本迭代与实验追踪**
  在模型调优过程中，会产生无数次的实验。使用 **MLflow** 可以系统地记录每次实验的参数、评估指标以及生成的模型文件。对于团队协作与深度学习实验的可视化，**Weights & Biases (W&B)** 是业界标杆。
- **数据质量清洗：标签噪声与类别不平衡**
  “Garbage in, garbage out”。在工业界，数据清洗往往比模型调优更重要。
  - **类别不平衡**：当正负样本比例悬殊时，可使用 **imbalanced-learn** 库进行过采样/欠采样（如 SMOTE），或采用更简易的策略（如直接设置 `class_weight='balanced'`），需根据业务场景取舍。
  - **标签噪声**：人工标注的数据难免出错。利用 **Cleanlab** 等工具，可以通过交叉验证和模型置信度，自动筛查出极大概率被标错的“脏数据”，从而提升训练集的整体质量。
- **总结：从人工特征工程 (ML) 到模型自主表征 (DL) 的自然过渡**
  传统的机器学习极其依赖工程师的领域知识和手工特征工程（如组合特征、处理偏态）。随着算力和数据量的爆发，深度学习（DL）应运而生。深度学习通过多层神经网络（可以看作是无数个逻辑回归的非线性叠加），实现了从底层原始数据（像素、文本）到高层语义特征的**自主表征学习**。理解了机器学习的基石（线性回归、梯度下降、损失函数、过拟合处理），再进入深度学习和大语言模型（LLM）的世界，就会发现一切都是在这些基础概念上的自然演进与堆叠。

---

## 🎯 实战案例：电信客户流失预测端到端流水线
**案例背景**：预测电信客户是否会流失。数据包含数值型（如月费、在网时长）和类别型（如支付方式、合同类型）特征，且存在缺失值。我们将构建一个工业级的端到端 Pipeline，并使用网格搜索进行超参数调优。

**核心操作步骤**：
1. **构建 ColumnTransformer**：
   - 数值列：中位数填充 -> StandardScaler。
   - 类别列：众数填充 -> OneHotEncoder（忽略未知类别）。
2. **构建完整 Pipeline**：将 `ColumnTransformer` 预处理器与最终的分类器（如 `RandomForestClassifier`）串联。
3. **网格搜索调优 (GridSearchCV)**：不仅搜索随机森林的超参数（如树的深度），还可以直接搜索预处理步骤的参数（如测试均值填充和中位数填充哪个更好）。
4. **安全预测**：在测试集上评估时，只需调用 `pipeline.predict(X_test)`，测试集会自动经过填充、标准化和独热编码，彻底杜绝数据泄露。

**核心伪代码/API 展示**（完整可执行代码见配套 Jupyter Notebook；**在线运行** → [Binder 打开 `07_automl_production.ipynb`](https://mybinder.org/v2/gh/prong879/mianjing/main?urlpath=lab/tree/notebooks/machine-learning/07_automl_production.ipynb)）：
```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

# 1. 定义预处理流
numeric_transformer = Pipeline([('imputer', SimpleImputer(strategy='median')), ('scaler', StandardScaler())])
categorical_transformer = Pipeline([('imputer', SimpleImputer(strategy='most_frequent')), ('onehot', OneHotEncoder(handle_unknown='ignore'))])

preprocessor = ColumnTransformer([
    ('num', numeric_transformer, ['MonthlyCharge', 'Tenure']),
    ('cat', categorical_transformer, ['ContractType', 'PaymentMethod'])
])

# 2. 构建端到端 Pipeline
clf_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

# 3. 使用 GridSearchCV 进行统一调优 (注意参数命名规则：步骤名__参数名)
param_grid = {
    'classifier__n_estimators': [50, 100],
    'classifier__max_depth': [5, 10],
    'preprocessor__num__imputer__strategy': ['mean', 'median'] # 甚至可以搜索预处理策略
}

grid_search = GridSearchCV(clf_pipeline, param_grid, cv=3, scoring='roc_auc')
grid_search.fit(X_train, y_train)

# 4. 安全预测
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)
```