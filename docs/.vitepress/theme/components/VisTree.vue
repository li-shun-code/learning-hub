<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const order = ref('level') // pre | in | post | level

const tree = {
  v: 1,
  l: { v: 2, l: { v: 4 }, r: { v: 5 } },
  r: { v: 3, l: { v: 6 }, r: { v: 7 } },
}
function shuffle() { order.value = ['pre','in','post','level'][Math.floor(Math.random() * 4)] }

// 按层收集节点用于绘制
const rows = computed(() => {
  const res = []
  function collect(n, d) {
    if (!n) return
    (res[d] = res[d] || []).push(n.v)
    collect(n.l, d + 1)
    collect(n.r, d + 1)
  }
  collect(tree, 0)
  return res
})

const steps = computed(() => {
  const out = []
  const visited = []
  if (order.value === 'level') {
    const q = [tree]
    out.push({ desc: '层序：用队列，从根开始逐层访问', visited: [], cur: -1 })
    while (q.length) {
      const n = q.shift()
      visited.push(n.v)
      out.push({ desc: `出队，访问节点 ${n.v}`, visited: [...visited], cur: n.v })
      if (n.l) q.push(n.l)
      if (n.r) q.push(n.r)
    }
  } else {
    function traverse(n) {
      if (!n) return
      if (order.value === 'pre') { visited.push(n.v); out.push({ desc: `前序：先访问根 ${n.v}`, visited: [...visited], cur: n.v }) }
      traverse(n.l)
      if (order.value === 'in') { visited.push(n.v); out.push({ desc: `中序：左子树完成，访问根 ${n.v}`, visited: [...visited], cur: n.v }) }
      traverse(n.r)
      if (order.value === 'post') { visited.push(n.v); out.push({ desc: `后序：左右子树完成，访问根 ${n.v}`, visited: [...visited], cur: n.v }) }
    }
    traverse(tree)
  }
  const label = { pre:'前序', in:'中序', post:'后序', level:'层序' }[order.value]
  out.push({ desc: `✅ ${label}遍历完成：[${visited.join(', ')}]`, visited: [...visited], cur: -1 })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" title="二叉树遍历动画" @regenerate="shuffle">
    <template #default="{ step }">
      <div class="vis-line">
        <div v-for="(row, d) in rows" :key="d" style="text-align:center">
          <span v-for="v in row" :key="v" class="vis-node" :class="{ active: step?.cur === v, done: step?.visited?.includes(v) }">{{ v }}</span>
        </div>
      </div>
      <p class="vis-line" style="margin-top:6px">访问顺序：[{{ (step?.visited || []).join(', ') }}]</p>
    </template>
  </VisPlayer>
</template>
