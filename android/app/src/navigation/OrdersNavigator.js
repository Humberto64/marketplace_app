// android/app/src/navigation/OrdersNavigator.js
import React from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OrderListScreen from '../Screens/Orders/OrderListScreen';
import OrderFormScreen from '../Screens/Orders/OrderFormScreen';

const Stack = createNativeStackNavigator();

const OrdersNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerRight: () => (
                    <Button title="☰" onPress={() => navigation.openDrawer()} />
                ),
            })}
        >
            <Stack.Screen
                name="OrderList"
                component={OrderListScreen}
                options={{ title: 'Orders' }}
            />

            <Stack.Screen
                name="OrderForm"
                component={OrderFormScreen}
                options={{ title: 'Add / edit order' }}
            />
        </Stack.Navigator>
    );
};

export default OrdersNavigator;
