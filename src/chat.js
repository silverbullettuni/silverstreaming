import {useState, useEffect, useRef } from 'react';
import socketIOClient from "socket.io-client";

const New_Message = "newMessage";

const socket = socketIOClient(window.location.origin);

const realChat = (roomId) => {
    const [message, setMessage] = useState([]);

    useEffect(() => {

        socket.on(New_Message, (message) => {
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.senderId === socket.id
            };
            setMessage((message) => [...message, incomingMessage]);
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId])


    const sendMessage = (messageBody) => {
        socket.emit(New_Message, {
            body: messageBody,
            senderId: socket.id
        });
    };

    return (message, sendMessage);
};

export default realChat