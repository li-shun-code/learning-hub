<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const intervals = ref([
  { id: 1, s: 1, e: 4 }, { id: 2, s: 3, e: 5 }, { id: 3, s: 0, e: 6 },
  { id: 4, s: 5, e: 7 }, { id: 5, s: 3, e: 9 }, { id: 6, s: 6, e: 10 },
])

function shuffle() {
  const n = 6
  const list = []
  for (let i = 0; i < n; i++) {
    const s = Math.floor(Math.random() * 8)
    list.push({ id: i + 1, s, e: s + Math.floor(Math.random() * 3) + 2 })
  }
  intervals.value = list
}

const steps = computed(() => {
  const out = []
  const sorted = [...intervals.value].sort((a, b) => a.e - b.e || a.s - b.s)
  out.push({ desc: '区间调度：按结束时间从早到晚排序，每次选结束最早且不冲突的区间', sorted, picked: [], cur: null })
  const picked = []
  let lastEnd = -Infinity
  for (const it of sorted) {
    if (it.s >= lastEnd) {
      picked.push(it.id)
      lastEnd = it.e
      out.push({ desc: `区间 ${it.id} [${it.s},${it.e}] 起点 ≥ 上一个结束点 ${lastEnd === it.e ? it.e : lastEnd}，✅ 选中`, sorted, picked: [...picked], cur: it.id })
    } else {
      out.push({ desc: `区间 ${it.id} [${it.s},${it.e}] 与已选冲突（起点 < ${lastEnd}），❌ 跳过`, sorted, picked: [...picked], cur: it.id })
    }
  }
  out.push({ desc: `✅ 最终选择 ${picked.length} 个互不重叠的区间：${picked.join(', ')}`, sorted, picked: [...picked], cur: null })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" title="贪心 · 区间调度动画" @regenerate="shuffle">
    <template #default="{ step }">
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <div v-for="it in step?.sorted || []" :key="it.id" class="vis-cell" :class="{ active: step?.cur === it.id, done: step?.picked?.includes(it.id) }">
          #{{ it.id }} [{{ it.s }},{{ it.e }}]
        </div>
      </div>
      <p class="vis-line" style="margin-top:6px">已选区间：{{ (step?.picked || []).join(', ') || '（空）' }}</p>
    </template>
  </VisPlayer>
</template>
