import Router from "express";
import { accessChat, createGroupChat } from "../controller/chatController";
import authMiddleware from "../middleware/authMiddleware";

const ChatRoutes = Router();

// Protect all chat routes with authentication
// ChatRoutes.use(authMiddleware);

// Define chat routes
ChatRoutes.post("/accessChat", accessChat);
ChatRoutes.post("/createGroupChat", createGroupChat);

export default ChatRoutes;
