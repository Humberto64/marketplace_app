// android/app/src/Screens/Orders/OrderFormScreen.js
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
    createOrder,
    updateOrder,
} from '../../api/ordersApi';

const OrderFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    const [status, setStatus] = useState(item ? item.status : '');
    const [total, setTotal] = useState(item ? String(item.total) : '');
    const [userId, setUserId] = useState(item ? String(item.userId) : '');

    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit order' : 'Add order',
        });
    }, [navigation, isEdit]);

    const handleSave = async () => {
        if (!status || !total || !userId) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        const payload = {
            status,
            total: parseFloat(total),
            userId: parseInt(userId, 10),
        };

        if (Number.isNaN(payload.total) || Number.isNaN(payload.userId)) {
            Alert.alert('Error', 'Valores numéricos inválidos');
            return;
        }

        try {
            setLoading(true);

            if (isEdit) {
                await updateOrder(item.id, payload);
            } else {
                await createOrder(payload);
            }

            setLoading(false);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            console.log('Error guardando orden:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudo guardar la orden');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {isEdit ? 'Editar orden' : 'Crear orden'}
            </Text>

            <Text style={styles.label}>Status</Text>
            <TextInput
                style={styles.input}
                value={status}
                onChangeText={setStatus}
                placeholder="Ej: PENDING"
            />

            <Text style={styles.label}>Total</Text>
            <TextInput
                style={styles.input}
                value={total}
                onChangeText={setTotal}
                keyboardType="numeric"
                placeholder="Ej: 99.99"
            />

            <Text style={styles.label}>User ID</Text>
            <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                keyboardType="numeric"
                placeholder="ID del usuario"
            />

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    title={isEdit ? 'Guardar cambios' : 'Crear orden'}
                    onPress={handleSave}
                />
            )}
        </ScrollView>
    );
};

export default OrderFormScreen;

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
