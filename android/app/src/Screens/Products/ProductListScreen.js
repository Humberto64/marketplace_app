// android/app/src/Screens/Products/ProductListScreen.js
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
    getProducts,
    deleteProduct,
} from '../../api/productsApi';

const ProductListScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.log('Error cargando productos:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) loadProducts();
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadProducts();
        setRefreshing(false);
    }, []);

    const goToCreate = () => navigation.navigate('ProductForm');
    const goToEdit = (item) => navigation.navigate('ProductForm', { item });
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
            'Eliminar producto',
            `¿Eliminar "${item.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProduct(item.id);
                            await loadProducts();
                        } catch (err) {
                            console.log('Error al eliminar:', err?.response?.data || err);
                            Alert.alert('Error', 'No se pudo eliminar el producto');
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
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.line,styles.bold}>
                        Store: <Text style={styles.storeName}>{item.storeName}</Text>
                    </Text>
                    <Text style={styles.line}>
                        Available:{" "}
                        <Text style={[styles.bold, { color: item.isAvailable ? "#16a34a" : "#dc2626" }]}>
                            {item.isAvailable ? "Yes" : "No"}
                        </Text>
                    </Text>
                </View>
                <Text style={styles.line}>
                    Description: <Text style={styles.bold}>{item.description}</Text>
                </Text>
                <Text style={styles.line}>
                    Precio: <Text style={styles.bold}>{item.price}</Text>
                </Text>

                <Text style={styles.line}>
                    Stock: <Text style={styles.bold}>{item.stock}</Text>
                </Text>
                <Text style={styles.line}>
                    Created at: <Text style={styles.bold}>{formatDate(item.publishedDate)}</Text>
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
                <Text>Cargando productos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Products</Text>
                <Button color='#1d4ed8' title="Add product" onPress={goToCreate} />
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={
                    products.length === 0 && { flex: 1, justifyContent: 'center' }
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No hay productos registrados.</Text>
                    </View>
                }
            />
        </View>
    );
};

export default ProductListScreen;

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

    productName: { fontSize: 16, fontWeight: '600' },
    storeName: { fontSize: 12, color: '#0284c7', fontWeight: '600' },

    line: { marginTop: 6, fontSize: 14 },
    bold: { fontWeight: 'bold' },

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
});
