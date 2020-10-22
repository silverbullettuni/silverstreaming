import React from 'react'

class MuteMicButton extends React.Component {
    handleClick = () => {
      var video=document.getElementById("viewerVideo"); 
      if(video != null){
        if(video.muted){
          video.muted=false;
        }else{
          video.muted=true;
        }
      } 

  };
  
  render() {
    return (
      <button onClick={this.handleClick}>
         Mute microphone 
      </button>
    );
  }
}

export default MuteMicButton;