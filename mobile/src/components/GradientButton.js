import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradient, colors } from '../theme';

export default function GradientButton({ title, onPress, loading, style }) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={[styles.wrap, style]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btn}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.label}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', borderRadius: 12, overflow: 'hidden' },
  btn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
