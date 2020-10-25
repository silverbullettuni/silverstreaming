import React from 'react'
import { Route, Switch, Redirect, HashRouter, Link } from 'react-router-dom'
import LandingContainer from '../Containers/LandingContainer';

class LeaveSessionButton extends React.Component {
    handleClick = () => {

  };
  
  render() {
    return (

         <Link to="/home"><button>Leave session</button></Link> 

    );
  }
}

export default LeaveSessionButton;