import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/styles/colors';
import { useTheme } from '@/context/ThemeContext';

interface ServiceItemProps {
    title: string;
    price: number;
    description?: string;
    quantity: number;
    onAdd: () => void;
    onIncrement: () => void;
    onDecrement: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
    title,
    price,
    description,
    quantity,
    onAdd,
    onIncrement,
    onDecrement,
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.background }]}>
            <View style={styles.infoContainer}>
                <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>{title}</Text>
                <Text style={[styles.price, { color: isDark ? Colors.dark.text : Colors.light.text }]}>₹{price}</Text>
                {description && (
                    <Text style={[styles.description, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                        {description}
                    </Text>
                )}
            </View>
            <View style={styles.actionContainer}>
                {quantity === 0 ? (
                    <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                        <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityButton} onPress={onDecrement}>
                            <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity style={styles.quantityButton} onPress={onIncrement}>
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        paddingRight: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
    },
    actionContainer: {
        justifyContent: 'center',
    },
    addButton: {
        backgroundColor: '#FF9500', // Warning color from palette, looks like orange
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF9500',
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    quantityButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    quantityText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
});

export default ServiceItem;
