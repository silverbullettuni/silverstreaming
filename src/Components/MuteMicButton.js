import React from 'react'

class MuteMicButton extends React.Component {
    handleClick = () => {

      let audioStream = window.stream;
      const audioTracks = audioStream.getTracks();

      if(audioTracks != null){
        if(audioTracks[0].enabled){
          audioTracks[0].enabled = false;
          document.getElementById("toggleMicButton").innerHTML = "Unmute microphone";
        }else{
          audioTracks[0].enabled = true;
          document.getElementById("toggleMicButton").innerHTML = "Mute microphone";
        }
      } 

  };
  
  render() {
    return (
      <button id="toggleMicButton" onClick={this.handleClick}>
         Mute microphone 
      </button>
    );
  }
}

export default MuteMicButton;