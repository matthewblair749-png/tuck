import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { SleepingSun } from '@/design/illustrations';
import { space } from '@/design/tokens';
import { greeting } from '@/features/plan/dates';

export default function TodayScreen() {
  const router = useRouter();
  const [now, setNow] = useState(() => new Date());

  // Refresh the greeting whenever Today comes back into view.
  useFocusEffect(useCallback(() => setNow(new Date()), []));

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="displayL" accessibilityRole="header">
          {greeting(now)}
        </Text>
        <Text variant="body" color="inkSoft">
          Nothing on your plate yet.
        </Text>
      </View>
      <EmptyState
        illustration={<SleepingSun />}
        title="Nothing planned. Enjoy it."
        body="When you’re ready, tell me about your week and I’ll fit it around your calendar."
        action={{
          label: 'Tell me about your week',
          onPress: () => router.push('/talk'),
          hint: 'Opens voice planning.',
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: space.xs, marginBottom: space.xl },
});
