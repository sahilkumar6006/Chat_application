import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@app/styles/colors';
import { useTheme } from '@app/context/ThemeContext';

interface ServiceCategoryCardProps {
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
    color?: string;
    style?: ViewStyle;
}

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ title, onPress, icon, color = Colors.light.primary, style }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface },
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                {icon ? icon : <Text style={styles.iconPlaceholder}>{title.charAt(0)}</Text>}
            </View>
            <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '45%',
        aspectRatio: 1,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconPlaceholder: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ServiceCategoryCard;
