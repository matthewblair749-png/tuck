import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '@/design/theme';
import { layout, radii } from '@/design/tokens';

export interface CardProps extends ViewProps {
  children: ReactNode;
  /** Compact cards use 16 inner padding instead of 20. */
  compact?: boolean;
  /** Remove inner padding, for cards that lay out their own rows. */
  flush?: boolean;
  tone?: 'surface' | 'tint';
  style?: StyleProp<ViewStyle>;
}

/**
 * Paper-like surface: 24 radius, hairline border, soft shadow in light mode,
 * a slightly lifted surface and hairline only in dark mode.
 */
export function Card({ children, compact, flush, tone = 'surface', style, ...rest }: CardProps) {
  const { colors, elevation } = useTheme();
  return (
    <View
      {...rest}
      style={[
        styles.card,
        elevation,
        {
          backgroundColor: tone === 'tint' ? colors.surfaceTint : colors.surface,
          borderColor: colors.hairline,
          padding: flush ? 0 : compact ? layout.cardPaddingCompact : layout.cardPadding,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    borderWidth: layout.hairline,
    borderCurve: 'continuous',
  },
});
