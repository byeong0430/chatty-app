import React, { Component } from 'react';

export default class Navbar extends Component {
  render() {
    console.log(this.props.onlineClientNum);
    return (
      <nav className="navbar" >
        <a href="/" className="navbar-brand">Chatty</a>
        <span className='client-status'>{`${this.props.onlineClientNum} users online`}</span>
      </nav>
    );
  }
}