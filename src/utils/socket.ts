// utils/socket.ts
import io from 'socket.io-client';

const socketUrl = `${process.env.NEXT_PUBLIC_API_URL}`;
const headers = {
    'ngrok-skip-browser-warning': 'true' 
};

const socket = io(socketUrl, {
    extraHeaders: headers
});

export default socket;
