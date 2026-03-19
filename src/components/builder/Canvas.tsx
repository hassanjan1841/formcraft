'use client'
import { FormField } from '@/types/form'

interface Props {
  fields: FormField[]
  onSelect: (id: string) => void
  selectedId: string | null
}

export function Canvas({ fields, onSelect, selectedId }: Props) {
  return (
    <div className="flex-1 bg-white p-8 rounded-lg shadow-sm min-h-[500px]">
      {fields.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          Click a field type to add it
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => (
            <div
              key={field.id}
              onClick={() => onSelect(field.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                selectedId === field.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <label className="block font-medium mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'text' && (
                <input type="text" placeholder={field.placeholder} className="w-full p-2 border rounded" disabled />
              )}
              {field.type === 'email' && (
                <input type="email" placeholder={field.placeholder} className="w-full p-2 border rounded" disabled />
              )}
              {field.type === 'textarea' && (
                <textarea placeholder={field.placeholder} className="w-full p-2 border rounded" disabled />
              )}
              {field.type === 'select' && (
                <select className="w-full p-2 border rounded" disabled>
                  <option>{field.options?.[0] || 'Select...'}</option>
                </select>
              )}
              {field.type === 'radio' && (
                <div className="space-y-1">
                  {field.options?.map((opt, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input type="radio" disabled /> {opt}
                    </label>
                  ))}
                </div>
              )}
              {field.type === 'checkbox' && (
                <label className="flex items-center gap-2">
                  <input type="checkbox" disabled /> {field.label}
                </label>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}