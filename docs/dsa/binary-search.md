# 查找与二分

> 二分查找在**有序数组**上每次排除一半，O(log n) 完成查找。原理简单，但边界条件极易写错。

<VisBinarySearch />

## 一、图解二分查找

在有序数组 `[2, 5, 8, 12, 16, 23, 38, 56, 72]` 中找 23：

```text
数组下标:  0   1   2   3   4   5   6   7   8
值:       2   5   8  12  16  23  38  56  72
          ↑L          ↑M          ↑R

第 1 轮: M = (0+8)//2 = 4，值 16 < 23 → 目标在右半边，L = M+1 = 5

下标:              5   6   7   8
值:               23  38  56  72
                   ↑L  ↑M     ↑R
第 2 轮: M = (5+8)//2 = 6，值 38 > 23 → 目标在左半边，R = M-1 = 5

下标:              5
值:               23
                  L=M=R
第 3 轮: M = 5，值 23 == 23 → 找到！返回 5
```

## 二、基础实现

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1      # 闭区间 [left, right]
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1             # 排除 mid 及左边
        else:
            right = mid - 1            # 排除 mid 及右边
    return -1                          # 没找到

arr = [2, 5, 8, 12, 16, 23, 38, 56, 72]
print(binary_search(arr, 23))   # 5
print(binary_search(arr, 7))    # -1
```

::: warning 关键边界
`while left <= right` 配合 `right = mid - 1` / `left = mid + 1` 是「闭区间」写法。写成 `left < right` 时边界处理完全不同，别混用两种模板。
:::

## 三、避免整数溢出

在 C++/Java 里 `(left + right)` 可能溢出，用 `left + (right - left) // 2`。Python 整数无溢出问题，但写法统一更好：

```python
mid = left + (right - left) // 2
```

## 四、经典变种

### 1. 找第一个等于 target 的位置（左边界）

```text
arr = [1, 2, 2, 2, 3, 4]，target = 2 → 返回 1（不是 2 或 3）
```

```python
def find_first(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid           # 先记下，继续往左找
            right = mid - 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result

print(find_first([1, 2, 2, 2, 3, 4], 2))   # 1
```

### 2. 找最后一个等于 target 的位置（右边界）

把 `right = mid - 1` 改成 `left = mid + 1` 即可。

### 3. 搜索插入位置

```text
arr = [1, 3, 5, 6], target = 4 → 返回 2（插到下标 2）
arr = [1, 3, 5, 6], target = 7 → 返回 4（插到末尾）
```

```python
def search_insert(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return left    # 循环结束时 left 就是第一个 >= target 的位置
```

## 五、二分答案（进阶思想）

不直接找元素，而是**二分「答案的取值范围」**：当问题具有「单调性」（某个条件随着值增大从 False 变 True）时，可以二分这个条件。

```text
例子：求「使每天至少吃 k 个」的最小 k（吃越快天数越少，具有单调性）
k 太小 → 天数太多（不满足）
k 太大 → 天数够少（满足）
二分 k，找最小的满足值
```

这是二分 hardest 的应用，面试高频，进阶再深入。

## 六、复杂度与前提

- 时间 O(log n)，空间 O(1)。
- **前提：数组必须有序**。无序数据要先排序（O(n log n)），或者用[哈希表](/dsa/hash-table)做 O(1) 查找。

## 七、练习

1. 实现左边界、右边界查找。
2. 在旋转排序数组中查找 target（LeetCode 33）。
3. 用二分求一个完全平方数的平方根（向下取整）。

## 下一步

进入 [双指针与滑动窗口](/dsa/two-pointers)，学习数组/字符串上的高频技巧。
