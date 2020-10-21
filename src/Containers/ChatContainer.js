import React, {useState, useEffect, useRef, useContext } from 'react';
import {useParams} from 'react-router-dom';
import socketIOClient from "socket.io-client";

import { DataContext } from './InfoContainer'

export default function ChatContainer(props) {
    const data = useContext(DataContext);
    
    const [uid, setUid] = useState([])
    const [user, setUser] = useState([])
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState([]);
    const [chat, setChat ] = useState([]);
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
        ready()
    })


    function generateMsgId() {
        return new Date().getTime() + "" + Math.floor(Math.random()*899+100)
    }


    function updateSysMsg(o,action){
        let msg = message
        const newMsg = { type:'system', 
                         username:o.user.username, 
                         uid:o.user.uid, 
                         action:action,
                         msgId:generateMsgId()}
        msg = message.concat(newMsg);
        setOnlineCount(o.onlineCount);
        setOnlineUsers(o.onlineUsers);
        setMessage(msg);

        const users = JSON.parse(JSON.stringify(o.onlineUsers)); 

        // console.log(JSON.stringify(users))
        let html = [];
        for (let key in users){
            html.push(users[key])
        }
        setUserHtml(html)

    }

    function updateMsg(userData){
        const msg = message
        const newMsg = { type:'chat', 
                         username:userData.username, 
                         uid:userData.uid, 
                         action:userData.message,
                         msgId:generateMsgId()}
        msg = message.push(newMsg);
        setMessage(msg);
    }

    function ready() {
        const socketReady = socket;
        socketReady.on('login', (o) => {
            updateSysMsg(o,'login')
        })
        socketReady.on('exitChatbox', (o) => {
            updateSysMsg(o,'exitChatbox')
        })
        socketReady.on('message', (userData) => {
            updateMsg(userData)
        })

    }

    function send(){
        const message = textbox.current.value
        const list = chat
        list.push({user:user, txt:message})
        setChat(message => [...message])
        textbox.current.value = ''
    }


    return (
        <div className="container">
            <div className="display-flex">
                
                <div id="record-box">
                {
                    chat.map((msg, index) => 
                        <div key={index}> 
                            <span className='name'>{msg.user} : </span><span className='text'>{msg.txt}</span>
                        </div>
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
                    onChange={(e)=>setMessage(e.target.value)}
                    className='text'></textarea>
                    <div className="button">
                        <button type='submit' onClick={send}>Send</button>
                    </div>
                </div>         
        </div>
    );
}