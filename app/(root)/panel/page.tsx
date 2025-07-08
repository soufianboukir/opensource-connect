'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { EmptyState } from "@/components/empty-state"
import Loading from "@/components/loading"
import { ProjectCard } from "@/components/project-card"
import { ProjectForm } from "@/components/project-form"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/ui/site-header"
import { Project } from "@/interfaces"
import { getProjects } from "@/services/project"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Page() {
  const [isLoading,setIsLoading] = useState<boolean>(true);
  const [projects,setProjects] = useState<Project[]>([]);
  
  const fetchUserProjects = async () =>{
    setIsLoading(true)
    try{
      const response = await getProjects();
      console.log(response);
      
      if(response.status === 200){
        setProjects(response.data)
      }
    }catch{
      toast.error('An error occured, please try again')
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() =>{
    fetchUserProjects()
  },[])


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title={'Panel'}/>
        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 p-4 gap-4">
          {
            !isLoading && projects && projects.length ? (
              projects.map((project,index) => (
                <ProjectCard key={index} projectData={project} />
              ))
            ) : null
          }
        </div>
        {
          isLoading && (
              <Loading message="Loading your projects..."/>
          )
        }
        {
          !isLoading && projects.length === 0 && (
            <EmptyState message="No projects was found" description="Get started by creating your first project" action={<ProjectForm />}/>
          )
        }
      </SidebarInset>
    </SidebarProvider>
  )
}
