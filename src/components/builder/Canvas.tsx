'use client'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FormField } from '@/types/form'

interface Props {
  fields: FormField[]
  onSelect: (id: string) => void
  selectedId: string | null
  onReorder: (fields: FormField[]) => void
}

const fieldIcons: Record<string, string> = {
  text: 'M4 6h16M4 12h16M4 18h7',
  email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  textarea: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  select: 'M4 6h16M4 12h16M4 18h7',
  radio: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  checkbox: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
}

interface SortableItemProps {
  field: FormField
  isSelected: boolean
  onSelect: (id: string) => void
}

function SortableField({ field, isSelected, onSelect }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(field.id)}
      className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50/50 shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md bg-white'
      } ${isDragging ? 'shadow-xl ring-2 ring-blue-300' : ''}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isSelected ? 'bg-blue-100' : 'bg-slate-100'
        }`}>
          <svg className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={fieldIcons[field.type] || fieldIcons.text} />
          </svg>
        </div>
        <label className="font-semibold text-slate-900">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {field.type === 'text' && (
        <input type="text" placeholder={field.placeholder} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed" disabled />
      )}
      {field.type === 'email' && (
        <input type="email" placeholder={field.placeholder} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed" disabled />
      )}
      {field.type === 'textarea' && (
        <textarea placeholder={field.placeholder} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed" disabled />
      )}
      {field.type === 'select' && (
        <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed" disabled>
          <option>{field.options?.[0] || 'Select...'}</option>
        </select>
      )}
      {field.type === 'radio' && (
        <div className="space-y-2 pl-11">
          {field.options?.map((opt, i) => (
            <label key={i} className="flex items-center gap-2 text-slate-600">
              <input type="radio" disabled className="text-blue-600" /> {opt}
            </label>
          ))}
        </div>
      )}
      {field.type === 'checkbox' && (
        <div className="pl-11">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" disabled className="text-blue-600 rounded" /> {field.label}
          </label>
        </div>
      )}
    </div>
  )
}

export function Canvas({ fields, onSelect, selectedId, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = fields.findIndex((f) => f.id === active.id)
    const newIndex = fields.findIndex((f) => f.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(arrayMove(fields, oldIndex, newIndex))
    }
  }

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px] overflow-hidden">
      {fields.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-lg font-medium">Click a field type to add it</p>
          <p className="text-sm mt-1">Start building your form by selecting from the sidebar</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-6 space-y-4">
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  isSelected={selectedId === field.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
