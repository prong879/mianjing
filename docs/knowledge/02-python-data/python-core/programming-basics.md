---
title: "Python 基础语法与进阶"
outline: deep
tags:
  - Python
  - 基础语法
  - 文件处理
  - API
---

# Python 基础语法与进阶

本章节涵盖 Python 基础语法、数据结构、文件读写、序列化以及 API 调用等核心知识点与配套练习。

## 1. Python 基础语法

### 知识讲解

#### 1.1 变量
变量就是给一个值起名字，方便后面重复使用。
```python
name = "Alice"
age = 22
score = 95.5
```
常见数据类型：
- `int`：整数
- `float`：小数
- `str`：字符串
- `bool`：布尔值，只有 `True` 和 `False`

#### 1.2 输出
```python
print(name)
print(age)
```

#### 1.3 条件判断
```python
age = 20

if age >= 18:
    print("成年人")
else:
    print("未成年人")
```

#### 1.4 循环
`for` 常用于遍历列表；`while` 常用于“满足条件就持续执行”。
```python
for i in range(5):
    print(i)
```
```python
count = 0
while count < 3:
    print(count)
    count += 1
```

### 练习题

- **定义变量 `name`、`city`、`age`，并打印出来。**

> 🏷️ 标签：Python基础，变量

> **参考回答**：
> ```python
> name = "Tom"
> city = "Shanghai"
> age = 23
> 
> print(name)
> print(city)
> print(age)
> ```

- **判断一个数 `x` 是正数、负数还是 0。**

> 🏷️ 标签：Python基础，条件判断

> **参考回答**：
> ```python
> x = -3
> 
> if x > 0:
>     print("正数")
> elif x < 0:
>     print("负数")
> else:
>     print("0")
> ```

- **用 `for` 循环输出 1 到 10。**

> 🏷️ 标签：Python基础，循环

> **参考回答**：
> ```python
> for i in range(1, 11):
>     print(i)
> ```

- **计算 1 到 100 的和。**

> 🏷️ 标签：Python基础，循环，求和

> **参考回答**：
> ```python
> total = 0
> for i in range(1, 101):
>     total += i
> 
> print(total)
> ```

- **输出 1 到 20 中的所有偶数。**

> 🏷️ 标签：Python基础，循环，条件判断

> **参考回答**：
> ```python
> for i in range(1, 21):
>     if i % 2 == 0:
>         print(i)
> ```

## 2. 字符串、列表、字典、函数

### 知识讲解

#### 2.1 字符串
```python
text = "data analysis"
print(text.upper())
print(text.replace("analysis", "science"))
print(len(text))
```
常见操作：大小写转换、替换、截取、求长度。

#### 2.2 列表
列表可以存多个值，顺序可变。
```python
scores = [80, 90, 88, 95]
print(scores[0])
scores.append(100)
```

#### 2.3 字典
字典常用于“键值对”存储，例如用户信息、统计结果。
```python
user = {"name": "Alice", "city": "Beijing"}
print(user["name"])
```

#### 2.4 函数
函数是可重复使用的代码块。
```python
def add(a, b):
    return a + b

print(add(3, 5))
```

### 练习题

- **把字符串 `"python learning"` 转成大写。**

> 🏷️ 标签：Python基础，字符串

> **参考回答**：
> ```python
> text = "python learning"
> print(text.upper())
> ```

- **定义一个列表，求最大值、最小值、平均值。**

> 🏷️ 标签：Python基础，列表，内置函数

> **参考回答**：
> ```python
> nums = [10, 20, 30, 40, 50]
> print(max(nums))
> print(min(nums))
> print(sum(nums) / len(nums))
> ```

- **定义一个字典，包含 `name`、`age`、`city`，打印其中的 `city`。**

> 🏷️ 标签：Python基础，字典

