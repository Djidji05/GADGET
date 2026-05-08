import { defineStore } from 'pinia'
import { notificationsService, type Notification } from '../services/notifications'

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: [] as Notification[],
        unreadCount: 0,
        isLoading: false,
        error: null as string | null
    }),

    actions: {
        playSound() {
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
                audio.volume = 0.5
                audio.play().catch(e => {
                    // Ignore autoplay policy errors
                    if (e.name !== 'NotAllowedError') {
                        console.log('Audio playback error:', e)
                    }
                })
            } catch (err) {
                console.error('Failed to play notification sound:', err)
            }
        },

        async fetchNotifications(silent = false) {
            try {
                const previousUnreadCount = this.unreadCount
                if (!silent) {
                    this.isLoading = true
                    this.error = null
                }
                const data = await notificationsService.getNotifications()
                this.notifications = data.notifications
                this.unreadCount = data.unreadCount

                // Play sound and refresh profile if new unread notifications arrive (only if not silent)
                if (!silent && this.unreadCount > previousUnreadCount) {
                    this.playSound()

                    // Refresh user profile to catch role changes (like vendor approval)
                    try {
                        const { useAuthStore } = await import('./auth')
                        const authStore = useAuthStore()
                        if (authStore.isAuthenticated) {
                            await authStore.fetchUserProfile()
                        }
                    } catch (authErr) {
                        console.error('Failed to refresh profile on notification:', authErr)
                    }
                }
            } catch (err: any) {
                if (!silent) {
                    this.error = 'Erreur lors du chargement des notifications'
                }
                // Ne pas logger en console les erreurs 401 (non connecté) ou si c'est un refresh de fond
                if (!silent && err.response?.status !== 401) console.error(err)
            } finally {
                if (!silent) {
                    this.isLoading = false
                }
            }
        },

        async markAsRead(id: number) {
            try {
                await notificationsService.markAsRead(id)
                const notification = this.notifications.find(n => n.id === id)
                if (notification && notification.status === 'unread') {
                    notification.status = 'read'
                    this.unreadCount = Math.max(0, this.unreadCount - 1)
                }
            } catch (err) {
                console.error('Erreur lors du marquage de la notification:', err)
            }
        },

        async markAllAsRead() {
            try {
                await notificationsService.markAllAsRead()
                this.notifications.forEach(n => n.status = 'read')
                this.unreadCount = 0
            } catch (err) {
                console.error('Erreur lors du marquage de toutes les notifications:', err)
            }
        },

        async deleteNotification(id: number) {
            try {
                await notificationsService.deleteNotification(id)
                this.notifications = this.notifications.filter(n => n.id !== id)
                // Recalculate unreadCount if deleted notification was unread
                this.unreadCount = this.notifications.filter(n => n.status === 'unread').length
            } catch (err) {
                console.error('Erreur lors de la suppression de la notification:', err)
            }
        }
    }
})
