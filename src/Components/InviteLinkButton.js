import React from 'react'


class InviteLinkButton extends React.Component {
    handleClick = () => { 
      var url = window.location.href;
      var watchUrl = url.replace('broadcast/','watch/');
      window.open(watchUrl);
  };
  
  render() {
    return (
      <button onClick={this.handleClick}>
        Link to stream
      </button> 
    );
  }
}

export default InviteLinkButton;