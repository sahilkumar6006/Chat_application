import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import Config from 'react-native-config';

interface StripeContainerProps {
    children: React.ReactNode;
}

const StripeContainer: React.FC<StripeContainerProps> = ({ children }) => {
    // Fallback to hardcoded key if env var is missing (for development reliability)
    const publishableKey = Config.STRIPE_PUBLISHABLE_KEY || '';

    return (
        <StripeProvider
            publishableKey={publishableKey}
        >
            <>{children}</>
        </StripeProvider>
    );
};

export default StripeContainer;
