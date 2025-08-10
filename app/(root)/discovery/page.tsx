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
import { api } from '@/config/api'

export interface ProjectFiltersType {
  status: string
  techStack: string[]
  roles: string[]
  tags: string[]
  sort: 'newest' | 'oldest' | string
}

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalProjects, setTotalProjects] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<ProjectFiltersType>({
    status: '',
    techStack: [],
    roles: [],
    tags: [],
    sort: 'newest',
  })

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()

        if (filters.status) params.append('status', filters.status)
        filters.techStack.forEach(t => params.append('techStack', t))
        filters.roles.forEach(r => params.append('roles', r))
        filters.tags.forEach(t => params.append('tags', t))
        params.append('page', page.toString())
        if (filters.sort) params.append('sort', filters.sort)

        const response = await api.get(`/discovery?${params.toString()}`)
        setProjects(prev =>
          page === 1 ? response.data.projects : [...prev, ...response.data.projects]
        )
        setTotalProjects(response.data.total)
      } catch (err) {
        console.error('Failed to fetch projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [filters, page])

  useEffect(() => {
    const handleScroll = () => {
      const bottomReached =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300

      if (bottomReached && !loading && projects.length < totalProjects) {
        setPage(prev => prev + 1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, projects.length, totalProjects])

  const handleFilterChange = (newFilters: ProjectFiltersType) => {
    const isDifferent =
      newFilters.status !== filters.status ||
      newFilters.sort !== filters.sort ||
      JSON.stringify(newFilters.techStack) !== JSON.stringify(filters.techStack) ||
      JSON.stringify(newFilters.roles) !== JSON.stringify(filters.roles) ||
      JSON.stringify(newFilters.tags) !== JSON.stringify(filters.tags)

    if (isDifferent) {
      setProjects([])
      setPage(1)
      setFilters(newFilters)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Discovery" />
        <div className="flex flex-col-reverse xl:flex-row p-4 gap-4">
          <div className="xl:w-[75%] w-[100%] space-y-4">
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectPreview key={project._id} projectData={project} />
              ))
            ) : null}
            {!loading && projects.length === 0 && (
              <EmptyState
                message="No projects found"
                description="No projects match the current filters. Try adjusting your criteria to see available projects"
              />
            )}
            {loading && page === 1 && <Loading message="Loading, please wait..." />}
            {loading && page > 1 && (
              <div className="text-center text-muted-foreground text-sm py-4">
                Loading more projects...
              </div>
            )}
          </div>
          <ProjectFilters onFilterChange={handleFilterChange} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
