<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const nodes = ref([
  { id: 'A', neighbors: ['B', 'C'] },
  { id: 'B', neighbors: ['A', 'C', 'D'] },
  { id: 'C', neighbors: ['A', 'B', 'E'] },
  { id: 'D', neighbors: ['B', 'E'] },
  { id: 'E', neighbors: ['C', 'D'] },
])
const mode = ref('bfs')

function shuffle() {
  const ids = ['A','B','C','D','E','F']
  const n = Math.floor(Math.random() * 3) + 4
  const chosen = ids.slice(0, n)
  nodes.value = chosen.map(id => ({ id, neighbors: [] }))
  // 随机连边（保证连通）
  for (let i = 1; i < chosen.length; i++) {
    const p = chosen[Math.floor(Math.random() * i)]
    nodes.value[i].neighbors.push(p); nodes.value.find(x => x.id === p).neighbors.push(chosen[i])
  }
  mode.value = Math.random() > 0.5 ? 'bfs' : 'dfs'
}

const steps = computed(() => {
  const out = []
  const adj = Object.fromEntries(nodes.value.map(n => [n.id, n.neighbors]))
  const visited = new Set()
  const start = nodes.value[0].id
  out.push({ desc: `${mode.value === 'bfs' ? 'BFS 用队列' : 'DFS 用栈/递归'}，从 ${start} 出发`, visited: [], cur: null })
  if (mode.value === 'bfs') {
    const q = [start]; visited.add(start)
    while (q.length) {
      const u = q.shift()
      out.push({ desc: `出队 ${u}（访问）`, visited: [...visited], cur: u })
      for (const v of adj[u] || []) {
        if (!visited.has(v)) { visited.add(v); q.push(v); out.push({ desc: `入队 ${v}（发现）`, visited: [...visited], cur: null, frontier: [...q] }) }
      }
    }
  } else {
    function dfs(u) {
      visited.add(u)
      out.push({ desc: `访问 ${u}`, visited: [...visited], cur: u })
      for (const v of adj[u] || []) if (!visited.has(v)) dfs(v)
    }
    dfs(start)
  }
  out.push({ desc: `✅ 遍历完成：[${[...visited].join(', ')}]`, visited: [...visited], cur: null })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" :title="mode === 'bfs' ? 'BFS 广度优先动画' : 'DFS 深度优先动画'" @regenerate="shuffle">
    <template #default="{ step }">
      <div class="vis-cells">
        <span v-for="n in nodes" :key="n.id" class="vis-node" :class="{ active: step?.cur === n.id, done: step?.visited?.includes(n.id) }">{{ n.id }}</span>
      </div>
      <p class="vis-line" style="margin-top:6px">已访问：{{ (step?.visited || []).join(' → ') }} {{ step?.frontier?.length ? `｜队列：${step.frontier.join(',')}` : '' }}</p>
    </template>
  </VisPlayer>
</template>
