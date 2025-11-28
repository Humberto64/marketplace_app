// android/app/src/Screens/Users/UserListScreen.js
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
    getUsers,
    deleteUser,
} from '../../api/usersApi';

const UserListScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.log('Error cargando users:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) loadUsers();
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadUsers();
        setRefreshing(false);
    }, []);

    const goToCreate = () => navigation.navigate('UserForm');
    const goToEdit = (item) => navigation.navigate('UserForm', { item });

    const handleDelete = (item) => {
        Alert.alert(
            'Eliminar usuario',
            `¿Eliminar usuario "${item.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteUser(item.id);
                            await loadUsers();
                        } catch (err) {
                            console.log('Error al eliminar:', err?.response?.data || err);
                            Alert.alert('Error', 'No se pudo eliminar el usuario');
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
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                </View>

                <Text style={styles.line}>
                    Teléfono: <Text style={styles.bold}>{item.phone || 'N/A'}</Text>
                </Text>

                <Text style={styles.date}>
                    Creado el: {new Date(item.createdAt).toLocaleString()}
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
                <Text>Cargando usuarios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Users</Text>
                <Button title="Add user" onPress={goToCreate} />
            </View>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={
                    users.length === 0 && { flex: 1, justifyContent: 'center' }
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No hay usuarios registrados.</Text>
                    </View>
                }
            />
        </View>
    );
};

export default UserListScreen;

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

    name: { fontSize: 16, fontWeight: '600' },
    email: { fontSize: 12, color: '#0284c7', fontWeight: '600' },

    line: {
        marginTop: 6,
        fontSize: 14,
    },

    bold: { fontWeight: 'bold' },

    date: {
        marginTop: 6,
        fontSize: 12,
        color: '#777',
    },

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
