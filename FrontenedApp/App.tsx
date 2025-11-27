/**
 * @file App.tsx
 * @description Root application component that initializes core app functionality
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { store, persistor } from '@app/redux/store';
import { ThemeProvider } from '@app/context/ThemeContext';
import Navigation from '@app/navigation';
import '@app/lang/i18n'; // Initialize i18n
import { StatusBar } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';

import { STRIPE_PUBLISHABLE_KEY } from '@env';

/**
 * Main application component that serves as the entry point for the app.
 * 
 * @returns {JSX.Element} The rendered app
 */
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <StripeProvider
            publishableKey={STRIPE_PUBLISHABLE_KEY}
          >
            <SafeAreaProvider style={{ flex: 1 }}>
              <StatusBar />
              <Navigation />
              <Toast />
            </SafeAreaProvider>
          </StripeProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
