import React, {useState, useEffect, useRef, useContext } from 'react';
import {useParams} from 'react-router-dom';
import { userContext } from './ViewContainer'
import { broadcasterContext } from './BroadcastContainer'
// import realChat from '../chat';

export default function ChatContainer(props) {
    const [message, setMessage] = useState([]);
    const textbox = useRef();
    
    const participant = useContext(userContext);
    const broadcaster = useContext(broadcasterContext);

    function send(){
        const value = textbox.current.value
        const list = message
        list.push({user:broadcaster||participant, txt:value})
        setMessage(message => [...message])
        textbox.current.value = ''
    }

    return (
        <div className="container">
            <div id="record-box">
            {
                message.map((v, index) => 
                    <div key={index}> 
                        <span className='name'>{v.user} : </span><span className='text'>{v.txt}</span>
                    </div>
                )
            }   
            </div>
            <div id="send-box">
                <textarea rows="1" cols="80" ref={textbox} className='text'></textarea>
                <div className="button">
                    <button type='submit' onClick={send}>Send</button>
                </div>
            </div>
        </div>
    );
}