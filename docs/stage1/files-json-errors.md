# 4. 文件、JSON 与异常处理

程序总要和数据打交道：读配置、存结果、调 API 拿到的也是 JSON。这一节讲三件实用的事。

## 一、读写文件

### 文本文件

```python
# 读取（with 会自动关闭文件）
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()

# 逐行读（大文件更省内存）
with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())

# 写入
with open("out.txt", "w", encoding="utf-8") as f:
    f.write("你好，世界\n")
```

::: tip 编码
中文场景务必显式写 `encoding="utf-8"`，否则 Windows 上可能乱码或报错。
:::

### 用 pathlib（更现代）

```python
from pathlib import Path

p = Path("data.txt")
print(p.exists())               # 是否存在
print(p.read_text(encoding="utf-8"))
p.write_text("内容", encoding="utf-8")
```

## 二、JSON

JSON 是 API 和数据交换的事实标准。Python 用 `json` 模块：

```python
import json

data = {"name": "小明", "age": 20, "skills": ["Python", "AI"]}

# Python 对象 → JSON 字符串
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)

# JSON 字符串 → Python 对象
parsed = json.loads(json_str)
print(parsed["name"])

# 直接读写 JSON 文件
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("data.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)
```

`ensure_ascii=False` 让中文正常显示，而不是 `\u5c0f\u660e` 这种转义。

## 三、异常处理

程序出错时不要直接崩溃，要「接住」异常并合理处理：

```python
try:
    with open("not_exist.txt", "r", encoding="utf-8") as f:
        content = f.read()
except FileNotFoundError:
    print("文件不存在，使用默认内容")
    content = ""
except PermissionError:
    print("没有读取权限")
except Exception as e:
    print(f"发生未知错误：{e}")
finally:
    print("无论是否出错都会执行")
```

常见异常类型：

| 异常 | 含义 |
|---|---|
| `FileNotFoundError` | 文件不存在 |
| `PermissionError` | 权限不足 |
| `ValueError` | 值不合法（如 `int("abc")`） |
| `KeyError` | 字典里没有这个键 |
| `TypeError` | 类型不对 |

::: warning 别滥用
不要写 `except Exception: pass` 把错误全吞掉——这会让 bug 悄悄溜走。只捕获你能处理的异常，其他的让它暴露出来便于排查。
:::

## 四、综合练习

写一个脚本 `todo.py`：

- 用 JSON 文件 `todos.json` 保存待办事项（列表，每项含 `task` 和 `done`）；
- 支持命令行参数：`add <内容>`、`done <序号>`、`list`；
- 文件不存在时自动创建；JSON 损坏时提示并重建。

这个小练习把文件、JSON、异常处理都用上了，也是后面 FastAPI 项目的雏形。

## 验收标准

- [ ] 会用 `with open` 读写文本文件，知道为什么要指定编码
- [ ] 会用 json 模块在 Python 对象和 JSON 之间转换
- [ ] 会捕获常见异常，知道不能滥用笼统的 except

## 下一步

基础语法和数据处理都学完了，进入 [FastAPI 接口开发](/stage1/fastapi)——这是 AI 应用后端的主流框架。
