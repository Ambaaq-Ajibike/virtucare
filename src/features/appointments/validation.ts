import type { Appointment, Doctor } from '@/types';
import { getDoctorById } from '@/data/doctors';
import { isPastDate, maxBookableIso, weekdayOf } from '@/lib/date';

export interface BookingInput {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}

/** Field-keyed errors so the form can render them inline. */
export type BookingErrors = Partial<Record<keyof BookingInput, string>>;

export const REASON_MIN = 5;
export const REASON_MAX = 300;

/**
 * Validates a booking against doctor availability, date window, and existing
 * appointments. Returns an empty object when the input is bookable.
 */
export function validateBooking(
  input: BookingInput,
  existing: Appointment[],
): BookingErrors {
  const errors: BookingErrors = {};

  const doctor = getDoctorById(input.doctorId);
  if (!doctor) {
    errors.doctorId = 'Select a doctor.';
  }

  if (!input.date) {
    errors.date = 'Pick a date.';
  } else if (isPastDate(input.date)) {
    errors.date = 'Date is in the past.';
  } else if (input.date > maxBookableIso()) {
    errors.date = 'Date is more than 30 days out.';
  }

  if (!input.time) {
    errors.time = 'Pick a time slot.';
  } else if (doctor && !errors.date) {
    if (!isDoctorAvailable(doctor, input.date, input.time)) {
      errors.time = 'That time is not in the doctor’s schedule.';
    } else if (isSlotTaken(existing, input.doctorId, input.date, input.time)) {
      errors.time = 'That slot is already booked.';
    }
  }

  const reason = input.reason.trim();
  if (reason.length < REASON_MIN) {
    errors.reason = `Add at least ${REASON_MIN} characters of context.`;
  } else if (reason.length > REASON_MAX) {
    errors.reason = `Keep it under ${REASON_MAX} characters.`;
  }

  return errors;
}

export function hasErrors(errors: BookingErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** True if `time` appears in the doctor's template for the weekday of `date`. */
export function isDoctorAvailable(
  doctor: Doctor,
  date: string,
  time: string,
): boolean {
  const dow = weekdayOf(date) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const slots = doctor.availability[dow];
  return Array.isArray(slots) && slots.includes(time);
}

/** True if any existing appointment collides on (doctor, date, time). */
export function isSlotTaken(
  existing: Appointment[],
  doctorId: string,
  date: string,
  time: string,
): boolean {
  return existing.some(
    (a) => a.doctorId === doctorId && a.date === date && a.time === time,
  );
}
