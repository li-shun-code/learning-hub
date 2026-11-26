# 动态规划

> 动态规划（DP）通过「记住子问题的答案」避免重复计算。它是面试最难也是最高频的题型之一，关键在于**状态定义**和**转移方程**。

<VisDynamicProgramming />

## 一、什么时候用 DP？

两个特征：

1. **重叠子问题**：同一个子问题被反复计算（回忆[递归](/dsa/recursion)里的斐波那契）。
2. **最优子结构**：大问题的最优解由子问题的最优解构成。

## 二、DP 四步骤

```text
① 定义状态：dp[i] 表示什么？（最关键）
② 转移方程：dp[i] 怎么由前面的状态算出来？
③ 初始条件：dp[0] 等边界值是多少？
④ 遍历顺序：从前往后还是从后往前？
```

## 三、入门：爬楼梯

每次爬 1 或 2 阶，爬到第 n 阶有多少种方法？

### 图解

```text
到达第 i 阶，最后一步要么从第 i-1 阶爬 1 阶上来，
要么从第 i-2 阶爬 2 阶上来。

dp[i] = dp[i-1] + dp[i-2]

n=1: 1 种 [1]
n=2: 2 种 [1+1, 2]
n=3: dp[2]+dp[1] = 2+1 = 3 种 [1+1+1, 1+2, 2+1]
n=4: dp[3]+dp[2] = 3+2 = 5 种
```

```python
def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2            # ③ 初始条件
    for i in range(3, n + 1):      # ④ 遍历顺序
        dp[i] = dp[i - 1] + dp[i - 2]   # ② 转移方程
    return dp[n]

# 空间优化：只保留前两个值
def climb_stairs_v2(n):
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1

print(climb_stairs_v2(5))   # 8
```

## 四、二维 DP：01 背包

容量为 W 的背包，物品各有重量 w 和价值 v，每个只能选一次，求最大价值。

### 图解表格

```text
物品: (重量, 价值) = (1,1), (3,4), (4,5)
背包容量 W=4

dp[i][j] = 前 i 个物品，容量 j 时的最大价值

      容量:  0  1  2  3  4
物品0(1,1):  0  1  1  1  1
物品1(3,4):  0  1  1  4  5
物品2(4,5):  0  1  1  4  5

转移：dp[i][j] = max(
    dp[i-1][j],              ← 不选第 i 个
    dp[i-1][j-w[i]] + v[i]   ← 选第 i 个（容量够时）
)

最终答案 dp[3][4] = 5（选物品1? 不，选物品2重量4价值5）
```

```python
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        w, v = weights[i - 1], values[i - 1]
        for j in range(W + 1):
            dp[i][j] = dp[i - 1][j]                   # 不选
            if j >= w:
                dp[i][j] = max(dp[i][j], dp[i - 1][j - w] + v)  # 选
    return dp[n][W]

print(knapsack([1, 3, 4], [1, 4, 5], 4))   # 5
```

### 空间优化（滚动数组）

`dp[i]` 只依赖 `dp[i-1]`，可以压缩成一维，**倒序遍历容量**：

```python
def knapsack_1d(weights, values, W):
    dp = [0] * (W + 1)
    for i in range(len(weights)):
        for j in range(W, weights[i] - 1, -1):   # 倒序！防止重复选同一物品
            dp[j] = max(dp[j], dp[j - weights[i]] + values[i])
    return dp[W]
```

::: warning 为什么倒序？
正序遍历时 `dp[j - w]` 已经被本轮更新过，相当于同一个物品被选了多次（变成「完全背包」）。倒序保证用到的是上一轮的值。
:::

## 五、DP 的状态设计心法

1. **题目问什么，dp 就定义什么**（比如「最大价值」「多少种方法」）。
2. **最后一步在哪里**：想想答案是由哪些前置状态推出来的。
3. **从小例子手推表格**：拿 n=3 的例子把 dp 数组填一遍，规律自然浮现。

## 六、DP 分类

| 类型 | 例子 |
|---|---|
| 线性 DP | 爬楼梯、最长递增子序列 |
| 二维 DP | 01 背包、最长公共子序列 |
| 区间 DP | 石子合并 |
| 树形 DP | 打家劫舍 III |
| 状态压缩 DP | TSP |

## 七、练习

1. 打家劫舍：dp[i] = max(dp[i-1], dp[i-2] + nums[i])。
2. 最长递增子序列（LIS）。
3. 完全背包（每个物品可无限选）——和 01 背包的区别只在遍历顺序。

## 下一步

进入 [回溯与搜索](/dsa/backtracking)，学习「穷举 + 剪枝」的搜索框架。
