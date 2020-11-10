import React, { useState, useEffect, useRef, createContext, useContext } from 'react'

import ChatContainer from './ChatContainer';
import ParticipantsContainer from './ParticipantsContainer';
import { socket } from "../Services/socket";

import { DataContext } from './InfoContainer'

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

export const broadcasterContext = createContext();

export default function BroadcastContainer(props) {

    const audioSelect = useRef();
    const videoSelect = useRef();
    const videoElement = useRef();
    const selfVideoElement = useRef(null);

    const data = useContext(DataContext);

    const testParticipants = [
      { id: "1", src: "1s" },
      { id: "2", src: "2s" },
      { id: "3", src: "3s" },
      { id: "4", src: "4s" },
      { id: "5", src: "5s" },
      { id: "6", src: "6s" },
      { id: "7", src: "7s" },
      { id: "8", src: "8s" },
      { id: "9", src: "9s" },
    ]

    const [participants, setParticipants] = useState(testParticipants); // temp
    const [peers, setPeers] = useState(new Map());
    const [peerStreams, setPeerStreams] = useState(new Map());
    const [selectedParticipant, setSelectedParticipant] = useState(undefined);

    function selectParticipant(participant){
      setSelectedParticipant(participant);
    }

    useEffect(() => {
      getStream()
        .then(getDevices)
        .then(gotDevices)
        .then(setupListeners)

      return () => {
        if (window.stream) {
          window.stream.getTracks().forEach(track => {
            track.stop();
          });
        }
        socket.off("watcher", watcher);       
        socket.off("answer", answer);
        socket.off("candidate", candidate);
        socket.off("disconnectPeer", peerDisconnected);
      }
    }, [])

    function setupListeners(){
      socket.on("watcher", watcher);       
      socket.on("answer", answer);
      socket.on("candidate", candidate);
      socket.on("disconnectPeer", peerDisconnected);
      socket.emit("broadcaster");
    }

    function watcher(id) {
      const peerConnection = new RTCPeerConnection(config);    
      console.log("new watcher", id);  


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
      console.log("Disconnected", id);
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
        console.log(newPeerStreams);
        return newPeerStreams;
      });
    }

    function refreshStream(){
      let stream = window.stream;       
      if(stream)
      {
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
    }

    function getDevices() {
      return navigator.mediaDevices.enumerateDevices();
    }
      
    function gotDevices(deviceInfos) {
      window.deviceInfos = deviceInfos;
      for (const deviceInfo of deviceInfos) {
        const option = document.createElement("option");
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === "audioinput") {
          option.text = deviceInfo.label || `Microphone ${audioSelect.current.length + 1}`;
          audioSelect.current.appendChild(option);
        } else if (deviceInfo.kind === "videoinput") {
          option.text = deviceInfo.label || `Camera ${videoSelect.current.length + 1}`;
          videoSelect.current.appendChild(option);
        }
      }
    }
    
    function getStream() {
      if (window.stream) {
        window.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      const audioSource = audioSelect.current.value;
      const videoSource = videoSelect.current.value;
      const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
      };
      return navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .catch(handleError);
    }
    
    function gotStream(stream) {
      window.stream = stream;
      audioSelect.current.selectedIndex = [...audioSelect.current.options].findIndex(
        option => option.text === stream.getAudioTracks()[0].label
      );
      videoSelect.current.selectedIndex = [...videoSelect.current.options].findIndex(
        option => option.text === stream.getVideoTracks()[0].label
      );
      selfVideoElement.current.srcObject = stream;
      refreshStream();
      
    }
    
    function handleError(error) {
      console.error("Error: ", error);
    }

    return (
        <div className="container">
            <span>{selectedParticipant?.id}</span>
            <select ref={audioSelect} onChange={getStream}/>
            <select ref={videoSelect} onChange={getStream}/>
            <video 
                id="streamerVideo"
                className="mainVideoPlayer"
                autoPlay 
                controls 
                playsInline       
                poster={process.env.PUBLIC_URL + "/michael-afonso-z8Tul255kGg-unsplash.jpg"}
                src={selectedParticipant?.src}
                ref={videoElement}
            />
            <video 
                className="selfVideoPlayer"
                autoPlay 
                controls 
                playsInline
                ref={selfVideoElement}
            />

            <ParticipantsContainer participants={participants} peerStreams={peerStreams} selectParticipant={selectParticipant}/>
                  

        </div>
    );
}