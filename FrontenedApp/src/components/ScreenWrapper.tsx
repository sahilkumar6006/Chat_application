import React, { ReactNode } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { ScaledSheet, Colors, Typography } from '@app/styles';

interface ScreenWrapperProps {
    children: ReactNode;
    title?: string;
    backgroundColor?: string;
    safeArea?: boolean;
}

/**
 * ScreenWrapper - Consistent screen layout wrapper
 * 
 * @param children - Screen content
 * @param title - Optional screen title
 * @param backgroundColor - Background color
 * @param safeArea - Whether to use SafeAreaView
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    title,
    backgroundColor = Colors.light.background,
    safeArea = true,
}) => {
    const Container = safeArea ? SafeAreaView : View;

    return (
        <Container style={[styles.container, { backgroundColor }]}>
            <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
            {title && (
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            )}
            <View style={styles.content}>{children}</View>
        </Container>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: '16@s',
        paddingVertical: '12@vs',
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    title: {
        ...Typography.h4,
        color: Colors.light.text,
    },
    content: {
        flex: 1,
    },
});
