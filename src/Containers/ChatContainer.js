import React, {useState, useEffect, useRef, useContext } from 'react';
import {useParams} from 'react-router-dom';
import socketIOClient, { Socket } from "socket.io-client";

import { userContext } from './ViewContainer'
import { broadcasterContext } from './BroadcastContainer'

export default function ChatContainer(props) {
    const { id } = useParams();
    const [user, setUser] = useState('')
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState([]);
    const [chat, setChat ] = useState([]);
    
    const textbox = useRef();

    const socket = socketIOClient(window.location.origin);
    
    const participant = useContext(userContext);
    const broadcaster = useContext(broadcasterContext);

    useEffect(() => {
        setRoom(id);

        socket.emit('join', {room}, (error) => {
            if (error){
                console.log(error);
            }
        });
    },[])

    useEffect(() => {
        socket.on('message', message => {
            setChat(msgs => [...msgs,message])
        });

        socket.on('roomData', ({participant}) => {
            setUser(participant)
        })
    },[])

    const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
      }

    function send(){
        const message = textbox.current.value
        const list = chat
        list.push({user:broadcaster||participant, txt:message})
        setChat(message => [...message])
        textbox.current.value = ''
    }

    return (
        <div className="container">
            <div id="record-box">
            {
                chat.map((msg, index) => 
                    <div key={index}> 
                        <span className='name'>{msg.user} : </span><span className='text'>{msg.txt}</span>
                    </div>
                )
            }   
            </div>
            <div id="send-box">
                <textarea rows="1" cols="80" 
                ref={textbox} 
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                className='text'></textarea>
                <div className="button">
                    <button type='submit' onClick={send}>Send</button>
                </div>
            </div>
        </div>
    );
}