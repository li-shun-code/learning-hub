<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const num = ref(4)

function shuffle() { num.value = Math.floor(Math.random() * 3) + 3 }

const steps = computed(() => {
  const out = []
  const callStack = []
  out.push({ desc: `递归求 ${num.value}!：先不断拆分到 n=1，再逐层返回结果`, stack: [], ret: null })
  function fact(n) {
    callStack.push(n)
    out.push({ desc: `调用 fact(${n})，入栈`, stack: [...callStack], ret: null })
    let r
    if (n <= 1) r = 1
    else r = n * fact(n - 1)
    out.push({ desc: `fact(${n}) = ${n} × ${r / n} = ${r}，准备出栈`, stack: [...callStack], ret: n })
    callStack.pop()
    return r
  }
  const result = fact(num.value)
  out.push({ desc: `✅ ${num.value}! = ${result}`, stack: [], ret: null, result })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" title="递归 · 阶乘调用栈动画" @regenerate="shuffle">
    <template #default="{ step }">
      <div class="vis-line">调用栈（底部为栈底）：</div>
      <div style="display:flex;flex-direction:column-reverse;gap:4px;margin-top:6px;align-items:flex-start">
        <div v-for="(v,i) in step?.stack || []" :key="i" class="vis-cell" :class="{ active: step?.ret === v }" style="min-width:80px">fact({{ v }})</div>
        <span v-if="!(step?.stack || []).length" style="color:var(--vp-c-text-2)">（空）</span>
      </div>
      <p class="vis-line" style="margin-top:8px">{{ step?.result ? `最终结果：${step.result}` : '' }}</p>
    </template>
  </VisPlayer>
</template>
