# -*- coding: utf-8 -*-
"""把 EPUB 逐章转成 VitePress Markdown，本地化图片并去除作者/出版信息。"""
import os
import re
import zipfile
import html
from bs4 import BeautifulSoup

SRC = r'C:\Users\admin\Downloads\Claude Code实战Harness工程之道 (黄佳) (z-library.sk, 1lib.sk, z-lib.sk).epub'
OUT = r'E:\code\project\python-study\docs\harness\chapters'
IMG = r'E:\code\project\python-study\docs\harness\images'
os.makedirs(OUT, exist_ok=True)
os.makedirs(IMG, exist_ok=True)

z = zipfile.ZipFile(SRC)

# 从 toc.ncx 解析章节顺序与标题
ncx = z.read('toc.ncx').decode('utf-8')
nav = re.findall(
    r'<navPoint[^>]*>.*?<text>(.*?)</text>.*?<content src="([^"]+)"/>.*?</navPoint>',
    ncx, re.S)
chapters = [(html.unescape(t).strip(), s) for t, s in nav]
# 去掉“内容提要”（前言保留）；正文从 qy03 起
chapters = [(t, s) for t, s in chapters
            if 'qy02' not in s and '提' + '要' not in t.replace(' ', '')]

DROP_LINES = [
    re.compile(r'黄佳'), re.compile(r'人民邮电出版社'), re.compile(r'z-library'),
    re.compile(r'1lib\.sk'), re.compile(r'z-lib\.sk'), re.compile(r'ISBN'),
    re.compile(r'版权'), re.compile(r'calibre'),
]


def clean_text(text: str) -> str:
    text = text.replace('\xa0', ' ').replace('\u3000', ' ')
    # 去掉作者/出版/盗版站等痕迹行
    lines = [ln.rstrip() for ln in text.split('\n')]
    lines = [ln for ln in lines if not any(p.search(ln) for p in DROP_LINES)]
    text = '\n'.join(lines)
    # 去掉“本书由…出版/作者”类整句
    text = re.sub(r'本书由[^。\n]*出版[。\n]?', '', text)
    text = re.sub(r'作者简介[:：][^\n]*', '', text)
    # Vue 模板安全的裸尖括号转义（保留 <AiAssistant /> 组件标签）
    text = re.sub(r'<(?![/!]?[A-Za-z][\w-]*\s*/?>)', '&lt;', text)
    return text.strip()


def inline(node) -> str:
    """渲染一个块级节点的内部文本/行内标记。"""
    parts = []
    for child in node.descendants:
        if isinstance(child, str):
            parts.append(str(child))
        elif getattr(child, 'name', None) == 'img':
            src = child.get('src', '')
            name = os.path.basename(src)
            if name in z.namelist() or 'EPUB/images/' + name in z.namelist():
                with open(os.path.join(IMG, name), 'wb') as f:
                    zf = 'EPUB/images/' + name if 'EPUB/images/' + name in z.namelist() else name
                    f.write(z.read(zf))
                parts.append(f'\n\n![](../images/{name})\n\n')
        elif getattr(child, 'name', None) == 'br':
            parts.append('\n')
    text = ''.join(parts)
    text = html.unescape(text)
    text = re.sub(r'[ \t]*\n[ \t]*', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


summary = {'chapters': 0, 'images': 0, 'residue': []}

for idx, (title, src_path) in enumerate(chapters, start=1):
    if src_path not in z.namelist():
        print('SKIP missing', src_path)
        continue
    soup = BeautifulSoup(z.read(src_path), 'html.parser')
    # 删除脚本/样式/导航等无关元素
    for tag in soup(['script', 'style', 'head']):
        tag.decompose()

    body = soup.body or soup
    blocks = []
    seen_title = False
    for node in body.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'div'], recursive=True):
        # 跳过包含子块级元素的 div，避免重复
        if node.name == 'div' and node.find(['p', 'h1', 'h2', 'h3', 'h4']):
            continue
        name = node.name
        txt = inline(node)
        if not txt:
            continue
        if name == 'h1':
            if not seen_title:
                seen_title = True  # 标题用文件 H1，正文里的重复 H1 跳过
                continue
            blocks.append('## ' + txt.replace('\n', ' '))
        elif name in ('h2', 'h3', 'h4'):
            blocks.append('## ' + txt.replace('\n', ' '))
        else:
            # 纯图片节点（inline 返回图片引用）作为独立段落
            blocks.append(txt)

    content = '\n\n'.join(blocks)
    content = clean_text(content)
    content = re.sub(r'\n{3,}', '\n\n', content)

    # 残留检查
    for pat in [r'黄佳', r'人民邮电出版社', r'z-library', r'1lib\.sk', r'ISBN', r'版权']:
        if re.search(pat, content):
            summary['residue'].append(f'{idx:02d}.md {pat}')

    slug = f'{idx:02d}'
    md = f'# {title}\n\n{content}\n'
    with open(os.path.join(OUT, slug + '.md'), 'w', encoding='utf-8') as f:
        f.write(md)
    summary['chapters'] += 1

summary['images'] = sum(1 for n in os.listdir(IMG))
import json
print(json.dumps(summary, ensure_ascii=False, indent=2))
