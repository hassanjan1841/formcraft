import { FormField, FieldType } from '@/types/form'

export function createField(type: FieldType): FormField {
  return {
    id: crypto.randomUUID(),
    type,
    label: getDefaultLabel(type),
    required: false,
    placeholder: type === 'text' || type === 'email' || type === 'textarea' ? 'Enter...' : type === 'number' ? 'Enter number' : type === 'file' ? 'Upload file' : undefined,
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
    checkbox: 'I agree',
    date: 'Select Date',
    number: 'Number Field',
    file: 'Upload File'
  }
  return labels[type]
}