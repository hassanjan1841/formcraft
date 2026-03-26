'use client'
import { FormField } from '@/types/form'
import { useState, useRef } from 'react'
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const successRef = useRef<HTMLDivElement>(null)

  function validateField(field: FormField, value: string | boolean): string | null {
    if (field.required) {
      if (typeof value === 'boolean') {
        if (!value) return 'This field is required'
      } else if (!value || value.trim() === '') {
        return 'This field is required'
      }
    }
    if (field.type === 'email' && value && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }
    return null
  }

  function handleBlur(fieldId: FormField['id']) {
    const field = fields.find(f => f.id === fieldId)
    if (!field) return
    const error = validateField(field, values[fieldId])
    setFieldErrors(prev => ({ ...prev, [fieldId]: error || '' }))
    setFocusedField(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const newErrors: Record<string, string> = {}
    fields.forEach(field => {
      const error = validateField(field, values[field.id])
      if (error) newErrors[field.id] = error
    })
    setFieldErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setError('Please fill in all required fields correctly.')
      setLoading(false)
      return
    }
    
    const res = await fetch(`/api/forms/${formId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: values })
    })
    
    if (res.ok) {
      setSubmitted(true)
      setTimeout(() => setShowSuccess(true), 100)
      toast.success('Response submitted!')
    } else {
      setError('Something went wrong. Please try again.')
      toast.error('Failed to submit response')
    }
    setLoading(false)
  }

  function handleAnother() {
    setValues({})
    setFieldErrors({})
    setError('')
    setSubmitted(false)
    setShowSuccess(false)
  }

  if (submitted) {
    return (
      <div ref={successRef} className="text-center py-12">
        <div className={`relative w-20 h-20 mx-auto mb-6 ${showSuccess ? 'animate-bounce-in' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-green-100 rounded-full scale-0 animate-ping" />
          <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg className={`w-10 h-10 text-green-600 ${showSuccess ? 'animate-checkmark' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className={`text-2xl font-bold text-slate-900 mb-2 ${showSuccess ? 'animate-fade-in-up' : 'opacity-0'}`}>Thank you!</h2>
        <p className={`text-slate-500 mb-6 ${showSuccess ? 'animate-fade-in-up-delay' : 'opacity-0'}`}>Your response has been submitted.</p>
        <button
          onClick={handleAnother}
          className={`px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all ${showSuccess ? 'animate-fade-in-up-delay-2' : 'opacity-0'}`}
        >
          Submit another response
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-6">
      {fields.map(field => {
        const hasError = !!fieldErrors[field.id]
        const isFocused = focusedField === field.id
        
        return (
        <div key={field.id}>
          <label className={`block font-medium text-slate-900 mb-2 transition-colors duration-200 ${isFocused ? 'text-blue-600' : ''}`}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {field.type === 'text' && (
            <input
              type="text"
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => handleBlur(field.id)}
              required={field.required}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${hasError ? 'border-red-400 focus:ring-2 focus:ring-red-300' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'} ${isFocused ? 'shadow-lg shadow-blue-500/10' : ''}`}
            />
          )}
          
          {field.type === 'email' && (
            <input
              type="email"
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => handleBlur(field.id)}
              required={field.required}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${hasError ? 'border-red-400 focus:ring-2 focus:ring-red-300' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'} ${isFocused ? 'shadow-lg shadow-blue-500/10' : ''}`}
            />
          )}
          
          {field.type === 'textarea' && (
            <textarea
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => handleBlur(field.id)}
              required={field.required}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 resize-none ${hasError ? 'border-red-400 focus:ring-2 focus:ring-red-300' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'} ${isFocused ? 'shadow-lg shadow-blue-500/10' : ''}`}
              rows={4}
            />
          )}
          
          {field.type === 'select' && (
            <select
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => handleBlur(field.id)}
              required={field.required}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${hasError ? 'border-red-400 focus:ring-2 focus:ring-red-300' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'} ${isFocused ? 'shadow-lg shadow-blue-500/10' : ''}`}
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
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${hasError && fieldErrors[field.id] ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
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
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${hasError && fieldErrors[field.id] ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
              <input
                type="checkbox"
                checked={values[field.id] as boolean || false}
                onChange={e => setValues({ ...values, [field.id]: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-slate-700">{field.label}</span>
            </label>
          )}

          {field.type === 'date' && (
            <input
              type="date"
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => handleBlur(field.id)}
              required={field.required}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${hasError ? 'border-red-400 focus:ring-2 focus:ring-red-300' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'} ${isFocused ? 'shadow-lg shadow-blue-500/10' : ''}`}
            />
          )}

          {field.type === 'number' && (
            <input
              type="number"
              placeholder={field.placeholder}
              value={values[field.id] as string || ''}
              onChange={e => setValues({ ...values, [field.id]: e.target.value })}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => handleBlur(field.id)}
              required={field.required}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${hasError ? 'border-red-400 focus:ring-2 focus:ring-red-300' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'} ${isFocused ? 'shadow-lg shadow-blue-500/10' : ''}`}
            />
          )}

          {field.type === 'file' && (
            <div className={`w-full p-6 border-2 border-dashed rounded-xl text-center transition-all duration-200 ${hasError ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
              <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-slate-500">{field.placeholder || 'Upload file'}</span>
              <input
                type="file"
                onChange={e => setValues({ ...values, [field.id]: e.target.files?.[0]?.name || '' })}
                required={field.required}
                className="mt-3 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          )}

          {hasError && (
            <p className="mt-2 text-sm text-red-500 animate-shake flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {fieldErrors[field.id]}
            </p>
          )}
        </div>
      )})}
      
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