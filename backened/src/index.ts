import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import rootRoute from "./routes/rootRoute";
import { connectDb } from "./db/Connectdb";
import { initializeSockets } from "./services/socket";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors());

// Initialize Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize socket handlers
initializeSockets(io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Chat API is running" });
});

app.use("/api", rootRoute);

// Database connection
connectDb()
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error("Database connection error:", error));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});