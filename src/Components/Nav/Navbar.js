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
  .googleLogin{
    position: absolute;
    top: 5px;
    right: 70px;
    z-index: 2;
    display: none;
  }

`

const Navbar = () => {


  const responseGoogleSuccess = (response) => {
    localStorage.setItem('loginToken', response.tokenId);
    console.log(response);
    window.location.reload(false);
  }
  
  const responseGoogle = (response) => {
    console.log(response);
  }

  function logout(){
    localStorage.removeItem('loginToken');
    console.log("Logged out");
    window.location.reload(false);
  }

  function signInButton(){
    if(localStorage.getItem('loginToken') !== null){
      return (
        <GoogleLogout
        clientId="307901483170-m56a98qcu5hjrtknsttovn1niepmdfn2.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={logout}
        className="googleLogin"
      >
      </GoogleLogout>
      )
    }
    else {
      return (<GoogleLogin
    clientId="307901483170-m56a98qcu5hjrtknsttovn1niepmdfn2.apps.googleusercontent.com" // Change your own here
    buttonText="Login"
    onSuccess={responseGoogleSuccess}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
    prompt={'consent'}
    className="googleLogin"
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