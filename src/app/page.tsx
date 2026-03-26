import Link from 'next/link'
import { auth } from '@/lib/auth'
import { LogoutButton } from '@/components/LogoutButton'

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 animate-gradient" />
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, #cbd5e1 2px, transparent 0)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed" />

      <header className="relative px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600 animate-fade-in-up">FormCraft</h1>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-slate-700 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-white/50 transition">
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-700 hover:text-slate-900 font-medium px-3 py-2">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all font-medium">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </header>
      
      <main className="relative max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6 animate-fade-in-up animation-delay-100">
          Build Beautiful Forms<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">in Minutes</span>
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
          Create forms with drag-and-drop simplicity. Embed anywhere. No coding required.
        </p>
        <div className="animate-fade-in-up animation-delay-300">
          {isLoggedIn ? (
          <Link
            href="/dashboard/forms/new"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 hover:shadow-xl hover:shadow-green-500/25 transition-all hover:-translate-y-0.5"
          >
            Create New Form
          </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5"
            >
              Start Building for Free
            </Link>
          )}
        </div>
        
        <div className="mt-24 grid md:grid-cols-3 gap-6 text-left">
          {[
            { title: 'Click to Build', desc: 'Create forms visually with our intuitive builder. No coding needed.', icon: 'cursor' },
            { title: 'Embed Anywhere', desc: 'Add forms to any website with a simple iframe or link.', icon: 'code' },
            { title: 'Free to Start', desc: '3 forms, 100 submissions free. Upgrade when you need more.', icon: 'gift' }
          ].map((item, i) => (
            <div 
              key={item.title} 
              className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white relative overflow-hidden"
              style={{ animationDelay: `${(i + 4) * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon === 'cursor' ? "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" : item.icon === 'code' ? "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" : "M12 8v13m0-13V10a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4"} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trusted By Section */}
        <div className="mt-16 mb-24 animate-fade-in-up animation-delay-400">
          <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wider">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['Acme Corp', 'TechFlow', 'DataSync', 'CloudBase', 'NextGen'].map((company) => (
              <span key={company} className="text-lg font-semibold text-slate-700 hover:opacity-100 transition-opacity">{company}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}