<script setup>
import { ref, computed } from 'vue'

const n = ref(30)
const functions = [
  { name: 'O(1)', f: () => 1 },
  { name: 'O(log n)', f: x => Math.log2(x) },
  { name: 'O(n)', f: x => x },
  { name: 'O(n log n)', f: x => x * Math.log2(x) },
  { name: 'O(n²)', f: x => x * x },
]
const colors = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed']

const chart = computed(() => {
  const N = n.value
  const vals = functions.map(fn => ({ name: fn.name, v: Math.max(0, fn.f(N)) }))
  const max = Math.max(...vals.map(x => x.v), 1)
  const h = 130
  return vals.map((x, i) => ({ ...x, height: Math.max(2, (x.v / max) * h), color: colors[i], text: x.v >= 100 ? Math.round(x.v) : x.v.toFixed(1) }))
})
</script>

<template>
  <div class="vis-root">
    <h4>时间复杂度增长对比</h4>
    <div class="vis-controls">
      <label>数据规模 n = <input type="range" min="2" max="100" v-model.number="n"> {{ n }}</label>
    </div>
    <div style="display:flex;align-items:flex-end;gap:14px;height:170px;padding:10px">
      <div v-for="b in chart" :key="b.name" style="text-align:center;flex:1">
        <div :style="{ height: b.height + 'px', background: b.color, borderRadius:'4px 4px 0 0', transition:'height .2s', minWidth:'24px', margin:'0 auto' }"></div>
        <div style="font-size:11px;margin-top:4px">{{ b.name }}</div>
        <div style="font-size:11px;color:var(--vp-c-text-2)">{{ b.text }}</div>
      </div>
    </div>
    <p class="vis-desc">拖动滑块看 n 增大时各复杂度增长速度的差距：O(n²) 会迅速甩开 O(n log n)。</p>
  </div>
</template>
