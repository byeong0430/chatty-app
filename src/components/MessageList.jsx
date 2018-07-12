import React, { Component } from 'react';
import Message from './Message.jsx';

export default class MessageList extends Component {
  createMessages() {
    // filter all notification messages
    const { messages } = this.props;
    const alerts = messages.filter(message => message.type === 'incomingNotification');

    return messages.map(message => {
      // for each incomingMessage, check if there is any notification associated with it
      // if so, pass the alert to Message.jsx as props
      if (message.type === 'incomingMessage') {
        const thisAlert = alerts.filter(alert => alert.referenceTo === message.id);
        return <Message key={message.id} alert={thisAlert} message={message} />
      }
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
