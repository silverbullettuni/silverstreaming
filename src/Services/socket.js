import socketIOClient from "socket.io-client";

const ENDPOINT = window.location.hostname + ":4000";
export const socket = socketIOClient(ENDPOINT, {
    autoConnect: false,
    forceNew: true
});
