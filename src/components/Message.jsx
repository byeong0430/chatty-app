import React, { Component } from 'react';

export default class Message extends Component {
  constructor(props) {
    super(props);
  }
  displayMsg = () => {
    const { currentUser: { name, color }, message: { username, content } } = this.props;
    const style = (name === username) ? { color } : null;
    return (
      <div>
        <div className="message">
          <span style={style} className="message-username">{username}</span>
          <span className="message-content">{content}</span>
        </div>
      </div>
    );
  }
  render() {
    return (<this.displayMsg />);
  }
}