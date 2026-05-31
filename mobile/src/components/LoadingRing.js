import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

/**
 * A clean, branded loading ring — a 30% arc that rotates smoothly.
 * Way nicer than React Native's default ActivityIndicator.
 *
 * Props:
 *   size  — diameter in pixels (default 36)
 *   color — stroke color (default white)
 *   width — stroke thickness (default 3)
 */
export default function LoadingRing({ size = 36, color = '#FFFFFF', width = 3 }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = (size - width) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.3; // 30% of the ring visible

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${arcLength} ${circumference}`}
        />
      </Svg>
    </Animated.View>
  );
}
