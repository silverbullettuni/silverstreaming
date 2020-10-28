import React, { useState, useEffect, useRef } from 'react'

import ChatContainer from './ChatContainer';
import socketIOClient from "socket.io-client";
import LeaveSessionButton from '../Components/LeaveSessionButton';
import MuteMicButton from '../Components/MuteMicButton';

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

const ENDPOINT = window.location.hostname + ":4000";

export default function ViewContainer(props) {

  const [hostConnection, setHostConnection] = useState({})
  const socket = socketIOClient(ENDPOINT);
  const videoElement = useRef();

  useEffect(() => {

    socket.on("offer", (id, description) => {
      let peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          console.log("answer " + peerConnection.localDescription);
          socket.emit("answer", id, peerConnection.localDescription);
        });

      peerConnection.ontrack = event => {
        videoElement.current.srcObject = event.streams[0];
      };

      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };

      setHostConnection(peerConnection);

    });

    socket.on("candidate", (id, candidate) => {
      setHostConnection(prev => {
        let host = prev;
        host
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch(e => console.error(e));
        return host;
      })
    });

    socket.on("connect", () => {
      socket.emit("watcher");
    });

    socket.on("broadcaster", () => {
      socket.emit("watcher");
    });

    socket.on("disconnectPeer", () => {

      setHostConnection(prev => {
        let host = prev;
        host.close();
        return undefined;
      })
    });

    return () => socket.disconnect();

  }, []);

  return (
    <div className="container">
      <video
        id="viewerVideo"
        className="mainVideoPlayer"
        autoPlay
        controls
        playsInline
        poster={process.env.PUBLIC_URL + "/drew-graham-PVyhz0wmHdo-unsplash.jpg"}
        ref={videoElement}
      />
      <div className="leaveButton">
        <MuteMicButton />
        <LeaveSessionButton />
      </div>
      <ChatContainer />

    </div>
  );
}
