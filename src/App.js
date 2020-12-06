import React from 'react';
import './App.css';
import { Route, Switch, Redirect, HashRouter, Link } from 'react-router-dom'
import LandingContainer from './Containers/LandingContainer';
import InfoContainer from './Containers/InfoContainer';
import Navbar from './Components/Nav/Navbar'

function App() {

  return (
    <div className="App">
      <HashRouter basename="/">
        <Link to='/' className="AppHeader">
          Silverstreaming Demo
        </Link>
        <Navbar />
        <Switch>
          <Route path="/home" component={LandingContainer} />
          <Route path="/info/:wb/:sessionTokenId" component={InfoContainer} /> 
          {/* <Route path="/watch/:id" component={ViewContainer} /> */}
          <Route exact path="/" render={() => (<Redirect to="/home" />)} />           
          {/* <Route path="/broadcast/:id" component={BroadcastContainer}/>       */}
          <Route path="*" render={() => (<Redirect to="/home" />)} />
        </Switch>
      </HashRouter>
      
    </div>
  );
}

export default App;
