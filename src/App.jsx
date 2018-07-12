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
      messages: []
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
  sendNewMessage({ username, message }) {
    // prepare incoming message object
    const id = uuidv4();
    const newData = [];
    const incomingMessage = {
      id,
      type: 'incomingMessage',
      content: message.value
    };
    // if user changed the username, ownership of incomingMessage = <new username>
    // if username not changed, ownership of incomingMessage = currentUser
    if (username.value) {
      incomingMessage.username = username.value;
      // change currentUser to the new username
      this.setState({ currentUser: username.value });
      // also constructor new notification of the username change
      const incomingNotification = {
        id: uuidv4(),
        type: 'incomingNotification',
        content: `${this.state.currentUser} changed their name to ${username.value}`,
        referenceTo: id
      }
      newData.push(incomingNotification);
    } else {
      incomingMessage.username = this.state.currentUser;
    }
    newData.push(incomingMessage);
    // send the new message to the web socket server. make sure to convert obj to json before sending it
    this.socket.send(JSON.stringify(newData));
    console.log('Message sent');
  }
  // receive message back from the web socket server
  receiveBroadcastMessage() {
    return new Promise(resolve => {
      this.socket.onmessage = event => {
        // convert json broadcast message to obj
        const broadcastMessages = JSON.parse(event.data);
        // concatenate broadcast message with the existing messages
        const messages = this.state.messages.concat(broadcastMessages);
        this.setState({ messages });
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
        <Navbar />
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