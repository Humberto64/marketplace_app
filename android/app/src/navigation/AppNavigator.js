// android/app/src/navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import { navigationRef } from './navigationRef';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
    const [loading, setLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Auth');

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                setInitialRoute(token ? 'Main' : 'Auth');
            } catch (e) {
                console.log('Error leyendo token', e);
                setInitialRoute('Auth');
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <RootStack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={initialRoute}
            >
                {/* STACK DE AUTENTICACIÓN (Login, Register, etc.) */}
                <RootStack.Screen name="Auth" component={AuthNavigator} />

                {/* STACK PRINCIPAL (Drawer con todo el resto) */}
                <RootStack.Screen name="Main" component={DrawerNavigator} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
