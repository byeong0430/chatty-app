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
const addColorToUsername = msg => {
  // if msg type is postNotification, add a colour so that username colour's changed
  const colors = ['red', 'blue', 'orange', 'green'];
  const colorIndex = Math.floor(Math.random() * colors.length);
  msg.color = colors[colorIndex];
  return msg;
};
const changeItemType = msg => {
  // change 'post' to 'incoming' in each type
  msg.type = msg.type.replace('post', 'incoming');
  return msg;
};
const handleIncomingdata = data => {
  let newData = changeItemType(JSON.parse(data));
  if (newData.type === 'incomingNotification') {
    newData = addColorToUsername(newData);
  }
  // Broadcast new messages to everyone.
  broadcast(JSON.stringify(newData));
};
const handleConnection = ws => {
  const clientCount = {
    type: 'incomingClient',
    onlineClientNum: wss.clients.size
  };
  console.log(`${clientCount.onlineClientNum} user(s) online`);
  // Broadcast the total number of clients
  broadcast(JSON.stringify(clientCount));
  ws.on('message', data => handleIncomingdata(data));
  ws.on('close', handleClose);
};

wss.on('connection', handleConnection);