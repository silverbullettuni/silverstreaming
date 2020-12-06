import React from 'react'
import {Link } from 'react-router-dom'
import { socket } from "../Services/socket"


class LeaveSessionButton extends React.Component {
//Disconnects the streamer   
    handleClick = () => {
      if(this.props.isBroadcaster == true){
        socket.emit("streamerDisconnect");
      }
  };
//React Button component
  render() {
    return (
          <Link id="leaveSessionButton" onClick={this.handleClick} to="/home">
            <button>Leave session</button>
          </Link> 
    );
  }
}

export default LeaveSessionButton;