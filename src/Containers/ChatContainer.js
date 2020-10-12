import React, {useState, useEffect, useRef} from 'react'
import socketIOClient from "socket.io-client";


export default function ChatContainer(props) {
    const [participant, setParticipant] = useState([]);
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState([]);

    const textbox = useRef();

    useEffect(() => {
        
    },[]);

    function send(){
        let value = textbox.current.value
        let list = message
        list.push({user:'q', txt:value})
        
        setMessage(list)
    }


    return (
        <div className="container">
            <div id="record-box" >
            {
                message.map(v => {
                    return <div> 
                        <span>{v.user} : </span><span>{v.txt}</span>
                    </div>
                })
            }   
            
            </div>
            <div id="send-box">
                <textarea rows="1" cols="80" ref={textbox}></textarea>
                <div className="button">
                    <button type='submit' onClick={send}>Send</button>
                </div>
            </div>
        </div>
    );
}