import { api } from "@/config/api"

export const sendApplication = async (toUser: string,type: string, message: string, project?: string, ) =>{
    const response = await api.post(`/application`,{toUser,project,type,message});
    return response;
}

export const applicationAction = async (applicationId: string, type: 'cancel' | 'accept' | 'reject') =>{
    const response = await api.patch(`/application/${applicationId}/${type}`)
    return response;
}

export const editApplication = async (id: string, message: string) =>{
    const response = await api.patch(`/application/${id}/edit`,{message});
    return response;
}