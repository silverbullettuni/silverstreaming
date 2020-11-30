import React from 'react'

class CameraToggleButton extends React.Component {
    handleClick = () => {
      let stream = window.stream;
      const tracks = stream.getTracks();

      const check = document.getElementById("toggleCameraButton").innerHTML;
 
      if (check == "Turn Camera Off") {
        document.getElementById("toggleCameraButton").innerHTML = "Turn Camera On";
        tracks[1].enabled = false;
      }
      else {
        document.getElementById("toggleCameraButton").innerHTML = "Turn Camera Off";
        tracks[1].enabled = true;
      }
  };
  
  render() {
    return (
      <button id="toggleCameraButton" onClick={this.handleClick}>
         Turn Camera Off
      </button>
    );
  }
}

export default CameraToggleButton;