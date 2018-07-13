import React, { Component } from 'react';

export default class Navbar extends Component {
  render() {
    const clientStatus = (this.props.onlineClientNum > 0) && `${this.props.onlineClientNum} users online`;
    return (
      <header>
        <nav className="navbar" >
          <a href="/" className="navbar-brand">Chatty</a>
          <span className='client-status'>{clientStatus}</span>
        </nav>
      </header>
    );
  }
}