import { Easing, ReduceMotion, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';

/**
 * Tuck motion language. Things settle, tuck and glide. Nothing bounces for
 * fun and nothing lingers. All animation values in the app come from here.
 *
 * Every config sets `reduceMotion: ReduceMotion.System` so that when the OS
 * Reduce Motion setting is on, Reanimated jumps straight to the end value.
 * Components that need a fade instead of a jump read `useReducedMotion()`.
 */

export const durations = {
  micro: 120,
  standard: 220,
  emphasized: 380,
  /** Breathing cycle for the resting VoiceOrb (one direction). */
  breath: 2000,
  /** Shimmer sweep on skeletons. */
  shimmer: 1400,
  /** How long a toast stays before it leaves. */
  toast: 2800,
} as const;

/** Stagger between items in the "tuck in" moment. */
export const stagger = 40;

/** cubic-bezier(0.2, 0, 0, 1): fast start, long gentle settle. */
export const easing = Easing.bezier(0.2, 0, 0, 1);
/** Symmetric ease used for breathing and shimmer loops. */
export const easingInOut = Easing.inOut(Easing.sin);

export const springs = {
  /** Component-level spring: thumbs, pills, cards settling. */
  standard: { damping: 18, stiffness: 220, mass: 1, reduceMotion: ReduceMotion.System },
  /** Screen-level spring: sheets, large surfaces. */
  gentle: { damping: 22, stiffness: 160, mass: 1, reduceMotion: ReduceMotion.System },
} satisfies Record<string, WithSpringConfig>;

export const timings = {
  micro: { duration: durations.micro, easing, reduceMotion: ReduceMotion.System },
  standard: { duration: durations.standard, easing, reduceMotion: ReduceMotion.System },
  emphasized: { duration: durations.emphasized, easing, reduceMotion: ReduceMotion.System },
} satisfies Record<string, WithTimingConfig>;

/** Press feedback for anything tappable. */
export const press = {
  scale: 0.98,
  duration: durations.micro,
} as const;

/** Lift used when an item is about to move (reschedule) or is dragged. */
export const lift = {
  scale: 1.02,
} as const;

/** Screen enter: fade with an 8px upward drift. */
export const screenDrift = 8;

/** Resting orb breath: scale 1 to 1.04 over 4s (2s each way). */
export const breath = {
  from: 1,
  to: 1.04,
} as const;
