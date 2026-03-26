import { prisma } from '@/lib/prisma'
import { PublicFormClient } from '@/components/form/PublicFormClient'
import { notFound } from 'next/navigation'
import { FormField } from '@/types/form'

export default async function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await prisma.form.findUnique({ where: { id } })
  
  if (!form || !form.published) {
    notFound()
  }
  
  const schema = form.schema as unknown as { fields: FormField[] }
  
  return <PublicFormClient form={{ id: form.id, title: form.title, schema }} />
}
