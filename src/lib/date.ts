import { addDays, format, isBefore, parse, startOfDay } from 'date-fns';
import type { Doctor } from '@/types';

export const ISO_DATE = 'yyyy-MM-dd';

/** Today as a YYYY-MM-DD string in the user's local timezone. */
export function todayIso(): string {
  return format(new Date(), ISO_DATE);
}

/** Max bookable date as a YYYY-MM-DD string (default: 30 days ahead). */
export function maxBookableIso(days = 30): string {
  return format(addDays(new Date(), days), ISO_DATE);
}

/** Parse a YYYY-MM-DD string into a local Date at midnight (no timezone drift). */
export function parseIsoDate(iso: string): Date {
  return parse(iso, ISO_DATE, new Date());
}

/** Returns the weekday (0 = Sunday … 6 = Saturday) for a YYYY-MM-DD string. */
export function weekdayOf(iso: string): number {
  return parseIsoDate(iso).getDay();
}

/** True if the given YYYY-MM-DD is strictly before today (local time). */
export function isPastDate(iso: string): boolean {
  return isBefore(parseIsoDate(iso), startOfDay(new Date()));
}

/** Human-friendly date: "Tue, May 6". */
export function formatDateLong(iso: string): string {
  return format(parseIsoDate(iso), 'EEE, MMM d');
}

/** Human-friendly time: "2:30 PM". Expects "HH:mm" 24h input. */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return format(d, 'h:mm a');
}

/** Combined "Tue, May 6 · 2:30 PM". */
export function formatDateTime(iso: string, hhmm: string): string {
  return `${formatDateLong(iso)} · ${formatTime(hhmm)}`;
}

export interface SlotRef {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

/**
 * Returns the next `count` (date, time) openings from a doctor's weekly
 * availability, starting from today and walking forward up to `horizonDays`.
 */
export function nextAvailableSlots(
  doctor: Doctor,
  count = 3,
  horizonDays = 14,
): SlotRef[] {
  const out: SlotRef[] = [];
  const start = startOfDay(new Date());
  for (let offset = 0; offset < horizonDays && out.length < count; offset++) {
    const day = addDays(start, offset);
    const iso = format(day, ISO_DATE);
    const slots = doctor.availability[day.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6];
    if (!slots) continue;
    for (const time of slots) {
      out.push({ date: iso, time });
      if (out.length >= count) break;
    }
  }
  return out;
}
