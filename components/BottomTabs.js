  
import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Chat from '../screens/Chat';
import Home from '../screens/Home'
import Profile from '../screens/Profile';
import Forum from '../screens/Forum';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();


const Tab = createMaterialBottomTabNavigator();
function Dashboard(){
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
      backgroundColor: '#003152',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
      fontWeight: 'bold'
      }
  }}>
      <Stack.Screen name="Home" component={Home} options={{
      title:'Home',
      
      }} />
      <Stack.Screen name="Chat" component={Chat} options={{
      title:'Chat',
      
      }} />
</Stack.Navigator>
  )
}
const MainTabScreen = () => (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
      shifting={true}
    
    >
      <Tab.Screen
        name="Home"
      
        component={Dashboard}
        options={{
          title:"Home",
          tabBarLabel: 'Home',
          tabBarColor: '#59d0fb',
          tabBarIcon: ({ color }) => (
            <AntIcon name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Forum"
        component={Forum}
        options={{
          tabBarLabel: 'Forum',
          tabBarColor:'#59a8fb',
          tabBarIcon: ({ color }) => (
            <Icon name="forum" color={color} size={26} />
          ),
        }}
      />
     {/*  <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarLabel: 'Chat',
          tabBarColor: '#5b59fb',
          tabBarIcon: ({ color }) => (
            <AntIcon name="message1" color={color} size={26} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarColor: '#5b59fb',
          tabBarIcon: ({ color }) => (
            <AntIcon name="user" color={color} size={26} />
          ),
        }}
      />
      
      
    </Tab.Navigator>
);

export default MainTabScreen;