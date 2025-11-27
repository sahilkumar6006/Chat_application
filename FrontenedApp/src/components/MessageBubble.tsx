import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextComp from './TextComp';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import { moderateScale } from '@app/styles/scaling';
import { IMessage } from '@app/typings/ChatTypes';

interface MessageBubbleProps {
    message: IMessage;
    isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
    const { theme } = useTheme();
    const colors = Colors[theme];

    // Validate message data
    if (!message || !message.content) {
        console.error('Invalid message data:', message);
        return null;
    }

    const formatTime = (date: Date | string): string => {
        try {
            const messageDate = new Date(date);
            const hours = messageDate.getHours();
            const minutes = messageDate.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
            return `${displayHours}:${displayMinutes} ${ampm}`;
        } catch (error) {
            console.error('Error formatting time:', error);
            return '';
        }
    };

    // Safety check for sender
    const senderName = message.sender && typeof message.sender === 'object'
        ? message.sender.name
        : 'Unknown';

    return (
        <View style={[
            styles.container,
            isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
        ]}>
            <View style={[
                styles.bubble,
                isOwnMessage
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.surface }
            ]}>
                {!isOwnMessage && (
                    <TextComp
                        text={senderName}
                        style={[styles.senderName, { color: colors.primary }]}
                    />
                )}
                <TextComp
                    text={message.content || ''}
                    style={[
                        styles.messageText,
                        { color: isOwnMessage ? '#FFFFFF' : colors.text }
                    ]}
                />
                <TextComp
                    text={formatTime(message.createdAt)}
                    style={[
                        styles.timestamp,
                        { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: moderateScale(4),
        marginHorizontal: moderateScale(12),
    },
    ownMessageContainer: {
        alignItems: 'flex-end',
    },
    otherMessageContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '75%',
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(16),
    },
    senderName: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        marginBottom: moderateScale(2),
    },
    messageText: {
        fontSize: moderateScale(15),
        lineHeight: moderateScale(20),
    },
    timestamp: {
        fontSize: moderateScale(10),
        marginTop: moderateScale(4),
        alignSelf: 'flex-end',
    },
});

export default MessageBubble;
