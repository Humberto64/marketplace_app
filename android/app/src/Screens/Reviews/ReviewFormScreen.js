// android/app/src/Screens/Reviews/ReviewFormScreen.js
import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import {
    createReview,
    updateReview,
} from '../../api/reviewsApi';

const ReviewFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    const [rating, setRating] = useState(item ? String(item.rating) : '');
    const [comment, setComment] = useState(item ? item.comment : '');
    const [productId, setProductId] = useState(item ? String(item.productId) : '');
    const [userId, setUserId] = useState(item ? String(item.userId) : '');

    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit review' : 'Add review',
        });
    }, [navigation, isEdit]);

    const handleSave = async () => {
        if (!rating || !comment || !productId || !userId) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        const payload = {
            rating: parseInt(rating, 10),
            comment,
            productId: parseInt(productId, 10),
            userId: parseInt(userId, 10),
        };

        if (
            payload.rating < 1 ||
            payload.rating > 5 ||
            Number.isNaN(payload.rating)
        ) {
            Alert.alert('Error', 'Rating debe ser entre 1 y 5');
            return;
        }

        if (Number.isNaN(payload.productId) || Number.isNaN(payload.userId)) {
            Alert.alert('Error', 'Valores numéricos inválidos');
            return;
        }

        try {
            setLoading(true);

            if (isEdit) await updateReview(item.id, payload);
            else await createReview(payload);

            setLoading(false);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            console.log('Error guardando review:', error?.response?.data || error);
            Alert.alert('Error', 'No se pudo guardar la review');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {isEdit ? 'Editar review' : 'Crear review'}
            </Text>

            <Text style={styles.label}>Rating (1 a 5)</Text>
            <TextInput
                style={styles.input}
                value={rating}
                onChangeText={setRating}
                keyboardType="numeric"
                placeholder="Ej: 5"
            />

            <Text style={styles.label}>Comentario</Text>
            <TextInput
                style={[styles.input, { minHeight: 80 }]}
                value={comment}
                onChangeText={setComment}
                multiline
                placeholder="Tu comentario..."
            />

            <Text style={styles.label}>Product ID</Text>
            <TextInput
                style={styles.input}
                value={productId}
                onChangeText={setProductId}
                keyboardType="numeric"
                placeholder="ID del producto"
            />

            <Text style={styles.label}>User ID</Text>
            <TextInput
                style={styles.input}
                value={userId}
                onChangeText={setUserId}
                keyboardType="numeric"
                placeholder="ID del usuario"
            />

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    title={isEdit ? 'Guardar cambios' : 'Crear review'}
                    onPress={handleSave}
                />
            )}
        </ScrollView>
    );
};

export default ReviewFormScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },

    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },

    label: { marginTop: 8, marginBottom: 4 },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
});
