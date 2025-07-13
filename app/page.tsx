import { ModeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'
import {
  MoveRight,
} from 'lucide-react'
import Image from 'next/image'
import { NavigationMenuDemo } from '@/components/ui/navigation-menu'
import FAQSection from '@/components/ui/accordion'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight text-gray-800 dark:text-white flex gap-1 items-center">
            <Image src={'/opensource-connect-logo.png'} width={40} height={40} alt='Opensource connect'/>
          </Link>

          <nav>
            <NavigationMenuDemo />
          </nav>
          <nav className="flex items-center space-x-4">
            <ModeToggle />
            <Link
              href="/login"
              className="text-sm px-4 py-1.5 border border-gray-500 hover:bg-gray-100  rounded-md transition dark:hover:bg-muted/40"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative flex-1 w-full py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden text-center h-[100vh]">
          <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
            <div className="w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl scale-150" />
          </div>

          <h1 className='text-6xl font-extrabold'>Where Developers <span>Build</span> <br /> the Future Together</h1>
          <br />
          <span className='text-xl font-semibold mt-4'>
            CollabSpace connects developers with real-world projects. Discover open-source ideas, <br />
            join active teams, and turn your skills into impact — one contribution at a time.
          </span>
          <br /> <br />
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Join <strong className="text-blue-600 dark:text-blue-400">+1000</strong> developers looking for contributors
          </p>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-6">
            Loved by +100 developers
          </p>
          <button className='bg-blue-600 px-4 py-1.5 rounded-sm text-lg text-white flex justify-center items-center mx-auto gap-2 font-semibold'>
            Join the community now <MoveRight />
          </button>
      </section>

      <section className="py-24 bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 mb-6">
        Start Contributing in 4 Simple Steps
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Join our community and make your mark on open-source projects with ease.
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          title: '1. Create Your Profile',
          desc: 'Sign up and build your CollabSpace profile by linking your GitHub account and choosing your tech stack.',
          icon: (
            <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
          title: '2. Explore Projects',
          desc: 'Browse curated open-source projects based on your interests and skill level.',
          icon: (
            <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          bg: 'bg-green-50 dark:bg-green-900/20'
        },
        {
          title: '3. Request to Join',
          desc: 'Apply to contribute. Some projects onboard automatically, others may review your profile.',
          icon: (
            <svg className="w-8 h-8 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          ),
          bg: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
          title: '4. Start Coding',
          desc: 'Pick an issue, fork the repo, submit a pull request — and your open-source journey begins!',
          icon: (
            <svg className="w-8 h-8 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
          bg: 'bg-orange-50 dark:bg-orange-900/20'
        }
      ].map((step, idx) => (
        <div 
          key={idx} 
          className={`${step.bg} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-opacity-10 hover:border-gray-300 dark:hover:border-gray-600`}
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-md mb-6 mx-auto">
            {step.icon}
          </div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{step.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
    
    <div className="text-center mt-16">
      <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800">
        Get Started Now
      </button>
    </div>
  </div>
</section>

        <FAQSection />


      <footer className="w-full py-6 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} CollabSpace. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
