# 7. 阶段实战与自测

学完前面六节，是时候把它们串成一个能演示、能交付的小项目了。这一节给出一个实战题目和一份自测清单——**做完并通过自测，才算真正完成阶段 1**。

## 一、实战项目：待办事项 API 服务

目标：做一个带数据存储的 Todo API，用 FastAPI 提供接口，用 SQLite 持久化，并配好工程规范。

### 功能要求

- `POST /todos` —— 新增待办（内容必填，长度 1–100）
- `GET /todos` —— 列出全部待办
- `GET /todos/{id}` —— 查询单条，不存在时返回 404
- `PATCH /todos/{id}` —— 修改内容或完成状态
- `DELETE /todos/{id}` —— 删除待办

### 技术要求

1. 用 FastAPI 实现，请求体用 Pydantic 模型校验；
2. 用 SQLite 存数据，参数化查询，字段含 `id`、`task`、`done`；
3. 配置藏在 `.env`（如 `DATABASE_URL`），并写进 `.gitignore`；
4. 提供 `requirements.txt` 和 `README.md`；
5. 至少写 3 个 pytest 用例（如新增、查询、删除）；
6. 代码提交到一个 Git 仓库，提交信息清晰。

### 参考结构

```text
todo-api/
├── .venv/
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
├── README.md
├── main.py          # FastAPI 路由
├── database.py      # SQLite 连接与增删改查
├── models.py        # Pydantic 模型
└── test_api.py      # pytest 用例
```

::: tip 卡住了怎么办
先自己查报错、翻前面章节；实在不行把错误信息贴给 AI 工具，让它解释原因——但**不要直接让它把整个项目写完**，你只让它指出思路，代码自己敲。
:::

## 二、阶段 1 自测清单

对照打勾，全部通过再进入下一阶段：

### 环境与语法

- [ ] 能独立安装 Python、创建并激活虚拟环境
- [ ] 知道为什么要用虚拟环境，会导出/恢复 `requirements.txt`
- [ ] 熟练使用 list、dict，能写函数、类并用类型注解
- [ ] 会读写文件和 JSON，会指定 `encoding="utf-8"`
- [ ] 会捕获常见异常，避免笼统 `except: pass`

### Web 与数据

- [ ] 能独立启动 FastAPI 服务并访问 `/docs`
- [ ] 会写路径参数、查询参数、POST 请求体，会用 Pydantic 校验
- [ ] 理解 `async def` / `await` 的用途
- [ ] 会用 sqlite3 做增删改查，坚持参数化查询

### 工程习惯

- [ ] 密钥放 `.env`，敏感文件进 `.gitignore`
- [ ] 会用 Git 提交代码，提交信息写得清楚
- [ ] 项目有可照着跑起来的 README
- [ ] 核心函数/接口有 pytest 用例并通过

### 综合实力

- [ ] 不看教程，能从零搭出上面的 Todo API 并跑通
- [ ] 遇到报错能读懂信息、自己定位问题，或让 AI 帮忙分析后自己修

如果某些项还没打勾，回去补对应的章节；如果全打勾了，恭喜——你已经具备用 Python 开发大模型应用后端的地基了。

## 三、这一阶段在整条路线里的位置

阶段 1 解决的是「**用 Python 把想法写成能跑的程序和服务**」。接下来阶段 2 会认识大模型本身，阶段 3 学会调用大模型 API——那时你就会发现，前面写的 FastAPI 接口正好可以把模型能力包装成产品。

## 下一步

回到 [学习路线](/guide/roadmap) 查看完整路线图，准备进入阶段 2「大模型认知」。
