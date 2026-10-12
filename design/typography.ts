import type { TextStyle } from 'react-native';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

/**
 * Font families. Each weight is its own family because Android ignores
 * fontWeight on custom fonts. `fontWeight` is never set alongside these.
 *
 * The serif is Fraunces, instanced from the variable font with SOFT 60,
 * WONK 0 and an optical size matched to where it is used (opsz 36 for the
 * 600 display weight, opsz 24 for the 500 title weight). It is renamed
 * "Tuck Serif" as the OFL asks for modified versions. See assets/fonts/OFL.txt.
 */
export const fonts = {
  serifSemiBold: 'TuckSerif-SemiBold',
  serifMedium: 'TuckSerif-Medium',
  sansRegular: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansSemiBold: 'DMSans_600SemiBold',
  sansBold: 'DMSans_700Bold',
} as const;

export const fontAssets = {
  [fonts.serifSemiBold]: require('../assets/fonts/TuckSerif-SemiBold.ttf'),
  [fonts.serifMedium]: require('../assets/fonts/TuckSerif-Medium.ttf'),
  [fonts.sansRegular]: DMSans_400Regular,
  [fonts.sansMedium]: DMSans_500Medium,
  [fonts.sansSemiBold]: DMSans_600SemiBold,
  [fonts.sansBold]: DMSans_700Bold,
};

export type TypeVariant =
  'displayXL' | 'displayL' | 'title' | 'heading' | 'body' | 'bodyStrong' | 'caption' | 'overline' | 'label';

type TypeStyle = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textTransform'
>;

export const type: Record<TypeVariant, TypeStyle> = {
  displayXL: { fontFamily: fonts.serifSemiBold, fontSize: 38, lineHeight: 42, letterSpacing: -0.5 },
  displayL: { fontFamily: fonts.serifSemiBold, fontSize: 30, lineHeight: 34, letterSpacing: -0.3 },
  title: { fontFamily: fonts.serifMedium, fontSize: 22, lineHeight: 28, letterSpacing: 0 },
  heading: { fontFamily: fonts.sansSemiBold, fontSize: 17, lineHeight: 24, letterSpacing: 0 },
  body: { fontFamily: fonts.sansRegular, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  bodyStrong: { fontFamily: fonts.sansSemiBold, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  caption: { fontFamily: fonts.sansMedium, fontSize: 13, lineHeight: 18, letterSpacing: 0.1 },
  overline: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  /** Button and control labels: Heading metrics, tuned for a single line. */
  label: { fontFamily: fonts.sansSemiBold, fontSize: 17, lineHeight: 22, letterSpacing: 0 },
};

/** Spread into styles that show times or counts so digits don't jitter. */
export const tabularNums: Pick<TextStyle, 'fontVariant'> = { fontVariant: ['tabular-nums'] };
