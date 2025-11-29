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
    TouchableOpacity,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { createOrderItem, updateOrderItem } from '../../api/orderItemsApi';
import { getProducts } from '../../api/productsApi';
import { getOrders } from '../../api/ordersApi';

const OrderItemFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    // 🔹 ÚNICO ESTADO DEL FORMULARIO
    const [form, setForm] = useState({
        quantity: item ? String(item.quantity) : "",
        price: item ? String(item.price) : "",
        subtotal: item ? String(item.subtotal) : "",
        orderId: item?.orderId ? String(item.orderId) : "",
        productId: item?.productId ? String(item.productId) : "",
    });

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? "Edit order item" : "Add order item",
        });
    }, [navigation, isEdit]);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // 🔹 Cargar productos y órdenes
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                const [prodRes, orderRes] = await Promise.all([
                    getProducts(),
                    getOrders(),
                ]);

                setProducts(prodRes || []);
                setOrders(orderRes || []);

                // Autoseleccionar valores si se está creando
                setForm((prev) => {
                    const next = { ...prev };

                    if (!isEdit) {
                        if (!next.productId && prodRes.length > 0)
                            next.productId = String(prodRes[0].id);
                        if (!next.orderId && orderRes.length > 0)
                            next.orderId = String(orderRes[0].id);
                    }

                    return next;
                });
            } catch (error) {
                console.log("Error cargando datos:", error);
                Alert.alert("Error", "No se pudieron cargar productos u órdenes");
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [isEdit]);

    // 🔹 Recalcular subtotal cuando quantity o price cambian
    useEffect(() => {
        const qty = parseFloat(form.quantity);
        const pr = parseFloat(form.price);

        if (!isNaN(qty) && !isNaN(pr)) {
            updateField("subtotal", String(qty * pr));
        }
    }, [form.quantity, form.price]);

    // 🔹 Actualizar precio cuando se cambia el producto
    const handleProductSelect = (productId) => {
        updateField("productId", String(productId));
        const product = products.find((p) => p.id == productId);

        if (product) {
            updateField("price", String(product.price ?? 0));
        }
    };

    const handleSave = async () => {
        if (
            !form.quantity.trim() ||
            !form.price.trim() ||
            !form.subtotal.trim() ||
            !form.orderId.trim() ||
            !form.productId.trim()
        ) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const payload = {
            quantity: parseInt(form.quantity, 10),
            price: parseFloat(form.price),
            subtotal: parseFloat(form.subtotal),
            orderId: parseInt(form.orderId, 10),
            productId: parseInt(form.productId, 10),
        };

        if (
            Number.isNaN(payload.quantity) ||
            Number.isNaN(payload.price) ||
            Number.isNaN(payload.subtotal)
        ) {
            Alert.alert("Error", "Valores numéricos inválidos");
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
            console.log("Error guardando item:", error?.response?.data || error);
            Alert.alert("Error", "No se pudo guardar el item");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {isEdit ? "Editar item de orden" : "Crear item de orden"}
                </Text>
            </View>
            {/* PRODUCT */}
            <Text style={styles.label}>Producto</Text>
            {loadingData ? (
                <ActivityIndicator size="small" />
            ) : (
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.productId}
                        onValueChange={handleProductSelect}
                    >
                        <Picker.Item label="-- Select Product --" value="" />
                        {products.map((p) => (
                            <Picker.Item
                                key={p.id}
                                label={p.name}
                                value={String(p.id)}
                            />
                        ))}
                    </Picker>
                </View>
            )}

            {/* PRICE */}
            <Text style={styles.label}>Price</Text>
            <TextInput
                style={styles.input}
                value={form.price}
                keyboardType="numeric"
                onChangeText={(text) =>
                    updateField("price", text.replace(/[^0-9.]/g, ""))
                }
            />

            {/* QUANTITY */}
            <Text style={styles.label}>Quantity</Text>
            <TextInput
                style={styles.input}
                value={form.quantity}
                keyboardType="numeric"
                onChangeText={(text) =>
                    updateField("quantity", text.replace(/[^0-9]/g, ""))
                }
            />

            {/* SUBTOTAL */}
            <Text style={styles.label}>Subtotal</Text>
            <TextInput
                style={styles.input}
                value={form.subtotal}
                editable={false}
            />

            {/* ORDER */}
            <Text style={styles.label}>Order</Text>
            {loadingData ? (
                <ActivityIndicator size="small" />
            ) : (
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.orderId}
                        onValueChange={(value) =>
                            updateField("orderId", String(value))
                        }
                    >
                        <Picker.Item label="-- Select Order --" value="" />
                        {orders.map((o) => (
                            <Picker.Item
                                key={o.id}
                                label={`Order #${o.id}`}
                                value={String(o.id)}
                            />
                        ))}
                    </Picker>
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    color='#1d4ed8'
                    title={isEdit ? "Guardar cambios" : "Crear item"}
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
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
    },
    label: {
        marginTop: 8,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 8,
    },
});
