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
    const videoElement = useRef();
    const [hostStream, setHostStream] = useState(null);
    const [selfStream, setSelfStream] = useState(null);
    const selfVideoElement = useRef();
    const audioSelect = useRef();
    const videoSelect = useRef();

    function refreshStream(){
      let stream = selfVideoElement.current.srcObject;       
      if(stream)
      {
        stream.getTracks().forEach(track => {
          setHostConnection(prev => {
            const host = prev;
            let sender = host.getSenders().find(s => {
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
              host.addTrack(track, stream);
            }
            
            return host;
          })
        });       
      }
    }

    useEffect(() => {
      getStream()
        .then(getDevices)
        .then(gotDevices)
        .then(() => {
          console.log(selfVideoElement.current)
          console.log("Emit watcher")
          socket.emit("watcher")
        });
    }, [])

    useEffect(() => {

      socket.on("connect", () => {
        console.log("viewer connected as", socket.id);   
      });
        
      socket.on("offer", (id, description) => {
        let hostPeerConnection = new RTCPeerConnection(config);
        hostPeerConnection
          .setRemoteDescription(description)
          .then(() => hostPeerConnection.createAnswer())
          .then(sdp => hostPeerConnection.setLocalDescription(sdp))
          .then(() => {
            socket.emit("answer", id, hostPeerConnection.localDescription);
          });


        let stream = selfVideoElement.current.srcObject;
        stream.getTracks().forEach(track => {
          hostPeerConnection.addTrack(track, stream);
          
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
      
      socket.on("broadcaster", () => {
        console.log("broadcaster!")
        //socket.emit("watcher");
      });
      
      socket.on("disconnectPeer", () => {
        
        setHostConnection(prev => {
          let host = prev;
          host.close();
          return undefined;
        })
      });

      return () => {
        //console.log("Closing viewer socket connection")
        if (window.stream) {
          window.stream.getTracks().forEach(track => {
            track.stop();
          });
        }
        //socket.close();
      }

    }, []);

    useEffect(() => {
      videoElement.current.srcObject = hostStream; 
    }, [hostStream])

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
