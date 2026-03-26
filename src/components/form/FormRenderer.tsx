'use client'
import { FormField } from '@/types/form'
import { useState } from 'react'
import toast from '@/lib/toast'

interface Props {
  fields: FormField[]
  formId: string
}

export function FormRenderer({ fields, formId }: Props) {
  const [values, setValues] = useState<Record<string, string | boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const res = await fetch(`/api/forms/${formId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: values })
    })
    
    if (res.ok) {
      setSubmitted(true)
      toast.success('Response submitted!')
    } else {
      setError('Something went wrong. Please try again.')
      toast.error('Failed to submit response')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank you!</h2>
        <p className="text-slate-500">Your response has been submitted.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-6">
      {fields.map(field => (
        <div key={field.id}>
          <label className="block font-medium text-slate-900 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.type === 'text' && (
            <input
              type="text"
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              required={field.required}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          )}
          
          {field.type === 'email' && (
            <input
              type="email"
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              required={field.required}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          )}
          
          {field.type === 'textarea' && (
            <textarea
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              required={field.required}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={4}
            />
          )}
          
          {field.type === 'select' && (
            <select
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              required={field.required}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          
          {field.type === 'radio' && (
            <div className="space-y-3">
              {field.options?.map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    onChange={e => setValues({ ...values, [field.id]: e.target.value })}
                    required={field.required}
                    className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          )}
          
          {field.type === 'checkbox' && (
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={values[field.id] as boolean || false}
                onChange={e => setValues({ ...values, [field.id]: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-slate-700">{field.label}</span>
            </label>
          )}
        </div>
      ))}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : 'Submit'}
      </button>
    </form>
  )
}