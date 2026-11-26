// 抽样查看未被任何启发式命中的代码块
import fs from 'node:fs'
import path from 'node:path'
const DIR = path.resolve('docs/dsa/lectures')
let n = 0
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.md')).sort()) {
  const L = fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')
  for (let i = 0; i < L.length; i++) {
    if (!/^```\s*$/.test(L[i])) continue
    const b = []
    let j = i + 1
    while (j < L.length && !/^```\s*$/.test(L[j])) b.push(L[j++])
    if (j >= L.length) break
    i = j
    const t = b.join('\n')
    if (/System\.out|public class|ArrayList|String\[\]|new \w+\(/.test(t) && /;/.test(t)) continue
    if (/#include|printf|malloc|char\s*\*|int main/.test(t)) continue
    if (/\bdef\s+\w+\s*\(|self\b|elif\b|import\s+\w/.test(t)) continue
    if (/:=|\bwhile\b[^\n]*\bdo\b/.test(t)) continue
    if (n++ < 30) console.log(`--- ${f}:${i - b.length} ---\n${t.slice(0, 200)}`)
  }
}
console.log(`total unclassified shown: ${Math.min(n, 30)}`)
