"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/nextjs";
import { API_URL } from "@/lib/constants";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    let s: Socket | null = null;

    const connectSocket = async () => {
      if (s?.connected) return;
      
      const token = await getToken();
      if (!token) return;

      // Extract base URL from API_URL (e.g., http://localhost:5000)
      const socketUrl = API_URL.replace("/api", "");

      s = io(socketUrl, {
        auth: { token },
      });

      s.on("connect", () => {
        console.log("Connected to socket server");
      });

      setSocket(s);
    };

    connectSocket();

    return () => {
      if (s) s.disconnect();
    };
  }, [getToken]);

  return socket;
};
