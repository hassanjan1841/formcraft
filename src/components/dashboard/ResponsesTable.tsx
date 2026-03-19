'use client'
import { useState, useEffect } from 'react'

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

  if (loading) return <div className="text-center py-4">Loading...</div>
  if (submissions.length === 0) return <div className="text-center py-8 text-gray-500">No submissions yet.</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border p-3 text-left">Date</th>
            {fields.map(f => (
              <th key={f.id} className="border p-3 text-left">{f.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub, i) => (
            <tr key={sub.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border p-3 text-sm text-gray-500">
                {new Date(sub.createdAt).toLocaleString()}
              </td>
              {fields.map(f => (
                <td key={f.id} className="border p-3">
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
