'use client';

import type { Appointment } from '@/types';
import { AppointmentCard } from './AppointmentCard';

type AppointmentListProps = {
  appointments: Appointment[];
  variant?: 'upcoming' | 'past';
  onCancel?: (appointment: Appointment) => void;
};

export function AppointmentList({
  appointments,
  variant = 'upcoming',
  onCancel,
}: AppointmentListProps) {
  return (
    <ul className="space-y-3">
      {appointments.map((appointment) => (
        <li key={appointment.id}>
          <AppointmentCard
            appointment={appointment}
            variant={variant}
            onCancel={onCancel}
          />
        </li>
      ))}
    </ul>
  );
}
