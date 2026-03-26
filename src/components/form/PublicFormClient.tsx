'use client'
import { FormField } from '@/types/form'
import { FormRenderer } from '@/components/form/FormRenderer'
import { QuestionView } from '@/components/form/QuestionView'
import { useState } from 'react'

interface Props {
  form: {
    id: string
    title: string
    schema: { fields: FormField[] }
  }
}

export function PublicFormClient({ form }: Props) {
  const [viewMode, setViewMode] = useState<'full' | 'one-question'>('full')
  const fields = form.schema.fields

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
          <button
            onClick={() => setViewMode(prev => prev === 'full' ? 'one-question' : 'full')}
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            {viewMode === 'full' ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
                One-by-one
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Full form
              </>
            )}
          </button>
        </div>

        {viewMode === 'one-question' ? (
          <QuestionView fields={fields} formId={form.id} />
        ) : (
          <FormRenderer fields={fields} formId={form.id} />
        )}
      </div>
    </div>
  )
}
