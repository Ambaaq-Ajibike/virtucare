'use client';

import { useId, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { useAppointments } from '@/features/appointments/useAppointments';
import { formatDateTime } from '@/lib/date';
import {
  REASON_MAX,
  REASON_MIN,
  validateBooking,
  type BookingErrors,
} from '@/features/appointments/validation';
import type { Doctor } from '@/types';
import { DatePicker } from './DatePicker';
import { TimeSlotGrid } from './TimeSlotGrid';

type FormState = {
  date: string;
  time: string;
  reason: string;
};

const EMPTY: FormState = { date: '', time: '', reason: '' };

export function BookingForm({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const toast = useToast();
  const { appointments, book, hydrated } = useAppointments();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [attempted, setAttempted] = useState(false);
  const [raceError, setRaceError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reasonId = useId();
  const dateErrId = useId();
  const timeErrId = useId();
  const reasonErrId = useId();

  const errors = useMemo<BookingErrors>(
    () =>
      validateBooking(
        { doctorId: doctor.id, ...form },
        appointments,
      ),
    [doctor.id, form, appointments],
  );

  const showErrors = attempted;

  const reasonLen = form.reason.trim().length;
  const reasonCounterTone =
    reasonLen > REASON_MAX
      ? 'text-danger'
      : reasonLen < REASON_MIN
        ? 'text-ink-muted'
        : 'text-ink-muted';

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      // Changing the date can invalidate the selected time.
      if (key === 'date') next.time = '';
      return next;
    });
    setRaceError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    setRaceError(null);

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const created = book({
      doctorId: doctor.id,
      date: form.date,
      time: form.time,
      reason: form.reason,
    });

    if (!created) {
      setSubmitting(false);
      setRaceError(
        'That slot was just booked. Pick another time.',
      );
      return;
    }

    toast.success(
      `Booked with ${doctor.name} · ${formatDateTime(created.date, created.time)}`,
    );
    router.push('/appointments');
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <div>
        <DatePicker
          value={form.date}
          onChange={(v) => update('date', v)}
          invalid={showErrors && !!errors.date}
          describedBy={showErrors && errors.date ? dateErrId : undefined}
        />
        {showErrors && errors.date && (
          <p id={dateErrId} className="mt-1.5 text-xs text-danger">
            {errors.date}
          </p>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-ink">Time</p>
        <div className="mt-2">
          <TimeSlotGrid
            doctor={doctor}
            date={form.date}
            value={form.time}
            onChange={(v) => update('time', v)}
            invalid={showErrors && !!errors.time}
          />
        </div>
        {showErrors && errors.time && (
          <p id={timeErrId} className="mt-2 text-xs text-danger">
            {errors.time}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={reasonId}
            className="block text-sm font-medium text-ink"
          >
            Reason for visit
          </label>
          <span className={`text-xs tabular-nums ${reasonCounterTone}`}>
            {reasonLen}/{REASON_MAX}
          </span>
        </div>
        <Textarea
          id={reasonId}
          value={form.reason}
          onChange={(e) => update('reason', e.target.value)}
          placeholder="A few words about what you’d like to discuss."
          rows={4}
          maxLength={REASON_MAX + 50}
          invalid={showErrors && !!errors.reason}
          aria-describedby={showErrors && errors.reason ? reasonErrId : undefined}
          className="mt-1.5"
        />
        {showErrors && errors.reason && (
          <p id={reasonErrId} className="mt-1.5 text-xs text-danger">
            {errors.reason}
          </p>
        )}
      </div>

      {raceError && (
        <p
          role="alert"
          className="rounded border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
        >
          {raceError}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={!hydrated || submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? 'Booking…' : 'Confirm appointment'}
        </Button>
        <p className="text-xs text-ink-muted">
          You’ll be able to cancel any time from your dashboard.
        </p>
      </div>
    </form>
  );
}
