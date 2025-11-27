import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChatService } from '@app/services/ChatService';
import { IUser } from '@app/typings/ChatTypes';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import { moderateScale } from '@app/styles/scaling';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import TextComp from '@app/components/TextComp';
import Routes from '@app/navigation/Routes';

export const UserListScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const colors = Colors[theme];
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [creatingChat, setCreatingChat] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const userData = await ChatService.getUserList();
            setUsers(userData);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserPress = async (user: IUser) => {
        setCreatingChat(user._id);
        try {
            const chat = await ChatService.accessChat(user._id);
            navigation.navigate(Routes.CHAT_DETAIL as never, { chatId: chat._id } as never);
        } catch (error) {
            console.error('Error creating/accessing chat:', error);
        } finally {
            setCreatingChat(null);
        }
    };

    const renderUserItem = ({ item }: { item: IUser }) => {
        const isCreating = creatingChat === item._id;

        return (
            <TouchableOpacity
                style={[styles.userItem, { backgroundColor: colors.surface, borderBottomColor: colors.textSecondary }]}
                onPress={() => handleUserPress(item)}
                disabled={isCreating}
                activeOpacity={0.7}
            >
                <Image
                    source={{
                        uri: item.image || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                    }}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <TextComp
                        text={item.name}
                        style={[styles.userName, { color: colors.text }]}
                    />
                    <TextComp
                        text={item.email}
                        style={[styles.userEmail, { color: colors.textSecondary }]}
                    />
                </View>
                {isCreating && (
                    <ActivityIndicator size="small" color={colors.primary} />
                )}
            </TouchableOpacity>
        );
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
            padding: moderateScale(20),
        },
        userItem: {
            flexDirection: 'row',
            padding: moderateScale(16),
            borderBottomWidth: 0.5,
            alignItems: 'center',
        },
        avatar: {
            width: moderateScale(50),
            height: moderateScale(50),
            borderRadius: moderateScale(25),
            marginRight: moderateScale(12),
        },
        userInfo: {
            flex: 1,
        },
        userName: {
            fontSize: moderateScale(16),
            fontWeight: '600',
            marginBottom: moderateScale(4),
        },
        userEmail: {
            fontSize: moderateScale(14),
        },
    });

    if (loading) {
        return (
            <WrapperContainer style={styles.container}>
                <HeaderComp title="Start New Chat" showBack={true} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </WrapperContainer>
        );
    }

    return (
        <WrapperContainer style={styles.container}>
            <HeaderComp title="Start New Chat" showBack={true} />
            {users.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <TextComp
                        text="No users found"
                        style={{ fontSize: moderateScale(16), color: colors.textSecondary }}
                    />
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item._id}
                    renderItem={renderUserItem}
                />
            )}
        </WrapperContainer>
    );
};

export default UserListScreen;
