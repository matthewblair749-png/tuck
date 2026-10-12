import { describe, expect, it } from '@jest/globals';

import { palettes, type Palette } from '@/design/tokens';

/** WCAG 2.x relative luminance and contrast ratio, for opaque hex colors. */
function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const AA = 4.5;

describe.each(['light', 'dark'] as const)('%s palette meets WCAG AA for text', (scheme) => {
  const c: Palette = palettes[scheme];
  const surfaces = { bg: c.bg, bgSunken: c.bgSunken, surface: c.surface, surfaceTint: c.surfaceTint };

  it.each(Object.entries(surfaces))('ink and inkSoft on %s', (_, surface) => {
    expect(contrast(c.ink, surface)).toBeGreaterThanOrEqual(AA);
    expect(contrast(c.inkSoft, surface)).toBeGreaterThanOrEqual(AA);
  });

  it('sage700 labels on surfaces and on sage100', () => {
    for (const s of [c.bg, c.surface, c.surfaceTint, c.sage100]) {
      expect(contrast(c.sage700, s)).toBeGreaterThanOrEqual(AA);
    }
  });

  it('button label on the primary fill', () => {
    expect(contrast(c.onAccent, c.sage600)).toBeGreaterThanOrEqual(AA);
  });

  it('disabled primary label on its quiet fill', () => {
    // Disabled controls are exempt from AA, but we still keep them legible.
    expect(contrast(c.sage600, c.sage100)).toBeGreaterThanOrEqual(3);
  });

  it('danger text on surfaces', () => {
    expect(contrast(c.dangerText, c.surface)).toBeGreaterThanOrEqual(AA);
    expect(contrast(c.dangerText, c.bg)).toBeGreaterThanOrEqual(AA);
  });

  it.each(['meal', 'laundry', 'errand', 'chore', 'fixed'] as const)('%s icon ink on its tint', (cat) => {
    const { ink, tint } = c.category[cat];
    // Icons are non-text UI (3:1), but they double as the only non-color signal, so hold them to 4.5.
    expect(contrast(ink, tint)).toBeGreaterThanOrEqual(AA);
    // Chip labels sit on the tint in ink.
    expect(contrast(c.ink, tint)).toBeGreaterThanOrEqual(AA);
  });
});
