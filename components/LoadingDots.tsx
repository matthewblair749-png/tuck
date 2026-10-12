import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { durations, easingInOut } from '@/design/motion';
import { useTheme } from '@/design/theme';
import { layout, space } from '@/design/tokens';

/** Three soft dots that breathe in turn. Used inside buttons while busy. */
export function LoadingDots({ color }: { color: string }) {
  const { reduceMotion } = useTheme();
  const a = useSharedValue(0.35);
  const b = useSharedValue(0.35);
  const c = useSharedValue(0.35);

  useEffect(() => {
    if (reduceMotion) {
      a.set(0.7);
      b.set(0.7);
      c.set(0.7);
      return;
    }
    const pulse = (delay: number) =>
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: durations.emphasized, easing: easingInOut }),
            withTiming(0.35, { duration: durations.emphasized, easing: easingInOut }),
          ),
          -1,
        ),
      );
    a.set(pulse(0));
    b.set(pulse(durations.micro));
    c.set(pulse(durations.micro * 2));
  }, [a, b, c, reduceMotion]);

  return (
    <View style={styles.row} aria-hidden>
      <Dot value={a} color={color} />
      <Dot value={b} color={color} />
      <Dot value={c} color={color} />
    </View>
  );
}

function Dot({ value, color }: { value: SharedValue<number>; color: string }) {
  const style = useAnimatedStyle(() => ({ opacity: value.value }));
  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.xs, alignItems: 'center' },
  dot: { width: layout.dot, height: layout.dot, borderRadius: layout.dot / 2 },
});
