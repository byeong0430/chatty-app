const express = require('express');
const PORT = 3001;
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost',
    () => console.log(`Listening to ${PORT}`));

const SocketServer = require('ws').Server;
const wss = new SocketServer({ server });

const handleClose = () => console.log('Client disconnected');
const handleIncomingMsg = ws => {
  return new Promise(resolve => {
    ws.on('message', msg => {
      resolve(msg);
    })
  })
}
const handleMessages = async ws => {
  const incomingMessage = await handleIncomingMsg(ws);
  ws.send(incomingMessage);
};

const handleConnection = ws => {
  console.log('Client connected');
  handleMessages(ws);
  ws.on('close', handleClose);
};

wss.on('connection', handleConnection);

