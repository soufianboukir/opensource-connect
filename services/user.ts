import { api } from "@/config/api"

export const updateProfile = async (formData: FormData) =>{
    const response = await api.post(`/user/edit`,formData,{
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    });
    return response
}


export const getSuggestedUsers = async () =>{
    const response = await api.get(`/user/suggested`);
    return response; 
}