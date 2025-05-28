let ioInstance = null;

function initSocket(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: { origin: "*" }
  });

  ioInstance.on('connection', socket => {
    console.log('Client connecté au WebSocket'); // debug to remove
  });
}

function sendSocketNotification(notification) {
  if (ioInstance) {
    ioInstance.emit('notification', notification);
  }
}

module.exports = { initSocket, sendSocketNotification };
