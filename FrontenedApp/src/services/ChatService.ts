import axios from "axios";
import { API_BASE_URL, authService } from "./authService";
import { IChat, IMessage } from "@/typings/ChatTypes";

const getAuthHeaders = async () => {
    const token = await authService.getToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const ChatService = {
    // Fetch all chats for the logged-in user
    getChats: async (): Promise<IChat[]> => {
        try {
            const config = await getAuthHeaders();
            const response = await axios.get(`${API_BASE_URL}/chat/chats`, config);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching chats:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch chats');
        }
    },

    // Access or create a one-on-one chat with a user
    accessChat: async (userId: string): Promise<IChat> => {
        try {
            const config = await getAuthHeaders();
            const response = await axios.post(
                `${API_BASE_URL}/chat/accessChat`,
                { userId },
                config
            );
            return response.data;
        } catch (error: any) {
            console.error('Error accessing chat:', error);
            throw new Error(error.response?.data?.message || 'Failed to access chat');
        }
    },

    // Fetch all messages for a specific chat
    fetchMessages: async (chatId: string): Promise<IMessage[]> => {
        try {
            const config = await getAuthHeaders();
            const response = await axios.get(
                `${API_BASE_URL}/message/${chatId}`,
                config
            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching messages:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch messages');
        }
    },

    // Send a message to a chat
    sendMessage: async (chatId: string, content: string): Promise<IMessage> => {
        try {
            const config = await getAuthHeaders();
            const response = await axios.post(
                `${API_BASE_URL}/message`,
                { chatId, content },
                config
            );
            return response.data;
        } catch (error: any) {
            console.error('Error sending message:', error);
            throw new Error(error.response?.data?.message || 'Failed to send message');
        }
    },

    // Create a group chat
    createGroupChat: async (name: string, userIds: string[]): Promise<IChat> => {
        try {
            const config = await getAuthHeaders();
            const response = await axios.post(
                `${API_BASE_URL}/chat/createGroupChat`,
                { name, users: userIds },
                config
            );
            return response.data;
        } catch (error: any) {
            console.error('Error creating group chat:', error);
            throw new Error(error.response?.data?.message || 'Failed to create group chat');
        }
    },
}