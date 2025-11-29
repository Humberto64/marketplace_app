// android/app/src/Screens/OrderItems/OrderItemListScreen.js
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
    getOrderItems,
    deleteOrderItem,
} from '../../api/orderItemsApi';

const OrderItemListScreen = ({ navigation }) => {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const loadOrderItems = async () => {
        try {
            setLoading(true);
            const data = await getOrderItems();
            setOrderItems(data);
        } catch (error) {
            console.log('Error cargando orderItems:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudieron cargar los items de la orden');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            loadOrderItems();
        }
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadOrderItems();
        setRefreshing(false);
    }, []);

    const goToCreate = () => {
        navigation.navigate('OrderItemForm');
    };

    const goToEdit = (item) => {
        navigation.navigate('OrderItemForm', { item });
    };

    const handleDelete = (item) => {
        Alert.alert(
            'Eliminar item',
            `¿Eliminar "${item.productName}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteOrderItem(item.id);
                            await loadOrderItems();
                        } catch (err) {
                            console.log('Error al eliminar:', err?.response?.data || err);
                            Alert.alert('Error', 'No se pudo eliminar el item');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => goToEdit(item)}>
            <View style={styles.card}>
                {/* Primera fila: nombre + orderId */}
                <View style={styles.cardHeader}>
                    <Text style={styles.productName}>
                       Product: {item.productName || `Producto #${item.productId}`}
                    </Text>
                    <Text style={styles.bold}>
                        <Text style={styles.orderId}>Order #{item.orderId}</Text>
                    </Text>

                </View>

                {/* Datos principales */}
                <Text style={styles.line}>Quantity: <Text style={styles.bold}>{item.quantity}</Text></Text>
                <Text style={styles.line}>Price: <Text style={styles.bold}>{item.price}</Text></Text>
                <Text style={styles.line}>Subtotal: <Text style={styles.bold}>{item.subtotal}</Text></Text>

                {/* Botones de acción */}
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
                <Text>Cargando items de orden...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Título + Add */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Order items</Text>
                <Button title="Add item" onPress={goToCreate} />
            </View>

            <FlatList
                data={orderItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={
                    orderItems.length === 0 && { flex: 1, justifyContent: 'center' }
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No hay items registrados.</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

export default OrderItemListScreen;

// ===== STYLES ===== //

const styles = StyleSheet.create({
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

    container: {
        flex: 1,
        padding: 16,
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    card: {
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 12,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    productName: {
        fontSize: 16,
        fontWeight: '600',
    },

    orderId: {
        fontSize: 12,
        color: '#777',
    },

    line: {
        marginTop: 4,
        fontSize: 14,
    },

    bold: {
        fontWeight: 'bold',
    },

    rowActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});
