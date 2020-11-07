import React from 'react'
import {Link } from 'react-router-dom'


class LeaveSessionButton extends React.Component {
    handleClick = () => {

  };
  
  render() {
    return (
         <Link to="/home"><button id="leaveSessionButton">Leave session</button></Link> 
    );
  }
}

export default LeaveSessionButton;