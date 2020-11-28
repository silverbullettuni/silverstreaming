import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { useParams, useHistory  } from "react-router-dom";

import ParticipantsContainer from './ParticipantsContainer';
import { socket } from "../Services/socket";
import ChatContainer from "./ChatContainer";
// import { DataContext } from './InfoContainer'

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

export const broadcasterContext = createContext();

export default function BroadcastContainer(props) {

    let { sessionTokenId } = useParams();
    let history = useHistory();
    const videoElement = useRef();
    const selfVideoElement = useRef(null);

    const [peers, setPeers] = useState(new Map());
    const [peerStreams, setPeerStreams] = useState(new Map());
    const [selfStream, setSelfStream] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState(undefined);

    function selectParticipant(participant){
      let selected = peerStreams.get(participant)
      if(videoElement.current.srcObject == selfVideoElement.current.srcObject){
        videoElement.current.muted = false;
      }
      videoElement.current.srcObject = selected;     
      setSelectedParticipant(participant);
    }

    function selectSelf(){
      videoElement.current.srcObject = selfVideoElement.current.srcObject;
      videoElement.current.muted = true;
      setSelectedParticipant(undefined);
    }

    useEffect(() => {
      setupListeners();
      refreshStream(); 

      return () => {
        if (window.stream) {
          window.stream.getTracks().forEach(track => {
            track.stop();
          });
        }
        socket.off("broadcasterExists", broadcasterExists);
        socket.off("watcher", watcher);       
        socket.off("answer", answer);
        socket.off("candidate", candidate);
        socket.off("disconnectPeer", peerDisconnected);
        window.removeEventListener('refreshStream', refreshStream);
      }
    }, [])

    function setupListeners(){
      window.addEventListener('refreshStream', refreshStream);
      socket.on("broadcasterExists", broadcasterExists);
      socket.on("watcher", watcher);       
      socket.on("answer", answer);
      socket.on("candidate", candidate);
      socket.on("disconnectPeer", peerDisconnected);
      socket.emit("broadcaster", sessionTokenId);
    }

    function exit(){
      history.push('/');
    }

    function broadcasterExists(){
      window.alert("Another broadcaster already in session");
      exit();
    }

    function watcher(id) {
      const peerConnection = new RTCPeerConnection(config);    

      let stream = window.stream;
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);          
      })
                       
      peerConnection.ontrack = event => {
        setPeerStreams(prev => {
          return new Map([...prev, [id, event.streams[0]]]);
        })  
      };
            
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
      
      peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offer", id, peerConnection.localDescription);
        });
      
      setPeers(prev => {
        return new Map([...prev, [id, peerConnection]]);
      });
      
    }

    function answer(id, description) {
      setPeers(prev => {          
        const newPeers = new Map(prev);
        let peer = newPeers.get(id);
        peer.setRemoteDescription(description);
        return newPeers;
      })
    }

    function candidate(id, candidate) {
      setPeers(prev => {
        const newPeers = new Map(prev);
        newPeers.get(id).addIceCandidate(new RTCIceCandidate(candidate));
        return newPeers;
      })
      
    }

    function peerDisconnected(id) {   

      setPeers(prev => {
        const newPeers = new Map(prev);
        let peer = newPeers.get(id);
        if(peer){
          peer.close();
        }
        newPeers.delete(id);
        return newPeers;
      });       
      setPeerStreams(prev => {
        const newPeerStreams = new Map(prev);
        newPeerStreams.delete(id);

        return newPeerStreams;
      });
    }

    function refreshStream(){
      let stream = window.stream;    
      if(!stream){
        return;
      }   
      setSelfStream(stream);
      stream.getTracks().forEach(track => {
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.forEach(peer => {
            let sender = peer.getSenders().find(s =>{
              if(!s.track)
              {
                return false;
              }
              return s.track.kind == track.kind;
            })
            if(sender)
            {
              sender.replaceTrack(track);
            }
            else {
              peer.addTrack(track, stream);
            }
            
          })

          return newPeers;
        })

      });       
      
    }

    useEffect(() => {
      if (selfVideoElement.current && selfStream) selfVideoElement.current.srcObject = selfStream;
    });

    return (
        <div className="container">
            <span id='currentParticipantId' >{selectedParticipant?.id}</span>
            <div className="mainVideoContainer">
              <video 
                  id="streamerVideo"
                  className="mainVideoPlayer"
                  autoPlay 
                  controls 
                  playsInline       
                  poster={process.env.PUBLIC_URL + "/michael-afonso-z8Tul255kGg-unsplash.jpg"}
                  ref={videoElement}
              />
              <video 
                  className="selfVideoPlayer"
                  autoPlay 
                  muted
                  playsInline
                  onClick={selectSelf}
                  ref={selfVideoElement}
              />
            </div>
            
            <ParticipantsContainer peerStreams={peerStreams} selectParticipant={selectParticipant} isBroadcaster={true}/>
            <ChatContainer/>

        </div>
    );
}