import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await prisma.form.findUnique({ where: { id } })
  
  if (!form || !form.published) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  }
  
  const { data } = await req.json()
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  
  await prisma.submission.create({
      data: {
        formId: id,
        data,
        ipAddress: ip
      }
  })
  
  return NextResponse.json({ success: true })
}
