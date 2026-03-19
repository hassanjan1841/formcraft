'use client'
import { FormField } from '@/types/form'
import { useState } from 'react'

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
    } else {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Thank you!</h2>
        <p className="text-gray-600">Your response has been submitted.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto py-8">
      {fields.map(field => (
        <div key={field.id}>
          <label className="block font-medium mb-2">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'text' && (
            <input
              type="text"
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              required={field.required}
              className="w-full p-3 border rounded-lg"
            />
          )}
          
          {field.type === 'email' && (
            <input
              type="email"
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              required={field.required}
              className="w-full p-3 border rounded-lg"
            />
          )}
          
          {field.type === 'textarea' && (
            <textarea
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              required={field.required}
              className="w-full p-3 border rounded-lg"
            />
          )}
          
          {field.type === 'select' && (
            <select
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              required={field.required}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          
          {field.type === 'radio' && (
            <div className="space-y-2">
              {field.options?.map(opt => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    onChange={e => setValues({ ...values, [field.id]: e.target.value })}
                    required={field.required}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
          
          {field.type === 'checkbox' && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values[field.id] as boolean || false}
                onChange={e => setValues({ ...values, [field.id]: e.target.checked })}
              />
              {field.label}
            </label>
          )}
        </div>
      ))}
      
      {error && <p className="text-red-500">{error}</p>}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
