import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Select = styled.select`
  /* Adapt the colors based on primary prop */
  background: "white"};
  color: "teal"};

  font-size: 1em;
  margin: 0em;
  padding: 0.15em 1em;
  border: 3px solid teal;
  border-radius: 3px;
`;

const refreshStream = new CustomEvent('refreshStream');

const AVSelect = () => {

    const audioSelect = useRef();
    const videoSelect = useRef();

    useEffect(() => {
        try {
          getStream()
            .then(getDevices)
            .then(gotDevices)
        }
        catch(error){
          handleError(error);
        }
      window.addEventListener('resetMedia', getStream);  
      return () => {
        window.removeEventListener('resetMedia', getStream);
      }
    }, [])

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
    
    function gotStream(stream) {
      window.stream = stream;
      audioSelect.current.selectedIndex = [...audioSelect.current.options].findIndex(
        option => option.text === stream.getAudioTracks()[0].label
      );
      videoSelect.current.selectedIndex = [...videoSelect.current.options].findIndex(
        option => option.text === stream.getVideoTracks()[0].label
      );

      window.dispatchEvent(refreshStream);
    }
    
    function handleError(error) {
      console.error("Error: ", error);
    }
    
    return (
      <>
        <p>Select Microphone</p>
        <Select ref={audioSelect} onChange={getStream}/>
        <p>Select Webcam</p>
        <Select ref={videoSelect} onChange={getStream}/>
      </>
    )
  }
  export default AVSelect