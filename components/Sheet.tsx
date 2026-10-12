import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  BackHandler,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  ReduceMotion,
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { springs, timings } from '@/design/motion';
import { useTheme } from '@/design/theme';
import { layout, radii, space } from '@/design/tokens';

import { Frost } from './Blur';
import { Portal } from './Portal';
import { Text } from './Text';

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  /**
   * Snap points as fractions of the screen height, e.g. [0.5, 0.9]. The sheet
   * opens at the first one. Omit to size the sheet to its content.
   */
  snapPoints?: readonly number[];
  accessibilityLabel?: string;
}

/** Above the top snap, drags are resisted to a fifth of the finger travel. */
const overdrag = 0.2;
/** Fling projection, in seconds of current velocity. */
const projection = 0.12;

export function Sheet(props: SheetProps) {
  const [mounted, setMounted] = useState(props.visible);
  // Mount as soon as the sheet is asked to show; unmount only after it has
  // animated away (SheetBody calls onHidden).
  if (props.visible && !mounted) setMounted(true);
  if (!mounted) return null;
  return (
    <Portal>
      <SheetBody {...props} onHidden={() => setMounted(false)} />
    </Portal>
  );
}

function SheetBody({
  visible,
  onClose,
  children,
  title,
  snapPoints,
  accessibilityLabel,
  onHidden,
}: SheetProps & { onHidden: () => void }) {
  const { colors, reduceMotion } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();
  const keyboard = useAnimatedKeyboard();
  const [contentH, setContentH] = useState(0);

  const maxH = screenH - insets.top - space.xl;
  const sheetH = snapPoints?.length
    ? Math.min(maxH, Math.max(...snapPoints) * screenH)
    : Math.min(maxH, contentH);
  const snaps = (snapPoints?.length ? [...snapPoints].sort((a, b) => a - b) : [1]).map((f) =>
    snapPoints?.length ? Math.max(0, sheetH - f * screenH) : 0,
  );
  const openY = snaps[0] ?? 0;
  const closedY = sheetH + insets.bottom + space.xl;
  const measured = sheetH > 0;

  const y = useSharedValue(screenH);
  const fade = useSharedValue(0);
  const start = useSharedValue(0);

  const hide = useCallback(() => onHidden(), [onHidden]);

  useEffect(() => {
    if (!measured) return;
    if (visible) {
      if (reduceMotion) {
        y.set(openY);
        fade.set(withTiming(1, { ...timings.standard, reduceMotion: ReduceMotion.Never }));
      } else {
        fade.set(1);
        y.set(withSpring(openY, springs.gentle));
      }
    } else {
      const done = (finished?: boolean) => {
        'worklet';
        if (finished) runOnJS(hide)();
      };
      if (reduceMotion) {
        fade.set(withTiming(0, { ...timings.standard, reduceMotion: ReduceMotion.Never }, done));
      } else {
        y.set(withTiming(closedY, timings.standard, done));
      }
    }
  }, [visible, measured, openY, closedY, reduceMotion, y, fade, hide]);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  const pan = Gesture.Pan()
    .activeOffsetY([-space.xs, space.xs])
    .onStart(() => {
      start.set(y.get());
    })
    .onUpdate((e) => {
      const next = start.value + e.translationY;
      const top = snaps[snaps.length - 1] ?? 0;
      y.set(next < top ? top - (top - next) * overdrag : next);
    })
    .onEnd((e) => {
      const target = y.value + e.velocityY * projection;
      const candidates = [...snaps, closedY];
      let best = candidates[0] ?? 0;
      for (const c of candidates) if (Math.abs(c - target) < Math.abs(best - target)) best = c;
      if (best === closedY) {
        runOnJS(onClose)();
      } else {
        y.set(withSpring(best, { ...springs.gentle, velocity: e.velocityY }));
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: y.value - keyboard.height.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: fade.value * interpolate(y.value, [closedY, snaps[0] ?? 0], [0, 1], Extrapolation.CLAMP),
  }));

  const onContentLayout = (e: LayoutChangeEvent) => {
    if (!snapPoints?.length) setContentH(e.nativeEvent.layout.height);
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Frost intensity={20} wash={colors.scrim} style={StyleSheet.absoluteFill} />
        </Pressable>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel ?? title}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderColor: colors.hairline,
              height: snapPoints?.length ? sheetH + insets.bottom : undefined,
              maxHeight: maxH + insets.bottom,
            },
            sheetStyle,
          ]}
        >
          <View onLayout={onContentLayout} style={{ paddingBottom: insets.bottom + space.lg }}>
            <View style={styles.grabberZone}>
              <View style={[styles.grabber, { backgroundColor: colors.grabber }]} />
            </View>
            {title ? (
              <Text variant="title" accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
            ) : null}
            <View style={styles.content}>{children}</View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    borderWidth: layout.hairline,
    borderBottomWidth: 0,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  grabberZone: { alignItems: 'center', paddingTop: space.xs + space.xxs, paddingBottom: space.md },
  grabber: {
    width: layout.grabberWidth,
    height: layout.grabberHeight,
    borderRadius: layout.grabberHeight / 2,
  },
  title: { paddingHorizontal: layout.screenPadding, marginBottom: space.md },
  content: { paddingHorizontal: layout.screenPadding },
});
