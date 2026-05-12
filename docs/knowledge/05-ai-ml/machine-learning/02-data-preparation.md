---
title: 模块二：数据先行 (Data Preparation)
date: 2026-05-10 02:32:03
description: EDA 与分布/相关性；先划分再预处理以防泄露；缺失与异常、缩放与类别编码；Pipeline / ColumnTransformer 工业实践；配套泰坦尼克 Notebook（Binder 可在线跑）。
---
# 模块二：数据先行 (Data Preparation)

> **Binder 实战**：[在浏览器中打开配套 Notebook](https://mybinder.org/v2/gh/prong879/mianjing/main?urlpath=lab/tree/notebooks/machine-learning/01_02_data_preparation.ipynb) · 首次启动约 1–3 分钟

*“Garbage in, garbage out”，在引入算法前，必须先讲探索性分析和数据预处理，这是工业界最耗时的部分。*

## 3. 探索性数据分析 (EDA)
在拿到真实世界的数据后，通常充满了缺失值、异常值和格式混乱。在进行预处理前，我们需要对数据进行全面的“体检”，即探索性数据分析（EDA）。

- **`describe` 统计**：使用 Pandas 的 `describe()` 方法可以快速查看数值特征的统计信息，包括个数、均值（mean）、标准差、最小值、最大值以及分位数（25%、50%即中位数、75%）。分位数比均值更稳健，能有效避免极端值（如“姚明和潘长江的平均身高”）带来的误导。
- **偏态与长尾分布分析**：通过绘制直方图或分布图，可以观察数据是否符合正态分布。例如，票价数据往往呈现严重的“右偏”（长尾在右侧），绝大多数票价很低，但极少数极高的票价拉高了整体均值。这种分布对模型训练极不友好。
- **特征相关性**：利用 Seaborn 绘制相关性热力图，可以直观地看出哪些特征与预测目标（标签）正相关或负相关，以及特征之间的共线性情况，从而指导后续的特征选择。

## 4. 数据预处理与特征工程

> **为什么需要预处理?**
>
> > "Garbage In,Garbage Out."(垃圾进,垃圾出)
>
> 真实世界中的数据往往充满各种问题:
>
> - 存在缺失值和异常值
> - 包含文本、类别等非数值类型
> - 量纲差异巨大(房价是百万级，房间数是个位数)


### 数据集划分
**核心原则：先划分数据集，再做预处理。**

通常划分：
- **训练集（60-80%）**：用于训练模型，学习数据中规律。
- **验证集（10-20%）**：调整超参数（**超参数**：训练前由人设定或在验证集上网格搜索等选出的参数，例如学习率、树深度、近邻数 `k`、正则强度等；与训练过程中从数据里学出的 **权重/参数** 不是一回事），评估模型在未见过的数据上的表现。
- **测试集（10-20%）**：模拟真实世界数据，最终评估模型泛化能力。

> **防止“数据泄露”**（即模型在训练时偷看到了测试集的信息）：
> 所有 **fit** 操作（预处理，如缺失填充值、缩放用的均值与方差）只能在训练集上进行，测试集只做 **transform** 操作（即用训练集上估计的参数转换数据）。

必须先将数据集划分为训练集和测试集。所有的预处理规则（如均值计算、归一化参数）只能在**训练集**上学习（`fit`），然后应用（`transform`）到训练集和测试集上。在分类任务中，常使用分层抽样（`stratify`）来保证划分后各类别比例与原始数据一致。

**截面数据划分示例**（样本可视为 IID 时常用；列名以泰坦尼克为例）：

```python
from sklearn.model_selection import train_test_split  # 数据集划分工具

# ---------- 1. 拆成「特征 X」和「标签 y」（监督学习常规写法）----------
# 去掉目标列 Survived，其余列作为模型输入；不能把「答案」和特征混在一起。
X = df.drop("Survived", axis=1)
# axis=1：按「列」删除；axis=0 才是按行。得到的是特征矩阵（每行一个样本）。

y = df["Survived"]
# 要预测的列单独取出；与 X 行号一一对应（第 i 行特征 ↔ 第 i 个标签）。

# ---------- 2. 划分训练集 / 测试集 ----------
# 返回值共 4 个：训练特征、测试特征、训练标签、测试标签；顺序固定，勿写反。
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    # test_size：测试集占比；此处 0.2 表示约 20% 样本进测试集，约 80% 进训练集。
    test_size=0.2,
    # random_state：随机种子。固定后每次划分结果相同，便于复现实验、写报告。不设则每次运行划分可能不同。
    random_state=42,
    # stratify=y：按 y 的类别比例分层抽样，使训练/测试集中各类占比与原始数据接近。分类任务（尤其类别不平衡）常用；回归通常不设 stratify。
    stratify=y,
)
# 后续：在 (X_train, y_train) 上做 fit（预处理 + 模型训练）；
# 在 (X_test, y_test) 上只做评估，避免用测试集调参导致乐观偏差。
```

设置 `stratify=y` 后，sklearn 会确保两者中正负样本比例与原始数据保持一致。接下来的所有探索和规则制定都必须只在 `X_train` 上进行！

下面概括**截面**、**时间序列**、**面板**三类数据在划分训练 / 验证 / 测试时的常见原则（与 IID 教程中的随机划分对照；具体以业务预测目标为准）。参考：scikit-learn [TimeSeriesSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html)；面板与机器学习中的划分与泄露讨论可参见 [On the (Mis)Use of Machine Learning with Panel Data](https://arxiv.org/abs/2411.09218)。

| 数据类型 | 典型结构 | 划分核心原则 | 训练 / 验证 / 测试常见做法 |
|----------|----------|----------------|-----------------------------|
| **截面** | 每个样本为某一时刻的快照，常假设样本间**无必须保留的先后顺序** | 可**随机**划分；分类任务尽量保持标签比例 | **留出法**（如 `train_test_split` + `stratify`）；调参可用 **K 折**，并单独留出**从未参与调参**的测试集 |
| **时间序列** | 沿**时间**有序，未来依赖过去 | **禁止**随机打乱后划分；**禁止**用未来时段训练去评估过去 | **按时间先后**切段：早期训练 → 接续段验证（选超参）→ 最晚段测试；交叉验证用**扩展/滚动窗口**（walk-forward），必要时在训练与验证间设 **gap** 避免重叠泄露 |
| **面板** | **个体 × 时间** 的重复观测 | 区分泄露：**时间泄露**（未来进训练）、**个体泄露**（同一主体同时出现在训练与测试，若目标是「新主体」则指标偏乐观） | 按任务二选一或组合：**按时间切**（全员在截面前的历史训练、之后测试）；**按个体/组切**（部分主体整段只进测试）；可用 **GroupKFold** 等按 `entity_id` 分组，使同一主体不跨折泄露 |

**时间序列示例**（先按时间排序，再按位置留出；**交叉验证只在训练池上进行**，`test_df` 永不进 CV）：

```python
import pandas as pd  # 排序、按行位置切片
from sklearn.model_selection import TimeSeriesSplit  # 官方时序 CV（扩展窗口）

# ---------- 1. 按日期从早到晚（禁止 shuffle 整表后再切）----------
df = df.sort_values("date").reset_index(drop=True)

# ---------- 2. 留出法：train / val / test（只用行位置切分，比例可改）----------
n = len(df)  # 表一共有多少行；因为上一行已经按时间排好序，行号小=更早，行号大=更晚
i_train, i_val = int(n * 0.70), int(n * 0.85)  # 两个分界用的行号；例如 n=1000 时约为 700、850

# iloc：按「第几行」取子表（从 0 开始数第一行）。方括号里是切片，Python 规则：左包含、右不包含
train_df = df.iloc[:i_train].copy()  # 从第 0 行取到「第 i_train 行之前」，即第 0~(i_train-1) 行，约前 70%
val_df = df.iloc[i_train:i_val].copy()  # 从第 i_train 行取到「第 i_val 行之前」，中间一段，约 15%
test_df = df.iloc[i_val:].copy()  # 从第 i_val 行一直取到表尾，约最后 15%
# .copy()：复制一份新表；后面若改 train_df 不会误改原来的 df（初学者可先理解为「单独拷一份出来用」）
# test_df：预留作「最后一次」离线评估；下面 CV 的任一侧都不要索引到它。

# ---------- 3. TimeSeriesSplit：仅在 train_df 上做 walk-forward（与官方一致，避免测试时段渗入训练折）----------
X_cv = train_df[["lag_ret", "vol"]]  # 列名请替换为实际特征
y_cv = train_df["target"]

tscv = TimeSeriesSplit(
    n_splits=5,
    gap=0,  # 若标签含前瞻窗口，可改为与前瞻步长相等的空隙 sklearn 文档所述 gap
)
for _, (idx_train_fold, idx_val_fold) in enumerate(tscv.split(X_cv)):
    X_tr, X_va = X_cv.iloc[idx_train_fold], X_cv.iloc[idx_val_fold]
    y_tr, y_va = y_cv.iloc[idx_train_fold], y_cv.iloc[idx_val_fold]
    # 每折在 (X_tr, y_tr) 上 fit；(X_va, y_va) 仅算该折指标。勿在 val 折上 fit 预处理来改训练折以外的数据。

# ---------- 4. 定好超参后的常见收尾（示意，非必须写进同一脚本）----------
# 在 train_df（或 train_df + val_df）上按最终方案 fit，全 pipeline 仅对 test_df transform + predict 一次。
```

**面板数据示例**（`entity_id` + `date`：先规范排序；**时间切分**与**主体分组切分**分场景选用；调参在同一训练池内用 **GroupKFold**）：

```python
import pandas as pd
from sklearn.model_selection import GroupShuffleSplit, GroupKFold

# ---------- 0. 建议排序，便于阅读与按时间截断时行为可预期----------
panel = panel.sort_values(["entity_id", "date"]).reset_index(drop=True)

# ---------- A. 按全局日历截断（全员同一 cutoff，防「用未来全体标签」训练）----------
cutoff = pd.Timestamp("2023-01-01")
train_df = panel.loc[panel["date"] < cutoff]
test_df = panel.loc[panel["date"] >= cutoff]
# 若需验证集：可在 train_df 内再按更早的日期切出 val，或对 train_df 内按 entity×date 做 TimeSeriesSplit（按业务选）。

# ---------- B. 按主体留出：同一 entity_id 只出现在 train 或 test（评「冷启动新主体」）----------
# 特征列勿包含 entity_id（只作分组键）；按任务保留或丢弃 date。
cols_drop = {"y", "entity_id", "date"}
X = panel[[c for c in panel.columns if c not in cols_drop]]
y = panel["y"]
groups = panel["entity_id"]

gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, test_idx = next(gss.split(X, y, groups=groups))
X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
groups_train = groups.iloc[train_idx]

# ---------- C. 只在 X_train 上调参：GroupKFold，且 groups_train 与子集等长（ sklearn 规范用法）----------
gkfold = GroupKFold(n_splits=5)
for _, (idx_tr, idx_va) in enumerate(
    gkfold.split(X_train, y_train, groups=groups_train)
):
    X_tr = X_train.iloc[idx_tr]
    X_va = X_train.iloc[idx_va]
    y_tr, y_va = y_train.iloc[idx_tr], y_train.iloc[idx_va]
    # 在每折上 fit / 评分；同一 entity 不会同时出现在该折的 tr 与 va。
```

### 数据探索分析（EDA, Exploratory Data Analysis）

EDA 是在正式建模前，用**统计量 + 图表 + 常识**把数据「摸清楚」的过程：有哪些列、有没有脏数据、分布长什么样、特征之间和目标有没有关系。业界常说数据相关工作占大头，EDA 往往和清洗、特征构造穿插进行。与本文 **「3. 探索性数据分析 (EDA)」** 的速查要点互补，下面按**常用分类**把方法拆开，并写明**什么时候用、怎么用（直觉 + 工具）**。

上手时最常见的组合是 **Pandas**（表、统计、筛选）配合 **Matplotlib / Seaborn**（直方图、箱线图、热力图等）；下文表格里的命令都默认你有一个 `DataFrame`（常命名为 `df`）。

> **防泄露提醒**：若已划分 `X_train` / `X_test`，**报表级 EDA（算缺失率、画分布、看相关）尽量只在训练集上做**；测试集只用于最后评估。否则等于提前「偷看考卷」，指标会偏乐观。

#### 1）按目的：先四类问题，再选工具

| 你想回答的问题 | 典型做法（怎么用） | 初学者抓手 |
|----------------|-------------------|------------|
| **数据结构**：几行几列、各列类型、有没有重复主键 | 看维度、`dtypes`、是否应唯一；查重复行 | `df.shape`、`df.info()`、`df.head()`、`df.duplicated().sum()` |
| **数据质量**：缺失、明显错误、单位不一致 | 对每列算缺失比例；对类别看异常取值 | `df.isna().mean()`；对类别列 `value_counts(dropna=False)` |
| **单特征分布**：偏态、长尾、离群点 | 数值看直方图/箱线图；类别看频数条形图 | `describe()`、直方图、`boxplot` |
| **特征之间 / 与标签**：线性相关、非线性关系、类别差异 | 相关矩阵热力图；散点图；按类别分组看 `y` 的分布 | `corr()`、`heatmap`、`scatter`、分组箱线图 |

#### 2）按变量个数：单变量 → 双变量 → 多变量（教材里最常见的分法）

业界与教材（如 [NIST EDA Handbook](https://www.itl.nist.gov/div898/handbook/eda/eda_d.htm)、[维基：探索性数据分析](https://en.wikipedia.org/wiki/Exploratory_data_analysis)）常按**一次看几个变量**来分类。

**（1）单变量（一次只看一个特征）**

- **非图形**：均值、中位数、分位数、标准差、偏度、峰度；类别的频数、占比。适合写进报告里的「一句话结论」和阈值规则（例如「95% 乘客票价低于某值」）。
- **图形**：直方图 / 密度曲线看分布形状；箱线图看中位数与离群点大致范围。
- **使用方式**：每个重要数值列都至少看一次分布；若严重右偏，后面清洗里常会配合对数变换或分位数截断（见下文「数据清洗策略」）。

**（2）双变量（同时看两个特征，或特征与标签）**

- **非图形**：Pearson 相关系数（线性关系）、列联表（两个类别交叉计数）。
- **图形**：散点图（两列数值）；折线图（时间 vs 指标）；分组条形图 / 分组箱线图（类别 vs 数值）。
- **使用方式**：怀疑两列「一起涨落」时先看散点再算相关；类别特征对目标影响大时，用分组箱线图比只看全局均值更直观。

**（3）多变量（同时看多个特征）**

- **非图形**：相关矩阵、主成分分析 PCA（把高维投影到 2–3 维看整体结构，**注意**：PCA 会改变特征含义，多用于理解与可视化，不一定直接当最终特征）。
- **图形**：相关热力图；变量较多时可选 pairplot（数据量很大时会慢，可先抽样或对列做筛选）。
- **使用方式**：先画热力图抓「高度相关的特征簇」，为后续删冗余或正则化提供线索。

#### 3）按呈现形式：表（非图形）vs 图（图形）

- **表**：适合精确数字、自动化检查（缺失率、最大值、类别基数）。可写进 Notebook 单元格，便于和团队对齐。
- **图**：适合发现形状、趋势、异常与交互关系；人眼对模式更敏感。面试与报告里常「一图胜千言」。
- **建议流程**：**先表后图**——用 `info` / 缺失表 / `describe` 缩小关注点，再对可疑列画图，避免「无目的刷图」。

#### 4）与机器学习任务的衔接（你看完 EDA 之后通常要决定什么）

- **回归**：重点看目标 `y` 是否长尾、是否需 `log(y)`；特征与 `y` 的散点形态（弯曲则可能需非线性模型或特征变换）。
- **分类**：看类别是否极不平衡；各类在关键特征上的分布是否可分（分组直方图/箱线图）。
- **时间序列 / 面板**：除上述外还要看时间顺序、节假日、个体维度；划分方式见上文「数据集划分」，EDA 要与划分原则一致。

#### 5）一句话操作清单（可按顺序勾选）

1. `shape` / `info` / `head` → 搞清列名、类型、样本量。  
2. 缺失与重复 → 每列缺失率、主键是否重复。  
3. 数值列 `describe` + 直方图/箱线图 → 分布与离群。  
4. 类别列 `value_counts` + 条形图 → 基数与稀有类。  
5. 相关热力图 + 与目标的分组图 → 关系与可解释线索。  

**参考（概念与分类）**：[Exploratory data analysis - Wikipedia](https://en.wikipedia.org/wiki/Exploratory_data_analysis)；[NIST/SEMATECH e-Handbook: EDA](https://www.itl.nist.gov/div898/handbook/eda/eda_d.htm)。

#### Python / Jupyter 常用写法速查（与 `01_02_data_preparation.ipynb` 中「EDA：Python 函数与用法」小节对应）

下表默认 `import pandas as pd`、`import matplotlib.pyplot as plt`、`import seaborn as sns`，且已有监督学习用的 `df`（特征+标签）或已对齐索引的 `X_train`、`y_train`。`train_eda = X_train.copy(); train_eda["Survived"] = y_train` 可把标签拼回便于画图。

| 分类 | 典型需求 | 常用函数 / 方法 | 一句话用法 |
|------|----------|-----------------|------------|
| 结构 | 行数列数 | `df.shape` | 返回 `(行数, 列数)`。 |
| 结构 | 列名、类型、非空数量 | `df.info()` | 打印整体「体检表」；Notebook 里直接最后一行写 `df.info()` 即可。 |
| 结构 | 前几行样例 | `df.head(n)` | 默认 `n=5`；快速肉眼扫格式。 |
| 结构 | 列类型 | `df.dtypes` | 每列一个 `dtype`；判断是否要 `astype` 或分类型/数值型管道。 |
| 质量 | 缺失比例 | `df.isna().mean()` | 每列缺失占比；常配合 `.sort_values(ascending=False)` 看最差列。 |
| 质量 | 重复样本 | `df.duplicated().sum()` | 完全重复行个数；若有业务主键用 `df.duplicated(subset=["id"]).sum()`。 |
| 质量 | 类别取值与频数 | `s.value_counts(dropna=False)` | `s` 为 `df["列名"]`；`dropna=False` 把缺失也计入。 |
| 单变量 | 数值概括统计 | `df[["列1","列2"]].describe()` | count/mean/std/分位数/max；默认只含数值列。 |
| 单变量 | 偏度、峰度 | `df["列"].skew()`、`df["列"].kurtosis()` | 看对称与尾部厚度（极端值敏感程度）。 |
| 单变量 | 直方图 + 密度 | `sns.histplot(df["列"], kde=True)` | KDE 曲线叠在直方图上；也可用 `df["列"].hist(bins=30)`。 |
| 单变量 | 箱线图 | `sns.boxplot(x=df["列"])` 或 `y=` | 看中位数与离群点大致范围。 |
| 双变量 | 线性相关 | `df.corr(method="pearson", numeric_only=True)` | 方阵；只对数值列有意义。 |
| 双变量 | 散点 | `sns.scatterplot(data=df, x="列A", y="列B", hue="标签")` | `hue` 按类别或 0/1 标签着色。 |
| 双变量 | 两类别列联 | `pd.crosstab(df["列A"], df["列B"], margins=True)` | 交叉计数表。 |
| 双变量 | 类别 vs 数值分布 | `sns.boxplot(data=df, x="类别列", y="数值列", hue="标签")` | 比较各组分布差异。 |
| 多变量 | 相关热力图 | `sns.heatmap(df.corr(numeric_only=True), annot=True, fmt=".2f", cmap="RdBu_r", center=0)` | 一眼找强相关特征簇。 |
| 多变量 | 多子图散点矩阵 | `sns.pairplot(df[列列表], hue="标签", corner=True)` | 列多或样本大时先 **抽样** `df.sample(n, random_state=42)` 再画，避免卡死。 |
| 多变量（理解用） | 降维可视化 | `sklearn.decomposition.PCA` + `StandardScaler` 先 `fit_transform` 再 `plt.scatter` | 仅用于看整体结构；特征含义会变，是否进建模需单独评估。 |

**与划分配合**：凡涉及分布、相关、分组对比的「报表级」探索，应在 **`X_train`/`y_train`（或训练池）** 上完成；测试集仅做最终 `transform` + 评估，避免信息泄露。

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
由于不同特征的量纲差异巨大（如，通过`.describe()`看出，房价是百万级，房间数是个位数），不缩放会导致模型赋予大数值特征过高的权重，造成梯度下降收敛缓慢甚至震荡。
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
1. **EDA (探索性数据分析)**：使用 `.info()` ，观察发现 `Age` 有 20% 缺失，`Cabin` 缺失严重，`Fare` 存在极度右偏。
2. **数据划分**：使用 `train_test_split` 划分训练集和测试集。
3. **构建预处理流水线**：
   - 数值特征（如 `Age`, `Fare`）：中位数填充缺失值 -> StandardScaler 标准化。
   - 类别特征（如 `Sex`, `Embarked`）：众数填充缺失值 -> OneHotEncoder 独热编码。

**核心伪代码/API 展示**（完整可执行代码见配套 Jupyter Notebook；**在线运行** → [Binder 打开 `01_02_data_preparation.ipynb`](https://mybinder.org/v2/gh/prong879/mianjing/main?urlpath=lab/tree/notebooks/machine-learning/01_02_data_preparation.ipynb)）：
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