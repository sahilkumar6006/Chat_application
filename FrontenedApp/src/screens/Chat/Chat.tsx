import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatService } from '@app/services/ChatService';
import { IChat } from '@app/typings/ChatTypes';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import { moderateScale } from '@app/styles/scaling';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import TextComp from '@app/components/TextComp';
import ChatListItem from '@app/components/ChatListItem';
import Routes from '@app/navigation/Routes';
import { useTranslation } from 'react-i18next';
import { LangKeys } from '@app/constants/langKeys';

export const Chat = () => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();
    const colors = Colors[theme];
    const [chats, setChats] = useState<IChat[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        try {
            const chatData = await ChatService.getChats();
            setChats(chatData);
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
        navigation.navigate(Routes.CHAT_DETAIL as never, { chatId: chat._id } as never);
    };

    const handleNewChat = () => {
        navigation.navigate(Routes.USER_LIST as never);
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
        fab: {
            position: 'absolute',
            right: moderateScale(20),
            bottom: moderateScale(20),
            width: moderateScale(56),
            height: moderateScale(56),
            borderRadius: moderateScale(28),
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        fabText: {
            color: '#FFFFFF',
            fontSize: moderateScale(24),
            fontWeight: '600',
        },
    });

    if (loading) {
        return (
            <WrapperContainer style={styles.container}>
                <HeaderComp title={t(LangKeys.CHATS)} showBack={false} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </WrapperContainer>
        );
    }

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp title={t(LangKeys.CHATS)} showBack={false} />
            {chats.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <TextComp
                        text={t(LangKeys.NO_CHATS)}
                        style={styles.emptyText}
                        isDynamic
                    />
                </View>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item._id}
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
            <TouchableOpacity style={styles.fab} onPress={handleNewChat} activeOpacity={0.8}>
                <TextComp text="+" style={styles.fabText} />
            </TouchableOpacity>
        </WrapperContainer>
    );
};

export default Chat;
