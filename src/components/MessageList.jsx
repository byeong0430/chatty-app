import React, { Component } from 'react';
import Message from './Message.jsx';

export default class MessageList extends Component {
  createMessages() {
    return this.props.messages.map(message => {
      return <Message key={message.id} message={message} />
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
