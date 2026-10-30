import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { COLORS, FONTS, RADIUS } from '../theme';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';
import NGOsCreateScreen from '../screens/ngos/NGOsCreateScreen';
import EducationScreen from '../screens/educacao/EducationScreen';
import AdminScreen from '../screens/admin/AdminScreen';

const Stack = createNativeStackNavigator();

function Splash() {
  return (
    <View style={styles.splash}>
      <View style={styles.splashCard}>
        <Ionicons name="leaf" size={22} color={COLORS.onPrimary} />
        <Text style={styles.splashText}>+Verde</Text>
      </View>
      <ActivityIndicator
        size="small"
        color={COLORS.primary}
        style={styles.splashLoader}
      />
    </View>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <Splash />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bg },
        animation: 'slide_from_right',
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Educacao" component={EducationScreen} />
          <Stack.Screen name="CreateONGsScreen" component={NGOsCreateScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
  splashCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.primary,
  },
  splashText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.onPrimary,
  },
  splashLoader: { marginTop: 16 },
});
