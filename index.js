const express = require('express');
const socket = require("socket.io");

const app = express();

const PORT = 3500

const server = app.listen(PORT, () => {
  console.log('Server started at port:'+PORT)
});

app.use(express.static('public'));

const io = socket(server);

io.on("connection", socket => {
  console.log('User connected:', socket.id);

  socket.on("join", roomName => {
    const rooms = io.sockets.adapter.rooms;
    const room = rooms.get(roomName);

    if(!room) {
      // room created
      socket.join(roomName);
      socket.emit("room-created", roomName);
      console.log(`Room ${roomName} created successfully!`);
    }

    if(room) {
      if(room.size > 1) {
        // room filled
        console.log('room '+ roomName + ' is full.');
        socket.emit('room-full', {name: roomName, numOfUser: room.size});
        return false;
      }
      // Room joined
      socket.join(roomName);
      socket.emit("room-joined", roomName);
    }

    console.log(rooms);

    socket.on("ready", roomName => {
      socket.broadcast.to(roomName)
      .emit("ready")
    });

    socket.on("candidate", (candidate, roomName) => {
      console.log({candidate})
      socket.broadcast.to(roomName)
      .emit("candidate", candidate)
    });
    socket.on("offer", (offer, roomName) => {
      console.log({offer})
      socket.broadcast.to(roomName)
      .emit("offer", offer)
    });
    socket.on("answer", (answer, roomName) => {
      console.log({answer})
      socket.broadcast.to(roomName)
      .emit("answer", answer)
    });

  })
});