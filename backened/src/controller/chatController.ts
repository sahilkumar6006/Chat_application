import User from "../models/userModel";
import Chat from "../models/chatModel";
import { Request, Response } from "express";

const accessChat = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        console.log('Access chat request body:', req.body);
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ]
        })
            .populate("users", "-password")
            .populate("latestMessage");

        console.log('Existing chat found:', isChat);
        const fullChat = await User.populate(isChat, {
            path: "latestMessage",
            populate: {
                path: "sender",
                model: "User",
                select: "name image email",
            },
        });

        if (fullChat.length > 0) {
            return res.json(fullChat[0]);
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

const fetchChats = async (req: Request, res: Response) => {
    try {
        const results = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        res.status(200).send(populatedResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const createGroupChat = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please Fill all the feilds" });
        }
        const users = req.body.users;

        if (users.length < 2) {
            return res
                .status(400)
                .send("More than 2 users are required to form a group chat");
        }
        users.push(req.user);
        try {
            const groupChat = await Chat.create({
                chatName: req.body.name,
                users,
                isGroupChat: true,
                groupAdmin: req.user,
            })
            const chatWithUsers = await Chat.populate(groupChat, {
                path: "users",
                select: "-password",
            });

            const fullChat = await Chat.populate(chatWithUsers, {
                path: "groupAdmin",
                select: "-password",
            });
            res.status(200).json(fullChat);
        } catch (error) {
            res.status(400).json(error);
        }
    } catch (error) {
        res.status(400).json({ message: "Internal server error" });
    }
}

export { accessChat, fetchChats, createGroupChat };