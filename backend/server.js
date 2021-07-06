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
  socket.on('test', () => {
    socket.emit('test-back', 'got test back');
  });
});

server.listen(port, () => {
  console.log(`Listening at ${port}`);
});

