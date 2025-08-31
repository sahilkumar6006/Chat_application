import Router from "express";
import userRoutes from "./userRoutes";
import ChatRoutes from "./ChatRoutes";

const rootRoute = Router();

rootRoute.use("/user", userRoutes);
rootRoute.use("/chat", ChatRoutes)

export default rootRoute;
