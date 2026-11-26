# 栈与队列

> 栈和队列都是「受限的线性结构」：只能在特定位置插入和删除。正是这种限制，让它们成为解决特定问题的利器。

<VisStackQueue />

## 一、栈：后进先出（LIFO）

就像一摞盘子，只能从顶部放、从顶部取。**最后放进去的，最先拿出来**。

```text
入栈(push)           出栈(pop)
                     
    ┌───┐               ┌───┐
    │ D │ ← top         │   │ ← 空
    ├───┤               ├───┤
    │ C │               │ C │ ← top
    ├───┤               ├───┤
    │ B │               │ B │
    ├───┤               ├───┤
    │ A │               │ A │
    └───┘               └───┘
```

常见操作：`push`（入栈）、`pop`（出栈）、`peek`（看栈顶）。

```python
stack = []
stack.append('A')   # push
stack.append('B')
stack.append('C')
print(stack[-1])    # peek → 'C'
print(stack.pop())  # 'C'
print(stack)        # ['A', 'B']
```

Python 的 list 直接当栈用即可（`append` + `pop`）。

### 经典应用：括号匹配

```text
表达式: ( ( ) [ ] )
扫描:
(  → 入栈 [(]
(  → 入栈 [(, (]
)  → 出栈匹配 (  ✓
[  → 入栈 [(, []
]  → 出栈匹配 [  ✓
)  → 出栈匹配 (  ✓  → 栈空，全部匹配！
```

```python
def is_valid(s: str) -> bool:
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

print(is_valid("()[]{}"))   # True
print(is_valid("(]"))       # False
```

其他应用：函数调用栈、撤销（Ctrl+Z）、浏览器后退、深度优先搜索。

## 二、队列：先进先出（FIFO）

就像排队买票，先来的先服务。**最先放进去的，最先拿出来**。

```text
入队(enqueue) →  [A][B][C][D]  → 出队(dequeue)
                  ↑front    ↑rear
                 A 先出队
```

```python
from collections import deque

q = deque()
q.append('A')        # 入队
q.append('B')
q.append('C')
print(q[0])          # 看队首 → 'A'
print(q.popleft())   # 出队 → 'A'
print(list(q))       # ['B', 'C']
```

::: warning 别用 list 当队列
`list.pop(0)` 出队是 O(n)，因为要移动后面所有元素。用 `collections.deque`，`popleft()` 是 O(1)。
:::

### 经典应用：BFS（广度优先搜索）

队列是 BFS 的核心数据结构——先访问的节点，先展开它的邻居，保证按「层」遍历。我们会在[图](/dsa/graph)一节详细图解。

其他应用：任务调度、消息队列、打印队列、缓存淘汰（FIFO 策略）。

## 三、对比总结

| 特性 | 栈 | 队列 |
|---|---|---|
| 规则 | 后进先出 LIFO | 先进先出 FIFO |
| 操作端 | 只在一端（栈顶） | 两端（队尾入、队首出） |
| 典型应用 | 括号匹配、DFS、撤销 | BFS、任务调度、缓冲 |

## 四、图解：函数调用栈

```text
调用 main() → 调用 foo() → 调用 bar()

栈变化：
[main]           [main, foo]           [main, foo, bar]
                                        ↑ 当前执行 bar

bar() 返回 → 弹出，回到 foo；foo 返回 → 弹出，回到 main
[main, foo]  →  [main]  →  []
```

这就是为什么递归太深会「栈溢出」——每层调用都要压栈。

## 五、练习

1. 用栈实现「有效括号」判断（上面的代码自己敲一遍）。
2. 用两个栈实现一个队列（经典面试题，画图想清楚）。
3. 用队列实现栈。

## 下一步

进入 [哈希表](/dsa/hash-table)，看为什么查找能接近 O(1)。
