import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Alert, Pressable, ActivityIndicator, Switch, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, LANDING_BASE_URL } from '../firebase';
import { gradient, colors, shadow } from '../theme';
import GradientText from '../components/GradientText';

export default function QRScreen({ navigation }) {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [fontsLoaded] = useFonts({ ArchivoBlack_400Regular });
  const posterRef = useRef();

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

  async function capturePoster() {
    const tmpUri = await captureRef(posterRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });
    // Copy to a stable cache path with a clean filename so destination apps
    // (WhatsApp, Messages, Gmail, etc.) accept it without rejection.
    const safeName = (business?.businessName || 'reviewtap')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    const target = `${FileSystem.cacheDirectory}reviewtap-${safeName}-qr.png`;
    try { await FileSystem.deleteAsync(target, { idempotent: true }); } catch {}
    await FileSystem.copyAsync({ from: tmpUri, to: target });
    return target;
  }

  async function downloadQr() {
    if (busy || !fontsLoaded) return;
    setBusy(true);
    try {
      const perm = await MediaLibrary.requestPermissionsAsync(true);
      if (perm.status !== 'granted' && !perm.canAskAgain) {
        Alert.alert(
          'Permission needed',
          'Photos access is blocked. Open device Settings → Scan & Say → Photos to enable.',
        );
        return;
      }
      if (perm.status !== 'granted') {
        Alert.alert('Permission required', 'Allow Photos access to save your QR.');
        return;
      }
      const uri = await capturePoster();
      await MediaLibrary.createAssetAsync(uri);
      Alert.alert('Saved', 'Your QR poster was saved to Photos.');
    } catch (err) {
      console.warn('[QR download]', err);
      Alert.alert('Could not save', err?.message || 'Try the Share button instead.');
    } finally {
      setBusy(false);
    }
  }

  async function shareQr() {
    if (busy || !fontsLoaded) return;
    setBusy(true);
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Not available', 'Sharing is not available on this device.');
        return;
      }
      const uri = await capturePoster();
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Scan to leave us a review!',
        UTI: 'public.png',
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
        <ActivityIndicator color={colors.gradientStart} />
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
  const actionsDisabled = busy || !fontsLoaded;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.screenTitle}>Your QR Code</Text>
        <Text style={styles.screenSub}>This is what your customers will scan.</Text>

        {/* Print-ready poster — this is exactly what gets saved/shared */}
        <ViewShot
          ref={posterRef}
          options={{ format: 'png', quality: 1 }}
          style={styles.posterWrapper}
        >
          <View style={styles.poster}>
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.strip}
            >
              {fontsLoaded && (
                <Text style={styles.stripWordmark}>Ss.</Text>
              )}
            </LinearGradient>

            <View style={styles.posterBody}>
              <Text style={styles.intro}>Scan to leave a review at</Text>
              <Text style={styles.bizName} numberOfLines={2}>{business.businessName}</Text>

              <View style={styles.qrFrame}>
                <QRCode value={qrUrl} size={220} backgroundColor="#FFFFFF" color="#000000" />
              </View>

              {includeWatermark && fontsLoaded && (
                <View style={styles.watermark}>
                  <GradientText style={styles.watermarkText}>
                    Powered by @scanandsay on Play Store
                  </GradientText>
                </View>
              )}
            </View>
          </View>
        </ViewShot>

        {/* Watermark toggle */}
        <View style={styles.toggleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleLabel}>Scan & Say watermark</Text>
            <Text style={styles.toggleSub}>Premium · Free during beta</Text>
          </View>
          <Switch
            value={includeWatermark}
            onValueChange={setIncludeWatermark}
            trackColor={{ false: '#E5E7EB', true: colors.gradientStart }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={downloadQr}
            style={[styles.action, shadow, actionsDisabled && styles.actionDisabled]}
            disabled={actionsDisabled}
          >
            <Ionicons name="download-outline" size={20} color={colors.text} />
            <Text style={styles.actionText}>{busy ? 'Working…' : 'Download to Photos'}</Text>
          </Pressable>
          <Pressable
            onPress={shareQr}
            style={[styles.action, shadow, actionsDisabled && styles.actionDisabled]}
            disabled={actionsDisabled}
          >
            <Ionicons name="share-outline" size={20} color={colors.text} />
            <Text style={styles.actionText}>{busy ? 'Working…' : 'Share QR Code'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 32, alignItems: 'center' },

  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    alignSelf: 'flex-start',
  },
  screenSub: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },

  // Poster (the capturable card)
  posterWrapper: { borderRadius: 16, overflow: 'hidden', ...shadow },
  poster: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  strip: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  stripWordmark: {
    fontFamily: 'ArchivoBlack_400Regular',
    color: '#FFFFFF',
    fontSize: 24,
    letterSpacing: 0.5,
  },
  posterBody: {
    padding: 20,
    alignItems: 'center',
  },
  intro: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
  },
  bizName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 30,
    marginBottom: 24,
  },
  qrFrame: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  watermark: {
    marginTop: 4,
  },
  watermarkText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Toggle card
  toggleCard: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  toggleSub: { fontSize: 12, color: colors.muted, marginTop: 2 },

  // Actions
  actions: { width: 320, marginTop: 16, gap: 12 },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 14,
  },
  actionDisabled: { opacity: 0.5 },
  actionText: { fontSize: 16, fontWeight: '600', color: colors.text },

  // Fallback
  fallbackTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  fallbackLink: { color: colors.gradientStart, textDecorationLine: 'underline', fontSize: 15 },
});
