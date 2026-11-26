# 复杂度分析

> 复杂度分析让我们在**不运行代码**的情况下，判断一个算法的好坏。它关注「输入规模 n 变大时，运行时间/内存怎么增长」。

<VisComplexity />

## 一、为什么需要 Big-O？

同一段逻辑，不同写法效率可能差几个数量级。比如在一个有 10 亿元素的列表里找东西：

- 从头一个个找（O(n)）：最坏要找 10 亿次；
- 有序数据二分找（O(log n)）：只要约 30 次。

Big-O 描述的是**增长趋势**，忽略常数系数和低阶项。

## 二、常见复杂度速查

```text
O(1)      常数      最好
O(log n)  对数      二分查找
O(n)      线性      遍历一次
O(n log n) 线性对数  快速排序、归并排序
O(n²)     平方      双重循环
O(2ⁿ)     指数      穷举子集
O(n!)     阶乘      全排列      最差
```

增长对比（n 越大差距越夸张）：

```text
n=10:    O(n)=10      O(n²)=100     O(2ⁿ)=1024
n=100:   O(n)=100     O(n²)=10000   O(2ⁿ)≈1e30
```

## 三、怎么算？

### 1. 只看循环层数

```python
# O(1)：没有循环
def get_first(arr):
    return arr[0]

# O(n)：一层循环
def find(arr, target):
    for x in arr:          # 执行 n 次
        if x == target:
            return True
    return False

# O(n²)：两层嵌套循环
def has_duplicate(arr):
    for i in range(len(arr)):        # n 次
        for j in range(i + 1, len(arr)):  # 平均 n/2 次
            if arr[i] == arr[j]:
                return True
    return False
```

### 2. 忽略常数和低阶项

```python
# 3n + 5 次操作 → O(n)
for x in arr:      # n 次
    print(x)        # 每次 3 个操作
print("done")       # 1 次
```

### 3. 对数来自「每次减半」

```python
# O(log n)：每次 n 减半
def shrink(n):
    while n > 1:
        n //= 2        # 2^k = n → 执行 k = log₂n 次
        print(n)
```

## 四、空间复杂度

看**额外申请的内存**随 n 怎么增长：

```python
# O(1) 空间：只用了几个变量
def sum_arr(arr):
    total = 0
    for x in arr:
        total += x
    return total

# O(n) 空间：新建了和输入一样大的列表
def double(arr):
    return [x * 2 for x in arr]

# O(n) 空间：递归调用栈深度为 n
def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)
```

## 五、图解：时间复杂度增长曲线

```text
耗时
 │                                       O(2ⁿ)
 │                                    ╱
 │                                 ╱
 │                              ╱  O(n²)
 │                           ╱
 │                        ╱ O(n log n)
 │                    ╱╱
 │              ───── O(n)
 │        ───── O(log n)
 │  ───── O(1)
 └──────────────────────────────────── n（输入规模）
```

## 六、练习

分析下面代码的时间复杂度：

```python
def mystery(n):
    i = n
    while i > 0:
        for j in range(n):
            print(i, j)
        i //= 2
```

<details>
<summary>答案</summary>

外层循环每次 `i` 减半，执行 `log n` 次；内层循环每次 `n` 次。总复杂度 **O(n log n)**。
</details>

## 下一步

进入 [数组与链表](/dsa/array-linked-list)，用复杂度视角对比这两种最基础的结构。
