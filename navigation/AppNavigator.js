import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Telas principais
import Home from '../screens/main/Home';
import Profile from '../screens/main/Profile';
import CreateRide from '../screens/main/CreateRide';
import SearchRide from '../screens/main/SearchRide';
import RideDetails from '../screens/main/RideDetails';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navigator para a tab Home com suas telas relacionadas
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomeScreen" 
      component={Home} 
      options={{ title: 'Início' }}
    />
    <Stack.Screen 
      name="RideDetails" 
      component={RideDetails} 
      options={{ title: 'Detalhes da Carona' }}
    />
  </Stack.Navigator>
);

// Navigator para a tab Procurar com suas telas relacionadas
const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SearchScreen" 
      component={SearchRide} 
      options={{ title: 'Procurar Carona' }}
    />
    <Stack.Screen 
      name="RideDetails" 
      component={RideDetails} 
      options={{ title: 'Detalhes da Carona' }}
    />
  </Stack.Navigator>
);

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'CreateRide') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ 
          headerShown: false,
          title: 'Início'
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchStack} 
        options={{ 
          headerShown: false,
          title: 'Procurar'
        }}
      />
      <Tab.Screen 
        name="CreateRide" 
        component={CreateRide} 
        options={{ 
          title: 'Oferecer'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{ 
          title: 'Perfil'
        }}
      />
    </Tab.Navigator>
  );
}