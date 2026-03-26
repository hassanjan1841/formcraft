'use client'
import { useState, useEffect } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Props {
  formId: string
  fields: { id: string; label: string }[]
}

interface Submission {
  id: string
  data: Record<string, string | boolean>
  createdAt: string
}

export function ResponsesTable({ formId, fields }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/forms/${formId}/responses`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data)
      }
      setLoading(false)
    }
    load()
  }, [formId])

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner text="Loading responses..." size="md" />
    </div>
  )
  
  if (submissions.length === 0) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-slate-500 font-medium">No submissions yet</p>
      <p className="text-slate-400 text-sm mt-1">Submissions will appear here when users fill out your form</p>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left p-4 text-sm font-semibold text-slate-700">Date</th>
            {fields.map(f => (
              <th key={f.id} className="text-left p-4 text-sm font-semibold text-slate-700">{f.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub, i) => (
            <tr key={sub.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="p-4 text-sm text-slate-500">
                {new Date(sub.createdAt).toLocaleString()}
              </td>
              {fields.map(f => (
                <td key={f.id} className="p-4 text-sm text-slate-700">
                  {String(sub.data[f.id] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}