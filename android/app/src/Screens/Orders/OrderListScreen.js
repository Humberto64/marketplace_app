// android/app/src/Screens/Orders/OrderListScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Button,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import {
    getOrders,
    deleteOrder,
} from '../../api/ordersApi';

const OrderListScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.log('Error cargando orders:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudieron cargar las órdenes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) loadOrders();
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    }, []);

    const goToCreate = () => {
        navigation.navigate('OrderForm');
    };

    const goToEdit = (item) => {
        navigation.navigate('OrderForm', { item });
    };
    const formatDate = (rawDate) => {
        if (!rawDate) return 'N/A';

        const date = new Date(rawDate);
        if (isNaN(date)) return rawDate; // fallback

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day   = String(date.getDate()).padStart(2, '0');
        const year  = date.getFullYear();

        return `${month}/${day}/${year}`;
    };
    const handleDelete = (item) => {
        Alert.alert(
            'Eliminar orden',
            `¿Eliminar la orden #${item.id}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteOrder(item.id);
                            await loadOrders();
                        } catch (err) {
                            console.log('Error al eliminar:', err?.response?.data || err);
                            Alert.alert('Error', 'No se pudo eliminar la orden');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => goToEdit(item)}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.orderId}>Order #{item.id}</Text>
                    <Text style={styles.status}>{item.paymentStatus}</Text>
                    <Text style={styles.line}>
                        Currency: <Text style={styles.bold}>{item.currency}</Text>
                    </Text>
                </View>

                <Text style={styles.line}>
                    Total: <Text style={styles.bold}>{item.subtotal}</Text>
                </Text>
                <Text style={styles.line}>
                    Total Amount: <Text style={styles.bold}>{item.totalAmount}</Text>
                </Text>
                <Text style={styles.line}>
                    Method: <Text style={styles.bold}>{item.payMethod}</Text>
                </Text>
                <Text style={styles.line}>
                    User ID: <Text style={styles.bold}>{item.userId}</Text>
                </Text>
                <Text style={styles.line}>
                    Order Date: <Text style={styles.bold}>{formatDate(item.orderDate)}</Text>
                </Text>
                <View style={styles.rowActions}>
                    <TouchableOpacity
                        style={[styles.btn, styles.btnEdit]}
                        onPress={() => goToEdit(item)}
                    >
                        <Text style={styles.btnText}>EDIT</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.btnDelete]}
                        onPress={() => handleDelete(item)}
                    >
                        <Text style={styles.btnText}>DELETE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Cargando órdenes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Orders</Text>
                <Button color='#1d4ed8' title="Add order" onPress={goToCreate} />
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={
                    orders.length === 0 && { flex: 1, justifyContent: 'center' }
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No hay órdenes registradas.</Text>
                    </View>
                }
            />
        </View>
    );
};

export default OrderListScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    title: { fontSize: 22, fontWeight: 'bold' },

    card: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 12,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    orderId: { fontSize: 16, fontWeight: '600' },
    status: { fontSize: 14, color: '#0284c7', fontWeight: '600' },

    line: { marginTop: 6, fontSize: 14 },
    bold: { fontWeight: 'bold' },

    date: { marginTop: 6, color: '#777', fontSize: 12 },

    rowActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowActions: {
        flexDirection: 'row',
        marginTop: 12,
    },

    btn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginHorizontal: 4,
    },

    btnEdit: {
        backgroundColor: '#1d4ed8',
    },

    btnDelete: {
        backgroundColor: '#dc2626',
    },

    btnText: {
        color: 'white',
        fontWeight: '700',
    },

});
