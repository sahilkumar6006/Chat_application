import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeType, Colors } from '@/styles/colors';

const useRTLStyles = <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
    styleFactory: (isRTL: boolean, theme: ThemeType, colors: typeof Colors.light) => T,
    isRTL: boolean,
    theme: ThemeType
) => {
    const colors = Colors[theme];
    return useMemo(() => styleFactory(isRTL, theme, colors), [isRTL, theme, colors]);
};

export default useRTLStyles;
