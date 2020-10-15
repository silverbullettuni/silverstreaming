const express = require("express");
const app = express();

let broadcaster;
const port = 4000;
const httpsPort = 8443;

const http = require("http");
var https = require('https');
var fs = require('fs');
var privateKey  = fs.readFileSync('sslcert/78633766_18.191.139.1734000.key', 'utf8');
var certificate = fs.readFileSync('sslcert/78633766_18.191.139.1734000.cert', 'utf8');
var credentials = {key: privateKey, cert: certificate};

const server = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

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
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
httpsServer.listen(httpsPort, () => console.log(`Server is running on port ${httpsPort}`));