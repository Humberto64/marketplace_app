// android/app/src/Screens/Users/UserFormScreen.js
import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import {
    createUser,
    updateUser,
} from '../../api/usersApi';

const UserFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    const [name, setName] = useState(item ? item.name : '');
    const [email, setEmail] = useState(item ? item.email : '');
    const [phone, setPhone] = useState(item ? item.phone : '');

    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit user' : 'Add user',
        });
    }, [navigation, isEdit]);

    const handleSave = async () => {
        if (!name || !email) {
            Alert.alert('Error', 'Nombre y email son obligatorios');
            return;
        }

        const payload = { name, email, phone };

        try {
            setLoading(true);

            if (isEdit) await updateUser(item.id, payload);
            else await createUser(payload);

            setLoading(false);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            console.log('Error guardando usuario:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudo guardar el usuario');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {isEdit ? 'Editar usuario' : 'Crear usuario'}
            </Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ej: Juan Pérez"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Ej: juan@mail.com"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Ej: 70000000"
                keyboardType="numeric"
            />

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    title={isEdit ? 'Guardar cambios' : 'Crear usuario'}
                    onPress={handleSave}
                />
            )}
        </ScrollView>
    );
};

export default UserFormScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },

    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },

    label: { marginTop: 8, marginBottom: 4 },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
});
