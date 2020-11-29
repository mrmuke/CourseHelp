
import React from 'react';
import LoginScreen from './screens/LoginScreen'
import LoadingScreen from './screens/LoadingScreen'
import BottomTabs from './components/BottomTabs'
import { StyleSheet } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { NavigationContainer } from '@react-navigation/native';
import firebase from 'firebase'
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDCDTPo7A7CxdLK6_G947zHclZC10ZgPh0",
    authDomain: "coursehelp-8d1c8.firebaseapp.com",
    databaseURL: "https://coursehelp-8d1c8.firebaseio.com",
    projectId: "coursehelp-8d1c8",
    storageBucket: "coursehelp-8d1c8.appspot.com",
    messagingSenderId: "192738333169",
    appId: "1:192738333169:web:c84d0a5d65eae21425f450",
    measurementId: "G-8KE4X2NY85"
  })

}

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

