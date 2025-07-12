import { ModeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-white">
            CollabSpace
          </Link>
          <nav className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 w-full py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
            Code Together. Build Faster.
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Collaborate on open-source projects with developers around the world.
            Share knowledge. Ship faster. Learn more.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            <Link 
              href="/signup" 
              className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition shadow"
            >
              Get Started
            </Link>
            <Link 
              href="#learn-more" 
              className="px-6 py-3 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Learn More
            </Link>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            🚀 Join <span className="font-semibold text-blue-600 dark:text-blue-400">1,000+</span> developers collaborating daily on real projects.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} CollabSpace. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
