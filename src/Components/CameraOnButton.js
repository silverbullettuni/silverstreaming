import React from 'react'

class CameraOnButton extends React.Component {
    handleClick = () => {
      let stream = window.stream;
      const tracks = stream.getTracks();

      if(tracks != null){
          tracks[1].enabled = true;
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