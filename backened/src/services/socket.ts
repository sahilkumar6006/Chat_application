import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface User {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Chat {
  _id: string;
  chatName?: string;
  isGroupChat?: boolean;
  users: User[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Message {
  chat: Chat | string;
  sender: User | string;
  content: string;
  createdAt?: Date | string;
}

export const initializeSockets = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    socket.on('setup', (userData: User) => {
      if (!userData?._id) {
        console.error('Invalid user data');
        return;
      }
      socket.join(userData._id);
      socket.emit('connected');
      console.log(`User ${userData._id} connected`);
    });

    socket.on('join chat', (room: string) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });
    socket.on('typing', (room: string) => {
      socket.to(room).emit('typing', room);
    });

    socket.on('stop typing', (room: string) => {
      socket.to(room).emit('stop typing', room);
    });

    // Debug: Log when 'new message' event is received
    socket.on('new message', (newMessage: Message, callback) => {
      console.log('=== New Message Event Triggered ===');
      console.log('Raw message:', JSON.stringify(newMessage, null, 2));
      try {
        console.log('=== New Message Received ===');
        
        // Handle string or object types for chat and sender
        const chat = typeof newMessage.chat === 'string' 
          ? { _id: newMessage.chat, users: [] } 
          : newMessage.chat;
          
        const sender = typeof newMessage.sender === 'string'
          ? { _id: newMessage.sender }
          : newMessage.sender;

        console.log('Message content:', newMessage.content);
        console.log('Sender ID:', '_id' in sender ? sender._id : sender);
        console.log('Chat ID:', '_id' in chat ? chat._id : chat);
        
        if ('users' in chat) {
          console.log('Users in chat:', chat.users.map((u: User) => ({
            id: u._id,
            name: u.name || 'No name'
          })));
        }

        // Validate message structure
        if (!newMessage.content) {
          console.error('Message has no content');
          callback?.({ status: 'error', error: 'Message has no content' });
          return;
        }

        if (!('users' in chat) || !chat.users?.length) {
          console.error('Invalid message format: chat.users is empty or not defined');
          callback?.({ status: 'error', error: 'No users in chat' });
          return;
        }

        const senderId = '_id' in sender ? sender._id : sender;
        if (!senderId) {
          console.error('Invalid message: No sender ID');
          callback?.({ status: 'error', error: 'No sender ID' });
          return;
        }

        // Broadcast to all users in the chat except sender
        console.log('Chat users:', JSON.stringify(chat.users, null, 2));
        const recipients = chat.users.filter((user: User) => user._id !== senderId);
        
        console.log(`Broadcasting to ${recipients.length} recipients`);
        console.log('Recipient IDs:', recipients.map(r => r._id));
        
        // Prepare the message to send
        const messageToSend = {
          ...newMessage,
          chat: {
            _id: '_id' in chat ? chat._id : chat,
            chatName: 'chatName' in chat ? chat.chatName : 'Group Chat',
            isGroupChat: 'isGroupChat' in chat ? chat.isGroupChat : true,
            users: 'users' in chat ? chat.users : []
          },
          sender: {
            _id: senderId,
            name: 'name' in sender ? sender.name : 'Unknown',
            email: 'email' in sender ? sender.email : undefined,
            image: 'image' in sender ? sender.image : undefined
          },
          content: newMessage.content,
          createdAt: newMessage.createdAt || new Date()
        };
        
        // Send to each recipient
        recipients.forEach((recipient: User) => {
          const roomId = recipient._id;
          console.log(`Attempting to send to room ${roomId} (${recipient.name || 'no name'})`);
          console.log('Available rooms:', Array.from(socket.rooms));
          
          // Debug: Check if recipient is connected
          const recipientSockets = io.sockets.sockets;
          const isRecipientConnected = Array.from(recipientSockets).some(
            ([_, sock]) => Array.from(sock.rooms).includes(roomId)
          );
          console.log(`Is recipient ${roomId} connected?`, isRecipientConnected);
          
          socket.to(roomId).emit('message received', messageToSend);
          console.log(`Message sent to room ${roomId}`);
        });

        // Send success response
        callback?.({
          status: 'ok',
          message: 'Message delivered',
          recipients: recipients.map((r: User) => r._id)
        });
        
      } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error handling message:', errorMessage);
        callback?.({
          status: 'error',
          error: errorMessage
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
