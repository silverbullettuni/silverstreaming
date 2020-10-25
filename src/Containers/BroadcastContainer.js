import React, { useState, useEffect, useRef, createContext } from 'react'
import ChatContainer from './ChatContainer';
import ParticipantsContainer from './ParticipantsContainer';
import socketIOClient from "socket.io-client";

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

export const broadcasterContext = createContext();

export default function BroadcastContainer(props) {

    const audioSelect = useRef();
    const videoSelect = useRef();
    const videoElement = useRef();
    const socket = socketIOClient(ENDPOINT);

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
    const [selectedParticipant, setSelectedParticipant] = useState(undefined);

    function selectParticipant(participant){
      setSelectedParticipant(participant);
    }

    const [broadcaster, setBroadcaster] = useState([])
    useEffect(() => {
      let user = window.prompt('Please enter your username ');
      if (!user){ user = Date.now() }
      setBroadcaster(user);
    },[])

    useEffect(() => {
      getStream()
        .then(getDevices)
        .then(gotDevices);
    }, [])

    useEffect(() => {
                
      socket.on("watcher", id => {
        const peerConnection = new RTCPeerConnection(config);      

        let stream = videoElement.current.srcObject;       
        if(stream)
        {
          stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        }
              
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

      });    

      return () => socket.disconnect();

    }, []);

    useEffect(() => {

      socket.on("answer", (id, description) => {
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.get(id).setRemoteDescription(description);
          return newPeers;
        })
      });

      socket.on("candidate", (id, candidate) => {
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.get(id).addIceCandidate(new RTCIceCandidate(candidate));
          return newPeers;
        })
        
      });

      socket.on("disconnectPeer", id => {         
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.delete(id);
          return newPeers;
        });       
      });

    }, [peers]);

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
      videoElement.current.srcObject = stream;
      socket.emit("broadcaster");
    }
    
    function handleError(error) {
      console.error("Error: ", error);
    }

    return (
        <div className="container">
            <span>{selectedParticipant?.id}</span>
            <select ref={audioSelect}/>
            <select ref={videoSelect}/>
            <video 
                className="mainVideoPlayer"
                autoPlay 
                controls 
                playsInline
                src={selectedParticipant?.src}
                ref={videoElement}
            />  

            <ParticipantsContainer participants={participants} selectParticipant={selectParticipant}/>

            <broadcasterContext.Provider value={broadcaster}>
              <ChatContainer/>
            </broadcasterContext.Provider>         

        </div>
    );
}






