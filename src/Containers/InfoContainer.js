import React, { useState, useEffect, createContext } from 'react';
import {useParams} from "react-router-dom";
import BroadcastContainer from './BroadcastContainer';
import ViewContainer from './ViewContainer';

import socketIOClient from "socket.io-client";

export const DataContext = createContext();
 
export default function InfoContainer(props){

    const ENDPOINT = window.location.hostname + ":4000";
    
    const [uid, setUid] = useState('');
    const socket = socketIOClient(ENDPOINT);
    const [participant, setParticipant] = useState('');

    const {wb} = useParams();
 
    // Variable for all data
    const data = {
        "participant":participant,
        "uid":uid
    };
    
    useEffect(() => {
        inputUsername();
    },[])
 
    function generateUid() {
        return new Date().getTime() + "" + Math.floor(Math.random()*9+1)
    }

    function inputUsername(){
        if (window.sessionStorage.getItem('userData') === null){
            let user = window.prompt('Please enter your username ');
            let uid = generateUid();
            if (!user){ user =  'guest' + uid}
            setParticipant(user);
            setUid(uid);
            
            window.sessionStorage.setItem('userData', user)
            
            socket.emit('login',{uid:uid, username:user})
        }else{
            let getUser = window.sessionStorage.getItem('userData');
            setParticipant(getUser);
        }
         
    }
 
    if(wb == "watch"){
        return(
            <div className="container">
                <DataContext.Provider value={data}>
                    <ViewContainer/>
                </DataContext.Provider>
            </div>
        );
    }else if(wb == "broadcast"){
        return(
            <div className="container">
                <DataContext.Provider value={data}>
                    <BroadcastContainer />
                </DataContext.Provider>
            </div>
        );
    }
 
}