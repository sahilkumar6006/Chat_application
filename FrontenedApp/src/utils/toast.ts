import Toast from 'react-native-toast-message';

export const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
    duration: number = 3000
) => {
    Toast.show({
        type,
        text1: type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info',
        text2: message,
        visibilityTime: duration,
        position: 'top',
    });
};

export const showSuccessToast = (message: string, duration?: number) => {
    showToast(message, 'success', duration);
};

export const showErrorToast = (message: string, duration?: number) => {
    showToast(message, 'error', duration);
};

export const showInfoToast = (message: string, duration?: number) => {
    showToast(message, 'info', duration);
};
