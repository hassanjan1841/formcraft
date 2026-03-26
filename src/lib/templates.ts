import { FormField } from '@/types/form'

export interface FormTemplate {
  name: string
  fields: FormField[]
}

const createId = () => Math.random().toString(36).substring(2, 11)

export const formTemplates: FormTemplate[] = [
  {
    name: 'Contact Form',
    fields: [
      { id: createId(), type: 'text', label: 'Name', required: true, placeholder: 'Enter your name' },
      { id: createId(), type: 'email', label: 'Email', required: true, placeholder: 'Enter your email' },
      { id: createId(), type: 'textarea', label: 'Message', required: true, placeholder: 'Enter your message' }
    ]
  },
  {
    name: 'Survey Form',
    fields: [
      { id: createId(), type: 'text', label: 'Name', required: true, placeholder: 'Enter your name' },
      { id: createId(), type: 'email', label: 'Email', required: true, placeholder: 'Enter your email' },
      { id: createId(), type: 'radio', label: 'Rating', required: true, options: ['1', '2', '3', '4', '5'] },
      { id: createId(), type: 'textarea', label: 'Comments', required: false, placeholder: 'Share your thoughts' }
    ]
  },
  {
    name: 'Event Registration',
    fields: [
      { id: createId(), type: 'text', label: 'Name', required: true, placeholder: 'Enter your name' },
      { id: createId(), type: 'email', label: 'Email', required: true, placeholder: 'Enter your email' },
      { id: createId(), type: 'number', label: 'Phone', required: false, placeholder: 'Enter your phone number' },
      { id: createId(), type: 'number', label: 'Number of Attendees', required: true, placeholder: '1' },
      { id: createId(), type: 'select', label: 'Dietary Preferences', required: false, options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Other'] }
    ]
  }
]