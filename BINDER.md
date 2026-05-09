# Binder 在线实战（机器学习 Notebook）

本仓库在 `notebooks/machine-learning/` 收录与知识库讲义对应的 Jupyter Notebook，并通过 [MyBinder](https://mybinder.org/) 提供**免安装、浏览器内**的运行环境（云端临时容器，适合学习演示；**不要**在 Binder 里处理敏感数据）。

## 设计说明

| 组件 | 说明 |
|------|------|
| **路径** | Notebook 放在 **`notebooks/machine-learning/`**（ASCII 路径，避免 Binder URL 对中文编码不友好）。源文件可与本地 `学习/机器学习/` 同步后提交。 |
| **依赖** | `binder/requirements.txt`：`numpy`、`pandas`、`matplotlib`、`scikit-learn`、`xgboost`、`lightgbm`。 |
| **Python** | `binder/runtime.txt` 固定 **3.11**，与常见科学栈兼容。 |
| **文档入口** | VitePress [机器学习总览](/knowledge/05-ai-ml/machine-learning/overview) 与各模块文末的 Binder 链接；链接模板见下。 |

## Binder 链接模板

仓库：`prong879/mianjing`。合并到默认分支后，将下面 URL 中的 **`main`** 换成你当前的默认分支名（在功能分支上自测时可临时改为 `feat/binder-ml-notebooks`）。

```text
https://mybinder.org/v2/gh/prong879/mianjing/main?urlpath=lab/tree/notebooks/machine-learning/<文件名>.ipynb
```

示例（模块二 · 数据先行）：

```text
https://mybinder.org/v2/gh/prong879/mianjing/main?urlpath=lab/tree/notebooks/machine-learning/01_02_data_preparation.ipynb
```

## 与讲义对应关系

| 模块 | Notebook（仓库内路径） |
|------|------------------------|
| 02 数据先行 | `notebooks/machine-learning/01_02_data_preparation.ipynb` |
| 03 回归与优化 | `notebooks/machine-learning/03_regression_optimization.ipynb` |
| 04 分类与树模型 | `notebooks/machine-learning/04_classification_tree_models.ipynb` |
| 05 集成学习 | `notebooks/machine-learning/05_ensemble_learning.ipynb` |
| 06 无监督学习 | `notebooks/machine-learning/06_unsupervised_learning.ipynb` |
| 07 AutoML 与生产 | `notebooks/machine-learning/07_automl_production.ipynb` |

## 维护注意

- 更新本地 `学习/机器学习/*.ipynb` 后，将同名文件拷回 **`面经知识库/notebooks/machine-learning/`** 再提交，Binder 才会用到新版本。
- Binder **冷启动**约 1–3 分钟；长时间不活动实例会回收，**文件变更不会持久保存**。
- 若构建失败，检查 `binder/requirements.txt` 版本上界是否与某包最新版冲突，可在 [mybinder.org](https://mybinder.org/) 查看构建日志。
