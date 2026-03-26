'use client'
import { FormField } from '@/types/form'
import { useEffect, useState, useCallback } from 'react'
import toast from '@/lib/toast'

interface Props {
  fields: FormField[]
  formId: string
  onComplete?: () => void
}

export function QuestionView({ fields, formId, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [values, setValues] = useState<Record<string, string | boolean>>({})
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const progress = ((currentIndex + 1) / fields.length) * 100

  const handleValueChange = (fieldId: string, value: string | boolean) => {
    setValues(prev => ({ ...prev, [fieldId]: value }))
  }

  const goNext = useCallback(() => {
    if (currentIndex < fields.length - 1) {
      setDirection('forward')
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex, fields.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection('backward')
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev])

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch(`/api/forms/${formId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: values })
    })

    if (res.ok) {
      setSubmitted(true)
      toast.success('Response submitted!')
      onComplete?.()
    } else {
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

  const currentField = fields[currentIndex]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Question {currentIndex + 1} of {fields.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="min-h-[300px]">
        <div
          key={currentField.id}
          className={`space-y-4 animate-in slide-in-from-right-8 fade-in duration-300 ${
            direction === 'backward' ? 'animate-in slide-in-from-left-8' : ''
          }`}
        >
          <label className="block font-medium text-slate-900 text-lg">
            {currentField.label}
            {currentField.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {currentField.type === 'text' && (
            <input
              type="text"
              placeholder={currentField.placeholder}
              value={values[currentField.id] as string || ''}
              onChange={e => handleValueChange(currentField.id, e.target.value)}
              required={currentField.required}
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            />
          )}

          {currentField.type === 'email' && (
            <input
              type="email"
              placeholder={currentField.placeholder}
              value={values[currentField.id] as string || ''}
              onChange={e => handleValueChange(currentField.id, e.target.value)}
              required={currentField.required}
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            />
          )}

          {currentField.type === 'textarea' && (
            <textarea
              placeholder={currentField.placeholder}
              value={values[currentField.id] as string || ''}
              onChange={e => handleValueChange(currentField.id, e.target.value)}
              required={currentField.required}
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-lg"
              rows={4}
            />
          )}

          {currentField.type === 'select' && (
            <select
              value={values[currentField.id] as string || ''}
              onChange={e => handleValueChange(currentField.id, e.target.value)}
              required={currentField.required}
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            >
              <option value="">Select...</option>
              {currentField.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {currentField.type === 'radio' && (
            <div className="space-y-3">
              {currentField.options?.map(opt => (
                <label key={opt} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name={currentField.id}
                    value={opt}
                    checked={values[currentField.id] === opt}
                    onChange={e => handleValueChange(currentField.id, e.target.value)}
                    required={currentField.required}
                    className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 text-lg">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {currentField.type === 'checkbox' && (
            <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={values[currentField.id] as boolean || false}
                onChange={e => handleValueChange(currentField.id, e.target.checked)}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-slate-700">{currentField.label}</span>
            </label>
          )}

          {currentField.type === 'date' && (
            <input
              type="date"
              value={values[currentField.id] as string || ''}
              onChange={e => handleValueChange(currentField.id, e.target.value)}
              required={currentField.required}
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            />
          )}

          {currentField.type === 'number' && (
            <input
              type="number"
              placeholder={currentField.placeholder}
              value={values[currentField.id] as string || ''}
              onChange={e => handleValueChange(currentField.id, e.target.value)}
              required={currentField.required}
              autoFocus
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            />
          )}

          {currentField.type === 'file' && (
            <div className="w-full p-6 border-2 border-dashed border-slate-200 rounded-xl text-center hover:border-slate-300 hover:bg-slate-50 transition-all">
              <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-slate-500">{currentField.placeholder || 'Upload file'}</span>
              <input
                type="file"
                onChange={e => handleValueChange(currentField.id, e.target.files?.[0]?.name || '')}
                required={currentField.required}
                className="mt-3 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {currentIndex === fields.length - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2"
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
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            Next
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
