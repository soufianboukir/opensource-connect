'use client'

import { Activity, Archive, Clock, Link, Save, Send, Users } from "lucide-react"
import { Icon } from "@iconify/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const mockProject = {
  title: "AI Code Reviewer",
  description:
    " A modern real-time chat application features include user authentication, profile customization, real-time messaging, and user search functionality. Here you'll find fragments of my curiosity, experiments, and ambition, written in code, shaped by open source, and shared with intention.",
  githubUrl: "https://github.com/your-org/ai-code-reviewer",
  websiteUrl: "https://aicode.io",
  status: "in progress" as "active" | "archived" | "in progress",
  techStackNeeded: ["typescript", "nextjs", "openai", "tailwindcss", "mongodb", "nodejs"],
  tags: ["ai", "code-review", "opensource", "automation", "tools"],
  rolesNeeded: [{ role: "Frontend", count: 1 }, { role: "Backend", count: 2 }],
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
}

export function ProjectPreview() {
  const { status } = mockProject

  const statusIndicator = {
    "in progress": {
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
      description: "This project is currently in progress and being actively worked on. you can apply",
    },
    archived: {
      icon: <Archive className="w-4 h-4 text-gray-500" />,
      description: "This project has been archived and is no longer active. you cannot apply",
    },
    active: {
      icon: <Activity className="w-4 h-4 text-green-500" />,
      description: "This project is live and available for interaction or updates. you can apply",
    },
  }

  return (
    <div className="relative hover:bg-muted/10 duration-200 cursor-pointer hover:rounded-2xl border-b border-b-muted/80 p-6 transition-all hover:shadow-sm">
        <div className="flex justify-between">
            <div className="flex items-center gap-2">
                <Avatar className="w-[35px] h-[35px]">
                    <AvatarImage src="https://res.cloudinary.com/dzaqbvnt4/image/upload/v1751998624/user_profiles/xgm4vgqttgwjpgmd5ojx.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold">Soufian boukir</span>
                    <span className="font-semibold text-sm text-gray-400">@soufianboukir</span>
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <Tooltip>
                    <TooltipTrigger>
                        <div className="w-9 h-9 rounded-full border flex items-center justify-center bg-gray-100 dark:bg-muted/50">
                            <Send className="w-4 h-4 text-gray-500 dark:text-gray-200"/>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        Apply to this project
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="w-9 h-9 rounded-full border flex items-center justify-center bg-gray-100 dark:bg-muted/50">
                            <Save className="w-4 h-4 text-gray-500 dark:text-gray-200"/>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        Save this project
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <div className="w-9 h-9 rounded-full border flex items-center justify-center bg-gray-100 dark:bg-muted/50">
                            {statusIndicator[status].icon}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {statusIndicator[status].description}
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
        <div className="flex justify-between items-start mt-3">
            <div>
                <h2 className="text-2xl font-semibold text-foreground">{mockProject.title}</h2>
                {mockProject.githubUrl && (
                    <a
                    href={mockProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                    >
                    <Link className="w-4 h-4" />
                    {mockProject.githubUrl.replace(/^https?:\/\//, '')}
                    </a>
                )}
            </div>
        </div>

        <p className="text-muted-foreground mt-4 line-clamp-4">
            {mockProject.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
            {mockProject.techStackNeeded.map((tech) => (
                <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-muted/40 border"
                >
                    <Icon icon={`devicon:${tech.toLowerCase()}`} className="inline w-4 h-4 mr-1" />
                    {tech}
                </span>
            ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
            {mockProject.tags.map((tag, index) => (
                <span key={index} className="text-xs text-muted-foreground">#{tag}</span>
            ))}
        </div>

        <div className="mt-2 pt-4 flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {mockProject.rolesNeeded.reduce((acc, role) => acc + role.count, 0)} roles open
            </div>
            <span>Posted {formatRelativeTime(mockProject.createdAt)}</span>
        </div>
    </div>
  )
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}
