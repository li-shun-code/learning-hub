<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const ops = ref([
  { op: 'push', v: 3 }, { op: 'push', v: 7 }, { op: 'push', v: 5 },
  { op: 'pop' }, { op: 'peek' },
])
const mode = ref('stack') // stack | queue

function shuffle() {
  const seq = []
  const n = 4
  for (let i = 0; i < n; i++) seq.push({ op: Math.random() > 0.3 ? 'push' : (mode.value === 'stack' ? 'pop' : 'dequeue'), v: Math.floor(Math.random() * 90) + 10 })
  ops.value = seq
}

const steps = computed(() => {
  const out = []
  const items = []
  for (const { op, v } of ops.value) {
    if (op === 'push' || op === 'enqueue') {
      items.push(v)
      out.push({ desc: `${op === 'push' ? 'push' : 'enqueue'}(${v}) → 加入${mode.value === 'stack' ? '栈顶' : '队尾'}`, items: [...items], highlight: items.length - 1 })
    } else if (op === 'pop' || op === 'dequeue') {
      const removed = mode.value === 'stack' ? items.pop() : items.shift()
      out.push({ desc: `${op}() → 移除 ${removed ?? '（空）'}（${mode.value === 'stack' ? 'LIFO 后进先出' : 'FIFO 先进先出'}）`, items: [...items], highlight: -1 })
    } else {
      out.push({ desc: `peek() → 查看${mode.value === 'stack' ? '栈顶' : '队首'} ${items[0] ?? '（空）'}，不移除`, items: [...items], highlight: 0 })
    }
  }
  return out
})
</script>

<template>
  <div>
    <div class="vis-controls" style="margin-bottom:0">
      <label>结构：
        <select v-model="mode" @change="shuffle">
          <option value="stack">栈（LIFO）</option>
          <option value="queue">队列（FIFO）</option>
        </select>
      </label>
    </div>
    <VisPlayer :steps="steps" :title="mode === 'stack' ? '栈动画' : '队列动画'" @regenerate="shuffle">
      <template #default="{ step }">
        <div class="vis-line">
          <span v-if="mode === 'stack'">栈顶 ↑</span>
          <span v-else>队首 → ... → 队尾</span>
        </div>
        <div class="vis-cells" style="margin-top:6px">
          <div v-for="(v, i) in step?.items || []" :key="i" class="vis-cell" :class="{ active: step?.highlight === i }">{{ v }}</div>
          <span v-if="!(step?.items || []).length" style="color:var(--vp-c-text-2)">（空）</span>
        </div>
      </template>
    </VisPlayer>
  </div>
</template>
