import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: string
    message: string
    title?: string
    type: ToastType
    duration: number
}

export interface ModalOptions {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
    type?: 'info' | 'warning' | 'danger'
}

export const useUiStore = defineStore('ui', () => {
    const toasts = ref<Toast[]>([])
    const modal = ref<ModalOptions | null>(null)
    const isSellerNavVisible = ref(true)
    const isCartAnimating = ref(false)
    const previousRouteName = ref<string | null>(null)
    const isMobileMenuOpen = ref(false)
    const isMobileSearchOpen = ref(false)
    const globalSearchQuery = ref('')
    const isLightboxOpen = ref(false)

    // Page Loading Indicator State
    const isPageLoading = ref(false)
    const isPageSlowLoading = ref(false)
    const isPageVerySlow = ref(false)
    const pageLoadingProgress = ref(0)
    let progressInterval: number | undefined
    let slowTimer: number | undefined
    let verySlowTimer: number | undefined

    const startPageLoading = () => {
        isPageLoading.value = true
        isPageSlowLoading.value = false
        isPageVerySlow.value = false
        pageLoadingProgress.value = 15

        if (progressInterval) clearInterval(progressInterval)
        if (slowTimer) clearTimeout(slowTimer)
        if (verySlowTimer) clearTimeout(verySlowTimer)

        progressInterval = window.setInterval(() => {
            if (pageLoadingProgress.value < 85) {
                pageLoadingProgress.value += Math.random() * 8 + 4
            }
        }, 180)

        // Show floating page loading pill if navigation takes > 280ms
        slowTimer = window.setTimeout(() => {
            if (isPageLoading.value) {
                isPageSlowLoading.value = true
            }
        }, 280)

        // Mark as very slow if > 2500ms
        verySlowTimer = window.setTimeout(() => {
            if (isPageLoading.value) {
                isPageVerySlow.value = true
            }
        }, 2500)
    }

    const finishPageLoading = () => {
        pageLoadingProgress.value = 100
        if (progressInterval) clearInterval(progressInterval)
        if (slowTimer) clearTimeout(slowTimer)
        if (verySlowTimer) clearTimeout(verySlowTimer)

        setTimeout(() => {
            isPageLoading.value = false
            isPageSlowLoading.value = false
            isPageVerySlow.value = false
            pageLoadingProgress.value = 0
        }, 220)
    }

    const triggerCartAnimation = () => {
        isCartAnimating.value = true
        setTimeout(() => {
            isCartAnimating.value = false
        }, 1000)
    }

    const showToast = (message: string, type: ToastType = 'info', title?: string, duration: number = 5000) => {
        const id = Date.now().toString()
        toasts.value.push({ id, message, title, type, duration })
    }

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const confirm = (options: ModalOptions) => {
        modal.value = options
    }

    const closeConfirm = () => {
        modal.value = null
    }

    return {
        toasts,
        modal,
        showToast,
        removeToast,
        confirm,
        closeConfirm,
        isSellerNavVisible,
        isCartAnimating,
        triggerCartAnimation,
        previousRouteName,
        isMobileMenuOpen,
        isMobileSearchOpen,
        globalSearchQuery,
        isLightboxOpen,
        isPageLoading,
        isPageSlowLoading,
        isPageVerySlow,
        pageLoadingProgress,
        startPageLoading,
        finishPageLoading
    }

})
