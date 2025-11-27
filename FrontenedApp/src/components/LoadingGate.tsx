import React, { ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@app/styles';

interface LoadingGateProps {
    active: boolean;
    children: ReactNode;
    shimmer?: boolean;
    fullScreen?: boolean;
}

/**
 * LoadingGate - Conditionally renders loading indicator or children
 * 
 * @param active - Whether loading is active
 * @param children - Content to show when not loading
 * @param shimmer - Whether to show shimmer effect (not implemented yet, shows spinner)
 * @param fullScreen - Whether to show full screen loader
 */
export const LoadingGate: React.FC<LoadingGateProps> = ({
    active,
    children,
    shimmer = false,
    fullScreen = false,
}) => {
    if (!active) {
        return <>{children}</>;
    }

    if (fullScreen) {
        return (
            <View style={styles.fullScreenContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    fullScreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
    },
});
