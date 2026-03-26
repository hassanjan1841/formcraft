'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmDialogState {
  open: boolean
  title: string
  message: string
  onConfirm: (() => void) | null
}

interface ConfirmDialogContextType {
  confirm: (options: { title: string; message: string }) => Promise<boolean>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null)

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider')
  }
  return context
}

interface ConfirmDialogProviderProps {
  children: ReactNode
}

export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
  const [state, setState] = useState<ConfirmDialogState>({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  })

  const confirm = async (options: { title: string; message: string }): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        open: true,
        title: options.title,
        message: options.message,
        onConfirm: () => resolve(true),
      })
    })
  }

  const handleCancel = () => {
    setState({ open: false, title: '', message: '', onConfirm: null })
  }

  const handleConfirm = () => {
    if (state.onConfirm) {
      state.onConfirm()
    }
    setState({ open: false, title: '', message: '', onConfirm: null })
  }

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        state.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCancel}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{state.title}</h3>
                  <p className="text-sm text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6">{state.message}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </ConfirmDialogContext.Provider>
  )
}