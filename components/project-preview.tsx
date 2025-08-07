'use client'

import { Users } from "lucide-react"
import { Icon } from "@iconify/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Project } from "@/interfaces"
import Link from "next/link"
import { Link as LucideLink } from 'lucide-react'
import { ProjectActions } from "./apply-save-status"

export function ProjectPreview({projectData, handleUnsave} : {projectData: Project, handleUnsave?: (projectId: string) => void}) {
  return (
    <div className="relative hover:bg-muted/20 duration-200 cursor-pointer hover:rounded-2xl border-b border-b-muted/80 px-1 py-6 transition-all hover:shadow-sm">
        <div className="flex justify-between">
            <div className="flex items-center gap-2">
                <Avatar className="w-[35px] h-[35px] border border-gray-600">
                    <AvatarImage src={projectData.owner?.avatarUrl} />
                    <AvatarFallback>{projectData.owner?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <Link className="font-semibold hover:text-blue-500 dark:hover:text-blue-200 duration-200" href={`/user/${projectData.owner?.username}`}>{projectData.owner?.name}</Link>
                    <span className="font-semibold text-sm text-gray-400">{projectData.owner?.headLine || "@"+projectData.owner?.username}</span>
                </div>
            </div>

            <div>
                <ProjectActions projectData={projectData} handleUnsave={handleUnsave}/>
            </div>
        </div>
        <div className="flex justify-between items-start mt-3">
            <div>
                <Link className="text-2xl font-semibold text-foreground hover:underline" href={`/project/${projectData.publicId}`}>{projectData.title}</Link>
                {projectData.githubUrl && (
                    <a
                    href={projectData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                    >
                    <LucideLink className="w-4 h-4" />
                    {projectData.githubUrl.replace(/^https?:\/\//, '')}
                    </a>
                )}
            </div>
        </div>

        <p className="text-muted-foreground mt-4 line-clamp-4">
            {projectData.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
            {projectData.techStackNeeded.map((tech) => (
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
            {projectData.tags.map((tag, index) => (
                <span key={index} className="text-xs text-muted-foreground">#{tag}</span>
            ))}
        </div>

        <div className="mt-2 pt-4 flex justify-between text-sm text-muted-foreground">
            <Tooltip>
                <TooltipTrigger>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {projectData.rolesNeeded.reduce((acc, role) => acc + role.count, 0)} roles open
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {
                        projectData.rolesNeeded.map((role,index) => (
                            <p key={index}>{role.role}: {role.count}</p>
                        ))
                    }
                </TooltipContent>
            </Tooltip>
            <span>Posted {formatRelativeTime(projectData.createdAt!)}</span>
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
