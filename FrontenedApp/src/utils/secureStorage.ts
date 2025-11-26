import * as Keychain from 'react-native-keychain';

export const secureStorage = {
    setItem: async (key: string, value: string) => {
        try {
            await Keychain.setGenericPassword(key, value, { service: key });
        } catch (error) {
            console.error('SecureStorage setItem error:', error);
        }
    },

    getItem: async (key: string) => {
        try {
            const credentials = await Keychain.getGenericPassword({ service: key });
            if (credentials) {
                return credentials.password;
            }
            return null;
        } catch (error) {
            console.error('SecureStorage getItem error:', error);
            return null;
        }
    },

    removeItem: async (key: string) => {
        try {
            await Keychain.resetGenericPassword({ service: key });
        } catch (error) {
            console.error('SecureStorage removeItem error:', error);
        }
    },

    setObject: async (key: string, value: any) => {
        try {
            const jsonValue = JSON.stringify(value);
            await Keychain.setGenericPassword(key, jsonValue, { service: key });
        } catch (error) {
            console.error('SecureStorage setObject error:', error);
        }
    },

    getObject: async (key: string) => {
        try {
            const credentials = await Keychain.getGenericPassword({ service: key });
            if (credentials) {
                return JSON.parse(credentials.password);
            }
            return null;
        } catch (error) {
            console.error('SecureStorage getObject error:', error);
            return null;
        }
    },
};