> **参考回答**：
> ```python
> user = {
>     "name": "Tom",
>     "age": 22,
>     "city": "Guangzhou"
> }
> 
> print(user["city"])
> ```

- **写一个函数，输入两个数，返回较大的那个数。**

> 🏷️ 标签：Python基础，函数

> **参考回答**：
> ```python
> def get_max(a, b):
>     if a > b:
>         return a
>     return b
> 
> print(get_max(10, 20))
> ```

- **写一个函数，输入一个成绩，返回等级（90分及以上A，80-89B，60-79C，60以下D）。**

> 🏷️ 标签：Python基础，函数，条件判断

> **参考回答**：
> ```python
> def get_level(score):
>     if score >= 90:
>         return "A"
>     elif score >= 80:
>         return "B"
>     elif score >= 60:
>         return "C"
>     else:
>         return "D"
> 
> print(get_level(85))
> ```

## 3. 文件读写与异常处理

### 知识讲解

#### 3.1 读写文本文件
```python
with open("demo.txt", "w", encoding="utf-8") as f:
    f.write("hello python")
```
```python
with open("demo.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)
```

#### 3.2 读取 CSV
```python
import pandas as pd

df = pd.read_csv("orders.csv")
print(df.head())
```

#### 3.3 异常处理
异常处理用于避免程序因为报错直接中断。
```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("除数不能为 0")
```

### 练习题

- **新建一个文本文件，写入一行 `"I am learning Python"`。**

> 🏷️ 标签：Python基础，文件处理

> **参考回答**：
> ```python
> with open("note.txt", "w", encoding="utf-8") as f:
>     f.write("I am learning Python")
> ```

- **读取这个文本文件并打印内容。**

> 🏷️ 标签：Python基础，文件处理

> **参考回答**：
> ```python
> with open("note.txt", "r", encoding="utf-8") as f:
>     print(f.read())
> ```

- **写一段代码，捕获除零错误。**

> 🏷️ 标签：Python基础，异常处理

> **参考回答**：
> ```python
> try:
>     print(10 / 0)
> except ZeroDivisionError:
>     print("发生除零错误")
> ```

- **用 `pandas` 读取一个 CSV 文件并查看前 5 行。**

> 🏷️ 标签：Python基础，pandas，文件处理

> **参考回答**：
> ```python
> import pandas as pd
> 
> df = pd.read_csv("orders.csv")
> print(df.head())
> ```

## 4. `pickle` 对象保存与加载

### 知识讲解

#### 4.1 `pickle` 是什么
`pickle` 是 Python 标准库，用来把 Python 对象序列化到文件里，或者再从文件里反序列化回来。
它适合保存这些内容：列表、字典、集合、自定义对象、`pandas DataFrame`。
最常见的两个函数：
- `pickle.dump(obj, file)`：把对象写入文件
- `pickle.load(file)`：从文件中读取对象

#### 4.2 基本写法
```python
import pickle

data = {
    "name": "Tom",
    "scores": [88, 92, 95]
}

with open("data.pkl", "wb") as f:
    pickle.dump(data, f)

with open("data.pkl", "rb") as f:
    loaded_data = pickle.load(f)

print(loaded_data)
```
注意：写入时要用 `wb`，读取时要用 `rb`。`pickle` 保存的是 Python 对象，不是给人直接阅读的文本。

#### 4.3 和 `csv` / `excel` 的区别
- `csv` / `excel`：适合表格数据、适合人查看、适合跨工具使用
- `pickle`：适合 Python 内部快速保存对象，读取更方便

#### 4.4 注意事项
- 不要加载来源不明的 `.pkl` 文件，因为 `pickle` 反序列化存在安全风险。
- `pickle` 更适合 Python 内部使用，不适合跨语言共享。

### 练习题

- **定义一个字典，保存到 `pickle` 文件中，再读回来。**

> 🏷️ 标签：Python进阶，pickle，序列化

