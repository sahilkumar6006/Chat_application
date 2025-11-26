export interface IUser {
    _id: string;
    name: string;
    email: string;
    image?: string;
    isAdmin?: boolean;
}

export interface IMessage {
    _id: string;
    content: string;
    sender: IUser;
    chat: string | IChat;
    readBy?: IUser[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface IChat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: IUser[];
    latestMessage?: IMessage;
    groupAdmin?: IUser;
    createdAt: Date | string;
    updatedAt: Date | string;
}

// Gifted Chat compatible message format
export interface IGiftedMessage {
    _id: string | number;
    text: string;
    createdAt: Date;
    user: {
        _id: string | number;
        name: string;
        avatar?: string;
    };
}
