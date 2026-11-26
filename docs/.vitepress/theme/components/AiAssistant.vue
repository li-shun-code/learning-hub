<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'

// 全站悬浮 AI 学习助手：始终挂载在布局中，随路由切换读取当前页面正文作为上下文。
type Msg = { role: 'assistant' | 'user'; content: string }

const route = useRoute()

const endpoint = ref('https://api.openai.com/v1/chat/completions')
const apiKey = ref('')
const model = ref('gpt-4o-mini')
const open = ref(false)
const showConfig = ref(false)
const input = ref('')
const busy = ref(false)
const error = ref('')
const messages = ref<Msg[]>([])
const bodyRef = ref<HTMLElement | null>(null)
const articleText = ref('')
const currentTitle = ref('当前页面')

const STORE_KEY = 'learning-hub-ai-assistant-config'

const suggested = [
  '用一句话总结本课核心观点',
  '本课有哪些关键概念？逐一解释',
  '把这一课整理成学习清单',
]

function greeting(title: string) {
  return `你好！我是这站点的学习助手。现在你正在阅读《${title}》，我可以就这一课回答你的问题。先告诉我哪里卡住了？`
}

function loadConfig() {
  try {
    const saved = localStorage.getItem(STORE_KEY)
    if (saved) {
      const cfg = JSON.parse(saved)
      endpoint.value = cfg.endpoint || endpoint.value
      apiKey.value = cfg.apiKey || ''
      model.value = cfg.model || model.value
    }
  } catch { /* 忽略损坏的本地配置 */ }
}

function saveConfig() {
  localStorage.setItem(STORE_KEY, JSON.stringify({
    endpoint: endpoint.value.trim(),
    apiKey: apiKey.value.trim(),
    model: model.value.trim(),
  }))
  showConfig.value = false
}

async function loadPageContext() {
  await nextTick()
  // 稍微等待页面内容渲染完成
  await new Promise((r) => setTimeout(r, 150))
  const title = (route.data as any)?.title || document.title.split('|')[0].trim() || '当前页面'
  currentTitle.value = title
  const main = document.querySelector('.vp-doc') as HTMLElement | null
  articleText.value = (main?.innerText || '').replace(/\n{3,}/g, '\n\n').slice(0, 30000).trim()
  // 换课后重置对话，重新给出针对本课的问候
  messages.value = [{ role: 'assistant', content: greeting(title) }]
  error.value = ''
  await scrollBottom()
}

onMounted(() => {
  loadConfig()
  loadPageContext()
})

watch(() => route.path, () => {
  if (open.value) loadPageContext()
})

async function scrollBottom() {
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}

function toggle() {
  open.value = !open.value
  if (open.value && messages.value.length === 0) loadPageContext()
}

function reset() {
  loadPageContext()
}

const canSend = computed(() => !!input.value.trim() && !busy.value)

