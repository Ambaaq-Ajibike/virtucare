'use client';

import { useAppointments } from '@/features/appointments/useAppointments';
import { formatTime, weekdayOf } from '@/lib/date';
import { cn } from '@/lib/cn';
import type { Doctor, WeekdayIndex } from '@/types';

type TimeSlotGridProps = {
  doctor: Doctor;
  /** YYYY-MM-DD. Empty string = no date picked yet. */
  date: string;
  value: string;
  onChange: (time: string) => void;
  invalid?: boolean;
};

export function TimeSlotGrid({
  doctor,
  date,
  value,
  onChange,
  invalid,
}: TimeSlotGridProps) {
  const { isSlotBooked, hydrated } = useAppointments();

  if (!date) {
    return (
      <p className="text-sm text-ink-muted">
        Pick a date to see open times.
      </p>
    );
  }

  const dow = weekdayOf(date) as WeekdayIndex;
  const slots = doctor.availability[dow] ?? [];

  if (slots.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        {doctor.name} isn’t seeing patients on that day. Try another date.
      </p>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Available time slots"
      aria-invalid={invalid || undefined}
      className="grid grid-cols-3 gap-2 sm:grid-cols-4"
    >
      {slots.map((time) => {
        const taken = hydrated && isSlotBooked(doctor.id, date, time);
        const selected = value === time;
        return (
          <button
            key={time}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={taken}
            onClick={() => onChange(time)}
            className={cn(
              'h-10 rounded border text-sm transition-colors duration-150 ease-out',
              taken &&
                'cursor-not-allowed border-dashed border-line bg-canvas text-ink-muted/60 line-through',
              !taken && !selected &&
                'border-line bg-surface text-ink hover:border-ink/40',
              !taken && selected &&
                'border-accent bg-accent text-white hover:bg-accent-ink',
            )}
          >
            {formatTime(time)}
          </button>
        );
      })}
    </div>
  );
}
