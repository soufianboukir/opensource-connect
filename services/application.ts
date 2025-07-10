import { api } from "@/config/api"

export const sendApplication = async (toUser: string,type: string, message: string, project?: string, ) =>{
    const response = await api.post(`/application`,{toUser,project,type,message});
    return response;
}