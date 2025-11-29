// android/app/src/navigation/DrawerNavigator.js
import React from 'react';
import {
    Button,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Menu } from 'lucide-react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList
} from '@react-navigation/drawer';
import {
    Home,
    ShoppingBag,
    Store,
    Users,
    MessageCircle,
    ClipboardList,
    Grid2X2,
    Settings as SettingsIcon,
} from 'lucide-react-native';
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
            drawerContent={(props) => (
                <DrawerContentScrollView
                    {...props}
                    contentContainerStyle={{
                        flex: 1,
                        backgroundColor: '#1d4ed8',
                    }}
                >
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

                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            )}
            screenOptions={({ navigation }) => ({
                // 🔹 HEADER AZUL COMO EL DRAWER
                headerStyle: {
                    backgroundColor: "#1d4ed8",
                },
                headerTintColor: "#ffffff", // color del título y back button
                headerTitleStyle: {
                    color: "#ffffff",
                    fontWeight: '600',
                },
                // 🔹 Botón hamburguesa blanco
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

            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <SettingsIcon color={color} size={size} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};
export default DrawerNavigator;