> **参考回答**：
> ```python
> import pickle
> 
> user_info = {
>     "name": "Alice",
>     "city": "Shanghai",
>     "age": 23
> }
> 
> with open("user_info.pkl", "wb") as f:
>     pickle.dump(user_info, f)
> 
> with open("user_info.pkl", "rb") as f:
>     loaded_user_info = pickle.load(f)
> 
> print(loaded_user_info)
> ```

- **定义一个列表，保存到 `pickle` 文件中，再验证读取结果是否一致。**

> 🏷️ 标签：Python进阶，pickle，序列化

> **参考回答**：
> ```python
> numbers = [10, 20, 30, 40, 50]
> 
> with open("numbers.pkl", "wb") as f:
>     pickle.dump(numbers, f)
> 
> with open("numbers.pkl", "rb") as f:
>     loaded_numbers = pickle.load(f)
> 
> print(loaded_numbers == numbers)
> ```

- **用 `pandas` 读取 `users.csv`，把 DataFrame 保存成 `pickle` 文件。**

> 🏷️ 标签：Python进阶，pickle，pandas

> **参考回答**：
> ```python
> import pandas as pd
> 
> df = pd.read_csv("data/users.csv")
> 
> with open("users_df.pkl", "wb") as f:
>     pickle.dump(df, f)
> ```

- **再把这个 DataFrame 读回来，并查看前 5 行。**

> 🏷️ 标签：Python进阶，pickle，pandas

> **参考回答**：
> ```python
> with open("users_df.pkl", "rb") as f:
>     loaded_df = pickle.load(f)
> 
> print(loaded_df.head())
> ```

- **什么情况下更适合用 `pickle`，什么情况下更适合用 `csv`？**

> 🏷️ 标签：Python进阶，pickle，csv

> **参考回答**：需要保存 Python 对象、下次快速继续处理时，适合用 `pickle`；需要给人查看、导出、跨工具使用时，适合用 `csv`。

## 5. `json` 读写与和 `pickle` 的区别

### 知识讲解

#### 5.1 `json` 是什么
`json` 是一种轻量级数据交换格式，适合保存结构化文本数据，也非常适合在不同系统、不同语言之间传递数据。
Python 标准库里自带 `json`，最常见的两个函数是：
- `json.dump(obj, file, ensure_ascii=False, indent=2)`：把对象写入文件
- `json.load(file)`：从文件中读取对象

#### 5.2 基本写法
```python
import json

data = {
    "name": "Tom",
    "city": "Shanghai",
    "skills": ["python", "sql"]
}

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("data.json", "r", encoding="utf-8") as f:
    loaded_data = json.load(f)

print(loaded_data)
```

#### 5.3 `json` 和 `pickle` 的区别
- `json`：文本格式，可读性强，适合跨语言、跨系统共享
- `pickle`：二进制格式，更适合 Python 内部直接保存复杂对象

#### 5.4 补充小节：`joblib` 是什么
`joblib` 是一个常见的 Python 工具库，常用于更高效地保存和加载大对象，尤其是在机器学习和数据科学场景里（如保存包含大数组的数据对象或模型）。
- `joblib.dump(obj, "file.joblib")`
- `joblib.load("file.joblib")`

### 练习题

- **定义一个字典，保存成 `json` 文件，再读回来。**

> 🏷️ 标签：Python进阶，json，序列化

> **参考回答**：
> ```python
> import json
> 
> user_info = {
>     "name": "Alice",
>     "city": "Shanghai",
>     "age": 23
> }
> 
> with open("user_info.json", "w", encoding="utf-8") as f:
>     json.dump(user_info, f, ensure_ascii=False, indent=2)
> 
> with open("user_info.json", "r", encoding="utf-8") as f:
>     loaded_user_info = json.load(f)
> 
> print(loaded_user_info)
> ```

- **定义一个列表，保存成 `json` 文件，再读回来。**

> 🏷️ 标签：Python进阶，json，序列化

