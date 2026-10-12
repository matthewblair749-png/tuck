import { describe, expect, it } from '@jest/globals';

import { addDays, dayPart, greeting, startOfWeek, weekRangeLabel } from '@/features/plan/dates';

describe('greeting', () => {
  it('uses the part of the day', () => {
    expect(dayPart(new Date(2026, 9, 12, 6, 0))).toBe('morning');
    expect(dayPart(new Date(2026, 9, 12, 13, 0))).toBe('afternoon');
    expect(dayPart(new Date(2026, 9, 12, 19, 0))).toBe('evening');
    expect(dayPart(new Date(2026, 9, 12, 2, 0))).toBe('evening');
  });

  it('includes the name only when there is one', () => {
    const evening = new Date(2026, 9, 12, 19, 0);
    expect(greeting(evening, 'Matt')).toBe('Good evening, Matt.');
    expect(greeting(evening, '  ')).toBe('Good evening.');
    expect(greeting(evening)).toBe('Good evening.');
  });
});

describe('weeks', () => {
  it('starts on Monday', () => {
    // Sunday 12 Oct 2026 belongs to the week of Monday 6 Oct.
    const start = startOfWeek(new Date(2026, 9, 11, 15, 0));
    expect(start.getDay()).toBe(1);
    expect(start.getDate()).toBe(5);
    expect(startOfWeek(new Date(2026, 9, 12, 9, 0)).getDate()).toBe(12);
  });

  it('labels ranges within and across months and years', () => {
    expect(weekRangeLabel(new Date(2026, 9, 12), 'en-US')).toBe('Oct 12 – 18');
    expect(weekRangeLabel(new Date(2026, 9, 26), 'en-US')).toBe('Oct 26 – Nov 1');
    expect(weekRangeLabel(new Date(2026, 11, 28), 'en-US')).toBe('Dec 28, 2026 – Jan 3, 2027');
  });

  it('adds days across DST changes without drifting the hour', () => {
    const d = new Date(2026, 2, 28, 9, 0);
    expect(addDays(d, 2).getHours()).toBe(9);
  });
});
