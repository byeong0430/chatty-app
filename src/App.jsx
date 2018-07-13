import React, { Component } from 'react';
// import initial messages
import initialMsgs from '../data-files/messages.js';
// import react components
import ChatBar from './components/ChatBar.jsx';
import MessageList from './components/MessageList.jsx';
import Navbar from './components/Navbar.jsx';
// import npm package
import uuidv4 from 'uuid/v4';

// rnadomly select a colour
const addColor = () => {
  const colors = ['red', 'blue', 'orange', 'green'];
  const colorIndex = Math.floor(Math.random() * colors.length);
  return colors[colorIndex];
};

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
      currentUser: {},
      messages: [],
      onlineClientNum: 0
    }
    this.socket = new WebSocket(`ws://localhost:3001`);

    // bind functions to this class unless you're using the ES6 style arrow
  }
  // wss: web socket server
  connectToWss = () => {
    return new Promise(resolve => {
      this.socket.onopen = () => {
        console.log('Connected to ws server');
        resolve();
      };
    });
  }
  loadInitialMessages = () => {
    setTimeout(() => {
      const { messages, currentUser: { name } } = initialMsgs;
      this.setState({
        loading: false,
        currentUser: { name, color: addColor() },
        messages
      })
    }, 1000);
  }
  // when initial messages are unavailable, display the loading page
  // when they're ready, render the main page component (message list and chatbar)
  renderMainPage = () => {
    const { loading, currentUser, messages } = this.state;
    return (loading)
      ? createLoadingPage()
      : createMsgComponents(this.sendNewMessage, { currentUser, messages });
  }
  // update currentUser in this.state
  updateCurrentUser = message => {
    const newUsername = message.content;
    this.setState(oldState => {
      oldState.currentUser.name = newUsername;
      return oldState;
    })
  }
  handleNotification = msg => {
    // first, update currentUser in this.state
    this.updateCurrentUser(msg);
    // then construct the content of the notification
    msg.content = `${this.state.currentUser.name} changed their name to ${msg.content}`;
    return msg;
  }
  sendNewMessage = message => {
    // give each message unique id
    message.id = uuidv4();
    // if message is a notification rather than a chat message, execute handleNotification()
    (message.type === 'postNotification') && this.handleNotification(message);
    // send the new message to the web socket server. make sure to convert obj to json before sending it
    this.socket.send(JSON.stringify(message));
    console.log('Message sent');
  }
  // receive message back from the web socket server
  receiveBroadcastMessage = () => {
    return new Promise((resolve, reject) => {
      this.socket.onmessage = event => {
        // convert json broadcast message to obj
        const broadcastMessage = JSON.parse(event.data);
        switch (broadcastMessage.type) {
          case 'incomingClient':
            this.setState({
              onlineClientNum: broadcastMessage.onlineClientNum
            });
            break;
          case 'incomingMessage':
            // add broadcast messages to the state
            this.setState(oldState => {
              const messages = [...oldState.messages, broadcastMessage];
              return { ...oldState, messages };
            })
            break;
          case 'incomingNotification':
            // add broadcast messages to the state
            this.setState(oldState => {
              const messages = [...oldState.messages, broadcastMessage];
              return { ...oldState, messages };
            })
            break;
          default:
            reject(`Unknown data type ${broadcastMessage.type}`)
        }
      };
      resolve('message updated');
    });
  }

  render() {
    return (
      <div>
        <Navbar onlineClientNum={this.state.onlineClientNum} />
        {this.renderMainPage()}
      </div>
    );
  }

  componentDidMount = async () => {
    // mimic async api delay when importing messages
    await this.loadInitialMessages();

    // connect ws server and handle broadcast messages
    await this.connectToWss();
    // IMPORTANT: socket.onmessage() must be within componentDidMount()
    await this.receiveBroadcastMessage();
  }
}