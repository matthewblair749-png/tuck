import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Chip } from '@/components/Chip';
import { Group, Row } from '@/components/Group';
import { Screen } from '@/components/Screen';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Sheet } from '@/components/Sheet';
import { Skeleton } from '@/components/Skeleton';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { toast } from '@/components/Toast';
import { Toggle } from '@/components/Toggle';
import { VoiceOrb } from '@/components/VoiceOrb';
import { icons } from '@/design/icons';
import { FoldedBlanket, SleepingSun, SteamingBowl } from '@/design/illustrations';
import { durations } from '@/design/motion';
import { categories, layout, space } from '@/design/tokens';

/**
 * Development-only gallery of every base component, for design review in
 * both themes. Release builds redirect away from this route.
 */
export default function Gallery() {
  if (!__DEV__) return <Redirect href="/" />;
  return <GalleryBody />;
}

function GalleryBody() {
  const router = useRouter();
  const [toggle, setToggle] = useState(true);
  const [segment, setSegment] = useState<'loose' | 'balanced' | 'strict'>('balanced');
  const [name, setName] = useState('');
  const [sheet, setSheet] = useState(false);
  const [listening, setListening] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Vegetarian']);
  const level = useSharedValue(0);

  // Dev-only: drive the orb's level so its listening state can be reviewed
  // without a microphone. The real level comes from the voice service.
  useEffect(() => {
    level.set(
      listening
        ? withRepeat(
            withSequence(
              withTiming(0.8, { duration: durations.standard }),
              withTiming(0.2, { duration: durations.emphasized }),
            ),
            -1,
          )
        : withTiming(0, { duration: durations.standard }),
    );
  }, [listening, level]);

  const toggleChip = (label: string) =>
    setSelected((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));

  return (
    <Screen tabBar={false}>
      <View style={styles.stack}>
        <Button variant="ghost" label="Back" onPress={() => router.back()} />
        <Text variant="displayXL">Say your week. Tuck it in.</Text>
        <Text variant="displayL">Components</Text>
        <Text variant="title">Thursday’s covered.</Text>
        <Text variant="heading">Heading, DM Sans 600</Text>
        <Text variant="body">Body copy sits at 16 on 24. Calm, readable, warm.</Text>
        <Text variant="bodyStrong">Body strong for emphasis.</Text>
        <Text variant="caption" color="inkSoft" tabular>
          Caption · 6:30 – 7:15 pm
        </Text>
        <Text variant="overline" color="inkSoft">
          Overline label
        </Text>

        <Group title="Buttons">
          <Row
            label="Variants"
            below={
              <View style={styles.stackSm}>
                <Button label="Plan my week" onPress={() => toast.show('Your week is tucked in.')} />
                <Button label="Plan my week" onPress={() => undefined} disabled />
                <Button label="Planning" onPress={() => undefined} loading />
                <Button
                  variant="secondary"
                  label="Re-plan this week"
                  icon={icons.refresh}
                  onPress={() => undefined}
                />
                <Button variant="ghost" label="Swap" onPress={() => undefined} />
              </View>
            }
          />
        </Group>

        <Group title="Controls">
          <Row
            label="Morning card"
            detail="A gentle note at 7:30."
            trailing={<Toggle value={toggle} onValueChange={setToggle} accessibilityLabel="Morning card" />}
          />
          <Row
            label="Disabled"
            trailing={
              <Toggle value={false} onValueChange={() => undefined} accessibilityLabel="Disabled" disabled />
            }
          />
          <Row
            label="Planning tone"
            below={
              <SegmentedControl
                accessibilityLabel="Planning tone"
                value={segment}
                onChange={setSegment}
                options={[
                  { value: 'loose', label: 'Loose' },
                  { value: 'balanced', label: 'Balanced' },
                  { value: 'strict', label: 'Strict' },
                ]}
              />
            }
          />
        </Group>

        <TextField label="Your name" value={name} onChangeText={setName} autoCapitalize="words" />
        <TextField label="Weeknight cooking time" value="30 minutes" message="Short meals on busy nights." />
        <TextField label="Store" value="" invalid message="I couldn’t find that store. Try its street?" />

        <View style={styles.wrap}>
          {['Vegetarian', 'No mushrooms', 'Gluten free', 'Quick breakfasts'].map((l) => (
            <Chip key={l} label={l} selected={selected.includes(l)} onPress={() => toggleChip(l)} />
          ))}
          <Chip label="Laundry" category="laundry" onRemove={() => undefined} />
          <Chip label="Pasta night" category="meal" />
          <Chip label="Pharmacy" category="errand" />
          <Chip label="Vacuum" category="chore" />
        </View>

        <Card>
          <View style={styles.rowCenter}>
            {categories.map((c) => (
              <CategoryIcon key={c} category={c} />
            ))}
          </View>
        </Card>

        <Card style={styles.stackSm}>
          <Skeleton height={20} width="60%" />
          <Skeleton height={14} width="40%" />
          <Skeleton height={56} radius={16} />
        </Card>

        <Card style={styles.orbCard}>
          <VoiceOrb listening={listening} level={level} />
          <Button
            variant="secondary"
            label={listening ? 'Release' : 'Simulate listening'}
            onPress={() => setListening((v) => !v)}
            block={false}
          />
        </Card>

        <View style={styles.rowCenter}>
          <SleepingSun width={96} />
          <SteamingBowl width={96} />
          <FoldedBlanket width={96} />
        </View>

        <Button variant="secondary" label="Open a sheet" onPress={() => setSheet(true)} />
      </View>
      <Sheet visible={sheet} onClose={() => setSheet(false)} title="Move laundry">
        <View style={styles.stackSm}>
          <Text variant="body" color="inkSoft">
            Pick a new evening. Everything else stays where it is.
          </Text>
          <Button
            label="Tuesday evening"
            onPress={() => {
              setSheet(false);
              toast.show('Moved laundry to Tuesday evening.');
            }}
          />
          <Button variant="ghost" label="Never mind" onPress={() => setSheet(false)} block />
        </View>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space.xl },
  stackSm: { gap: space.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  rowCenter: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  orbCard: { alignItems: 'center', gap: space.xl, paddingVertical: layout.orbSize / 4 },
});
