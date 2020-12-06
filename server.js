const express = require("express");
const app = express();
const {OAuth2Client} = require('google-auth-library');
var fs = require("fs");

const CLIENT_ID="307901483170-m56a98qcu5hjrtknsttovn1niepmdfn2.apps.googleusercontent.com"; // add your own ID here
const client = new OAuth2Client(CLIENT_ID);


const TIMEOUT = 600000; // 10 minutes 600000
const PORT = 4000;
const MAXPARTICIPANTS = 20;
const BROADCASTER = "broadcaster";

let onlineUsers = {};
let onlineCount = 0;
let timeout;
let rooms = new Map();

const http = require("http");
var fs = require("fs");

const server = http.createServer(app);
const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", (e) => console.log(e));

io.sockets.on("connection", (socket) => {

  // Broadcaster connects
  socket.on(BROADCASTER, (tokenId, loginToken) => {

    console.log("broadcaster", socket.id);
    // Get defined room if it exists
    let room = rooms.get(tokenId);
    verify(loginToken).catch((err) => {
      io.to(socket.id).emit("broadcastingNotAllowed");
      console.error(err);
      return;
    });
    if(room){
      // If the room already has a broadcaster, deny entry
      if(room.has(BROADCASTER)){
          io.to(socket.id).emit("broadcasterExists");
          return;
      }
      room.set(BROADCASTER, socket.id);
    }
    else{
      // If the room doesn't exist yet, create a new room and add new connection as broadcaster
      let room = new Map();
      room.set(BROADCASTER, socket.id);
      rooms.set(tokenId, room);
    }
    // Set room id for socket and join the room
    socket.roomId = tokenId;
    socket.join(tokenId);

    // Emit a message to the defined room that a broadcaster has connected
    socket.to(tokenId).emit(BROADCASTER);
    socket.isBroadcaster = true;
  });

  // Watcher connects
  socket.on("watcher", (tokenId) => {
    
    // Get defined room if it exists
    let room = rooms.get(tokenId);
    if(room){
      // Get room broadcaster if it exists
      let bc = room.get(BROADCASTER);
      // If watcher not yet in the room
      if(!room.has(tokenId)){
        // If room is full, deny entry
        if(room.size >= MAXPARTICIPANTS){
          io.to(socket.id).emit("roomAlreadyFull");
          return;
        }
     
        room.set(socket.id, "watcher");        
      } 
      // If broadcaster exists, emit a message to broadcaster that a new watcher has connected
      if(bc){
        io.to(bc).emit("watcher", socket.id);
      }    
           
    }
    else {
      // If the doesn't exist yet, create a new room and add new connection and watcher
      let room = new Map();
      room.set(socket.id, "watcher");
      rooms.set(tokenId, room);
    }
    // Set room id for socket and join the room
    socket.roomId = tokenId;
    socket.join(tokenId);
  });

  // Broadcaster -> watcher, offer new connection
  socket.on("offer", (id, message) => {
    io.to(id).emit("offer", socket.id, message);
  });

  // Watcher -> broadcaster, answer the broadcaster's offer
  socket.on("answer", (id, message) => {
    io.to(id).emit("answer", socket.id, message);
  });

  // Exchange ICE candidates to initiate connection between peers
  socket.on("candidate", (id, message) => {
    io.to(id).emit("candidate", socket.id, message);
  });

  // Connection leaves / disconnects
  socket.on("disconnect", () => {
    console.log("Disconnection: ", socket.id);

    // If socket not in a room, do nothing further
    if(!socket.roomId){
      return;
    }
    // Get the room the socket was in
    let room = rooms.get(socket.roomId);

    // If the broadcaster disconnects, emit the disconnection message to the whole room
    if(socket.isBroadcaster){
      socket.to(socket.roomId).emit("streamerTimeouted");
      room.delete(BROADCASTER)
    }
    else {
      // If a watcher disonnects, emit the disconnection message to the broadcaster
      let bc = room.get(BROADCASTER);
      if(bc){
        io.to(bc).emit("disconnectPeer", socket.id);
      }
      room.delete(socket.id);
    }
    
    // Remove socket from the room, deleting the room if empty
    socket.leave(socket.roomId);  
    if(room.size == 0){
      rooms.delete(socket.roomId);
    }
    socket.roomId = undefined;
  });

  socket.on("streamerDisconnect", () => {
    console.log("Streamer ended session: ", socket.id);
    socket.to(socket.roomId).emit("streamerTimeouted");
  });

  /* Handle streamer unintentionally leaving the the room */
  socket.on("streamerTimeout", () => {
    console.log(
      "Streamer closed the window, waiting for 10 minutes to recover"
    );
    timeout = setTimeout(() => {
      console.log("Timing out: disconnecting peer connection");
      let room = rooms.get(socket.roomId);
      let bc = room.get("broadcaster");
      socket.to(bc).emit("disconnectPeer", socket.id);
      socket.to(socket.roomId).emit("streamerTimeouted");
      socket.leave(socket.roomId);
      room.delete(socket.id);
      socket.roomId = undefined;
      
    }, TIMEOUT);
  });

  /* Reset shutdown timer */
  socket.on("resetStreamerTimeout", () => {
    clearTimeout(timeout);
    console.log("Streamer timeout reseted.");
  });

  // connect user and list user and online count
  socket.on("login", (userData) => {
    // assign socket id to user
    userData.uid = socket.id;
    // list all user info and count
    if (!(userData.uid in onlineUsers)) {
      onlineUsers[userData.uid] = userData.username;
      onlineCount++;
    }
    // user login, list all online user and count
    io.emit("login", {
      onlineUsers: onlineUsers,
      onlineCount: onlineCount,
      user: userData,
    });
    console.log(userData.username + " joins the room. ");
  });
  // disconnect exit user
  socket.on("exitChatbox", () => {
    if (socket.id in onlineUsers) {
      var userData = { uid: socket.id, username: onlineUsers[socket.id] };

      delete onlineUsers[socket.id];
      onlineCount--;
      // user logout, list all online user and count
      io.emit("exitChatbox", {
        onlineUsers: onlineUsers,
        onlineCount: onlineCount,
        user: userData,
      });
      console.log(userData.username + " has been exited. ");
    }
  });
  // display all messages 
  socket.on("message", (chatData) => {
    io.emit("message", chatData);
    console.log(chatData.username + ":" + chatData.message);
  });
});

/* Verifies the Google user is valid and found on the allowed broadcasters list */
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, 
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log("Google user " + userid + " logged in.");
  let isAllowed = await isUserAllowed(userid);
  if(isAllowed){
    return;
  }
  throw 'UserNotAllowedException'
}

/* Ensures the logged in Google user is found in the broadcaster list */ 
function isUserAllowed(userid) {
  return new Promise((resolve, reject) => {
    fs.readFile("broadcasters.txt", function(err, buf) {
      const lines = buf.toString().split(/\r?\n/);
      if(lines.indexOf(userid) > -1){
        resolve(true);
      }
      resolve(false);
    });
  });
}

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
