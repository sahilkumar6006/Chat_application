import { useTranslation } from 'react-i18next';

const useIsRTL = () => {
    const { i18n } = useTranslation();
    return i18n.language === 'ar';
};

export default useIsRTL;
