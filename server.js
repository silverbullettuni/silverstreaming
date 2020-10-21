const express = require("express");
const app = express();

let broadcaster;
let onlineUsers = {};
let onlineCount = 0;
const port = 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });

  socket.on("login", (userData) => {
    socket.id = userData.uid;

    if (!(userData.uid in onlineUsers)){
      onlineUsers[userData.uid] = userData.username
      onlineCount++;
    }
    io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:userData})
  })

  socket.on("exitChatbox", () => {
    if (socket.id in onlineUsers){
      var userData = {uid:socket.id, username:onlineUsers[socket.id]};

      delete onlineUsers[socket.id];
      onlineCount--;

      io.emit('exitChatbox', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:userData})
      console.log(userData.username);
    }
  })

  socket.on('message', (chatData) => {
    io.emit('message', chatData);
    console.log(chatData.message);
  })
  
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
