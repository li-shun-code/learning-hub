<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const weights = ref([2, 3, 4, 5])
const cap = ref(8)

function shuffle() {
  weights.value = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
  cap.value = Math.floor(Math.random() * 6) + 6
}

const steps = computed(() => {
  const out = []
  const w = weights.value, C = cap.value, n = w.length
  const dp = Array.from({ length: n + 1 }, () => Array(C + 1).fill(0))
  out.push({ desc: `01背包：${n} 件物品，重量 ${w.join(',')}，容量 ${C}。dp[i][c]=前i件在容量c下的最大价值`, dp: dp.map(r=>[...r]), i: -1, c: -1 })
  for (let i = 1; i <= n; i++) {
    for (let c = 1; c <= C; c++) {
      dp[i][c] = dp[i-1][c]
      if (w[i-1] <= c) dp[i][c] = Math.max(dp[i][c], dp[i-1][c-w[i-1]] + w[i-1])
      out.push({ desc: `dp[${i}][${c}]：物品${i}重${w[i-1]} ${w[i-1]<=c?'可放入':'放不下'} → ${dp[i][c]}`, dp: dp.map(r=>[...r]), i, c })
    }
  }
  out.push({ desc: `✅ 最大价值 = ${dp[n][C]}`, dp: dp.map(r=>[...r]), i: -1, c: -1 })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" title="动态规划 · 01背包填表动画" @regenerate="shuffle">
    <template #default="{ step }">
      <div class="vis-line" style="overflow:auto">
        <table style="border-collapse:collapse;font-size:12px;font-variant-numeric:tabular-nums">
          <thead><tr><th>i\\c</th><th v-for="c in cap+1" :key="c">{{ c-1 }}</th></tr></thead>
          <tbody>
            <tr v-for="(row,i) in step?.dp || []" :key="i">
              <th>{{ i }}</th>
              <td v-for="(v,c) in row" :key="c" :class="[]" :style="{ padding:'3px 6px', border:'1px solid var(--vp-c-divider)', background: step?.i===i&&step?.c===c ? 'var(--vp-c-brand-1)' : (i===0||c===0 ? 'var(--vp-c-bg-soft)' : 'transparent'), color: step?.i===i&&step?.c===c ? '#fff' : 'inherit' }">{{ v }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </VisPlayer>
</template>
