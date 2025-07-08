import { api } from "@/config/api"
import { Project } from "@/interfaces";

export const addProject = async (formData: Project) =>{
    const response = await api.post(`/project`,formData);
    return response;
}

export const getProjects = async () =>{
    const response = await api.get(`/project`);
    return response;
}