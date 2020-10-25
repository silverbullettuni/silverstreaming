import React, { useState,  useRef } from 'react';

import { Link } from 'react-router-dom';

// All tokens that have started broadcasting are saved here
// TODO/WIP: MOVE THIS TO SOMEWHERE permanent/server side thingy (then import it back here?)
let tokensList = ["test"];

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
        tokenInput.current.value = token;
    }

    function validateToken(){
        const index = tokensList.indexOf(tokenId);
        console.log(tokenId);
        if(index === -1)
        {
            console.log("invalidToken")
            return false;
        }
        return true;
    }

    function invalidToken(event){
        event.preventDefault();
        alert("invalid token");
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
                <Link to={`/info/watch/${tokenId}`} onClick={e => {validateToken() === true? console.log("ok") : invalidToken(e)}} className="modeButton">
                    <button>Watch</button>
                </Link>
                <Link to={`/info/broadcast/${tokenId}`} className="modeButton">
                    <button onClick={ e=> {tokensList.push(tokenId);tokenId ===""? invalidToken(e):console.log("ok")}}>Broadcast</button>
                </Link>
            </div>
          </div>
          
      
      </div>
    );
  }
