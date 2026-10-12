/**
 * Web entry. Tuck ships on iOS and Android; web exists so the design can be
 * reviewed in a browser. Skia draws with CanvasKit (WebAssembly) on web, which
 * must load before any screen module evaluates, so the router entry is
 * required only once CanvasKit is ready.
 */
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

LoadSkiaWeb({ locateFile: (file: string) => `/${file}` })
  .then(() => {
    // A deferred require (not import) so Metro bundles the router but runs it only after CanvasKit loads.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('expo-router/entry');
  })
  .catch((error: unknown) => {
    document.body.textContent = `Tuck couldn’t start its drawing engine: ${String(error)}`;
  });
