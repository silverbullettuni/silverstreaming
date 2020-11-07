import React, {useState, useEffect, useRef, useContext, createContext } from 'react';
import socketIOClient from "socket.io-client";

import { DataContext } from './InfoContainer'

export const MessageContext = createContext();

export default function ChatContainer(props) {
    const data = useContext(DataContext);
    
    const [uid, setUid] = useState([])
    const [user, setUser] = useState([])
    const [message, setMessage] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [onlineCount, setOnlineCount] = useState(0);
    const [userHtml, setUserHtml] = useState([]);

    const ENDPOINT = window.location.hostname + ":4000";
    const socket = socketIOClient(ENDPOINT)
   
    const textbox = useRef();
    const userList = useRef();

    useEffect(() => {
        setUser(data.participant)
        setUid(data.uid)
        document.getElementById('record-box').scrollTop = document.getElementById('record-box').scrollHeight;
    },[message])

    useEffect(()=>{
        ready();
    },[])

    function generateMsgId() {
        return new Date().getTime() + "" + Math.floor(Math.random()*899+100)
    }


    function updateSysMsg(o,action){
        // let msg = message;
        const newMsg = { type:'system', 
                         username:o.user.username, 
                         uid:o.user.uid, 
                         action:action,
                         msgId:generateMsgId()}
        // msg = message.concat(newMsg);
        setOnlineCount(o.onlineCount);
        setOnlineUsers(o.onlineUsers);
        setMessage(message=>[...message,newMsg]);

        const users = JSON.parse(JSON.stringify(o.onlineUsers)); 

        let html = [];
        for (let key in users){
            html.push(users[key])
        }
        setUserHtml(html)

    }

    function updateMsg(userData){
        let newMsg = { type:'chat', 
                         username:userData.username, 
                         uid:userData.uid, 
                         action:userData.message,
                         msgId:generateMsgId()}

        setMessage(message=>[...message,newMsg]);
    }

    function ready() {
        const socketReady = socket;
        socketReady.on('login', (o) => {
            updateSysMsg(o,'Join the room')
        })
        socketReady.on('exitChatbox', (o) => {
            updateSysMsg(o,'Leave the room')
        })
        socketReady.on('message', (userData) => {
            updateMsg(userData)
        })

    }

    function send(){
        // const message = textbox.current.value
        // const list = chat
        // list.push({user:user, txt:message})
        // setChat(message => [...message])

        socket.emit('message', { uid:uid, username:user,message:textbox.current.value})
        textbox.current.value = ''
        
        // keep scroll bar at the bottom
        // setInterval(function(){
        //     document.getElementById('record-box').scrollTop = document.getElementById('record-box').scrollHeight;
        // }, 200)
    }

    return (
        <div className="container">
            <div className="display-flex">
                <div id="record-box">
                {
                    message.map((m, index)=>
                        <p key={index}><span className='name'>{m.username}:</span><span className='text'>{m.action}</span></p>
                    )
                }   
                </div>
                    
                <div className="online-count" align='right' 
                    ref={userList} >
                    <p>
                        Online Users: {onlineCount}
                    </p>                    
                </div>
                <div className="online-users">
                    {
                        userHtml.map((u, index) => 
                            <li key={index}>
                                {u}
                            </li>
                        )
                    }
                </div>
            </div> 
            <div id="send-box">
                    <textarea rows="1" cols="80" 
                    ref={textbox} 
                    className='text'></textarea>
                    <div className="button">
                        <button type='submit' onClick={send}>Send</button>
                    </div>
                </div>         
        </div>
    );
}