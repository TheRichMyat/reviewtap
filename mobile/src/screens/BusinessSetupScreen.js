import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  collection, addDoc, doc, getDoc, setDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { colors } from '../theme';
import GradientButton from '../components/GradientButton';
import Wordmark from '../components/Wordmark';

export default function BusinessSetupScreen({ navigation, route }) {
  const editMode = !!route?.params?.edit;
  const [businessName, setBusinessName] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [facebookPageUrl, setFacebookPageUrl] = useState('');
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const existingId = userSnap.data()?.businessId;
      if (!existingId) return;
      setBusinessId(existingId);
      const bizSnap = await getDoc(doc(db, 'businesses', existingId));
      if (bizSnap.exists()) {
        const b = bizSnap.data();
        setBusinessName(b.businessName || '');
        setGoogleReviewUrl(b.googleReviewUrl || '');
        setFacebookPageUrl(b.facebookPageUrl || '');
      }
    })();
  }, []);

  async function save() {
    if (!businessName.trim()) {
      Alert.alert('Required', 'Please enter your business name.');
      return;
    }
    if (!googleReviewUrl.trim() && !facebookPageUrl.trim()) {
      Alert.alert(
        'Add at least one link',
        'Add either your Google review URL, your Facebook page URL, or both — we need somewhere to send your customers.',
      );
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      const payload = {
        ownerId: user.uid,
        businessName: businessName.trim(),
        googleReviewUrl: googleReviewUrl.trim(),
        facebookPageUrl: facebookPageUrl.trim(),
        updatedAt: serverTimestamp(),
      };

      let id = businessId;
      if (id) {
        await updateDoc(doc(db, 'businesses', id), payload);
      } else {
        const ref = await addDoc(collection(db, 'businesses'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        id = ref.id;
        await setDoc(
          doc(db, 'users', user.uid),
          { businessId: id },
          { merge: true },
        );
      }

      if (editMode) {
        navigation.goBack();
      } else {
        navigation.replace('Main');
      }
    } catch (err) {
      Alert.alert('Could not save', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}><Wordmark size={20} /></View>
          <Text style={styles.header}>
            {editMode ? 'Edit Business Info' : 'Set Up Your Business'}
          </Text>
          <Text style={styles.lede}>
            {editMode
              ? 'Update where customers leave their reviews.'
              : 'Just a few details and you\'ll have a QR code ready to share.'}
          </Text>

        <Text style={styles.label}>Business Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Cafe Riven"
          placeholderTextColor={colors.muted}
          value={businessName}
          onChangeText={setBusinessName}
        />

        <Text style={styles.hint}>Add at least one of the following:</Text>

        <Text style={styles.label}>Google Review URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://g.page/r/..."
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          value={googleReviewUrl}
          onChangeText={setGoogleReviewUrl}
        />
        <Text style={styles.helper}>
          Find this in your Google Business dashboard under "Get more reviews".
        </Text>

        <Text style={styles.label}>Facebook Page URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://facebook.com/yourpage"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          value={facebookPageUrl}
          onChangeText={setFacebookPageUrl}
        />

        <View style={{ height: 24 }} />
        <GradientButton
          title={editMode ? 'Save Changes' : 'Save & Generate QR'}
          onPress={save}
          loading={loading}
        />
          {!editMode && (
            <Text style={styles.footer}>You can edit this anytime in Settings.</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: 24 },
  brandRow: { marginBottom: 20 },
  header: { fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  lede: { fontSize: 14, color: colors.muted, marginTop: 4, marginBottom: 24, lineHeight: 20 },
  hint: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  helper: { fontSize: 12, color: colors.muted, marginBottom: 16 },
  footer: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 16 },
});
