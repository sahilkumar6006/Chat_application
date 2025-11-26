/**
 * Login screen component for user authentication
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import WrapperContainer from '@/components/WrapperContainer';
import HeaderComp from '@/components/HeaderComp';
import TextComp from '@/components/TextComp';
import TextInputComp from '@/components/TextInputComp';
import ButtonComp from '@/components/ButtonComp';
import { useTheme } from '@/context/ThemeContext';
import useIsRTL from '@/hooks/useIsRTL';
import useRTLStyles from './styles';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import Routes from '../../navigation/Routes';
import { authService } from '@/services/authService';
// import actions from '@/redux/actions'; // TODO: Implement actions
// import { useDispatch } from '@/redux/hooks';

const Login = () => {
  const { theme, toggleTheme } = useTheme();
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const Navigation = useNavigation<any>();
  // const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
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
      <HeaderComp title="LOGIN" showBack={false} />

      <View style={styles.content}>
        <TextComp text="WELCOME_BACK" style={styles.title} />

        <TextInputComp
          label="EMAIL"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInputComp
          label="PASSWORD"
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        <ButtonComp
          text="LOGIN"
          onPress={handleLogin}
          isLoading={loading}
          style={{ marginBottom: 16 }}
        />

        <ButtonComp
          text="Don't have an account? Register"
          onPress={() => Navigation.navigate(Routes.REGISTER)}
          variant="outline"
          style={{ marginBottom: 16 }}
        />

        <ButtonComp
          text="Toggle Theme"
          onPress={toggleTheme}
          variant="outline"
        />
      </View>
    </WrapperContainer>
  );
};

export default Login;
