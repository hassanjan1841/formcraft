'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from '@/lib/toast'
import { useConfirmDialog } from '@/components/ui/ConfirmDialog'

interface FormCardProps {
  id: string
  title: string
  submissions: number
  updatedAt: string
}

export function FormCard({ id, title, submissions, updatedAt }: FormCardProps) {
  const router = useRouter()
  const { confirm } = useConfirmDialog()

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    const confirmed = await confirm({
      title: 'Delete Form',
      message: `Are you sure you want to delete "${title}"? This will also delete all ${submissions} submissions.`
    })
    
    if (!confirmed) return
    
    const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Form deleted')
      router.refresh()
    } else {
      toast.error('Failed to delete form')
    }
  }

  async function handleDuplicate(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'duplicate', formId: id })
    })
    if (res.ok) {
      toast.success('Form duplicated')
      router.refresh()
    } else {
      toast.error('Failed to duplicate form')
    }
  }

  return (
    <Link
      href={`/dashboard/forms/${id}`}
      className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 block"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDuplicate}
            className="text-slate-400 hover:text-blue-600 text-sm px-2 py-1 rounded-lg hover:bg-blue-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-slate-400 hover:text-red-600 text-sm px-2 py-1 rounded-lg hover:bg-red-50 transition-all"
          >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          </button>
        </div>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{submissions} submissions</span>
        </div>
        <span className="text-xs text-slate-400">
          {new Date(updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </Link>
  )
}