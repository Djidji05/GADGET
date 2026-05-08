import { api } from './api'

export interface Notification {
    id: number
    userId: number
    type: 'info' | 'success' | 'warning' | 'error' | 'order'
    title: string
    message: string
    status: 'unread' | 'read'
    relatedId?: number
    relatedType?: string
    metadata?: any
    createdAt: string
    updatedAt: string
}

export interface NotificationsResponse {
    notifications: Notification[]
    unreadCount: number
    total: number
}

export const notificationsService = {
    async getNotifications(params?: { limit?: number; status?: string; type?: string }): Promise<NotificationsResponse> {
        const response = await api.get('/notifications', { params })
        return response.data
    },

    async markAsRead(id: number): Promise<Notification> {
        const response = await api.post(`/notifications/${id}/read`)
        return response.data.notification
    },

    async markAllAsRead(): Promise<{ message: string }> {
        const response = await api.post('/notifications/mark-all-read')
        return response.data
    },

    async deleteNotification(id: number): Promise<{ message: string }> {
        const response = await api.delete(`/notifications/${id}`)
        return response.data
    }
}
