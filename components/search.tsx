"use client"

import { search } from '@/services/search'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ProjectPreview } from '@/components/project-preview'
import Loading from '@/components/loading'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/ui/site-header'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Project, User } from '@/interfaces'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const [loading, setLoading] = useState<boolean>(true)
  const [results, setResults] = useState({ users: [], projects: [] })

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await search(query)
        if (response.status === 200) {
          setResults(response.data)
        }
      } catch {
        toast.error('An error occurred while searching')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query])

  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <SiteHeader title="Search results" />
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
                <h1 className="text-2xl font-semibold">Search Results for: &quot;<span className="text-primary">{query}</span>&quot;</h1>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loading message='Searching...please wait'/>
                    </div>
                ) : (
                    <>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Developers</h2>
                        {results.users.length === 0 ? (
                        <p className="text-muted-foreground">No users found.</p>
                        ) : (
                        <div className="grid gap-4">
                            {results.users.map((user: User) => (
                            <Link key={user._id} href={`/user/${user.username}`} className="flex items-start gap-4 border p-4 rounded-md hover:shadow-md transition">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{user.name}</p>
                                    <span className="text-sm text-muted-foreground">@{user.username}</span>
                                    {user.openToWork && (
                                    <Badge variant="secondary">Open to Work</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{user.headLine || 'No headline provided.'}</p>
                                <div className="flex gap-2 flex-wrap mt-1">
                                    {user.techStack?.map((tech: string) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-muted/40 border"
                                        >
                                            <Icon icon={`devicon:${tech.toLowerCase()}`} className="inline w-4 h-4 mr-1" />
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                </div>
                            </Link>
                            ))}
                        </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mt-8 mb-4">Projects</h2>
                        {results.projects.length === 0 ? (
                        <p className="text-muted-foreground">No projects found.</p>
                        ) : (
                        <div className="grid gap-4">
                            {results.projects.map((project: Project) => (
                            <ProjectPreview key={project._id} projectData={project}/>
                            ))}
                        </div>
                        )}
                    </div>
                    </>
                )}
                </div>
        </SidebarInset>
    </SidebarProvider>
  )
}
