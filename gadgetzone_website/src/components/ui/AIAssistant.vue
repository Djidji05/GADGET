<template>
  <div class="ai-assistant-wrapper" v-if="shouldShowAssistant">
    <!-- Floating Toggle Button -->
    <button 
      @mousedown="startDrag"
      @touchstart.passive="startDrag"
      @click="toggleChat"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      class="fixed w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center hover:scale-110 hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] active:scale-95 transition-all z-[9999] group cursor-move touch-none"
      ref="dragButton"
    >
      <i v-if="!aiStore.isOpen" class="fas fa-headset text-2xl group-hover:rotate-12 transition-transform pointer-events-none"></i>
      <i v-else class="fas fa-times text-2xl pointer-events-none"></i>
      
      <!-- Notification Dot -->
      <span v-if="!aiStore.isOpen && unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-[10px] flex items-center justify-center font-bold pointer-events-none">
        {{ unreadCount }}
      </span>
    </button>

    <!-- Chat Window -->
    <Transition name="slide-up">
      <div 
        v-if="aiStore.isOpen" 
        :style="chatWindowStyle"
        class="fixed bg-white rounded-2xl shadow-2xl flex flex-col z-[9999] overflow-hidden border border-gray-100"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between border-b border-indigo-700/50 relative overflow-hidden">
          <!-- Effet de brillance bg -->
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div class="flex items-center gap-3 relative z-10">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-inner">
              <i class="fas fa-headset text-lg text-white"></i>
            </div>
            <div>
              <h3 class="font-bold text-sm tracking-wide flex items-center gap-1.5">
                Assistant HTFasil 
                <i class="fas fa-star text-[10px] text-yellow-300"></i>
              </h3>
              <p class="text-[10px] text-blue-100 flex items-center gap-1.5 font-medium mt-0.5">
                <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.6)]"></span>
                En ligne
              </p>
            </div>
          </div>
          <button @click="aiStore.toggleChat" class="text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors w-8 h-8 flex items-center justify-center relative z-10" title="Fermer">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar" ref="messagesBox">
          <div 
            v-for="msg in aiStore.messages" 
            :key="msg.id" 
            :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div 
              :class="[
                'max-w-[85%] rounded-2xl p-3 text-sm shadow-sm',
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              ]"
            >
              <div class="whitespace-pre-wrap leading-relaxed">{{ msg.content }}</div>
              
              <!-- Data Visualizers (Products, Orders, etc.) -->
              <div v-if="msg.data" class="mt-3 space-y-2">
                <!-- Product List -->
                <div v-if="msg.data.type === 'products'" class="grid grid-cols-1 gap-2">
                  <div 
                    v-for="product in msg.data.items" 
                    :key="product.id"
                    class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                    @click="goToProduct(product.id)"
                  >
                    <img :src="product.image_url" class="w-10 h-10 object-cover rounded bg-white" alt="">
                    <div class="flex-1 min-w-0">
                      <p class="text-[11px] font-bold truncate">{{ product.name }}</p>
                      <p class="text-[10px] text-blue-600 font-bold">{{ product.price }} G</p>
                    </div>
                  </div>
                </div>

                <!-- Order Info -->
                <div v-if="msg.data.type === 'order'" class="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] font-bold text-blue-800">Commande #{{ msg.data.item.id }}</span>
                    <span class="px-2 py-0.5 bg-blue-600 text-white text-[9px] rounded-full">{{ msg.data.item.status }}</span>
                  </div>
                  <p class="text-[10px] text-gray-600">Total: {{ msg.data.item.total_amount }} G</p>
                </div>
              </div>

              <div class="text-[9px] mt-1 opacity-60 text-right">
                {{ formatTime(msg.timestamp) }}
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="aiStore.isTyping" class="flex justify-start">
            <div class="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex gap-1">
              <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        </div>

        <!-- Footer / Input -->
        <div class="p-4 bg-white border-t border-gray-100">
          <!-- Suggestions -->
          <div v-if="aiStore.messages.length < 5 && aiStore.suggestions.length > 0" class="flex flex-wrap gap-2 mb-3">
             <button 
                v-for="sug in aiStore.suggestions" 
                :key="sug"
                @click="sendQuickMessage(sug)"
                class="text-[10px] bg-gray-100 hover:bg-blue-50 hover:text-blue-600 py-1 px-3 rounded-full transition-colors border border-gray-200"
             >
               {{ sug }}
             </button>
          </div>

          <form @submit.prevent="handleSend" class="flex items-center gap-2">
            <input 
              v-model="inputMessage"
              type="text" 
              placeholder="Posez votre question..."
              class="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              :disabled="aiStore.isTyping"
              @focus="scrollToBottom"
            >
            <button 
              type="submit"
              :disabled="!inputMessage.trim() || aiStore.isTyping"
              class="w-10 h-10 bg-gradient-to-tl from-blue-600 to-indigo-500 text-white rounded-xl flex items-center justify-center hover:shadow-[0_4px_15px_rgb(59,130,246,0.4)] active:scale-95 disabled:opacity-50 disabled:hover:shadow-none transition-all"
            >
              <i class="fas fa-paper-plane text-sm ml-0.5"></i>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onUpdated, nextTick, computed } from 'vue';
