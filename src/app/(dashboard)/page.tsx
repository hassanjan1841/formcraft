import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  const forms = await prisma.form.findMany({
    where: { userId: session!.user!.id },
    include: { _count: { select: { submissions: true } } },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Your Forms</h2>
        <Link
          href="/forms/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No forms yet. Create your first form!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {forms.map(form => (
            <Link
              key={form.id}
              href={`/forms/${form.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold">{form.title}</h3>
              <p className="text-sm text-gray-500">
                {form._count.submissions} submissions
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(form.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}