import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants"; // Stelle sicher, dass HOST korrekt definiert ist.
import { createContext, useContext, useEffect, useState } from "react"; 
import { io } from "socket.io-client";
import { toast } from "sonner";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const { userInfo } = useAppStore();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (userInfo) {
            
            const newSocket = io(HOST, {
                path: "/socket.io",
                withCredentials: true,
                query: { userId: userInfo.id },
                transports: ["websocket"], // 🚀 WICHTIG: Nutze nur WebSocket statt Polling!
                reconnection: true, // 🔄 Automatische Wiederverbindung aktivieren
                reconnectionAttempts: 5,
                reconnectionDelay: 3000,
                autoConnect: true, // Verbindung nicht sofort starten, falls Fehler auftreten
            });

            newSocket.on("connect", () => {
                console.log("✅ Verbunden mit Socket-Server:", newSocket.id);
            });

            

            const handleRecieveMessage = (message) => {
                
                const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    addMessage(message);
                }
            };

            const handleRecieveChannelMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState();
                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    addMessage(message);
                }
                addChannelInChannelList(message);
            };

            
            newSocket.on("recieveMessage", handleRecieveMessage);
            newSocket.on("recieve-channel-message", handleRecieveChannelMessage);
            newSocket.on("add-channel", (channel) => {
                const {addChannel} = useAppStore.getState();
                console.log(channel);
                addChannel(channel);
            });       
            setSocket(newSocket);

            return () => {
                console.log("🔌 Socket wird getrennt...");
                newSocket.disconnect();
            };
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};