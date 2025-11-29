// android/app/src/navigation/DrawerNavigator.js
import React from 'react';
import { Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

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
            screenOptions={({ navigation }) => ({
                // 👉 NOMBRE DE LA APP EN EL HEADER
                headerTitle: 'Marketplace',
                headerTitleAlign: 'left',       // si la quieres al centro: 'center'
                headerTintColor: '#ffffff',
                headerStyle: {
                    backgroundColor: '#1d4ed8',   // azul del header
                },

                // 👉 BOTÓN HAMBURGUESA A LA DERECHA
                headerRight: () => (
                    <Button
                        title="☰"
                        color="#ffffff"
                        onPress={() => navigation.openDrawer()}
                    />
                ),
                headerLeft: () => null,

                // 👉 ESTILOS DEL DRAWER (SIDEBAR)
                drawerStyle: {
                    width: '70%',
                    backgroundColor: '#1d4ed8',   // azul de la sidebar
                },
                drawerActiveTintColor: '#ffffff',          // texto de opción activa
                drawerInactiveTintColor: '#e5e7eb',        // texto de opción inactiva
                drawerActiveBackgroundColor: 'rgba(255,255,255,0.18)',
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: '500',
                },
            })}
        >
            <Drawer.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Dashboard' }}
            />

            <Drawer.Screen
                name="Products"
                component={ProductsNavigator}
                options={{
                    title: 'Products',
                    headerShown: false,
                }}
            />

            <Drawer.Screen
                name="Stores"
                component={StoresNavigator}
                options={{
                    title: 'Stores',
                    headerShown: false,
                }}
            />

            <Drawer.Screen
                name="Users"
                component={UsersNavigator}
                options={{
                    title: 'Users',
                    headerShown: false,
                }}
            />

            <Drawer.Screen
                name="Reviews"
                component={ReviewsNavigator}
                options={{
                    title: 'Reviews',
                    headerShown: false,
                }}
            />

            <Drawer.Screen
                name="Orders"
                component={OrdersNavigator}
                options={{
                    title: 'Orders',
                    headerShown: false,
                }}
            />

            <Drawer.Screen
                name="OrderItems"
                component={OrderItemsNavigator}
                options={{
                    title: 'Order items',
                    headerShown: false,
                }}
            />

            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
