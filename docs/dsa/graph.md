# 图

> 图描述「多对多」的关系网络：社交关系、路网、依赖关系都可以建模成图。

<VisGraph />

## 一、图的基本概念

```text
     A --- B
     | \   |
     |  \  |
     C --- D

A、B、C、D 是顶点（节点），连线是边。
```

分类：

- **有向 / 无向**：边有没有方向（A→B 单向，还是 A-B 双向）。
- **加权 / 无权**：边有没有权重（如距离、耗时）。
- **连通 / 非连通**：任意两点是否都能到达。

## 二、图的存储

### 邻接矩阵

用二维数组 `matrix[i][j]` 表示 i 到 j 是否有边：

```text
    A  B  C  D
A [ 0  1  1  1 ]
B [ 1  0  0  1 ]
C [ 1  0  0  1 ]
D [ 1  1  1  0 ]

优点：查边 O(1)；缺点：占 O(n²) 空间，稀疏图浪费
```

### 邻接表（更常用）

每个顶点存一个邻居列表：

```python
graph = {
    'A': ['B', 'C', 'D'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['A', 'B', 'C'],
}
# 空间 O(n + e)，n 顶点数、e 边数，适合稀疏图
```

## 三、图的遍历

### BFS（广度优先）—— 用队列

像水波一样一层层扩散，先访问近的，再访问远的。

```text
从 A 出发：
第 0 层: A
第 1 层: B, C, D
访问顺序: A → B → C → D
```

```python
from collections import deque

def bfs(graph, start):
    visited = {start}
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                q.append(neighbor)
    return order

print(bfs(graph, 'A'))   # ['A', 'B', 'C', 'D']
```

### DFS（深度优先）—— 用栈或递归

一条路走到底，走不通再回退。

```text
从 A 出发（按邻接表顺序）：
A → B → D → C → (回退) → 结束
访问顺序: A, B, D, C
```

```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    order = [start]
    for neighbor in graph[start]:
        if neighbor not in visited:
            order.extend(dfs(graph, neighbor, visited))
    return order

print(dfs(graph, 'A'))   # ['A', 'B', 'D', 'C']
```

::: tip 对比记忆
BFS 用**队列**（先进先出），逐层展开；DFS 用**栈/递归**（后进先出），一路走到底。回想[栈与队列](/dsa/stack-queue)那节。
:::

## 四、图解 BFS vs DFS

```text
        A
      /   \
     B     C
    / \     \
   D   E     F

BFS: A → B → C → D → E → F       （一层层）
DFS: A → B → D → E → C → F       （一条路走到底）
```

## 五、经典应用

- **BFS**：最短路径（无权图）、社交网络「几度好友」、爬虫层级抓取。
- **DFS**：连通分量、拓扑排序、路径搜索、回溯（配合[回溯算法](/dsa/backtracking)）。
- **加权图最短路径**：Dijkstra（配合[堆](/dsa/heap)）、Floyd。
- **依赖关系**：拓扑排序（课程安排、编译依赖）。

## 六、练习

1. 把上面的 BFS/DFS 代码自己敲一遍，换一个起点观察顺序。
2. 写一个函数判断无向图是否连通（从任一点 BFS，看是否访问了所有节点）。
3. 用 BFS 求无权图两点间的最短路径（记录父节点，找到目标后回溯路径）。

## 下一步

进入 [递归与分治](/dsa/recursion)，学习「把大问题拆成小问题」的思想。
