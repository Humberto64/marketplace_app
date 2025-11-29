import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Button,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { getUsers, deleteUser } from '../../api/usersApi';

const UserListScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            const data = response.data?.data ?? response.data ?? response;
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log('Error cargando usuarios:', error);
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
    const goToEdit = (user) => navigation.navigate('UserForm', { userId: user.id });

    const handleDelete = (user) => {
        Alert.alert(
            'Eliminar Usuario',
            `¿Eliminar a "${user.firstName} ${user.lastName}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteUser(user.id);
                            await loadUsers();
                        } catch (err) {
                            console.log('Error al eliminar:', err);
                            Alert.alert('Error', 'No se pudo eliminar el usuario');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => {
        const fullName =
            `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || 'Sin nombre';

        return (
            <TouchableOpacity onPress={() => goToEdit(item)}>
                <View style={styles.card}>
                    {/* HEADER DE LA CARD */}
                    <View style={styles.cardHeader}>
                        <Text style={styles.userName}>{fullName}</Text>
                        <Text style={styles.email}>{item.email}</Text>
                    </View>

                    <Text style={styles.line}>
                        Teléfono:{' '}
                        <Text style={styles.bold}>{item.phone ?? 'N/A'}</Text>
                    </Text>

                    <Text style={styles.line}>
                        Rol:{' '}
                        <Text style={styles.bold}>{item.role ?? 'N/A'}</Text>
                    </Text>

                    {/* BOTONES */}
                    <View style={styles.rowActions}>
                        <TouchableOpacity style={[styles.btn, styles.btnEdit]}>
                            <Text style={styles.btnText}>EDIT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.btn, styles.btnDelete]}>
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
                <Text>Cargando usuarios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* 🔥 HEADER AL ESTILO REVIEWS */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Users</Text>
                <Button color='#1d4ed8' title="Add User" onPress={goToCreate} />
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

    /* CARD */
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

    userName: { fontSize: 16, fontWeight: '600' },
    email: { fontSize: 13, color: '#2563eb' },

    line: { marginTop: 6, fontSize: 13 },
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
