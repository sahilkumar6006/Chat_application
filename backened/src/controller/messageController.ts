import Chat from "../models/chatModel";
import Message from "../models/messageModel";
import User from "../models/userModel";
import { Request, Response } from "express";
import { Types } from "mongoose";




const allMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "-password")
        .populate("chat", "-password");
        res.json(messages);
    } catch (error) {
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
            sender: req.body.user._id,
        })  
        // Populate sender and chat fields
        message = await Message.populate(message, {
            path: 'sender',
            select: 'name pic'
        });
        
        message = await Message.populate(message, {
            path: 'chat',
            populate: {
                path: 'users',
                select: 'name pic email'
            }
        });
        const chat = await Chat.findByIdAndUpdate(
            chatId,
            { latestMessage: message._id },
            { new: true }
        );
       
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ message: "Internal server error" });
    }
}


export { allMessages, sendMessage };
