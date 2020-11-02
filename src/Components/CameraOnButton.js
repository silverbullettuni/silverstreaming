import React from 'react'

class CameraOnButton extends React.Component {
    handleClick = () => {
      const video = document.querySelector('viewerVideo');
      if(video == null){
        const video = document.querySelector('mainVideoplayer');
      }
     
      if(video != null){
        // A video's MediaStream object is available through its srcObject attribute
        const mediaStream = video.srcObject; 
        // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
        const tracks = mediaStream.getTracks();

        if(tracks != null){
            tracks[0].stop();
        }
      } 

  };
  
  render() {
    return (
      <button onClick={this.handleClick}>
         Camera on 
      </button>
    );
  }
}

export default CameraOnButton;