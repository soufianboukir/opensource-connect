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

export const updateProject = async (formdata: Project,projectId?: string) =>{
    const response = await api.put(`/project/${projectId}`,formdata);
    return response;
}

export const deleteProject = async (projectId: string) =>{
    const response = await api.delete(`/project/${projectId}`);
    return response;
}

export const toggleSave = async (projectId: string) =>{
    const response = await api.post(`/project/save-unsave/${projectId}`);
    return response;
}

export const getSavedProjects = async () =>{
    const response = await api.get(`/project/saved`);
    return response;
}


export const getProjectDetails = async (publicId: string) =>{
    const response = await api.get(`/project/${publicId}`);
    return response;
}