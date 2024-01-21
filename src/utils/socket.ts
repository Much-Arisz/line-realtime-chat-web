// utils/socket.ts
import io from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_API_URL;
const socket = io(`${socketUrl}`); 

export default socket;
