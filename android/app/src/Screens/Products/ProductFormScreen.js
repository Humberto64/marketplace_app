import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Alert,
    ScrollView,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // recuerda instalarlo si aún no

import { createProduct, updateProduct } from '../../api/productsApi';
import { getStores } from '../../api/storesApi';

const ProductFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    // 🔹 Un solo estado para el formulario
    const [form, setForm] = useState({
        name: item?.name ?? '',
        description: item?.description ?? '',
        price: item ? String(item.price) : '',
        stock: item ? String(item.stock) : '',
        storeId: item?.storeId ? String(item.storeId) : '',
        isAvailable:
            typeof item?.isAvailable === 'boolean' ? item.isAvailable : true,
    });

    const [stores, setStores] = useState([]);
    const [loadingStores, setLoadingStores] = useState(true);
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit product' : 'Add product',
        });
    }, [navigation, isEdit]);

    // helper para actualizar campos del form
    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Cargar lista de tiendas
    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoadingStores(true);
                const data = await getStores(); // [{id, name, ...}]
                setStores(data || []);

                // Si estamos creando y no hay store seleccionada,
                // escogemos la primera por defecto
                if (!isEdit && data && data.length > 0 && !form.storeId) {
                    setForm((prev) => ({
                        ...prev,
                        storeId: String(data[0].id),
                    }));
                }
            } catch (error) {
                console.log('Error cargando stores:', error?.response?.data || error);
                Alert.alert('Error', 'No se pudieron cargar las tiendas');
            } finally {
                setLoadingStores(false);
            }
        };

        fetchStores();
    }, [isEdit]);

    const handleSave = async () => {
        // validación mínima: que no estén vacíos
        if (
            !form.name.trim() ||
            !form.description.trim() ||
            !form.price.trim() ||
            !form.stock.trim() ||
            !form.storeId.trim()
        ) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: parseFloat(form.price),
            stock: parseInt(form.stock, 10),
            isAvailable: form.isAvailable,
            storeId: parseInt(form.storeId, 10),
        };

        // solo verificamos que sean números válidos
        if (
            Number.isNaN(payload.price) ||
            Number.isNaN(payload.stock) ||
            Number.isNaN(payload.storeId)
        ) {
            Alert.alert(
                'Error',
                'Precio, stock y tienda deben ser valores numéricos válidos'
            );
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

            {/* Nombre */}
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => updateField('name', text)}
                placeholder="Ej: Laptop"
            />

            {/* Descripción */}
            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={form.description}
                onChangeText={(text) => updateField('description', text)}
                placeholder="Describe el producto"
                multiline
            />

            {/* Precio */}
            <Text style={styles.label}>Precio</Text>
            <TextInput
                style={styles.input}
                value={form.price}
                keyboardType="numeric"
                placeholder="Ej: 999.99"
                onChangeText={(text) =>
                    // solo números y punto
                    updateField('price', text.replace(/[^0-9.]/g, ''))
                }
            />

            {/* Stock */}
            <Text style={styles.label}>Stock</Text>
            <TextInput
                style={styles.input}
                value={form.stock}
                keyboardType="numeric"
                placeholder="Ej: 20"
                onChangeText={(text) =>
                    // solo dígitos
                    updateField('stock', text.replace(/[^0-9]/g, ''))
                }
            />

            {/* Disponible */}
            <View style={styles.switchRow}>
                <Text style={styles.label}>Disponible</Text>
                <Switch
                    value={form.isAvailable}
                    onValueChange={(value) => updateField('isAvailable', value)}
                />
            </View>

            {/* Store */}
            <Text style={styles.label}>Store</Text>
            {loadingStores ? (
                <ActivityIndicator size="small" />
            ) : (
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.storeId}
                        onValueChange={(value) =>
                            updateField('storeId', String(value))
                        }
                    >
                        <Picker.Item label="-- Select store --" value="" />
                        {stores.map((store) => (
                            <Picker.Item
                                key={store.id}
                                label={store.name}
                                value={String(store.id)}
                            />
                        ))}
                    </Picker>
                </View>
            )}

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
    label: {
        marginTop: 8,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 16,
    },
});
