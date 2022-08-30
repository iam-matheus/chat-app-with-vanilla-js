const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const botname = "Chat Bot";
const PORT = 3000 || process.env.PORT;

//this runs whn aclient connects
io.on("connection", (socket) => {
  socket.on("joinChatRoom", ({ username, room }) => {
    //listen for join chatRoom
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.broadcast.to(user.room).emit(
      //broadcast when a user connects
      "message",
      formatMessage(botname, `${username} has connected`)
    );

    //welcome current user
    socket.emit("message", formatMessage(botname, "Welcome to the chat"));
  });

  //broadcast when a user disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botname, `A user has left the chat.`));
  });

  //listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg)); //end here
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
