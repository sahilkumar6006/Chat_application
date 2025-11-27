import Chat from "../models/chatModel";
import Message from "../models/messageModel";
import { Request, Response } from "express";

const allMessages = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json({ message: "Chat ID is required" });
        }
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name email image")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(400).json({ message: "Internal server error" });
    }
}


const sendMessage = async (req: Request, res: Response) => {
    try {
        const { content, chatId }: { content: string, chatId: string } = req.body;
        if (!content || !chatId) {
            return res.status(400).json({ message: "Please Fill all the feilds" });
        }
        let message = await Message.create({
            content,
            chat: chatId,
            sender: req.user._id,
        })
        // Populate sender and chat fields
        message = await Message.populate(message, {
            path: 'sender',
            select: 'name email image'
        });

        message = await Message.populate(message, {
            path: 'chat',
            populate: {
                path: 'users',
                select: 'name email image'
            }
        });

        // Update chat's latest message
        await Chat.findByIdAndUpdate(
            chatId,
            { latestMessage: message._id },
            { new: true }
        );

        // Return the populated message, not the chat
        res.status(200).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(400).json({ message: "Internal server error" });
    }
}


export { allMessages, sendMessage };
