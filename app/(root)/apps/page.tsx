'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Application } from '@/interfaces'
import Loading from '@/components/loading'
import { ApplicationCard } from '@/components/application-card'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/ui/site-header'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SquareArrowOutUpRight } from 'lucide-react'

export default function ApplicationsPage() {
  const [incoming, setIncoming] = useState<Application[]>([])
  const [outgoing, setOutgoing] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomingRes, outgoingRes] = await Promise.all([
          axios.get('/api/application/incoming'),
          axios.get('/api/application/outgoing'),
        ])
        setIncoming(incomingRes.data.applications)
        setOutgoing(outgoingRes.data.applications)
      } catch (err) {
        console.error('Failed to load applications:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Your outgoing/incoming applications" />
          {
            loading && (incoming.length === 0 || outgoing.length === 0) && <Loading message='Loading applications...'/>
          }
          {
            !loading && (incoming.length === 0 && outgoing.length === 0) && <EmptyState message='No applications found' 
            description='Try to apply to projects, or propose collaboration to developers' 
            action={<Button className='bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 text-white'>
              <Link href={'/discovery'} className='flex gap-3 items-center text-white'>Explore projects <SquareArrowOutUpRight className='w-4 h-4'/></Link>
            </Button>}/>
          }
          {
            !loading && (incoming.length !== 0 || outgoing.length !== 0) && (
                <div className="w-[100%] space-y-4">
                    <div className="p-6">
                            <Tabs defaultValue="incoming">
                                <TabsList>
                                    <TabsTrigger value="incoming">Incoming</TabsTrigger>
                                    <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
                                </TabsList>

                                <TabsContent value="incoming">
                                    {incoming.length === 0 ? (
                                        <EmptyState message='No icoming applications' description='Try to post projects to get applications'/>
                                    ) : (
                                        <div className="grid md:grid-cols-1 3xl:grid-cols-4 grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-3">
                                            {incoming.map(app => (
                                                <ApplicationCard key={app._id} data={app} direction="incoming" />
                                            ))}
                                        </div>

                                    )}
                                </TabsContent>

                                <TabsContent value="outgoing">
                                    {outgoing.length === 0 ? (
                                        <EmptyState message='No outgoing applications' description='Try to apply to projects or propose a collaboration to developers'/>
                                    ) : (
                                        <div className="grid md:grid-cols-1 3xl:grid-cols-4 grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-3">
                                            {outgoing.map(app => (
                                                <ApplicationCard key={app._id} data={app} direction="outgoing" />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
            )
          }
      </SidebarInset>
    </SidebarProvider>
    
  )
}
