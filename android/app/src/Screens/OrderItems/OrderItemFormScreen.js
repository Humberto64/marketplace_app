// android/app/src/Screens/OrderItems/OrderItemFormScreen.js
import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import {
    createOrderItem,
    updateOrderItem,
} from '../../api/orderItemsApi';

const OrderItemFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    const [quantity, setQuantity] = useState(
        item ? String(item.quantity) : ''
    );
    const [price, setPrice] = useState(item ? String(item.price) : '');
    const [subtotal, setSubtotal] = useState(
        item ? String(item.subtotal) : ''
    );
    const [orderId, setOrderId] = useState(
        item ? String(item.orderId) : ''
    );
    const [productId, setProductId] = useState(
        item ? String(item.productId) : ''
    );

    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit order item' : 'Add order item',
        });
    }, [navigation, isEdit]);

    const handleSave = async () => {
        if (!quantity || !price || !subtotal || !orderId || !productId) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        const payload = {
            quantity: parseInt(quantity, 10),
            price: parseFloat(price),
            subtotal: parseFloat(subtotal),
            orderId: parseInt(orderId, 10),
            productId: parseInt(productId, 10),
            // productName no es obligatorio en el request, lo rellena el backend
        };

        if (
            Number.isNaN(payload.quantity) ||
            Number.isNaN(payload.price) ||
            Number.isNaN(payload.subtotal) ||
            Number.isNaN(payload.orderId) ||
            Number.isNaN(payload.productId)
        ) {
            Alert.alert('Error', 'Revisa que todos los campos numéricos sean válidos');
            return;
        }

        try {
            setLoading(true);

            if (isEdit) {
                await updateOrderItem(item.id, payload);
            } else {
                await createOrderItem(payload);
            }

            setLoading(false);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            console.log('Error guardando orderItem:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudo guardar el item');
        }
    };

    const fillSubtotalFromQtyPrice = () => {
        const q = parseFloat(quantity);
        const p = parseFloat(price);
        if (Number.isNaN(q) || Number.isNaN(p)) {
            Alert.alert('Error', 'Cantidad y precio deben ser numéricos');
            return;
        }
        setSubtotal(String(q * p));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {isEdit ? 'Editar item de orden' : 'Crear item de orden'}
            </Text>

            <Text style={styles.label}>Quantity</Text>
            <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="Ej: 2"
            />

            <Text style={styles.label}>Price</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="Ej: 10.5"
            />

            <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.label}>Subtotal</Text>
                    <TextInput
                        style={styles.input}
                        value={subtotal}
                        onChangeText={setSubtotal}
                        keyboardType="numeric"
                        placeholder="Ej: 21.0"
                    />
                </View>
                <View style={{ justifyContent: 'flex-end' }}>
                    <Button title="Qty×Price" onPress={fillSubtotalFromQtyPrice} />
                </View>
            </View>

            <Text style={styles.label}>Order ID</Text>
            <TextInput
                style={styles.input}
                value={orderId}
                onChangeText={setOrderId}
                keyboardType="numeric"
                placeholder="ID de la orden"
            />

            <Text style={styles.label}>Product ID</Text>
            <TextInput
                style={styles.input}
                value={productId}
                onChangeText={setProductId}
                keyboardType="numeric"
                placeholder="ID del producto"
            />

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    title={isEdit ? 'Guardar cambios' : 'Crear item'}
                    onPress={handleSave}
                />
            )}
        </ScrollView>
    );
};

export default OrderItemFormScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
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
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 8,
    },
});
