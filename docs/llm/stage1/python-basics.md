# 2. Python 核心语法

这一节把 Python 最核心的语法过一遍：**变量与数据类型、流程控制、四大数据结构**。每学一个知识点都要动手敲代码验证——看懂不等于会用。

## 一、变量与数据类型

Python 是动态类型语言，变量不需要声明类型：

```python
name = "小明"      # str 字符串
age = 20           # int 整数
height = 1.75      # float 浮点数
is_student = True  # bool 布尔值
nothing = None     # NoneType 空值

print(type(name))  # <class 'str'>
```

常见操作：

```python
# 字符串
print("你好" + "，世界")        # 拼接
print(f"我今年 {age} 岁")       # f-string 格式化（最常用）

# 类型转换
print(int("42") + 1)            # 43
print(str(3.14))                # '3.14'
```

## 二、运算符

```python
# 算术：+ - * / //（整除） %（取余） **（幂）
print(7 // 2)   # 3
print(7 % 2)    # 1
print(2 ** 3)   # 8

# 比较：> < == != >= <=
# 逻辑：and or not
print(5 > 3 and 2 < 4)  # True
```

## 三、流程控制

### 条件分支

```python
score = 85
if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("需努力")
```

::: warning 缩进很重要
Python 用**缩进**表示代码块，不用花括号。同一层级缩进必须一致（建议都用 4 个空格，不要混用 Tab）。
:::

### 循环

```python
# for 循环：适合已知次数
for i in range(5):
    if i == 3:
        continue   # 跳过本次
    if i == 4:
        break      # 终止循环
    print(i)       # 0 1 2

# while 循环：适合条件驱动
count = 0
while count < 3:
    print(count)
    count += 1
```

## 四、四大数据结构

### 列表 list —— 有序、可变

```python
fruits = ["苹果", "香蕉", "橙子"]
fruits.append("葡萄")       # 添加
print(fruits[0])            # 索引，第一个
print(fruits[-1])           # 最后一个
print(fruits[1:3])          # 切片：索引 1 到 2
fruits[0] = "梨"            # 修改
```

### 元组 tuple —— 有序、不可变

```python
point = (3, 5)
x, y = point                # 解包
print(x, y)                 # 3 5
```

### 字典 dict —— 键值对

```python
person = {"name": "小明", "age": 20}
print(person["name"])                    # 小明
person["city"] = "北京"                  # 添加
print(person.get("gender", "未知"))      # 安全取值，不存在返回默认值

# 遍历
for key, value in person.items():
    print(key, value)
```

### 集合 set —— 无序、去重

```python
nums = {1, 2, 2, 3}
print(nums)                 # {1, 2, 3}，自动去重
print(3 in nums)            # True，成员判断
```

## 五、综合小练习

统计一段文本中每个单词出现的次数：

```python
text = "the cat sat on the mat the cat ran"
counter = {}
for word in text.split():
    counter[word] = counter.get(word, 0) + 1
print(counter)
# {'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1, 'ran': 1}
```

## 六、动手练习（务必自己敲）

1. 写一个九九乘法表（嵌套 for 循环）。
2. 写一个「猜数字」小游戏：随机 1–100，提示大了/小了，直到猜中。
3. 用字典实现一个简单通讯录，支持增、查、改、删。

## 验收标准

- [ ] 能说出四种数据结构的区别和适用场景
- [ ] 能独立完成上面三个练习
- [ ] 遇到缩进错误、类型错误能自己看懂报错并修复

## 下一步

学会基本语法后，进入 [函数、模块与面向对象](/llm/stage1/functions-modules-oop) 学习怎么组织代码。
