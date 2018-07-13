import React, { Component } from 'react';
import Message from './Message.jsx';

export default class MessageList extends Component {
  createMessages() {
    const { currentUser, messages } = this.props;
    return messages.map(message => {
      return <Message key={message.id} currentUser={currentUser} message={message} />
    })
  }
  render() {
    return (
      <main className="messages">
        {this.createMessages()}
      </main>
    );
  }
}
