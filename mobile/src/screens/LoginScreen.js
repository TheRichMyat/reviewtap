import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput, Alert,
  KeyboardAvoidingView, Platform, ScrollView, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { gradient, colors } from '../theme';
import GradientButton from '../components/GradientButton';
import SecondaryButton from '../components/SecondaryButton';
import { GOOGLE_OAUTH } from '../googleAuth';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('choose');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_OAUTH.webClientId,
    iosClientId: GOOGLE_OAUTH.iosClientId,
    androidClientId: GOOGLE_OAUTH.androidClientId,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.params?.id_token;
      if (idToken) {
        finishGoogleSignIn(idToken);
      }
    } else if (response?.type === 'error') {
      Alert.alert('Google sign-in failed', response.error?.message || 'Unknown error');
    }
  }, [response]);

  async function finishGoogleSignIn(idToken) {
    setLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      await routeAfterAuth(result.user);
    } catch (err) {
      Alert.alert('Sign-in failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function routeAfterAuth(user) {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        createdAt: serverTimestamp(),
      });
    }
    const hasBusiness = snap.exists() && snap.data().businessId;
    navigation.replace(hasBusiness ? 'Main' : 'BusinessSetup');
  }

  async function handleEmailAuth() {
    if (!email || !password) {
      Alert.alert('Missing info', 'Enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const cred = isSignUp
        ? await createUserWithEmailAndPassword(auth, email.trim(), password)
        : await signInWithEmailAndPassword(auth, email.trim(), password);
      await routeAfterAuth(cred.user);
    } catch (err) {
      Alert.alert('Sign-in failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!GOOGLE_OAUTH.webClientId || GOOGLE_OAUTH.webClientId.startsWith('YOUR_')) {
      Alert.alert(
        'Google Sign-In setup needed',
        'Add your Google OAuth client IDs in src/googleAuth.js. See README → "Enable Google Sign-In".',
      );
      return;
    }
    await promptAsync();
  }

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Welcome to ReviewTap</Text>
          <Text style={styles.subtitle}>Turn customers into reviews.</Text>

          {mode === 'choose' && (
            <View style={styles.actions}>
              <GradientButton
                title="Sign in with Google"
                onPress={handleGoogle}
              />

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <SecondaryButton
                title="Continue with email"
                onPress={() => setMode('email')}
              />
            </View>
          )}

          {mode === 'email' && (
            <View style={styles.actions}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <View style={styles.passwordWrap}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
              <GradientButton
                title={isSignUp ? 'Create Account' : 'Sign In'}
                onPress={handleEmailAuth}
                loading={loading}
              />
              <Pressable onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 16 }}>
                <Text style={styles.linkLight}>
                  {isSignUp ? 'Already have an account? Sign in' : 'Create account'}
                </Text>
              </Pressable>
            </View>
          )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 96, height: 96, borderRadius: 16, marginBottom: 24 },
  title: { color: colors.white, fontSize: 24, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 6, marginBottom: 32 },
  actions: { width: '100%', maxWidth: 360 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    marginBottom: 12,
    color: colors.text,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    height: 52,
    paddingRight: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    height: '100%',
    fontSize: 16,
    color: colors.text,
  },
  eyeBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLight: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
