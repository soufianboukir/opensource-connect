
import { ModeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'
import {
  CheckCircle2,
  MoveRight,
  Send,
  UserCircle,
} from 'lucide-react'
import Image from 'next/image'
import { projects } from '@/constants'
import FAQSection from '@/components/ui/accordion'

export default function HomePage() {

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight text-gray-800 dark:text-white flex gap-1 items-center">
            <Image src={'/opensource-connect-logo.png'} width={40} height={40} alt='Opensource connect'/>
          </Link>

          <nav className='flex gap-10'>
            <Link href={'/'} className='text-lg font-semibold hover:text-blue-500 duration-200'>Home</Link>
            <Link href={'/'} className='text-lg font-semibold hover:text-blue-500 duration-200'>How it works?</Link>
            <Link href={'/'} className='text-lg font-semibold hover:text-blue-500 duration-200'>Faqs</Link>
          </nav>
          <nav className="flex items-center space-x-4">
            <ModeToggle />
            <Link
              href="/login"
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative flex-1 w-full py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-muted/20 dark:to-muted/50 overflow-hidden text-center h-[100vh]">
          <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
            <div className="w-[600px] h-[600px] bg-blue-300/20 dark:bg-muted/10 rounded-full blur-3xl scale-150" />
          </div>

          <h1 className='lg:text-6xl text-4xl font-extrabold'>Where Developers <span>Build</span> <br /> the Future Together</h1>
          <br />
          <span className='text-xl font-semibold mt-4'>
            Opensource-connect connects developers with real-world projects. <br />
             Discover open-source ideas, 
            join active teams, and turn your skills into impact
            <br /> one contribution at a time.
          </span>
          <br /> <br />
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Join <strong className="text-blue-600 dark:text-blue-400">+1000</strong> developers looking for contributors
          </p>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-6">
            Loved by +100 developers
          </p>
          


          <div className='grid md:grid-cols-3 grid-cols-2 lg:grid-cols-5 w-[90%] md:w-[70%] mx-auto gap-2 flex-wrap mt-8 text-left'>
            {projects.map((project, i) => (
              <div key={i} className="rounded-xl border dark:border-gray-700 p-6 bg-white dark:bg-muted/20 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Image
                  width={40}
                  height={40}
                    src={project.avatar}
                    alt={project.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">
                    @{project.username}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{project.description}</p>
              </div>
            ))}
          </div>
          <button >
            <Link href={'/login'} className='bg-blue-600 px-4 py-1.5 rounded-sm text-lg text-white flex justify-center items-center mx-auto gap-2 font-semibold mt-6'>
            Join the community now <MoveRight />
            </Link>
          </button>
      </section>

      <section className="mt-12 px-4 md:px-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">
          How It Works
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700 flex flex-col items-start">
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 p-3 rounded-full mb-4">
              <UserCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Set Up Your Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create a developer profile with your skills, GitHub link, and interests. This helps project maintainers match you to the right tasks and teams.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700 flex flex-col items-start">
            <div className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 p-3 rounded-full mb-4">
              <Send className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Apply to Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Browse open-source projects and send applications to the ones that match your goals. You can filter by tech stack, activity, or project type.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700 flex flex-col items-start">
            <div className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 p-3 rounded-full mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Get Accepted or Rejected
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Project maintainers will review your application and either accept or reject it. If accepted, you{"'"}ll be onboarded to the team and start contributing immediately.
            </p>
          </div>
        </div>
      </section>

    <FAQSection />
    

      <footer className="w-full py-6 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className='text-center flex gap-4 justify-center'>
          <Link className='hover:underline' href={'/'}>Home</Link>
          <Link className='hover:underline' href={'/terms-of-service'}>Terms of service</Link>
          <Link className='hover:underline' href={'/privacy-policy'}>Privacy policy</Link>
          <Link className='hover:underline' href={'/support'}>Support</Link>
        </div>
        <br />
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Opensource-connect. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
