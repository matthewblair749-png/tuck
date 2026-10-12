# Tuck

> Say your week. Tuck it in.

Tuck turns one spoken note about your week into a calm plan for meals, laundry,
errands and chores, scheduled around your real calendar. It's built in React
Native with Expo (development builds, not Expo Go), TypeScript strict, for iOS
and Android from one codebase.

This README grows with each build stage. **Current stage: 1 of 9** (design
system, base components, navigation shell).

## Requirements

- Node 22+
- Xcode 16+ for iOS builds, or Android Studio with SDK 35+ for Android
- An [Expo account](https://expo.dev) for EAS cloud builds (optional for local builds)

## Setup

```bash
npm install          # also applies patches/ and copies CanvasKit for web review
npx expo run:ios     # builds and installs a development build on a simulator or device
npx expo run:android # same for an Android emulator or device
npm start            # Metro for an already-installed development build
```

Tuck uses native modules (Skia, Reanimated, Blur, and later Calendar, Speech,
SQLite) that Expo Go doesn't include, so you always run a development build.

## EAS builds

```bash
npx eas-cli@latest login
npx eas-cli@latest init                                  # links the project, writes projectId
npx eas-cli@latest build --profile development --platform ios
npx eas-cli@latest build --profile development --platform android
npx eas-cli@latest build --profile development-simulator --platform ios   # simulator .app
npx eas-cli@latest build --profile production --platform all
```

Change `ios.bundleIdentifier` and `android.package` in `app.json`
(`app.tuck.mobile`) to identifiers you own before your first store build.

## Checks

```bash
npm run typecheck   # tsc, strict, zero errors
npm run lint        # ESLint + Prettier; inline hex colors are lint errors outside design/
npm test            # Jest
```

## Project structure

```
app/          routes (expo-router): (tabs)/ Today, Week, Groceries, You · talk · dev/gallery
design/       tokens (color, spacing, radii, elevation), typography, motion, haptics,
              theme provider, icon registry, SVG illustrations
components/   every reusable UI piece: Text, Button, Card, Chip, Toggle, SegmentedControl,
              TextField, Sheet, Toast, Skeleton, VoiceOrb, TabBar, EmptyState, Group/Row, …
features/     feature logic (plan/dates for now)
services/     calendar, planner, voice, llm, notifications, storage (stages 2–7)
widgets/      native widgets (stage 8)
proxy/        LLM backend proxy (stage 4)
__tests__/    Jest tests; fixtures live only here
```

## Design system notes

- **Fonts.** DM Sans comes from `@expo-google-fonts/dm-sans`. The serif is
  Fraunces, instanced from the official variable font with SOFT 60, WONK 0 and
  optical size 36 (600) / 24 (500) to get the soft, optical-size look. The npm
  static files are SOFT 0. The instances are renamed "Tuck Serif" as the SIL OFL
  requires for modified fonts (`assets/fonts/OFL.txt`). The splash holds until
  fonts load.
- **Contrast.** `__tests__/contrast.test.ts` checks every text/surface pairing
  against WCAG AA in both themes. Following it, three spec colors were adjusted:
  - Light `sage600` #5E7F6A → **#587764**. Cream labels on the primary button
    were 4.13:1; now 4.60:1.
  - Danger text uses **#B45144**. Spec #C4584A is 4.34:1 on white and is kept
    for fills only.
  - Meal icon ink is **#9A5328** (4.93:1 on its tint).

  `inkFaint` (2.77:1) is only used for placeholders and decoration. Selected
  WeekStrip pills will use the adjusted sage600 rather than sage500, because
  cream on sage500 is 2.86:1.
- **Blur on Android.** expo-blur blurs on Android by sampling a
  `BlurTargetView`. App content lives in one shared target, and every blurred
  surface (tab bar, sheet backdrops, Talk) renders as its sibling. That's why
  sheets use an in-tree portal rather than a `Modal`. Devices below Android 12
  get a translucent palette wash instead of live blur.
- **Haptics.** On Android Tuck uses system haptic constants
  (`performHapticFeedback`), which respect the user's touch-feedback setting.
  On iOS it uses UIKit feedback generators.
- **Reduce Motion.** Every animation config sets `ReduceMotion.System`. The
  orb stops breathing, sheets fade instead of sliding, and screens fade without
  the drift.

## Web (design review only)

Tuck isn't shipped on web. `npm run web` exists so screens can be reviewed in a
browser. `index.web.ts` loads Skia's CanvasKit before the router starts.
