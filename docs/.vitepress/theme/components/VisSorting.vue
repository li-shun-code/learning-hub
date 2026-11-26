<script setup>
import { ref, computed } from 'vue'
import VisPlayer from './VisPlayer.vue'

function randomArray(n = 8) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 10)
}

const arr = ref(randomArray())
const mode = ref('bubble')

function shuffle() { arr.value = randomArray() }

const steps = computed(() => {
  const out = []
  const a = [...arr.value]
  out.push({ desc: '初始数组：', arr: [...a], active: [], done: [] })
  if (mode.value === 'bubble') {
    const done = []
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - 1 - i; j++) {
        out.push({ desc: `比较 ${a[j]} 和 ${a[j + 1]}${a[j] > a[j + 1] ? '，交换' : '，不交换'}`, arr: [...a], active: [j, j + 1], done: [...done] })
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]] }
        out.push({ desc: `第 ${j + 1} 轮比较后：`, arr: [...a], active: [], done: [...done] })
      }
      done.push(a.length - 1 - i)
      out.push({ desc: `第 ${i + 1} 趟结束，${a[a.length - 1 - i]} 归位（绿色）`, arr: [...a], active: [], done: [...done] })
    }
    done.push(0)
  } else if (mode.value === 'quick') {
    function qs(lo, hi, depth = 0) {
      if (lo >= hi) return
      const pivot = a[hi]
      let i = lo
      out.push({ desc: `区间 [${lo},${hi}]，选基准 ${pivot}（橙色）`, arr: [...a], active: [hi], done: [], pivot: hi })
      for (let j = lo; j < hi; j++) {
        out.push({ desc: `用 a[${j}]=${a[j]} 与基准 ${pivot} 比较`, arr: [...a], active: [j, hi], done: [] })
        if (a[j] < pivot) {
          [a[i], a[j]] = [a[j], a[i]]
          if (i !== j) out.push({ desc: `交换 a[${i}] 与 a[${j}]`, arr: [...a], active: [i, j], done: [] })
          i++
        }
      }
      [a[i], a[hi]] = [a[hi], a[i]]
      out.push({ desc: `基准 ${pivot} 归位到下标 ${i}（绿色）`, arr: [...a], active: [], done: [i] })
      qs(lo, i - 1, depth + 1)
      qs(i + 1, hi, depth + 1)
    }
    qs(0, a.length - 1)
  } else if (mode.value === 'insertion') {
    const done = []
    for (let i = 1; i < a.length; i++) {
      const key = a[i]
      let j = i - 1
      out.push({ desc: `取出 a[${i}]=${key}，在前面已排序区找位置`, arr: [...a], active: [i], done: [...done] })
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j]; j--
        out.push({ desc: `元素后移，腾出位置`, arr: [...a], active: [j + 1], done: [...done] })
      }
      a[j + 1] = key
      done.push(i)
      out.push({ desc: `插入到下标 ${j + 1}`, arr: [...a], active: [], done: [...done] })
    }
  }
  out.push({ desc: '✅ 排序完成！', arr: [...a], active: [], done: a.map((_, i) => i) })
  return out
})
</script>

<template>
  <div>
    <div class="vis-controls" style="margin-bottom:0">
      <label>算法：
        <select v-model="mode" @change="shuffle">
          <option value="bubble">冒泡排序 O(n²)</option>
          <option value="quick">快速排序 O(n log n)</option>
          <option value="insertion">插入排序 O(n²)</option>
        </select>
      </label>
    </div>
    <VisPlayer :steps="steps" title="排序动画" @regenerate="shuffle">
      <template #default="{ step }">
        <div class="vis-cells">
          <div v-for="(v, i) in step?.arr || arr" :key="i"
               class="vis-cell"
               :class="{ active: step?.active?.includes(i), done: step?.done?.includes(i) }"
               :style="{ minWidth: '34px' }">{{ v }}</div>
        </div>
      </template>
    </VisPlayer>
  </div>
</template>
