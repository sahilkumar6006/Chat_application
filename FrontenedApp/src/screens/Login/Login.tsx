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
// import actions from '@/redux/actions'; // TODO: Implement actions
// import { useDispatch } from '@/redux/hooks';

const Login = () => {
    const { theme, toggleTheme } = useTheme();
    const isRTL = useIsRTL();
    const styles = useRTLStyles(isRTL, theme);
    // const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            // await dispatch(actions.login({ email, password }));
            console.log('Login attempt:', email, password);
            setTimeout(() => setLoading(false), 1000); // Simulate API call
        } catch (error) {
            console.error(error);
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
                    text="Toggle Theme"
                    onPress={toggleTheme}
                    variant="outline"
                />
            </View>
        </WrapperContainer>
    );
};

export default Login;
