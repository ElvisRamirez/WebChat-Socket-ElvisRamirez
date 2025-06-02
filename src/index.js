const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {}; // Almacena los usuarios conectados

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Escucha el evento de registro de usuario
  socket.on('register-user', (username) => {
    users[socket.id] = username;
    io.emit('users-list', Object.values(users));
    io.emit('message', {
      user: 'Sistema',
      message: `${username} se ha conectado.`,
    });
  });

  // Escucha los mensajes enviados por los usuarios
  socket.on('message', (message) => {
    const user = users[socket.id] || 'Anónimo';
    io.emit('message', { user, message });
  });

  // Maneja la desconexión de usuarios
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('users-list', Object.values(users));
    if (username) {
      io.emit('message', {
        user: 'Sistema',
        message: `${username} se ha desconectado.`,
      });
    }
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
