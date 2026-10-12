import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type DimensionValue, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { durations, easingInOut } from '@/design/motion';
import { useTheme } from '@/design/theme';
import { radii } from '@/design/tokens';

export interface SkeletonProps {
  width?: DimensionValue;
  height: number;
  radius?: number;
}

/** Soft shimmer on bgSunken. Used instead of spinners on main screens. */
export function Skeleton({ width = '100%', height, radius = radii.inner }: SkeletonProps) {
  const { colors, reduceMotion } = useTheme();
  const [w, setW] = useState(0);
  const x = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion || w === 0) return;
    x.set(0);
    x.set(withRepeat(withTiming(1, { duration: durations.shimmer, easing: easingInOut }), -1));
  }, [w, reduceMotion, x]);

  const sweep = useAnimatedStyle(() => ({
    transform: [{ translateX: -w + x.value * w * 2 }],
  }));

  return (
    <View
      aria-hidden
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      style={[styles.base, { width, height, borderRadius: radius, backgroundColor: colors.bgSunken }]}
    >
      {!reduceMotion && w > 0 ? (
        <Animated.View style={[StyleSheet.absoluteFill, sweep]}>
          <LinearGradient
            colors={['transparent', colors.shimmer, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});
