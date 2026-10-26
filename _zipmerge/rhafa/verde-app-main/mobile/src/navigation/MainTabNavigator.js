
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../theme';

import HomeScreen from '../screens/home/HomeScreen';
import MapScreen from '../screens/map/MapScreen';
import NGOsScreen from '../screens/ngos/NGOsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import DenunciarScreen from '../screens/denunciar/DenunciarScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: 'home',
  Mapa: 'map',
  ONGs: 'people',
  Profile: 'person',
};

const FAB_SIZE = 40;
const FAB_RADIUS = FAB_SIZE / 2;
const FAB_OVERLAP_TOP = 8;

export default function MainTabNavigator({ navigation }) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  const fabBottom =
    bottomInset + (FAB_SIZE / 2 - FAB_OVERLAP_TOP);

  const openDenunciar = () => {
    navigation.navigate('Main', {
      screen: 'Denunciar',
    });
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.muted,

          tabBarStyle: {
            paddingBottom: bottomInset + FAB_SIZE / 2 + 6,
            paddingTop: 6,
            height: 62 + bottomInset,
            borderTopWidth: 1,
            borderTopColor: 'rgba(20, 36, 27, 0.06)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 0.4,
          },

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={ICONS[route.name] ?? 'ellipse'}
              size={size}
              color={color}
            />
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Início' }}
        />

        <Tab.Screen
          name="Mapa"
          component={MapScreen}
          options={{ title: 'Mapa' }}
        />

        <Tab.Screen
          name="ONGs"
          component={NGOsScreen}
          options={{ title: 'ONGs' }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Perfil' }}
        />

        {/* Rota interna: mantém a barra visível sem criar outra aba */}
        <Tab.Screen
          name="Denunciar"
          component={DenunciarScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
      </Tab.Navigator>

      {/* Botão central personalizado */}
      <TouchableOpacity
        style={[styles.fab, { bottom: fabBottom }]}
        activeOpacity={0.9}
        hitSlop={{
          top: 24,
          bottom: 24,
          left: 24,
          right: 24,
        }}
        onPress={openDenunciar}
        accessibilityRole="button"
        accessibilityLabel="Abrir denúncias"
      >
        <View style={styles.fabCircle}>
          <Ionicons
            name="warning-outline"
            size={22}
            color="#FFFFFF"
            style={styles.fabIcon}
          />
        </View>

        <Text style={styles.fabLabel}>Denunciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fab: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
  },

  fabCircle: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_RADIUS,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },

  fabIcon: {
    alignSelf: 'center',
  },

  fabLabel: {
    marginTop: 3,
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});
