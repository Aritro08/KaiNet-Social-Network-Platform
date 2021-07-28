const http = require('http');
const app = require('./app');
const socketio = require('socket.io');

const port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:4200'
  }
});

io.on('connection', socket => {

  socket.on('joinRoom', roomName => {
    socket.join(roomName);
  });

  socket.on('message', ({roomName, from, message, image, datetime}) => {
    io.to(roomName).emit('message-back', {message, from, image, datetime});
  });

  socket.on('add-to-room', ({roomName, user}) => {
    io.to(roomName).emit('added-user', user);
  });

  socket.on('user-leave-room', ({roomName, username, memberId}) => {
    io.to(roomName).emit('user-left', {username, memberId});
  })

  socket.on('leaveRoom', roomName => {
    socket.leave(roomName);
  });

});

server.listen(port, () => {
  console.log(`Listening at ${port}`);
});

