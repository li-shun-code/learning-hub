# 排序

> 排序算法是算法的基石。重点理解三种 O(n log n) 排序的思路，以及它们的稳定性与适用场景。

<VisSorting />

## 一、总览

| 算法 | 平均时间 | 最坏 | 空间 | 稳定 | 核心思想 |
|---|---|---|---|---|---|
| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 | 相邻比较交换 |
| 选择排序 | O(n²) | O(n²) | O(1) | 不稳定 | 每次选最小 |
| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 | 插入到有序区 |
| 快速排序 | O(n log n) | O(n²) | O(log n) | 不稳定 | 分治 + 分区 |
| 归并排序 | O(n log n) | O(n log n) | O(n) | 稳定 | 分治 + 合并 |
| 堆排序 | O(n log n) | O(n log n) | O(1) | 不稳定 | 用堆取最值 |

**稳定性**：相等元素的相对顺序是否保持。需要稳定时用归并/插入。

## 二、冒泡排序 —— 最直观

每轮把最大的元素「冒泡」到末尾。

```text
[5, 3, 8, 4, 2]  第 1 轮：
 5>3 交换 → [3, 5, 8, 4, 2]
 5<8 不动
 8>4 交换 → [3, 5, 4, 8, 2]
 8>2 交换 → [3, 5, 4, 2, 8]   ← 8 到位
重复 n-1 轮...
```

```python
def bubble_sort(arr):
    arr = arr[:]
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:      # 优化：已经有序就提前结束
            break
    return arr
```

## 三、快速排序 —— 最常用

选一个基准（pivot），把小的放左边、大的放右边，然后递归处理两边。

```text
[5, 3, 8, 4, 2]，选 pivot = 5

分区：
小于 5: [3, 4, 2]    等于: [5]    大于 5: [8]

递归排序两边：
[2, 3, 4] + [5] + [8] → [2, 3, 4, 5, 8] ✓
```

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([5, 3, 8, 4, 2]))   # [2, 3, 4, 5, 8]
```

::: warning 最坏情况
如果每次 pivot 都选到最值（如已排序数组选第一个），会退化为 O(n²)。实际实现用「三数取中」或随机化选择 pivot 来避免。
:::

## 四、归并排序 —— 稳定且可控

见[递归与分治](/dsa/recursion)一节的顺序图与代码。核心是「先拆后合，合时排序」。

## 五、插入排序 —— 小数据很快

像整理扑克牌：从左到右，把当前元素插入左边已排好的区域。

```text
[5, 3, 8, 4, 2]
  3 < 5 → 插到前面: [3, 5, 8, 4, 2]
  8 已在正确位置
  4 → 插到 5 前:    [3, 4, 5, 8, 2]
  2 → 插到最前:     [2, 3, 4, 5, 8] ✓
```

```python
def insertion_sort(arr):
    arr = arr[:]
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]      # 大的往后挪
            j -= 1
        arr[j + 1] = key             # 插入空位
    return arr
```

## 六、图解：各排序的「动作」

```text
冒泡: 相邻两个比，大的往后挪（像气泡上浮）
选择: 每轮扫描选最小的，放到前面
插入: 拿起一张牌，插进左边排好的牌堆
快排: 找基准分堆，递归处理（分治）
归并: 拆到最小，再两两合并（分治）
堆排: 建堆，反复弹出堆顶（见「堆」一节）
```

## 七、Python 内置排序

```python
nums = [5, 3, 8, 4, 2]
print(sorted(nums))         # 返回新列表，原列表不变
nums.sort()                 # 原地排序，返回 None
print(nums)                 # [2, 3, 4, 5, 8]

# 按自定义规则排
words = ["apple", "bb", "cherry"]
print(sorted(words, key=len))   # ['bb', 'apple', 'cherry']
```

Python 的 `sorted` 用的是 **Timsort**（归并 + 插入的混合），最坏 O(n log n)，且稳定。

## 八、练习

1. 手写冒泡、快排、插入排序，用同一个数组验证结果。
2. 实现一个「稳定」版快排（思考为什么简单版不稳定）。
3. 用 `sorted` 的 `key` 参数按学生成绩排序。

## 下一步

进入 [查找与二分](/dsa/binary-search)，学习有序数据上的高效查找。
