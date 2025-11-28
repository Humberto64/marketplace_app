// android/app/src/navigation/ProductsNavigator.js
import React from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductListScreen from '../Screens/Products/ProductListScreen';
import ProductFormScreen from '../Screens/Products/ProductFormScreen';

const Stack = createNativeStackNavigator();

const ProductsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerRight: () => (
                    <Button title="☰" onPress={() => navigation.openDrawer()} />
                ),
            })}
        >
            <Stack.Screen
                name="ProductList"
                component={ProductListScreen}
                options={{ title: 'Products' }}
            />

            <Stack.Screen
                name="ProductForm"
                component={ProductFormScreen}
                options={{ title: 'Add / edit product' }}
            />
        </Stack.Navigator>
    );
};

export default ProductsNavigator;
