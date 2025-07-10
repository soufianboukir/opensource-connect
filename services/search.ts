import { api } from "@/config/api"

export const search = async (query: string) =>{
    const response = await api.get(`/search?query=${query}`);
    return response;
}