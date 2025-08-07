'use client'

import { Project } from '@/interfaces'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Ellipsis, Link, Pencil, Trash2, Users } from 'lucide-react'
import { capitalizeFirst } from '@/functions'
import { Icon } from "@iconify/react";
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { statusIndicator } from '@/constants/status-indicator'

export const ProjectCard = ({ projectData, onOpenDelete, onOpenUpdate }:
     { projectData: Project, onOpenDelete: (val: { open: boolean, projectId: string }) => void ,
     onOpenUpdate: (val: { open: boolean, projectData: Project }) => void}) => {

    const { status } = projectData;

    
    return (
        <div className='group relative overflow-hidden dark:bg-muted/20 px-2 py-4 rounded-md hover:shadow-lg transition-all duration-300 border dark:border-muted dark:hover:border-white/20 hover:border-primary/30 bg-gray-100 border-gray-200'>
            <div className='flex justify-between items-start gap-4'>
                <div className='flex-1'>
                    <div className='flex flex-col'>
                        <h3 className='text-lg font-bold tracking-tight group-hover:text-primary transition-colors leading-relaxed line-clamp-1'>
                            {projectData.title || "Untitled Project"}
                        </h3>
                        {projectData.githubUrl && (
                            <a 
                                href={projectData.githubUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 mt-1 w-fit"
                            >
                                <Link className='w-4 h-4' />
                                <span className="truncate max-w-[200px]">
                                    {projectData.githubUrl.replace(/^https?:\/\//, '')}
                                </span>
                            </a>
                        )}
                    </div>
                </div>

                <div className='flex gap-2 items-center'>
                    <div className='w-9 h-9 rounded-full border-3 dark:border-muted flex justify-center items-center shadow-sm border-gray-300'>
                        <Tooltip>
                            <TooltipTrigger>
                                {statusIndicator[status]?.icon}
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {statusIndicator[status]?.description}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger className='hover:bg-muted/50 p-1.5 rounded-md transition-colors'>
                            <Ellipsis className='text-muted-foreground hover:text-foreground'/>    
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[180px]" align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => onOpenUpdate({open: true, projectData: projectData})}>
                                <Pencil className="w-4 h-4" />
                                Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-500 focus:text-red-500" onClick={() => onOpenDelete({open:true,projectId: projectData._id!})}>
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {projectData.description && (
                <div className="mt-3">
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {projectData.description}
                    </p>
                </div>
            )}



            {projectData.techStackNeeded && projectData.techStackNeeded.length > 0 && (
                <div className='mt-4'>
                    <div className="flex flex-wrap gap-2">
                        {projectData.techStackNeeded.slice(0, 5).map((tech: string, index: number) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 text-xs rounded-full bg-muted text-muted-foreground border border-border flex items-center gap-2 transition-colors"
                            >
                                <Icon icon={`devicon:${tech.toLowerCase()}`} className="w-4 h-4" />
                                {capitalizeFirst(tech)}
                            </span>
                        ))}
                        {projectData.techStackNeeded.length > 5 && (
                            <span className="px-3 py-1.5 text-xs rounded-full bg-muted/50 text-muted-foreground border border-border flex items-center">
                                +{projectData.techStackNeeded.length - 5}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {projectData.tags && projectData.tags.length > 0 && (
                <div className='mt-4'>
                    <div className="flex flex-wrap gap-2">
                        {projectData.tags.slice(0, 5).map((tag: string, index: number) => (
                            <span
                                key={index}
                                className="text-muted-foreground gap-2 transition-colors"
                            >
                                {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                        ))}
                        {projectData.tags.length > 5 && (
                            <span className="text-muted-foreground flex items-center">
                                +{projectData.tags.length - 5}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className='mt-5 pt-3 border-t border-muted flex justify-between items-center'>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className='w-4 h-4'/>
                    <span>
                        {projectData.rolesNeeded?.length || 0} roles needed
                    </span>
                </div>

                <div className="text-xs text-muted-foreground">
                    {projectData.createdAt ? (
                        `Posted ${formatRelativeTime(projectData.createdAt)}`
                    ) : "Recently updated"}
                </div>
            </div>
        </div>
    )
}

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: (date.getFullYear() !== now.getFullYear()) ? 'numeric' : undefined
    });
}