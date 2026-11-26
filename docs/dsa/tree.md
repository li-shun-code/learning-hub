# 树与二叉树

> 树描述「一对多」的层次关系。二叉树是每个节点最多有两个孩子的树，是面试和算法中的核心结构。

<VisTree />

## 一、树的基本概念

```text
        A          ← 根节点 (root)
       / \
      B   C        ← B、C 是 A 的孩子；A 是它们的父节点
     / \   \
    D   E   F      ← D、E、F 是叶子节点（没有孩子）
```

术语：

- **根**：最顶层节点（A）
- **父/子**：直接相连的上下层节点
- **叶子**：没有孩子的节点（D、E、F）
- **深度**：从根到该节点的层数（A 深度 0，D 深度 2）
- **高度**：从该节点到最远叶子的层数

## 二、二叉树

每个节点最多两个孩子，分左孩子和右孩子。

```python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

# 构造一棵树：
#       1
#      / \
#     2   3
#    / \
#   4   5
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
```

### 满二叉树 vs 完全二叉树

```text
满二叉树（每层都满）：      完全二叉树（除最后一层外都满，最后一层靠左）：
      A                          A
     / \                        / \
    B   C                      B   C
   / \ / \                    / \ /
  D  E F  G                  D  E F
```

## 三、遍历：深度优先（DFS）

三种顺序，区别在于「什么时候访问根节点」：

```text
       1
      / \
     2   3
    / \
   4   5

前序（根左右）: 1, 2, 4, 5, 3
中序（左根右）: 4, 2, 5, 1, 3
后序（左右根）: 4, 5, 2, 3, 1
```

```python
def preorder(node):
    if not node:
        return
    print(node.val)          # 根
    preorder(node.left)      # 左
    preorder(node.right)     # 右

def inorder(node):
    if not node:
        return
    inorder(node.left)
    print(node.val)
    inorder(node.right)

def postorder(node):
    if not node:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.val)
```

::: tip 图解记忆法
把每个节点看成「根、左、右」三块，前中后的区别就是 `print` 放在哪：前面、中间、后面。递归结构完全一样。
:::

### 层序遍历（BFS）

按层从上到下、从左到右，用**队列**实现：

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    result = []
    q = deque([root])
    while q:
        node = q.popleft()
        result.append(node.val)
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
    return result

print(level_order(root))   # [1, 2, 3, 4, 5]
```

## 四、二叉搜索树（BST）

性质：**左子树所有值 < 根 < 右子树所有值**。因此查找、插入都是 O(log n)（平衡时）。

```text
      5
     / \
    3   7
   / \   \
  2   4   8

查找 4：5 → 往左到 3 → 往右到 4 ✓  （走了 3 步，而不是遍历全部）
```

```python
def search(root, target):
    if not root:
        return None
    if target == root.val:
        return root
    elif target < root.val:
        return search(root.left, target)
    else:
        return search(root.right, target)

# BST 的中序遍历是有序序列！
def inorder_bst(node, result):
    if not node:
        return
    inorder_bst(node.left, result)
    result.append(node.val)
    inorder_bst(node.right, result)
    return result
```

::: warning 退化风险
如果插入的数据本身有序（1,2,3,4,5），BST 会退化成链表，查找变 O(n)。所以需要「平衡」机制（AVL 树、红黑树），这部分进阶再学。
:::

## 五、练习

1. 求二叉树的最大深度（递归：`max(左深度, 右深度) + 1`）。
2. 判断两棵树是否相同。
3. 在 BST 中插入一个新节点。

## 下一步

进入 [堆与优先队列](/dsa/heap)，看一种特殊的完全二叉树。
