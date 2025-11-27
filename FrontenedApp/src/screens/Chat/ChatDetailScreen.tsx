import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { socketService } from '@app/services/SocketService';
import { ChatService } from '@app/services/ChatService';
import { authService } from '@app/services/authService';
import { IMessage } from '@app/typings/ChatTypes';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import { moderateScale } from '@app/styles/scaling';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import MessageBubble from '@app/components/MessageBubble';
import TextComp from '@app/components/TextComp';

type ChatDetailRouteProp = RouteProp<{ ChatDetail: { chatId: string } }, 'ChatDetail'>;

export const ChatDetailScreen = () => {
    const route = useRoute<ChatDetailRouteProp>();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const colors = Colors[theme];
    const { chatId } = route.params;

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [socketConnected, setSocketConnected] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadMessages();
        setupSocket();

        return () => {
            socketService.off('message received');
            // Optional: leave chat room if backend supports it
        };
    }, []);

    const setupSocket = async () => {
        const user = await authService.getUser();
        if (user) {
            setCurrentUserId(user._id);
            socketService.connect();
            socketService.emit('setup', user);
            socketService.emit('join chat', chatId);

            socketService.on('connected', () => setSocketConnected(true));

            socketService.on('message received', (newMessage: IMessage) => {
                const messageChatId = typeof newMessage.chat === 'object' ? newMessage.chat._id : newMessage.chat;
                if (messageChatId === chatId) {
                    setMessages(prev => [...prev, newMessage]);
                    // Scroll to bottom
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                }
            });
        }
    };

    const loadMessages = async () => {
        try {
            const messageData = await ChatService.fetchMessages(chatId);
            setMessages(messageData.reverse()); // Reverse to show latest at bottom
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!messageText.trim()) return;

        const tempMessage = messageText;
        setMessageText('');
        setSending(true);

        try {
            console.log('Sending message to chatId:', chatId);
            const newMessage = await ChatService.sendMessage(chatId, tempMessage);
            console.log('Received message from backend:', JSON.stringify(newMessage, null, 2));

            // Validate message structure
            if (!newMessage || !newMessage._id) {
                throw new Error('Invalid message response from server');
            }

            socketService.emit('new message', newMessage);
            setMessages(prev => [...prev, newMessage]);

            // Scroll to bottom after sending
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error('Error sending message:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            setMessageText(tempMessage); // Restore message on error
            // Show error to user
            Alert.alert('Error', 'Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        messagesList: {
            flex: 1,
            paddingVertical: moderateScale(8),
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: moderateScale(20),
        },
        inputContainer: {
            flexDirection: 'row',
            padding: moderateScale(12),
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.textSecondary + '30',
            alignItems: 'center',
        },
        input: {
            flex: 1,
            backgroundColor: colors.background,
            borderRadius: moderateScale(20),
            paddingHorizontal: moderateScale(16),
            paddingVertical: moderateScale(10),
            marginRight: moderateScale(8),
            color: colors.text,
            fontSize: moderateScale(15),
            maxHeight: moderateScale(100),
        },
        sendButton: {
            backgroundColor: colors.primary,
            width: moderateScale(44),
            height: moderateScale(44),
            borderRadius: moderateScale(22),
            justifyContent: 'center',
            alignItems: 'center',
        },
        sendButtonDisabled: {
            opacity: 0.5,
        },
        sendButtonText: {
            color: '#FFFFFF',
            fontSize: moderateScale(18),
            fontWeight: '600',
        },
    });

    if (loading) {
        return (
            <WrapperContainer style={styles.container}>
                <HeaderComp title="Chat" showBack={true} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </WrapperContainer>
        );
    }

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp title="Chat" showBack={true} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {messages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <TextComp
                            text="No messages yet. Start the conversation!"
                            style={{ fontSize: moderateScale(16), color: colors.textSecondary }}
                        />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => {
                            // Safety check for sender object
                            const isOwnMessage = item.sender && typeof item.sender === 'object'
                                ? item.sender._id === currentUserId
                                : false;

                            return (
                                <MessageBubble
                                    message={item}
                                    isOwnMessage={isOwnMessage}
                                />
                            );
                        }}
                        contentContainerStyle={styles.messagesList}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor={colors.textSecondary}
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!messageText.trim() || sending) && styles.sendButtonDisabled
                        ]}
                        onPress={handleSend}
                        disabled={!messageText.trim() || sending}
                    >
                        <TextComp
                            text={sending ? '...' : '→'}
                            style={styles.sendButtonText}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </WrapperContainer>
    );
};

export default ChatDetailScreen;
