/**
 * Tuck design tokens. Every color, spacing value, radius, size and shadow used
 * in the app comes from this file. Screens and components never hardcode hex
 * values or magic numbers.
 */

export type ColorSchemeName = 'light' | 'dark';

export type Category = 'meal' | 'laundry' | 'errand' | 'chore' | 'fixed';

export const categories: readonly Category[] = ['meal', 'laundry', 'errand', 'chore', 'fixed'];

export interface CategoryColors {
  /** The category color itself, used for dots and left bars. */
  base: string;
  /** Soft background tint for icon circles and chips. */
  tint: string;
  /** Darker shade for icons and text that sit on the tint (AA on tint). */
  ink: string;
}

export interface Palette {
  bg: string;
  bgSunken: string;
  surface: string;
  surfaceTint: string;
  ink: string;
  inkSoft: string;
  /** Placeholders, disabled labels and decoration only. Below AA for body text. */
  inkFaint: string;
  hairline: string;
  sage500: string;
  sage600: string;
  sage700: string;
  sage100: string;
  peach400: string;
  peach500: string;
  peach100: string;
  /** Text and icons placed on a sage600 or sage500 fill. */
  onAccent: string;
  danger: string;
  /** Danger used as text on surfaces. Tuned for AA. */
  dangerText: string;
  /** Translucent veil behind sheets and the Talk modal. */
  scrim: string;
  /** Shadow color for cards in light mode. Transparent in dark mode. */
  shadow: string;
  /** Moving highlight inside skeleton shimmer. */
  shimmer: string;
  /** Sheet grabber and other quiet affordances. */
  grabber: string;
  /** 1px inner highlight along the top edge of filled buttons. */
  highlight: string;
  /** Warm veil over blur behind the Talk screen: dims without going gray. */
  veil: string;
  /** Wash laid over blur for floating chrome (tab bar). */
  frost: string;
  /** Specular highlight on the VoiceOrb, and its fully clear end stop. */
  orbHighlight: string;
  orbHighlightClear: string;
  category: Record<Category, CategoryColors>;
}

const categoryBase: Record<Category, string> = {
  meal: '#F2A679',
  laundry: '#8FB8CF',
  errand: '#E3C15F',
  chore: '#A99BCF',
  fixed: '#B9C0BA',
};

