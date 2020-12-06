import React from 'react'

import {CopyToClipboard} from 'react-copy-to-clipboard';

// Returns the invite link button that is done with the CopyToClipboard react library
class InviteLinkButton extends React.Component {
    handleClick = () => { 
      var url = window.location.href;
      var watchUrl = url.replace('broadcast/','watch/');
      return watchUrl;
  };
// Button for copying the link  
  render() {
    return (
      <CopyToClipboard text={this.handleClick()}>
        <button onClick={() => alert("Copied to clipboard")}>Copy invite link</button>
      </CopyToClipboard>
    );
  }
}

export default InviteLinkButton;

