import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  RadialGradient,
  useClock,
  usePathValue,
  vec,
} from '@shopify/react-native-skia';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { breath, durations, easingInOut, springs, timings } from '@/design/motion';
import { useTheme } from '@/design/theme';
import { layout } from '@/design/tokens';

export interface VoiceOrbProps {
  /** Orb diameter. 120 on the Talk screen, smaller in the tab bar. */
  size?: number;
  /** True while the mic is open. Shows the ring waveform. */
  listening?: boolean;
  /** Live mic level, 0 to 1, already smoothed by the producer. */
  level?: SharedValue<number>;
}

/** Canvas is larger than the orb so the glow and ring have room. */
const canvasScale = 1.7;
const ringGap = 14;
const ringPoints = 96;
const lobes = 5;

/**
 * Soft gradient orb (sage500 to peach400) drawn in Skia. At rest it breathes
 * (1 to 1.04 over 4s). While listening it swells with the mic level and a
 * ring waveform ripples around it. When listening ends it contracts softly
 * and settles back into breathing. Reduce Motion: no breathing, no ripple;
 * level is shown only as a gentle ring opacity.
 */
export function VoiceOrb({ size = layout.orbSize, listening = false, level }: VoiceOrbProps) {
  const { colors, reduceMotion } = useTheme();
  const canvas = size * canvasScale;
  const c = canvas / 2;
  const r = size / 2;

  const fallbackLevel = useSharedValue(0);
  const lvl = level ?? fallbackLevel;
  const rest = useSharedValue(1);
  const ring = useSharedValue(0);
  const clock = useClock();
  const wasListening = useRef(listening);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(rest);
      rest.set(1);
      return;
    }
    const breathe = withRepeat(
      withSequence(
        withTiming(breath.to, { duration: durations.breath, easing: easingInOut }),
        withTiming(breath.from, { duration: durations.breath, easing: easingInOut }),
      ),
      -1,
    );
    if (listening) {
      rest.set(withSpring(1, springs.standard));
    } else if (wasListening.current) {
      // Release: a smooth contraction, then back to breathing.
      rest.set(withSequence(withTiming(0.9, timings.standard), withSpring(1, springs.standard), breathe));
    } else {
      rest.set(breathe);
    }
    wasListening.current = listening;
  }, [listening, reduceMotion, rest]);

  useEffect(() => {
    ring.set(withTiming(listening ? 1 : 0, timings.standard));
  }, [listening, ring]);

  const scale = useDerivedValue(() => rest.value * (1 + (reduceMotion ? 0 : lvl.value * 0.1)));
  const orbR = useDerivedValue(() => r * scale.value);
  const glowR = useDerivedValue(() => r * scale.value * 1.08);
  const highlightC = useDerivedValue(() => vec(c - r * 0.35 * scale.value, c - r * 0.45 * scale.value));
  const highlightR = useDerivedValue(() => r * 0.9 * scale.value);
  const ringOpacity = useDerivedValue(() =>
    reduceMotion ? ring.value * (0.25 + lvl.value * 0.5) : ring.value * 0.55,
  );

  const ringPath = usePathValue((builder) => {
    'worklet';
    // Hidden ring: skip the geometry so a resting orb costs almost nothing.
    if (ring.value === 0) return;
    const t = clock.value / 1000;
    const base = r * scale.value + ringGap;
    const amp = reduceMotion ? 0 : (2 + lvl.value * 14) * ring.value;
    for (let i = 0; i <= ringPoints; i++) {
      const a = (i / ringPoints) * Math.PI * 2;
      const wobble = Math.sin(a * lobes + t * 2.2) * 0.6 + Math.sin(a * (lobes + 2) - t * 1.7) * 0.4;
      const rr = base + amp * wobble;
      const x = c + Math.cos(a) * rr;
      const y = c + Math.sin(a) * rr;
      if (i === 0) builder.moveTo(x, y);
      else builder.lineTo(x, y);
    }
    builder.close();
  });

  return (
    <View style={[styles.wrap, { width: size, height: size }]} pointerEvents="none" aria-hidden>
      <Canvas style={{ width: canvas, height: canvas, margin: -(canvas - size) / 2 }}>
        <Circle cx={c} cy={c} r={glowR} color={colors.peach400} opacity={0.35}>
          <BlurMask blur={size * 0.12} style="normal" />
        </Circle>
        <Path path={ringPath} style="stroke" strokeWidth={1.5} color={colors.sage500} opacity={ringOpacity} />
        <Circle cx={c} cy={c} r={orbR}>
          <LinearGradient
            start={vec(c - r, c - r)}
            end={vec(c + r, c + r)}
            colors={[colors.sage500, colors.peach400]}
          />
        </Circle>
        <Group blendMode="softLight">
          <Circle cx={c} cy={c} r={orbR}>
            <RadialGradient
              c={highlightC}
              r={highlightR}
              colors={[colors.orbHighlight, colors.orbHighlightClear]}
            />
          </Circle>
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
