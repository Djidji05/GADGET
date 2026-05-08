import { ref } from 'vue'

interface Toast {
  id: string
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  autoClose?: boolean
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = {
      id,
      ...toast,
    }

    toasts.value.push(newToast)

    // Auto remove after duration
    if (toast.autoClose !== false) {
      const duration = toast.duration || 5000
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (
    message: string,
    title?: string,
    options?: Partial<Omit<Toast, 'id' | 'message' | 'title' | 'type'>>,
  ) => {
    return addToast({
      message,
      title,
      type: 'success',
      ...options,
    })
  }

  const error = (
    message: string,
    title?: string,
    options?: Partial<Omit<Toast, 'id' | 'message' | 'title' | 'type'>>,
  ) => {
    return addToast({
      message,
      title,
      type: 'error',
      duration: 7000, // Errors stay longer
      ...options,
    })
  }

  const warning = (
    message: string,
    title?: string,
    options?: Partial<Omit<Toast, 'id' | 'message' | 'title' | 'type'>>,
  ) => {
    return addToast({
      message,
      title,
      type: 'warning',
      ...options,
    })
  }

  const info = (
    message: string,
    title?: string,
    options?: Partial<Omit<Toast, 'id' | 'message' | 'title' | 'type'>>,
  ) => {
    return addToast({
      message,
      title,
      type: 'info',
      ...options,
    })
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clear,
  }
}
