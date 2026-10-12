import { Tabs } from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';

import { AppBlurTarget } from '@/components/Blur';
import { TabBar } from '@/components/TabBar';
import { useTheme } from '@/design/theme';

/**
 * Tab screens live inside the shared blur target; the floating tab bar is
 * drawn as its sibling so it can blur them on Android as well as iOS.
 */
export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <View style={[styles.fill, { backgroundColor: colors.bg }]}>
      <AppBlurTarget>
        <Tabs
          tabBar={() => null}
          screenOptions={{
            headerShown: false,
            animation: 'none',
            sceneStyle: { backgroundColor: colors.bg },
          }}
        >
          <Tabs.Screen name="index" options={{ title: 'Today' }} />
          <Tabs.Screen name="week" options={{ title: 'Week' }} />
          <Tabs.Screen name="groceries" options={{ title: 'Groceries' }} />
          <Tabs.Screen name="you" options={{ title: 'You' }} />
        </Tabs>
      </AppBlurTarget>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
