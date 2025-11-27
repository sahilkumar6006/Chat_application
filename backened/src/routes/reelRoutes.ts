import Router from "express";
import { createReel, getReels } from "../controller/ReelController";

const reelRoutes = Router();

reelRoutes.post("/create", createReel);
reelRoutes.get("/", getReels);

export default reelRoutes;
