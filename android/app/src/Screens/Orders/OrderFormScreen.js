// android/app/src/Screens/Orders/OrderFormScreen.js
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
import { createOrder, updateOrder } from '../../api/ordersApi';
import { getUsers } from '../../api/usersApi';
const currencyOptions = [
    { label: "Bolivianos", value: "Bs" },
    { label: "Dólares Estadounidenses", value: "USD" },
    { label: "Euros", value: "Eur" },
];
const paymentMethodOptions = [
    { label: "Visa", value: "Visa" },
    { label: "Mastercard", value: "Mastercard" },
    { label: "Paypal", value: "Paypal" },
];
const paymentStatusOptions = [
    { label: "Completed", value: "Complete" },
    { label: "Pending", value: "Pending" },
];
const OrderFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    // 🔹 ÚNICO ESTADO DEL FORMULARIO
    const [form, setForm] = useState({
        subtotal: 0,
        totalAmount: 0,
        tax: 0,
        currency: item?.currency ?? "",
        payMethod: item?.payMethod ?? "",
        paymentStatus: item?.paymentStatus ?? "",
        orderDate: item?.orderDate ?? "",
        userId: item?.userId ? String(item.userId) : "",
    });

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit order' : 'Add order',
        });
    }, [navigation, isEdit]);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // 🔹 Cargar usuarios para el dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const data = await getUsers(); // devuelve [{id, firstname, lastname, email}]
                setUsers(data || []);

                if (!isEdit && data.length > 0 && !form.userId) {
                    updateField("userId", String(data[0].id));
                }
            } catch (error) {
                console.log("Error cargando usuarios:", error);
                Alert.alert("Error", "No se pudieron cargar los usuarios");
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [isEdit]);

    const handleSave = async () => {
        if (
            !form.currency.trim() ||
            !form.payMethod.trim() ||
            !form.paymentStatus.trim() ||
            !form.userId.trim()
        ) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const payload = {
            subtotal: form.subtotal?? 0,
            totalAmount: form.totalAmount?? 0,
            tax: form.tax?? 0,
            currency: form.currency,
            payMethod: form.payMethod ||"",
            paymentStatus: form.paymentStatus || "",
            userId: parseInt(form.userId, 10),
        };
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
            console.log("Error guardando orden:", error?.response?.data || error);
            Alert.alert("Error", "No se pudo guardar la orden");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>{isEdit ? "Editar orden" : "Crear orden"}</Text>
            </View>

            {/* 🔹 Currency */}
            <Text style={styles.label}>Currency</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={form.currency}
                    onValueChange={(value) => updateField("currency", value)}
                >
                    <Picker.Item label="--Select Currency--" value="" />
                    {currencyOptions.map((c) => (
                        <Picker.Item key={c.value} label={c.label} value={c.value} />
                    ))}
                </Picker>
            </View>

            {/* 🔹 Payment Method */}
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={form.payMethod}
                    onValueChange={(value) => updateField("payMethod", value)}
                >
                    <Picker.Item label="--Payment Method--" value="" />
                    {paymentMethodOptions.map((c) => (
                        <Picker.Item key={c.value} label={c.label} value={c.value} />
                    ))}
                </Picker>
            </View>

            {/* 🔹 Payment Status */}
            <Text style={styles.label}>Payment Status</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={form.paymentStatus}
                    onValueChange={(value) => updateField("paymentStatus", value)}
                >
                    <Picker.Item label="--Payment Status--" value="" />
                    {paymentStatusOptions.map((c) => (
                        <Picker.Item key={c.value} label={c.label} value={c.value} />
                    ))}
                </Picker>
            </View>
            {/* 🔹 User */}
            <Text style={styles.label}>Usuario</Text>
            {loadingUsers ? (
                <ActivityIndicator size="small" />
            ) : (
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.userId}
                        onValueChange={(value) =>
                            updateField("userId", String(value))
                        }
                    >
                        <Picker.Item label="--Select User--" value="" />
                        {users.map((u) => (
                            <Picker.Item
                                key={u.id}
                                label={`${u.firstName} ${u.lastName}`.trim()}
                                value={String(u.id)}
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
                    title={isEdit ? "Guardar cambios" : "Crear orden"}
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
        backgroundColor: 'white',  // fondo fijo
        color: 'black',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 8,
        backgroundColor: 'white',  // fondo fijo
        color: 'black',
    },
});
