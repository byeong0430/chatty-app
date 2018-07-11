import React, { Component } from 'react';
// import initial tweets
import tweets from '../data-files/tweets.js';
// import other components
import ChatBar from './components/ChatBar.jsx';
import MessageList from './components/MessageList.jsx';
import Navbar from './components/Navbar.jsx';
import { generateRandomId } from '../libs/tweet-functions.js';

// function components
const createLoadingPage = () => {
  // initial loading page when tweets are unavailble
  return (
    <section className='loadingPage'>
      <p>Loading...</p>
    </section>
  );
}

const createTweetComponents = (createNewMessage, { currentUser, messages }) => {
  // initial tweets are available. add MessageList and ChatBar
  // each array item needs unique key. pass the function as props to MessageList
  // createNewMessage is a function called when a user enters a new message
  return [
    <MessageList
      key={generateRandomId()}
      messages={messages}
    />,
    <ChatBar
      key={generateRandomId()}
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
      messages: []
    }
    // without the line below, `this` in renderMainPage() is undefined
    this.renderMainPage = this.renderMainPage.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);
  }

  renderMainPage() {
    const { loading, currentUser, messages } = this.state;
    return (loading)
      ? createLoadingPage()
      : createTweetComponents(this.sendNewMessage, { currentUser, messages });
  }

  // function called when user enters a new message
  // this function is passed to CHatbar.jsx
  sendNewMessage({ username, message }) {
    const incomingMessage = {
      id: generateRandomId(),
      type: 'incomingMessage',
      content: message.value
    };
    // if a new username was passed, change currentUser to the new username
    (username.value) && this.setState({
      currentUser: username.value
    });
    // incomingMessage is owned by the new username if changed.
    // otherwise, use the current username as the onwer
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

  // componentDidMount() is called after the component was rendered and it was attached to the DOM
  componentDidMount() {
    // mimic async api delay when importing tweets
    setTimeout(() => {
      this.setState({
        loading: false,
        currentUser: tweets.currentUser.name,
        messages: tweets.messages
      })
    }, 1000);
  }
}