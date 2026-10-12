import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { space } from '@/design/tokens';

import { Button } from './Button';
import { Text } from './Text';

export interface EmptyStateProps {
  illustration: ReactNode;
  title: string;
  body?: string;
  /** The one gentle next step every empty state offers. */
  action: { label: string; onPress: () => void; hint?: string };
}

export function EmptyState({ illustration, title, body, action }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      {illustration}
      <View style={styles.words}>
        <Text variant="title" align="center" accessibilityRole="header">
          {title}
        </Text>
        {body ? (
          <Text variant="body" color="inkSoft" align="center">
            {body}
          </Text>
        ) : null}
      </View>
      <Button
        variant="secondary"
        label={action.label}
        onPress={action.onPress}
        accessibilityHint={action.hint}
        style={styles.action}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Fill the space under the header and sit in its optical center (slightly high).
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: space.huge, gap: space.xl },
  words: { gap: space.xs, alignItems: 'center', paddingHorizontal: space.md },
  action: { alignSelf: 'center' },
});
