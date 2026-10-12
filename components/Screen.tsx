import { useFocusEffect } from 'expo-router';
import { useCallback, type ReactElement, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type RefreshControlProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { screenDrift, timings } from '@/design/motion';
import { useTheme } from '@/design/theme';
import { layout, space } from '@/design/tokens';

export interface ScreenProps {
  children: ReactNode;
  /** Leave room for the floating tab bar. True for tab screens. */
  tabBar?: boolean;
  refreshControl?: ReactElement<RefreshControlProps>;
  scroll?: boolean;
}

/** Height reserved under content so the floating tab bar never covers it. */
export function useTabBarClearance() {
  const insets = useSafeAreaInsets();
  return layout.tabBarHeight + Math.max(insets.bottom, space.md) + space.xl;
}

/**
 * Screen frame: cream background, safe areas, 20pt gutters, readable max
 * width, and the shared enter motion (fade with an 8px upward drift) each
 * time the screen gains focus. Reduce Motion keeps the fade, drops the drift.
 */
export function Screen({ children, tabBar = true, refreshControl, scroll = true }: ScreenProps) {
  const { colors, reduceMotion } = useTheme();
  const insets = useSafeAreaInsets();
  const clearance = useTabBarClearance();
  const enter = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      enter.set(0);
      enter.set(withTiming(1, timings.standard));
    }, [enter]),
  );

  const enterStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: reduceMotion ? 0 : screenDrift * (1 - enter.value) }],
  }));

  const padding = {
    paddingTop: insets.top + space.xl,
    paddingBottom: tabBar ? clearance : insets.bottom + space.xl,
  };

  const body = <Animated.View style={[styles.inner, enterStyle]}>{children}</Animated.View>;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, padding]}
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, padding]}>{body}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
  content: { paddingHorizontal: layout.screenPadding, flexGrow: 1 },
  inner: { flexGrow: 1, width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
});