async function ask(question?: string) {
  const q = (question ?? input.value).trim()
  if (!q || busy.value) return
  input.value = ''
  error.value = ''
  messages.value.push({ role: 'user', content: q })
  await scrollBottom()

  if (!endpoint.value.trim() || !model.value.trim()) {
    error.value = '请先在「模型配置」里填写接口地址和模型名。'
    return
  }

  busy.value = true
  const system = `你是一位耐心的学习助手。请只依据下面提供的“当前页面正文”回答用户的问题；如果正文里没有答案，就明确说明正文未提及，不要编造。回答用中文，尽量简洁、条理清晰。\n\n--- 当前页面正文 ---\n${articleText.value || '（未能读取正文）'}\n--- 正文结束 ---`

  const history = messages.value
    .filter((m) => m.role !== 'assistant' || m.content !== greeting(currentTitle.value))
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content }))

  try {
    const res = await fetch(endpoint.value.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey.value.trim() ? { Authorization: `Bearer ${apiKey.value.trim()}` } : {}),
      },
      body: JSON.stringify({
        model: model.value.trim(),
        messages: [{ role: 'system', content: system }, ...history],
        temperature: 0.3,
        stream: false,
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`)
    const data = await res.json()
    const answer = data?.choices?.[0]?.message?.content
      ?? data?.choices?.[0]?.text
      ?? '（模型未返回内容）'
    messages.value.push({ role: 'assistant', content: String(answer) })
  } catch (e: any) {
    error.value = `请求失败：${e?.message || e}。请检查接口地址、密钥、模型名，以及接口是否允许浏览器跨域（CORS）。`
  } finally {
    busy.value = false
    await scrollBottom()
  }
}
</script>

<template>
  <div class="ai-widget">
    <!-- 悬浮面板 -->
    <transition name="ai-fade">
      <div v-if="open" class="ai-panel">
        <div class="ai-head">
          <div class="ai-head-title">
            <strong>学习助手</strong>
            <span class="ai-sub">基于 {{ model }}</span>
          </div>
          <div class="ai-head-actions">
            <button class="ai-icon" title="模型配置" @click="showConfig = !showConfig">⚙</button>
            <button class="ai-icon" title="重置对话" @click="reset">⟳</button>
            <button class="ai-icon" title="关闭" @click="open = false">✕</button>
          </div>
        </div>

        <div v-if="showConfig" class="ai-config">
          <label>接口地址（OpenAI 兼容 chat/completions）<input v-model="endpoint" type="text" placeholder="https://api.openai.com/v1/chat/completions" /></label>
          <label>API Key<input v-model="apiKey" type="password" placeholder="sk-...（仅保存在你的浏览器）" /></label>
          <label>模型名<input v-model="model" type="text" placeholder="gpt-4o-mini" /></label>
          <button class="ai-save" @click="saveConfig">保存配置</button>
          <p class="ai-hint">配置仅保存在当前浏览器，不会上传。支持自建/Ollama/One API 等兼容端点（需允许跨域）。</p>
        </div>

        <div ref="bodyRef" class="ai-body">
          <div v-if="messages.length === 1" class="ai-suggestions">
            <button v-for="s in suggested" :key="s" @click="ask(s)">{{ s }}</button>
          </div>
          <div v-for="(m, i) in messages" :key="i" class="ai-msg" :class="m.role">
            <div class="ai-role">{{ m.role === 'user' ? '你' : '助手' }}</div>
            <div class="ai-content">{{ m.content }}</div>
          </div>
          <div v-if="busy" class="ai-msg assistant"><div class="ai-role">助手</div><div class="ai-content">思考中…</div></div>
          <div v-if="error" class="ai-error">{{ error }}</div>
        </div>

        <div class="ai-input">
          <input v-model="input" type="text" placeholder="就当前课文提问..." @keydown.enter="ask()" />
          <button :disabled="!canSend" @click="ask()">发送</button>
        </div>
        <div class="ai-foot">已携带当前页面：{{ currentTitle }}</div>
      </div>
    </transition>

    <!-- 悬浮按钮 -->
    <button class="ai-launcher" :class="{ open }" :title="open ? '关闭学习助手' : '打开学习助手'" @click="toggle">
      <span v-if="!open">💬</span>
      <span v-else>✕</span>
    </button>
  </div>
</template>

<style scoped>
.ai-widget { position: fixed; right: 20px; bottom: 20px; z-index: 1000; font-size: 14px; }
.ai-launcher {
  width: 48px; height: 48px; margin-left: auto;
  border: none; border-radius: 50%;
  background: var(--vp-c-brand-1, #3451b2); color: #fff;
  font-size: 20px; cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,.25);
  display: flex; align-items: center; justify-content: center;
}
.ai-launcher:hover { filter: brightness(1.1); }
.ai-launcher.open { background: #1e3a8a; }
.ai-panel {
  width: min(460px, calc(100vw - 32px));
  height: min(680px, calc(100vh - 96px));
  margin-bottom: 12px;
  display: flex; flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
  box-shadow: 0 8px 32px rgba(0,0,0,.22);
  overflow: hidden;
}
.ai-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.ai-head-title { display: grid; gap: 2px; }
.ai-sub { color: var(--vp-c-text-2); font-size: 12px; }
.ai-head-actions { display: flex; gap: 4px; }
.ai-icon { width: 28px; height: 28px; border: none; border-radius: 6px; background: transparent; color: var(--vp-c-text-2); cursor: pointer; font-size: 15px; }
.ai-icon:hover { background: var(--vp-c-bg); color: var(--vp-c-brand-1); }
.ai-config { padding: 10px 14px; display: grid; gap: 7px; border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.ai-config label { display: grid; gap: 3px; color: var(--vp-c-text-2); font-size: 12px; }
.ai-config input { width: 100%; box-sizing: border-box; padding: 6px 9px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 13px; }
.ai-save { justify-self: start; border: 1px solid var(--vp-c-brand-1); border-radius: 6px; background: transparent; color: var(--vp-c-brand-1); padding: 4px 12px; cursor: pointer; font-size: 12px; }
.ai-hint { margin: 0; color: var(--vp-c-text-2); font-size: 11px; }
.ai-body { flex: 1; min-height: 0; overflow-y: auto; padding: 12px 14px; display: grid; gap: 12px; align-content: start; }
.ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; }
.ai-suggestions button { border: 1px solid var(--vp-c-divider); border-radius: 999px; background: transparent; color: var(--vp-c-brand-1); padding: 5px 11px; cursor: pointer; font-size: 12px; }
.ai-msg { display: grid; grid-template-columns: 34px 1fr; gap: 8px; }
.ai-role { color: var(--vp-c-text-2); font-size: 12px; padding-top: 2px; }
.ai-content { white-space: pre-wrap; line-height: 1.6; }
.ai-msg.assistant .ai-content { background: var(--vp-c-bg-soft); padding: 8px 10px; border-radius: 8px; }
.ai-msg.user .ai-content { color: var(--vp-c-brand-1); }
.ai-error { color: var(--vp-c-danger-1, #e53e3e); white-space: pre-wrap; font-size: 12px; }
.ai-input { display: flex; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--vp-c-divider); }
.ai-input input { flex: 1; min-width: 0; padding: 8px 10px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.ai-input button { padding: 8px 16px; border: none; border-radius: 8px; background: var(--vp-c-brand-1); color: #fff; cursor: pointer; }
.ai-input button:disabled { opacity: .5; cursor: not-allowed; }
.ai-foot { padding: 0 14px 10px; color: var(--vp-c-text-3); font-size: 11px; }
.ai-fade-enter-active, .ai-fade-leave-active { transition: opacity .18s, transform .18s; }
.ai-fade-enter-from, .ai-fade-leave-to { opacity: 0; transform: translateY(8px); }
@media (max-width: 640px) { .ai-widget { right: 12px; bottom: 12px; } .ai-panel { height: min(560px, calc(100vh - 80px)); } }
</style>
