// android/app/src/navigation/StoresNavigator.js
import React from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StoreListScreen from '../Screens/Stores/StoreListScreen';
import StoreFormScreen from '../Screens/Stores/StoreFormScreen';

const Stack = createNativeStackNavigator();

const StoresNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerShown: false,
            })}
        >
            <Stack.Screen
                name="StoreList"
                component={StoreListScreen}
                options={{ title: 'Stores' }}
            />

            <Stack.Screen
                name="StoreForm"
                component={StoreFormScreen}
                options={{ title: 'Add / edit store' }}
            />
        </Stack.Navigator>
    );
};

export default StoresNavigator;
