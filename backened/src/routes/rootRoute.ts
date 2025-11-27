import Router from "express";
import userRoutes from "./userRoutes";
import ChatRoutes from "./ChatRoutes";
import MessageRoutes from "./messageRoutes";
import ServiceRoutes from "./serviceRoutes";
import reelRoutes from "./reelRoutes";
import paymentRoutes from './paymentRoutes';

const rootRoute = Router();

rootRoute.use("/user", userRoutes);
rootRoute.use("/chat", ChatRoutes);
rootRoute.use("/message", MessageRoutes);
rootRoute.use("/service", ServiceRoutes);
rootRoute.use("/reel", reelRoutes);
rootRoute.use("/payment", paymentRoutes);

export default rootRoute;
