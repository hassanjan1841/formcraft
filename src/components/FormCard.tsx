'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FormCardProps {
  id: string
  title: string
  submissions: number
  updatedAt: string
}

export function FormCard({ id, title, submissions, updatedAt }: FormCardProps) {
  const router = useRouter()

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this form?')) return
    
    const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <Link
      href={`/dashboard/forms/${id}`}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition block"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
        >
          Delete
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {submissions} submissions
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(updatedAt).toLocaleDateString()}
      </p>
    </Link>
  )
}
