import React, { Component } from 'react';

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.displayMsg = this.displayMsg.bind(this);
  }
  displayMsg() {
    const { message: { username, content } } = this.props;
    return (
      <div>
        <div className="message">
          <span className="message-username">{username}</span>
          <span className="message-content">{content}</span>
        </div>
      </div>
    );
  }
  render() {
    return (<this.displayMsg />);
  }
}