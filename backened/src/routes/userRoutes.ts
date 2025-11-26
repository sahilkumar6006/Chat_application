import { Router } from "express";
import { getAllUser, registerUser, authUser, getUserProfile } from "../controller/userController";
import authMiddleware from "../middleware/authMiddleware";

const UserRoutes = Router();

UserRoutes.get("/", getAllUser);
UserRoutes.post("/", registerUser);
UserRoutes.post("/auth", authUser);
UserRoutes.get("/profile", authMiddleware, getUserProfile);


export default UserRoutes;
