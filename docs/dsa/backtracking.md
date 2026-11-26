# 回溯与搜索

> 回溯本质是「穷举 + 剪枝」：一条路走到黑，走不通就回退，尝试其他选择。全排列、N 皇后、组合问题都用它。

<VisBacktracking />

## 一、回溯的核心框架

```text
回溯函数(path, 选择列表):
    if 满足结束条件:
        记录 path 为一个解
        return

    for 选择 in 选择列表:        ← 遍历所有可能
        做选择                   ← 加入 path，从选择列表移除
        回溯(path, 新选择列表)   ← 递归
        撤销选择                 ← 从 path 移除，恢复选择列表
```

::: tip 关键动作：「撤销」
回溯和递归的区别就在于「撤销选择」——让变量回到进入本层之前的状态，保证不同分支之间互不干扰。
:::

### 图解：全排列 [1,2,3] 的一层

```text
选择列表 [1,2,3]，path=[]

选 1 → path=[1]，剩下 [2,3]
  选 2 → path=[1,2]，剩下 [3]
    选 3 → path=[1,2,3] ✓ 记录
    撤销 3
  撤销 2
  选 3 → path=[1,3]，剩下 [2]
    选 2 → path=[1,3,2] ✓ 记录
    撤销 2
  撤销 3
撤销 1
→ 再分别以 2、3 开头重复...
共 6 种排列
```

## 二、全排列

```python
def permute(nums):
    result = []
    path = []
    used = [False] * len(nums)

    def backtrack():
        if len(path) == len(nums):
            result.append(path[:])       # 注意拷贝！path 后续会变
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True               # 做选择
            path.append(nums[i])
            backtrack()                  # 递归
            path.pop()                   # 撤销
            used[i] = False

    backtrack()
    return result

print(permute([1, 2, 3]))
# [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

## 三、组合：从 n 个数里选 k 个

```python
def combine(n, k):
    result = []
    path = []

    def backtrack(start):
        if len(path) == k:
            result.append(path[:])
            return
        # 剪枝：剩余元素不够就不用继续了
        for i in range(start, n - (k - len(path)) + 2):
            path.append(i)
            backtrack(i + 1)       # i+1 保证不重复选
            path.pop()

    backtrack(1)
    return result

print(combine(4, 2))
# [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
```

## 四、剪枝：让穷举变聪明

回溯的问题是指数级复杂度。剪枝能提前砍掉不可能的分支。

```text
例子：combine(4, 2)，path=[3]，还剩 [4]，需要再选 1 个

如果不剪枝：会尝试从 3 开始遍历到 4，但 3 开头只剩 1 个数（4），
如果 k-path 长度 > 剩余数量，就无法凑够 → 直接不进入

剪枝条件：for i in range(start, n - (k - len(path)) + 2)
          上界保证「剩余元素数量 >= 还需要选的数量」
```

## 五、N 皇后：经典回溯

在 n×n 棋盘放 n 个皇后，互不攻击（不同行、列、对角线）。

```text
4 皇后的一个解：
. Q . .      Q 在 (0,1)
. . . Q      Q 在 (1,3)
Q . . .      Q 在 (2,0)
. . Q .      Q 在 (3,2)
```

```python
def solve_n_queens(n):
    result = []
    board = [['.'] * n for _ in range(n)]

    def is_valid(row, col):
        # 检查同列
        for i in range(row):
            if board[i][col] == 'Q':
                return False
        # 检查左上对角线
        i, j = row - 1, col - 1
        while i >= 0 and j >= 0:
            if board[i][j] == 'Q':
                return False
            i -= 1; j -= 1
        # 检查右上对角线
        i, j = row - 1, col + 1
        while i >= 0 and j < n:
            if board[i][j] == 'Q':
                return False
            i -= 1; j += 1
        return True

    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if is_valid(row, col):
                board[row][col] = 'Q'          # 做选择
                backtrack(row + 1)             # 下一行
                board[row][col] = '.'          # 撤销

    backtrack(0)
    return result

print(len(solve_n_queens(4)))   # 2
```

## 六、回溯 vs DFS

回溯是 DFS 的一种应用形式：**DFS 关注「能否到达」，回溯关注「枚举所有可行解」**。回溯在 DFS 的基础上增加了「做选择/撤销选择」的路径记录。

## 七、复杂度

回溯通常是 **O(选择数^深度)**，天然指数级。剪枝能显著减少实际搜索量，但最坏情况仍然很高。适合小规模搜索（n ≤ 20 左右）。

## 八、练习

1. 子集：返回数组的所有子集（2ⁿ 个）。
2. 电话号码组合（LeetCode 17）。
3. 单词搜索：在二维网格中找单词是否存在。

## 下一步

模块14个主题全部完成！回到[模块首页](/dsa/)复习，或去[学习路线](/dsa/roadmap)规划下一轮刷题。
