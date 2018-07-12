import React, { Component } from 'react';
// import initial messages
import messages from '../data-files/messages.js';
// import react components
import ChatBar from './components/ChatBar.jsx';
import MessageList from './components/MessageList.jsx';
import Navbar from './components/Navbar.jsx';
// import npm packages
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

export default class App extends Component {
  constructor(props) {
    super(props);
    // set initial loading status to true
    this.state = {
      loading: true,
      currentUser: '',
      messages: [],
      socket: ''
    }
    this.socket = new WebSocket('ws://localhost:3001');
    // without the line below, `this` in renderMainPage() is undefined
    this.loadMessages = this.loadMessages.bind(this);
    this.createMsgComponents = this.createMsgComponents.bind(this);
    this.renderMainPage = this.renderMainPage.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
  }

  loadMessages() {
    setTimeout(() => {
      this.setState({
        loading: false,
        currentUser: messages.currentUser.name,
        messages: messages.messages
      })
    }, 1000);
  }
  createMsgComponents(createNewMessage, { currentUser, messages }) {
    // initial messages are available => add MessageList and ChatBar
    // each array item needs unique key. pass the function as props to MessageList
    // createNewMessage is a function called when a user enters a new message
    return [
      <MessageList
        key={uuidv4()}
        messages={messages}
      />,
      <ChatBar
        key={uuidv4()}
        handleNewMessage={createNewMessage}
        currentUser={currentUser}
      />
    ];
  }
  // upon receiving messages, render the main page component
  // message board + chat bar
  renderMainPage() {
    const { loading, currentUser, messages } = this.state;
    return (loading)
      ? createLoadingPage()
      : this.createMsgComponents(this.handleNewMessage, { currentUser, messages });
  }
  receiveMessage() {
    return new Promise(resolve => {
      this.socket.addEventListener('message', event => {
        resolve(event.data);
      });
    })
  }
  sendNewMessage({ username, message }) {
    return new Promise(resolve => {
      const incomingMessage = {
        id: uuidv4(),
        type: 'incomingMessage',
        content: message.value
      };

      incomingMessage.username = username.value
        ? username.value
        : this.state.currentUser;

      // send the new message to the web socket server
      this.socket.send(JSON.stringify({ incomingMessage }));
      console.log('Message sent');
      resolve();
    })
  }
  // function called when user enters a new message
  // this function is passed to Chatbar.jsx
  async handleNewMessage(msg) {
    await this.sendNewMessage(msg);
    // receive the message back from the web socket server
    const broadcastMsg = await this.receiveMessage();
    const messages = this.state.messages.concat(
      JSON.parse(broadcastMsg).incomingMessage
    );
    this.setState({ messages });
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
    // after all components were mounted, connect to the websocket (localhost:3001)
    this.socket.addEventListener('open', () => console.log('Connected to server'));
    // mimic async api delay when importing messages
    this.loadMessages();
  }
}