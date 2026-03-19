import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { id } = await params
  const form = await prisma.form.findUnique({ where: { id } })
  if (!form || form.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  const submissions = await prisma.submission.findMany({
    where: { formId: id },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(submissions)
}
