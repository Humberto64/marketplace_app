// android/app/src/Screens/Stores/StoreListScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Button,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { getStores, deleteStore } from '../../api/storesApi';

const StoreListScreen = ({ navigation }) => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const loadStores = async () => {
        try {
            setLoading(true);
            const data = await getStores();
            setStores(data);
        } catch (error) {
            console.log('Error cargando stores:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudieron cargar las tiendas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) loadStores();
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadStores();
        setRefreshing(false);
    }, []);

    const goToCreate = () => navigation.navigate('StoreForm');
    const goToEdit = (item) => navigation.navigate('StoreForm', { item });
    const formatDate = (rawDate) => {
        if (!rawDate) return '';

        const date = new Date(rawDate);
        if (isNaN(date)) return rawDate; // fallback

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day   = String(date.getDate()).padStart(2, '0');
        const year  = date.getFullYear();

        return `${month}/${day}/${year}`;
    };

    const handleDelete = (item) => {
        Alert.alert(
            'Eliminar tienda',
            `¿Eliminar la tienda "${item.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteStore(item.id);
                            await loadStores();
                        } catch (err) {
                            console.log('Error al eliminar:', err?.response?.data || err);
                            Alert.alert('Error', 'No se pudo eliminar la tienda');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => {
        const createdAt = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "—";

        return (
            <TouchableOpacity onPress={() => goToEdit(item)}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.storeName}>{item.name}</Text>
                        <Text style={styles.line}>
                            Active:{" "}
                            <Text style={[styles.bold, { color: item.isActive ? "#16a34a" : "#dc2626" }]}>
                                {item.isActive ? "Yes" : "No"}
                            </Text>
                        </Text>
                    </View>
                    {/* Nombre */}


                    {/* Descripción */}
                    <Text style={styles.description}>
                        {item.description || "No description"}
                    </Text>

                    {/* Categoría */}
                    <Text style={styles.line}>
                        Category: <Text style={styles.bold}>{item.category}</Text>
                    </Text>

                    {/* Fecha */}
                    <Text style={styles.line}>
                        Created at: <Text style={styles.bold}>{formatDate(item.createdDate)}</Text>
                    </Text>

                    {/* User ID */}
                    <Text style={styles.line}>
                        User ID: <Text style={styles.bold}>{item.userId}</Text>
                    </Text>

                    {/* Botones */}
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
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Cargando tiendas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Stores</Text>
                <Button  color='#1d4ed8' title="Add store" onPress={goToCreate} />
            </View>

            <FlatList
                data={stores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={
                    stores.length === 0 && { flex: 1, justifyContent: 'center' }
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No hay tiendas registradas.</Text>
                    </View>
                }
            />
        </View>
    );
};

export default StoreListScreen;

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

    storeName: { fontSize: 16, fontWeight: '600' },
    description: { marginTop: 6, color: '#444', fontSize: 14 },

    line: { marginTop: 6, fontSize: 14 },
    bold: { fontWeight: 'bold' },

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

    btnEdit: { backgroundColor: '#1d4ed8' },
    btnDelete: { backgroundColor: '#dc2626' },

    btnText: {
        color: 'white',
        fontWeight: '700',
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
