'use client'
import { signOut } from 'next-auth/react'
import toast from '@/lib/toast'

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
    toast.success('Logged out successfully')
  }

  return (
    <button 
      onClick={handleLogout}
      className="text-slate-500 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  )
}