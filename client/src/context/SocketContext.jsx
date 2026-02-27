import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

const resolveSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(0);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const socketClient = io(resolveSocketUrl(), {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${token}`,
      },
    });

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onConnections = (payload) => setConnectionsCount(payload?.count ?? 0);

    socketClient.on("connect", onConnect);
    socketClient.on("disconnect", onDisconnect);
    socketClient.on("system:connections", onConnections);

    setSocket(socketClient);

    return () => {
      socketClient.off("connect", onConnect);
      socketClient.off("disconnect", onDisconnect);
      socketClient.off("system:connections", onConnections);
      socketClient.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [token]);

  const value = useMemo(
    () => ({
      socket,
      connected,
      connectionsCount,
    }),
    [socket, connected, connectionsCount],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

