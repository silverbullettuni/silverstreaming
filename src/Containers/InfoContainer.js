import React, { useState, useEffect, createContext } from 'react';
import {useParams} from "react-router-dom";
import { socket } from "../Services/socket";
import BroadcastContainer from "./BroadcastContainer";
import ViewContainer from "./ViewContainer";
const resetMedia = new CustomEvent('resetMedia');

export const DataContext = createContext();
/**
* InfoContainer containes actions and data before view
*/
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

    /**
    * Set boolean of page changed
    */
    function setChange() {
        setForChanged(true)
    }

    // Initial setup
    useEffect(() => {
        window.dispatchEvent(resetMedia);
        socket.connect();
        return () => {
            console.log("Closing socket connection")
            socket.disconnect();
          }
    }, [])
 
    // Initial setup for login and exit
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

    /**
    * emit exitChatBox socket
    */
    function setExit() {
        if (!formChanged) {
            socket.emit('exitChatbox')
            if (wb === "broadcast") {
                socket.emit("streamerTimeout");
            }
            if (wb === "broadcast") {
                socket.emit("resetStreamerTimeout");
            }
        }
    }
        /**
    * Genrate a fixed UID to user
    */
   function generateUid() {
    return new Date().getTime() + "" + Math.floor(Math.random() * 9 + 1);
}
/**
* Input username and emit login socket
*/
function inputUsername() {
    if (window.sessionStorage.getItem("userData") === null) {
        let participantTemp = window.prompt("Please enter your username ");
        let uidTemp = generateUid();
        if (!participantTemp) {
            participantTemp = "guest" + uidTemp;
        }
        setParticipant(participantTemp);
        setUid(uidTemp);

        var obj = { username: participantTemp};
        var str = JSON.stringify(obj);

        window.sessionStorage.setItem("userData", str); 

        if (participantTemp !== "") {
            socket.emit("login", { uid: uid, username: participantTemp });
        }
    } else {
        let getUser = window.sessionStorage.getItem("userData");
        var userObj = JSON.parse(getUser);
        setUid(userObj.uid);
        setParticipant(userObj.username);
        socket.emit("login", { uid: userObj.uid, username: userObj.username });
    }
}
    }, [formChanged, wb]); // eslint-disable-line react-hooks/exhaustive-deps


    if (wb === "watch") {
        return (
            <div className="container">
                <DataContext.Provider value={data}>
                    <ViewContainer />
                </DataContext.Provider>
            </div>
        );
    } else if (wb === "broadcast") {
        return (
            <div className="container">
                <DataContext.Provider value={data}>
                    <BroadcastContainer />
                </DataContext.Provider>
            </div>
        );
    }
}
