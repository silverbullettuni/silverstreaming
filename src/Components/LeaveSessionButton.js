import React from 'react'
import {Link } from 'react-router-dom'
import { socket } from "../Services/socket"


class LeaveSessionButton extends React.Component {
    handleClick = () => {
      if(this.props.isBroadcaster == true){
        socket.emit("streamerDisconnect");
      }
  };
  
  render() {
    return (
          <Link to="/home">
            <button id="leaveSessionButton" onClick={this.handleClick}>Leave session</button>
          </Link> 
    );
  }
}

export default LeaveSessionButton;