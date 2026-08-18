import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/home/HomeScreen';
import AreasScreen from '../screens/areas/AreasScreen';
import MapScreen from '../screens/areas/MapScreen';
import NGOsScreen from '../screens/ngos/NGOsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#2D6A4F',
  inactive: '#6B7280',
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Areas':
              iconName = 'leaf';
              break;
            case 'Map':
              iconName = 'map';
              break;
            case 'NGOs':
              iconName = 'people';
              break;
            case 'Profile':
              iconName = 'person';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Areas" component={AreasScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="NGOs" component={NGOsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
