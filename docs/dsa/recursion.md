# 递归与分治

> 递归是「函数调用自己」，分治是「把大问题拆成结构相同的小问题，分别解决再合并」。树、排序、动态规划都离不开它。

<VisRecursion />

## 一、递归三要素

写递归前先想清楚三件事：

1. **终止条件（base case）**：什么时候不用再递归了——防止无限调用。
2. **递归关系**：把问题拆成更小的同类问题。
3. **返回值/合并**：小问题的答案怎么组合成大问题的答案。

### 图解：阶乘

```text
factorial(5)
= 5 × factorial(4)
= 5 × (4 × factorial(3))
= 5 × (4 × (3 × factorial(2)))
= 5 × (4 × (3 × (2 × factorial(1))))
= 5 × (4 × (3 × (2 × 1)))     ← factorial(1) = 1 是终止条件
= 120                          ← 逐层返回并计算
```

```python
def factorial(n: int) -> int:
    if n <= 1:              # ① 终止条件
        return 1
    return n * factorial(n - 1)   # ② 递归关系 + ③ 合并

print(factorial(5))   # 120
```

## 二、图解：斐波那契数列

```text
fib(5)
├── fib(4)
│   ├── fib(3) → fib(2)→fib(1)+fib(0), fib(1)
│   └── fib(2)
└── fib(3)
    └── ...

大量重复计算！fib(3) 被算了两次
```

```python
# 朴素递归：O(2^n)，大量重复计算
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# 带备忘录：O(n)，记住算过的答案
def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]
```

这个「记住子问题答案」的思想，就是后面[动态规划](/dsa/dynamic-programming)的核心。

## 三、分治思想

分治三步：**分解 → 解决 → 合并**。

```text
原问题（大问题）
   ↓ 分解
子问题1  子问题2  子问题3 ...（结构相同、规模更小）
   ↓ 解决（递归）
各自答案
   ↓ 合并
原问题的答案
```

### 经典例子：归并排序

```text
[38, 27, 43, 3, 9, 82, 10]

分解:  [38,27,43,3] 和 [9,82,10]
       ↓           ↓
      [38,27] [43,3]  [9,82] [10]
       ↓           ↓
     [38] [27] [43] [3] [9] [82] [10]

合并（边合边排序）:
     [27,38]   [3,43]   [9,82]  [10]
        [3,27,38,43]     [9,10,82]
              [3,9,10,27,38,43,82]  ✓
```

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])    # 分解 + 递归解决
    right = merge_sort(arr[mid:])
    return merge(left, right)       # 合并

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

更多分治应用：[快速排序](/dsa/sorting)、二分查找、大整数乘法。

## 四、常见坑

- **忘了终止条件** → RecursionError（栈溢出）。
- **递归深度太大** → Python 默认递归深度约 1000，深层树/链可能超限，可以改 `sys.setrecursionlimit()`，但更要考虑改成迭代。
- **重复计算** → 用备忘录或动态规划优化。

## 五、练习

1. 用递归计算二叉树的最大深度（见[树](/dsa/tree)）。
2. 手写汉诺塔递归解法，并画出 n=3 的移动过程。
3. 把归并排序代码自己敲一遍。

## 下一步

进入 [排序](/dsa/sorting)，系统图解经典排序算法。
