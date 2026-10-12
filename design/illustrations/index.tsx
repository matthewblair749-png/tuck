import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { useTheme } from '../theme';

/**
 * Hand-built illustrations in the brand palette. Soft organic shapes, no
 * outlines heavier than the icon stroke, always decorative (hidden from
 * screen readers; the empty state's words carry the meaning).
 */

interface IllustrationProps {
  /** Rendered width. Height follows the 4:3 artboard. */
  width?: number;
}

const W = 160;
const H = 120;
const defaultWidth = 160;

function frame(width: number) {
  return { width, height: (width * H) / W, viewBox: `0 0 ${W} ${H}` };
}

/** Decorative wrapper: hidden from VoiceOver and TalkBack. */
function Decorative({ children }: { children: ReactNode }) {
  return <View aria-hidden>{children}</View>;
}

/** A folded blanket, two soft layers and a turned-down corner. */
export function FoldedBlanket({ width = defaultWidth }: IllustrationProps) {
  const { colors } = useTheme();
  return (
    <Decorative>
      <Svg {...frame(width)}>
        <Ellipse cx={80} cy={104} rx={58} ry={7} fill={colors.bgSunken} />
        <Rect x={26} y={50} width={108} height={48} rx={18} fill={colors.sage100} />
        <Path
          d="M30 46c0-9.9 8.1-18 18-18h64c9.9 0 18 8.1 18 18v26c0 9.9-8.1 18-18 18H48c-9.9 0-18-8.1-18-18V46z"
          fill={colors.sage500}
        />
        <Path
          d="M36 62c14 4 30 5 44 5s30-1 44-5"
          stroke={colors.sage600}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
        />
        <Path d="M96 28h16c9.9 0 18 8.1 18 18v8c-10-1-22-6-28-14-3-4-5-8-6-12z" fill={colors.peach400} />
        <Path d="M48 79h40" stroke={colors.peach100} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
      </Svg>
    </Decorative>
  );
}

/** A low bowl with three lazy curls of steam. */
export function SteamingBowl({ width = defaultWidth }: IllustrationProps) {
  const { colors } = useTheme();
  return (
    <Decorative>
      <Svg {...frame(width)}>
        <Ellipse cx={80} cy={106} rx={52} ry={6} fill={colors.bgSunken} />
        <G stroke={colors.sage500} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.7}>
          <Path d="M64 44c-6-6 6-10 0-18" />
          <Path d="M80 40c-7-7 7-12 0-22" />
          <Path d="M96 44c-6-6 6-10 0-18" />
        </G>
        <Path d="M30 62h100c0 23-22 40-50 40S30 85 30 62z" fill={colors.peach400} />
        <Ellipse cx={80} cy={62} rx={50} ry={8} fill={colors.peach100} />
        <Path
          d="M48 74c8 9 20 13 32 13"
          stroke={colors.peach500}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
        />
        <Circle cx={68} cy={60} r={4} fill={colors.sage500} />
        <Circle cx={86} cy={59} r={3} fill={colors.sage600} />
      </Svg>
    </Decorative>
  );
}

/** A sun dozing behind a soft hill. Used for "nothing planned". */
export function SleepingSun({ width = defaultWidth }: IllustrationProps) {
  const { colors } = useTheme();
  return (
    <Decorative>
      <Svg {...frame(width)}>
        <Circle cx={80} cy={70} r={36} fill={colors.peach400} />
        <G stroke={colors.peach500} strokeWidth={2.5} strokeLinecap="round" opacity={0.6}>
          <Path d="M80 22v-8" />
          <Path d="M46 36l-6-6" />
          <Path d="M114 36l6-6" />
        </G>
        <G stroke={colors.sage700} strokeWidth={2} strokeLinecap="round" fill="none">
          <Path d="M66 66c3 3 7 3 10 0" />
          <Path d="M84 66c3 3 7 3 10 0" />
        </G>
        <Path
          d="M14 104c0-10 20-20 46-24 30-5 64-2 84 8 10 5 4 18-8 20-38 6-76 6-110 4-8 0-12-3-12-8z"
          fill={colors.sage100}
        />
        <Path
          d="M30 106c22-8 52-10 80-7 18 2 30 5 26 10-3 3-10 4-20 4H38c-10 0-14-4-8-7z"
          fill={colors.sage500}
          opacity={0.35}
        />
      </Svg>
    </Decorative>
  );
}
