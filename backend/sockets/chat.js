const { Server } = require('socket.io');

function initializeChatSocket(server) {
  const chatIo = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  chatIo.on('connection', (socket) => {
    console.log('a user connected to chat');

    socket.on('disconnect', () => {
      console.log('user disconnected from chat');
    });

    socket.on('newChatMessage', (message) => {
      chatIo.emit('newChatMessage', message); // Broadcast to all clients
    });
  });

  return chatIo;
}

module.exports = initializeChatSocket;
