/**
 * Small, pure date helpers for headings. No React, no native imports.
 */

export type DayPart = 'morning' | 'afternoon' | 'evening';

export function dayPart(now: Date): DayPart {
  const h = now.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  return 'evening';
}

/** "Good evening, Matt." or "Good evening." when no name is known. */
export function greeting(now: Date, name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed ? `Good ${dayPart(now)}, ${trimmed}.` : `Good ${dayPart(now)}.`;
}

/** Start of the week (Monday, 00:00 local) containing `date`. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * "Oct 12 – 18", or "Oct 27 – Nov 2" across months, or with years when the
 * range crosses one. Uses the device locale for month names.
 */
export function weekRangeLabel(start: Date, locale?: string): string {
  const end = addDays(start, 6);
  const month = new Intl.DateTimeFormat(locale, { month: 'short' });
  const sameYear = start.getFullYear() === end.getFullYear();
  if (!sameYear) {
    const full = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${full.format(start)} – ${full.format(end)}`;
  }
  if (start.getMonth() === end.getMonth()) {
    return `${month.format(start)} ${start.getDate()} – ${end.getDate()}`;
  }
  return `${month.format(start)} ${start.getDate()} – ${month.format(end)} ${end.getDate()}`;
}
