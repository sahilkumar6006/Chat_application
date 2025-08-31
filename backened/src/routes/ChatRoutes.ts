import Router from "express";
import { accessChat } from "../controller/chatController";


const ChatRoutes = Router();

ChatRoutes.post("/accessChat", accessChat);

export default ChatRoutes;
