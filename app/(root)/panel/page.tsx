'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { ProjectCard } from "@/components/project-card"
// import ProjectCard from "@/components/project-card"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/ui/site-header"

export default function Page() {
  const projectData = {
    "id": "proj_abc123",
    "title": "API Hub Platform",
    "description": "A centralized platform for discovering, testing, and managing APIs with built-in documentation and collaboration tools.",
    "url": "https://github.com/soufianboukir/api-hub",
    "status": "in progress",
    "technologies": [
      "nextjs",
      "typescript",
      "nodejs",
      "postgresql",
      "tailwindcss",
      "docker"
    ],
    "rolesNeeded": [
      {
        "role": "Frontend Developer",
        "count": 2
      },
      {
        "role": "Backend Developer",
        "count": 1
      },
      {
        "role": "UI/UX Designer",
        "count": 1
      }
    ],
    "createdAt": "2023-11-15T09:30:00Z",
    "updatedAt": "2023-12-05T14:45:00Z",
    "owner": {
      "id": "user_123",
      "name": "Soufian Boukir",
      "avatar": "https://github.com/soufianboukir.png"
    },
    "stats": {
      "contributors": 8,
      "stars": 24,
      "forks": 5
    }
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title={'Panel'}/>
        <div className="grid grid-cols-3 mt-6 px-5">
          <ProjectCard projectData={projectData}
          />
        </div>
       

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
