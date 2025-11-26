import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TextComp from './TextComp';
import { useTheme } from '@/context/ThemeContext';
import useIsRTL from '@/hooks/useIsRTL';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';

interface HeaderCompProps {
    title?: string;
    showBack?: boolean;
    onBackPress?: () => void;
    rightComp?: React.ReactNode;
    style?: ViewStyle;
}

const HeaderComp: React.FC<HeaderCompProps> = ({
    title,
    showBack = false,
    onBackPress,
    rightComp,
    style,
}) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const isRTL = useIsRTL();
    const colors = Colors[theme];

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={[styles.container, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomColor: colors.surface }, style]}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <TextComp text="<" style={{ fontSize: 24, color: colors.text }} isDynamic />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.centerContainer}>
                {title && <TextComp text={title} style={styles.title} />}
            </View>

            <View style={styles.rightContainer}>
                {rightComp}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: moderateScale(56),
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        borderBottomWidth: 1,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 2,
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: moderateScale(8),
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
});

export default HeaderComp;
