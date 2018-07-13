import React, { Component } from 'react';

// convert text url to image
const convertTextToImg = imgUrl => <img src={imgUrl} />;
// check if text contains image extensions
const checkIfImg = data => /\.(jpg|png|gif|svg|ico)$/i.test(data);

export default class Message extends Component {
  constructor(props) {
    super(props);
  }
  displayMsg = () => {
    let { currentUser: { name, color }, message: { username, content } } = this.props;
    const style = (name === username) ? { color } : null;
    content = checkIfImg(content) ? convertTextToImg(content) : content;
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