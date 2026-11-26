# 哈希表

> 哈希表（Hash Table）用「键 → 桶」的映射，让查找平均达到 O(1)。它是字典、集合背后的核心结构。

<VisHashTable />

## 一、核心思想

如果直接把数据存在一个数组里，想找某个值要遍历（O(n)）。哈希表换个思路：**用键算出一个下标，直接去那个位置取值**。

```text
key: "小明"  →  hash("小明")  →  3  →  数组下标 3 处存着对应值

哈希表内部：
下标:   0      1      2      3      4
      [    |      |      | 小明 |      ]
                          ↑ O(1) 直接定位
```

关键部件：

- **哈希函数**：把任意 key 映射成数组下标。
- **哈希冲突**：不同 key 算出了同一个下标，必须处理。

## 二、图解哈希冲突

```text
hash("小明") = 3
hash("小红") = 3   ← 冲突了！都指向下标 3

链地址法（最常用）：每个桶挂一个链表
下标 3:  [ ("小明", 值A) | ("小红", 值B) ] → None
```

Python 的 `dict` 用的就是类似思路（开放寻址 + 扰动函数），但原理相通。

## 三、Python 中的哈希表

```python
# dict 就是哈希表
scores = {"小明": 90, "小红": 85, "小刚": 92}

print(scores["小明"])        # 90，平均 O(1)
scores["小丽"] = 88          # 插入，平均 O(1)
del scores["小红"]           # 删除，平均 O(1)
print("小刚" in scores)       # True，平均 O(1)

# set 也是哈希表，只存键
names = {"小明", "小红", "小明"}
print(names)                 # {'小明', '小红'}，自动去重
```

## 四、手写一个简易哈希表（链地址法）

```python
class HashTable:
    def __init__(self, size=8):
        self.size = size
        self.table = [[] for _ in range(size)]   # 每个桶是一个列表

    def _hash(self, key):
        return hash(key) % self.size              # 取模映射到桶

    def put(self, key, value):
        idx = self._hash(key)
        bucket = self.table[idx]
        for i, (k, v) in enumerate(bucket):
            if k == key:              # key 已存在 → 更新
                bucket[i] = (key, value)
                return
        bucket.append((key, value))   # 不存在 → 新增

    def get(self, key):
        idx = self._hash(key)
        for k, v in self.table[idx]:
            if k == key:
                return v
        return None                   # 没找到

    def remove(self, key):
        idx = self._hash(key)
        bucket = self.table[idx]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                return

ht = HashTable()
ht.put("小明", 90)
ht.put("小红", 85)
print(ht.get("小明"))   # 90
ht.put("小明", 95)      # 更新
print(ht.get("小明"))   # 95
```

## 五、复杂度分析

| 操作 | 平均 | 最坏 |
|---|---|---|
| 查找 | O(1) | O(n)（所有 key 都冲突） |
| 插入 | O(1) | O(n) |
| 删除 | O(1) | O(n) |

**最坏情况**发生在哈希函数很差、所有键都映射到同一个桶时，退化为链表。好的哈希函数 + 扩容机制能避免这种情况。

## 六、经典应用

- **两数之和**：边遍历边把 `值→下标` 存进哈希表，查找配对 O(1)。
- **计数统计**：统计词频、字符出现次数。
- **去重**：用 set。
- **缓存**：Redis 本质就是哈希表。

### 示例：两数之和

```python
def two_sum(nums, target):
    seen = {}   # 值 → 下标
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:        # O(1) 查找
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))   # [0, 1]
```

## 七、练习

1. 实现 `containsDuplicate`：用 set 判断数组是否有重复元素。
2. 统计一段文本中每个单词的出现次数（用 dict）。

## 下一步

进入 [树与二叉树](/dsa/tree)，探索非线性的层次结构。
