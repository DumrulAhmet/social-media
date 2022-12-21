import { Server } from "socket.io";
import { server } from "../../app.js";
import urlencoded from "urlencode";

export const Chat = (req, res) => {
  const io = new Server(server, {
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    socket.on("join", (data) => {
      socket.join(urlencoded.decode(data))
    });
    socket.on("send-message", async (result) => {
      const room = urlencoded.decode(result.room);
      io.to(room).emit("messages",  {message:result.message,user:result.email})
    });
    
  });
};
