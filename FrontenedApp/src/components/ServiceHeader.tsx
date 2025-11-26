import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import TextComp from './TextComp';

interface ServiceHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBackPress?: () => void;
    rightComp?: React.ReactNode;
    style?: ViewStyle;
    titleAlign?: 'left' | 'center';
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({
    title,
    subtitle,
    showBack = false,
    onBackPress,
    rightComp,
    style,
    titleAlign = 'center',
}) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const colors = Colors[theme];

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.surface }, style]}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <TextComp text="←" style={{ fontSize: 24, color: colors.text }} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={[styles.centerContainer, { alignItems: titleAlign === 'left' ? 'flex-start' : 'center' }]}>
                <TextComp text={title} style={StyleSheet.flatten([styles.title, { color: colors.text }])} />
                {subtitle && (
                    <TextComp text={subtitle} style={StyleSheet.flatten([styles.subtitle, { color: colors.textSecondary }])} />
                )}
            </View>

            <View style={styles.rightContainer}>
                {rightComp}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: moderateScale(60),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        borderBottomWidth: 1,
    },
    leftContainer: {
        width: 40,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    rightContainer: {
        minWidth: 40,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: moderateScale(4),
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: moderateScale(12),
        marginTop: 2,
    },
});

export default ServiceHeader;
