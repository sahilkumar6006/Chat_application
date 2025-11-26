import mongoose from "mongoose";

export const connectDb = async () => {
  console.log("Connecting to MongoDB");
  try {
    await mongoose.connect("mongodb+srv://sahilgorka123_db_user:sahil%40123@cluster0.awvyklm.mongodb.net/chatDB?retryWrites=true&w=majority");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
