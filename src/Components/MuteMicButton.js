import React from 'react'

class MuteMicButton extends React.Component {
    handleClick = () => {

      let audioStream = window.stream;
      const audioTracks = audioStream.getTracks();

      // Checks if audio is enabled or not so changes the button text accordingly
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
  
  // Returns this react component
  render() {
    return (
      <button id="toggleMicButton" onClick={this.handleClick}>
         Mute microphone 
      </button>
    );
  }
}

export default MuteMicButton;