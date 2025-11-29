// android/app/src/Screens/Settings/SettingsScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove([
                'token',
                'refreshToken',
                'authuserId',
                'email',
                'firstname',
                'lastname',
                'role',
            ]);

            Alert.alert(
                'Sesión cerrada',
                'Vuelve a abrir la app para iniciar sesión de nuevo.'
            );

            // Opcional: cerrar drawer
            navigation.closeDrawer?.();
        } catch (e) {
            console.log('Error al cerrar sesión', e);
            Alert.alert('Error', 'No se pudo cerrar sesión');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Button title="Cerrar sesión" onPress={handleLogout} />
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
});
