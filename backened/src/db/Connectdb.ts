import mongoose from "mongoose";

export const connectDb = async () => {
    console.log("Connecting to MongoDB", process.env.MONGODB_URI);
    try {
        mongoose.connect(process.env.MONGODB_URI || "");
        console.log("Connected to MongoDB");
    } catch (error) { }
};