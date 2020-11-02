const express = require("express");
const app = express();

let broadcaster;
let onlineUsers = {};
let onlineCount = 0;

const port = 4000;
const httpsPort = 8443;

const http = require("http");
var https = require('https');
var fs = require('fs');
//var privateKey  = fs.readFileSync('sslcert/18.191.139.1738443.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/18.191.139.1738443.cert', 'utf8');
//var credentials = {key: privateKey, cert: certificate};

const server = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);
const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", e => console.log(e));

io.sockets.on("connection", socket => {

  socket.on("broadcaster", () => {
    console.log("broadcaster " + socket.id);
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });

  socket.on("watcher", () => {
    console.log("watcher " + socket.id);
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
    console.log(userData.username + ' joins the room. ');
  })

  socket.on("exitChatbox", () => {
    if (socket.id in onlineUsers){
      var userData = {uid:socket.id, username:onlineUsers[socket.id]};

      delete onlineUsers[socket.id];
      onlineCount--;

      io.emit('exitChatbox', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:userData})
      console.log(userData.username + ' exits the room. ');
    }
  })

  socket.on('message', (chatData) => {
    io.emit('message', chatData);
    console.log(chatData.username + ':' + chatData.message);
  })
  
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
//httpsServer.listen(httpsPort, () => console.log(`Server is running on port ${httpsPort}`));
