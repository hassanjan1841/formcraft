'use client'
import { FormField } from '@/types/form'

interface Props {
  field: FormField | null
  onUpdate: (field: FormField) => void
}

export function PropertiesPanel({ field, onUpdate }: Props) {
  if (!field) {
    return (
      <div className="w-64 bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-400 text-center">Select a field to edit</p>
      </div>
    )
  }

  return (
    <div className="w-64 bg-gray-50 p-4 rounded-lg space-y-4">
      <h3 className="font-semibold">Field Properties</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={e => onUpdate({ ...field, label: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      {(field.type === 'text' || field.type === 'email' || field.type === 'textarea') && (
        <div>
          <label className="block text-sm font-medium mb-1">Placeholder</label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={e => onUpdate({ ...field, placeholder: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {(field.type === 'select' || field.type === 'radio') && (
        <div>
          <label className="block text-sm font-medium mb-1">Options (comma separated)</label>
          <textarea
            value={field.options?.join(', ') || ''}
            onChange={e =>
              onUpdate({
                ...field,
                options: e.target.value.split(',').map(s => s.trim())
              })
            }
            className="w-full p-2 border rounded h-20"
          />
        </div>
      )}

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={field.required}
            onChange={e => onUpdate({ ...field, required: e.target.checked })}
          />
          <span>Required</span>
        </label>
      </div>
    </div>
  )
}