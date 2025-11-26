import Router from "express";
import userRoutes from "./userRoutes";
import ChatRoutes from "./ChatRoutes";
import MessageRoutes from "./messageRoutes";
import ServiceRoutes from "./serviceRoutes";

const rootRoute = Router();

rootRoute.use("/user", userRoutes);
rootRoute.use("/chat", ChatRoutes);
rootRoute.use("/message", MessageRoutes);
rootRoute.use("/service", ServiceRoutes);

export default rootRoute;
