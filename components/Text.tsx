import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/design/theme';
import { maxFontScale, type Palette } from '@/design/tokens';
import { tabularNums, type as typeScale, type TypeVariant } from '@/design/typography';

type TextColor = Extract<
  keyof Palette,
  'ink' | 'inkSoft' | 'inkFaint' | 'sage600' | 'sage700' | 'onAccent' | 'dangerText'
>;

export interface TextProps extends RNTextProps {
  variant?: TypeVariant;
  color?: TextColor;
  /** Use tabular figures, for times and counts. */
  tabular?: boolean;
  align?: TextStyle['textAlign'];
}

/**
 * The only text primitive in the app. Picks a type style from the scale,
 * a color from the palette, and caps font scaling at 130% so layouts hold.
 */
export function Text({
  variant = 'body',
  color = 'ink',
  tabular = false,
  align,
  style,
  maxFontSizeMultiplier = maxFontScale,
  ...rest
}: TextProps) {
  const { colors } = useTheme();
  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
      style={[
        typeScale[variant],
        { color: colors[color] },
        tabular && tabularNums,
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}
