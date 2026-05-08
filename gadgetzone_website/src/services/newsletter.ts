import { api } from './api'

export const newsletterService = {
    async subscribe(email: string) {
        const response = await api.post('/newsletter/subscribe', { email })
        return response.data
    },

    async unsubscribe(email: string) {
        const response = await api.post('/newsletter/unsubscribe', { email })
        return response.data
    }
}
