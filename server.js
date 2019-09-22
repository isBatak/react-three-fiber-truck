const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
let Player = require('./server/Player');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let players = [];

setInterval(updateGame, 16);

// socket.io server
io.on('connection', (socket) => {
  console.log(`New connection ${socket.id}`);
  players.push(new Player(socket.id));

  socket.on('disconnect', () => {
    io.sockets.emit('disconnect', socket.id);
    players = players.filter((player) => player.id !== socket.id);
  });
});

io.sockets.on('disconnect', (socket) => {
  io.sockets.emit('disconnect', socket.id);

  players = players.filter(player.id !== socket.id);
});

function updateGame() {
  io.sockets.emit('heartbeat', players);
}

nextApp.prepare().then(() => {
  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
