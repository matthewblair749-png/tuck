import { useFonts } from 'expo-font';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { PortalHost } from '@/components/Portal';
import { Text } from '@/components/Text';
import { ToastHost } from '@/components/Toast';
import { FoldedBlanket } from '@/design/illustrations';
import { durations } from '@/design/motion';
import { ThemeProvider, useTheme } from '@/design/theme';
import { layout, space } from '@/design/tokens';
import { fontAssets } from '@/design/typography';

// Hold the native splash until fonts are ready, so text never flashes unstyled.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Already hidden (e.g. a fast refresh in development). Nothing to hold.
});
SplashScreen.setOptions({ fade: true, duration: durations.standard });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const ready = fontsLoaded || fontError != null;

  useEffect(() => {
    if (fontError) {
      // Fonts ship inside the app, so this only happens on a corrupted install.
      // Carry on with system fonts rather than block the user.
      console.error('Tuck fonts failed to load', fontError);
    }
    if (ready) SplashScreen.hide();
  }, [ready, fontError]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppShell() {
  const { colors, scheme } = useTheme();

  // The root view shows during rotations, keyboard transitions and modal
  // presentation. Keep it cream (or deep green-black), never white.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.bg).catch(() => {
      // Cosmetic only; the app's own views already paint the background.
    });
  }, [colors.bg]);

  return (
    <View style={[styles.fill, { backgroundColor: colors.bg }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="talk"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
      <PortalHost />
      <ToastHost />
    </View>
  );
}

/**
 * Last-resort screen for a render error. Kind, specific, and one way forward.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorScreen message={error.message} retry={retry} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ErrorScreen({ message, retry }: { message: string; retry: () => Promise<void> }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.fill, styles.center, { backgroundColor: colors.bg }]}>
      <FoldedBlanket />
      <View style={styles.errorWords}>
        <Text variant="title" align="center" accessibilityRole="header">
          Something got tangled.
        </Text>
        <Text variant="body" color="inkSoft" align="center">
          Your plans are safe. Let’s try that again.
        </Text>
        <Text variant="caption" color="inkSoft" align="center" selectable>
          {message}
        </Text>
      </View>
      <Button label="Try again" onPress={() => void retry()} style={styles.errorAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center', padding: layout.screenPadding, gap: space.xl },
  errorWords: { gap: space.xs, maxWidth: layout.maxContentWidth },
  errorAction: { alignSelf: 'stretch' },
});
