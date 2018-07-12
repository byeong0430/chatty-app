const express = require('express');
const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost',
    () => console.log(`Listening to ${PORT}`));

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

const handleClose = () => console.log('Client disconnected');
const changeItemType = msg => {
  // parse json and change 'post' to 'incoming' in each type
  const newData = JSON.parse(msg).map(item => {
    item.type = item.type.replace('post', 'incoming');
    return item;
  });
  return JSON.stringify(newData);
};
const broadcastMessage = data => {
  const newData = changeItemType(data);
  // Broadcast to everyone.
  wss.clients.forEach(client => {
    (client.readyState === WebSocket.OPEN) && client.send(newData)
  });
};
const handleConnection = ws => {
  console.log(`${wss.clients.size} client(s) connected`);
  ws.on('message', data => broadcastMessage(data));
  ws.on('close', handleClose);
};

wss.on('connection', handleConnection);