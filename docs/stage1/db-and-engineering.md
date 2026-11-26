# 6. 数据库与工程习惯

基础语法和 Web 接口都学完了，但要做一个真正能交付的小项目，还需要三块拼图：**数据存哪里（SQLite）、密钥怎么管（.env）、代码怎么交付（Git + README + 测试）**。这一节就把它们串起来。

## 一、SQLite：零配置的轻量数据库

SQLite 是 Python 标准库自带的数据库引擎，一个 `.db` 文件就是一个数据库，不用安装服务，特别适合小项目和本地开发。

### 基本用法

```python
import sqlite3

# 连接（文件不存在会自动创建）
conn = sqlite3.connect("app.db")
cursor = conn.cursor()

# 建表
cursor.execute("""
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0
    )
""")
conn.commit()

# 增
cursor.execute("INSERT INTO todos (task) VALUES (?)", ("学习 SQLite",))
conn.commit()

# 查
cursor.execute("SELECT id, task, done FROM todos")
for row in cursor.fetchall():
    print(row)   # (1, '学习 SQLite', 0)

# 改
cursor.execute("UPDATE todos SET done = 1 WHERE id = ?", (1,))
conn.commit()

# 删
cursor.execute("DELETE FROM todos WHERE id = ?", (1,))
conn.commit()

conn.close()
```

::: warning 一定要用参数化查询
用 `?` 占位符传值，**不要**用字符串拼接 SQL（`f"INSERT ... VALUES ('{task}')"`），否则会有 SQL 注入漏洞，而且任务里带单引号时会直接报错。
:::

### 关键习惯

- 写操作后要 `conn.commit()`，否则改动不会保存；
- 用完 `conn.close()`，或者用 `with sqlite3.connect(...) as conn` 自动管理；
- 字段类型常用 `INTEGER`、`TEXT`、`REAL`；布尔值用 `0/1` 存。

## 二、用 .env 管理密钥与配置

大模型项目的 API Key、数据库地址这类信息**绝对不能写死在代码里，也不能提交到 Git**。标准做法是用环境变量文件。

1. 安装依赖：`pip install python-dotenv`
2. 新建 `.env`：

```text
OPENAI_API_KEY=sk-xxxxxxxx
DATABASE_URL=app.db
```

3. 在代码里读取：

```python
import os
from dotenv import load_dotenv

load_dotenv()   # 读取 .env 到环境变量
api_key = os.getenv("OPENAI_API_KEY")
```

4. 新建 `.gitignore`，把敏感文件排除：

```text
.venv/
.env
__pycache__/
*.pyc
*.db
```

::: danger 安全红线
一旦把 API Key 提交到公开仓库，就等于泄露——攻击者拿它刷你的额度。如果你怀疑已经泄露，立刻去平台后台**吊销并重新生成** Key。
:::

## 三、Git：给项目装上「后悔药」

Git 记录每次代码改动，可以随时回退、对比、协作。最常用流程：

```bash
git init                       # 初始化仓库
git status                     # 看哪些文件变了
git add .                      # 把改动加入暂存区
git commit -m "初始化项目结构"  # 提交一个版本
git log --oneline              # 查看提交历史
```

建议：**每完成一个小功能就提交一次**，提交信息写清楚做了什么（例如「实现待办接口」「修复空列表报错」），这样出问题时容易定位。

## 四、README：项目的门面

一个合格的 `README.md` 至少写清楚：

```markdown
# 项目名称

一句话说明这个项目解决什么问题。

## 快速开始

1. 安装依赖：pip install -r requirements.txt
2. 复制 .env.example 为 .env 并填写配置
3. 启动：fastapi dev main.py
4. 打开：http://127.0.0.1:8000/docs

## 功能

- 功能一
- 功能二

## 目录结构

（简要说明）
```

带上 `.env.example`（只放占位符，不放真实密钥），别人就能照着跑起来。

## 五、测试习惯：从 pytest 开始

不用一上来就搞复杂测试体系，先学会用 [pytest](https://docs.pytest.org/) 给核心函数写几个用例：

```bash
pip install pytest
```

```python
# test_utils.py
from utils import add

def test_add():
    assert add(1, 2) == 3

def test_add_negative():
    assert add(-1, 1) == 0
```

运行：`pytest`，看到绿色通过就放心了。以后每次改代码都跑一遍，能挡住大量低级 bug。

## 六、这一节的验收标准

- [ ] 会用 sqlite3 建表并完成增删改查，知道为什么要用参数化查询
- [ ] 会把密钥放进 `.env` 并写进 `.gitignore`
- [ ] 会 `init / add / commit / status / log` 这一套 Git 基本操作
- [ ] 项目有能看懂的 README，核心函数有 pytest 用例

## 下一步

准备好了吗？进入 [阶段实战与自测](/stage1/project-and-checklist)，把这一阶段学的东西做成一个完整小项目。
