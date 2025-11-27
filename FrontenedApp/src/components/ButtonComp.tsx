import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import TextComp from './TextComp';
import { useTheme } from '@app/context/ThemeContext';
import { Colors } from '@app/styles/colors';
import { moderateScale } from '@app/styles/scaling';

interface ButtonCompProps {
    text: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const ButtonComp: React.FC<ButtonCompProps> = ({
    text,
    onPress,
    isLoading = false,
    disabled = false,
    variant = 'primary',
    style,
    textStyle,
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme];

    const getBackgroundColor = () => {
        if (disabled) return colors.textSecondary; // Or a disabled color
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.surface;
            case 'outline': return 'transparent';
            default: return colors.primary;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary': return '#FFFFFF';
            case 'secondary': return colors.text;
            case 'outline': return colors.primary;
            default: return '#FFFFFF';
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && { borderWidth: 1, borderColor: colors.primary },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <TextComp
                    text={text}
                    style={{ ...styles.text, color: getTextColor(), ...textStyle }}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: moderateScale(48),
        borderRadius: moderateScale(8),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
    },
    text: {
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});

export default ButtonComp;
