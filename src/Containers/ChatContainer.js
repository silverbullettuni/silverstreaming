import React, {useState, useEffect, useRef, useContext, createContext } from 'react';

import { socket } from "../Services/socket";

import { DataContext } from './InfoContainer'

import { faUser, faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MessageContext = createContext();

export default function ChatContainer(props) {
    const data = useContext(DataContext);
    
    const [uid, setUid] = useState([])
    const [user, setUser] = useState([])
    const [message, setMessage] = useState([]);
    const [onlineCount, setOnlineCount] = useState(0);
    const [userHtml, setUserHtml] = useState([]);

    //const [newMessage, setNewMessage] = useState("");
    const [countNewMessages, setCountNewMessages] = useState(-1);

    const [msgBubble, setMsgBubble] = useState([]);
   
    const textbox = useRef();
    const chatFrame = useRef();
    const userFrame = useRef();
    var isChatOpen = false;
    var isUsersOpen = false;

    useEffect(() => {
        setUser(data.participant)
        setUid(data.uid)
        document.getElementById('record-box').scrollTop = document.getElementById('record-box').scrollHeight;
        message.map((m,index)=>{
            if(index === message.length-1){
                // setNewMessage(m.action);
                if(msgBubble.length===5){
                    let filteredArray = msgBubble.filter((_, i) => i !== 0);
                    setMsgBubble(filteredArray);
                }
                const newMsg = {
                    action:m.action,
                    msgId:m.msgId
                }
                setMsgBubble(msgBubble=>[...msgBubble,newMsg]);
                setCountNewMessages(countNewMessages+1);
            }
            return null;
        });
    },[message])

    useEffect(()=>{
        document.getElementsByClassName('chatConatiner')[0].addEventListener("click", ()=>{
            document.getElementsByClassName('chatConatiner')[0].setAttribute(
                'style','height: 400px; width: 300px; border-radius: 1px');
            if (isUsersOpen) {
                document.getElementsByClassName('userConatiner')[0].setAttribute(
                    'style', 'left: 335px; height: 400px; width: 300px; border-radius: 1px; background-color: #333');
            }
            else {
                document.getElementsByClassName('userConatiner')[0].setAttribute(
                    'style', 'left: 335px');
            }
            document.getElementById('record-box').setAttribute('style','display: block');
            document.getElementById('closeButton').setAttribute('style','display: block;');
            document.getElementById('send-box').setAttribute('style','display: flex');
            document.getElementById('chatFrame').setAttribute('style','display: none');
            document.getElementById('fullChatBubble').setAttribute('style','display:none;');
            isChatOpen = true;
        });
        document.getElementById('closeButton').addEventListener("click", (e)=>{
            e.stopPropagation();
            document.getElementsByClassName('chatConatiner')[0].setAttribute('style','height: 15px;');
            if(isUsersOpen){
                document.getElementsByClassName('userConatiner')[0].setAttribute(
                    'style','height: 400px; width: 300px; border-radius: 1px; background-color: #333');
            }
            else{
                document.getElementsByClassName('userConatiner')[0].setAttribute(
                    'style','left: 75px');
            }
            document.getElementById('fullChatBubble').removeAttribute('style');
            document.getElementById('closeButton').removeAttribute('style');
            document.getElementById('record-box').removeAttribute('style');
            document.getElementById('send-box').removeAttribute('style');
            document.getElementById('chatFrame').removeAttribute('style');
            setCountNewMessages(0);
            isChatOpen = false;
        });
        document.getElementsByClassName('userConatiner')[0].addEventListener("click", ()=>{
            if(isChatOpen){
                document.getElementsByClassName('userConatiner')[0].setAttribute(
                    'style','height: 400px; width: 300px; border-radius: 1px; left: 335px; background-color: #333;');
            }
            else{
                document.getElementsByClassName('userConatiner')[0].setAttribute(
                    'style','height: 400px; width: 300px; border-radius: 1px; background-color: #333;');
            }
            document.getElementById('closeButton2').setAttribute('style','display: block;');
            document.getElementById('userFrame').setAttribute('style','display: none');
            document.getElementById('userListList').setAttribute('style','visibility: visible');
            isUsersOpen = true;
        });
        document.getElementById('closeButton2').addEventListener("click", (e)=>{
            e.stopPropagation();
            if(isChatOpen){
                document.getElementsByClassName('userConatiner')[0].setAttribute('style','height: 15px; left: 335px;');
            }
            else{
                document.getElementsByClassName('userConatiner')[0].setAttribute('style','height: 15px;');
            }
            document.getElementById('closeButton2').removeAttribute('style');
            document.getElementById('userFrame').removeAttribute('style');
            document.getElementById('userListList').removeAttribute('style');
            isUsersOpen = false;
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
        setMessage(message=>[...message,newMsg]);

        const users = JSON.parse(JSON.stringify(o.onlineUsers)); 

        let html = [];
        for (let key in users){
            html.push(users[key])
        }
        setUserHtml(html)

        if (action === 'Join the chat'){
            var getUser = window.sessionStorage.getItem('userData');
            // user data sessionStorage
            var objUsername = JSON.parse(getUser)
            var obj = { uid: o.user.uid, username : objUsername.username };
            var str = JSON.stringify(obj);
            window.sessionStorage.setItem("userData", str);
        }
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
                    msgBubble.map((m, index) =>
                        <div className="chatBubble" key={index}>
                            {m.action}
                        </div>
                    )
                }
            </div>

            <div className="chatConatiner" ref={chatFrame}><p id="chatFrame" className="chatFrame"><FontAwesomeIcon icon={faComments}/> {countNewMessages}</p>
                <div id="closeButton" className="closeButton"></div>
                <div id="record-box" className="chatBox">
                    {
                        message.map((m, index) =>
                            <p className="messages" key={index}><span className='name'>{m.username}:</span><span className='text'>{m.action}</span></p>
                        )
                    }
                </div>
                <div id="send-box" className="sendBox">
                    <textarea rows="1" cols="38"
                        ref={textbox}
                        onKeyPress={sendMsg}
                        className='text'></textarea>
                    <div className="button">
                        <button type='submit' onClick={send}>Send</button>
                    </div>
                </div>

            </div>
            <div className="userConatiner" ref={userFrame}><p id="userFrame" className="userFrame"><FontAwesomeIcon icon={faUser} /> {onlineCount}</p>
                <div id="closeButton2" className="closeButton"></div>
                <div id="user-box">
                    <div id="userListList" className="online-users">
                        {
                            userHtml.sort().map((user, index) =>
                                <li>
                                    {user}
                                </li>
                            )
                        }
                    </div>
                </div>

            </div>
        </div>
);
}