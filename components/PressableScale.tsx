import { forwardRef, type ReactNode } from 'react';
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { haptics } from '@/design/haptics';
import { press, timings } from '@/design/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed. Defaults to the shared press scale (0.98). */
  pressedScale?: number;
  /** Fire a light haptic on press. */
  haptic?: boolean;
}

/**
 * Base tappable surface: scales to 0.98 over 120ms with the standard ease,
 * optional light haptic. Everything tappable in Tuck builds on this.
 */
export const PressableScale = forwardRef<View, PressableScaleProps>(function PressableScale(
  {
    children,
    style,
    pressedScale = press.scale,
    haptic = false,
    onPressIn,
    onPressOut,
    onPress,
    disabled,
    ...rest
  },
  ref,
) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = (e: GestureResponderEvent) => {
    scale.set(withTiming(pressedScale, timings.micro));
    onPressIn?.(e);
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    scale.set(withTiming(1, timings.micro));
    onPressOut?.(e);
  };
  const handlePress = (e: GestureResponderEvent) => {
    if (haptic) haptics.tap();
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      ref={ref}
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[style, animated]}
    >
      {children}
    </AnimatedPressable>
  );
});
