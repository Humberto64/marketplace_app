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

import {
    getStores,
    deleteStore,
} from '../../api/storesApi';

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

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => goToEdit(item)}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.storeName}>{item.name}</Text>
                    <Text style={styles.location}>{item.location}</Text>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>

                <Text style={styles.date}>
                    Creada el: {new Date(item.createdAt).toLocaleString()}
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
                <Text>Cargando tiendas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Stores</Text>
                <Button title="Add store" onPress={goToCreate} />
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
    location: { fontSize: 12, color: '#0284c7', fontWeight: '600' },

    description: {
        marginTop: 6,
        color: '#444',
        fontSize: 14,
    },

    date: {
        marginTop: 6,
        fontSize: 12,
        color: '#777',
    },

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
