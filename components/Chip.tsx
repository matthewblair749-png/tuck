import { StyleSheet, View } from 'react-native';

import { categoryIcons, icons } from '@/design/icons';
import { useTheme } from '@/design/theme';
import { layout, radii, space, type Category } from '@/design/tokens';

import { PressableScale } from './PressableScale';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  /** Tint the chip with a category color. The category icon always shows too. */
  category?: Category;
  onPress?: () => void;
  /** Shows a small remove control. */
  onRemove?: () => void;
  accessibilityHint?: string;
}

export function Chip({ label, selected = false, category, onPress, onRemove, accessibilityHint }: ChipProps) {
  const { colors } = useTheme();
  const cat = category ? colors.category[category] : null;
  const CategoryIcon = category ? categoryIcons[category] : null;
  const CloseIcon = icons.close;
  const CheckIcon = icons.check;

  const backgroundColor = cat ? cat.tint : selected ? colors.sage100 : colors.surfaceTint;
  const borderColor = selected && !cat ? colors.sage500 : colors.hairline;
  const textColor = selected && !cat ? 'sage700' : 'ink';
  const iconColor = cat ? cat.ink : colors.sage700;

  const body = (
    <View style={[styles.chip, { backgroundColor, borderColor }]}>
      {CategoryIcon ? <CategoryIcon size={layout.iconSizeTiny} color={iconColor} weight="regular" /> : null}
      {selected && !cat ? <CheckIcon size={layout.iconSizeTiny} color={iconColor} weight="bold" /> : null}
      <Text variant="caption" color={textColor} numberOfLines={1}>
        {label}
      </Text>
      {onRemove ? (
        <PressableScale
          onPress={onRemove}
          hitSlop={space.sm}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          style={styles.remove}
        >
          <CloseIcon size={layout.iconSizeTiny} color={colors.inkSoft} />
        </PressableScale>
      ) : null}
    </View>
  );

  if (!onPress) return body;

  return (
    <PressableScale
      onPress={onPress}
      haptic
      hitSlop={(layout.hitTarget - layout.chipHeight) / 2}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected }}
    >
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: layout.chipHeight,
    borderRadius: radii.chip,
    borderWidth: layout.hairline,
    paddingHorizontal: space.sm + space.xxs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    alignSelf: 'flex-start',
  },
  remove: { marginLeft: space.xxs, marginRight: -space.xxs },
});
