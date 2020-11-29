import React, { useState } from 'react';
import styled from 'styled-components';
import Burger from './Burger';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const Nav = styled.nav`
  width: 100%;
  height: 30px;
  border-bottom: 2px solid #f1f1f1;
  padding: 0 0px;
  display: flex;
  justify-content: space-between;
  .logo {
    padding: 15px 0;
  }
  .g-signin2{
    
  }

`

const Navbar = () => {
  const [signedIn, setSignedIn] = useState(false);
  //const [name, setName] = useState(true);

  const responseGoogleSuccess = (response) => {
    setSignedIn(true)
    console.log(response);
  }
  
  const responseGoogle = (response) => {
    console.log(response);
  }

  function logout(){
    setSignedIn(false)
    console.log("Logged out");
  }

  function signInButton(){
    if(signedIn===true){
      return (
        <GoogleLogout
        buttonText="Logout"
        onLogoutSuccess={logout}
      >
      </GoogleLogout>
      )
    }
    else {
      return (<GoogleLogin
    clientId="307901483170-m56a98qcu5hjrtknsttovn1niepmdfn2.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={responseGoogleSuccess}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
    prompt={'consent'}
    />)
    }
  }

  return (
    <Nav>
    {signInButton()}
      <div className="logo">
      </div>
      <Burger />
      
    </Nav>
  )
}

export default Navbar