> **参考回答**：
> ```python
> numbers = [10, 20, 30, 40, 50]
> 
> with open("numbers.json", "w", encoding="utf-8") as f:
>     json.dump(numbers, f, ensure_ascii=False, indent=2)
> 
> with open("numbers.json", "r", encoding="utf-8") as f:
>     loaded_numbers = json.load(f)
> 
> print(loaded_numbers)
> ```

- **把 `users.csv` 读取成 DataFrame，再转成字典列表后保存为 `json`。**

> 🏷️ 标签：Python进阶，json，pandas

> **参考回答**：
> ```python
> import pandas as pd
> 
> df = pd.read_csv("data/users.csv")
> records = df.fillna("").to_dict(orient="records")
> 
> with open("users.json", "w", encoding="utf-8") as f:
>     json.dump(records, f, ensure_ascii=False, indent=2)
> ```

- **`json` 更适合哪些场景？**

> 🏷️ 标签：Python进阶，json

> **参考回答**：需要可读性、可共享、可跨系统传输的结构化数据时，更适合用 `json`。

- **`json` 和 `pickle` 的区别是什么？**

> 🏷️ 标签：Python进阶，json，pickle

> **参考回答**：`json` 更通用、更可读；`pickle` 更适合 Python 内部直接保存复杂对象。

## 6. API 基础与 `requests` 调用

### 知识讲解

#### 6.1 什么是 API
API 可以理解成“程序和程序之间沟通的接口”。一次 API 调用通常包括两部分：请求（你发给服务器什么）和响应（服务器返回给你什么）。

#### 6.2 常见 HTTP 方法和状态码
- `GET`：获取数据
- `POST`：提交数据
- `200`：请求成功
- `400`：请求参数有问题
- `404`：资源不存在
- `500`：服务器内部错误

#### 6.3 `requests` 基本写法
```python
import requests

url = "https://example.com/api/orders"
params = {"date": "2025-03-01"}

try:
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()
    print(data)
except requests.RequestException as e:
    print("请求失败：", e)
```

#### 6.4 响应解析并转为 DataFrame
```python
import pandas as pd

data = response.json()
records = data["data"]
df = pd.DataFrame(records)
print(df.head())
```

### 练习题

- **读取本地的 `api_orders_response.json`，打印最外层键名。**

> 🏷️ 标签：Python进阶，API，json

> **参考回答**：
> ```python
> import json
> 
> with open("data/api_orders_response.json", "r", encoding="utf-8") as f:
>     api_result = json.load(f)
> 
> print(api_result.keys())
> ```

- **取出其中的 `data` 列表，并转成 DataFrame。**

> 🏷️ 标签：Python进阶，API，pandas

> **参考回答**：
> ```python
> import pandas as pd
> 
> records = api_result["data"]
> df = pd.DataFrame(records)
> print(df.head())
> ```

- **统计返回结果中的订单数。**

> 🏷️ 标签：Python进阶，API，pandas

> **参考回答**：
> ```python
> print(len(df))
> ```

- **统计已支付订单的总金额。**

> 🏷️ 标签：Python进阶，API，pandas

> **参考回答**：
> ```python
> paid_df = df[df["status"] == "paid"]
> print(paid_df["order_amount"].sum())
> ```

- **统计去重后的支付用户数。**

> 🏷️ 标签：Python进阶，API，pandas

> **参考回答**：
> ```python
> print(paid_df["user_id"].nunique())
> ```

- **`GET` 和 `POST` 的区别是什么？**

> 🏷️ 标签：Python进阶，API，HTTP

> **参考回答**：`GET` 更常用于获取数据，`POST` 更常用于提交数据。

- **为什么调接口时要设置 `timeout`？**

> 🏷️ 标签：Python进阶，API，requests

> **参考回答**：设置 `timeout` 可以避免接口长时间无响应时程序一直卡住。
