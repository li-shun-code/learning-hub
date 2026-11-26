// 后处理：转义 harness 章节正文中会被 Vue 当作标签/插值的字符，避免 VitePress 构建失败。
// 代码块（``` 围栏）内保持原样；<AiAssistant /> 等组件标签保持原样。
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('docs/harness/chapters')
let changedFiles = 0
let changedLines = 0

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const full = path.join(DIR, file)
  const lines = fs.readFileSync(full, 'utf8').split('\n')
  let inFence = false
  let fileChanged = false

  const out = lines.map((raw) => {
    if (/^\s*```/.test(raw)) {
      inFence = !inFence
      return raw
    }
    if (inFence) return raw

    // 先归一（反向还原），避免重复转义
    let line = raw
      .replace(/&lt;/g, '<')
      .replace(/&#123;/g, '{')
      .replace(/&#125;/g, '}')

    // {{ ... }} 一律转义（含行内代码中的 Vue 插值语法），避免 SSR 误判
    line = line.replace(/\{\{/g, '&#123;&#123;')

    // 按行内代码切分：偶数段是普通文本，奇数段是代码
    const parts = line.split('`')
    const next = parts.map((part, i) => {
      if (i % 2 === 1) return part // 行内代码，不动
      return part
        .replace(/<(?!(?:\/?AiAssistant\b|\/?Vis[A-Za-z]+\b))/g, '&lt;') // 保留组件标签
        .replace(/\{/g, '&#123;') // 避免独立 { 被 Vue 当作 props 对象
        .replace(/\}/g, '&#125;')
    }).join('`')

    if (next !== raw) {
      changedLines++
      fileChanged = true
    }
    return next
  })

  if (fileChanged) {
    fs.writeFileSync(full, out.join('\n'))
    changedFiles++
  }
}

console.log(JSON.stringify({ changedFiles, changedLines }))
