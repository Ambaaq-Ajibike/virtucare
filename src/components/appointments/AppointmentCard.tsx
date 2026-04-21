'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DoctorAvatar } from '@/components/doctors/DoctorAvatar';
import { SpecialtyBadge } from '@/components/doctors/SpecialtyBadge';
import { formatDateTime } from '@/lib/date';
import { cn } from '@/lib/cn';
import type { Appointment } from '@/types';

type AppointmentCardProps = {
  appointment: Appointment;
  variant?: 'upcoming' | 'past';
  onCancel?: (appointment: Appointment) => void;
};

export function AppointmentCard({
  appointment,
  variant = 'upcoming',
  onCancel,
}: AppointmentCardProps) {
  const isPast = variant === 'past';

  return (
    <Card className={cn('p-5', isPast && 'opacity-75')}>
      <div className="flex items-start gap-4">
        <DoctorAvatar name={appointment.doctorName} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-lg leading-tight text-ink">
                {appointment.doctorName}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <SpecialtyBadge specialty={appointment.specialty} />
              </div>
            </div>
            <p className="whitespace-nowrap text-sm text-ink">
              {formatDateTime(appointment.date, appointment.time)}
            </p>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {appointment.reason}
          </p>

          {!isPast && onCancel && (
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                variant="danger"
                onClick={() => onCancel(appointment)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
