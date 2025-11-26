import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import TextComp from './TextComp';
import { useTheme } from '@/context/ThemeContext';
import useIsRTL from '@/hooks/useIsRTL';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import fontFamily from '@/styles/fontFamily';

interface TextInputCompProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    isPassword?: boolean;
}

const TextInputComp: React.FC<TextInputCompProps> = ({
    label,
    error,
    containerStyle,
    isPassword = false,
    style,
    ...props
}) => {
    const { theme } = useTheme();
    const isRTL = useIsRTL();
    const colors = Colors[theme];

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <TextComp
                    text={label}
                    style={[
                        styles.label,
                        { textAlign: isRTL ? 'right' : 'left', color: colors.textSecondary }
                    ]}
                />
            )}
            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: colors.surface,
                    borderColor: error ? colors.error : 'transparent',
                }
            ]}>
                <TextInput
                    style={[
                        styles.input,
                        {
                            color: colors.text,
                            textAlign: isRTL ? 'right' : 'left',
                        },
                        style,
                    ]}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={isPassword}
                    {...props}
                />
            </View>
            {error && (
                <TextComp
                    text={error}
                    isDynamic
                    style={[
                        styles.error,
                        { textAlign: isRTL ? 'right' : 'left', color: colors.error }
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: moderateScale(16),
    },
    label: {
        marginBottom: moderateScale(8),
        fontSize: moderateScale(14),
    },
    inputContainer: {
        height: moderateScale(48),
        borderRadius: moderateScale(8),
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: moderateScale(12),
    },
    input: {
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(16),
        flex: 1,
    },
    error: {
        marginTop: moderateScale(4),
        fontSize: moderateScale(12),
    },
});

export default TextInputComp;
