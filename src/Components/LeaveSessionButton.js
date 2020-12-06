import React from 'react'
import {Link } from 'react-router-dom'
import { socket } from "../Services/socket"


class LeaveSessionButton extends React.Component {
    handleClick = () => {
      if(this.props.isBroadcaster === true){
        socket.emit("streamerDisconnect");
      }
  };
  
  render() {
    return (
          <Link id="leaveSessionButton" onClick={this.handleClick} to="/home">
            <button>Leave session</button>
          </Link> 
    );
  }
}

export default LeaveSessionButton;