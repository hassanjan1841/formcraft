'use client'
import { useState } from 'react'
import { FieldType, FormField } from '@/types/form'
import { formTemplates } from '@/lib/templates'

const fieldTypes: { type: FieldType; icon: string; label: string; desc: string }[] = [
  { type: 'text', icon: 'M4 6h16M4 12h16M4 18h7', label: 'Text', desc: 'Short text input' },
  { type: 'email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', desc: 'Email address' },
  { type: 'textarea', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', label: 'Textarea', desc: 'Long text input' },
  { type: 'select', icon: 'M4 6h16M4 12h16M4 18h7', label: 'Select', desc: 'Dropdown choice' },
  { type: 'radio', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Radio', desc: 'Single choice' },
  { type: 'checkbox', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Checkbox', desc: 'Multiple choice' },
  { type: 'date', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Date', desc: 'Date picker' },
  { type: 'number', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', label: 'Number', desc: 'Numeric input' },
  { type: 'file', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', label: 'File', desc: 'File upload' }
]

interface Props {
  onAdd: (type: FieldType) => void
  onAddFields?: (fields: FormField[]) => void
  onReplaceFields?: (fields: FormField[]) => void
}

export function FieldPalette({ onAdd, onAddFields, onReplaceFields }: Props) {
  const [showTemplates, setShowTemplates] = useState(false)

  function handleTemplateSelect(templateIndex: number) {
    const templateFields = formTemplates[templateIndex].fields.map(f => ({
      ...f,
      id: crypto.randomUUID()
    }))
    if (onReplaceFields) {
      onReplaceFields(templateFields)
    } else if (onAddFields) {
      onAddFields(templateFields)
    }
    setShowTemplates(false)
  }

  return (
    <div className="w-56 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-slate-900">Add Field</h3>
        <p className="text-xs text-slate-500 mt-0.5">Select a field type to add</p>
      </div>
      <div className="p-3 space-y-2">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl hover:border-violet-400 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-violet-200 group-hover:to-indigo-200 transition-all">
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <span className="block font-medium text-slate-900 text-sm">Templates</span>
            <span className="text-xs text-slate-500">Start from pre-built</span>
          </div>
        </button>

        {showTemplates && (
          <div className="space-y-1.5 bg-slate-50 p-2 rounded-lg">
            {formTemplates.map((template, idx) => (
              <button
                key={idx}
                onClick={() => handleTemplateSelect(idx)}
                className="w-full text-left px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-all"
              >
                {template.name}
              </button>
            ))}
          </div>
        )}
        {fieldTypes.map(({ type, icon, label, desc }) => (
          <button
            key={type}
            onClick={() => onAdd(type)}
            className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-all">
              <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
            </div>
            <div>
              <span className="block font-medium text-slate-900 text-sm">{label}</span>
              <span className="text-xs text-slate-500">{desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}