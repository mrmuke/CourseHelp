
import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Chat from '../screens/Chat';
import Home from '../screens/Home'
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import Forum from '../screens/Forum';
import { createStackNavigator } from '@react-navigation/stack';
import Discover from '../screens/Discover';
import CreateGroup from './CreateGroup';
import Tools from '../screens/Tools';
const Stack = createStackNavigator();


const Tab = createMaterialBottomTabNavigator();
function Dashboard() {
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
        title: 'Home',

      }} />
      <Stack.Screen name="Chat" component={Chat} options={{
        title: 'Chat',

      }} />
<<<<<<< HEAD

    </Stack.Navigator>

=======
      <Stack.Screen name="CreateGroup" component={CreateGroup} options={{
      title:'Create Group',
      
      }} />
</Stack.Navigator>
>>>>>>> f5927b0294bac1d37d5fba07984a822852648244
  )
}

const MainTabScreen = () => (
<<<<<<< HEAD
  <Tab.Navigator
    initialRouteName="Home"
    activeColor="#fff"
    shifting={true}

  >
    <Tab.Screen
      name="Home"

      component={Dashboard}
      options={{
        title: "Home",
        tabBarLabel: 'Home',
        tabBarColor: '#59d0fb',
        tabBarIcon: ({ color }) => (
          <AntIcon name="home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Discover"

      component={Discover}
      options={{
        title: "Discover Study Groups",
        tabBarLabel: 'Discover',
        tabBarColor: '#59d0fb',
        tabBarIcon: ({ color }) => (
          <AntIcon name="search1" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Forum"
      component={Forum}
      options={{
        tabBarLabel: 'Forum',
        tabBarColor: '#59a8fb',
        tabBarIcon: ({ color }) => (
          <Icon name="forum" color={color} size={26} />
        ),
      }}
    />

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
=======
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
        name="Discover"
      
        component={Discover}
        options={{
          title:"Discover Study Groups",
          tabBarLabel: 'Discover',
          tabBarColor: '#59d0fb',
          tabBarIcon: ({ color }) => (
            <AntIcon name="search1" color={color} size={26} />
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
      <Tab.Screen
        name="StudyTools"
        component={Tools}
        options={{
          tabBarLabel: 'Study Tools',
          tabBarColor:'#59a8fb',
          tabBarIcon: ({ color }) => (
            <Icon name="pencil" color={color} size={26} />
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
>>>>>>> f5927b0294bac1d37d5fba07984a822852648244
);

export default MainTabScreen;