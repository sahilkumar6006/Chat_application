import axios from "axios";
import { API_BASE_URL } from "./authService";

export const ChatService = {
    getChats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/chat/chats`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching chats:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch chats');
        }
    },
}