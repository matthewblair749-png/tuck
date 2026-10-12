import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { create } from 'zustand';

import { cardElevation, palettes, type ColorSchemeName, type Elevation, type Palette } from './tokens';

export type AppearancePreference = 'system' | 'light' | 'dark';

interface AppearanceState {
  preference: AppearancePreference;
  setPreference: (preference: AppearancePreference) => void;
}

/**
 * The user's appearance choice. Hydrated from storage on launch by the
 * settings service; kept here so every surface can read it synchronously.
 */
export const useAppearanceStore = create<AppearanceState>((set) => ({
  preference: 'system',
  setPreference: (preference) => set({ preference }),
}));

export interface Theme {
  scheme: ColorSchemeName;
  colors: Palette;
  /** Card shadow for the current scheme. */
  elevation: Elevation;
  /** Lifted card shadow (dragging, rescheduling). */
  elevationLifted: Elevation;
  reduceMotion: boolean;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const preference = useAppearanceStore((s) => s.preference);
  const reduceMotion = useReducedMotion();

  const scheme: ColorSchemeName =
    preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  // Keep native chrome (keyboard, alerts, date pickers) in step with our choice.
  useEffect(() => {
    // Native only: react-native-web has no app-level appearance override.
    if (Platform.OS === 'web') return;
    Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
  }, [preference]);

  const theme = useMemo<Theme>(
    () => ({
      scheme,
      colors: palettes[scheme],
      elevation: cardElevation(scheme),
      elevationLifted: cardElevation(scheme, true),
      reduceMotion,
    }),
    [scheme, reduceMotion],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }
  return theme;
}
