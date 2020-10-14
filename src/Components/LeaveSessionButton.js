import React from 'react'
import { Route, Switch, Redirect, HashRouter, Link } from 'react-router-dom'
import LandingContainer from '../Containers/LandingContainer';

class LeaveSessionButton extends React.Component {
    handleClick = () => {

  };
  
  render() {
    return (
      <button onClick={this.handleClick}>
         <Link to="/home">Leave session</Link> 
      </button>
    );
  }
}

export default LeaveSessionButton;