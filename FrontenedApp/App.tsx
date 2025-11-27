/**
 * @file App.tsx
 * @description Root application component that initializes core app functionality
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '@app/redux/store';
import { ThemeProvider } from '@app/context/ThemeContext';
import Navigation from '@app/navigation';
import '@app/lang/i18n'; // Initialize i18n

/**
 * Main application component that serves as the entry point for the app.
 * 
 * @returns {JSX.Element} The rendered app
 */
const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
