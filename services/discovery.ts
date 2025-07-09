import { api } from "@/config/api"

export const getFeedData = async (status: 'active' | 'archived' | 'in progress', techStack: string[],
    roles: string[], tags: string[], sort: 'newest' | 'oldest', page: number
) =>{
    const response = await api.get(`/discovery?page=${page}&status=${status}&techStack&${techStack}&roles=${roles}&tags=${tags}&sort=${sort}`);
    return response;
}