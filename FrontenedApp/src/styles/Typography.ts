import { TextStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const Typography: { [key: string]: TextStyle } = {
    // Headers
    h1: {
        fontSize: moderateScale(32),
        fontWeight: '700',
        lineHeight: moderateScale(40),
    },
    h2: {
        fontSize: moderateScale(28),
        fontWeight: '700',
        lineHeight: moderateScale(36),
    },
    h3: {
        fontSize: moderateScale(24),
        fontWeight: '600',
        lineHeight: moderateScale(32),
    },
    h4: {
        fontSize: moderateScale(20),
        fontWeight: '600',
        lineHeight: moderateScale(28),
    },
    h5: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        lineHeight: moderateScale(24),
    },
    h6: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        lineHeight: moderateScale(22),
    },

    // Body text
    body1: {
        fontSize: moderateScale(16),
        fontWeight: '400',
        lineHeight: moderateScale(24),
    },
    body2: {
        fontSize: moderateScale(14),
        fontWeight: '400',
        lineHeight: moderateScale(20),
    },

    // Captions
    caption: {
        fontSize: moderateScale(12),
        fontWeight: '400',
        lineHeight: moderateScale(16),
    },
    captionBold: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        lineHeight: moderateScale(16),
    },

    // Buttons
    button: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        lineHeight: moderateScale(20),
    },
    buttonSmall: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        lineHeight: moderateScale(18),
    },

    // Labels
    label: {
        fontSize: moderateScale(14),
        fontWeight: '500',
        lineHeight: moderateScale(18),
    },
    labelSmall: {
        fontSize: moderateScale(12),
        fontWeight: '500',
        lineHeight: moderateScale(16),
    },
};

export default Typography;
