// android/app/src/navigation/ReviewsNavigator.js
import React from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ReviewListScreen from '../Screens/Reviews/ReviewListScreen';
import ReviewFormScreen from '../Screens/Reviews/ReviewFormScreen';

const Stack = createNativeStackNavigator();

const ReviewsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerShown: false,
            })}
        >
            <Stack.Screen
                name="ReviewList"
                component={ReviewListScreen}
                options={{ title: 'Reviews' }}
            />

            <Stack.Screen
                name="ReviewForm"
                component={ReviewFormScreen}
                options={{ title: 'Add / edit review' }}
            />
        </Stack.Navigator>
    );
};

export default ReviewsNavigator;
