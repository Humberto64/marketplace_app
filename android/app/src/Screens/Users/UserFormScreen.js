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
    TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ArrowLeft } from 'lucide-react-native';
import {
    createUser,
    updateUser,
} from '../../api/usersApi';

const UserFormScreen = ({ navigation, route }) => {
    const item = route?.params?.item;
    const isEdit = !!item;

    const [user, setUser] = useState({
        firstName: item?.firstName ?? '',
        lastName: item?.lastName ?? '',
        email: item?.email ?? '',
        phone: item?.phone ? String(item.phone) : '',
        address: item?.address ?? '',
        role: item?.role ?? '',
    });

    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Edit user' : 'Add user',
        });
    }, [navigation, isEdit]);

    // Versión mobile del handleChange (no hay e.target.name)
    const handleChange = (field, value) => {
        setUser(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        // Validaciones básicas
        if (!user.firstName || !user.lastName || !user.email || !user.role) {
            Alert.alert('Error', 'Nombre, apellido, email y rol son obligatorios');
            return;
        }

        const rawPhone = user.phone ? user.phone.trim() : '';

        // 👇 Validación de teléfono: obligatorio, 8 dígitos numéricos
        if (!rawPhone) {
            Alert.alert('Error', 'El teléfono es obligatorio');
            return;
        }

        if (!/^\d{8}$/.test(rawPhone)) {
            Alert.alert('Error', 'El teléfono debe tener exactamente 8 dígitos numéricos');
            return;
        }

        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address: user.address,
            phone: rawPhone, // 👈 ahora como STRING, no Number
            role: user.role,
        };

        try {
            setLoading(true);

            if (isEdit) {
                await updateUser(item.id, payload);
            } else {
                await createUser(payload);
            }

            setLoading(false);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            console.log('Error guardando usuario:', error?.response?.data || error);

            // Si quieres mostrar el mensaje exacto del backend:
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'No se pudo guardar el usuario';

            Alert.alert('Error', msg);
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={22} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {isEdit ? 'Editar usuario' : 'Crear usuario'}
                </Text>
            </View>
            <View style={styles.row}>
                <View style={styles.half}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        style={styles.input}
                        value={user.firstName}
                        onChangeText={(value) => handleChange('firstName', value)}
                        placeholder="First Name"
                        placeholderTextColor="#000000"
                    />
                </View>

                <View style={styles.half}>
                    <Text style={styles.label}>Apellido</Text>
                    <TextInput
                        style={styles.input}
                        value={user.lastName}
                        onChangeText={(value) => handleChange('lastName', value)}
                        placeholder="Last Name"
                        placeholderTextColor="#000000"
                    />
                </View>
            </View>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="Email Address"
                placeholderTextColor="#000000"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <View style={styles.row}>
                <View style={styles.half}>
                    <Text style={styles.label}>Dirección</Text>
                    <TextInput
                        style={styles.input}
                        value={user.address}
                        onChangeText={(value) => handleChange('address', value)}
                        placeholder="Address"
                        placeholderTextColor="#000000"
                    />
                </View>

                <View style={styles.half}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                        style={styles.input}
                        value={user.phone}
                        onChangeText={(value) => handleChange('phone', value)}
                        placeholder="Phone"
                        placeholderTextColor="#000000"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <Text style={styles.label}>Role</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={user.role}
                    onValueChange={(value) => handleChange('role', value)}
                    style={styles.picker}
                >
                    <Picker.Item label="--Select Role--" value="" />
                    <Picker.Item label="ADMIN" value="ADMIN" />
                    <Picker.Item label="USER" value="USER" />
                </Picker>
            </View>

            {/* Si algún día quieres password en el formulario:
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                value={user.password}
                onChangeText={(value) => handleChange('password', value)}
                placeholder="Password"
                secureTextEntry
            />
            */}

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    color='#1d4ed8'
                    title={isEdit ? 'Guardar cambios' : 'Crear usuario'}
                    onPress={handleSave}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        marginTop: 8,
        marginBottom: 4,
        fontWeight: '500',
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    half: {
        flex: 1,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginBottom: 12,
        backgroundColor: 'white',  // fondo fijo
        color: 'black',
    },
    picker: {
        height: 45,
        width: '100%',
    },
});

export default UserFormScreen;
