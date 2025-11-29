// android/app/src/navigation/UsersNavigator.js
import React from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserListScreen from '../Screens/Users/UserListScreen';
import UserFormScreen from '../Screens/Users/UserFormScreen';

const Stack = createNativeStackNavigator();

const UsersNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerShown: false,
            })}
        >
            <Stack.Screen
                name="UserList"
                component={UserListScreen}
                options={{ title: 'Users' }}
            />

            <Stack.Screen
                name="UserForm"
                component={UserFormScreen}
                options={{ title: 'Add / edit user' }}
            />
        </Stack.Navigator>
    );
};

export default UsersNavigator;
