// android/app/src/Screens/Reviews/ReviewListScreen.js
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
    getReviews,
    deleteReview,
} from '../../api/reviewsApi';

const ReviewListScreen = ({ navigation }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await getReviews();
            setReviews(data);
        } catch (error) {
            console.log('Error cargando reviews:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudieron cargar las reviews.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) loadReviews();
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadReviews();
        setRefreshing(false);
    }, []);

    const goToCreate = () => navigation.navigate('ReviewForm');
    const goToEdit = (item) => navigation.navigate('ReviewForm', { item });

    const handleDelete = (item) => {
        Alert.alert(
            'Eliminar Review',
            `¿Eliminar review de "${item.userName}" para "${item.productName}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteReview(item.id);
                            await loadReviews();
                        } catch (err) {
                            console.log('Error al eliminar:', err?.response?.data || err);
                            Alert.alert('Error', 'No se pudo eliminar la review');
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
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.rating}>⭐ {item.rating}/5</Text>
                </View>

                <Text style={styles.comment} numberOfLines={2}>
                    {item.comment}
                </Text>

                <Text style={styles.productName}>
                    Producto: <Text style={styles.bold}>{item.productName}</Text>
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
                <Text>Cargando reviews...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>Reviews</Text>
                <Button title="Add review" onPress={goToCreate} />
            </View>

            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={
                    reviews.length === 0 && { flex: 1, justifyContent: 'center' }
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No hay reviews registradas.</Text>
                    </View>
                }
            />
        </View>
    );
};

export default ReviewListScreen;

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

    userName: { fontSize: 16, fontWeight: '600' },
    rating: { fontSize: 14, color: '#eab308', fontWeight: '600' },

    comment: {
        marginTop: 6,
        fontSize: 14,
        color: '#555',
    },

    productName: {
        marginTop: 6,
        fontSize: 13,
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
