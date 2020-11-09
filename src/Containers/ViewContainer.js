import React, { useState, useEffect, useRef } from 'react'

import ChatContainer from './ChatContainer';
import LeaveSessionButton from '../Components/LeaveSessionButton';
import MuteMicButton from '../Components/MuteMicButton';

import { socket } from "../Services/socket";

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

    const [hostConnection, setHostConnection] = useState(new RTCPeerConnection(config))
    const hostRef = useRef();
    hostRef.current = hostConnection;

    const videoElement = useRef();
    const [hostStream, setHostStream] = useState(null);
    const [selfStream, setSelfStream] = useState(null);
    const selfVideoElement = useRef();
    const audioSelect = useRef();
    const videoSelect = useRef();

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
        socket.off("offer", offer);            
        socket.off("candidate", candidate);      
        socket.off("broadcaster", broadcaster);     
        socket.off("disconnectPeer", hostDisconnect);
      }
    }, [])

    function setupListeners(){ 
      socket.on("offer", offer);            
      socket.on("candidate", candidate);      
      socket.on("broadcaster", broadcaster);     
      socket.on("disconnectPeer", hostDisconnect);
      socket.emit("watcher");
    }

    function hostDisconnect() { 
      hostRef.current.close();    
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

      window.stream.getTracks().forEach(track => {
        hostPeerConnection.addTrack(track, window.stream);          
      })
                    
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
      if(stream)
      {
        stream.getTracks().forEach(track => {
          
          let sender = hostRef.current.getSenders().find(s => {
            if(!s.track)
            {
              return false;
            }
            return s.track.kind == track.kind;
          })
          if(sender)
          {
            console.log("replace")
            sender.replaceTrack(track);
          }
          else {
            hostRef.current.addTrack(track, stream);
          }
        });       
      }
    }

    useEffect(() => {
      if (videoElement.current && hostStream) videoElement.current.srcObject = hostStream;
      if (selfVideoElement.current && selfStream) selfVideoElement.current.srcObject = selfStream;
    });

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
      setSelfStream(stream);
      refreshStream();
    }
    
    function handleError(error) {
      console.error("Error: ", error);
    }

    return (
        <div className="container">
            <select ref={audioSelect} onChange={getStream}/>
            <select ref={videoSelect} onChange={getStream}/>
            <video 
                id="viewerVideo"
                className="mainVideoPlayer"
                autoPlay 
                controls 
                playsInline
                ref={videoElement}
            />
            <video 
                className="selfVideoPlayer"
                autoPlay 
                controls 
                playsInline
                ref={selfVideoElement}
            />
            <div className="leaveButton">
                <MuteMicButton />
                <LeaveSessionButton />
            </div>     
            

        </div>
    );
}
