"use client"

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import Loading from '@/components/loading'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/ui/site-header'
import { Icon } from '@iconify/react/dist/iconify.js'
import { User } from '@/interfaces'
import { api } from '@/config/api'
import { ApplicationSubmission } from '@/components/application-submission'

export default function SuggestedPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([])
  const [randomUsers, setRandomUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get(`/discovery/suggestedDevs`)
        if (response.status === 200) {
          setSuggestedUsers(response.data.suggestedUsers || [])
          setRandomUsers(response.data.randomUsers || [])
        }
      } catch {
        toast.error('An error occurred while searching')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  },[])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Suggested developers" />
        <div className="md:max-w-6xl px-4 py-8 space-y-10">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loading message="loading...please wait" />
            </div>
          ) : (
            <>
              {/* Suggested Developers Section */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Suggested developers based on your stack</h2>
                {suggestedUsers.length === 0 ? (
                  <p className="text-muted-foreground">No suggested developers found.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {suggestedUsers.map((user: User) => (
                      <div key={user._id} className="flex items-start gap-4 border p-4 rounded-md hover:shadow-md transition justify-between">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatarUrl} />
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Link href={`/user/${user.username}`} className="font-medium hover:underline">{user.name}</Link>
                            <Link className="text-sm text-muted-foreground hover:underline" href={`/user/${user.username}`}>@{user.username}</Link>
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
                        <div>
                          <ApplicationSubmission proposeCollaboration={true} toUser={user._id} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Random Developers Section */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Other developers you might like</h2>
                {randomUsers.length === 0 ? (
                  <p className="text-muted-foreground">No other developers found.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {randomUsers.map((user: User) => (
                      <div key={user._id} className="flex items-start gap-4 border p-4 rounded-md hover:shadow-md transition justify-between">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatarUrl} />
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Link href={`/user/${user.username}`} className="font-medium hover:underline">{user.name}</Link>
                            <Link className="text-sm text-muted-foreground hover:underline" href={`/user/${user.username}`}>@{user.username}</Link>
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
                        <div>
                          <ApplicationSubmission proposeCollaboration={true} toUser={user._id} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
