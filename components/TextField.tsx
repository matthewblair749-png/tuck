import { forwardRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TargetedEvent,
  type TextInputProps,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { timings } from '@/design/motion';
import { useTheme } from '@/design/theme';
import { layout, maxFontScale, radii, space } from '@/design/tokens';
import { type as typeScale } from '@/design/typography';

import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style' | 'placeholder'> {
  label: string;
  /** A gentle note under the field. Shown in a warmer tone when `invalid`. */
  message?: string;
  invalid?: boolean;
}

const ringWidth = 2;
const drift = space.xs;

/**
 * 56-high field with a floating overline label. Empty and unfocused, the
 * label reads as a placeholder; on focus it settles up into an overline.
 * Focus shows a 2px sage ring drawn as an overlay so nothing shifts.
 */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, message, invalid = false, value, onFocus, onBlur, editable = true, ...rest },
  ref,
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const floated = focused || (value != null && value.length > 0);

  const float = useSharedValue(floated ? 1 : 0);
  const ring = useSharedValue(0);

  useEffect(() => {
    float.set(withTiming(floated ? 1 : 0, timings.standard));
  }, [floated, float]);
  useEffect(() => {
    ring.set(withTiming(focused ? 1 : 0, timings.micro));
  }, [focused, ring]);

  const placeholderStyle = useAnimatedStyle(() => ({
    opacity: 1 - float.value,
    transform: [{ translateY: -drift * float.value }],
  }));
  const overlineStyle = useAnimatedStyle(() => ({
    opacity: float.value,
    transform: [{ translateY: drift * (1 - float.value) }],
  }));
  const ringStyle = useAnimatedStyle(() => ({ opacity: ring.value }));

  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.surface,
            borderColor: invalid ? colors.dangerText : colors.hairline,
            opacity: editable ? 1 : 0.6,
          },
        ]}
      >
        <Animated.View pointerEvents="none" style={[styles.placeholder, placeholderStyle]}>
          <Text variant="body" color="inkSoft" numberOfLines={1}>
            {label}
          </Text>
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.overline, overlineStyle]}>
          <Text variant="overline" color={focused ? 'sage700' : 'inkSoft'} numberOfLines={1}>
            {label}
          </Text>
        </Animated.View>
        <TextInput
          ref={ref}
          {...rest}
          value={value}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          accessibilityHint={message}
          maxFontSizeMultiplier={maxFontScale}
          placeholderTextColor={colors.inkFaint}
          selectionColor={colors.sage500}
          cursorColor={colors.sage600}
          style={[styles.input, typeScale.body, { color: colors.ink }]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.ring, { borderColor: invalid ? colors.dangerText : colors.sage500 }, ringStyle]}
        />
      </View>
      {message ? (
        <Text variant="caption" color={invalid ? 'dangerText' : 'inkSoft'} style={styles.message}>
          {message}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
  field: {
    minHeight: layout.fieldHeight,
    borderRadius: radii.field,
    borderWidth: layout.hairline,
    borderCurve: 'continuous',
    justifyContent: 'flex-end',
  },
  placeholder: {
    position: 'absolute',
    left: space.md,
    right: space.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  overline: {
    position: 'absolute',
    left: space.md,
    right: space.md,
    top: space.xs + space.xxs,
  },
  input: {
    paddingHorizontal: space.md,
    paddingTop: space.xl,
    paddingBottom: space.xs,
    // Keep Android from adding its own vertical padding and underline.
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  ring: {
    position: 'absolute',
    top: -ringWidth,
    left: -ringWidth,
    right: -ringWidth,
    bottom: -ringWidth,
    borderWidth: ringWidth,
    borderRadius: radii.field + ringWidth,
  },
  message: { marginTop: space.xs, marginHorizontal: space.md },
});
