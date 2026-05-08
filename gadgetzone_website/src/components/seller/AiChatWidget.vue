<template>
<Transition name="fade-slide">
    <div v-if="isOpen" class="fixed inset-0 md:inset-auto md:top-0 md:right-0 md:bottom-0 md:w-[400px] z-[100] flex flex-col bg-white md:shadow-[-8px_0_40px_rgba(0,0,0,0.08)] overflow-hidden border-l border-gray-100">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center gap-3 shrink-0">
        <button @click="close" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
          <i class="fas fa-headset text-lg"></i>
        </div>
        <div class="flex-1">
          <h3 class="font-bold text-sm leading-tight">Assistant IA Vendeur <i class="fas fa-star text-[9px] text-yellow-300"></i></h3>
          <p class="text-[10px] text-blue-100 font-medium flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Propulsé par Gemini
          </p>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4" ref="messagesContainer">
        
        <!-- Welcome Message -->
        <div class="flex gap-3 max-w-[85%]">
          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <i class="fas fa-headset text-xs"></i>
          </div>
          <div class="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-sm text-gray-700">
            Bonjour ! Mwen se asistan IA vendè HTFasil ou. Kijan m ka ede w jodi a ? 🇭🇹
          </div>
        </div>

        <!-- Dynamic Messages -->
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          class="flex gap-3 max-w-[85%]"
          :class="msg.role === 'user' ? 'self-end flex-row-reverse' : ''"
        >
          <div v-if="msg.role === 'assistant'" class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
             <i class="fas fa-headset text-xs"></i>
          </div>
          <div v-else class="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0">
             <i class="fas fa-user text-xs"></i>
          </div>

          <div 
            class="p-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed"
            :class="msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'"
          >
            {{ msg.content }}
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex gap-3 max-w-[85%]">
          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
             <i class="fas fa-headset text-xs"></i>
          </div>
          <div class="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex items-center gap-1">
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>

      <!-- Quick Replies -->
      <div v-if="showQuickReplies && messages.length === 0" class="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar bg-gray-50 shrink-0">
        <button @click="sendMessage('Koman m ka ajoute yon pwodwi?')" class="whitespace-nowrap bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-50 transition-colors">
          Ajoute yon pwodwi
        </button>
        <button @click="sendMessage('Comment booster mes ventes ?')" class="whitespace-nowrap bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-50 transition-colors">
          Booster mes ventes
        </button>
        <button @click="sendMessage('Comment modifier ma boutique ?')" class="whitespace-nowrap bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-50 transition-colors">
          Modifier ma boutique
        </button>
      </div>

      <!-- Input Area -->
      <div class="p-3 bg-white border-t border-gray-100 shrink-0">
        <form @submit.prevent="handleSubmit" class="flex items-center gap-2">
          <input 
            v-model="inputMessage" 
            type="text" 
            placeholder="Ekri mesaj ou..." 
            class="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            :disabled="isTyping"
          />
          <button 
            type="submit" 
            :disabled="!inputMessage.trim() || isTyping"
            class="w-10 h-10 rounded-full bg-gradient-to-tl from-blue-600 to-indigo-500 text-white flex items-center justify-center shrink-0 hover:shadow-[0_4px_15px_rgb(59,130,246,0.4)] disabled:opacity-50 disabled:shadow-none transition-all"
          >
            <i class="fas fa-paper-plane text-xs relative -left-0.5 mt-0.5"></i>
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const messages = ref<{role: 'user'|'assistant', content: string}[]>([])
const inputMessage = ref('')
const isTyping = ref(false)
const showQuickReplies = ref(true)
const messagesContainer = ref<HTMLElement | null>(null)

const close = () => {
  emit('update:isOpen', false)
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) scrollToBottom()
})

const sendMessage = async (text: string) => {
  if (!text.trim() || isTyping.value) return
  
  messages.value.push({ role: 'user', content: text })
  inputMessage.value = ''
  showQuickReplies.value = false
  isTyping.value = true
  scrollToBottom()

  try {
    const token = localStorage.getItem('customer_token')
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api'

    // Historique pour Gemini (sans le dernier message user qu'on vient d'ajouter)
    const history = messages.value.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      content: m.content
    }))

    const response = await fetch(`${API_URL}/ai/seller-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ message: text, history })
    })

    if (!response.ok) throw new Error('API error: ' + response.status)

    const data = await response.json()
    messages.value.push({ role: 'assistant', content: data.message })

  } catch (error) {
    console.error('Seller AI Error:', error)
    messages.value.push({ 
      role: 'assistant', 
      content: 'Desolé, m pa ka reponn kounye a. Tanpri eseye ankò.' 
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

const handleSubmit = () => {
  sendMessage(inputMessage.value)
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile: entre depuis le bas */
@media (max-width: 767px) {
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
}

/* Desktop: entre depuis la droite */
@media (min-width: 768px) {
  .fade-slide-enter-from,
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
