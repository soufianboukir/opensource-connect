'use client'

import { AppSidebar } from "@/components/app-sidebar"
import Loading from "@/components/loading"
import { ProjectFilters } from "@/components/project-filters"
import { ProjectPreview } from "@/components/project-preview"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/ui/site-header"
import { useSession } from "next-auth/react"

export default function Page() {
    const {data: session, status} = useSession()

    if(status === 'loading') return <Loading message="Loading projects..."/>
    console.log(session);
    
  return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader title="Discovery" />
                <div className="flex p-4 gap-4">
                  <div className="md:w-[75%] w-[100%]">
                    <ProjectPreview />
                    <ProjectPreview />
                    <ProjectPreview />
                  </div>
                  <ProjectFilters />
                </div>

            </SidebarInset>
        </SidebarProvider>
  )
}
