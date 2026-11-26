---
layout: home

hero:
  name: '学习中心'
  text: '一个站点，装下你所有的学习主题'
  tagline: 通用学习站点 · 模块化组织 · 边学边做
  actions:
    - theme: brand
      text: 大模型应用开发
      link: /llm/
    - theme: alt
      text: 图解数据结构与算法
      link: /dsa/
    - theme: alt
      text: Claude Code 实战
      link: /harness/
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/li-shun-code/learning-hub

features:
  - icon: 🤖
    title: 大模型应用开发
    details: 从 AI 工具、Python 工程基础，到提示词、RAG、Agent 的九阶段路线与教程。大模型只是这里的一个模块。
  - icon: 🧩
    title: 图解数据结构与算法
    details: 用图解 + Python 代码讲清数组、链表、树、图、排序、动态规划等核心知识，从直觉到实现。
  - icon: ⚙️
    title: Claude Code 实战
    details: Harness 工程之道：记忆系统、Skills、子智能体、Hooks、MCP、Agent SDK 等工程化实践。全站悬浮学习助手可针对当前页面答疑。
  - icon: 📚
    title: 持续扩展
    details: 站点按模块组织，后续可轻松加入前端、数据库、操作系统等新主题，一个仓库管理全部学习笔记。
  - icon: 🛠️
    title: 边学边做
    details: 每个模块都强调实战与产出：学完调用写工具，学完结构刷题，让知识真正落地。
---

## 关于这个站点

这是一个**通用的学习中心**。大模型应用开发是其中一个模块，而不是站点的全部。站点按主题拆分成独立模块，每个模块有自己的学习路线和教程，共用同一套搜索、导航和部署。

## 已有模块

- **[🤖 大模型应用开发](/llm/)**：九阶段学习路线，已完成阶段 0（AI 工具上手）和阶段 1（Python 与工程基础）的教程。
- **[🧩 图解数据结构与算法](/dsa/)**：以图解为核心，覆盖数据结构、算法与复杂度分析，帮助建立直觉并落到代码。
- **[⚙️ Claude Code 实战](/harness/)**：Harness 工程之道 12 章正文；右下角悬浮的学习助手可针对当前页面答疑。

## 为什么这样组织？

知识点之间是有关联的：Python 基础既是后端开发的地基，也是刷算法题的工具；复杂度分析能帮你判断大模型应用的性能瓶颈。把内容放在一个站点里，用模块分隔，既能各学各的，也能互相参照。

> 本站基于 VitePress 构建，push 后由 GitHub Actions 自动部署。后续会持续补充新模块与现有模块的新阶段。
