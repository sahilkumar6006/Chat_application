import Router from "express";
import { accessChat, createGroupChat } from "../controller/chatController";


const ChatRoutes = Router();

ChatRoutes.post("/accessChat", accessChat);
ChatRoutes.post("/createGroupChat", createGroupChat);

export default ChatRoutes;
