import React, { Component } from 'react';

// convert text url to image
const convertTextToImg = imgUrl => <img src={imgUrl} />;
// check if text contains image extensions
const checkIfImg = data => /\.(jpg|png|gif|svg|ico)$/i.test(data);
const handleMessageTypes = (msgType, msgContent) => {
  return (msgType === 'incomingNotification')
    ? <div className='col message-content notification'><em>!</em> {msgContent}</div>
    : <div className='col message-content'><em>></em> {msgContent}</div>;
};
const handleUserName = (name, cssStyle) => {
  return (name)
    && <div style={cssStyle} className="col message-username">{name}</div>;
};
export default class Message extends Component {
  constructor(props) {
    super(props);
  }
  displayMsg = () => {
    let { currentUser: { name, color }, message: { type, username, content } } = this.props;
    // set username colour
    const style = (name === username) ? { color } : null;
    // if message contains img extension, convert it to an actual img
    content = checkIfImg(content) ? convertTextToImg(content) : content;
    return (
      <div className="container message">
        {handleUserName(username, style)}
        {handleMessageTypes(type, content)}
      </div>
    );
  }
  render() {
    return (<this.displayMsg />);
  }
}