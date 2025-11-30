// android/app/src/navigation/DrawerNavigator.js
import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import {
    Menu,
    Home,
    ShoppingBag,
    Store,
    Users,
    MessageCircle,
    ClipboardList,
    Grid2X2,
    LogOut,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import DashboardScreen from '../Screens/Dashboard/DashboardScreen';
import OrderItemsNavigator from './OrderItemsNavigator';
import OrdersNavigator from './OrdersNavigator';
import ProductsNavigator from './ProductsNavigator';
import ReviewsNavigator from './ReviewsNavigator';
import StoresNavigator from './StoresNavigator';
import UsersNavigator from './UsersNavigator';

const Drawer = createDrawerNavigator();

/**
 * 🔹 Screen de Logout dentro del MISMO archivo.
 *    Cuando se monta:
 *    - Borra tokens
 *    - Hace reset al RootStack hacia "Auth" (AuthNavigator → Login)
 */
const LogoutScreen = ({ navigation }) => {
    useEffect(() => {
        const doLogout = async () => {
            try {
                await AsyncStorage.multiRemove([
                    'token',
                    'refreshToken',
                    'authuserId',
                    'email',
                    'firstname',
                    'lastname',
                    'role',
                ]);

                // 👇 Desde el Drawer, getParent() es el RootStack (AppNavigator)
                navigation.getParent()?.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }], // ⬅️ este es el name de tu RootStack.Screen de AuthNavigator
                });
            } catch (e) {
                console.log('Error en logout:', e);
            }
        };

        doLogout();
    }, [navigation]);

    // Pantalla de carga rápida mientras se hace logout
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
            }}
        >
            <ActivityIndicator size="large" color="#1d4ed8" />
        </View>
    );
};

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <DrawerContentScrollView
                    {...props}
                    contentContainerStyle={{
                        flex: 1,
                        backgroundColor: '#1d4ed8',
                    }}
                >
                    {/* Título Marketplace */}
                    <View style={{ padding: 20, paddingBottom: 10 }}>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 24,
                                fontWeight: 'bold',
                            }}
                        >
                            Marketplace
                        </Text>
                    </View>

                    {/* Items del Drawer (Dashboard, Products, Stores, etc. + Logout) */}
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            )}
            screenOptions={({ navigation }) => ({
                // Header azul como el drawer
                headerStyle: {
                    backgroundColor: '#1d4ed8',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    color: '#ffffff',
                    fontWeight: '600',
                },
                // Botón hamburguesa blanco
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        style={{ marginRight: 12 }}
                    >
                        <Menu color="#ffffff" size={22} />
                    </TouchableOpacity>
                ),
                headerLeft: () => null,
                drawerActiveTintColor: '#ffffff',
                drawerInactiveTintColor: '#e0e7ff',
                drawerActiveBackgroundColor: 'rgba(255,255,255,0.2)',
                drawerLabelStyle: { fontSize: 16, fontWeight: '500' },
                drawerStyle: {
                    width: '70%',
                    backgroundColor: '#1d4ed8',
                },
            })}
        >
            <Drawer.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Products"
                component={ProductsNavigator}
                options={{
                    headerTitle: 'Products',
                    drawerIcon: ({ color, size }) => (
                        <ShoppingBag color={color} size={size} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Stores"
                component={StoresNavigator}
                options={{
                    headerTitle: 'Stores',
                    drawerIcon: ({ color, size }) => (
                        <Store color={color} size={size} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Users"
                component={UsersNavigator}
                options={{
                    headerTitle: 'Users',
                    drawerIcon: ({ color, size }) => (
                        <Users color={color} size={size} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Reviews"
                component={ReviewsNavigator}
                options={{
                    headerTitle: 'Reviews',
                    drawerIcon: ({ color, size }) => (
                        <MessageCircle color={color} size={size} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Orders"
                component={OrdersNavigator}
                options={{
                    headerTitle: 'Orders',
                    drawerIcon: ({ color, size }) => (
                        <ClipboardList color={color} size={size} />
                    ),
                }}
            />

            <Drawer.Screen
                name="OrderItems"
                component={OrderItemsNavigator}
                options={{
                    headerTitle: 'Order Items',
                    drawerIcon: ({ color, size }) => (
                        <Grid2X2 color={color} size={size} />
                    ),
                }}
            />

            {/* 🔚 Item de Logout como Drawer.Screen, sin crear archivos nuevos */}
            <Drawer.Screen
                name="Logout"
                component={LogoutScreen}
                options={{
                    title: 'Log out',
                    drawerIcon: ({ color, size }) => (
                        <LogOut color={color} size={size} />
                    ),
                    drawerItemStyle: {
                        marginTop: 'auto', // Empuja este item al fondo del menú
                    },
                }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
