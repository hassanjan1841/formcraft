import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600">FormCraft</h1>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
          <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Get Started Free
          </Link>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Build Beautiful Forms<br />in Minutes
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create forms with drag-and-drop simplicity. Embed anywhere. No coding required.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-blue-600 text-white text-lg px-8 py-4 rounded-lg hover:bg-blue-700"
        >
          Start Building for Free
        </Link>
        
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">Click to Build</h3>
            <p className="text-gray-600">Create forms visually with our intuitive builder. No coding needed.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">Embed Anywhere</h3>
            <p className="text-gray-600">Add forms to any website with a simple iframe or link.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold mb-2">Free to Start</h3>
            <p className="text-gray-600">3 forms, 100 submissions free. Upgrade when you need more.</p>
          </div>
        </div>
      </main>
    </div>
  )
}