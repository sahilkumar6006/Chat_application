import Router from "express";
import { allMessages, sendMessage } from "../controller/messageController";
import authMiddleware from "../middleware/authMiddleware";

const MessageRoutes = Router();

// Protect all message routes with authentication
MessageRoutes.use(authMiddleware);

MessageRoutes.get("/:chatId", allMessages);
MessageRoutes.post("/", authMiddleware, sendMessage);

export default MessageRoutes;