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
                headerRight: () => (
                    <Button title="☰" onPress={() => navigation.openDrawer()} />
                ),
                headerLeft: () => null, // ocultamos el hamburguesa por defecto de la izquierda
                drawerStyle: {
                    width: '70%', // la sidebar no ocupa toda la pantalla
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
                    headerShown: false
                }}
            />


            <Drawer.Screen
                name="OrderItems"
                component={OrderItemsNavigator}
                options={{
                    title: 'Order items',
                    headerShown: false, // 👈 ocultamos el header del Drawer para esta pantalla
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
