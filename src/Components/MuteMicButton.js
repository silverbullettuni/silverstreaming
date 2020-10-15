import React from 'react'

class MuteMicButton extends React.Component {
    handleClick = () => {

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