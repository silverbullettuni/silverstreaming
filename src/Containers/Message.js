import React, {useState, useEffect, useRef, useContext } from 'react';
import { MessageContext } from './ChatContainer';

export default function Message(props) {

    const message = useContext(MessageContext);

    return (
        <div id="record-box">
        {
            message.map((m, index)=>
            <p key={index}><span className='name'>{m.username}:</span><span className='text'>{m.action}</span></p>
            )
        }   
        </div>
    );
}