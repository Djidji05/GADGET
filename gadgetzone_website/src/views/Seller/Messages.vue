<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { messageService, disputeService } from '@/services/api';
import { useNotificationsStore } from '@/stores/notifications';
import { useAuthStore } from '@/stores/auth';
import { useSSEStore } from '@/stores/sse';
import { useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const notificationsStore = useNotificationsStore();
const authStore = useAuthStore();
const sseStore = useSSEStore();

const currentUserId = computed(() => authStore.customer?.id);

interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Participant {
  id: number;
  name: string;
  role: string;
  logoUrl?: string;
  avatar?: string;
}

interface Conversation {
  id: number;
  otherParticipant: Participant;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount?: number;
}

const conversations = ref<Conversation[]>([]);
const selectedConversation = ref<Conversation | null>(null);
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoadingConversations = ref(false);
const isLoadingMessages = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

// Tab and disputes state
const activeTab = ref<'messages' | 'disputes'>('messages');
const disputes = ref<any[]>([]);
const selectedDispute = ref<any | null>(null);
const isLoadingDisputes = ref(false);
const newDisputeMessage = ref('');
const disputeMessagesContainer = ref<HTMLElement | null>(null);

const fetchConversations = async () => {
    isLoadingConversations.value = true;
    try {
        const res = await messageService.getConversations();
        conversations.value = res || [];
    } catch (e) {
        console.error("Error fetching conversations", e);
    } finally {
        isLoadingConversations.value = false;
    }
};

const selectConversation = async (conversation: Conversation) => {
    selectedConversation.value = conversation;
    isLoadingMessages.value = true;
    try {
        const res = await messageService.getConversationMessages(conversation.id);
        messages.value = res || [];
        await nextTick();
        scrollToBottom();
    } catch (e) {
        console.error("Error fetching messages", e);
    } finally {
        isLoadingMessages.value = false;
    }
};

const sendMessage = async () => {
    if (!newMessage.value.trim() || !selectedConversation.value) return;

    const content = newMessage.value.trim();
    const receiverId = selectedConversation.value.otherParticipant.id;
    
    newMessage.value = '';

    try {
        const sentMessage = await messageService.sendMessage(receiverId, content);
        messages.value.push(sentMessage);
        
        // Update last message in the conversation list
        const conv = conversations.value.find(c => c.id === selectedConversation.value?.id);
        if (conv) {
            conv.lastMessage = content;
            conv.lastMessageAt = new Date().toISOString();
        }

        await nextTick();
        scrollToBottom();
    } catch (e) {
        console.error("Error sending message", e);
    }
};

const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

const formatTime = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

// Disputes functions
const fetchDisputes = async () => {
    isLoadingDisputes.value = true;
    try {
        const res = await disputeService.getSellerDisputes();
        disputes.value = res || [];
    } catch (e) {
        console.error("Error fetching disputes", e);
    } finally {
        isLoadingDisputes.value = false;
    }
};

const selectDispute = async (dispute: any) => {
    isLoadingMessages.value = true;
    try {
        const res = await disputeService.getDispute(dispute.id);
        selectedDispute.value = res;
        await nextTick();
        scrollToBottomDispute();
    } catch (e) {
        console.error("Error fetching dispute details", e);
    } finally {
        isLoadingMessages.value = false;
    }
};

const sendDisputeMessage = async () => {
    if (!newDisputeMessage.value.trim() || !selectedDispute.value) return;

    const content = newDisputeMessage.value.trim();
    newDisputeMessage.value = '';

    try {
        await disputeService.addMessage(selectedDispute.value.id, content);
        // Refresh dispute details to get new message
        await selectDispute(selectedDispute.value);
    } catch (e) {
        console.error("Error sending dispute message", e);
    }
};

const scrollToBottomDispute = () => {
    if (disputeMessagesContainer.value) {
        disputeMessagesContainer.value.scrollTop = disputeMessagesContainer.value.scrollHeight;
    }
};

const formatStatus = (status: string) => {
    const statuses: Record<string, string> = {
        pending: 'En attente',
        under_review: 'En examen',
        resolved: 'Résolu',
        closed: 'Fermé'
    };
    return statuses[status] || status;
};

const formatDateShort = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return formatTime(date);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

let unsubscribeMessageSSE: (() => void) | null = null;

onMounted(() => {
    if (route.query.view === 'disputes') {
        activeTab.value = 'disputes';
        fetchDisputes();
    } else {
        fetchConversations();
    }
    notificationsStore.fetchNotifications(true);

    // Écouter les nouveaux messages SSE en temps réel
    unsubscribeMessageSSE = sseStore.onEvent('new_message', (data: any) => {
        // Mettre à jour la liste des conversations
        const conv = conversations.value.find(c => c.id === data.conversationId);
        if (conv) {
            conv.lastMessage = data.content;
            conv.lastMessageAt = data.createdAt;
            // Déplacer la conversation en haut
            conversations.value = [conv, ...conversations.value.filter(c => c.id !== data.conversationId)];
        } else {
            // Recharger si conversation inconnue
            fetchConversations();
        }

        // Si la conversation est active, ajouter le message en temps réel
        if (selectedConversation.value && selectedConversation.value.id === data.conversationId) {
            if (!messages.value.some(m => m.id === data.id)) {
                messages.value.push({
                    id: data.id,
                    conversationId: data.conversationId,
                    senderId: data.senderId,
                    content: data.content,
                    createdAt: data.createdAt,
                    isRead: true
                });
                nextTick(() => {
                    scrollToBottom();
                });
            }
        } else if (conv) {
            // Incrémenter le compteur non lu si c'est une autre conversation
            conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
    });
});

onUnmounted(() => {
    if (unsubscribeMessageSSE) {
        unsubscribeMessageSSE();
    }
});
</script>

<template>
<div class="bg-gray-50 h-screen flex flex-col font-sans overflow-hidden">
        <!-- Header (Mobile Only) -->
        <div v-if="!selectedConversation && !selectedDispute" class="bg-blue-900 text-white px-6 pt-12 pb-6 lg:hidden">
            <div class="flex items-center gap-4">
                <button @click="router.push('/seller/dashboard')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h1 class="text-xl font-bold">{{ activeTab === 'disputes' ? 'Mes Litiges' : 'Mes Messages' }}</h1>
            </div>
        </div>

        <div class="flex flex-1 overflow-hidden">
            <!-- Conversations/Disputes List -->
            <div :class="['w-full lg:w-96 bg-white border-r border-gray-100 flex flex-col', (selectedConversation || selectedDispute) ? 'hidden lg:flex' : 'flex']">
                <div class="p-6 border-b border-gray-50 hidden lg:block">
                    <h2 class="text-xl font-bold text-gray-900">Communication</h2>
                </div>
                
                <!-- Tabs -->
                <div class="flex border-b border-gray-100">
                    <button 
                        @click="activeTab = 'messages'; fetchConversations()"
                        :class="['flex-1 py-3 text-sm font-medium border-b-2 transition-colors', activeTab === 'messages' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
                    >
                        Messages
                    </button>
                    <button 
                        @click="activeTab = 'disputes'; fetchDisputes()"
                        :class="['flex-1 py-3 text-sm font-medium border-b-2 transition-colors', activeTab === 'disputes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
                    >
                        Litiges
                    </button>
                </div>

                <div class="overflow-y-auto flex-1">
                    <!-- Messages Tab -->
                    <template v-if="activeTab === 'messages'">
                        <div v-if="isLoadingConversations" class="p-6 space-y-4">
                        <div v-for="i in 5" :key="i" class="flex gap-4 animate-pulse">
                            <div class="w-12 h-12 bg-gray-100 rounded-full"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-gray-100 rounded w-1/3"></div>
                                <div class="h-3 bg-gray-100 rounded w-full"></div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="conversations.length === 0" class="flex flex-col items-center justify-center h-full p-12 text-center">
                        <div class="w-16 h-16 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-comments text-2xl"></i>
                        </div>
                        <p class="text-gray-500 text-sm">Aucune conversation pour le moment.</p>
                    </div>

                    <div v-else class="divide-y divide-gray-50">
                        <button 
                            v-for="conv in conversations" 
                            :key="conv.id" 
                            @click="selectConversation(conv)"
                            :class="['w-full p-4 flex gap-4 hover:bg-gray-50 transition-colors text-left relative', selectedConversation?.id === conv.id ? 'bg-blue-50/50' : '']"
                        >
                            <div class="relative flex-shrink-0">
                                <div class="w-14 h-14 rounded-full bg-gray-100 overflow-hidden border border-gray-50 shadow-sm">
                                    <img alt="" v-if="conv.otherParticipant.avatar || conv.otherParticipant.logoUrl" :src="conv.otherParticipant.avatar || conv.otherParticipant.logoUrl" class="w-full h-full object-cover" />
                                    <div v-else class="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-lg uppercase">
                                        {{ conv.otherParticipant.name.charAt(0) }}
                                    </div>
                                </div>
                                <div v-if="conv.unreadCount" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                                    {{ conv.unreadCount }}
                                </div>
                            </div>

                            <div class="flex-1 overflow-hidden">
                                <div class="flex justify-between items-baseline mb-1">
                                    <h4 class="font-bold text-gray-900 truncate pr-2">{{ conv.otherParticipant.name }}</h4>
                                    <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ formatDateShort(conv.lastMessageAt) }}</span>
                                </div>
                                <p :class="['text-xs truncate', conv.unreadCount ? 'text-gray-900 font-bold' : 'text-gray-500']">
                                    {{ conv.lastMessage || 'Envoyer un message...' }}
                                </p>
                            </div>
                            
                            <div v-if="selectedConversation?.id === conv.id" class="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                        </button>
                    </div>
                    </template>

                    <!-- Disputes Tab -->
                    <template v-else>
                        <div v-if="isLoadingDisputes" class="p-6 space-y-4">
                            <div v-for="i in 5" :key="i" class="flex gap-4 animate-pulse">
                                <div class="w-12 h-12 bg-gray-100 rounded-full"></div>
                                <div class="flex-1 space-y-2">
                                    <div class="h-4 bg-gray-100 rounded w-1/3"></div>
                                    <div class="h-3 bg-gray-100 rounded w-full"></div>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="disputes.length === 0" class="flex flex-col items-center justify-center h-full p-12 text-center">
                            <div class="w-16 h-16 bg-red-50 text-red-200 rounded-full flex items-center justify-center mb-4">
                                <i class="fas fa-exclamation-triangle text-2xl"></i>
                            </div>
                            <p class="text-gray-500 text-sm">Aucun litige en cours.</p>
                        </div>

                        <div v-else class="divide-y divide-gray-50">
                            <button 
                                v-for="dispute in disputes" 
                                :key="dispute.id" 
                                @click="selectDispute(dispute)"
                                :class="['w-full p-4 flex gap-4 hover:bg-gray-50 transition-colors text-left relative', selectedDispute?.id === dispute.id ? 'bg-blue-50/50' : '']"
                            >
                                <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
                                    <i class="fas fa-exclamation-circle text-xl"></i>
                                </div>

                                <div class="flex-1 overflow-hidden">
                                    <div class="flex justify-between items-baseline mb-1">
                                        <h4 class="font-bold text-gray-900 truncate pr-2">Commande #{{ dispute.order_id }}</h4>
                                        <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ formatDateShort(dispute.created_at) }}</span>
                                    </div>
                                    <p class="text-xs text-gray-600 font-medium truncate mb-1">Client: {{ dispute.customer?.name || 'Inconnu' }}</p>
                                    <p class="text-xs text-gray-500 truncate mb-1">{{ dispute.reason }}</p>
                                    <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 bg-gray-100 text-gray-600">
                                        {{ formatStatus(dispute.status) }}
                                    </span>
                                </div>
                                <div v-if="selectedDispute?.id === dispute.id" class="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                            </button>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Chat Area -->
            <div :class="['flex-1 bg-white flex flex-col', (!selectedConversation && !selectedDispute) ? 'hidden lg:flex' : 'flex']">
                <template v-if="selectedConversation && activeTab === 'messages'">
                    <!-- Chat Header -->
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-10">
                        <button @click="selectedConversation = null" class="lg:hidden text-gray-400">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            <img alt="" v-if="selectedConversation.otherParticipant.avatar || selectedConversation.otherParticipant.logoUrl" :src="selectedConversation.otherParticipant.avatar || selectedConversation.otherParticipant.logoUrl" class="w-full h-full object-cover" />
                            <span v-else class="font-bold text-blue-600">{{ selectedConversation.otherParticipant.name.charAt(0) }}</span>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 text-sm leading-none">{{ selectedConversation.otherParticipant.name }}</h3>
                            <span class="text-[10px] text-green-500 font-bold uppercase tracking-wider mt-1 block">En ligne</span>
                        </div>
                    </div>

                    <!-- Messages List -->
                    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                        <div v-if="isLoadingMessages" class="flex justify-center py-10">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        
                        <template v-else>
                            <div v-for="(msg, index) in messages" :key="msg.id" :class="['flex', msg.senderId === currentUserId ? 'justify-end' : 'justify-start']">
                                <div :class="[
                                    'max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm',
                                    msg.senderId === currentUserId ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                ]">
                                    <p class="leading-relaxed">{{ msg.content }}</p>
                                    <div :class="['text-[9px] mt-1 flex items-center gap-1', msg.senderId === currentUserId ? 'text-blue-100 justify-end' : 'text-gray-400']">
                                        {{ formatTime(msg.createdAt) }}
                                        <i v-if="msg.senderId === currentUserId" class="fas fa-check-double scale-75 opacity-80"></i>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Input Area -->
                    <div class="p-4 border-t border-gray-100 bg-white">
                        <div class="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200">
                            <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600">
                                <i class="fas fa-plus"></i>
                            </button>
                            <input 
                                v-model="newMessage" 
                                type="text" 
                                placeholder="Taper votre message..." 
                                class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1"
                                @keyup.enter="sendMessage"
                            />
                            <button 
                                @click="sendMessage" 
                                :disabled="!newMessage.trim()"
                                :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', newMessage.trim() ? 'bg-blue-600 text-white shadow-md shadow-blue-200 active:scale-95' : 'text-gray-300 pointer-events-none']"
                            >
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </template>

                <template v-else-if="selectedDispute && activeTab === 'disputes'">
                    <!-- Dispute Header -->
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-10">
                        <button @click="selectedDispute = null" class="lg:hidden text-gray-400">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 text-sm leading-none">Litige Commande #{{ selectedDispute.order_id }}</h3>
                            <span class="text-[10px] font-bold uppercase tracking-wider mt-1 block" :class="selectedDispute.status === 'resolved' || selectedDispute.status === 'closed' ? 'text-gray-500' : 'text-red-500'">
                                {{ formatStatus(selectedDispute.status) }}
                            </span>
                        </div>
                    </div>

                    <!-- Dispute Details -->
                    <div class="p-4 bg-yellow-50 text-yellow-800 text-sm border-b border-yellow-100">
                        <p class="font-medium mb-1"><strong>Raison :</strong> {{ selectedDispute.reason }}</p>
                        <p><strong>Description :</strong> {{ selectedDispute.description }}</p>
                    </div>

                    <!-- Dispute Messages List -->
                    <div ref="disputeMessagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                        <div v-if="isLoadingMessages" class="flex justify-center py-10">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        
                        <template v-else>
                            <div v-if="!selectedDispute.messages || selectedDispute.messages.length === 0" class="text-center text-gray-500 text-sm py-4">
                                Aucun message dans ce litige.
                            </div>
                            <div v-for="msg in selectedDispute.messages" :key="msg.id" :class="['flex', msg.sender_id === selectedDispute.customer?.id ? 'justify-start' : 'justify-end']">
                                <div :class="[
                                    'max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm',
                                    msg.sender_id === selectedDispute.customer?.id ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' : 'bg-blue-600 text-white rounded-tr-none'
                                ]">
                                    <div class="text-[10px] font-bold mb-1 opacity-70">{{ msg.sender?.name || 'Administrateur' }}</div>
                                    <p class="leading-relaxed">{{ msg.message }}</p>
                                    <div :class="['text-[9px] mt-1 flex items-center gap-1', msg.sender_id === selectedDispute.customer?.id ? 'text-gray-400' : 'text-blue-100 justify-end']">
                                        {{ formatTime(msg.created_at) }}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Input Area for Dispute -->
                    <div v-if="selectedDispute.status !== 'resolved' && selectedDispute.status !== 'closed'" class="p-4 border-t border-gray-100 bg-white">
                        <div class="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border border-gray-200">
                            <input 
                                v-model="newDisputeMessage" 
                                type="text" 
                                placeholder="Répondre au litige..." 
                                class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1"
                                @keyup.enter="sendDisputeMessage"
                            />
                            <button 
                                @click="sendDisputeMessage" 
                                :disabled="!newDisputeMessage.trim()"
                                :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all', newDisputeMessage.trim() ? 'bg-blue-600 text-white shadow-md shadow-blue-200 active:scale-95' : 'text-gray-300 pointer-events-none']"
                            >
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                    <div v-else class="p-4 bg-gray-100 text-center text-gray-500 text-sm italic">
                        Ce litige est fermé. Vous ne pouvez plus envoyer de messages.
                    </div>
                </template>

                <div v-else class="flex-1 hidden lg:flex flex-col items-center justify-center text-center p-20 bg-gray-50/30">
                    <div class="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                        <i :class="['text-4xl', activeTab === 'disputes' ? 'fas fa-gavel text-red-100' : 'fas fa-comment-dots text-blue-100']"></i>
                    </div>
                    <h3 class="font-bold text-gray-900 text-lg">{{ activeTab === 'disputes' ? 'Vos litiges' : 'Vos messages' }}</h3>
                    <p class="text-gray-500 text-sm mt-2 max-w-xs">Sélectionnez {{ activeTab === 'disputes' ? 'un litige' : 'une conversation' }} pour voir les détails et répondre.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.font-sans {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 10px;
}
</style>
