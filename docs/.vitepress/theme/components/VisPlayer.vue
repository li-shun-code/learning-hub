<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  steps: { type: Array, default: () => [] },
  title: { type: String, default: '动画演示' },
})

const emit = defineEmits(['regenerate'])

const idx = ref(0)
const playing = ref(false)
const speed = ref(1) // 1x 基准：每步 900ms
const BASE = 900
let timer = null

const total = computed(() => props.steps.length)
const current = computed(() => props.steps[idx.value] ?? null)
const canPrev = computed(() => idx.value > 0)
const canNext = computed(() => idx.value < total.value - 1)

function clearTimer() {
  if (timer) { clearInterval(timer); timer = null }
}
function startTimer() {
  clearTimer()
  timer = setInterval(() => {
    if (idx.value < total.value - 1) idx.value++
    else stop()
  }, Math.max(120, BASE / speed.value))
}
function play() {
  if (total.value === 0) return
  if (playing.value) { stop(); return }
  if (idx.value >= total.value - 1) idx.value = 0
  playing.value = true
  startTimer()
}
function stop() { playing.value = false; clearTimer() }
function prev() { stop(); if (canPrev.value) idx.value-- }
function next() { stop(); if (canNext.value) idx.value++ }
function reset() { stop(); idx.value = 0 }
function regenerate() { stop(); emit('regenerate') }
function scrub(e) { stop(); idx.value = Number(e.target.value) }
function onSpeed(e) {
  speed.value = Number(e.target.value)
  if (playing.value) startTimer()
}

watch(() => props.steps, () => { reset() })
onBeforeUnmount(clearTimer)
</script>

<template>
  <div class="vis-root">
    <h4>{{ title }}</h4>
    <div class="vis-controls">
      <button @click="play">{{ playing ? '⏸ 暂停' : '▶ 播放' }}</button>
      <button class="ghost" @click="prev" :disabled="!canPrev">⏮ 上一步</button>
      <button class="ghost" @click="next" :disabled="!canNext">下一步 ⏭</button>
      <button class="ghost" @click="reset">↺ 重置</button>
      <button class="ghost" @click="regenerate">🎲 随机数据</button>
      <label>速度 <input type="range" min="0.5" max="4" step="0.5" :value="speed" @input="onSpeed"></label>
      <span class="vis-counter">{{ speed }}x · {{ total ? idx + 1 : 0 }} / {{ total }}</span>
    </div>
    <input class="vis-progress" type="range" min="0" :max="Math.max(0, total - 1)" :value="idx" @input="scrub" :disabled="total === 0">
    <div class="vis-stage">
      <slot :step="current" :index="idx" :steps="steps" />
    </div>
    <p class="vis-desc">{{ current?.desc || '点击播放，逐步查看算法执行过程。' }}</p>
  </div>
</template>
