// 给所有裸 ``` 代码块标注语言，让 VitePress/Shiki 能高亮。
// 规则（按讲义实际内容校准）：
//  - 含 #include / printf / -> 指针 → c
//  - 含 def / self / print( / import → python
//  - 含 SQL 关键字整段 → sql
//  - 纯公式、单行输出、没有任何代码结构（括号/分号/赋值/数组） → text
//  - 其余（Java / 类 C 伪代码 / 含 := 的伪代码） → java（Shiki 的 java 着色对 C 系伪代码同样适用）
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('docs/dsa/lectures')
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()
const counts = {}
let labeled = 0

function detectLang(text) {
  const lines = text.split('\n').filter((l) => l.trim())
  if (!lines.length) return 'text'
  if (/#include|printf\s*\(|scanf\s*\(|malloc\s*\(|free\s*\(|\bchar\s*\*|\bstruct\s+\w+\s*\{/.test(text)) return 'c'
  if (/\bdef\s+\w+\s*\(|\bself\b|\belif\b|\bprint\s*\(|^\s*import\s+\w|\bNone\b|\bTrue\b|\bFalse\b/m.test(text)) return 'python'
  if (/^\s*(SELECT|CREATE TABLE|INSERT INTO|UPDATE .* SET)\b/im.test(text)) return 'sql'
  // 纯公式或纯输出：没有任何典型代码结构
  const codeish = /[{}();]|=\s*[^=]|\bnew\b|->|:=/.test(text)
  if (!codeish && lines.length <= 3) return 'text'
  return 'java'
}

for (const file of files) {
  const full = path.join(DIR, file)
  const lines = fs.readFileSync(full, 'utf8').split('\n')
  const out = []
  let i = 0
  let fileChanged = false

  while (i < lines.length) {
    if (/^```\s*$/.test(lines[i])) {
      const block = []
      let j = i + 1
      while (j < lines.length && !/^```\s*$/.test(lines[j])) block.push(lines[j++])
      if (j >= lines.length) {
        out.push(lines[i])
        i++
        continue
      }
      const lang = detectLang(block.join('\n'))
      counts[lang] = (counts[lang] || 0) + 1
      labeled++
      out.push('```' + lang, ...block, '```')
      i = j + 1
      fileChanged = true
      continue
    }
    out.push(lines[i])
    i++
  }

  if (fileChanged) fs.writeFileSync(full, out.join('\n'))
}

console.log(JSON.stringify({ labeled, counts }, null, 2))
