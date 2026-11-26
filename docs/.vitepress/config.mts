import { defineConfig } from 'vitepress'

// 站点共享配置
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Python 大模型应用开发学习站',
  description: '从零到 Agent 的 Python 大模型应用开发学习路线与教程',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  base: '/python-llm-learning/',

  head: [
    ['meta', { name: 'theme-color', content: '#3451b2' }],
    ['meta', { name: 'og:type', content: 'website' }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '学习路线', link: '/guide/roadmap' },
      { text: '阶段 0', link: '/stage0/' },
      { text: '阶段 1', link: '/stage1/' },
    ],

    sidebar: [
      {
        text: '开始',
        items: [
          { text: '站点首页', link: '/' },
          { text: '完整学习路线', link: '/guide/roadmap' },
        ],
      },
      {
        text: '阶段 0 · AI 编程工具上手',
        items: [
          { text: '总览', link: '/stage0/' },
          { text: '1. 为什么先学 AI 工具', link: '/stage0/why-ai-tools' },
          { text: '2. 工具选择与环境', link: '/stage0/tools-setup' },
          { text: '3. 提示词与上下文管理', link: '/stage0/prompt-and-context' },
          { text: '4. 实战：AI 辅助写小工具', link: '/stage0/hands-on' },
        ],
      },
      {
        text: '阶段 1 · Python 与工程基础',
        items: [
          { text: '总览', link: '/stage1/' },
          { text: '1. 环境搭建与虚拟环境', link: '/stage1/env-setup' },
          { text: '2. Python 核心语法', link: '/stage1/python-basics' },
          { text: '3. 函数、模块与面向对象', link: '/stage1/functions-modules-oop' },
          { text: '4. 文件、JSON 与异常处理', link: '/stage1/files-json-errors' },
          { text: '5. FastAPI 接口开发', link: '/stage1/fastapi' },
          { text: '6. 数据库与工程习惯', link: '/stage1/db-and-engineering' },
          { text: '7. 阶段实战与自测', link: '/stage1/project-and-checklist' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/li-shun-code/python-llm-learning' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: '基于 VitePress 构建 · 持续更新中',
      copyright: 'Copyright © 2026 li-shun-code',
    },

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
