export type FieldType = 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'file'

export interface FormField {
  id: string
  type: FieldType
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
}

export interface FormSchema {
  fields: FormField[]
}

export interface Form {
  id: string
  title: string
  schema: FormSchema
  published: boolean
  createdAt: string
  updatedAt: string
}