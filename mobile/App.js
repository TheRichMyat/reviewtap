import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import BusinessSetupScreen from './src/screens/BusinessSetupScreen';
import QRScreen from './src/screens/QRScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  // Always reserve a minimum visual buffer so icons aren't cramped on phones
  // with opaque 3-button nav bars (which report tiny bottom insets).
  const bottomBuffer = Math.max(insets.bottom, 0) + 12;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.gradientStart,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: -2 },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 56 + bottomBuffer,
          paddingTop: 8,
          paddingBottom: bottomBuffer,
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'stats-chart',
            QR: 'qr-code',
            Settings: 'settings-sharp',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="QR" component={QRScreen} options={{ title: 'QR Code' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" translucent backgroundColor="transparent" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ animation: 'fade', animationDuration: 400 }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animation: 'fade', animationDuration: 400 }}
          />
          <Stack.Screen
            name="BusinessSetup"
            component={BusinessSetupScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ animation: 'fade', animationDuration: 350 }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
