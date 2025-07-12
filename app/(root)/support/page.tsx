'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/ui/site-header'

export default function ContactPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Support" />
        <section className="max-w-3xl mx-auto p-6">
            <p className="text-lg leading-relaxed">
                If you encounter any issues, have questions, or need assistance regarding any of my projects, feel free to reach out. I{"'"}m always open to supporting users, collaborators, or anyone interested in my work.
                <br /> <br />
                Whether you need technical guidance, found a bug, have feature suggestions, or simply want to connect professionally, don{"'"}t hesitate to contact me.
                <br /> <br />
                The best way to reach me is via email at{' '}
                <a
                href="mailto:soufianeboukir0@gmail.com"
                className="text-blue-600 hover:underline dark:text-blue-400"
                >
                    soufianeboukir0@gmail.com
                </a>
                , and I do my best to respond promptly and helpfully. Your feedback and inquiries are always welcome and appreciated.
            </p>
            </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
