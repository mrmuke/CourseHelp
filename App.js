// Import the screens
import Main from './screens/Main';
import Chat from './screens/Chat';
// Import React Navigation
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Chat" component={Chat} />

    </Stack.Navigator>
    </NavigationContainer>
  );
}