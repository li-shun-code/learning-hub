<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'

// 页面内 AI 助手：把当前章节正文作为上下文，向用户可配置的大模型端点提问。
// 配置保存在浏览器 localStorage，不随站点部署，也不会上传到服务器。
type Msg = { role: 'user' | 'assistant' | 'system'; content: string }

const route = useRoute()

const endpoint = ref('https://api.openai.com/v1/chat/completions')
const apiKey = ref('')
const model = ref('gpt-4o-mini')
const showConfig = ref(false)
const input = ref('')
const busy = ref(false)
const error = ref('')
const messages = ref<Msg[]>([])
const bodyRef = ref<HTMLElement | null>(null)
const articleText = ref('')

const suggested = [
  '用一句话总结本章核心观点',
  '本章有哪些关键概念？逐一解释',
  '把本章内容整理成学习清单',
]

const STORE_KEY = 'learning-hub-ai-assistant-config'

onMounted(async () => {
  // 读取本地配置
  try {
    const saved = localStorage.getItem(STORE_KEY)
    if (saved) {
      const cfg = JSON.parse(saved)
      endpoint.value = cfg.endpoint || endpoint.value
      apiKey.value = cfg.apiKey || ''
      model.value = cfg.model || model.value
    }
  } catch { /* 忽略损坏的本地配置 */ }

  // 抓取当前页面正文（排除导航/侧边栏/本组件）
  await nextTick()
  const main = document.querySelector('.vp-doc') as HTMLElement | null
  let text = main?.innerText || ''
  // 去掉本组件自身的文本
  const self = document.querySelector('.ai-assistant') as HTMLElement | null
  if (self && text.includes(self.innerText)) text = text.replace(self.innerText, '')
  articleText.value = text.replace(/\n{3,}/g, '\n\n').slice(0, 30000).trim()
})

function saveConfig() {
  localStorage.setItem(STORE_KEY, JSON.stringify({
    endpoint: endpoint.value.trim(),
    apiKey: apiKey.value.trim(),
    model: model.value.trim(),
  }))
  showConfig.value = false
}

const canSend = computed(() => !!input.value.trim() && !busy.value)

async function scrollBottom() {
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}

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
  const system = `你是一位耐心的课程助教。请只依据下面提供的“当前章节正文”回答用户的问题；如果正文里没有答案，就明确说明正文未提及，不要编造。回答用中文，尽量简洁、条理清晰。\n\n--- 当前章节正文 ---\n${articleText.value || '（未能读取正文）'}\n--- 正文结束 ---`

  const history = messages.value
    .filter((m) => m.role !== 'system')
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

function clearChat() {
  messages.value = []
  error.value = ''
}
</script>

<template>
  <div class="ai-assistant">
    <div class="ai-head">
      <div>
        <strong>🤖 本章 AI 助教</strong>
        <span class="ai-sub">基于当前章节内容问答</span>
      </div>
      <div class="ai-head-actions">
        <button class="ai-mini" @click="showConfig = !showConfig">⚙ 模型配置</button>
        <button class="ai-mini" @click="clearChat">清空</button>
      </div>
    </div>

    <div v-if="showConfig" class="ai-config">
      <label>接口地址（OpenAI 兼容 chat/completions）<input v-model="endpoint" type="text" placeholder="https://api.openai.com/v1/chat/completions" /></label>
      <label>API Key<input v-model="apiKey" type="password" placeholder="sk-...（仅保存在你的浏览器）" /></label>
      <label>模型名<input v-model="model" type="text" placeholder="gpt-4o-mini" /></label>
      <button class="ai-save" @click="saveConfig">保存配置</button>
      <p class="ai-hint">配置仅保存在当前浏览器，不会上传。也支持自建/Ollama/One API 等兼容端点（需允许跨域）。</p>
    </div>

    <div ref="bodyRef" class="ai-body">
      <div v-if="!messages.length" class="ai-empty">
        <p>对本章有疑问？直接问我，我会依据这一章的内容回答。</p>
        <div class="ai-suggestions">
          <button v-for="s in suggested" :key="s" @click="ask(s)">{{ s }}</button>
        </div>
      </div>
      <div v-for="(m, i) in messages" :key="i" class="ai-msg" :class="m.role">
        <div class="ai-role">{{ m.role === 'user' ? '你' : '助教' }}</div>
        <div class="ai-content">{{ m.content }}</div>
      </div>
      <div v-if="busy" class="ai-msg assistant"><div class="ai-role">助教</div><div class="ai-content">思考中…</div></div>
      <div v-if="error" class="ai-error">{{ error }}</div>
    </div>

    <div class="ai-input">
      <input v-model="input" type="text" placeholder="输入你的问题，回车发送" @keydown.enter="ask()" />
      <button :disabled="!canSend" @click="ask()">发送</button>
    </div>
  </div>
</template>

<style scoped>
.ai-assistant {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  font-size: 14px;
}
.ai-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.ai-sub { margin-left: 8px; color: var(--vp-c-text-2); font-size: 12px; }
.ai-head-actions { display: flex; gap: 6px; }
.ai-mini, .ai-save {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-1);
  padding: 4px 9px;
  cursor: pointer;
  font-size: 12px;
}
.ai-mini:hover, .ai-save:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.ai-config { padding: 12px 14px; display: grid; gap: 8px; border-bottom: 1px solid var(--vp-c-divider); }
.ai-config label { display: grid; gap: 4px; color: var(--vp-c-text-2); font-size: 12px; }
.ai-config input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
}
.ai-save { justify-self: start; }
.ai-hint { margin: 0; color: var(--vp-c-text-2); font-size: 11px; }
.ai-body { max-height: 400px; overflow-y: auto; padding: 12px 14px; display: grid; gap: 10px; }
.ai-empty { color: var(--vp-c-text-2); }
.ai-suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.ai-suggestions button {
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-brand-1);
  padding: 5px 11px;
  cursor: pointer;
  font-size: 12px;
}
.ai-msg { display: grid; grid-template-columns: 40px 1fr; gap: 8px; }
.ai-role { color: var(--vp-c-text-2); font-size: 12px; padding-top: 2px; }
.ai-content { white-space: pre-wrap; line-height: 1.6; }
.ai-msg.user .ai-content { color: var(--vp-c-brand-1); }
.ai-error { color: var(--vp-c-danger-1, #e53e3e); white-space: pre-wrap; }
.ai-input { display: flex; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--vp-c-divider); }
.ai-input input {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.ai-input button {
  padding: 7px 16px;
  border: none;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  cursor: pointer;
}
.ai-input button:disabled { opacity: .5; cursor: not-allowed; }
</style>
