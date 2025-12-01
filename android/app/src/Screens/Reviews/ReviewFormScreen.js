// android/app/src/Screens/Reviews/ReviewFormScreen.js
import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Alert,
    ScrollView,
    ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createReview, updateReview } from '../../api/reviewsApi';
import { getUsers } from '../../api/usersApi';
import { getProducts } from '../../api/productsApi';
import {ArrowLeft} from "lucide-react-native";

const ReviewFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    // 🔹 Un solo estado para la entidad
    const [form, setForm] = useState({
        rating: item ? String(item.rating) : '',
        comment: item?.comment ?? '',
        productId: item?.productId ? String(item.productId) : '',
        userId: item?.userId ? String(item.userId) : '',
    });

    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit review' : 'Add review',
        });
    }, [navigation, isEdit]);

    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // 🔹 Cargar usuarios y productos para los dropdowns
    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);
                const [usersRes, productsRes] = await Promise.all([
                    getUsers(),
                    getProducts(),
                ]);

                setUsers(usersRes || []);
                setProducts(productsRes || []);

                // Si es creación y no hay selección, elegimos la primera opción
                setForm((prev) => {
                    let next = { ...prev };

                    if (!isEdit) {
                        if (!next.userId && usersRes && usersRes.length > 0) {
                            next.userId = String(usersRes[0].id);
                        }
                        if (!next.productId && productsRes && productsRes.length > 0) {
                            next.productId = String(productsRes[0].id);
                        }
                    }

                    return next;
                });
            } catch (error) {
                console.log('Error cargando opciones de review:', error?.response?.data || error);
                Alert.alert('Error', 'No se pudieron cargar usuarios/productos');
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, [isEdit]);

    const handleSave = async () => {
        if (
            !form.rating.trim() ||
            !form.comment.trim() ||
            !form.userId.trim() ||
            !form.productId.trim()
        ) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        const ratingNumber = parseInt(form.rating, 10);
        const userIdNumber = parseInt(form.userId, 10);
        const productIdNumber = parseInt(form.productId, 10);

        if (
            Number.isNaN(ratingNumber) ||
            ratingNumber < 1 ||
            ratingNumber > 5
        ) {
            Alert.alert('Error', 'El rating debe ser un número entre 1 y 5');
            return;
        }

        if (Number.isNaN(userIdNumber) || Number.isNaN(productIdNumber)) {
            Alert.alert('Error', 'Usuario y producto deben ser válidos');
            return;
        }

        const payload = {
            rating: ratingNumber,
            comment: form.comment.trim(),
            userId: userIdNumber,
            productId: productIdNumber,
        };

        try {
            setLoading(true);

            if (isEdit) {
                await updateReview(item.id, payload);
            } else {
                await createReview(payload);
            }

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
            <View style={styles.topRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {isEdit ? 'Editar review' : 'Crear review'}
                </Text>
            </View>
            {/* Rating */}
            <Text style={styles.label}>Rating (1 a 5)</Text>
            <TextInput
                style={styles.input}
                value={form.rating}
                keyboardType="numeric"
                placeholder="Ej: 5"
                placeholderTextColor="#000000"
                onChangeText={(text) => {
                    // Solo dígitos
                    const onlyDigits = text.replace(/[^0-9]/g, '');
                    if (!onlyDigits) {
                        updateField('rating', '');
                        return;
                    }
                    // Limitamos entre 1 y 5
                    let n = parseInt(onlyDigits, 10);
                    if (Number.isNaN(n)) {
                        updateField('rating', '');
                        return;
                    }
                    if (n < 1) n = 1;
                    if (n > 5) n = 5;
                    updateField('rating', String(n));
                }}
            />

            {/* Comentario */}
            <Text style={styles.label}>Comentario</Text>
            <TextInput
                style={[styles.input, { minHeight: 80 }]}
                value={form.comment}
                onChangeText={(text) => updateField('comment', text)}
                multiline
                placeholder="Tu comentario..."
                placeholderTextColor="#000000"
            />

            {/* Usuario */}
            <Text style={styles.label}>Usuario</Text>
            {loadingOptions ? (
                <ActivityIndicator size="small" />
            ) : (
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.userId}
                        onValueChange={(value) =>
                            updateField('userId', String(value))
                        }
                    >
                        {users.length === 0 && (
                            <Picker.Item label="No hay usuarios" value="" />
                        )}
                        {users.length > 0 && (
                            <Picker.Item label="-- Select User --" value="" />
                        )}
                        {users.map((u) => (
                            <Picker.Item
                                key={u.id}
                                label={`${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email}
                                value={String(u.id)}
                            />
                        ))}
                    </Picker>
                </View>
            )}

            {/* Producto */}
            <Text style={styles.label}>Producto</Text>
            {loadingOptions ? (
                <ActivityIndicator size="small" />
            ) : (
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.productId}
                        onValueChange={(value) =>
                            updateField('productId', String(value))
                        }
                    >
                        {products.length === 0 && (
                            <Picker.Item label="No hay productos" value="" />
                        )}
                        {products.length > 0 && (
                            <Picker.Item label="-- Select Product --" value="" />
                        )}
                        {products.map((p) => (
                            <Picker.Item
                                key={p.id}
                                label={p.name}
                                value={String(p.id)}
                            />
                        ))}
                    </Picker>
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    color='#1d4ed8'
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
    label: {
        marginTop: 8,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: 'white',  // fondo fijo
        color: 'black',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: 'white',  // fondo fijo
        color: 'black',
    },
});
