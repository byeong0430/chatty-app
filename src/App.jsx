import React, { Component } from 'react';
// import initial tweets
import tweets from '../data-files/tweets.json';
// import other components
import ChatBar from './components/ChatBar.jsx';
import MessageList from './components/MessageList.jsx';
import Navbar from './components/Navbar.jsx';

// function components
const createLoadingPage = () => {
  // initial loading page when tweets are unavailble
  return (
    <section className='loadingPage'>
      <p>Loading...</p>
    </section>
  );
}
const createTweetComponents = tweetData => {
  // initial tweets are available. add MessageList and ChatBar
  return [<MessageList data={tweetData} />, <ChatBar currentUser={tweetData[0].currentUser} />];
}

export default class App extends Component {
  constructor(props) {
    super(props);
    // set initial loading status to true
    this.state = {
      loading: true,
      tweets: ''
    }
    // without the line below, `this` in renderMainPage() is undefined
    this.renderMainPage = this.renderMainPage.bind(this);
  }
  renderMainPage() {
    return (this.state.loading) ? createLoadingPage() : createTweetComponents(tweets);
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
    // mimic async api call for tweets
    setTimeout(() => {
      this.setState({
        loading: false,
        tweets
      })
    }, 2000)
  }
}