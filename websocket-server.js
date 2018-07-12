const express = require('express');
const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost',
    () => console.log(`Listening to ${PORT}`));

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

const handleClose = () => console.log('Client disconnected');
const handleMessage = data => {
  // Broadcast to everyone.
  wss.clients.forEach(client => {
    (client.readyState === WebSocket.OPEN) && client.send(data)
  });
};
const handleConnection = ws => {
  console.log(`${wss.clients.size} client(s) connected`);
  ws.on('message', data => handleMessage(data));
  ws.on('close', handleClose);
};

wss.on('connection', handleConnection);