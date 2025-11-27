import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@app/styles/colors';
import { useTheme } from '@app/context/ThemeContext';

interface SummaryItem {
    label: string;
    value: string | number;
    isTotal?: boolean;
}

interface BookingSummaryCardProps {
    title?: string;
    items: SummaryItem[];
    currency?: string;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({ title = 'Price Breakdown', items, currency = '₹' }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDark ? Colors.dark.surface : Colors.light.background }]}>
            <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>{title}</Text>
            {items.map((item, index) => (
                <View key={index} style={[styles.row, item.isTotal && styles.totalRow]}>
                    <Text
                        style={[
                            styles.label,
                            { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary },
                            item.isTotal && { color: isDark ? Colors.dark.text : Colors.light.text, fontWeight: '600' },
                        ]}
                    >
                        {item.label}
                    </Text>
                    <Text
                        style={[
                            styles.value,
                            { color: isDark ? Colors.dark.text : Colors.light.text },
                            item.isTotal && { fontWeight: '600' },
                        ]}
                    >
                        {typeof item.value === 'number' ? `${currency}${item.value}` : item.value}
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    totalRow: {
        marginTop: 4,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        marginBottom: 0,
    },
    label: {
        fontSize: 14,
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default BookingSummaryCard;
