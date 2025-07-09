'use client'

import { useEffect, useState } from 'react'

import { AppSidebar } from "@/components/app-sidebar"
import Loading from "@/components/loading"
import { ProjectFilters } from "@/components/project-filters"
import { ProjectPreview } from "@/components/project-preview"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/ui/site-header"

import { Project } from '@/interfaces'
import { EmptyState } from '@/components/empty-state'
import { getSavedProjects } from '@/services/project'


export default function Page() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState({
        status: '',
        techStack: [] as string[],
        roles: [] as string[],
        tags: [] as string[],
        sort: 'newest',
    })

    useEffect(() => {
        const fetchSavedProjects = async () => {
        setLoading(true)
            try {
                const response = await getSavedProjects();
                if(response.status === 200){
                    setProjects(response.data.projects);
                }
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchSavedProjects()
    }, [filters])

    const handleUnSave = (projectId: string) =>{
        const newProjects = projects.filter((project) => project._id !== projectId)
        setProjects(newProjects);
    }

    
    const handleFilterChange = (newFilters: any) => {
        const isDifferent =
        newFilters.status !== filters.status ||
        newFilters.sort !== filters.sort ||
        JSON.stringify(newFilters.techStack) !== JSON.stringify(filters.techStack) ||
        JSON.stringify(newFilters.roles) !== JSON.stringify(filters.roles) ||
        JSON.stringify(newFilters.tags) !== JSON.stringify(filters.tags)
    
        if (isDifferent) {
            setProjects([])
            setFilters(newFilters)
        }
    }
  
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader title="Saved projects" />
                <div className="flex flex-col-reverse md:flex-row p-4 gap-4">
                    <div className="md:w-[75%] w-[100%] space-y-4">
                        {projects.length > 0 ? (
                            projects.map(project => (
                                <ProjectPreview key={project._id} projectData={project} handleUnsave={handleUnSave}/>
                            ))
                            ) : null}
                        {
                            loading && (
                                <Loading message="Loading your saved projects..."/>
                            )
                        }
                        {
                            !loading && projects.length === 0 && (
                                <EmptyState message="No projects was found" description="Get started by saving your first project" />
                            )
                        }
                    </div>
                    <ProjectFilters onFilterChange={handleFilterChange} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
