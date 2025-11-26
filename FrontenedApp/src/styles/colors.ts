export const commonColors = {
    primary: '#007AFF',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
};

export type ThemeType = 'light' | 'dark';

export const Colors = {
    light: {
        background: '#FFFFFF',
        surface: '#F2F2F7',
        text: '#000000',
        textSecondary: '#3C3C43',
        ...commonColors,
    },
    dark: {
        background: '#000000',
        surface: '#1C1C1E',
        text: '#FFFFFF',
        textSecondary: '#EBEBF5',
        ...commonColors,
    },
};
