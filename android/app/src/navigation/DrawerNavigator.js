// android/app/src/navigation/DrawerNavigator.js
import React from 'react';
import {
    Button,
    View,
    Text,
} from 'react-native';

import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList
} from '@react-navigation/drawer';

// Screens
import DashboardScreen from '../Screens/Dashboard/DashboardScreen';
import SettingsScreen from '../Screens/Settings/SettingsScreen';
import OrderItemsNavigator from './OrderItemsNavigator';
import OrdersNavigator from './OrdersNavigator';
import ProductsNavigator from './ProductsNavigator';
import ReviewsNavigator from './ReviewsNavigator';
import StoresNavigator from './StoresNavigator';
import UsersNavigator from './UsersNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            // 🎨 Personalizar el contenido del Drawer
            drawerContent={(props) => (
                <DrawerContentScrollView
                    {...props}
                    contentContainerStyle={{
                        flex: 1,
                        backgroundColor: '#1d4ed8', // Azul claro
                    }}
                >
                    {/* 🔥 TITULO "MARKETPLACE" ARRIBA DEL MENU */}
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

                    {/* Aquí se muestran los botones Dashboard, Users, etc */}
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            )}

            // Estilos generales del Drawer
            screenOptions={({ navigation }) => ({
                headerRight: () => (
                    <Button
                        title="☰"
                        color="#1d4ed8"
                        onPress={() => navigation.openDrawer()}
                    />
                ),
                headerLeft: () => null,

                drawerActiveTintColor: '#ffffff',      // Texto activo
                drawerInactiveTintColor: '#e0e7ff',    // Texto inactivo más claro
                drawerActiveBackgroundColor: 'rgba(255,255,255,0.2)',
                drawerLabelStyle: { fontSize: 16, fontWeight: '500' },

                drawerStyle: {
                    width: '70%',
                    backgroundColor: '#1d4ed8', // Azul de fondo del drawer
                },
            })}
        >
            <Drawer.Screen name="Dashboard" component={DashboardScreen} />
            <Drawer.Screen name="Products" component={ProductsNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name="Stores" component={StoresNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name="Users" component={UsersNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name="Reviews" component={ReviewsNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name="Orders" component={OrdersNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name="OrderItems" component={OrderItemsNavigator} options={{ headerShown: false }} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
