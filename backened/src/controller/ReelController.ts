import { Reel } from "../models/reelSchema";
import { Request, Response } from "express";


export const createReel = async (req: Request, res: Response) => {
    try {
        const { videoUrl, thumbnailUrl, caption, userId } = req.body;
        const reel = await Reel.create({ videoUrl, thumbnailUrl, caption, userId });
        res.status(201).json(reel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create reel' });
    }
}

export const getReels = async (req: Request, res: Response) => {
    try {
        const reels = await Reel.find().populate("userId", "name image").sort({ createdAt: -1 });
        res.status(200).json(reels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch reels' });
    }
}