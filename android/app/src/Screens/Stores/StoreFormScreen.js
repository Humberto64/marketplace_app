// android/app/src/Screens/Stores/StoreFormScreen.js
import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Alert,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { createStore, updateStore } from '../../api/storesApi';
import { getUsers } from '../../api/usersApi';

const StoreFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    // 🔹 Estado único basado en ProductFormScreen
    const [form, setForm] = useState({
        name: item?.name ?? '',
        description: item?.description ?? '',
        category: item?.category ?? '',
        userId: item?.userId ? String(item.userId) : '',
    });

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loading, setLoading] = useState(false);

    // Configurar título del header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit store' : 'Add store',
        });
    }, [navigation, isEdit]);

    // Función para actualizar un campo
    const updateField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Cargar lista de usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const res = await getUsers();
                const data = res.data?.data ?? res.data ?? res;

                setUsers(Array.isArray(data) ? data : []);

                // Asignar primer usuario si estamos creando
                if (!isEdit && data && data.length > 0 && !form.userId) {
                    setForm((prev) => ({
                        ...prev,
                        userId: String(data[0].id),
                    }));
                }
            } catch (error) {
                console.log('Error cargando usuarios:', error);
                Alert.alert('Error', 'No se pudieron cargar los usuarios.');
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [isEdit]);

    // Guardar tienda
    const handleSave = async () => {
        if (
            !form.name.trim() || !form.description.trim() || !form.category.trim() || !form.userId.trim()
        ) {
            Alert.alert('Error', 'Todos los campos son obligatorios.');
            return;
        }

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category.trim(),
            userId: parseInt(form.userId, 10),
        };

        try {
            setLoading(true);

            if (isEdit) {
                await updateStore(item.id, payload);
            } else {
                await createStore(payload);
            }

            setLoading(false);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            console.log('Error guardando tienda:', error);
            Alert.alert('Error', 'No se pudo guardar la tienda');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {isEdit ? 'Editar tienda' : 'Crear tienda'}
                </Text>
            </View>
            {/* Nombre */}
            <Text style={styles.label}>Store Name</Text>
            <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => updateField('name', text)}
                placeholder="Ej: Mi tienda"
                placeholderTextColor="#000000"
            />

            {/* Descripción */}
            <Text style={styles.label}>Store Description</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={form.description}
                onChangeText={(text) => updateField('description', text)}
                placeholder="Describe la tienda..."
                placeholderTextColor="#000000"
                multiline
            />

            {/* Categoría */}
            <Text style={styles.label}>Category</Text>
            <TextInput
                style={styles.input}
                value={form.category}
                onChangeText={(text) => updateField('category', text)}
                placeholder="Ej: Alimentos, Tecnología..."
                placeholderTextColor="#000000"
            />

            {/* Usuario */}
            <Text style={styles.label}>User</Text>

            {loadingUsers ? (
                <ActivityIndicator size="small" />
            ) : (
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.userId}
                        onValueChange={(value) => updateField('userId', String(value))}
                    >
                        <Picker.Item label="-- Select user --" value="" />

                        {users.map((u) => (
                            <Picker.Item
                                key={u.id}
                                label={`${u.firstName} ${u.lastName}`}
                                value={String(u.id)}
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
                    title={isEdit ? 'Guardar cambios' : 'Crear tienda'}
                    onPress={handleSave}
                />
            )}
        </ScrollView>
    );
};

export default StoreFormScreen;

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
        marginBottom: 16,
        backgroundColor: 'white',  // fondo fijo
        color: 'black',
    },
});
