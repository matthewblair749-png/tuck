import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { haptics } from '@/design/haptics';
import { springs } from '@/design/motion';
import { useTheme } from '@/design/theme';
import { layout, radii, space } from '@/design/tokens';

import { Text } from './Text';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
}

const pad = space.xxs;

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const { colors, elevation } = useTheme();
  const [width, setWidth] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const segment = options.length > 0 ? (width - pad * 2) / options.length : 0;
  const x = useSharedValue(0);
  const ready = useSharedValue(0);

  useEffect(() => {
    if (segment <= 0) return;
    if (ready.get() === 0) {
      x.set(index * segment);
      ready.set(1);
    } else {
      x.set(withSpring(index * segment, springs.standard));
    }
  }, [index, segment, x, ready]);

  const thumbStyle = useAnimatedStyle(() => ({
    opacity: ready.value,
    transform: [{ translateX: x.value }],
  }));

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.track, { backgroundColor: colors.bgSunken, borderColor: colors.hairline }]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.thumb,
          elevation,
          { width: segment, backgroundColor: colors.surface, borderColor: colors.hairline },
          thumbStyle,
        ]}
      />
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              if (selected) return;
              haptics.selection();
              onChange(option.value);
            }}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            style={styles.segment}
          >
            <Text variant="caption" color={selected ? 'ink' : 'inkSoft'} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    minHeight: layout.hitTarget,
    borderRadius: radii.chip,
    borderWidth: layout.hairline,
    padding: pad - layout.hairline,
  },
  thumb: {
    position: 'absolute',
    top: pad - layout.hairline,
    bottom: pad - layout.hairline,
    left: pad - layout.hairline,
    borderRadius: radii.chip,
    borderWidth: layout.hairline,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
});
