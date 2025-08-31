import User from "../models/userModel";
import Chat from "../models/chatModel";
import { Request, Response } from "express";

const accessChat = async(req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        })
        .populate("users", "-password")
        .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage",
            populate: {
                path: "sender",
                model: "User",
                select: "name image email",
            },
        });

        if (isChat.length > 0) {
            return res.json(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };
            try {
                const createdChat = await Chat.create(chatData);
                const fullChat = await User.populate(createdChat, {
                    path: "users",
                    select: "-password",
                });
                res.status(200).json(fullChat);
            } catch (error) {
                res.status(400).json(error);
            }
        }
    } catch (error) {
        res.status(400).json({ message: "Internal server error" });
    }
}

export { accessChat };