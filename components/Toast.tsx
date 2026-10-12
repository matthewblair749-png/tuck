import { useEffect, useRef } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { durations, timings } from '@/design/motion';
import { useTheme } from '@/design/theme';
import { layout, radii, space } from '@/design/tokens';

import { Text } from './Text';

interface ToastMessage {
  id: number;
  text: string;
}

interface ToastState {
  /** The latest message. Kept after hiding so the pill can fade out with its words. */
  current: ToastMessage | null;
  /** Id of the message currently on screen, or null when hidden. */
  showing: number | null;
  show: (text: string) => void;
  clear: (id: number) => void;
}

let nextId = 1;

const useToastStore = create<ToastState>((set) => ({
  current: null,
  showing: null,
  show: (text) => {
    const id = nextId++;
    set({ current: { id, text }, showing: id });
  },
  clear: (id) => set((s) => (s.showing === id ? { showing: null } : s)),
}));

/** Show a short, reassuring note at the top of the screen. */
export const toast = {
  show: (text: string) => useToastStore.getState().show(text),
};

const travel = space.md;

/**
 * Small pill near the top. Slides down and fades in, waits, then leaves the
 * same way. Never intercepts touches. Screen readers hear it announced.
 */
export function ToastHost() {
  const { colors, elevation } = useTheme();
  const insets = useSafeAreaInsets();
  const current = useToastStore((s) => s.current);
  const showing = useToastStore((s) => s.showing);
  const clear = useToastStore((s) => s.clear);
  const progress = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!current || showing !== current.id) return;
    AccessibilityInfo.announceForAccessibility(current.text);
    progress.set(0);
    progress.set(withTiming(1, timings.emphasized));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      progress.set(withTiming(0, timings.standard));
      timer.current = setTimeout(() => clear(current.id), durations.standard);
    }, durations.toast);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [current, showing, progress, clear]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: -travel * (1 - progress.value) }],
  }));

  return (
    <View pointerEvents="none" style={[styles.host, { top: insets.top + space.xs }]}>
      <Animated.View
        style={[
          styles.pill,
          elevation,
          { backgroundColor: colors.surface, borderColor: colors.hairline },
          style,
        ]}
      >
        <Text variant="caption" color="ink" numberOfLines={2} align="center">
          {current?.text ?? ''}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    alignItems: 'center',
  },
  pill: {
    borderRadius: radii.chip,
    borderWidth: layout.hairline,
    paddingHorizontal: space.md,
    paddingVertical: space.xs + space.xxs,
    maxWidth: layout.maxContentWidth,
  },
});
