import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

// 从生成好的讲义文件中读取真实标题，保证侧边栏与正文一致
const LECTURE_TITLES: string[] = Array.from({ length: 56 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0')
  const file = path.resolve(process.cwd(), `docs/dsa/lectures/${num}.md`)
  if (!fs.existsSync(file)) return `第 ${i + 1} 讲`
  const firstLine = fs.readFileSync(file, 'utf8').split('\n')[0]
  return firstLine.replace(/^#\s*\d+\s*/, '').trim() || `第 ${i + 1} 讲`
})

const HARNESS_TITLES: string[] = Array.from({ length: 12 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0')
  const file = path.resolve(process.cwd(), `docs/harness/chapters/${num}.md`)
  if (!fs.existsSync(file)) return `第 ${i + 1} 章`
  const firstLine = fs.readFileSync(file, 'utf8').split('\n')[0]
  return firstLine.replace(/^#\s*/, '').trim() || `第 ${i + 1} 章`
})

// 站点共享配置
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '学习中心 · Learning Hub',
  description: '一个通用的学习站点：大模型应用开发、图解数据结构与算法，以及更多主题',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  base: '/learning-hub/',

  head: [
    ['meta', { name: 'theme-color', content: '#3451b2' }],
    ['meta', { name: 'og:type', content: 'website' }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '大模型应用开发', link: '/llm/' },
      { text: '图解数据结构与算法', link: '/dsa/' },
      { text: 'Claude Code 实战', link: '/harness/' },
    ],

    // 按路径前缀显示不同侧边栏，让每个模块有独立导航
    sidebar: {
      '/llm/': [
        {
          text: '大模型模块',
          items: [
            { text: '模块首页', link: '/llm/' },
            { text: '完整学习路线', link: '/llm/roadmap' },
          ],
        },
        {
          text: '阶段 0 · AI 编程工具上手',
          items: [
            { text: '总览', link: '/llm/stage0/' },
            { text: '1. 为什么先学 AI 工具', link: '/llm/stage0/why-ai-tools' },
            { text: '2. 工具选择与环境', link: '/llm/stage0/tools-setup' },
            { text: '3. 提示词与上下文管理', link: '/llm/stage0/prompt-and-context' },
            { text: '4. 实战：AI 辅助写小工具', link: '/llm/stage0/hands-on' },
          ],
        },
        {
          text: '阶段 1 · Python 与工程基础',
          items: [
            { text: '总览', link: '/llm/stage1/' },
            { text: '1. 环境搭建与虚拟环境', link: '/llm/stage1/env-setup' },
            { text: '2. Python 核心语法', link: '/llm/stage1/python-basics' },
            { text: '3. 函数、模块与面向对象', link: '/llm/stage1/functions-modules-oop' },
            { text: '4. 文件、JSON 与异常处理', link: '/llm/stage1/files-json-errors' },
            { text: '5. FastAPI 接口开发', link: '/llm/stage1/fastapi' },
            { text: '6. 数据库与工程习惯', link: '/llm/stage1/db-and-engineering' },
            { text: '7. 阶段实战与自测', link: '/llm/stage1/project-and-checklist' },
          ],
        },
      ],
      '/dsa/': [
        {
          text: '图解数据结构与算法 · 56 讲',
          items: [
            { text: '模块首页', link: '/dsa/' },
            { text: '学习路线', link: '/dsa/roadmap' },
          ],
        },
        ...Array.from({ length: 56 }, (_, i) => {
          const n = i + 1
          const num = String(n).padStart(2, '0')
          const title = LECTURE_TITLES[n - 1]
          return {
            text: `${num} ${title}`,
            link: `/dsa/lectures/${num}`,
            collapsed: true,
          }
        }),
      ],
      '/harness/': [
        {
          text: 'Claude Code 实战 · Harness 工程之道',
          items: [
            { text: '模块首页', link: '/harness/' },
          ],
        },
        ...Array.from({ length: 12 }, (_, i) => {
          const n = i + 1
          const num = String(n).padStart(2, '0')
          return {
            text: HARNESS_TITLES[n - 1],
            link: `/harness/chapters/${num}`,
            collapsed: true,
          }
        }),
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/li-shun-code/learning-hub' },
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