/** Blend `fg` over `bg` at `alpha`, returning an opaque hex color. */
export function blend(fg: string, bg: string, alpha: number): string {
  const parse = (hex: string) => {
    const h = hex.replace('#', '');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  };
  const f = parse(fg);
  const b = parse(bg);
  const mixed = f.map((v, i) => Math.round(v * alpha + (b[i] ?? 0) * (1 - alpha)));
  return `#${mixed
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

/**
 * Light theme.
 *
 * Note on sage600: the brief specifies #5E7F6A, but cream text on it measures
 * 4.13:1, under WCAG AA for 17pt button labels. It is darkened by 6% to
 * #587764 (4.60:1), which is visually indistinguishable at a glance.
 */
export const light: Palette = {
  bg: '#FAF6EF',
  bgSunken: '#F3EDE2',
  surface: '#FFFFFF',
  surfaceTint: '#FFFDF9',
  ink: '#1F2A24',
  inkSoft: '#5B675F',
  inkFaint: '#8E988F',
  hairline: 'rgba(31,42,36,0.08)',
  sage500: '#7C9A86',
  sage600: '#587764',
  sage700: '#3F5B4B',
  sage100: '#E6EEE8',
  peach400: '#F4B393',
  peach500: '#EE9A73',
  peach100: '#FCEBE1',
  onAccent: '#FAF6EF',
  danger: '#C4584A',
  dangerText: '#B45144',
  scrim: 'rgba(47,38,28,0.22)',
  shadow: 'rgba(31,42,36,0.06)',
  shimmer: 'rgba(255,253,249,0.7)',
  grabber: 'rgba(31,42,36,0.16)',
  highlight: 'rgba(255,255,255,0.28)',
  veil: 'rgba(243,237,226,0.86)',
  frost: 'rgba(255,253,249,0.78)',
  orbHighlight: 'rgba(255,255,255,0.67)',
  orbHighlightClear: 'rgba(255,255,255,0)',
  category: {
    meal: { base: categoryBase.meal, tint: '#FCEADC', ink: '#9A5328' },
    laundry: { base: categoryBase.laundry, tint: '#E4F0F6', ink: '#3F6F8A' },
    errand: { base: categoryBase.errand, tint: '#FAF1D3', ink: '#7A5E0E' },
    chore: { base: categoryBase.chore, tint: '#ECE8F6', ink: '#5F4E96' },
    fixed: { base: categoryBase.fixed, tint: '#F0F2F0', ink: '#5E6862' },
  },
};

const darkSurface = '#1A211D';

/** Dark theme. Category tints are 18% of the category color on surface. */
export const dark: Palette = {
  bg: '#121714',
  bgSunken: '#0E1210',
  surface: darkSurface,
  surfaceTint: '#1E2621',
  ink: '#F2EEE6',
  inkSoft: '#A9B3AB',
  inkFaint: '#6F7A72',
  hairline: 'rgba(242,238,230,0.10)',
  sage500: '#8FB09A',
  sage600: '#A5C4AF',
  sage700: '#CFE2D5',
  sage100: '#25322A',
  peach400: '#F0A582',
  peach500: '#EE9A73',
  peach100: '#3A2A22',
  onAccent: '#121714',
  danger: '#C4584A',
  dangerText: '#E08A7E',
  scrim: 'rgba(8,10,9,0.55)',
  shadow: 'transparent',
  shimmer: 'rgba(242,238,230,0.06)',
  grabber: 'rgba(242,238,230,0.18)',
  highlight: 'rgba(255,255,255,0.35)',
  veil: 'rgba(14,18,16,0.84)',
  frost: 'rgba(30,38,33,0.80)',
  orbHighlight: 'rgba(255,255,255,0.45)',
  orbHighlightClear: 'rgba(255,255,255,0)',
  category: {
    meal: {
      base: categoryBase.meal,
      tint: blend(categoryBase.meal, darkSurface, 0.18),
      ink: categoryBase.meal,
    },
    laundry: {
      base: categoryBase.laundry,
      tint: blend(categoryBase.laundry, darkSurface, 0.18),
      ink: categoryBase.laundry,
    },
    errand: {
      base: categoryBase.errand,
      tint: blend(categoryBase.errand, darkSurface, 0.18),
      ink: categoryBase.errand,
    },
    chore: {
      base: categoryBase.chore,
      tint: blend(categoryBase.chore, darkSurface, 0.18),
      ink: categoryBase.chore,
    },
    fixed: {
      base: categoryBase.fixed,
      tint: blend(categoryBase.fixed, darkSurface, 0.18),
      ink: categoryBase.fixed,
    },
  },
};

export const palettes: Record<ColorSchemeName, Palette> = { light, dark };

/** 4pt grid. Only these values are used for margins, paddings and gaps. */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
} as const;

export const radii = {
  chip: 999,
  button: 16,
  field: 16,
  card: 24,
  sheet: 32,
  widget: 22,
  tabBar: 24,
  /** Small inner radius, e.g. category left bar ends and timeline blocks. */
  inner: 12,
  bar: 2,
} as const;

export const layout = {
  screenPadding: space.lg,
  cardPadding: space.lg,
  cardPaddingCompact: space.md,
  hairlineInset: space.lg,
  hitTarget: 44,
  hairline: 1,
  buttonHeight: 56,
  fieldHeight: 56,
  chipHeight: 36,
  tabBarHeight: 64,
  tabBarMargin: space.md,
  iconSize: 24,
  iconSizeSmall: 20,
  iconSizeTiny: 16,
  categoryCircle: 36,
  categoryBar: 4,
  orbSize: 120,
  orbTabSize: 64,
  toggleWidth: 52,
  toggleHeight: 32,
  segmentHeight: 40,
  grabberWidth: 36,
  grabberHeight: 5,
  dot: 6,
  progressDot: 6,
  progressDotActive: 20,
  /** Max width for readable text blocks on tablets. */
  maxContentWidth: 560,
  /** Width for short centered prompts so they wrap into two calm lines. */
  promptWidth: 240,
} as const;

/** Max font scale honored by text before layouts would break. */
export const maxFontScale = 1.3;
/** Tighter cap for fixed-height chrome like tab labels, which have no room to grow. */
export const maxFontScaleChrome = 1.15;

export interface Elevation {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

/**
 * Card elevation. Light: y 6, blur 24 at rgba(31,42,36,0.06). RN takes blur as
 * shadowRadius (half the CSS blur). Android uses `elevation` which renders
 * a different, darker shadow, so we keep it very low there and lean on the
 * hairline border instead. Dark mode has no shadow at all.
 */
export function cardElevation(scheme: ColorSchemeName, lifted = false): Elevation {
  if (scheme === 'dark') {
    return {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    };
  }
  return {
    shadowColor: '#1F2A24',
    shadowOffset: { width: 0, height: lifted ? 12 : 6 },
    shadowOpacity: lifted ? 0.1 : 0.06,
    shadowRadius: lifted ? 18 : 12,
    elevation: lifted ? 4 : 1,
  };
}
