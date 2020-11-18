import React from 'react'

class CameraOffButton extends React.Component {
    handleClick = () => {
        let stream = window.stream;
        const tracks = stream.getTracks();

        if(tracks != null){
            tracks[1].enabled = false;
        }


  };
  
  render() {
    return (
      <button onClick={this.handleClick}>
         Camera off 
      </button>
    );
  }
}

export default CameraOffButton;