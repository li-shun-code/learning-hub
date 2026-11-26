<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const arr = ref([3, 1, 6, 5, 2, 8])

function shuffle() { arr.value = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10) }

const steps = computed(() => {
  const out = []
  const a = [...arr.value]
  const heap = []
  out.push({ desc: '初始数组，逐个插入并上浮（sift up）构建小顶堆', arr: [...a], heap: [], idx: 0 })
  for (let i = 0; i < a.length; i++) {
    heap.push(a[i])
    let c = i
    while (c > 0) {
      const p = Math.floor((c - 1) / 2)
      out.push({ desc: `插入 ${a[i]}：比较子节点 ${heap[c]} 与父节点 ${heap[p]}`, arr: [...a], heap: [...heap], idx: c, compare: p })
      if (heap[c] < heap[p]) { [heap[c], heap[p]] = [heap[p], heap[c]]; out.push({ desc: `上浮交换 →`, arr: [...a], heap: [...heap], idx: p, compare: -1 }); c = p }
      else break
    }
    out.push({ desc: `插入完成，堆：`, arr: [...a], heap: [...heap], idx: -1, compare: -1 })
  }
  out.push({ desc: '✅ 小顶堆构建完成：父节点 ≤ 子节点，堆顶是最小值', arr: [...a], heap: [...heap], idx: -1, compare: -1 })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" title="堆的构建（上浮）动画" @regenerate="shuffle">
    <template #default="{ step }">
      <div class="vis-line">数组表示：</div>
      <div class="vis-cells"><div v-for="(v,i) in step?.arr || arr" :key="i" class="vis-cell">{{ v }}</div></div>
      <div class="vis-line" style="margin-top:8px">堆（数组下标 i 的左孩子=2i+1，右孩子=2i+2）：</div>
      <div class="vis-cells">
        <div v-for="(v,i) in step?.heap || []" :key="i" class="vis-cell" :class="{ active: step?.idx===i, compare: step?.compare===i }">{{ v }}</div>
      </div>
    </template>
  </VisPlayer>
</template>
