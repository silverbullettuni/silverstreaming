import React, {useState, useEffect, useRef, useContext, createContext } from 'react';
import socketIOClient from "socket.io-client";

//import MessageContainer from './Message';
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
    const chatFrame = useRef();

    useEffect(() => {
        setUser(data.participant)
        setUid(data.uid)
        document.getElementById('record-box').scrollTop = document.getElementById('record-box').scrollHeight;
        message.map((m,index)=>{
            if(index == message.length-1){
                // setNewMessage(m.action);
                if(msgBubble.length==5){
                    let filteredArray = msgBubble.filter((_, i) => i != 0);
                    setMsgBubble(filteredArray);
                }
                const newMsg = {
                    action:m.action,
                    msgId:m.msgId
                }
                setMsgBubble(msgBubble=>[...msgBubble,newMsg]);
                setCountNewMessages(countNewMessages+1);
            }
        });
    },[message])

    useEffect(()=>{
        document.getElementsByClassName('chatConatiner')[0].addEventListener("click", ()=>{
            document.getElementsByClassName('chatConatiner')[0].setAttribute('style','height: 400px;');
            document.getElementById('record-box').setAttribute('style','display: block');
            document.getElementById('closeButton').setAttribute('style','display: block;');
            document.getElementById('send-box').setAttribute('style','display: flex');
            document.getElementById('chatFrame').setAttribute('style','display: none');
            document.getElementById('fullChatBubble').setAttribute('style','display:none;');
        });
        document.getElementById('closeButton').addEventListener("click", (e)=>{
            e.stopPropagation();
            document.getElementsByClassName('chatConatiner')[0].setAttribute('style','height: 15px;');
            document.getElementById('fullChatBubble').removeAttribute('style');
            document.getElementById('closeButton').removeAttribute('style');
            document.getElementById('record-box').removeAttribute('style');
            document.getElementById('send-box').removeAttribute('style');
            document.getElementById('chatFrame').removeAttribute('style');
            setCountNewMessages(0);
        });
        ready();
    },[])

    useEffect(()=>{
        const timer = setInterval(()=>{
            if(msgBubble.length > 0){
                let filteredArray = msgBubble.filter((msg, i) => i !== 0);
                setMsgBubble(filteredArray);
            }
        },3000)
        return()=> clearInterval(timer);
    },[msgBubble])


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

    function sendMsg(event){
            if(event.key === 'Enter'){
                event.preventDefault();
                send();
            }
        }

    function send(){
        socket.emit('message', { uid:uid, username:user,message:textbox.current.value})
        textbox.current.value = ''
    }
    return (
        <div className="fullChatBox">
            <div className="fullChatBubble" id="fullChatBubble">
            {
                msgBubble.map((m, index)=>
                    <div className="chatBubble" key={index}>
                        {m.action}
                    </div>
                )
            }
            </div>
            
            <div className="chatConatiner" ref={chatFrame}><p id="chatFrame" className="chatFrame">You have {countNewMessages} new messages</p>
            <div id="closeButton" className="closeButton"></div>
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
                onKeyPress={sendMsg}
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