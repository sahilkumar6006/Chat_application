import { Router } from "express";
import { getAllUser, registerUser, authUser } from "../controller/userController";

const UserRoutes = Router();

UserRoutes.get("/", getAllUser);
UserRoutes.post("/", registerUser);
UserRoutes.post("/auth", authUser);


export default UserRoutes;
