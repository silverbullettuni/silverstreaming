import React, { useState, useEffect, createContext, useContext } from 'react'

import ChatContainer from './ChatContainer';
import socketIOClient from "socket.io-client";

export const userContext = createContext();

const config = {
    iceServers: [
        { 
          "urls": "stun:stun.l.google.com:19302",
        },
        // { 
        //   "urls": "turn:TURN_IP?transport=tcp",
        //   "username": "TURN_USERNAME",
        //   "credential": "TURN_CREDENTIALS"
        // }
    ]
  };

export default function ViewContainer(props) {
    const [source, setSource] = useState("");
    let peerConnection;
    const [participant, setParticipant] = useState([]);

    let user;

    useEffect(() => {
      if (window.sessionStorage.getItem('userData') === null){
        user = window.prompt('Please enter your username ');
        if (!user){ user = Date.now() }
        setParticipant(user);

        window.sessionStorage.setItem('userData', user)
      }else{
        let getUser = window.sessionStorage.getItem('userData');
        setParticipant(getUser);
      }
      
    },[])

    /*useEffect(() => {
        const socket = socketIOClient(window.location.origin);
        socket.on("offer", (id, description) => {
            peerConnection = new RTCPeerConnection(config);
            peerConnection
              .setRemoteDescription(description)
              .then(() => peerConnection.createAnswer())
              .then(sdp => peerConnection.setLocalDescription(sdp))
              .then(() => {
                socket.emit("answer", id, peerConnection.localDescription);
              });
            peerConnection.ontrack = event => {
                setSource(event.streams[0]);
              
            };
            peerConnection.onicecandidate = event => {
              if (event.candidate) {
                socket.emit("candidate", id, event.candidate);
              }
            };
          });
          
          
          socket.on("candidate", (id, candidate) => {
            peerConnection
              .addIceCandidate(new RTCIceCandidate(candidate))
              .catch(e => console.error(e));
          });
          
          socket.on("connect", () => {
            socket.emit("watcher");
          });
          
          socket.on("broadcaster", () => {
            socket.emit("watcher");
          });
          
          socket.on("disconnectPeer", () => {
            peerConnection.close();
          });

          return () => socket.disconnect();

    }, []);*/

    return (
        <div className="container">
            <video 
                className="mainVideoPlayer"
                autoPlay 
                controls 
                playsInline
                src={source}
            />
            <userContext.Provider value={participant}>
              <ChatContainer/>
            </userContext.Provider>
        </div>
    );
}
