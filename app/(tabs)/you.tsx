import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Group, Row } from '@/components/Group';
import { Screen } from '@/components/Screen';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Text } from '@/components/Text';
import { icons } from '@/design/icons';
import { useAppearanceStore, useTheme, type AppearancePreference } from '@/design/theme';
import { layout, space } from '@/design/tokens';

const appearanceOptions = [
  { value: 'system', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const satisfies readonly { value: AppearancePreference; label: string }[];

export default function YouScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const preference = useAppearanceStore((s) => s.preference);
  const setPreference = useAppearanceStore((s) => s.setPreference);
  const version = Constants.expoConfig?.version ?? '';
  const Chevron = icons.chevron;

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="displayL" accessibilityRole="header">
          You
        </Text>
      </View>
      <View style={styles.groups}>
        <Group title="Preferences">
          <Row
            label="Appearance"
            below={
              <SegmentedControl
                accessibilityLabel="Appearance"
                options={appearanceOptions}
                value={preference}
                onChange={setPreference}
              />
            }
          />
        </Group>
        {__DEV__ ? (
          <Group title="Design review" footer="Only visible in development builds.">
            <Row
              label="Component gallery"
              detail="Every base component, in this theme."
              onPress={() => router.push('/dev/gallery')}
              trailing={<Chevron size={layout.iconSizeSmall} color={colors.inkSoft} />}
            />
          </Group>
        ) : null}
      </View>
      <Text variant="caption" color="inkSoft" align="center" style={styles.version}>
        Tuck {version}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: space.xl },
  groups: { gap: space.xl },
  version: { marginTop: space.xxl },
});
