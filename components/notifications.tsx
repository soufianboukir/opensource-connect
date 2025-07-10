'use client'

import { Bell, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import moment from 'moment'
import Link from "next/link";
import { getNotifications, markNotificationsAsRead } from "@/services/notification";
import { Notification } from "@/interfaces";
import { useRouter } from "next/navigation";

export default function Notifications() {
    const [notifications,setNotifications] = useState<Notification[]>([]);
    const router = useRouter()

    useEffect(() =>{
        const fetchNotifications = async () =>{
            try{        
                const response = await getNotifications();
                if(response.data.notifications){
                    setNotifications(response.data.notifications)
                }
            }catch{
                toast.error('Operation failed', {
                    description: 'Internal server error'
                })
            }
        }
        fetchNotifications();
    },[])

    const markAllAsRead = async () =>{
        toast.promise(markNotificationsAsRead(),{
            loading: "...Loading",
            success: () => {
                const newNotifications = notifications.map((notification) => ({
                    ...notification,
                    read: true,
                  }))
                setNotifications(newNotifications);
                return "Succesfully marked as read"
            },
            error: (err) => err.response.data.message
        })
    }

  return (
    <Popover>
        <PopoverTrigger asChild>
            <button className="relative duration-200">
                <Bell className="cursor-pointer w-6 h-6" />
                {
                    notifications.some((notification) => !notification.read) ?
                        <div>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                    :null
                }
            </button>
        </PopoverTrigger>
        <PopoverContent 
            className="w-96 p-0 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800"
            align="end"
        >
            <div className="bg-gradient-to-r from-white to-blue-50 dark:from-black/10 dark:to-black/80 p-4 rounded-t-xl border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onClick={markAllAsRead}>
                        Mark all as read
                    </span>
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications && notifications.map((notification, idx) => (
                    <Link
                        href={notification.link}
                        key={idx}
                        onClick={notification.link ? () => router.push?.(notification?.link) : () => {}}
                        className={cn(
                        "p-4 border-b cursor-pointer border-gray-200 dark:border-gray-800 transition-all duration-300",
                        "hover:bg-gray-50 dark:hover:bg-black/50",
                        "flex items-start gap-4",
                        !notification.read && "bg-blue-50/50 dark:bg-black/30"
                        )}
                    >

                        <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                    {notification.type === 'system' && 'System'}
                                    {notification.type === 'project application' && 'Application received'}
                                    {notification.type === 'propose collaboration' && 'Collaboration proposal'}
                                    {notification.type === 'project app rejected' && 'Project application rejected'}
                                    {notification.type === 'project app accepted' && 'Project application accepted'}
                                    {notification.type === 'collaboration rejected' && 'Collaboration rejected'}
                                    {notification.type === 'collaboration accepted' && 'Collaboration accpted'}
                                </h4>

                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                                    {notification.message}
                                </p>
                            </div>

                            {notification.read && (
                                <Check className="w-4 h-4 text-green-500 mt-1" />
                            )}
                        </div>

                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                            {moment(notification.createdAt).fromNow()}
                        </span>
                        </div>

                        {!notification.read && (
                        <div className="mt-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse block"></span>
                        </div>
                        )}
                    </Link>
                ))}

            </div>
            <div className="p-3 text-center bg-gray-50 dark:bg-black/50 rounded-b-xl">
                <span className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                    <Link href={'/notifications'}>
                        View all notifications
                    </Link>
                </span>
            </div>
        </PopoverContent>
    </Popover>
  );
}