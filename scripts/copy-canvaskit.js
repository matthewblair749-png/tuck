// Copies the CanvasKit WebAssembly binary into public/ so Skia can draw when
// the app is opened in a browser for design review. Native builds ignore it.
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', 'canvaskit-wasm', 'bin', 'full', 'canvaskit.wasm');
const dest = path.join(__dirname, '..', 'public', 'canvaskit.wasm');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
