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
                    <Text style={styles.storeName}>{item.storeName}</Text>
                </View>

                <Text style={styles.line}>
                    Precio: <Text style={styles.bold}>{item.price}</Text>
                </Text>

                <Text style={styles.line}>
                    Stock: <Text style={styles.bold}>{item.stock}</Text>
                </Text>

                <View style={styles.rowActions}>
                    <Button title="Edit" onPress={() => goToEdit(item)} />
                    <Button title="Delete" color="red" onPress={() => handleDelete(item)} />
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
                <Button title="Add product" onPress={goToCreate} />
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
