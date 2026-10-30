import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/home/HomeScreen';
import MapScreen from '../screens/map/MapScreen';
import DenunciarScreen from '../screens/denunciar/DenunciarScreen';
import NGOsScreen from '../screens/ngos/NGOsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import { COLORS, FONTS, shadow } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
  Home: { label: 'Início', icon: 'home-outline', iconActive: 'home' },
  Mapa: { label: 'Mapa', icon: 'map-outline', iconActive: 'map' },
  Denunciar: { label: 'Denunciar', center: true },
  ONGs: { label: 'ONGs', icon: 'people-outline', iconActive: 'people' },
  Perfil: { label: 'Perfil', icon: 'person-outline', iconActive: 'person' },
};

function VerdeTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const cfg = TAB_CONFIG[route.name] ?? {};

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (cfg.center) {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.centerItem}
                onPress={onPress}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Denunciar"
              >
                <View
                  style={[
                    styles.centerBtn,
                    focused && styles.centerBtnActive,
                  ]}
                >
                  <Ionicons name="warning" size={22} color={COLORS.white} />
                </View>
                <Text style={[styles.label, focused && styles.labelActive]}>
                  {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
            >
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Ionicons
                  name={focused ? cfg.iconActive : cfg.icon}
                  size={21}
                  color={focused ? COLORS.primary : COLORS.muted}
                />
              </View>
              <Text style={[styles.label, focused && styles.labelActive]}>
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <VerdeTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneContainerStyle: { backgroundColor: COLORS.bg },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Denunciar" component={DenunciarScreen} />
      <Tab.Screen name="ONGs" component={NGOsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 6,
    ...shadow(6),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    gap: 3,
  },
  iconWrap: {
    width: 38,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: COLORS.primarySoft },
  label: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    letterSpacing: -0.1,
    color: COLORS.muted,
  },
  labelActive: { fontWeight: '700', color: COLORS.primary },
  centerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginTop: -22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...shadow(8),
  },
  centerBtnActive: { backgroundColor: COLORS.secondary },
});
