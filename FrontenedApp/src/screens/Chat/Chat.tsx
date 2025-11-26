import { ChatService } from "@/services/ChatService";
import { useEffect } from "react";
import { Text, View } from "react-native"

export const Chat = () => {

    const getChats = async () => {
        const chats = await ChatService.getChats();
        console.log(chats);
    }

    useEffect(() => {
        getChats();
    }, []);

    return (
        <View>
            <Text>Chat</Text>
        </View>
    )
}