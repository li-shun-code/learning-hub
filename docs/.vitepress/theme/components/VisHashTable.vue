<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const pairs = ref([['a', 1], ['b', 2], ['c', 3]])

function shuffle() {
  const keys = ['a','b','c','d','e','f']
  pairs.value = keys.slice(0, Math.floor(Math.random() * 3) + 3).map(k => [k, Math.floor(Math.random() * 90) + 10])
}

const steps = computed(() => {
  const out = []
  const table = {} // key -> [values]
  out.push({ desc: '空哈希表：每个桶是一个链表，用来处理冲突', buckets: [], curKey: '' })
  for (const [k, v] of pairs.value) {
    const h = [...k].reduce((s, c) => s + c.charCodeAt(0), 0) % 5
    table[h] = table[h] || []
    table[h].push(`${k}:${v}`)
    const buckets = Array.from({ length: 5 }, (_, i) => table[i] || [])
    out.push({ desc: `put(${k}, ${v})：hash("${k}")=${h}，放入 ${h} 号桶`, buckets, curKey: k, highlight: h })
  }
  out.push({ desc: '✅ 插入完成。冲突的元素用链地址法串在同一桶里', buckets: Array.from({ length: 5 }, (_, i) => table[i] || []), curKey: '', highlight: -1 })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" title="哈希表插入动画（链地址法）" @regenerate="shuffle">
    <template #default="{ step }">
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        <div v-for="(chain, i) in step?.buckets || []" :key="i" style="text-align:center">
          <div style="font-size:12px;color:var(--vp-c-text-2)">桶 {{ i }}</div>
          <div class="vis-cell" :class="{ active: step?.highlight === i }" style="min-width:60px">
            <span v-if="chain.length">{{ chain.join(' → ') }}</span>
            <span v-else style="color:var(--vp-c-text-2)">空</span>
          </div>
        </div>
      </div>
    </template>
  </VisPlayer>
</template>
