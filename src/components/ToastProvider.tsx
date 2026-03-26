import { Toaster } from 'sonner'

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        classes: {
          success: 'border-l-4 border-l-green-500',
          error: 'border-l-4 border-l-red-500',
          warning: 'border-l-4 border-l-amber-500',
          info: 'border-l-4 border-l-blue-500',
        }
      }}
    />
  )
}