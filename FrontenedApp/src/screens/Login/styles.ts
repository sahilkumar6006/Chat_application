import { StyleSheet } from 'react-native';
import { Colors, ThemeType } from '@app/styles/colors';
import fontFamily from '@app/styles/fontFamily';
import { moderateScale } from '@app/styles/scaling';
import { useMemo } from 'react';

const useRTLStyles = (isRTL: boolean, theme: ThemeType) => {
    const colors = Colors[theme];

    return useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        content: {
            flex: 1,
            padding: moderateScale(16),
        },
        title: {
            fontFamily: fontFamily.bold,
            fontSize: moderateScale(24),
            marginBottom: moderateScale(32),
            textAlign: isRTL ? 'right' : 'left',
        },
    }), [isRTL, theme, colors]);
};

export default useRTLStyles;
