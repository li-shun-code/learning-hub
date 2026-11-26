# 3. 函数、模块与面向对象

会写语法之后，下一步是「怎么把代码组织得像个项目」。这一节讲三件事：用**函数**拆步骤、用**模块**组织文件、用**类**建模。

## 一、函数

函数把一段逻辑封装起来，可以反复调用、便于测试。

```python
def greet(name: str, greeting: str = "你好") -> str:
    """返回一个问候语。"""
    return f"{greeting}，{name}！"

print(greet("小明"))                 # 你好，小明！
print(greet("小红", "早上好"))       # 早上好，小红！
```

要点：

- `def` 定义函数，`return` 返回值；
- 参数可以有默认值；
- `: str` 和 `-> str` 是**类型注解**，不强制但强烈建议写——对人和 AI 都友好；
- 用 `"""文档字符串"""` 说明函数作用。

### 参数进阶

```python
# 可变位置参数 *args，可变关键字参数 **kwargs
def log(*args, **kwargs):
    print("位置参数:", args)
    print("关键字参数:", kwargs)

log("a", "b", level="INFO")
```

## 二、模块与包

当代码变多，就要拆成多个文件：

```text
my-app/
├── main.py          # 程序入口
├── utils.py         # 工具函数
└── models/
    ├── __init__.py  # 让 models 成为包
    └── user.py      # 用户相关代码
```

在 `main.py` 里用：

```python
from utils import greet
from models.user import User

print(greet("小明"))
```

::: tip 命名习惯
模块名用小写下划线（`user_service.py`），避免和内置模块同名（别叫 `json.py`、`random.py`）。
:::

## 三、面向对象（OOP）

把「类」理解成**模板**，把「实例」理解成**按模板做出来的具体对象**。比如「学生」是类，小明、小红是实例。

```python
class Student:
    def __init__(self, name: str, age: int):
        # 属性
        self.name = name
        self.age = age

    def study(self, course: str) -> str:
        # 方法
        return f"{self.name} 正在学习 {course}"

# 创建实例
xiaoming = Student("小明", 20)
print(xiaoming.name)             # 小明
print(xiaoming.study("Python"))  # 小明 正在学习 Python
```

### 继承

```python
class Animal:
    def speak(self) -> str:
        return "..."

class Dog(Animal):
    def speak(self) -> str:
        return "汪汪"

print(Dog().speak())  # 汪汪
```

::: tip 学到什么程度？
零基础阶段掌握「定义类、属性、方法、创建实例、简单继承」就够了。抽象基类、元类、魔法方法等以后用到再学。
:::

## 四、常见误区

- **只看不练**：OOP「理解不难，应用很难」，必须自己写几个类。
- **过度设计**：为了用类而用类。简单脚本用函数就够了，别硬套。
- **忽略类型注解**：写上注解，代码可读性和 AI 辅助效果都更好。

## 五、动手练习

1. 把上一节的「通讯录」改写成用类实现：`ContactBook` 有 `add`、`find`、`update`、`delete`、`list_all` 方法。
2. 定义一个 `BankAccount` 类，有存款、取款、查询余额方法，取款时余额不足要提示。

## 验收标准

- [ ] 会定义函数并写清参数、返回值、文档字符串
- [ ] 会把代码拆成模块和包，正确 import
- [ ] 会定义类、创建实例、写方法，理解继承

## 下一步

进入 [文件、JSON 与异常处理](/llm/stage1/files-json-errors)，学习数据持久化和错误处理。
