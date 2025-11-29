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
            'Eliminar Review',
            `¿Eliminar review Review#${item.id}?`,
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

    const renderItem = ({ item }) => {
        const numericRating = Number(item.rating);
        const safeRating = Number.isNaN(numericRating) ? 0 : numericRating;

        return (
            <TouchableOpacity onPress={() => goToEdit(item)}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.line,styles.bold}>
                         <Text style={styles.reviewId}>Review #{item.id}</Text>
                        </Text>
                        <Text style={styles.rating}>⭐ {safeRating}/5</Text>
                    </View>

                    <Text style={styles.line,styles.bold}>
                        Comment: <Text style={styles.comment}>{item.comment}</Text>
                    </Text>

                    <Text style={styles.productName}>
                        ProductID: <Text style={styles.bold}>{item.productId}</Text>
                    </Text>
                    <Text style={styles.productName}>
                        UserID: <Text style={styles.bold}>{item.userId}</Text>
                    </Text>
                    <Text style={styles.line}>
                        Created at: <Text style={styles.bold}>{formatDate(item.createdDate)}</Text>
                    </Text>
                    <Text style={styles.line}>
                        Updated at: <Text style={styles.bold}>{formatDate(item.updatedDate)}</Text>
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
    };


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
                <Button color='#1d4ed8' title="Add review" onPress={goToCreate} />
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
