// components/SocketListener.jsx
"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

export default function SocketListener() {
  useEffect(() => {
    const socket = io("https://shop-co.up.railway.app");

    socket.on("orderNotification", (data) => {
      console.log("📦 Order Received (Global):", data.message);
      toast.info(`📦 New Order: ${data.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
