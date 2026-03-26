'use client'
import { FormField } from '@/types/form'

interface Props {
  field: FormField | null
  onUpdate: (field: FormField) => void
}

export function PropertiesPanel({ field, onUpdate }: Props) {
  if (!field) {
    return (
      <div className="w-72 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">Select a field to edit</p>
          <p className="text-xs text-slate-400 mt-1">Click on any field in the canvas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <h3 className="font-semibold text-slate-900">Field Properties</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={e => onUpdate({ ...field, label: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter label..."
          />
        </div>

        {(field.type === 'text' || field.type === 'email' || field.type === 'textarea') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Placeholder</label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={e => onUpdate({ ...field, placeholder: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter placeholder..."
            />
          </div>
        )}

        {(field.type === 'select' || field.type === 'radio') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Options (comma separated)</label>
            <textarea
              value={field.options?.join(', ') || ''}
              onChange={e =>
                onUpdate({
                  ...field,
                  options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
              placeholder="Option 1, Option 2, Option 3"
            />
          </div>
        )}

        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={field.required}
                onChange={e => onUpdate({ ...field, required: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-500 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform shadow"></div>
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Required field</span>
          </label>
        </div>
      </div>
    </div>
  )
}