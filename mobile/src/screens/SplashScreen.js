import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { gradient } from '../theme';
import LoadingRing from '../components/LoadingRing';

export default function SplashScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ ArchivoBlack_400Regular });

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

      {fontsLoaded && (
        <View style={styles.brand}>
          <Text style={[styles.mark, { fontFamily: 'ArchivoBlack_400Regular' }]}>
            Ss.
          </Text>
          <Text style={[styles.appName, { fontFamily: 'ArchivoBlack_400Regular' }]}>
            Scan & Say
          </Text>
        </View>
      )}

      <View style={styles.loaderWrap}>
        <LoadingRing size={32} color="rgba(255,255,255,0.85)" width={3} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
  },
  mark: {
    color: '#FFFFFF',
    fontSize: 96,
    letterSpacing: -2,
    lineHeight: 96,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 28,
    letterSpacing: -0.4,
    marginTop: 12,
  },
  loaderWrap: {
    position: 'absolute',
    bottom: 80,
  },
});
