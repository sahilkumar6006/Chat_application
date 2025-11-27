import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { ChatService } from '@app/services/ChatService';
import { authService } from '@app/services/authService';
import { IChat } from '@app/typings/ChatTypes';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import { moderateScale } from '@app/styles/scaling';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import TextComp from '@app/components/TextComp';
import ChatListItem from '@app/components/ChatListItem';
import Routes from '@app/navigation/Routes';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;

export const Chat = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const colors = Colors[theme];

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const userData = await authService.getUser();
            setCurrentUserId(userData?._id || '1');

            // Set initial demo messages
            setMessages([
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'John Doe',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
            ]);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, newMessages),
        );
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: currentUserId || '1',
                }}
                keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
