import { io } from "../index";

interface User {
  _id: string;
}



io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("setup", (userData: User) => {
       // add user to socket
       socket.join(userData._id);
       socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);

        console.log('in the room', room);
    });

    socket.on("typing", (room) => {
        socket.in(room).emit("typing", room);
        socket.on("stop typing", (room) => {
            socket.in(room).emit("stop typing", room);
        })
    })
    socket.on("new message", (newMessage: any) => {
        let chat = newMessage.chat;
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user: User) => {
            if (user._id == newMessage.sender._id) return;
            socket.in(user._id).emit("message received", newMessage);
        });
    });
  
    socket.off("setup", (userData: User) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
});
