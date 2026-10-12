import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Frost } from '@/components/Blur';
import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/Text';
import { VoiceOrb } from '@/components/VoiceOrb';
import { icons } from '@/design/icons';
import { useTheme } from '@/design/theme';
import { layout, space } from '@/design/tokens';

/**
 * Talk: the voice flow, presented over a dimmed, blurred Today/Week.
 * Stage 1 builds the frame (backdrop, orb, prompt, dismissal). Hold-to-talk,
 * live transcript and the review sheet arrive with the voice service.
 */
export default function TalkScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const Close = icons.close;

  return (
    <View style={styles.fill} accessibilityViewIsModal>
      <Frost intensity={60} wash={colors.veil} style={StyleSheet.absoluteFill} />
      <View style={[styles.top, { paddingTop: insets.top + space.xs }]}>
        <PressableScale
          onPress={() => router.back()}
          haptic
          hitSlop={space.xs}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={[styles.close, { backgroundColor: colors.surface, borderColor: colors.hairline }]}
        >
          <Close size={layout.iconSizeSmall} color={colors.ink} />
        </PressableScale>
      </View>
      <View style={styles.center}>
        <VoiceOrb />
        <Text variant="caption" color="inkSoft" align="center" style={styles.prompt}>
          Tell me about your week. What’s busy, what’s needed.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  top: { alignItems: 'flex-end', paddingHorizontal: layout.screenPadding },
  close: {
    width: layout.hitTarget,
    height: layout.hitTarget,
    borderRadius: layout.hitTarget / 2,
    borderWidth: layout.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxl,
    paddingHorizontal: space.xxl,
    paddingBottom: space.huge,
  },
  prompt: { maxWidth: layout.promptWidth },
});
