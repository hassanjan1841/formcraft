import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FormCard } from '@/components/FormCard'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return <div>Loading...</div>
  }

  const forms = await prisma.form.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { submissions: true } } },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Forms</h2>
        <Link
          href="/dashboard/forms/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p>No forms yet. Create your first form!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {forms.map(form => (
            <FormCard
              key={form.id}
              id={form.id}
              title={form.title}
              submissions={form._count.submissions}
              updatedAt={form.updatedAt.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  )
}
