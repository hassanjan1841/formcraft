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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">{form.title}</h1>
        <FormRenderer fields={schema.fields} formId={id} />
      </div>
    </div>
  )
}