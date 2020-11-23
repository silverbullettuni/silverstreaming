import React from 'react';
import styled from 'styled-components';
import AVSelect from './AVSelect';

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  z-index: 19;
  li {
    padding: 18px 10px;
  }
  @media (max-width: 5180px) {
    flex-flow: column nowrap;
    background-color: #9e9e9e;
    position: fixed;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px;
    padding-top: 2rem;
    transition: transform 0.3s ease-in-out;
    li {
      color: #fff;
    }
  }
`;

const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: "white"};
  color: "teal"};

  font-size: 1em;
  margin: 0.5em;
  padding: 0.2em 1em;
  border: 2px solid teal;
  border-radius: 3px;
`;

const RightNav = ({ open }) => {
    return (
        <Ul open={open}>
            <AVSelect/>
            <p />
            <div>
            <p>Participant view</p>
                    <Button> Single </Button>
                    <Button>2 x 2</Button>
                    <Button>3 x 3</Button>
                    <Button>4 x 4</Button>
            </div>
            <Button>Mute Microphone</Button>
            <Button>Mute/Unmute Sound</Button>
            <Button>Camera On/off</Button>
            <Button>Copy Session Link</Button>
            <Button>Leave Session</Button>
        </Ul>
    )
}

export default RightNav
