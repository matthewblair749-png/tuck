import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { haptics } from '@/design/haptics';
import { springs } from '@/design/motion';
import { useTheme } from '@/design/theme';
import { layout } from '@/design/tokens';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Spoken label. Toggles always sit beside visible text; pass the same words. */
  accessibilityLabel: string;
  disabled?: boolean;
}

const inset = 3;
const thumb = layout.toggleHeight - inset * 2;
const travel = layout.toggleWidth - thumb - inset * 2;

export function Toggle({ value, onValueChange, accessibilityLabel, disabled = false }: ToggleProps) {
  const { colors, elevation, scheme } = useTheme();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.set(withSpring(value ? 1 : 0, springs.standard));
  }, [value, progress]);

  const offTrack = colors.bgSunken;
  const onTrack = colors.sage500;
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [offTrack, onTrack]),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * travel }],
  }));

  return (
    <Pressable
      onPress={() => {
        haptics.toggle(!value);
        onValueChange(!value);
      }}
      disabled={disabled}
      hitSlop={(layout.hitTarget - layout.toggleHeight) / 2}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      style={disabled ? styles.disabled : null}
    >
      <Animated.View style={[styles.track, { borderColor: colors.grabber }, trackStyle]}>
        <Animated.View
          style={[
            styles.thumb,
            elevation,
            { backgroundColor: scheme === 'dark' ? colors.ink : colors.surface },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: layout.toggleWidth,
    height: layout.toggleHeight,
    borderRadius: layout.toggleHeight / 2,
    borderWidth: layout.hairline,
    padding: inset - layout.hairline,
    justifyContent: 'center',
  },
  thumb: {
    width: thumb,
    height: thumb,
    borderRadius: thumb / 2,
  },
  disabled: { opacity: 0.5 },
});
