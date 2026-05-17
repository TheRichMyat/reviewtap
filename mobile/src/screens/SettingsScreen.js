import React from 'react';
import {
  View, Text, StyleSheet, Pressable, Alert, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { signOut } from 'firebase/auth';
import Constants from 'expo-constants';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { auth } from '../firebase';
import { colors } from '../theme';
import GradientText from '../components/GradientText';

const APP_VERSION = Constants.expoConfig?.version || '1.0.0';

export default function SettingsScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ ArchivoBlack_400Regular });

  function logout() {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          navigation.getParent()?.replace('Login');
        },
      },
    ]);
  }

  function showHowItWorks() {
    Alert.alert(
      'How It Works',
      '1. Print or share your QR code.\n2. Customers scan it with their phone camera.\n3. They tap "Review on Google" and leave a review.\n\nYou track scans and clicks in Dashboard.',
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <View style={styles.brandBlock}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <View style={styles.brandText}>
          {fontsLoaded ? (
            <GradientText style={styles.appName}>ReviewTap</GradientText>
          ) : (
            <ActivityIndicator size="small" />
          )}
          <Text style={styles.version}>version number: {APP_VERSION.split('').join(' ')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <Row
          label="Edit Business Info"
          onPress={() => navigation.navigate('BusinessSetup', { edit: true })}
        />
        <Row label="How It Works" onPress={showHowItWorks} />
        <Row label="Log Out" onPress={logout} danger />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.copy}>© 2026 All rights reserved.</Text>
        <Text style={styles.copy}>
          Developed by <Text style={styles.brand}>Riven</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, onPress, danger }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      <Text style={[styles.chevron, danger && { color: colors.danger }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: colors.white,
    gap: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  brandText: { flex: 1 },
  appName: {
    fontFamily: 'ArchivoBlack_400Regular',
    fontSize: 26,
    letterSpacing: -0.3,
    color: colors.text,
  },
  version: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  body: { padding: 16, paddingTop: 8, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  row: {
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: { fontSize: 16, color: colors.text, fontWeight: '500' },
  chevron: { fontSize: 22, color: colors.muted },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    alignItems: 'center',
  },
  copy: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  brand: {
    color: colors.gradientStart,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
