const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

const users = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('chat message', `${username} joined the chat`);
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('chat message', `${username} left the chat`);
  });

  socket.on('chat message', (msg) => {
    const username = users[socket.id];
    io.emit('chat message', `${username}: ${msg}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
