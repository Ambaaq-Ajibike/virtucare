import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatDateLong, formatTime, nextAvailableSlots } from '@/lib/date';
import type { Doctor } from '@/types';
import { DoctorAvatar } from './DoctorAvatar';
import { SpecialtyBadge } from './SpecialtyBadge';

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const slots = nextAvailableSlots(doctor, 3);

  return (
    <Card interactive className="group flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        <DoctorAvatar name={doctor.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl leading-tight text-ink">
            {doctor.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <SpecialtyBadge specialty={doctor.specialty} />
            <span className="text-xs text-ink-muted">
              {doctor.yearsExperience} yrs experience
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        {doctor.bio}
      </p>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
          Next openings
        </p>
        {slots.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">
            No openings in the next two weeks.
          </p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {slots.map((slot) => (
              <li
                key={`${slot.date}-${slot.time}`}
                className="rounded border border-line bg-canvas px-2 py-1 text-xs text-ink"
              >
                <span className="text-ink-muted">
                  {formatDateLong(slot.date)}
                </span>{' '}
                · {formatTime(slot.time)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end border-t border-line pt-4">
        <Link
          href={`/doctors/${doctor.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors duration-150 ease-out hover:text-accent-ink"
        >
          Book appointment
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.75}
          />
        </Link>
      </div>
    </Card>
  );
}
