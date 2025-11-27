import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import TextComp from './TextComp';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import { moderateScale } from '@app/styles/scaling';
import { IChat, IUser } from '@app/typings/ChatTypes';

interface ChatListItemProps {
    chat: IChat;
    currentUserId: string;
    onPress: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, currentUserId, onPress }) => {
    const { theme } = useTheme();
    const colors = Colors[theme];

    // Get the other user in the chat (for one-on-one chats)
    const getOtherUser = (): IUser | undefined => {
        if (chat.isGroupChat) return undefined;
        return chat.users.find(user => user._id !== currentUserId);
    };

    const otherUser = getOtherUser();
    const chatName = chat.isGroupChat ? chat.chatName : (otherUser?.name || 'Unknown');
    const chatImage = chat.isGroupChat
        ? 'https://icon-library.com/images/group-icon/group-icon-2.jpg'
        : (otherUser?.image || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg');

    // Format timestamp
    const formatTime = (date: Date | string): string => {
        const messageDate = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - messageDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return messageDate.toLocaleDateString();
    };

    const latestMessageText = chat.latestMessage
        ? (typeof chat.latestMessage === 'object' ? chat.latestMessage.content : '')
        : 'No messages yet';

    const timestamp = chat.latestMessage
        ? (typeof chat.latestMessage === 'object' ? formatTime(chat.latestMessage.createdAt) : '')
        : '';

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.textSecondary }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: chatImage }}
                style={styles.avatar}
            />
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <TextComp
                        text={chatName}
                        style={[styles.name, { color: colors.text }]}
                        numberOfLines={1}
                    />
                    {timestamp && (
                        <TextComp
                            text={timestamp}
                            style={[styles.timestamp, { color: colors.textSecondary }]}
                        />
                    )}
                </View>
                <TextComp
                    text={latestMessageText}
                    style={[styles.message, { color: colors.textSecondary }]}
                    numberOfLines={2}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: moderateScale(16),
        borderBottomWidth: 0.5,
    },
    avatar: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(25),
        marginRight: moderateScale(12),
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(4),
    },
    name: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        flex: 1,
    },
    timestamp: {
        fontSize: moderateScale(12),
        marginLeft: moderateScale(8),
    },
    message: {
        fontSize: moderateScale(14),
    },
});

export default ChatListItem;
