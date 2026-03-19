import { prisma } from '@/lib/prisma'
import { FormRenderer } from '@/components/form/FormRenderer'
import { notFound } from 'next/navigation'

export default async function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await prisma.form.findUnique({ where: { id } })
  
  if (!form || !form.published) {
    notFound()
  }
  
  const schema = form.schema as { fields: any[] }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">{form.title}</h1>
        <FormRenderer fields={schema.fields} formId={id} />
      </div>
    </div>
  )
}
