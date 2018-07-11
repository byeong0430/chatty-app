const express = require('express');
const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost',
    () => console.log(`Listening to ${PORT}`));

const SocketServer = require('ws').Server;
const wss = new SocketServer({ server });

const handleClose = () => console.log('Client disconnected');
// const handleMessage = event => console.log(event);
const handleConnection = ws => {
  console.log('Client connected');

  ws.on('message', msg => {
    console.log(msg);
  });

  ws.on('close', handleClose);
};

wss.on('connection', handleConnection);

