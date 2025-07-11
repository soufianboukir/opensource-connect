import { api } from "@/config/api"

export const getConversations = async () =>{
    const response = await api.get(`/conversations`);
    return response;
}

export const getMessagesByConversation = async (conversationId: string,) =>{
    const response = await api.get(`/messages/byConversation?conversationId=${conversationId}`)
    return response;
}

export const sendMessage = async (conversationId: string, text: string) =>{
    const response = await api.post(`/messages`,{conversationId, text});
    return response;
}

export const startChating = async (recipientId: string, message: string, projectId?: string) =>{
    const response = await api.post(`/conversations`,{recipientId,message,projectId});
    return response;
}

export const deleteMessageService = async (messageId: string) =>{
    const response = await api.delete(`/messages/${messageId}`);
    return response;
}