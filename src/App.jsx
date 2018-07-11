import React, { Component } from 'react';
// import initial messages
import messages from '../data-files/messages.js';
// import react components
import ChatBar from './components/ChatBar.jsx';
import MessageList from './components/MessageList.jsx';
import Navbar from './components/Navbar.jsx';
// import function module
import { generateRandomId } from '../libs/tweet-functions.js';

// function components
const createLoadingPage = () => {
  // initial loading page when messages are unavailble
  return (
    <section className='loadingPage'>
      <p>Loading...</p>
    </section>
  );
}

const createMsgComponents = (createNewMessage, { currentUser, messages }) => {
  // initial messages are available => add MessageList and ChatBar
  // each array item needs unique key. pass the function as props to MessageList
  // createNewMessage is a function called when a user enters a new message
  return [
    <MessageList
      key={generateRandomId()}
      messages={messages}
    />,
    <ChatBar
      key={generateRandomId()}
      socket={this.state.socket}
      sendNewMessage={createNewMessage}
      currentUser={currentUser}
    />
  ];
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
    // without the line below, `this` in renderMainPage() is undefined
    this.loadMessages = this.loadMessages.bind(this);
    this.connectToWebSocket = this.connectToWebSocket.bind(this);
    this.renderMainPage = this.renderMainPage.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);
    this.tweet
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
  connectToWebSocket() {
    const socket = new WebSocket('ws://localhost:3001');
    socket.onopen = event => console.log('Connected to server');
    // save the socket instance to state
    this.setState({ socket });
  }
  // upon receiving messages, render the main page component
  // message board + chat bar
  renderMainPage() {
    const { loading, currentUser, messages } = this.state;
    return (loading)
      ? createLoadingPage()
      : createMsgComponents(this.sendNewMessage, { currentUser, messages });
  }
  // function called when user enters a new message
  // this function is passed to Chatbar.jsx
  sendNewMessage({ username, message }) {
    const incomingMessage = {
      id: generateRandomId(),
      type: 'incomingMessage',
      content: message.value
    };
    // if user changed the username, update currentUser
    (username.value) && this.setState({
      currentUser: username.value
    });
    // determine the onwership of incomingMessage
    // user changed the username => ownership: <new username>
    // no username change => ownership: currentUser
    incomingMessage.username = username.value
      ? username.value
      : this.state.currentUser;

    this.setState({ messages: this.state.messages.concat(incomingMessage) });
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
    this.connectToWebSocket();
    // mimic async api delay when importing messages
    this.loadMessages();
  }
}