import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Icon } from '@/design/icons';
import { useTheme } from '@/design/theme';
import { layout, radii, space } from '@/design/tokens';

import { LoadingDots } from './LoadingDots';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: Icon;
  disabled?: boolean;
  /** Shows soft dots in place of the label and blocks presses. */
  loading?: boolean;
  /** Stretch to the container width. Defaults to true for primary. */
  block?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon: IconComponent,
  disabled = false,
  loading = false,
  block,
  accessibilityHint,
  style,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const inactive = disabled || loading;
  const isBlock = block ?? variant === 'primary';

  const container: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: disabled ? colors.sage100 : colors.sage600 }
      : variant === 'secondary'
        ? {
            backgroundColor: colors.surfaceTint,
            borderWidth: layout.hairline,
            borderColor: colors.hairline,
          }
        : { backgroundColor: 'transparent', minHeight: layout.hitTarget, paddingHorizontal: space.sm };

  const labelColor =
    variant === 'primary' ? (disabled ? 'sage600' : 'onAccent') : disabled ? 'inkFaint' : 'sage700';
  const iconColor =
    variant === 'primary'
      ? disabled
        ? colors.sage600
        : colors.onAccent
      : disabled
        ? colors.inkFaint
        : colors.sage700;

  return (
    <PressableScale
      testID={testID}
      onPress={onPress}
      disabled={inactive}
      haptic={variant !== 'ghost'}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      hitSlop={variant === 'ghost' ? space.xxs : undefined}
      style={[styles.base, container, isBlock ? styles.block : styles.inline, style]}
    >
      {variant === 'primary' && !disabled ? (
        // Subtle inner highlight: a 1px line of light along the top edge.
        <View pointerEvents="none" style={[styles.highlight, { borderColor: colors.highlight }]} />
      ) : null}
      {loading ? (
        <LoadingDots color={iconColor} />
      ) : (
        <View style={styles.content}>
          {IconComponent ? <IconComponent size={layout.iconSizeSmall} color={iconColor} /> : null}
          <Text variant="label" color={labelColor} numberOfLines={1}>
            {label}
          </Text>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
    overflow: 'hidden',
  },
  block: { alignSelf: 'stretch' },
  inline: { alignSelf: 'flex-start' },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.button,
    borderTopWidth: layout.hairline,
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
});
