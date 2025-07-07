'use client'

import { AppSidebar } from "@/components/app-sidebar"
import Loading from "@/components/loading"

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
                {/* <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
                </div> */}
            </SidebarInset>
        </SidebarProvider>
  )
}
