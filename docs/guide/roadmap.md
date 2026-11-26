# 完整学习路线

> 核心原则：**先应用、后原理**。你要做的是「用模型 + 接业务 + 上工程」，而不是一上来推导 Transformer 公式。先把模型当黑盒用顺手，做出项目，再回头补原理。

## 总览：九个阶段

| 阶段 | 主题 | 建议时长 | 关键产出 |
|---|---|---|---|
| [0](/stage0/) | AI 编程工具上手 | 3–7 天 | 用 AI 辅助写完一个小工具 |
| [1](/stage1/) | Python 与工程基础 | 30–45 天 | 能写脚本 + FastAPI 接口 |
| 2 | 大模型基础认知 | 5–7 天 | 画出大模型概念地图 |
| 3 | 大模型 API 开发 | 7–10 天 | 一个可调用多模型的 Chat 工具 |
| 4 | 提示词与上下文工程 | 7–10 天 | Prompt 规范 + 结构化输出 |
| 5 | RAG 检索增强生成 | 15–20 天 | 个人知识库问答 |
| 6 | Agent 智能体开发 | 20–30 天 | 带工具调用的小助手 |
| 7 | 评测、可观测与安全 | 10–15 天 | 评测集 + 监控面板 |
| 8 | 部署、微调与原理进阶（选学） | 20–40 天 | 私有化部署 / LoRA 微调 |

## 各阶段要点

### 阶段 0：AI 编程工具上手

先学会用 AI 写 AI。用 Cursor / Claude Code / Copilot 等辅助写代码，学会写清晰指令、审查生成代码、管理上下文。**产出**：用 AI 辅助完成一个 Python 小工具。

### 阶段 1：Python 与工程基础

AI 应用开发说到底是软件开发，地基要稳。零基础不用把 Python 学得很深，**能熟练写脚本和接口服务就够了**。重点：Python 核心语法、FastAPI、Pydantic、异步基础、虚拟环境、Git。

### 阶段 2：大模型基础认知

不写代码，先建立地图：Token、Embedding、RAG、Agent、MCP、微调串成一条线。验收：能用自己的话解释「一次对话是怎么从输入变成输出的」。

### 阶段 3：大模型 API 开发

用原生 SDK 与 LangChain / LlamaIndex 调用 OpenAI 兼容 API（DeepSeek、通义、Moonshot 等），本地用 Ollama。产出：支持多模型、多轮对话、流式输出的 Chat 工具。

### 阶段 4：提示词与上下文工程

Few-shot、CoT、结构化输出（JSON Schema + Pydantic）、Function Calling、上下文窗口管理。产出：Prompt 规范 + 20 条测试问题。

### 阶段 5：RAG 检索增强生成

文档清洗 → 切块 → Embedding → 向量库 → 混合检索 → Rerank → 引用溯源 → 评估。产出：带引用来源的个人知识库问答。

### 阶段 6：Agent 智能体开发

Agent 循环（规划 → 工具调用 → 观察）、ReAct、LangGraph 工作流、记忆、MCP、多智能体。产出：能联网搜索、读文件、调用 API 的助手。

### 阶段 7：评测、可观测与安全

评测集、LLM-as-a-Judge、Prompt A/B（置信区间）、Langfuse / LangSmith 监控、提示注入与幻觉防护。产出：评测集 + 监控面板。

### 阶段 8：部署、微调与原理进阶（选学）

vLLM / Ollama 部署、量化、KV Cache、压测；SFT 数据、LoRA / QLoRA、RLHF / DPO；Transformer、注意力、位置编码原理。产出：推理 API 压测报告或 LoRA 微调。

## 学习节奏建议

- **每天 1–2 小时**：阶段 1–4 约 1–2 个月走完，此时已能做出像样的小应用。
- **边学边做**：学完调用写工具，学完 RAG 搭知识库，学完 Agent 做助手。
- **关键不是快，是顺序别乱、每一步有产出**。

## 参考来源

- [AlgoMooc · 大模型应用开发学习路线](https://www.algomooc.com/llm/roadmap)
- [DMXSF · 大模型学习路线图](https://dmxsf.com/wiki/start/learning-roadmap/)
- [程序员鱼皮 · AI 大模型应用开发学习路线](https://developer.cloud.tencent.com/article/2787263)
- [代码随想录 · 大模型学习路线](https://github.com/youngyangyang04/llm-master/blob/main/docs/llm/intro/llm_learning_roadmap.md)
- [GitHub · LLMStudy 从零到 Agent](https://github.com/rjwang1982/LLMStudy)
- [Datawhale · 动手学大模型应用开发](https://datawhalechina.github.io/llm-universe/)
- [Real Python · LLM Application Development](https://realpython.com/learning-paths/llm-application-development-python/)
