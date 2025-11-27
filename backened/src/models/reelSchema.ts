import mongoose from "mongoose";


const reelSchema = new mongoose.Schema({
    videoUrl: {
        type: String, required: true
    },
    thumbnailUrl: String,
    caption: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: String,
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
})

export const Reel = mongoose.model("Reel", reelSchema);
