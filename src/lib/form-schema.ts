import { FormField, FieldType } from '@/types/form'

export function createField(type: FieldType): FormField {
  return {
    id: crypto.randomUUID(),
    type,
    label: getDefaultLabel(type),
    required: false,
    placeholder: type === 'text' || type === 'email' || type === 'textarea' ? 'Enter...' : undefined,
    options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
  }
}

function getDefaultLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: 'Text Field',
    email: 'Email',
    textarea: 'Message',
    select: 'Select Option',
    radio: 'Choose One',
    checkbox: 'I agree'
  }
  return labels[type]
}