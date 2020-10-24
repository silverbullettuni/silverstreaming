import React from 'react'

class MuteMicButton extends React.Component {
    handleClick = () => { 
        var url = window.location.href;
        document.execCommand("copy");

  };
  
  render() {
    return (
      <button onClick={this.handleClick}>
         Invite link
      </button>
    );
  }
}

export default MuteMicButton;