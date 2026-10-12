import { usePathname, useRouter, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { haptics } from '@/design/haptics';
import { icons, type Icon } from '@/design/icons';
import { useTheme } from '@/design/theme';
import { layout, maxFontScaleChrome, radii, space } from '@/design/tokens';

import { Frost } from './Blur';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { VoiceOrb } from './VoiceOrb';

interface TabDef {
  href: Href;
  path: string;
  label: string;
  icon: Icon;
}

const left: TabDef[] = [
  { href: '/', path: '/', label: 'Today', icon: icons.today },
  { href: '/week', path: '/week', label: 'Week', icon: icons.week },
];
const right: TabDef[] = [
  { href: '/groceries', path: '/groceries', label: 'Groceries', icon: icons.groceries },
  { href: '/you', path: '/you', label: 'You', icon: icons.you },
];

/** How far the orb rises above the bar's top edge. */
const orbRise = space.md;

/**
 * Floating tab bar: 64 high, 24 radius, blurred surface, 16 side margins,
 * hairline edge, resting just above the home indicator. The VoiceOrb sits in
 * the middle and rises slightly above the bar.
 *
 * Rendered outside the app blur target (see Blur.tsx) so Android can blur
 * the content behind it.
 */
export function TabBar() {
  const { colors, elevation } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  const go = (tab: TabDef) => {
    if (pathname === tab.path) return;
    haptics.selection();
    router.navigate(tab.href);
  };

  const renderTab = (tab: TabDef) => {
    const active = pathname === tab.path;
    const Glyph = tab.icon;
    return (
      <PressableScale
        key={tab.path}
        onPress={() => go(tab)}
        accessibilityRole="tab"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected: active }}
        style={styles.tab}
      >
        <Glyph
          size={layout.iconSize}
          weight={active ? 'fill' : 'regular'}
          color={active ? colors.sage700 : colors.inkSoft}
        />
        <Text
          variant="caption"
          color={active ? 'sage700' : 'inkSoft'}
          numberOfLines={1}
          maxFontSizeMultiplier={maxFontScaleChrome}
        >
          {tab.label}
        </Text>
      </PressableScale>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: Math.max(insets.bottom, layout.tabBarMargin) }]}
    >
      <View style={[styles.shadow, elevation]}>
        <Frost intensity={50} wash={colors.frost} style={[styles.bar, { borderColor: colors.hairline }]}>
          <View accessibilityRole="tablist" style={styles.row}>
            {left.map(renderTab)}
            <View style={styles.orbSlot} />
            {right.map(renderTab)}
          </View>
        </Frost>
      </View>
      <PressableScale
        onPress={() => router.push('/talk')}
        haptic
        pressedScale={0.94}
        accessibilityRole="button"
        accessibilityLabel="Talk to Tuck"
        accessibilityHint="Opens voice planning. Tell Tuck about your week."
        style={styles.orb}
      >
        <VoiceOrb size={layout.orbTabSize} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: layout.tabBarMargin,
    right: layout.tabBarMargin,
    alignItems: 'center',
  },
  shadow: { alignSelf: 'stretch', borderRadius: radii.tabBar },
  bar: {
    height: layout.tabBarHeight,
    borderRadius: radii.tabBar,
    borderWidth: layout.hairline,
    borderCurve: 'continuous',
  },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.xs },
  tab: {
    flex: 1,
    minHeight: layout.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbSlot: { width: layout.orbTabSize + space.md },
  orb: {
    position: 'absolute',
    top: -orbRise,
    width: layout.orbTabSize,
    height: layout.orbTabSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
