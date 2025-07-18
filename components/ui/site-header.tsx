'use client'
import React from 'react'
import { SidebarTrigger } from './sidebar'
import { Separator } from '@radix-ui/react-separator'
import { ModeToggle } from './theme-toggle'
import Notifications from '../notifications'
import { ProjectForm } from '../project-form'
import { SearchBar } from '../search-bar'


export const SiteHeader = ({title}: {title: string}) => {
    return (
        <header className="sticky top-0 z-50 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <span className="md:text-xl text-sm font-semibold">{title}</span>
                </div>

                <div>
                    <SearchBar />
                </div>

                <div className="flex items-center gap-4">
                    <ProjectForm />
                    <Notifications />
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
