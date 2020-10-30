import React from 'react'

class MuteMicButton extends React.Component {
    handleClick = () => {

      var video=document.getElementById("viewerVideo"); 
      if(video != null){
        var video=document.getElementById("mainVideoPlayer"); 
      }


      if(video != null){
        if(video.muted){
          video.muted=false;
          document.getElementById("toggleMicButton").innerHTML = "Mute microphone";
        }else{
          video.muted=true;
          document.getElementById("toggleMicButton").innerHTML = "Unmute microphone";
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