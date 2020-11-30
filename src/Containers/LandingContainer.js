import React, { useState,  useRef } from 'react';

import { Link } from 'react-router-dom';

/**
* Container for host/watch selection and session token generation
*/
export default function LandingContainer() {

    const [tokenId, setTokenId] = useState("");
    const tokenInput = useRef();
  
    function generateToken(){
        let token = '';
        const chars = "ABCDEFGHJKLMNPQRSTUVXYZabcdefghijklmnopqrstuvwxyz23456789"
        const charlen = chars.length;
        let pointer = 0;
        for (let i = 0; i < 12; i++){
            pointer = Math.floor(Math.random()*charlen);
            token += chars.charAt(pointer);
        }

        setTokenId(token);
        sessionStorage.setItem('token', token);
        tokenInput.current.value = token;
    }


    return (
      <div className="container">
          <div className="landingInputBox">
            <div className="tokenGenerator">
                <button id="TokenGeneratorButton" onClick={generateToken}>Generate token</button>
            </div>
            <div className="input">
                <label htmlFor="#tokenIdInput">Token</label>
                <input id="tokenIdInput" ref={tokenInput} onChange={event => setTokenId(event.target.value)} placeholder="Input token id"/>
            </div>
            <div className="buttons">
                <Link to={`/info/watch/${tokenId}`} className="modeButton">
                    <button id="ViewerButton">Watch</button>
                 </Link>
                <Link to={`/info/broadcast/${tokenId}`} className="modeButton">
                    <button id="BroadcastButton">Broadcast</button>
                </Link>
            </div>
          </div>
          
      
      </div>
    );
  }
  