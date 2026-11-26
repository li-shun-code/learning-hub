<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const vals = ref([10, 20, 30])

function shuffle() { vals.value = Array.from({ length: 4 }, () => Math.floor(Math.random() * 90) + 10) }

const steps = computed(() => {
  const out = []
  const a = vals.value
  out.push({ desc: '初始空链表，准备逐个尾插', nodes: [], active: -1 })
  const nodes = []
  a.forEach((v, i) => {
    nodes.push(v)
    out.push({ desc: `append(${v})：新节点接入尾部，tail 指向它`, nodes: [...nodes], active: i })
  })
  out.push({ desc: '✅ 链表构建完成。注意节点在内存里不连续，靠箭头连接', nodes: [...a], active: -1 })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" title="单链表尾插动画" @regenerate="shuffle">
    <template #default="{ step }">
      <div class="vis-cells">
        <template v-for="(v, i) in step?.nodes || []" :key="i">
          <span class="vis-node" :class="{ active: step?.active === i }">{{ v }}</span>
          <span v-if="i < (step?.nodes || []).length - 1" class="vis-arrow">→</span>
        </template>
        <span v-if="!(step?.nodes || []).length" style="color:var(--vp-c-text-2)">（空链表）</span>
      </div>
    </template>
  </VisPlayer>
</template>
