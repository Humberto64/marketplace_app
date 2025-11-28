// android/app/src/Screens/Auth/RegisterScreen.js
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
import { registerRequest } from '../../api/authApi';

const RegisterScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password || !confirm) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (password !== confirm) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);

            const body = { firstName, lastName, email, password };
            await registerRequest(body); // tu backend devuelve AuthenticationResponse

            setLoading(false);
            Alert.alert('Éxito', 'Cuenta creada correctamente');

            // Volver a login
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            setLoading(false);
            console.log('Register error:', error?.response?.data || error.message);
            Alert.alert('Error', 'No se pudo crear la cuenta');
        }
    };

    const goToLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cuenta</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                value={firstName}
                onChangeText={setFirstName}
            />

            <Text style={styles.label}>Apellido</Text>
            <TextInput
                style={styles.input}
                placeholder="Tu apellido"
                value={lastName}
                onChangeText={setLastName}
            />

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

            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Repite la contraseña"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="small" />
            ) : (
                <Button title="Registrarme" onPress={handleRegister} />
            )}

            <View style={styles.footer}>
                <Text>¿Ya tienes cuenta?</Text>
                <Text style={styles.link} onPress={goToLogin}>
                    Iniciar sesión
                </Text>
            </View>
        </View>
    );
};

export default RegisterScreen;

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
