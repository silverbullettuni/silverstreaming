const express = require("express");
const app = express();

let broadcaster;
let onlineUsers = {};
let onlineCount = 0;
let timeout;
const seconds = 600000; // 10 minutes 600000

const port = 4000;
const httpsPort = 8443;

const http = require("http");
var https = require("https");
var fs = require("fs");

const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", (e) => console.log(e));

io.sockets.on("connection", (socket) => {

  socket.on("broadcaster", () => {
    console.log("broadcaster", socket.id);
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
    console.log("Disconnection: ", socket.id);
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });

  socket.on("streamerDisconnect", () => {
    console.log("Streamer ended session: ", socket.id);
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
    io.emit("streamerTimeouted");
  });

  socket.on("streamerTimeout", () => {
    console.log(
      "Streamer closed the window, waiting for 10 minutes to recover"
    );
    timeout = setTimeout(() => {
      console.log("Timing out: disconnecting peer connection");
      socket.to(broadcaster).emit("disconnectPeer", socket.id);
      io.emit("streamerTimeouted");
    }, seconds);
  });

  socket.on("resetStreamerTimeout", () => {
    clearTimeout(timeout);
    console.log("Streamer timeout reseted.");
  });

  socket.on("login", (userData) => {
    
    userData.uid = socket.id;

    if (!(userData.uid in onlineUsers)) {
      onlineUsers[userData.uid] = userData.username;
      onlineCount++;
    }
    io.emit("login", {
      onlineUsers: onlineUsers,
      onlineCount: onlineCount,
      user: userData,
    });
    console.log(userData.username + " joins the room. ");
  });

  socket.on("exitChatbox", () => {
    if (socket.id in onlineUsers) {
      var userData = { uid: socket.id, username: onlineUsers[socket.id] };

      delete onlineUsers[socket.id];
      onlineCount--;

      io.emit("exitChatbox", {
        onlineUsers: onlineUsers,
        onlineCount: onlineCount,
        user: userData,
      });
      console.log(userData.username + " has been exited. ");
    }
  });

  socket.on("message", (chatData) => {
    io.emit("message", chatData);
    console.log(chatData.username + ":" + chatData.message);
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
