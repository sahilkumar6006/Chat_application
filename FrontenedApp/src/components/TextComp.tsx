import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';

interface TextCompProps extends TextProps {
    text: string;
    isDynamic?: boolean;
    values?: Record<string, any>;
    style?: TextStyle;
}

const TextComp: React.FC<TextCompProps> = ({
    text,
    isDynamic = false,
    values = {},
    style,
    ...props
}) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const colors = Colors[theme];

    return (
        <Text
            style={[
                styles.text,
                { color: colors.text },
                style,
            ]}
            {...props}
        >
            {isDynamic ? text : t(text, values)}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
        textAlign: 'left',
    },
});

export default TextComp;
