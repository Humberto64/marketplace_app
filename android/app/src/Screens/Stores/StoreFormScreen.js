// android/app/src/Screens/Stores/StoreFormScreen.js
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
    createStore,
    updateStore,
} from '../../api/storesApi';

const StoreFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    const [name, setName] = useState(item ? item.name : '');
    const [location, setLocation] = useState(item ? item.location : '');
    const [description, setDescription] = useState(item ? item.description : '');

    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit store' : 'Add store',
        });
    }, [navigation, isEdit]);

    const handleSave = async () => {
        if (!name || !location || !description) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        const payload = { name, location, description };

        try {
            setLoading(true);

            if (isEdit) await updateStore(item.id, payload);
            else await createStore(payload);

            setLoading(false);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            console.log('Error guardando tienda:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudo guardar la tienda');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {isEdit ? 'Editar tienda' : 'Crear tienda'}
            </Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ej: Mi tienda"
            />

            <Text style={styles.label}>Ubicación</Text>
            <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Ej: Santa Cruz"
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={[styles.input, { minHeight: 80 }]}
                value={description}
                onChangeText={setDescription}
                multiline
                placeholder="Describe la tienda..."
            />

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    title={isEdit ? 'Guardar cambios' : 'Crear tienda'}
                    onPress={handleSave}
                />
            )}
        </ScrollView>
    );
};

export default StoreFormScreen;

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
