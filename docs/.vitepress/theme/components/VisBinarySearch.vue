<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

const arr = ref([2, 5, 8, 12, 16, 23, 38, 56, 72, 91])
const target = ref(23)

function shuffle() {
  let a = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 5)
  a.sort((x, y) => x - y)
  arr.value = a
  target.value = a[Math.floor(Math.random() * a.length)]
}

const steps = computed(() => {
  const out = []
  const a = arr.value
  let lo = 0, hi = a.length - 1, found = -1
  out.push({ desc: `有序数组，查找目标 ${target.value}`, arr: [...a], lo, hi, mid: -1 })
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    out.push({ desc: `lo=${lo}, hi=${hi}，中点下标 ${mid}，值 ${a[mid]}`, arr: [...a], lo, hi, mid })
    if (a[mid] === target.value) { found = mid; out.push({ desc: `🎯 找到了！${target.value} 在下标 ${mid}`, arr: [...a], lo, hi, mid, hit: mid }); break }
    if (a[mid] < target.value) {
      out.push({ desc: `${a[mid]} < ${target.value}，缩左边界到 ${mid + 1}`, arr: [...a], lo: mid + 1, hi, mid })
      lo = mid + 1
    } else {
      out.push({ desc: `${a[mid]} > ${target.value}，缩右边界到 ${mid - 1}`, arr: [...a], lo, hi: mid - 1, mid })
      hi = mid - 1
    }
  }
  if (found === -1) out.push({ desc: `❌ 未找到 ${target.value}`, arr: [...a], lo, hi, mid: -1 })
  return out
})
</script>

<template>
  <div>
    <div class="vis-controls" style="margin-bottom:0">
      <label>目标值 <input type="number" v-model.number="target" min="1" max="99"></label>
    </div>
    <VisPlayer :steps="steps" title="二分查找动画" @regenerate="shuffle">
      <template #default="{ step }">
        <div class="vis-cells">
          <div v-for="(v, i) in step?.arr || arr" :key="i"
               class="vis-cell"
               :class="{
                 active: step?.mid === i,
                 done: step?.hit === i,
                 compare: step && i >= step.lo && i <= step.hi && step.mid !== i
               }">{{ v }}</div>
        </div>
        <p class="vis-line">lo= {{ step?.lo }} · hi= {{ step?.hi }} · mid= {{ step?.mid }}</p>
      </template>
    </VisPlayer>
  </div>
</template>
