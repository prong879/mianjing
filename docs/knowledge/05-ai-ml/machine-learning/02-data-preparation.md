# 模块二：数据先行 (Data Preparation)

> **Binder 实战**：[在浏览器中打开配套 Notebook](https://mybinder.org/v2/gh/prong879/mianjing/main?urlpath=lab/tree/notebooks/machine-learning/01_02_data_preparation.ipynb) · 首次启动约 1–3 分钟

*“Garbage in, garbage out”，在引入算法前，必须先讲探索性分析和数据预处理，这是工业界最耗时的部分。*

## 3. 探索性数据分析 (EDA)
在拿到真实世界的数据后，通常充满了缺失值、异常值和格式混乱。在进行预处理前，我们需要对数据进行全面的“体检”，即探索性数据分析（EDA）。

- **`describe` 统计**：使用 Pandas 的 `describe()` 方法可以快速查看数值特征的统计信息，包括个数、均值（mean）、标准差、最小值、最大值以及分位数（25%、50%即中位数、75%）。分位数比均值更稳健，能有效避免极端值（如“姚明和潘长江的平均身高”）带来的误导。
- **偏态与长尾分布分析**：通过绘制直方图或分布图，可以观察数据是否符合正态分布。例如，票价数据往往呈现严重的“右偏”（长尾在右侧），绝大多数票价很低，但极少数极高的票价拉高了整体均值。这种分布对模型训练极不友好。
- **特征相关性**：利用 Seaborn 绘制相关性热力图，可以直观地看出哪些特征与预测目标（标签）正相关或负相关，以及特征之间的共线性情况，从而指导后续的特征选择。

## 4. 数据预处理与特征工程

### 数据集划分
**核心原则：先划分，再预处理。**
为了防止“数据泄露”（即模型在训练时偷看到了测试集的信息），必须先将数据集划分为训练集和测试集。所有的预处理规则（如均值计算、归一化参数）只能在**训练集**上学习（`fit`），然后应用（`transform`）到训练集和测试集上。在分类任务中，常使用分层抽样（`stratify`）来保证划分后各类别比例与原始数据一致。

### 数据清洗策略
- **缺失值处理**：
  - 缺失率极高（如>70%）：直接删除该特征列。
  - 缺失率极低且随机：可直接删除对应的样本行。
  - **常见填充方法**：数值型特征通常使用**中位数**（对极值不敏感，适合长尾分布）填充；类别型特征使用**众数**填充，或单独设立一个 `unknown` 类别以保留业务信息。
  - **高级填充**：使用 KNN 算法寻找相似样本进行填充，或使用随机森林预测缺失值。
- **异常值检测与截断**：
  - 可通过象限图或箱线图识别偏离群体的极端值。
  - 处理方法：利用 IQR（四分位距）设定合理区间（如 `[Q1 - 1.5*IQR, Q3 + 1.5*IQR]`），将超出该范围的极值截断（Clip）到边界值，而不是简单粗暴地删除。对于严重右偏的数据，也可使用对数变换（Log Transform）使其趋近正态分布。

### 特征缩放
由于不同特征的量纲差异巨大（如房价是百万级，房间数是个位数），不缩放会导致模型赋予大数值特征过高的权重，造成梯度下降收敛缓慢甚至震荡。
- **标准化 (StandardScaler)**：将数据转化为均值为0、标准差为1的分布。它不强制压缩到特定区间，受异常值影响相对较小，是线性模型和逻辑回归最常用的缩放方法。
- **归一化 (MinMaxScaler)**：将数据线性映射到固定区间（通常为 `[0, 1]`）。它严格限定了范围，但受异常值影响极大，常用于图像处理（像素值天然在0-255）或神经网络输入。

> **面试常考/避坑指南**：树模型（决策树、随机森林、XGBoost等）**不需要**进行特征缩放。因为树模型是基于特征的相对大小（排序）来寻找分裂点的，数值的绝对大小不影响分裂结果。

### 特征编码选型
机器学习模型只能处理数值，因此需要将文本类别的特征映射为数值。
- **序数编码 (Ordinal Encoding)**：适用于**有严格大小或顺序关系**的类别（如学历：小学<初中<高中，或满意度星级）。映射为 0, 1, 2 等整数，模型能学到其顺序关系。
- **独热编码 (One-Hot Encoding)**：适用于**无序**的类别（如颜色：红、绿、蓝，或城市）。将每个类别变成独立的列，用 0 和 1 表示有无。这消除了顺序误导，但会显著增加特征维度（高基数特征问题）。
- **标签编码 (Label Encoding)**：将文本映射为无序的数字。严禁用于线性模型的无序特征，但可用于树模型（树模型对数值大小不敏感，只看分裂点）或目标标签（Label）的编码。

### 特征工程初探
- **特征构造**：基于业务理解，将多个相关特征合并或提取关键信息。例如，将“兄弟姐妹数”和“父母子女数”合并为“家庭规模”；从复杂的姓名文本中提取出“社会头衔”（Title）。
- **特征删除**：去除对预测毫无帮助的冗余特征或纯噪声列，降低模型学习难度。

### 工业实践：Pipeline 与 ColumnTransformer
数据预处理步骤繁琐且容易发生数据泄露。在工业实践中，强烈建议使用 Scikit-Learn 的 `Pipeline`（流水线）和 `ColumnTransformer`。它们能将缺失值填充、编码、缩放等步骤串联封装，确保 `fit` 和 `transform` 严格按照规范执行，避免忙中出错。此外，Pipeline 不仅能确保交叉验证时不会发生数据泄露，还能结合网格搜索（Grid Search）对预处理参数和模型超参数进行统一调优。

---

## 🎯 实战案例：泰坦尼克号生存预测 (数据预处理篇)
**案例背景**：给定泰坦尼克号乘客的个人信息（年龄、性别、舱位、票价等），预测其是否幸存。原始数据包含大量缺失值和文本类别，是学习数据预处理的绝佳素材。

**核心操作步骤**：
1. **EDA (探索性数据分析)**：观察发现 `Age` 有 20% 缺失，`Cabin` 缺失严重，`Fare` 存在极度右偏。
2. **数据划分**：使用 `train_test_split` 划分训练集和测试集。
3. **构建预处理流水线**：
   - 数值特征（如 `Age`, `Fare`）：中位数填充缺失值 -> StandardScaler 标准化。
   - 类别特征（如 `Sex`, `Embarked`）：众数填充缺失值 -> OneHotEncoder 独热编码。

**核心伪代码/API 展示**（完整可执行代码见配套 Jupyter Notebook）：
```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# 1. 定义数值流和类别流
num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])
cat_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# 2. 组合为 ColumnTransformer
preprocessor = ColumnTransformer([
    ('num', num_pipeline, ['Age', 'Fare']),
    ('cat', cat_pipeline, ['Sex', 'Embarked'])
])

# 3. 预处理训练集 (fit_transform) 和测试集 (transform)
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)
```