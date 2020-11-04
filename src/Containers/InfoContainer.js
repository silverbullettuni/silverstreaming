import React, { useState, useEffect, createContext, useRef } from 'react';
import {useParams} from "react-router-dom";
import socketIOClient from "socket.io-client";

import BroadcastContainer from './BroadcastContainer';
import ViewContainer from './ViewContainer';

export const DataContext = createContext();


export default function InfoContainer(props) {
  const ENDPOINT = window.location.hostname + ":4000";
  const [uid, setUid] = useState("");
  const socket = socketIOClient(ENDPOINT);
  const [participant, setParticipant] = useState("");

  const [isExit, setIsExit] = useState(false);

  const { wb } = useParams();

  // Variable for all data
  const data = {
    participant: participant,
    uid: uid,
  };

  useEffect(() => {
    inputUsername();
    window.onbeforeunload = function () {
      setIsExit(true);
      socket.emit("exitChatbox");
      if (wb == "broadcast") {
        socket.emit("streamerTimeout");
      }
    };
    if (wb == "broadcast") {
      socket.emit("resetStreamerTimeout");
    }
  }, [isExit]);

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

      var obj = { uid: uid, username: participant };
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
      if (participant != "") {
        socket.emit("login", { uid: uid, username: participant });
      } 
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
