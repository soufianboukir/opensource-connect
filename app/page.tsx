'use client'
import { ModeToggle } from '@/components/ui/theme-toggle'
import { Link as LinkScroll } from 'react-scroll'
import {
  MoveRight,
} from 'lucide-react'
import Image from 'next/image'
import { projects } from '@/constants'
import FAQSection from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { HoverEffect } from '@/components/ui/card-hover-effect'

const steps = [
  {
    title: "Set Up Your Profile",
    description:
      "Create a developer profile with your skills, GitHub, and interests. Project maintainers use this to match you to tasks and teams.",
  },
  {
    title: "Post a Project or Apply to One",
    description:
      "Browse open-source projects or post your own. Apply to ones matching your goals, or start something and invite contributors.",
  },
  {
    title: "List Required Roles",
    description:
      "When posting a project, define the roles you're looking for—like frontend, backend, documentation, or testing—to attract the right contributors.",
  },
  {
    title: "Manage Applications",
    description:
      "View contributor applications in one place. Accept the ones that fit your needs and message others for clarification if needed.",
  },
  {
    title: "Get Accepted or Rejected",
    description:
      "After you apply, maintainers will review your profile and decide. If accepted, you'll be onboarded and can begin contributing right away.",
  },
  {
    title: "Collaborate & Build",
    description:
      "Work with your team using tools like GitHub issues, pull requests, and project boards. Build something meaningful together.",
  },
];

export default function HomePage() {

  const { data: session, status } = useSession()

  if(status === 'loading') return null

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight text-gray-800 dark:text-white flex gap-1 items-center">
            <Image src={'/opensource-connect-logo.png'} width={40} height={40} alt='Opensource connect'/>
          </Link>

          <nav className='hidden gap-10 md:flex'>
            <LinkScroll to={'home'} smooth duration={500} className='text-lg font-semibold hover:text-blue-500 duration-200 cursor-pointer'>Home</LinkScroll>
            <LinkScroll to={'how'} smooth duration={500} className='text-lg font-semibold hover:text-blue-500 duration-200 cursor-pointer'>How it works?</LinkScroll>
            <LinkScroll to={'faqs'} smooth duration={500} className='text-lg font-semibold hover:text-blue-500 duration-200 cursor-pointer'>Faqs</LinkScroll>
          </nav>
          <nav className="flex items-center space-x-4">
            <ModeToggle />
            {
              session?.user ?
              <Link href={`/user/${session.user.username}`}>
                <Avatar className="h-10 w-10 shadow-lg object-cover">
                <AvatarImage
                  src={session.user.avatarUrl || ""}
                  alt={session.user.name || "User Avatar"}
                  className='rounded-full'
                />
                <AvatarFallback className="text-xl font-semibold bg-muted text-muted-foreground">
                  {session.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              </Link>
              
              :
              <Link
                href="/login"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-md font-semibold"
              >
                Login
              </Link>
            }
          </nav>
        </div>
      </header>
      <BackgroundBeamsWithCollision>

      <section className="relative flex-1 w-full py-20 px-6 dark:from-muted/20 dark:to-muted/50 overflow-hidden text-center" id='home'>

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
            Loved by developers around the world
          </p>
          

          <HoverEffect items={projects} />

          <button >
            <Link href={'/discovery'} className='bg-blue-600 px-4 py-1.5 rounded-sm text-lg text-white flex justify-center items-center mx-auto gap-2 font-semibold mt-6'>
            Start exploring <MoveRight />
            </Link>
          </button>
      </section>
      </BackgroundBeamsWithCollision>
      <div className='bg-gradient-to-b from-neutral-200 to-white dark:from-neutral-900 dark:to-neutral-950'>
        <section className="mt-12 px-4 md:px-8 max-w-6xl mx-auto" id="how">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-14 text-center">
            How It Works
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className=" p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {index + 1}. {step.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>



      <FAQSection />
      </div>
            
    <div className="fixed bottom-4 left-4 px-4 py-2 bg-white dark:bg-zinc-900 border border-blue-500 shadow-lg animate-fade-in font-semibold rounded-full z-10">
      <a className="text-sm text-gray-700 dark:text-gray-300" href='https://soufianboukir.com' target='_blank'>
        Built with ❤️ by <span className="text-blue-600 font-semibold">Soufian</span>
      </a>
    </div>


      <footer className="w-full py-6 px-6 border-t border-black/10 dark:border-white/10 dark:bg-muted/30">
        <div className='text-center flex md:flex-row flex-col gap-4 justify-center text-black/80 dark:text-white/80 text-sm'>
          <Link className='hover:underline' href={'/'}>Home</Link>
          <Link className='hover:underline' href={'https://soufianboukir.com'} target='_blank'>Developer</Link>
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
