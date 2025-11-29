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
    // 🔹 Un solo estado para todo el formulario
    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirm: '',
    });

    const [loading, setLoading] = useState(false);

    const updateField = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleRegister = async () => {
        const { email, firstName, lastName, password, confirm } = form;

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

            const body = {
                firstname: firstName.trim(),  // 👈 igual que el front web
                lastname: lastName.trim(),   // 👈 igual que el front web
                email: email.trim(),
                password,
            };

            console.log('📦 Enviando al backend:', body);

            await registerRequest(body);

            setLoading(false);
            Alert.alert('Éxito', 'Cuenta creada correctamente');

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            setLoading(false);
            console.log(
                'Register error:',
                JSON.stringify(error?.response?.data ?? error.message, null, 2)
            );

            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'No se pudo crear la cuenta';

            Alert.alert('Error', msg);
        }
    };



    const goToLogin = () => navigation.navigate('Login');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cuenta</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                value={form.firstName}
                onChangeText={text => updateField('firstName', text)}
            />

            <Text style={styles.label}>Apellido</Text>
            <TextInput
                style={styles.input}
                placeholder="Tu apellido"
                value={form.lastName}
                onChangeText={text => updateField('lastName', text)}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingresa tu email"
                value={form.email}
                onChangeText={text => updateField('email', text)}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña"
                value={form.password}
                onChangeText={text => updateField('password', text)}
                secureTextEntry
            />

            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Repite la contraseña"
                value={form.confirm}
                onChangeText={text => updateField('confirm', text)}
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
