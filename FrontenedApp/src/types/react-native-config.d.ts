declare module 'react-native-config' {
    export interface NativeConfig {
        API_BASE_URL?: string;
        STRIPE_PUBLISHABLE_KEY?: string;
    }

    export const Config: NativeConfig
    export default Config
}
