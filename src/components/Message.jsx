import React, { Component } from 'react';

// convert text url to image
const convertTextToImg = imgUrl => <img src={imgUrl} />;
// check if text contains image extensions
const checkIfImg = data => /\.(jpg|png|gif|svg|ico)$/i.test(data);
const handleMessageTypes = (msgType, msgContent) => {
  // character that a message starts with
  let textStarter = '>';
  // default classname
  let className = 'message-content';
  (msgType === 'incomingNotification') && (
    // for notifications, add 'notofication' at the end of the default className
    className = className + ' notification',
    // change textStarter from '>' to '!'
    textStarter = '!'
  )
  return <div className={className}><strong>{textStarter}</strong> {msgContent}</div>
};
const handleUserName = (name, cssStyle) => name && <div style={cssStyle} className="message-username">{name}</div>;

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