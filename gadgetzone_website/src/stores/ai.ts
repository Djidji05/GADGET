import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    data?: any;
}

export const useAIStore = defineStore('ai', () => {
    const messages = ref<Message[]>([]);
    const isTyping = ref(false);
    const suggestions = ref<string[]>([]);
    const isOpen = ref(false);

    function addMessage(role: 'user' | 'assistant', content: string, data?: any) {
        const newMessage: Message = {
            id: Date.now().toString(),
            role,
            content,
            timestamp: new Date(),
            data,
        };
        messages.value.push(newMessage);
    }

    async function toggleChat() {
        isOpen.value = !isOpen.value;
        if (isOpen.value && messages.value.length === 0) {
            addMessage('assistant', "Bonjour ! Je suis votre assistant HTFasil. Comment puis-je vous aider aujourd'hui ?");
            await fetchSuggestions();
        }
    }

    async function sendMessage(text: string) {
        if (!text.trim()) return;

        addMessage('user', text);
        isTyping.value = true;

        try {
            const response = await api.post('/ai/chat', {
                message: text,
                history: messages.value.slice(-5)
            });

            const { message, data } = response.data;
            addMessage('assistant', message, data);
        } catch (error) {
            console.error('AI Chat Error:', error);
            addMessage('assistant', "Désolé, j'ai rencontré un problème technique. Veuillez réessayer plus tard.");
        } finally {
            isTyping.value = false;
        }
    }

    async function fetchSuggestions() {
        try {
            const response = await api.get('/ai/suggestions');
            suggestions.value = response.data;
        } catch (error) {
            console.error('Fetch AI Suggestions Error:', error);
        }
    }

    function clearChat() {
        messages.value = [];
    }

    return {
        messages,
        isTyping,
        suggestions,
        isOpen,
        addMessage,
        toggleChat,
        sendMessage,
        fetchSuggestions,
        clearChat
    };
});
