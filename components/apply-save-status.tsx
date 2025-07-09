'use client'

import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Save, Send } from 'lucide-react'
import { statusIndicator } from '@/constants/status-indicator'
import { Project } from '@/interfaces'
import { toggleSave } from '@/services/project'
import { toast } from 'sonner'

export const ProjectActions = ({projectData, handleUnsave}: {projectData: Project, handleUnsave?: (projectId: string) => void}) => {
    const toggleSaveProject = () =>{
        toast.promise(toggleSave(projectData._id!),{
            loading: 'loading...',
            success: (response) => {
                if(!response.data.saved){
                    handleUnsave?.(projectData._id!)
                }
                return response.data.message
            },
            error: (err) => err.response.data.message
        })
    }
  return (
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
                <div className="w-9 h-9 rounded-full border flex items-center cursor-pointer justify-center bg-gray-100 dark:bg-muted/50" onClick={toggleSaveProject}>
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
                    {statusIndicator[projectData.status].icon}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                {statusIndicator[projectData.status].description}
            </TooltipContent>
        </Tooltip>
    </div>
  )
}
