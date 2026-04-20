import type { Doctor } from '@/types';

/**
 * Weekday keys: 0 = Sun, 1 = Mon … 6 = Sat.
 * Times are local 24h "HH:mm" start times for 30-minute consults.
 */
export const doctors: Doctor[] = [
  {
    id: 'amara-okafor',
    name: 'Dr. Amara Okafor',
    specialty: 'General Practice',
    yearsExperience: 11,
    bio: 'Family medicine with a focus on preventive care and chronic condition management. Sees patients of all ages.',
    availability: {
      1: ['09:00', '09:30', '10:00', '11:00', '14:00', '14:30', '15:00'],
      2: ['09:00', '10:30', '11:00', '13:30', '14:00', '16:00'],
      3: ['08:30', '09:00', '11:30', '13:00', '15:30'],
      4: ['09:00', '10:00', '10:30', '14:00', '15:00', '16:30'],
      5: ['08:30', '09:30', '10:00'],
    },
  },
  {
    id: 'julian-reyes',
    name: 'Dr. Julian Reyes',
    specialty: 'Cardiology',
    yearsExperience: 18,
    bio: 'Interventional cardiologist. Focus on arrhythmia management, hypertension, and post-op cardiac follow-up.',
    availability: {
      1: ['10:00', '11:00', '13:00', '14:00', '15:00'],
      3: ['09:00', '10:00', '11:00', '14:30', '15:30'],
      5: ['09:00', '10:30', '13:00', '14:00'],
    },
  },
  {
    id: 'priya-sharma',
    name: 'Dr. Priya Sharma',
    specialty: 'Dermatology',
    yearsExperience: 9,
    bio: 'Medical and cosmetic dermatology. Skin screenings, acne, eczema, and minor in-office procedures.',
    availability: {
      2: ['09:30', '10:00', '10:30', '11:00', '13:30', '14:00', '15:00'],
      3: ['09:00', '09:30', '13:00', '14:30', '16:00'],
      4: ['10:00', '11:00', '13:30', '14:00', '15:30'],
      6: ['09:00', '09:30', '10:00', '10:30'],
    },
  },
  {
    id: 'noah-lindqvist',
    name: 'Dr. Noah Lindqvist',
    specialty: 'Pediatrics',
    yearsExperience: 14,
    bio: 'Pediatrics for newborns through adolescents. Well-child visits, vaccinations, and developmental screenings.',
    availability: {
      1: ['08:30', '09:00', '09:30', '10:00', '14:00', '14:30'],
      2: ['08:30', '09:30', '10:30', '13:30', '15:00'],
      4: ['08:30', '09:00', '09:30', '14:00', '15:00', '15:30'],
      5: ['08:30', '09:00', '10:00', '10:30'],
    },
  },
  {
    id: 'yuki-tanaka',
    name: 'Dr. Yuki Tanaka',
    specialty: 'Psychiatry',
    yearsExperience: 12,
    bio: 'Adult psychiatry with a focus on anxiety, depression, and ADHD. Medication management and brief therapy.',
    availability: {
      1: ['11:00', '12:00', '14:00', '15:00', '16:00'],
      2: ['11:00', '13:00', '14:00', '15:00'],
      3: ['11:00', '12:00', '14:00', '15:00', '16:00'],
      4: ['13:00', '14:00', '15:00', '16:00'],
    },
  },
  {
    id: 'marcus-hale',
    name: 'Dr. Marcus Hale',
    specialty: 'Orthopedics',
    yearsExperience: 21,
    bio: 'Sports medicine and joint care. Post-injury rehab planning, knee and shoulder consults.',
    availability: {
      2: ['09:00', '09:30', '10:30', '11:00', '14:00'],
      4: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      6: ['09:30', '10:00', '10:30', '11:00'],
    },
  },
  {
    id: 'ines-caldeira',
    name: 'Dr. Inês Caldeira',
    specialty: 'Endocrinology',
    yearsExperience: 16,
    bio: 'Diabetes, thyroid, and hormonal health. Long-term management and lab review.',
    availability: {
      1: ['13:00', '13:30', '14:00', '15:30'],
      3: ['09:00', '09:30', '13:00', '14:00', '15:00'],
      5: ['09:00', '10:00', '11:00', '13:30'],
    },
  },
  {
    id: 'harper-nguyen',
    name: 'Dr. Harper Nguyen',
    specialty: 'Obstetrics & Gynecology',
    yearsExperience: 10,
    bio: 'Routine OB/GYN care, prenatal visits, and women’s health screenings in a warm, unhurried setting.',
    availability: {
      1: ['09:00', '10:00', '11:00', '13:00', '14:00'],
      2: ['09:30', '10:30', '13:30', '14:30', '15:30'],
      4: ['09:00', '10:00', '11:00', '13:30', '14:30'],
      5: ['09:00', '09:30', '10:00'],
    },
  },
];

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}
