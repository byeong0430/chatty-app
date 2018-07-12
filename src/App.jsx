import React, { Component } from 'react';
// import initial messages
import messages from '../data-files/messages.js';
// import react components
import ChatBar from './components/ChatBar.jsx';
import MessageList from './components/MessageList.jsx';
import Navbar from './components/Navbar.jsx';
// import npm package
import uuidv4 from 'uuid/v4';

// function components
const createLoadingPage = () => {
  // initial loading page when messages are unavailble
  return (
    <section className='loadingPage'>
      <p>Loading...</p>
    </section>
  );
}

// when initial messages are ready, return message list and chatbar
const createMsgComponents = (createNewMessage, { currentUser, messages }) => {
  return [
    <MessageList
      key={uuidv4()}
      messages={messages}
      currentUser={currentUser}
    />,
    <ChatBar
      key={uuidv4()}
      sendNewMessage={createNewMessage}
      currentUser={currentUser}
    />
  ];
}

export default class App extends Component {
  constructor(props) {
    super(props);
    // initial state
    this.state = {
      loading: true,
      currentUser: '',
      messages: [],
      onlineClientNum: 0
    }
    this.socket = new WebSocket(`ws://localhost:3001`);

    // bind functions to this class
    this.connectToWss = this.connectToWss.bind(this);
    this.loadInitialMessages = this.loadInitialMessages.bind(this);
    this.renderMainPage = this.renderMainPage.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);
    this.receiveBroadcastMessage = this.receiveBroadcastMessage.bind(this);
    this.handleWssMessage = this.handleWssMessage.bind(this);
  }
  // wss: web socket server
  connectToWss() {
    return new Promise(resolve => {
      this.socket.onopen = () => {
        console.log('Connected to ws server');
        resolve();
      };
    });
  }
  loadInitialMessages() {
    setTimeout(() => {
      this.setState({
        loading: false,
        currentUser: messages.currentUser.name,
        messages: messages.messages
      })
    }, 1000);
  }
  // when initial messages are unavailable, display the loading page
  // when they're ready, render the main page component (message list and chatbar)
  renderMainPage() {
    const { loading, currentUser, messages } = this.state;
    return (loading)
      ? createLoadingPage()
      : createMsgComponents(this.sendNewMessage, { currentUser, messages });
  }
  sendNewMessage(message) {
    // give each message unique id
    message.id = uuidv4();
    if (message.type === 'postNotification') {
      // change currentUser to the new username
      this.setState({ currentUser: message.content });
      // if user changed the username, ownership of incomingMessage = <new username>
      message.content = `${this.state.currentUser} changed their name to ${message.content}`;
    }
    // send the new message to the web socket server. make sure to convert obj to json before sending it
    this.socket.send(JSON.stringify(message));
    console.log('Message sent');
  }
  // receive message back from the web socket server
  receiveBroadcastMessage() {
    return new Promise((resolve, reject) => {
      this.socket.onmessage = event => {
        // convert json broadcast message to obj
        const broadcastMessage = JSON.parse(event.data);
        switch (broadcastMessage.type) {
          case 'incomingClientCount':
            this.setState({
              onlineClientNum: broadcastMessage.onlineClientNum
            });
            break;
          case 'incomingMessage':
            // concatenate broadcast message with the existing messages
            this.setState({
              messages: this.state.messages.concat(broadcastMessage)
            });
            break;
          case 'incomingNotification':
            // concatenate broadcast message with the existing messages
            this.setState({
              messages: this.state.messages.concat(broadcastMessage)
            });
            break;
          default:
            reject(`Unknown data type ${broadcastMessage.type}`)
        }
      };
      resolve('message updated');
    });
  }
  async handleWssMessage() {
    await this.connectToWss();
    await this.receiveBroadcastMessage();
  }

  render() {
    return (
      <div>
        <Navbar onlineClientNum={this.state.onlineClientNum} />
        {this.renderMainPage()}
      </div>
    );
  }

  componentDidMount() {
    // connect ws server and handle broadcast messages
    // IMPORTANT: socket.onmessage() must be within componentDidMount()
    this.handleWssMessage();
    // mimic async api delay when importing messages
    this.loadInitialMessages();
  }
}