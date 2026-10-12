import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { SteamingBowl } from '@/design/illustrations';
import { space } from '@/design/tokens';

export default function GroceriesScreen() {
  const router = useRouter();
  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="displayL" accessibilityRole="header">
          Groceries
        </Text>
      </View>
      <EmptyState
        illustration={<SteamingBowl />}
        title="Your list is empty."
        body="Once this week’s meals are planned, everything you need lands here, sorted by aisle."
        action={{
          label: 'Plan this week’s meals',
          onPress: () => router.push('/talk'),
          hint: 'Opens voice planning.',
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: space.xl },
});
