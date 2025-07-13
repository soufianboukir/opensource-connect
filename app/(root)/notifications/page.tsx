'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

import moment from 'moment';
import { handleNext, handlePrevious, markNotReaded } from '@/functions';
import { getNotificationsPagination } from '@/services/notification';
import { Notification } from '@/interfaces';
import Loading from '@/components/loading';
import { PaginationControls } from '@/components/ui/pagination';

import { Bell, CheckCircle, UserPlus, Mail, ExternalLink, XCircle, Clock } from 'lucide-react'
import { EmptyState } from '@/components/empty-state';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/ui/site-header';

const notificationStyles: Record<string, { icon: React.ReactNode, color: string, title: string }> = {
  system: {
    icon: <Bell className="text-blue-500" />,
    color: 'border-blue-200 bg-blue-50 dark:bg-blue-900/10',
    title: 'System Notification',
  },
  'project application': {
    icon: <Mail className="text-gray-500" />,
    color: 'border-muted',
    title: 'Project Application',
  },
  'propose collaboration': {
    icon: <UserPlus className="text-purple-500" />,
    color: 'border-purple-300 bg-purple-50 dark:bg-purple-900/10',
    title: 'Collaboration Request',
  },
  'project app accepted': {
    icon: <CheckCircle className="text-green-600" />,
    color: 'border-green-300 bg-green-50 dark:bg-green-900/10',
    title: 'Application Accepted',
  },
  'collaboration accepted': {
    icon: <CheckCircle className="text-green-600" />,
    color: 'border-green-300 bg-green-50 dark:bg-green-900/10',
    title: 'Collaboration Accepted',
  },
  'project app rejected': {
    icon: <XCircle className="text-red-600" />,
    color: 'border-red-300 bg-red-50 dark:bg-red-900/10',
    title: 'Application Rejected',
  },
  'collaboration rejected': {
    icon: <XCircle className="text-red-600" />,
    color: 'border-red-300 bg-red-50 dark:bg-red-900/10',
    title: 'Collaboration Rejected',
  },
}


const NotificationsPage = () => {
    const [notifications,setNotifications] = useState<Notification[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const [page,setPage] = useState<number>(1);
    const [totalPages,setTotalPages] = useState<number>(1);

    const fetchNotifications = async (currentPage: number) => {
        try {
            const response = await getNotificationsPagination(currentPage);
            if (response.status === 200) {
                setNotifications(response.data.notifications);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error('Operation failed', {
                    description: response.data.message,
                });
            }
        } catch {
            toast.error('Operation failed', {
                description: 'Internal server error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(page);
    }, [page]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
            <SiteHeader title="Your notifications" />
                    <div className="lg:w-[60%] w-[90%] mx-auto p-4">
                        <div className="flex items-center justify-between mb-6">
                            {
                                (!loading && notifications.length > 0) && (
                                    <>
                                        <h1 className="text-2xl font-bold">Notifications</h1>
                                        <Button variant="ghost" className="text-primary" onClick={markNotReaded}>
                                            Mark all as read
                                        </Button>
                                    </>
                                )
                            }
                        </div>
                        
                        <div className="space-y-2">
                            {notifications && notifications.length > 0 ? (
                            notifications.map((notification) => {
                                const style = notificationStyles[notification.type] || notificationStyles.system
                            
                                return (
                                <Link
                                    key={notification._id}
                                    href={notification.link ? notification.link : ''}
                                    className={cn(
                                    `flex items-start gap-4 p-4 rounded-lg border hover:bg-muted transition-colors`,
                                    )}
                                >
                                    <div className="flex-shrink-0">{style.icon}</div>
                            
                                    <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                        <p className="text-sm font-semibold">{style.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {notification.fromUser?.name && (
                                            <span className="font-medium">{notification.fromUser.name}</span>
                                            )}{" "}
                                            {notification.message}
                                        </p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    </div>
                            
                                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {moment(notification.createdAt).fromNow()}
                                    </div>
                                    </div>
                                </Link>
                                )
                            })
                            
                            ) : null}
                        </div>
                        <br />
                        {
                            notifications && notifications.length ? (
                                <PaginationControls
                                    previous={() => handlePrevious({ page, setPage, getMore: fetchNotifications})}
                                    next={() => handleNext({page,totalPages,setPage,getMore:fetchNotifications})} />
                            ) : null
                        }
                        {
                            !loading && notifications.length === 0 && (
                                <EmptyState message='No notifications found' description='When you get notification. they will appear here' />
                            )
                        }
                        {
                            loading && <Loading message='Loading your notifications'/>
                        }
                    </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default NotificationsPage;