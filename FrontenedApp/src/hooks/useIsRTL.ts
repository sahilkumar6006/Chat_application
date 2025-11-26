import { I18nManager } from 'react-native';

const useIsRTL = () => {
    return I18nManager.isRTL;
};

export default useIsRTL;
