'use client'

interface StatsCardsProps {
  totalForms: number
  totalSubmissions: number
  publishedForms: number
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  gradient: string
  delay: number
}

function StatCard({ label, value, icon, gradient, delay }: StatCardProps) {
  return (
    <div
      className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300"
      style={{
        animation: `fadeInSlideUp 0.5s ease-out forwards`,
        animationDelay: `${delay}ms`,
        opacity: 0
      }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export function StatsCards({ totalForms, totalSubmissions, publishedForms }: StatsCardsProps) {
  const stats = [
    {
      label: 'Total Forms',
      value: totalForms,
      gradient: 'bg-gradient-to-br from-blue-100 to-purple-100',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      label: 'Total Submissions',
      value: totalSubmissions,
      gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Published',
      value: publishedForms,
      gradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <style>{`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} delay={i * 100} />
      ))}
    </div>
  )
}
