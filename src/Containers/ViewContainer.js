import React, { useState, useEffect, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom";

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
/**
* ViewContainer contains the view and components for the stream participants/watchers
*/
export default function ViewContainer(props) {

    let { sessionTokenId } = useParams();
    let history = useHistory();
    const [hostConnection, setHostConnection] = useState(new RTCPeerConnection(config))
    const hostRef = useRef();
    hostRef.current = hostConnection;

    const videoElement = useRef();
    const [hostStream, setHostStream] = useState(null);
    const [selfStream, setSelfStream] = useState(null);
    const selfVideoElement = useRef();

    // Initial setup
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
        socket.off("roomAlreadyFull", roomAlreadyFull);
        window.removeEventListener('refreshStream', refreshStream);
      }

    /**
    * Set up all socket listeners as well as a listener for the stream refresh event sent by the AV selects
    */
    function setupListeners(){ 
      window.addEventListener('refreshStream', refreshStream);
      socket.on("offer", offer);            
      socket.on("candidate", candidate);      
      socket.on("broadcaster", broadcaster);     
      socket.on("disconnectPeer", hostDisconnect);
      socket.on("streamerTimeouted", streamerTimeout);
      socket.on("roomAlreadyFull", roomAlreadyFull);
      socket.emit("watcher", sessionTokenId);
    }
        /**
    * When broadcaster connects
    */
   function broadcaster() {
    socket.emit("watcher", sessionTokenId);
  }

  /**
  * When the room is full.
  */
  function roomAlreadyFull(){
    window.alert("Sorry but this session is full.");
    exit();
  }

    /**
    * When the broadcaster has disconnected (timeout)
    */
   function streamerTimeout(){
    window.alert("The session has ended");
    exit();
  }


    /**
    * Return to landing page
    */
   function exit(){
    history.push('/');
  }

    }, [sessionTokenId, history])


    /**
    * When the broadcaster disconnects
    */
    function hostDisconnect() { 
      hostRef.current.close();    
    }
  
  

    /**
    * When the broadcaster sends a connection offer 
    * @param {string} id Connection socket id
    * @param {RTCSessionDescription} description localDescription of this watcher as set by the broadcaster
    */
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

    /**
    * Add socket as an ICE candidate 
    * @param {string} id Connection socket id
    * @param {RTCIceCandidate} candidate Candidate from the peer connection ICE event
    */
    function candidate(id, candidate) {
      hostRef.current 
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch(e => console.error(e));
    }




    /**
    * Refresh self-stream and tracks for all connected peers
    */
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

    // Set source for broadcaster video element and self-video element when their respective streams are available and set
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
               
            
            <ChatContainer/>
        </div>
    );
}
