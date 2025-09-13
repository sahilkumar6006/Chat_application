import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  chat: string;
  createdAt: string;
}

interface Chat {
  _id: string;
  chatName?: string;
  isGroupChat: boolean;
  users: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  latestMessage?: Message;
  groupAdmin?: string;
  createdAt: string;
  updatedAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  notification: { chat: Chat } | null;
  setNotification: (notification: { chat: Chat } | null) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notification, setNotification] = useState<{ chat: Chat } | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const newSocket = io('http://localhost:5000', {
        query: { userId: currentUser._id },
        withCredentials: true,
      });
      setSocket(newSocket);

      // Listen for online users
      newSocket.on('getOnlineUsers', (users: string[]) => {
        setOnlineUsers(users);
      });

      // Listen for new messages
      newSocket.on('message received', (newMessage: Message) => {
        if (!selectedChat || selectedChat._id !== newMessage.chat) {
          // Send notification
          setNotification({
            chat: chats.find((c) => c._id === newMessage.chat) as Chat,
          });
        } else {
          setMessages((prev) => [...prev, newMessage]);
        }
      });

      return () => {
        newSocket.close();
      };
    }
  }, [currentUser, selectedChat, chats]);

  const value = {
    socket,
    onlineUsers,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    messages,
    setMessages,
    notification,
    setNotification,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
