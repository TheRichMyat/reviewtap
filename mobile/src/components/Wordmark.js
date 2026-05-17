import React from 'react';
import { useFonts, ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import GradientText from './GradientText';

export default function Wordmark({ text = 'RT.', size = 22, style }) {
  const [fontsLoaded] = useFonts({ ArchivoBlack_400Regular });
  if (!fontsLoaded) return null;
  return (
    <GradientText
      style={[
        {
          fontFamily: 'ArchivoBlack_400Regular',
          fontSize: size,
          letterSpacing: -0.3,
        },
        style,
      ]}
    >
      {text}
    </GradientText>
  );
}
