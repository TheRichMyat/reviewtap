import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  doc, getDoc, collection, query, where, orderBy, limit, getDocs,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { colors, gradient, shadow } from '../theme';
import Wordmark from '../components/Wordmark';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ scans: 0, clicks: 0 });
  const [recent, setRecent] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  async function load() {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const businessId = userSnap.data()?.businessId;
      if (!businessId) { setLoading(false); return; }

      const bizSnap = await getDoc(doc(db, 'businesses', businessId));
      if (bizSnap.exists()) setBusinessName(bizSnap.data().businessName);

      const q = query(
        collection(db, 'analytics'),
        where('businessId', '==', businessId),
        orderBy('timestamp', 'desc'),
        limit(100),
      );
      const snap = await getDocs(q);
      let scans = 0, clicks = 0;
      const items = [];
      snap.forEach((d) => {
        const ev = d.data();
        if (ev.eventType === 'scan') scans++;
        if (ev.eventType === 'google_click' || ev.eventType === 'facebook_click') clicks++;
        items.push({ id: d.id, ...ev });
      });
      setStats({ scans, clicks });
      setRecent(items.slice(0, 5));
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={colors.gradientStart} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gradientStart}
            colors={[colors.gradientStart]}
          />
        }
      >
        <View style={styles.topRow}>
          <Wordmark size={22} />
        </View>

        <Text style={styles.greeting}>Hi, {businessName || 'there'}</Text>
        <Text style={styles.sub}>Here's how you're doing.</Text>

        <View style={styles.statsRow}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.primaryCard, shadow]}
          >
            <Ionicons name="qr-code" size={20} color={colors.white} style={{ opacity: 0.85 }} />
            <Text style={styles.primaryValue}>{stats.scans}</Text>
            <Text style={styles.primaryLabel}>Total Scans</Text>
          </LinearGradient>

          <View style={[styles.secondaryCard, shadow]}>
            <Ionicons name="open-outline" size={20} color={colors.gradientStart} />
            <Text style={styles.secondaryValue}>{stats.clicks}</Text>
            <Text style={styles.secondaryLabel}>Link Clicks</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent activity</Text>

        {recent.length === 0 ? (
          <View style={[styles.empty, shadow]}>
            <Ionicons name="time-outline" size={28} color={colors.muted} />
            <Text style={styles.emptyText}>No activity yet</Text>
            <Text style={styles.emptyHint}>Share your QR code to get started.</Text>
          </View>
        ) : (
          recent.map((ev) => <ActivityRow key={ev.id} event={ev} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityRow({ event }) {
  const meta = eventMeta(event.eventType);
  return (
    <View style={[styles.row, shadow]}>
      <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon} size={18} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowType}>{meta.label}</Text>
        <Text style={styles.rowTime}>{formatTime(event.timestamp)}</Text>
      </View>
    </View>
  );
}

function eventMeta(type) {
  if (type === 'scan') return { label: 'QR scanned', icon: 'qr-code', color: '#4F6DFF', bg: '#EEF1FF' };
  if (type === 'google_click') return { label: 'Google review tapped', icon: 'logo-google', color: '#DB4437', bg: '#FDECEA' };
  if (type === 'facebook_click') return { label: 'Facebook review tapped', icon: 'logo-facebook', color: '#1877F2', bg: '#E8F1FE' };
  return { label: type, icon: 'ellipse', color: colors.muted, bg: colors.bg };
}

function formatTime(ts) {
  if (!ts?.toDate) return '';
  return ts.toDate().toLocaleString();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  scroll: { padding: 20, paddingBottom: 32 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  sub: { fontSize: 14, color: colors.muted, marginTop: 4, marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  primaryCard: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  primaryValue: { fontSize: 34, fontWeight: '800', color: colors.white, marginTop: 8 },
  primaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  secondaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 16,
    minHeight: 120,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryValue: { fontSize: 34, fontWeight: '800', color: colors.text, marginTop: 8 },
  secondaryLabel: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  empty: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 10 },
  emptyHint: { fontSize: 13, color: colors.muted, marginTop: 4 },
  row: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowType: { fontSize: 14, color: colors.text, fontWeight: '600' },
  rowTime: { fontSize: 12, color: colors.muted, marginTop: 2 },
});
