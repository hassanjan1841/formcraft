import { toast as sonnerToast } from 'sonner'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  description?: string
  duration?: number
}

const defaults = {
  success: { duration: 3000 },
  error: { duration: 5000 },
  info: { duration: 4000 },
  warning: { duration: 4000 },
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, {
      ...defaults.success,
      ...options,
    })
  },
  
  error: (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, {
      ...defaults.error,
      ...options,
    })
  },
  
  info: (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, {
      ...defaults.info,
      ...options,
    })
  },
  
  warning: (message: string, options?: ToastOptions) => {
    sonnerToast(message, {
      ...defaults.warning,
      ...options,
    })
  },
  
  promise: <T>(
    promise: () => Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    })
  }
}

export default toast