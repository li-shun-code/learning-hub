// 一次性转换脚本：把课程正文搬进 VitePress 站的图解模块
// 规则：保留原文教学口吻；去掉作者署名/课程名/平台运营痕迹；图片本地化；嵌入交互动画组件。
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'E:/code/project/geek-docs/deploy_courses/export_all/王争 · 数据结构与算法之美'
const ROOT = 'E:/code/project/python-study'
const OUT = path.join(ROOT, 'docs/dsa/lectures')
const IMG = path.join(ROOT, 'docs/dsa/images')
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(IMG, { recursive: true })

// 讲次 -> 交互动画组件（只映射到确实有对应 VisXxx 的讲）
const VIS_MAP = {
  3: 'VisComplexity', 4: 'VisComplexity',
  5: 'VisLinkedList', 6: 'VisLinkedList', 7: 'VisLinkedList',
  8: 'VisStackQueue', 9: 'VisStackQueue',
  10: 'VisRecursion',
  11: 'VisSorting', 12: 'VisSorting', 13: 'VisSorting', 14: 'VisSorting',
  15: 'VisBinarySearch', 16: 'VisBinarySearch',
  18: 'VisHashTable', 19: 'VisHashTable', 20: 'VisHashTable',
  23: 'VisTree', 24: 'VisTree',
  28: 'VisHeap', 29: 'VisHeap',
  30: 'VisGraph', 31: 'VisGraph',
  37: 'VisGreedy',
  39: 'VisBacktracking',
  40: 'VisDynamicProgramming', 41: 'VisDynamicProgramming', 42: 'VisDynamicProgramming',
}

// 整行删除：平台运营/互动/促销/完结宣传
const DROP_LINE = [
  /欢迎留言和我分享/,
  /我已将本节内容相关的详细代码更新到GitHub/,
  /戳此/,
  /留言区/,
  /置顶/,
  /评论区/,
  /今天是农历的大年三十/,
  /特别说明：/,
  /课程已经更新一月有余/,
  /专栏已经更新一月有余/,
  /如果文章发布一周后/,
  /从明天开始，我会每天发布一篇练习题/,
  /打响新年进步的第一枪/,
]

const imgRe = /!\[\]\((https:\/\/static001\.geekbang\.org\/resource\/image\/[^)\s]+)\)/g

function cleanLine(line) {
  // 站内文章链接：去链接保留锚文本
  line = line.replace(/\[([^\]]+)\]\(https?:\/\/time\.geekbang\.org[^)]*\)/g, '$1')
  // 平台专栏 -> 中性说法
  line = line.replace(/专栏/g, '课程')
  line = line.replace(/极客时间/g, '')
  line = line.replace(/《数据结构与算法之美》/g, '')
  return line
}

// 4 空格缩进块 -> 围栏代码块（VitePress 渲染更稳）
function convertIndentedBlocks(lines) {
  const out = []
  let i = 0
  while (i < lines.length) {
    if (/^ {4}\S/.test(lines[i])) {
      const block = []
      while (i < lines.length && (/^ {4}/.test(lines[i]) || lines[i].trim() === '')) {
        block.push(lines[i].trim() === '' ? '' : lines[i].slice(4))
        i++
      }
      while (block.length && block[block.length - 1] === '') block.pop()
      out.push('```', ...block, '```')
    } else {
      out.push(lines[i])
      i++
    }
  }
  return out
}

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    signal: AbortSignal.timeout(25000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

const files = fs.readdirSync(SRC)
  .filter((f) => /^\d+\s*_\s*.+\.md$/.test(f))
  .sort((a, b) => parseInt(a) - parseInt(b))

const stats = { lectures: 0, imagesTotal: 0, imagesOk: 0, imagesFailed: [], withVis: [], residue: [] }
const cache = new Map()

for (const file of files) {
  const num = parseInt(file)
  const title = file.replace(/^\d+\s*_\s*/, '').replace(/\.md$/, '').trim()
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8')

  // 图片：URL -> 本地相对路径，登记下载
  const imgTasks = []
  let body = raw.replace(imgRe, (m, url) => {
    const name = url.split('/').pop().split('?')[0]
    const dest = path.join(IMG, name)
    if (!cache.has(name)) {
      cache.set(name, dest)
      imgTasks.push({ url, dest, name })
    }
    stats.imagesTotal++
    return `![](../images/${name})`
  })

  // 行级清洗 + 缩进代码块转换
  const lines = body.split(/\r?\n/)
    .filter((line) => !DROP_LINE.some((re) => re.test(line)))
    .map(cleanLine)
  body = convertIndentedBlocks(lines).join('\n')

  // 残留痕迹检查
  for (const re of [/王争/, /数据结构与算法之美/, /极客时间/, /time\.geekbang\.org/, /static001\.geekbang\.org/, /专栏/]) {
    if (re.test(body)) stats.residue.push(`${num}.md ${re}`)
  }

  const vis = VIS_MAP[num]
  const visBlock = vis
    ? `\n## 交互动画\n\n<${vis} />\n\n> 动画支持播放/暂停、单步、调速与换数据；读正文时对照动画里的每一步观察。\n`
    : ''

  const header = `# ${num} ${title}\n\n> 本文按原始讲解整理，并补充了可交互动画帮助理解。\n${visBlock}\n`
  fs.writeFileSync(path.join(OUT, `${String(num).padStart(2, '0')}.md`), header + body.trim() + '\n')
  stats.lectures++
  if (vis) stats.withVis.push(num)

  // 分批下载图片
  for (let k = 0; k < imgTasks.length; k += 8) {
    const batch = imgTasks.slice(k, k + 8)
    const results = await Promise.allSettled(batch.map((t) => downloadImage(t.url, t.dest)))
    results.forEach((r, j) => {
      if (r.status === 'fulfilled') stats.imagesOk++
      else stats.imagesFailed.push(`${batch[j].name}: ${r.reason?.message ?? r.reason}`)
    })
  }
}

console.log(JSON.stringify(stats, null, 2))
