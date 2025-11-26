import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/styles/colors';

interface WrapperContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    isLoading?: boolean;
}

const WrapperContainer: React.FC<WrapperContainerProps> = ({
    children,
    style,
    isLoading = false,
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar
                barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <View style={[styles.container, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default WrapperContainer;
