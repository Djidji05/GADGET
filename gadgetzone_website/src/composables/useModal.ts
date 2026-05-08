import { ref } from 'vue'

interface ModalState {
  isOpen: boolean
  title?: string
  content?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
}

const modalState = ref<ModalState>({
  isOpen: false,
  showCloseButton: true,
  closeOnBackdrop: true,
})

export function useModal() {
  const open = (options: Partial<ModalState> = {}) => {
    modalState.value = {
      isOpen: true,
      showCloseButton: true,
      closeOnBackdrop: true,
      ...options,
    }
  }

  const close = () => {
    modalState.value.isOpen = false
  }

  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      open({
        title,
        content: message,
        size: 'md',
        closeOnBackdrop: false,
      })

      // This is a simplified version - in a real app, you'd handle the confirm/cancel buttons
      const handleConfirm = () => {
        close()
        resolve(true)
      }

      const handleCancel = () => {
        close()
        resolve(false)
      }

      // Store handlers temporarily (you'd need a more robust solution)
      ;(window as unknown as Record<string, unknown>)._modalConfirm = handleConfirm
      ;(window as unknown as Record<string, unknown>)._modalCancel = handleCancel
    })
  }

  const alert = (title: string, message: string): Promise<void> => {
    return new Promise((resolve) => {
      open({
        title,
        content: message,
        size: 'md',
      })

      const handleOk = () => {
        close()
        resolve()
      }

      ;(window as unknown as Record<string, unknown>)._modalOk = handleOk
    })
  }

  return {
    modalState,
    open,
    close,
    confirm,
    alert,
  }
}
