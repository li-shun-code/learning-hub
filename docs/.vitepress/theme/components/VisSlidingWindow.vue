<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const s = ref('abcbddaef')
const k = ref(3)

function shuffle() {
  const chars = 'abcdef'
  let x = ''
  for (let i = 0; i < 10; i++) x += chars[Math.floor(Math.random() * 4)]
  s.value = x
  k.value = Math.floor(Math.random() * 3) + 2
}

const steps = computed(() => {
  const out = []
  const str = s.value
  const need = k.value
  const freq = {}
  let left = 0, best = 0, bestRange = [0, 0]
  out.push({ desc: `字符串 "${str}"，找包含至少 ${need} 种字符的最长子串`, str, left, right: -1, best: 0, bestRange: [0,0] })
  for (let right = 0; right < str.length; right++) {
    const c = str[right]
    freq[c] = (freq[c] || 0) + 1
    out.push({ desc: `右指针扩到 ${right}，纳入字符 ${c}`, str, left, right, best, bestRange: [...bestRange] })
    while (Object.keys(freq).length >= need) {
      if (right - left + 1 > best) { best = right - left + 1; bestRange = [left, right]; out.push({ desc: `🎯 更新最优长度 ${best}`, str, left, right, best, bestRange: [...bestRange] }) }
      const lc = str[left]
      freq[lc]--; if (freq[lc] === 0) delete freq[lc]
      left++
      out.push({ desc: `左指针收缩到 ${left}（移除 ${lc}）`, str, left, right, best, bestRange: [...bestRange] })
    }
  }
  out.push({ desc: `✅ 最长子串长度 = ${best}，区间 [${bestRange[0]},${bestRange[1]}]`, str, left, right: str.length-1, best, bestRange: [...bestRange] })
  return out
})
</script>

<template>
  <VisPlayer :steps="steps" title="滑动窗口动画" @regenerate="shuffle">
    <template #default="{ step }">
      <div class="vis-cells" style="gap:2px">
        <div v-for="(c,i) in (step?.str || s)" :key="i" class="vis-cell" style="min-width:24px"
             :class="{ active: step?.right === i, done: step && i>=step.bestRange[0] && i<=step.bestRange[1], compare: step && step.left<=i && i<=step.right }">{{ c }}</div>
      </div>
      <p class="vis-line" style="margin-top:6px">left= {{ step?.left }} · right= {{ step?.right }} · 当前最优长度= {{ step?.best }}</p>
    </template>
  </VisPlayer>
</template>
