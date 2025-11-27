/**
 * Login screen component for user authentication
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import WrapperContainer from '@app/components/WrapperContainer';
import HeaderComp from '@app/components/HeaderComp';
import TextComp from '@app/components/TextComp';
import TextInputComp from '@app/components/TextInputComp';
import ButtonComp from '@app/components/ButtonComp';
import { useTheme } from '@app/context/ThemeContext';
import useIsRTL from '@app/hooks/useIsRTL';
import useRTLStyles from './styles';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import Routes from '../../navigation/Routes';
import { authService } from '@app/services/authService';
import { useTranslation } from 'react-i18next';
import { LangKeys } from '@app/constants/langKeys';

const Login = () => {
  const { theme, toggleTheme } = useTheme();
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const Navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t(LangKeys.ERROR), 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      console.log('Login successful:', response.user);

      // Navigate to main tabs after successful login
      Navigation.navigate(Routes.MAIN_TABS);
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperContainer style={styles.container}>
      <HeaderComp title={t(LangKeys.LOGIN)} showBack={false} />

      <View style={styles.content}>
        <TextComp text={t(LangKeys.WELCOME_BACK)} style={styles.title} />

        <TextInputComp
          label={t(LangKeys.EMAIL)}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInputComp
          label={t(LangKeys.PASSWORD)}
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        <ButtonComp
          text={t(LangKeys.LOGIN)}
          onPress={handleLogin}
          isLoading={loading}
          style={{ marginBottom: 16 }}
        />

        <ButtonComp
          text={t(LangKeys.DONT_HAVE_ACCOUNT)}
          onPress={() => Navigation.navigate(Routes.REGISTER)}
          variant="outline"
          style={{ marginBottom: 16 }}
        />

        <ButtonComp
          text={t(LangKeys.TOGGLE_THEME)}
          onPress={toggleTheme}
          variant="outline"
        />
      </View>
    </WrapperContainer>
  );
};

export default Login;
