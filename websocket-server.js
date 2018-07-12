const express = require('express');
const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost',
    () => console.log(`Listening to ${PORT}`));

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

const handleClose = () => console.log('Client disconnected');
const broadcast = data => {
  wss.clients.forEach(client => {
    (client.readyState === WebSocket.OPEN) && client.send(data)
  });
}
const changeItemType = msg => {
  // parse json and change 'post' to 'incoming' in each type
  const newData = JSON.parse(msg).map(item => {
    item.type = item.type.replace('post', 'incoming');
    return item;
  });
  return JSON.stringify(newData);
};
const handleIncomingdata = data => {
  const newData = changeItemType(data);
  // Broadcast new messages to everyone.
  broadcast(newData);
};
const handleConnection = ws => {
  const clientCount = {
    type: 'incomingClientCount',
    onlineClientNum: wss.clients.size
  };
  console.log(`${clientCount.onlineClientNum} user(s) online`);
  // Broadcast the total number of clients
  broadcast(JSON.stringify(clientCount));
  ws.on('message', data => handleIncomingdata(data));
  ws.on('close', handleClose);
};

wss.on('connection', handleConnection);