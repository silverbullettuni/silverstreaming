import React from 'react'
import { Route, Switch, Redirect, HashRouter, Link } from 'react-router-dom'
import LandingContainer from '../Containers/LandingContainer';

class InviteLinkButton extends React.Component {
    handleClick = () => { 
    //  var url = window.location.href;
    //  console.log("link "+ url);
    //  document.getElementById("watchUrl").innerHTML = url;
    //  document.execCommand("copy");
  };
  
  render() {
    return (
      <Link to="/watch"><button>Link to stream</button></Link> 
    );
  }
}

export default InviteLinkButton;