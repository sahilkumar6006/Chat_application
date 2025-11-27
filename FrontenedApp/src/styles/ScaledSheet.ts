import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

/**
 * ScaledSheet - A wrapper around StyleSheet.create that supports responsive scaling
 * 
 * Usage:
 * - Use '@s' suffix for horizontal scaling (e.g., '16@s' -> scale(16))
 * - Use '@vs' suffix for vertical scaling (e.g., '16@vs' -> verticalScale(16))
 * - Use '@ms' suffix for moderate scaling (e.g., '16@ms' -> moderateScale(16))
 * - Regular numbers work as usual
 * 
 * Example:
 * const styles = ScaledSheet.create({
 *   container: {
 *     padding: '16@s',
 *     marginVertical: '12@vs',
 *     fontSize: '14@ms',
 *   },
 * });
 */

type ScaledValue = string | number;
type ScaledStyle = { [key: string]: any };
type ScaledStyles<T> = { [P in keyof T]: ScaledStyle };

const processStyle = (style: ScaledStyle): ScaledStyle => {
    const processed: ScaledStyle = {};

    for (const key in style) {
        const value = style[key];

        if (typeof value === 'string') {
            // Check for scaling suffixes
            if (value.endsWith('@s')) {
                const num = parseFloat(value.replace('@s', ''));
                processed[key] = scale(num);
            } else if (value.endsWith('@vs')) {
                const num = parseFloat(value.replace('@vs', ''));
                processed[key] = verticalScale(num);
            } else if (value.endsWith('@ms')) {
                const num = parseFloat(value.replace('@ms', ''));
                processed[key] = moderateScale(num);
            } else {
                processed[key] = value;
            }
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Recursively process nested objects
            processed[key] = processStyle(value);
        } else {
            processed[key] = value;
        }
    }

    return processed;
};

export const ScaledSheet = {
    create: <T extends ScaledStyles<T>>(styles: T): { [P in keyof T]: any } => {
        const processedStyles: any = {};

        for (const key in styles) {
            processedStyles[key] = processStyle(styles[key]);
        }

        return StyleSheet.create(processedStyles);
    },
};

// Re-export scaling functions for direct use
export { scale, verticalScale, moderateScale };
