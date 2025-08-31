import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import rootRoute from "./routes/rootRoute";
import { connectDb } from "./db/Connectdb";
dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.use("/", rootRoute);





server.listen(3000, () => {
    connectDb()
    console.log("Server is running on port 3000");
});