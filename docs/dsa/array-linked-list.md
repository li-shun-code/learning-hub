# 数组与链表

> 数组和链表是两种最基础的线性存储方式。它们的差别集中在**内存是否连续**，由此决定了各自的优势场景。

<VisLinkedList />

## 一、数组：连续的内存格子

数组把元素放在一段连续的内存里，通过下标直接定位。

```text
索引:   0    1    2    3    4
内存: [ 10 | 20 | 30 | 40 | 50 ]
       ↑ 每个格子大小相同，紧挨着
```

**优势：随机访问快。** 知道下标就能一步算出地址，O(1)。

```python
arr = [10, 20, 30, 40, 50]
print(arr[2])   # 30，一步到位
```

**劣势：插入/删除慢。** 在中间插入要挪动后面所有元素，O(n)。

```text
在索引 2 插入 99：
[10 | 20 | 30 | 40 | 50]
           ↓ 30、40、50 依次后移
[10 | 20 | 99 | 30 | 40 | 50]
```

## 二、链表：用指针串起来的节点

链表的每个节点存「值 + 下一个节点的地址」，内存不要求连续。

```text
节点结构： [ 值 | next ]

链表：
[10|•] → [20|•] → [30|•] → [40|None]
 head
```

**优势：插入/删除快。** 找到位置后改指针即可，O(1)（但查找位置本身要 O(n)）。

```text
在 20 和 30 之间插入 99：
原来:  [20|•] → [30|•]
改:    [20|•] → [99|•] → [30|•]
              （只改两个指针）
```

**劣势：随机访问慢。** 要从头一个个走，O(n)。

```python
class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, val):
        """在尾部添加：O(n)，需要走到末尾"""
        new = Node(val)
        if not self.head:
            self.head = new
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = new

    def insert_after(self, target, val):
        """在第一个值为 target 的节点后插入：O(n) 查找 + O(1) 插入"""
        cur = self.head
        while cur and cur.val != target:
            cur = cur.next
        if cur:
            new = Node(val)
            new.next = cur.next
            cur.next = new

    def to_list(self):
        result = []
        cur = self.head
        while cur:
            result.append(cur.val)
            cur = cur.next
        return result

ll = LinkedList()
ll.append(10); ll.append(20); ll.append(30)
ll.insert_after(20, 99)
print(ll.to_list())   # [10, 20, 99, 30]
```

## 三、对比总结

| 操作 | 数组 | 链表 |
|---|---|---|
| 按下标访问 | O(1) ⭐ | O(n) |
| 头部插入 | O(n) | O(1) ⭐ |
| 尾部插入 | O(1)（有容量时） | O(n)（无尾指针）/ O(1)（有尾指针） |
| 中间插入/删除 | O(n) | O(1)（已知位置时）⭐ |
| 内存 | 连续，大小固定 | 离散，动态增长 |

## 四、图解：访问第 3 个元素

```text
数组 arr[3]：一步到位
[10 | 20 | 30 | 40 | 50]
               ↑ 直接算出地址

链表找第 3 个：从头走 3 步
[10|•] → [20|•] → [30|•] → [40|None]
 第1步     第2步     第3步 → 40
```

## 五、变体结构

- **双向链表**：每个节点有 `prev` 和 `next`，可以双向走，删除已知节点 O(1)。
- **循环链表**：尾节点指回头节点，适合环形数据（如约瑟夫问题）。

## 六、练习

1. 给 `LinkedList` 加 `delete(val)` 方法，删除第一个值为 `val` 的节点。
2. 实现「反转单链表」：先画图，再写代码。

<details>
<summary>反转思路提示</summary>

用三个指针 `prev`、`cur`、`next`，遍历时逐个把 `cur.next` 指向 `prev`，然后三个指针整体前移。
</details>

## 下一步

进入 [栈与队列](/dsa/stack-queue)，看两种「受限的线性结构」。
