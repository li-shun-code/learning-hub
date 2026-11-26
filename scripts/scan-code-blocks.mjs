// 侦察：统计所有讲义代码块的语言特征，供标注脚本校准规则
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('docs/dsa/lectures')
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()
const buckets = {}
let total = 0

for (const file of files) {
  const lines = fs.readFileSync(path.join(DIR, file), 'utf8').split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (/^```\s*$/.test(lines[i])) {
      const block = []
      let j = i + 1
      while (j < lines.length && !/^```\s*$/.test(lines[j])) block.push(lines[j++])
      if (j >= lines.length) continue
      i = j
      total++
      const text = block.join('\n')
      const tag = guess(text)
      buckets[tag] = (buckets[tag] || 0) + 1
      if (process.argv.includes('--samples') && buckets[tag] <= 3) {
        console.log(`\n### ${file}:${i - block.length} -> ${tag}\n${text.slice(0, 220)}`)
      }
    }
  }
}

function guess(t) {
  if (/System\.out|public class|public static|ArrayList<|String\[\]|new \w+\(|throws /.test(t) && /;/.test(t)) return 'java'
  if (/#include|printf\s*\(|scanf\s*\(|malloc\s*\(|char\s*\*|int main\s*\(/.test(t)) return 'c'
  if (/cout\s*<<|cin\s*>>|vector<|iostream|std::|template\s*</.test(t)) return 'cpp'
  if (/\bdef\s+\w+\s*\(|self\b|\bprint\s*\(|\bimport\s+\w|\belif\b|\bNone\b|\bTrue\b|\bFalse\b/.test(t)) return 'python'
  if (/\bSELECT\b|\bCREATE TABLE\b|\bINSERT INTO\b/i.test(t)) return 'sql'
  if (/:=|\bdo\b[\s\S]{0,40}\bthen\b|\bwhile\b[^\n]*\bdo\b|\bAND\b|\bOR\b|start\s*:=|end\s*:=/i.test(t)) return 'text-pseudo'
  return 'text-other'
}

console.log(JSON.stringify({ total, buckets }, null, 2))
