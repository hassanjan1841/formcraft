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
  
  const { title, schema } = await req.json()
  const userId = session!.user!.id as string
  const form = await prisma.form.create({
    data: {
      userId,
      title: title || 'Untitled Form',
      schema: schema || { fields: [] }
    }
  })
  return NextResponse.json(form)
}