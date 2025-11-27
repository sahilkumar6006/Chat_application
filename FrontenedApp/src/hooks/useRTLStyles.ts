import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ThemeType, Colors } from '@app/styles/colors';
import useIsRTL from './useIsRTL';
import { useTheme } from '@app/context/ThemeContext';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

/**
 * Custom hook for creating RTL-aware styles with theme support
 * 
 * @example
 * const styles = useRTLStyles((isRTL, theme, colors) => ({
 *   container: {
 *     flexDirection: isRTL ? 'row-reverse' : 'row',
 *     textAlign: isRTL ? 'right' : 'left',
 *     backgroundColor: colors.background,
 *   },
 *   text: {
 *     marginLeft: isRTL ? 0 : 10,
 *     marginRight: isRTL ? 10 : 0,
 *   }
 * }));
 */
const useRTLStyles = <T extends NamedStyles<T>>(
    styleFactory: (isRTL: boolean, theme: ThemeType, colors: typeof Colors.light) => T
): { [P in keyof T]: any } => {
    const isRTL = useIsRTL();
    const { theme } = useTheme();
    const colors = Colors[theme];

    return useMemo(
        () => StyleSheet.create(styleFactory(isRTL, theme, colors)),
        [isRTL, theme, colors]
    );
};

export default useRTLStyles;
