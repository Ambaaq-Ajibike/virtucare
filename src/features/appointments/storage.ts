import type { Appointment } from '@/types';

/**
 * Versioned so we can evolve the Appointment shape without reading back garbage
 * from an older build. Bump the suffix if the shape changes.
 */
const STORAGE_KEY = 'virtucare.appointments.v1';

/** SSR-safe: returns [] on the server and on any read/parse failure. */
export function loadAppointments(): Appointment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Appointment[]) : [];
  } catch {
    return [];
  }
}

export function saveAppointments(appointments: Appointment[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch {
    // Quota exceeded / private mode — nothing actionable at this layer.
  }
}
