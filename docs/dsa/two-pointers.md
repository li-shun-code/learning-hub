# 双指针与滑动窗口

> 双指针用一个数组上的两个索引协同遍历，把 O(n²) 的暴力解法降到 O(n)。滑动窗口是双指针的一种典型形态。

<VisSlidingWindow />

## 一、双指针的三种模式

### 1. 对向指针（左右夹逼）

两个指针从两端向中间移动。经典场景：**有序数组的两数之和**。

```text
arr = [2, 3, 5, 8, 11, 15]，target = 11
       ↑L             ↑R

2+15=17 > 11 → R 左移
2+11=13 > 11 → R 左移
2+8=10  < 11 → L 右移
3+8=11  == 11 ✓ 找到 [3, 8]
```

```python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1              # 和小了，左指针右移增大和
        else:
            right -= 1             # 和大了，右指针左移减小和
    return []
```

### 2. 同向指针（快慢指针）

两个指针同方向移动，一个快一个慢。经典场景：**原地删除重复元素**。

```text
[1, 1, 2, 2, 3, 4, 4]
 ↑slow
      ↑fast（寻找新元素）
找到 2 → 放到 slow 位置，slow 前移
重复直到 fast 走完 → 前 slow 个元素是去重结果
```

```python
def remove_duplicates(arr):
    if not arr:
        return 0
    slow = 0
    for fast in range(1, len(arr)):
        if arr[fast] != arr[slow]:
            slow += 1
            arr[slow] = arr[fast]
    return slow + 1   # 新长度

nums = [1, 1, 2, 2, 3, 4, 4]
k = remove_duplicates(nums)
print(nums[:k])   # [1, 2, 3, 4]
```

### 3. 滑动窗口

维护一个「窗口」[left, right]，右指针扩展，左指针收缩。经典场景：**无重复字符的最长子串**。

```text
s = "abcabcbb"，找最长无重复子串

right 扩展: [a] [ab] [abc]
再扩展 a → 窗口内已有 a，左收缩到 b: [bc]
继续: [bca] [bcab]... 遇到 b 重复 → 收缩到 c: [cab]
... 记录最大长度 3（abc / bca / cab）
```

```python
def length_of_longest_substring(s: str) -> int:
    char_index = {}      # 字符 → 最近出现位置
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= left:
            left = char_index[ch] + 1      # 跳过重复，收缩左边界
        char_index[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len

print(length_of_longest_substring("abcabcbb"))   # 3
```

## 二、图解滑动窗口模板

```text
初始化 left=0, 数据结构为空

for right in range(n):       ← 右指针扩展，纳入新元素
    加入 arr[right]
    
    while 窗口不满足条件:     ← 左指针收缩，移除旧元素
        移除 arr[left]
        left += 1
    
    更新答案（此时窗口满足条件）

关键：右指针只前进不后退，左指针只前进不后退 → 总操作 O(n)
```

## 三、经典例题：长度最小的子数组

找和 ≥ target 的最短子数组：

```python
def min_subarray_len(nums, target):
    left = 0
    total = 0
    ans = float('inf')
    for right, val in enumerate(nums):
        total += val               # 扩展窗口
        while total >= target:     # 满足条件，尝试收缩求最短
            ans = min(ans, right - left + 1)
            total -= nums[left]
            left += 1
    return ans if ans != float('inf') else 0

print(min_subarray_len([2, 3, 1, 2, 4, 3], 7))   # 2  ([4,3])
```

## 四、什么时候用？

| 场景 | 模式 |
|---|---|
| 有序数组找配对 | 对向指针 |
| 原地修改数组、去重 | 快慢指针 |
| 子串/子数组问题（最长、最短、计数） | 滑动窗口 |
| 链表找环、找中点 | 快慢指针 |

## 五、练习

1. 三数之和（排序 + 固定一个数 + 对向指针）。
2. 用滑动窗口求「水果成篮」或「最小覆盖子串」。
3. 用快慢指针判断链表是否有环（Floyd 判圈）。

## 下一步

进入 [贪心算法](/dsa/greedy)，学习「每一步都选当前最优」的思想。
