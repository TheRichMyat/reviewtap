import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Alert, Pressable, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, LANDING_BASE_URL } from '../firebase';
import { gradient, colors, shadow } from '../theme';

export default function QRScreen({ navigation }) {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const viewShotRef = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBusiness);
    return unsubscribe;
  }, [navigation]);

  async function loadBusiness() {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const businessId = userSnap.data()?.businessId;
      if (!businessId) { setLoading(false); return; }
      const bizSnap = await getDoc(doc(db, 'businesses', businessId));
      if (bizSnap.exists()) {
        setBusiness({ id: businessId, ...bizSnap.data() });
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function captureQr() {
    return await captureRef(viewShotRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });
  }

  async function downloadQr() {
    if (busy) return;
    setBusy(true);
    try {
      const perm = await MediaLibrary.requestPermissionsAsync(true);
      if (perm.status !== 'granted' && !perm.canAskAgain) {
        Alert.alert(
          'Permission needed',
          'Photos access is blocked. Open device Settings → ReviewTap → Photos to enable.',
        );
        return;
      }
      if (perm.status !== 'granted') {
        Alert.alert('Permission required', 'Allow Photos access to save the QR code.');
        return;
      }
      const uri = await captureQr();
      await MediaLibrary.createAssetAsync(uri);
      Alert.alert('Saved', 'QR code saved to your Photos.');
    } catch (err) {
      console.warn('[QR download]', err);
      Alert.alert('Could not save', err?.message || 'Unknown error. Try the Share button instead.');
    } finally {
      setBusy(false);
    }
  }

  async function shareQr() {
    if (busy) return;
    setBusy(true);
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Not available', 'Sharing is not available on this device.');
        return;
      }
      const uri = await captureQr();
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Scan to leave us a review!',
      });
    } catch (err) {
      Alert.alert('Could not share', err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={colors.white} />
      </SafeAreaView>
    );
  }

  if (!business) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.fallbackTitle}>No business yet</Text>
        <Pressable onPress={() => navigation.navigate('BusinessSetup', { edit: true })}>
          <Text style={styles.fallbackLink}>Set one up</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const qrUrl = `${LANDING_BASE_URL}/review/${business.id}`;

  return (
    <LinearGradient colors={gradient} style={styles.gradient}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Your QR Code</Text>
        </View>

        <View style={styles.content}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
            <View style={[styles.card, shadow]}>
              <QRCode value={qrUrl} size={240} />
            </View>
          </ViewShot>

          <Text style={styles.business}>{business.businessName}</Text>
          <Text style={styles.tagline}>Scan to leave a review</Text>

          <View style={styles.actions}>
            <Pressable onPress={downloadQr} style={[styles.action, shadow]} disabled={busy}>
              <Ionicons name="download-outline" size={20} color={colors.text} />
              <Text style={styles.actionText}>{busy ? 'Working…' : 'Download to Photos'}</Text>
            </Pressable>
            <Pressable onPress={shareQr} style={[styles.action, shadow]} disabled={busy}>
              <Ionicons name="share-outline" size={20} color={colors.text} />
              <Text style={styles.actionText}>{busy ? 'Working…' : 'Share QR Code'}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gradientStart },
  topRow: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { color: colors.white, fontSize: 18, fontWeight: '700', letterSpacing: 0.2 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  business: { color: colors.white, fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  tagline: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4, marginBottom: 28 },
  actions: { width: '100%', maxWidth: 360, gap: 12 },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.white,
    height: 52,
    borderRadius: 14,
  },
  actionText: { fontSize: 16, fontWeight: '600', color: colors.text },
  fallbackTitle: { color: colors.white, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  fallbackLink: { color: colors.white, textDecorationLine: 'underline', fontSize: 15 },
});
