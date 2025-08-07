'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { DeleteProject } from "@/components/delete-project"
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
  const [deleteProject,setDeleteProject] = useState({
    open: false,
    projectId: ''
  })
  const [updateProject,setUpdateProject] = useState<{
    open: boolean;
    projectData: Project;
  }>({
    open: false,
    projectData: {
      title: '',
      description: '',
      githubUrl: '',
      websiteUrl: '', 
      status: 'active',
      techStackNeeded: [],
      rolesNeeded: [],
      tags: []
    },
  })


  const fetchUserProjects = async () =>{
    setIsLoading(true)
    try{
      const response = await getProjects();      
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

  const onAdded = async (projectData: Project) => {
    setProjects(prev => [projectData, ...prev])
  }
  
  const onUpdate = (projectData: Project) =>{
    const newProjects = projects.map((project) => project._id === projectData._id ? projectData : project);
    setProjects(newProjects);
  }

  const onDelete = (projectId: string) =>{
    const newProjects = projects.filter((project) => project._id !== projectId);
    setProjects(newProjects);
  }


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title={'Panel'}/>
        <div className="grid md:grid-cols-1 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-4 gap-4">
          {
            !isLoading && projects && projects.length ? (
              projects.map((project,index) => (
                <ProjectCard key={index} projectData={project} onOpenDelete={setDeleteProject} onOpenUpdate={setUpdateProject}/>
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
            <EmptyState message="No projects was found" description="Get started by creating your first project" action={<ProjectForm onAdded={onAdded}/>}/>
          )
        }
        {
          deleteProject.open && <DeleteProject projectId={deleteProject.projectId} open={deleteProject.open} onOpenChange={setDeleteProject} onDelete={onDelete}/>
        }
        {
          updateProject.open && <ProjectForm projectData={updateProject.projectData} open={updateProject.open} onOpenChange={setUpdateProject} onUpdate={onUpdate}/>
        }
      </SidebarInset>
    </SidebarProvider>
  )
}
