import React, {useState, useEffect, useRef, useContext, createContext } from 'react';
import socketIOClient from "socket.io-client";

import MessageContainer from './Message';
import { socket } from "../Services/socket";

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

    //const [newMessage, setNewMessage] = useState("");
    const [countNewMessages, setCountNewMessages] = useState(-1);
   
    const textbox = useRef();
    const userList = useRef();
    const chatBubble = useRef();

    useEffect(() => {
        setUser(data.participant)
        setUid(data.uid)
        document.getElementById('record-box').scrollTop = document.getElementById('record-box').scrollHeight;
        // message.map((m,index)=>{
        //     if(index == message.length-1){
        //         setNewMessage(m.action);
        //     }
        // });
        setCountNewMessages(countNewMessages+1);
    },[message])

    useEffect(()=>{
        if(countNewMessages > 0){
            document.getElementById('chatBubble').setAttribute('style','color:red');
        }
        document.getElementsByClassName('chatConatiner')[0].addEventListener("mouseover", ()=>{
            document.getElementById('record-box').setAttribute('style','display: block');
            document.getElementById('send-box').setAttribute('style','display: flex');
            document.getElementById('chatBubble').setAttribute('style','display: none');
            setCountNewMessages(0);
        });
        document.getElementsByClassName('chatConatiner')[0].addEventListener("mouseleave", ()=>{
            document.getElementById('record-box').removeAttribute('style');
            document.getElementById('send-box').removeAttribute('style');
            document.getElementById('chatBubble').removeAttribute('style');
        });
        ready();
    },[])

    function generateMsgId() {
        return new Date().getTime() + "" + Math.floor(Math.random()*899+100)
    }


    function updateSysMsg(o,action){
        const newMsg = { type:'system', 
                         username:o.user.username, 
                         uid:o.user.uid, 
                         action:action,
                         msgId:generateMsgId()}
        
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
            updateSysMsg(o,'Join the chat')
        })
        socketReady.on('exitChatbox', (o) => {
            updateSysMsg(o,'Leave the chat')
        })
        socketReady.on('message', (userData) => {
            updateMsg(userData)
        })

    }

    function send(){
        socket.emit('message', { uid:uid, username:user,message:textbox.current.value})
        textbox.current.value = ''
    }
    return (
        <div className="fullChatBox">
            <div className="chatConatiner" ref={chatBubble}><p id="chatBubble" className="chatBubble">You have {countNewMessages} new messages</p>
            <div id="record-box" className="chatBox">
            {
                message.map((m, index)=>
                    <p className="messages" key={index}><span className='name'>{m.username}:</span><span className='text'>{m.action}</span></p>
                )
            }
            </div> 
            <div id="send-box" className="sendBox">
                <textarea rows="1" cols="50"
                ref={textbox} 
                className='text'></textarea>
                <div className="button">
                    <button type='submit' onClick={send}>Send</button>
                </div>
            </div>
              
        </div>
                
            <div className="userList"
                ref={userList} >
                <div className="userListHeader">
                    Online Users: {onlineCount}
                </div>
                <div className="userListList">
                    {
                        userHtml.sort().map((user, index) => 
                            <li key={index}>
                                {user}
                            </li>
                        )
                    }
                </div>                
            </div>       
    </div>
);
}