import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function SecondaryButton({ title, onPress, style, textStyle }) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, style]}>
      <Text style={[styles.label, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
