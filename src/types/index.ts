export type Specialty =
  | 'General Practice'
  | 'Cardiology'
  | 'Dermatology'
  | 'Pediatrics'
  | 'Psychiatry'
  | 'Orthopedics'
  | 'Endocrinology'
  | 'Obstetrics & Gynecology';

/**
 * Weekday-keyed availability template.
 * Key = day of week (0 = Sunday … 6 = Saturday).
 * Value = list of "HH:mm" start times, 24h. Missing key = no availability that day.
 */
export type AvailabilityTemplate = Partial<Record<WeekdayIndex, string[]>>;

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  bio: string;
  yearsExperience: number;
  availability: AvailabilityTemplate;
}

export interface Appointment {
  id: string;
  doctorId: string;
  /** Denormalized so cancellations still render correctly if mock data changes. */
  doctorName: string;
  specialty: Specialty;
  /** Local YYYY-MM-DD. */
  date: string;
  /** Local 24-hour HH:mm. */
  time: string;
  reason: string;
  createdAt: string;
}
