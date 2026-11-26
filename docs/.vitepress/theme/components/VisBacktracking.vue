<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const n = ref(4)

function shuffle() { n.value = Math.floor(Math.random() * 2) + 3 }

const steps = computed(() => {
  const out = []
  const N = n.value
  const path = [], res = []
  out.push({ desc: `全排列：把 1..${N} 的所有排列列出来。树形搜索 + 剪枝（已选的不再选）`, path: [], res: [], cur: null })
  function bt() {
    if (path.length === N) { res.push([...path]); out.push({ desc: `✅ 找到一个完整排列：[${path.join(', ')}]`, path: [...path], res: [...res], cur: null }); return }
    for (let x = 1; x <= N; x++) {
      if (path.includes(x)) continue
      path.push(x)
      out.push({ desc: `选择 ${x}，路径 = [${path.join(', ')}]`, path: [...path], res: [...res], cur: x })
      bt()
      path.pop()
      out.push({ desc: `回溯：撤销 ${x}，路径 = [${path.join(', ')}]`, path: [...path], res: [...res], cur: null })
    }
  }
  bt()
  out.push({ desc: `✅ 完成！共 ${res.length} 个排列（${N}!）`, path: [], res: [...res], cur: null })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" title="回溯 · 全排列动画" @regenerate="shuffle">
    <template #default="{ step }">
      <div class="vis-line">当前路径（选择）：</div>
      <div class="vis-cells"><span v-for="(v,i) in step?.path || []" :key="i" class="vis-node" :class="{ active: step?.cur === v }">{{ v }}</span><span v-if="!(step?.path || []).length" style="color:var(--vp-c-text-2)">（空）</span></div>
      <div class="vis-line" style="margin-top:8px">已找到的排列：</div>
      <div style="margin-top:4px"><span v-for="(p,i) in step?.res || []" :key="i" class="vis-tag">[{{ p.join(',') }}]</span><span v-if="!(step?.res || []).length" style="color:var(--vp-c-text-2)">（空）</span></div>
    </template>
  </VisPlayer>
</template>
