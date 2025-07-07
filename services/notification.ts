import { api } from "@/config/api"

export const getNotifications = async () =>{
    const response = await api.get(`/notifications`);
    return response;
}


export const getNotificationsPagination = async (page:number) =>{
    const response = await api.get(`/notifications/pagination?page=${page}&limit=8`)
    return response;
}


export const markNotificationsAsRead = async () =>{
    const response = await api.patch(`/notifications/mark-all-as-read`);
    return response;
}