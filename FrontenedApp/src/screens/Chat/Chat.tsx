import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatService } from '@app/services/ChatService';
import { authService } from '@app/services/authService';
import { IChat } from '@app/typings/ChatTypes';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import TextComp from '@app/components/TextComp';
import ChatListItem from '@app/components/ChatListItem';
import Routes from '@app/navigation/Routes';

export const Chat = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const colors = Colors[theme];
    const [chats, setChats] = useState<IChat[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        try {
            const user = await authService.getUser();
            if (user) {
                const chatData = await ChatService.getChats(user.id);
                setChats(chatData);
            }
        } catch (error) {
            console.error('Error loading chats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadChats();
    };

    const handleChatPress = (chat: IChat) => {
        navigation.navigate(Routes.CHAT_DETAIL as never, { chatId: chat.id } as never);
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
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        emptyText: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
        },
    });

    if (loading) {
        return (
            <WrapperContainer style={styles.container}>
                <HeaderComp title="CHATS" showBack={false} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </WrapperContainer>
        );
    }

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp title="CHATS" showBack={false} />
            {chats.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <TextComp
                        text="No chats yet"
                        style={styles.emptyText}
                        isDynamic
                    />
                </View>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ChatListItem
                            chat={item}
                            onPress={() => handleChatPress(item)}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
        </WrapperContainer>
    );
};

export default Chat;
