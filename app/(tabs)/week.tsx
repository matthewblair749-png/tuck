import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { FoldedBlanket } from '@/design/illustrations';
import { space } from '@/design/tokens';
import { startOfWeek, weekRangeLabel } from '@/features/plan/dates';

export default function WeekScreen() {
  const router = useRouter();
  const [now, setNow] = useState(() => new Date());
  useFocusEffect(useCallback(() => setNow(new Date()), []));

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="overline" color="inkSoft">
          This week
        </Text>
        <Text variant="displayL" accessibilityRole="header">
          {weekRangeLabel(startOfWeek(now))}
        </Text>
      </View>
      <EmptyState
        illustration={<FoldedBlanket />}
        title="Your week is wide open."
        body="Say what’s coming up and I’ll tuck meals, laundry, errands and chores into the gaps."
        action={{ label: 'Plan my week', onPress: () => router.push('/talk'), hint: 'Opens voice planning.' }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: space.xs, marginBottom: space.xl },
});
