import React, { useState, useEffect, createContext, useRef } from 'react';
import {useParams} from "react-router-dom";
import { socket } from "../Services/socket";
import BroadcastContainer from "./BroadcastContainer";
import ViewContainer from "./ViewContainer";
const resetMedia = new CustomEvent('resetMedia');

export const DataContext = createContext();
 
export default function InfoContainer(props){
    
    const [uid, setUid] = useState('');
    const [participant, setParticipant] = useState('');

    const [formChanged, setForChanged] = useState(false);

    const { wb } = useParams();

    // Variable for all data
    const data = {
        participant: participant,
        uid: uid,
    };

    function setChange() {
        setForChanged(true)
    }
    function setExit() {
        if (!formChanged) {
            socket.emit('exitChatbox')
            if (wb == "broadcast") {
                socket.emit("streamerTimeout");
            }
            if (wb == "broadcast") {
                socket.emit("resetStreamerTimeout");
            }
        }
    }
    useEffect(() => {
        window.dispatchEvent(resetMedia);
        socket.connect();
        return () => {
            console.log("Closing socket connection")
            socket.disconnect();
          }
    }, [])
 
    useEffect(() => {
        inputUsername();

        setForChanged(false);
        window.addEventListener('change', setChange);
        window.addEventListener('beforeunload', setExit, false);

        return () => {
            socket.off('login',{ uid:uid, username:participant });
            window.removeEventListener('change',setChange)
            window.removeEventListener('beforeunload',setExit)
        }
    }, []);

    function generateUid() {
        return new Date().getTime() + "" + Math.floor(Math.random() * 9 + 1);
    }

    function inputUsername() {
        if (window.sessionStorage.getItem("userData") === null) {
            let participant = window.prompt("Please enter your username ");
            let uid = generateUid();
            if (!participant) {
                participant = "guest" + uid;
            }
            setParticipant(participant);
            setUid(uid);

            var obj = { username: participant };
            var str = JSON.stringify(obj);

            window.sessionStorage.setItem("userData", str); 

            if (participant != "") {
                socket.emit("login", { uid: uid, username: participant });
            }
        } else {
            let getUser = window.sessionStorage.getItem("userData");
            var obj = JSON.parse(getUser);
            setUid(obj.uid);
            setParticipant(obj.username);
            socket.emit("login", { uid: obj.uid, username: obj.username });
        }
    }

    if (wb == "watch") {
        return (
            <div className="container">
                <DataContext.Provider value={data}>
                    <ViewContainer />
                </DataContext.Provider>
            </div>
        );
    } else if (wb == "broadcast") {
        return (
            <div className="container">
                <DataContext.Provider value={data}>
                    <BroadcastContainer />
                </DataContext.Provider>
            </div>
        );
    }
}
