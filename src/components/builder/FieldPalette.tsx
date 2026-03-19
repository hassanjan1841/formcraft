'use client'
import { FieldType } from '@/types/form'

const fieldTypes: { type: FieldType; icon: string; label: string }[] = [
  { type: 'text', icon: 'T', label: 'Text' },
  { type: 'email', icon: '@', label: 'Email' },
  { type: 'textarea', icon: '¶', label: 'Textarea' },
  { type: 'select', icon: '▼', label: 'Select' },
  { type: 'radio', icon: '○', label: 'Radio' },
  { type: 'checkbox', icon: '☑', label: 'Checkbox' }
]

interface Props {
  onAdd: (type: FieldType) => void
}

export function FieldPalette({ onAdd }: Props) {
  return (
    <div className="w-48 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-4">Add Field</h3>
      <div className="space-y-2">
        {fieldTypes.map(({ type, icon, label }) => (
          <button
            key={type}
            onClick={() => onAdd(type)}
            className="w-full flex items-center gap-3 p-2 bg-white rounded border hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <span className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center font-bold">
              {icon}
            </span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}