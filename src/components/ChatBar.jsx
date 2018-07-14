import React, { Component } from 'react';
import { addEnterKey } from '../../libs/tweet-functions.js';

export default class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: '',
      username: '',
      placeholder: 'Type a message and hit ENTER'
    }
  }
  // update newMessate in this.state based on input value
  onUsernameChange = ({ target: { value } }) => {
    this.setState({ username: value });
  }
  onMessageChange = ({ target: { value } }) => {
    this.setState({ newMessage: value });
  }
  // validate form parameters before sending them back to app.jsx
  validateForm = event => {
    event.preventDefault();
    const { message, username } = event.target;
    // there is a valid message
    (message.value.trim()) && (
      this.props.sendNewMessage({
        type: 'postMessage',
        content: message.value,
        username: (username.value.trim())
          ? username.value
          : this.props.currentUser.name
      }),
      // reset current message to ''
      this.setState({ newMessage: '' })
    );
    // a username changed
    (username.value.trim()) && (
      this.props.sendNewMessage({
        type: 'postNotification',
        content: username.value
      }),
      this.setState({ username: '' })
    );
  }
  makeForm = () => {
    const { newMessage, placeholder } = this.state;
    return (
        <form onSubmit={this.validateForm}>
            <input
              type='text'
              name='username'
              className="col-3 chatbar-username"
              placeholder={this.props.currentUser.name}
              onChange={this.onUsernameChange}
              value={this.state.username}
            />
            <input
              type='text'
              name='message'
              className="col-9 chatbar-message"
              placeholder={placeholder}
              onChange={this.onMessageChange}
              value={newMessage}
            />
            <input type='submit' id='submit-tweet' />
        </form>
    );
  }
  render() {
    return (
      <footer className="chatbar">
        <this.makeForm />
      </footer >
    );
  }
  componentDidMount() {
    // submit the form when enter key is detected on input[name="message"]
    addEnterKey('input[name="message"]', 'submit-tweet');
  }
}