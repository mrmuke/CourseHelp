  
import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Chat from '../screens/Chat';
import Home from '../screens/Home'
import Profile from '../screens/Profile';


const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      shifting={true}
    
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: '#FF9933',
          tabBarIcon: ({ color }) => (
            <AntIcon name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarColor: '#FF9933',
          tabBarIcon: ({ color }) => (
            <AntIcon name="message1" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#FF9933',
          tabBarIcon: ({ color }) => (
            <AntIcon name="user" color={color} size={26} />
          ),
        }}
      />
      
    </Tab.Navigator>
);

export default MainTabScreen;