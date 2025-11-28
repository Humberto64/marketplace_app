// android/app/src/Screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest } from '../../api/authApi';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        try {
            setLoading(true);

            const response = await loginRequest({ email, password });
            const data = response.data; // AuthenticationResponse

            // Guardar tokens y algunos datos básicos
            await AsyncStorage.multiSet([
                ['token', data.token],
                ['refreshToken', data.refreshToken || ''],
                ['authuserId', String(data.authuserId || '')],
                ['email', data.email || ''],
                ['firstname', data.firstname || ''],
                ['lastname', data.lastname || ''],
                ['role', data.role || ''],
            ]);

            setLoading(false);

            // Ir al dashboard y resetear la navegación
            navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
            });
        } catch (error) {
            setLoading(false);
            console.log('Login error:', error?.response?.data || error.message);
            Alert.alert('Error', 'Credenciales inválidas o error en el servidor');
        }
    };

    const goToRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingresa tu email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="small" />
            ) : (
                <Button title="Entrar" onPress={handleLogin} />
            )}

            <View style={styles.footer}>
                <Text>¿No tienes cuenta?</Text>
                <Text style={styles.link} onPress={goToRegister}>
                    Crear cuenta
                </Text>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: 'center' },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: { marginTop: 8, marginBottom: 4 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    footer: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    link: {
        marginLeft: 4,
        color: 'blue',
        textDecorationLine: 'underline',
    },
});
