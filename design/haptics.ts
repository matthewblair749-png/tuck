import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptics vocabulary: light impact on primary taps, a selection tick on day
 * change, success on completion. Nothing on scroll.
 *
 * Android uses View.performHapticFeedback constants (system-tuned, respects
 * the user's touch feedback setting) instead of raw vibrator pulses.
 *
 * Haptics are a nicety: a device without a vibrator rejects the promise, and
 * that must never surface to the user, so failures are swallowed on purpose.
 */
const ignore = () => undefined;

const isAndroid = Platform.OS === 'android';
const isWeb = Platform.OS === 'web';

export const haptics = {
  tap() {
    if (isWeb) return;
    if (isAndroid) {
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click).catch(ignore);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(ignore);
    }
  },
  selection() {
    if (isWeb) return;
    if (isAndroid) {
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick).catch(ignore);
    } else {
      Haptics.selectionAsync().catch(ignore);
    }
  },
  toggle(on: boolean) {
    if (isWeb) return;
    if (isAndroid) {
      Haptics.performAndroidHapticsAsync(
        on ? Haptics.AndroidHaptics.Toggle_On : Haptics.AndroidHaptics.Toggle_Off,
      ).catch(ignore);
    } else {
      Haptics.selectionAsync().catch(ignore);
    }
  },
  success() {
    if (isWeb) return;
    if (isAndroid) {
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm).catch(ignore);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(ignore);
    }
  },
  longPress() {
    if (isWeb) return;
    if (isAndroid) {
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press).catch(ignore);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(ignore);
    }
  },
  /** Swipe crossing its commit threshold. */
  threshold() {
    if (isWeb) return;
    if (isAndroid) {
      Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Gesture_End).catch(ignore);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(ignore);
    }
  },
};
