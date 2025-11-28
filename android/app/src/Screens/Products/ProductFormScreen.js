// android/app/src/Screens/Products/ProductFormScreen.js
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
    createProduct,
    updateProduct,
} from '../../api/productsApi';

const ProductFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    const [name, setName] = useState(item ? item.name : '');
    const [price, setPrice] = useState(item ? String(item.price) : '');
    const [stock, setStock] = useState(item ? String(item.stock) : '');
    const [storeId, setStoreId] = useState(item ? String(item.storeId) : '');

    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit product' : 'Add product',
        });
    }, [navigation, isEdit]);

    const handleSave = async () => {
        if (!name || !price || !stock || !storeId) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        const payload = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            storeId: parseInt(storeId, 10),
        };

        if (
            Number.isNaN(payload.price) ||
            Number.isNaN(payload.stock) ||
            Number.isNaN(payload.storeId)
        ) {
            Alert.alert('Error', 'Valores numéricos inválidos');
            return;
        }

        try {
            setLoading(true);

            if (isEdit) {
                await updateProduct(item.id, payload);
            } else {
                await createProduct(payload);
            }

            setLoading(false);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            console.log('Error guardando producto:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudo guardar el producto');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {isEdit ? 'Editar producto' : 'Crear producto'}
            </Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ej: Laptop"
            />

            <Text style={styles.label}>Precio</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="Ej: 999.99"
            />

            <Text style={styles.label}>Stock</Text>
            <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
                placeholder="Ej: 20"
            />

            <Text style={styles.label}>Store ID</Text>
            <TextInput
                style={styles.input}
                value={storeId}
                onChangeText={setStoreId}
                keyboardType="numeric"
                placeholder="ID de la tienda"
            />

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    title={isEdit ? 'Guardar cambios' : 'Crear producto'}
                    onPress={handleSave}
                />
            )}
        </ScrollView>
    );
};

export default ProductFormScreen;

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
