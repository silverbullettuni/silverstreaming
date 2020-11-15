import React from 'react'

import {CopyToClipboard} from 'react-copy-to-clipboard';


class InviteLinkButton extends React.Component {
    handleClick = () => { 
      var url = window.location.href;
      var watchUrl = url.replace('broadcast/','watch/');
      return watchUrl;
  };
  
  render() {
    return (
      <CopyToClipboard text={this.handleClick()}>
        <button>Copy invite link</button>
      </CopyToClipboard>
    );
  }
}

export default InviteLinkButton;