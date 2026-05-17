import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { gradient } from '../theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        unsub();
        if (!user) {
          navigation.replace('Login');
          return;
        }
        const snap = await getDoc(doc(db, 'users', user.uid));
        const hasBusiness = snap.exists() && snap.data().businessId;
        navigation.replace(hasBusiness ? 'Main' : 'BusinessSetup');
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 72, height: 72, borderRadius: 16 },
});
