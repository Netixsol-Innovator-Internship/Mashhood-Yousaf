// lib/socket.ts
import { io } from "socket.io-client";

const socket = io(
  "https://socialmediawebbeinnestjs-production.up.railway.app",
  {
    autoConnect: true,
    transports: ["websocket"],
  }
);

export default socket;
