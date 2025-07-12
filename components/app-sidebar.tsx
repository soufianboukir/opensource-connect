"use client"

import * as React from "react"
import {
  Bot,
  Command,
  Earth,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Send,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { getUnseenMssgs } from "@/services/communication"
import Image from "next/image"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Discovery",
      url: "/discovery",
      icon: Earth,
      isActive: true,
    },
    {
      title: "Panel",
      url: "/panel",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "My applications",
      url: "/apps",
      icon: Bot,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: Mail,
    },
    {
      title: "Saved projects",
      url: "/saved",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const { data: session, status } = useSession()
  const [loading,setLoading] = React.useState(false)
  const [unseenConvs,setUnseenConvs] = React.useState(0)

  const fetchUnseenMssgs = async () =>{
    try{
      setLoading(true)
      const res = await getUnseenMssgs()
      if(res.status === 200){
        setUnseenConvs(res.data.unseenConversations)
      }
    }catch{
      
    }finally{
      setLoading(false)
    }
  }

  React.useEffect(() =>{
    fetchUnseenMssgs()
  },[])
  if(status === 'loading') return null

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="">
                    <Image src={'/opensource-connect-logo.png'} width={30} height={30} alt="Platform logo"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Opensource connect</span>
                  <span className="truncate text-xs">share,shape,learn faster</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} unseenConvs={unseenConvs}/>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
