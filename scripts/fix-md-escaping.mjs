// 后处理：转义正文中会被 Vue 当作标签的裸 <，避免 VitePress 构建失败。
// 代码块（``` 围栏）与行内代码（` ... `）保持原样；交互动画组件标签保持原样。
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('docs/dsa/lectures')
let changedFiles = 0
let changedLines = 0

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const full = path.join(DIR, file)
  const lines = fs.readFileSync(full, 'utf8').split('\n')
  let inFence = false
  let fileChanged = false

  const out = lines.map((line) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return line
    }
    if (inFence) return line

    // 按行内代码切分：偶数段是普通文本，奇数段是代码
    const parts = line.split('`')
    const next = parts.map((part, i) => {
      if (i % 2 === 1) return part // 行内代码，不动
      return part
        .replace(/&lt;/g, '<') // 先归一，避免重复转义
        .replace(/<(?!(?:\/?Vis[A-Za-z]+\b))/g, '&lt;') // 保留 Vis 组件标签
        .replace(/\{\{/g, '&#123;&#123;') // 避免被当成 Vue 插值
    }).join('`')

    if (next !== line) {
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