import { useAIStore } from '@/stores/ai';
import { useUiStore } from '@/stores/ui';
import { useRouter, useRoute } from 'vue-router';
import { useDevice } from '@/composables/useDevice';

const aiStore = useAIStore();
const uiStore = useUiStore();
const router = useRouter();
const route = useRoute();

const isSellerRoute = computed(() => route.path.startsWith('/seller'));
const isAuthRoute = computed(() => ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback'].includes(route.path));
const { isMobile } = useDevice();

// Page-specific visibility logic
const allowedRoutes = [
  'home',
  'products',
  'product-detail',
  'cart',
  'orders',
  'order-detail',
  'account',
  'addresses',
  'wishlist',
  'notifications',
  'browsing-history'
];

const shouldShowAssistant = computed(() => {
  // Hide on unauthorized routes
  if (isSellerRoute.value || isAuthRoute.value) return false;
  
  // Hide if mobile menu is open
  if (isMobile.value && uiStore.isMobileMenuOpen) return false;

  // Hide if product image lightbox/gallery is open
  if (uiStore.isLightboxOpen) return false;
  
  // Only show on specific allowed routes
  return allowedRoutes.includes(route.name as string);
});

const inputMessage = ref('');
const messagesBox = ref<HTMLElement | null>(null);
const unreadCount = ref(0);

// Drag & Drop State
const initialY = window.innerWidth < 768 ? window.innerHeight - 160 : window.innerHeight - 150;
const position = ref({ x: window.innerWidth - 80, y: initialY });
const isDragging = ref(false);
const dragStartPos = ref({ x: 0, y: 0 });
const hasMoved = ref(false);

const chatWindowStyle = computed(() => {
  if (isMobile.value) {
    return {
      left: '12px',
      right: '12px',
      bottom: '100px',
      top: '12px',
      width: 'auto',
      height: 'auto',
      maxHeight: 'calc(100% - 112px)',
      borderRadius: '1.5rem'
    };
  }

  const isLeft = position.value.x < window.innerWidth / 2;
  const isTop = position.value.y < window.innerHeight / 2;
  
  return {
    left: isLeft ? (position.value.x + 0) + 'px' : 'auto',
    right: !isLeft ? (window.innerWidth - position.value.x - 56) + 'px' : 'auto',
    top: isTop ? (position.value.y + 70) + 'px' : 'auto',
    bottom: !isTop ? (window.innerHeight - position.value.y + 16) + 'px' : 'auto',
    width: '380px',
    height: '550px'
  };
});

const startDrag = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true;
  hasMoved.value = false;
  
  let clientX = 0;
  let clientY = 0;

  if ('touches' in event && event.touches && event.touches[0]) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else if (event instanceof MouseEvent) {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  
  dragStartPos.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  };

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);
};

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  
  if (event.cancelable) {
    event.preventDefault();
  }

  let clientX = 0;
  let clientY = 0;

  if ('touches' in event && event.touches && event.touches[0]) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else if (event instanceof MouseEvent) {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  
  let newX = clientX - dragStartPos.value.x;
  let newY = clientY - dragStartPos.value.y;

  // Boundary checks
  const margin = 10;
  const btnSize = 56;
  newX = Math.max(margin, Math.min(newX, window.innerWidth - btnSize - margin));
  newY = Math.max(margin, Math.min(newY, window.innerHeight - btnSize - margin));

  if (Math.abs(newX - position.value.x) > 5 || Math.abs(newY - position.value.y) > 5) {
    hasMoved.value = true;
  }

  position.value = { x: newX, y: newY };
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', stopDrag);
};

const toggleChat = () => {
  if (!hasMoved.value) {
    aiStore.toggleChat();
  }
};

const handleSend = async () => {
  if (!inputMessage.value.trim()) return;
  const text = inputMessage.value;
  inputMessage.value = '';
  await aiStore.sendMessage(text);
  scrollToBottom();
};

const sendQuickMessage = (text: string) => {
  aiStore.sendMessage(text);
  scrollToBottom();
};

const goToProduct = (id: number) => {
  router.push(`/products/${id}`);
  aiStore.isOpen = false;
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(date));
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesBox.value) {
      messagesBox.value.scrollTop = messagesBox.value.scrollHeight;
    }
  });
};

const updateWindowPosition = () => {
  // Keep button in view on resize
  const btnSize = 56;
  const margin = 10;
  position.value.x = Math.min(position.value.x, window.innerWidth - btnSize - margin);
  position.value.y = Math.min(position.value.y, window.innerHeight - btnSize - margin);
};

onMounted(() => {
  window.addEventListener('resize', updateWindowPosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowPosition);
});

onUpdated(() => {
  scrollToBottom();
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Ensure transition-all doesn't interfere with smooth dragging of position */
button {
  transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
}
</style>
