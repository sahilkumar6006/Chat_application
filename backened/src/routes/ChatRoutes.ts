import Router from "express";
import { accessChat, createGroupChat, fetchChats } from "../controller/chatController";
import authMiddleware from "../middleware/authMiddleware";

const ChatRoutes = Router();

// Protect all chat routes with authentication
ChatRoutes.use(authMiddleware);

// Define chat routes
ChatRoutes.get("/chats", fetchChats);
ChatRoutes.post("/accessChat", authMiddleware, accessChat);
ChatRoutes.post("/createGroupChat", authMiddleware, createGroupChat);

export default ChatRoutes;
