import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const forms = await prisma.form.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' }
  })
  return NextResponse.json(forms)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  const { action, formId, title, schema } = body
  const userId = session!.user!.id as string

  if (action === 'duplicate' && formId) {
    const original = await prisma.form.findUnique({ where: { id: formId } })
    if (!original || original.userId !== userId) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }
    const copy = await prisma.form.create({
      data: {
        userId,
        title: `${original.title} - Copy`,
        schema: original.schema as unknown as never
      }
    })
    return NextResponse.json(copy)
  }

  const form = await prisma.form.create({
    data: {
      userId,
      title: title || 'Untitled Form',
      schema: schema || { fields: [] }
    }
  })
  return NextResponse.json(form)
}