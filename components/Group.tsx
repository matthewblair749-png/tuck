import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/design/theme';
import { layout, space } from '@/design/tokens';

import { Card } from './Card';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

/** A titled card of rows, used on settings-style screens. */
export function Group({ title, children, footer }: { title: string; children: ReactNode; footer?: string }) {
  const { colors } = useTheme();
  const rows = Children.toArray(children);
  return (
    <View style={styles.group}>
      <Text variant="overline" color="inkSoft" accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Card flush>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 ? <View style={[styles.divider, { backgroundColor: colors.hairline }]} /> : null}
            {row}
          </Fragment>
        ))}
      </Card>
      {footer ? (
        <Text variant="caption" color="inkSoft" style={styles.footer}>
          {footer}
        </Text>
      ) : null}
    </View>
  );
}

export interface RowProps {
  label: string;
  detail?: string;
  /** A control on the right (Toggle, value text). */
  trailing?: ReactNode;
  /** Content under the label, e.g. a SegmentedControl that needs full width. */
  below?: ReactNode;
  onPress?: () => void;
  accessibilityHint?: string;
}

export function Row({ label, detail, trailing, below, onPress, accessibilityHint }: RowProps) {
  const content = (
    <View style={styles.row}>
      <View style={styles.line}>
        <View style={styles.words}>
          <Text variant="bodyStrong">{label}</Text>
          {detail ? (
            <Text variant="caption" color="inkSoft">
              {detail}
            </Text>
          ) : null}
        </View>
        {trailing}
      </View>
      {below}
    </View>
  );
  if (!onPress) return content;
  return (
    <PressableScale
      onPress={onPress}
      haptic
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
    >
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  group: { gap: space.xs },
  title: { marginLeft: space.xxs },
  footer: { marginHorizontal: space.xxs },
  divider: { height: layout.hairline, marginLeft: layout.hairlineInset },
  row: {
    minHeight: layout.fieldHeight,
    paddingHorizontal: layout.cardPadding,
    paddingVertical: space.sm,
    justifyContent: 'center',
    gap: space.sm,
  },
  line: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  words: { flex: 1 },
});
