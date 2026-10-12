import { BlurTargetView, BlurView } from 'expo-blur';
import { createRef, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/design/theme';

/**
 * One shared blur target holds the app's main content. On Android, blur is
 * rendered by sampling this target, so every blurred surface (tab bar,
 * sheet backdrops, the Talk screen) must live *outside* it as a sibling.
 * On iOS and web it is a plain View and blur samples whatever is behind.
 */
export const appBlurTarget = createRef<View>();

export function AppBlurTarget({ children }: { children: ReactNode }) {
  return (
    <BlurTargetView ref={appBlurTarget} style={styles.fill} collapsable={false}>
      {children}
    </BlurTargetView>
  );
}

export interface FrostProps {
  /** 0-100. */
  intensity?: number;
  /** Translucent wash laid over the blur to warm it to the palette. */
  wash: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/** A blurred, palette-washed surface. */
export function Frost({ intensity = 40, wash, style, children }: FrostProps) {
  const { scheme } = useTheme();
  return (
    <View style={[styles.clip, style]}>
      <BlurView
        blurTarget={appBlurTarget}
        blurMethod="dimezisBlurViewSdk31Plus"
        intensity={intensity}
        tint={scheme === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: wash }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  clip: { overflow: 'hidden' },
});
