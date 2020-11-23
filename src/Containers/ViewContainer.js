import React, { useState, useEffect, useRef } from 'react'

import LeaveSessionButton from '../Components/LeaveSessionButton';
import MuteMicButton from '../Components/MuteMicButton';

import { socket } from "../Services/socket";
import ChatContainer from "./ChatContainer";

const config = {
  iceServers: [
    {
      "urls": "stun:stun.l.google.com:19302",
    },
    { 
      "urls": "turn:silverstream.dy.fi:12779",
      "username": "testuser",
      "credential": "testpassword"
    }
  ]
};

export default function ViewContainer(props) {

    const [hostConnection, setHostConnection] = useState(new RTCPeerConnection(config))
    const hostRef = useRef();
    hostRef.current = hostConnection;

    const videoElement = useRef();
    const [hostStream, setHostStream] = useState(null);
    const [selfStream, setSelfStream] = useState(null);
    const selfVideoElement = useRef();

    useEffect(() => {
      setupListeners();
      refreshStream();  

      return () => {
        if (window.stream) {
          window.stream.getTracks().forEach(track => {
            track.stop();
          });
        }  
        socket.off("offer", offer);            
        socket.off("candidate", candidate);      
        socket.off("broadcaster", broadcaster);     
        socket.off("disconnectPeer", hostDisconnect);
        socket.off("streamerTimeouted", streamerTimeout);
        window.removeEventListener('refreshStream', refreshStream);
      }
      function setupListeners(){ 
        window.addEventListener('refreshStream', refreshStream);
        socket.on("offer", offer);            
        socket.on("candidate", candidate);      
        socket.on("broadcaster", broadcaster);     
        socket.on("disconnectPeer", hostDisconnect);
        socket.on("streamerTimeouted", streamerTimeout);
        socket.emit("watcher");
      }
    }, [])



    function hostDisconnect() { 
      hostRef.current.close();    
    }
  
    function streamerTimeout(){
      window.location.reload();
    }

    function offer(id, description) {
      const hostPeerConnection = new RTCPeerConnection(config);
      hostPeerConnection
        .setRemoteDescription(description)
        .then(() => hostPeerConnection.createAnswer())
        .then(sdp => hostPeerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answer", id, hostPeerConnection.localDescription);
        });

      if(window.stream){
        window.stream.getTracks().forEach(track => {
          hostPeerConnection.addTrack(track, window.stream);          
        })
      }
                          
      hostPeerConnection.ontrack = event => {
        setHostStream(event.streams[0]);    
      };
      
      hostPeerConnection.onicecandidate = event => {
        if (event.candidate) {             
          socket.emit("candidate", id, event.candidate);
        }
      };

      setHostConnection(hostPeerConnection);

    }

    function candidate(id, candidate) {
      hostRef.current 
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch(e => console.error(e));
    }

    function broadcaster() {
      socket.emit("watcher");
    }

    function refreshStream(){  
      let stream = window.stream;
      if(!stream){
        return;
      }
      setSelfStream(stream);
      stream.getTracks().forEach(track => {
        
        let sender = hostRef.current.getSenders().find(s => {
          if(!s.track)
          {
            return false;
          }
          return s.track.kind === track.kind;
        })
        if(sender)
        {
          sender.replaceTrack(track);
        }
        else {
          hostRef.current.addTrack(track, stream);
        }
      });       
      
    }

    useEffect(() => {
      if (videoElement.current && hostStream) videoElement.current.srcObject = hostStream;
      if (selfVideoElement.current && selfStream) selfVideoElement.current.srcObject = selfStream;
    });

    return (
        <div className="container">
            <div className="mainVideoContainer">
              <video 
                  id="viewerVideo"
                  className="mainVideoPlayer"
                  autoPlay 
                  controls 
                  playsInline
                  poster={process.env.PUBLIC_URL + "/drew-graham-PVyhz0wmHdo-unsplash.jpg"}
                  ref={videoElement}
              />
              <video 
                  className="selfVideoPlayer"
                  autoPlay 
                  playsInline
                  muted
                  ref={selfVideoElement}
              />
            </div>
            
            <div className="leaveButton">
                <MuteMicButton />
                <LeaveSessionButton />
            </div>     
            
            <ChatContainer/>
        </div>
    );
}
