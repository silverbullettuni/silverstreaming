import React, { useState, useEffect, useRef, createContext } from 'react';

import { Route, Switch, Redirect, HashRouter, Link } from 'react-router-dom';

export const userContext = createContext();

export default function LandingContainer() {

    const [participant, setParticipant] = useState("")
    
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
        tokenInput.current.value = token;
    }

    function handleUser(){
        let user = window.prompt('Please enter your username ')
        if (!user){ user = Date.now() }
        setParticipant(user)
    }

    return (
      <div className="container">
          <div className="landingInputBox">
            <div className="tokenGenerator">
                <button onClick={generateToken}>Generate token</button>
            </div>
            <div className="input">
                <label htmlFor="#tokenIdInput">Token</label>
                <input id="tokenIdInput" ref={tokenInput} onChange={event => setTokenId(event.target.value)} placeholder="Input token id"/>
            </div>
            <div className="buttons">
                <Link to={`/watch/${tokenId}`} className="modeButton">
                    <button onClick={handleUser}>Watch</button>
                    <userContext.Provider value={participant}></userContext.Provider>
                </Link>
                <Link to={`/broadcast/${tokenId}`} className="modeButton">
                    <button onClick={handleUser}>Broadcast</button>
                    <userContext.Provider value={participant}></userContext.Provider>
                </Link>
            </div>
          </div>
          
      
      </div>
    );
  }
  