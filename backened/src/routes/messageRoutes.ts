import Router from "express";
import { allMessages, sendMessage } from "../controller/messageController";

const MessageRoutes = Router();

MessageRoutes.post("/allMessages", allMessages);
MessageRoutes.post("/sendMessage", sendMessage);

export default MessageRoutes;