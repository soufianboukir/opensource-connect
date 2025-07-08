'use client'
import React from 'react'
import { SidebarTrigger } from './sidebar'
import { Separator } from '@radix-ui/react-separator'
import { ModeToggle } from './theme-toggle'
import Notifications from '../notifications'
import { ProjectForm } from '../project-form'


export const SiteHeader = ({title}: {title: string}) => {
    return (
        <div>
            <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
                <div className='flex items-center'>
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <span className="text-xl font-semibold">{title}</span>
                </div>

                <div className='flex gap-4 items-center'>
                    <ProjectForm />
                    <Notifications />
                    <ModeToggle /> 
                </div>
            </header>
        </div>
    )
}
