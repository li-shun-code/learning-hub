# 5. FastAPI 接口开发

[FastAPI](https://fastapi.tiangolo.com/zh/) 是目前 Python AI 应用的主流后端框架：写起来简单、自带数据校验、自动生成接口文档、天生支持异步。后面你把大模型包成 API 服务时，基本就是用它。

## 一、安装

```bash
# 先激活虚拟环境，再安装
pip install "fastapi[standard]"
```

`[standard]` 会带上 uvicorn（运行服务器）、pydantic 等常用依赖。

## 二、第一个接口

新建 `main.py`：

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "你好，FastAPI！"}
```

运行：

```bash
fastapi dev main.py
```

打开浏览器访问：

- `http://127.0.0.1:8000/` —— 看到 JSON 响应
- `http://127.0.0.1:8000/docs` —— FastAPI 自动生成的交互式接口文档（Swagger UI）

::: tip 为什么选 FastAPI
不用手写接口文档，改完代码文档自动更新；参数校验靠类型注解完成，少写很多 if。
:::

## 三、路径参数与查询参数

```python
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

- `item_id` 是路径参数，类型注解 `int` 会让 FastAPI 自动校验和转换；
- `q` 是查询参数，`| None` 表示可选。

访问 `/items/42?q=test` 试试。

## 四、Pydantic 数据模型：请求体校验

AI 应用里经常要接收结构化输入，用 Pydantic 定义模型最省心：

```python
from pydantic import BaseModel, Field

class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0)   # 必须大于 0
    tags: list[str] = []

@app.post("/items")
def create_item(item: ItemCreate):
    return {"created": item.model_dump()}
```

用 curl 或 `/docs` 测试：

```bash
curl -X POST http://127.0.0.1:8000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "键盘", "price": 199.0, "tags": ["外设"]}'
```

如果传 `price: -1`，FastAPI 会自动返回 422 错误并说明原因——**你不用手写校验逻辑**。

## 五、异步接口（为大模型调用做准备）

调用大模型 API 是网络 I/O，用异步可以避免阻塞：

```python
import asyncio

@app.get("/slow")
async def slow_endpoint():
    await asyncio.sleep(1)   # 模拟网络请求
    return {"status": "done"}
```

记住两点：

- `async def` 定义协程函数，调用它不会立刻执行，而是返回协程对象；
- `await` 只能写在 `async` 函数里。

## 六、项目结构建议

```text
my-ai-app/
├── .venv/
├── .env              # 密钥配置（不进 Git）
├── .gitignore
├── requirements.txt
├── main.py           # FastAPI 入口
└── README.md
```

## 七、这一节的验收标准

- [ ] 能独立启动 FastAPI 服务并访问 `/docs`
- [ ] 会写路径参数、查询参数、POST 请求体
- [ ] 会用 Pydantic 定义模型并校验数据
- [ ] 理解 `async def` 和 `await` 的基本用法

## 下一步

进入 [数据库与工程习惯](/llm/stage1/db-and-engineering)，给你的服务加上存储和工程规范。
