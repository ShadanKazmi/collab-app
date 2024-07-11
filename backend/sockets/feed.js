const { Server } = require('socket.io');

function initializeFeedSocket(server) {
  const feedIo = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  feedIo.on('connection', (socket) => {
    console.log('a user connected to feed comments');

    socket.on('disconnect', () => {
      console.log('user disconnected from feed comments');
    });

    socket.on('newMessage', (message) => {
      feedIo.emit('newMessage', message); // Broadcast to all clients
    });

    socket.on('newReply', (reply) => {
      feedIo.emit('newReply', reply); // Broadcast to all clients
    });
  });

  return feedIo;
}

module.exports = initializeFeedSocket;
