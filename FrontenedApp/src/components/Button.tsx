import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { ScaledSheet, Colors, Typography } from '@app/styles';

interface ButtonProps {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

/**
 * Button - Standardized button component
 * 
 * @param title - Button text
 * @param onPress - Press handler
 * @param disabled - Whether button is disabled
 * @param loading - Whether to show loading indicator
 * @param variant - Button style variant
 * @param size - Button size
 */
export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled = false,
    loading = false,
    variant = 'primary',
    size = 'medium',
    style,
    textStyle,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                styles[size],
                isDisabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' ? Colors.light.primary : Colors.light.text}
                />
            ) : (
                <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = ScaledSheet.create({
    button: {
        borderRadius: '8@s',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Variants
    primary: {
        backgroundColor: Colors.light.primary,
    },
    secondary: {
        backgroundColor: Colors.light.backgroundSecondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.light.primary,
    },

    // Sizes
    small: {
        paddingHorizontal: '12@s',
        paddingVertical: '8@vs',
    },
    medium: {
        paddingHorizontal: '16@s',
        paddingVertical: '12@vs',
    },
    large: {
        paddingHorizontal: '24@s',
        paddingVertical: '16@vs',
    },

    // Text styles
    text: {
        ...Typography.button,
    },
    primaryText: {
        color: Colors.light.background,
    },
    secondaryText: {
        color: Colors.light.text,
    },
    outlineText: {
        color: Colors.light.primary,
    },
    smallText: {
        ...Typography.buttonSmall,
    },
    mediumText: {
        ...Typography.button,
    },
    largeText: {
        ...Typography.button,
    },

    disabled: {
        opacity: 0.5,
    },
});
