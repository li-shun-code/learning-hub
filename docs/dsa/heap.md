# 堆与优先队列

> 堆是一种特殊的完全二叉树，能在 O(log n) 时间内插入、在 O(1) 时间内取到最值。它是优先队列的实现基础。

<VisHeap />

## 一、堆的性质

以**小顶堆**为例：父节点的值 ≤ 子节点的值。大顶堆则相反。

```text
小顶堆：            数组表示：
      1             [1, 3, 2, 7, 5, 4]
     / \            下标关系（从 0 开始）：
    3   2            父节点 i 的孩子：2i+1, 2i+2
   / \  /           孩子 j 的父节点：(j-1)//2
  7   5 4
```

堆通常用**数组**存储，靠下标关系维护树形结构，省去指针。

## 二、图解：插入与上浮

往堆尾插入 0，然后和父节点比较，小的往上换（上浮）：

```text
插入 0 到末尾：
      1                    1                    0
     / \                  / \                  / \
    3   2      →         3   2      →         3   2
   / \  /              / \  / \              / \  / \
  7   5 4             7   5 4  0            7   5 4  1
                              ↑0 与父节点 1 交换
                                         ↑0 与父节点 1 再交换
                                          到达根，结束
```

```python
def sift_up(heap, i):
    while i > 0:
        parent = (i - 1) // 2
        if heap[i] < heap[parent]:
            heap[i], heap[parent] = heap[parent], heap[i]
            i = parent
        else:
            break

def heap_push(heap, val):
    heap.append(val)
    sift_up(heap, len(heap) - 1)
```

## 三、图解：弹出与下沉

弹出堆顶（最小值），把末尾元素移到堆顶，然后和较小的孩子比较，大的往下换（下沉）：

```text
弹出 1，把 4 移到根：
      4                    2                    2
     / \                  / \                  / \
    3   2      →         3   4      →         3   4
   / \                / \                   / \
  7   5              7   5                 7   5
                     ↑4 与较小孩子 2 交换，继续下沉到合适位置
```

```python
def sift_down(heap, i):
    n = len(heap)
    while True:
        left, right = 2 * i + 1, 2 * i + 2
        smallest = i
        if left < n and heap[left] < heap[smallest]:
            smallest = left
        if right < n and heap[right] < heap[smallest]:
            smallest = right
        if smallest == i:
            break
        heap[i], heap[smallest] = heap[smallest], heap[i]
        i = smallest

def heap_pop(heap):
    top = heap[0]
    heap[0] = heap.pop()   # 末尾元素移到根
    if heap:
        sift_down(heap, 0)
    return top
```

## 四、Python 的 heapq

Python 标准库 `heapq` 把 list 当小顶堆用：

```python
import heapq

heap = [3, 1, 5, 2]
heapq.heapify(heap)            # 建成堆：O(n)
heapq.heappush(heap, 0)        # 插入：O(log n)
print(heapq.heappop(heap))     # 0，弹出最小值：O(log n)
print(heap[0])                 # 1，看堆顶（最小）：O(1)

# 大顶堆技巧：存负数
max_heap = []
heapq.heappush(max_heap, -5)
heapq.heappush(max_heap, -10)
print(-heapq.heappop(max_heap))  # 10，最大
```

## 五、经典应用：Top-K 问题

从海量数据中找最大的 K 个数——用大小为 K 的小顶堆：

```python
import heapq

def top_k(nums, k):
    heap = []
    for num in nums:
        if len(heap) < k:
            heapq.heappush(heap, num)
        elif num > heap[0]:       # 比堆顶（当前第 K 大）大才替换
            heapq.heapreplace(heap, num)
    return sorted(heap, reverse=True)

print(top_k([3, 1, 5, 2, 9, 7, 4], 3))   # [9, 7, 5]
```

**为什么高效？** 不用排序全部数据，只维护 K 个元素，时间 O(n log K)，空间 O(K)。

其他应用：优先队列（Dijkstra 算法）、合并 K 个有序链表、中位数查找。

## 六、练习

1. 用 heapq 找数组中第 K 小的元素。
2. 手写大顶堆（把比较符号反过来即可）。

## 下一步

进入 [图](/dsa/graph)，学习更复杂的非线性结构。
