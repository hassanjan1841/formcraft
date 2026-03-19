import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { id } = await params
  const form = await prisma.form.findUnique({
    where: { id },
    include: { _count: { select: { submissions: true } } }
  })
  if (!form || form.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({
    ...form,
    submissionsCount: form._count.submissions
  })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { id } = await params
  const { title, schema, published } = await req.json()
  const form = await prisma.form.updateMany({
    where: { id, userId: session.user.id },
    data: { title, schema, published }
  })
  return NextResponse.json(form)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { id } = await params
  await prisma.form.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ success: true })
}