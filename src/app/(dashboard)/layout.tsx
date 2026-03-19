import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">FormCraft</Link>
          <div className="flex gap-4 items-center">
            <Link href="/" className="text-gray-700">Dashboard</Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-red-600 hover:text-red-700 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
    </div>
  )
}