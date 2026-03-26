import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FormCard } from '@/components/FormCard'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { PageLoader } from '@/components/ui/LoadingSpinner'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return <PageLoader />
  }

  const forms = await prisma.form.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { submissions: true } } },
    orderBy: { updatedAt: 'desc' }
  })

  const totalSubmissions = forms.reduce((sum, form) => sum + form._count.submissions, 0)
  const publishedForms = forms.filter(form => form.published).length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Your Forms</h2>
          <p className="text-slate-500 mt-1">Manage and track your form submissions</p>
        </div>
        <Link
          href="/dashboard/forms/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all font-medium"
        >
          + Create Form
        </Link>
      </div>

      <StatsCards
        totalForms={forms.length}
        totalSubmissions={totalSubmissions}
        publishedForms={publishedForms}
      />

      {forms.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No forms yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Create your first form to start collecting responses from your audience.</p>
          <Link
            href="/dashboard/forms/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Form
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form, i) => (
            <div 
              key={form.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <FormCard
                id={form.id}
                title={form.title}
                submissions={form._count.submissions}
                updatedAt={form.updatedAt.toISOString()}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}