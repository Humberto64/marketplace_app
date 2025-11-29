// android/app/src/navigation/OrderItemsNavigator.js
import React from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OrderItemListScreen from '../Screens/OrderItems/OrderItemListScreen';
import OrderItemFormScreen from '../Screens/OrderItems/OrderItemFormScreen';

const Stack = createNativeStackNavigator();

const OrderItemsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerShown: false,
            })}
        >
            <Stack.Screen
                name="OrderItemList"
                component={OrderItemListScreen}
                options={{ title: 'Order items' }}
            />

            <Stack.Screen
                name="OrderItemForm"
                component={OrderItemFormScreen}
                options={{ title: 'Add / edit item' }}
            />
        </Stack.Navigator>
    );
};

export default OrderItemsNavigator;
