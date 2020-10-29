import React, { useState, useEffect, useContext } from 'react'

import ChatContainer from './ChatContainer';
import socketIOClient from "socket.io-client";
import LeaveSessionButton from '../Components/LeaveSessionButton';
import MuteMicButton from '../Components/MuteMicButton';
import CameraOffButton from '../Components/CameraOffButton';
import CameraOnButton from '../Components/CameraOnButton';

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
                id="viewerVideo"
                className="mainVideoPlayer"
                autoPlay 
                controls 
                playsInline
                src={source}
            />
            <div className="leaveButton">
                <MuteMicButton />
                <CameraOffButton />
                <CameraOnButton />
                <LeaveSessionButton />
            </div>     
            <ChatContainer/>

        </div>
    );
}
