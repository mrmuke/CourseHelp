
import React from 'react';


import LoginScreen from './screens/LoginScreen'
import LoadingScreen from './screens/LoadingScreen'
import BottomTabs from './components/BottomTabs'
import { StyleSheet } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { NavigationContainer } from '@react-navigation/native';

export default class App extends React.Component {
  render() {
    return <NavigationContainer><AppNavigator /></NavigationContainer>
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  BottomTabs: BottomTabs,
});

const AppNavigator = createAppContainer
  (AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
