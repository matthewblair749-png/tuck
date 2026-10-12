import { StyleSheet, View } from 'react-native';

import { categoryIcons } from '@/design/icons';
import { useTheme } from '@/design/theme';
import { layout, type Category } from '@/design/tokens';

/**
 * 36px circle in the category tint with the category icon in its darker
 * shade. Color is never the only signal: the glyph always names the kind.
 */
export function CategoryIcon({
  category,
  size = layout.categoryCircle,
}: {
  category: Category;
  size?: number;
}) {
  const { colors } = useTheme();
  const c = colors.category[category];
  const Glyph = categoryIcons[category];
  return (
    <View
      style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: c.tint }]}
      aria-hidden
    >
      <Glyph size={size * (layout.iconSizeSmall / layout.categoryCircle)} color={c.ink} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
